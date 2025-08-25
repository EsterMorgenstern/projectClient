import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Badge,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getStudentNotesByRegistrationTracking } from '../../store/studentNotes/studentNotesGetByRegistrationTracking';
import { selectRegistrationTrackingNotes, selectStudentNotesLoading } from '../../store/studentNotes/studentNoteSlice';
import { fetchStudents } from '../../store/student/studentGetAllThunk';
import { updateStudentNote } from '../../store/studentNotes/studentNoteUpdateThunk';

const RegistrationTracking = () => {
  const dispatch = useDispatch();
  
  // משימות רישום קבועות
  const registrationTasks = [
    '💳 אמצעי תשלום מולא',
    '👨‍🏫 מדריך עודכן',
    '📱 הוכנס ל-GIS',
    '📋 הוסבר על התחייבות/הפניה'
  ];
  
  // States
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [studentsData, setStudentsData] = useState({});
  const [saving, setSaving] = useState(false);
  const [editNotesMode, setEditNotesMode] = useState(false);
  const [editedTasks, setEditedTasks] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  // Redux selectors
  const registrationTrackingNotes = useSelector(selectRegistrationTrackingNotes);
  const notesLoading = useSelector(selectStudentNotesLoading);

  // Load data
  useEffect(() => {
    loadRegistrationTrackingData();
  }, []);

  const loadRegistrationTrackingData = async () => {
    setLoading(true);
    try {
      const studentsResult = await dispatch(fetchStudents({ page: 1, pageSize: 1000 }));
      if (studentsResult.payload && studentsResult.payload.students) {
        const studentsMap = {};
        studentsResult.payload.students.forEach(student => {
          studentsMap[student.id] = student;
        });
        setStudentsData(studentsMap);
        console.log('נתוני תלמידים נטענו:', studentsMap);
      }
      await dispatch(getStudentNotesByRegistrationTracking());
    } catch (error) {
      console.error('שגיאה בטעינת נתוני מעקב רישום:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseIncompleteTasks = (noteContent) => {
    const tasks = [];
    const lines = noteContent.split('\n');
    for (const line of lines) {
      if (line.includes('❌')) {
        const taskName = line.replace('❌', '').trim();
        tasks.push(taskName);
      }
    }
    return tasks;
  };

  const studentsWithRegistrationNotes = React.useMemo(() => {
    if (!registrationTrackingNotes || registrationTrackingNotes.length === 0) {
      return [];
    }

    const studentNotesMap = new Map();
    
    registrationTrackingNotes.forEach(note => {
      const studentId = note.studentId;
      const studentInfo = studentsData[studentId] || { 
        id: studentId, 
        firstName: 'לא ידוע', 
        lastName: 'לא ידוע',
        email: null
      };
      
      if (!studentNotesMap.has(studentId)) {
        studentNotesMap.set(studentId, {
          ...studentInfo,
          registrationNotes: [],
          incompleteTasks: [],
          lastNoteDate: null,
          priority: 'בינוני'
        });
      }
      
      const studentData = studentNotesMap.get(studentId);
      studentData.registrationNotes.push(note);
      
      const tasks = parseIncompleteTasks(note.noteContent);
      studentData.incompleteTasks = [...new Set([...studentData.incompleteTasks, ...tasks])];
      
      const noteDate = new Date(note.createdDate || note.updatedDate);
      if (!studentData.lastNoteDate || noteDate > studentData.lastNoteDate) {
        studentData.lastNoteDate = noteDate;
      }
      
      if (note.priority) {
        studentData.priority = note.priority;
      }
    });

    return Array.from(studentNotesMap.values());
  }, [registrationTrackingNotes, studentsData]);

  const filteredStudents = studentsWithRegistrationNotes.filter(student => {
    const matchesSearch = 
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id?.toString().includes(searchTerm);
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'pending' && student.incompleteTasks.length > 0) ||
      (filterStatus === 'completed' && student.incompleteTasks.length === 0);
    
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = async (student) => {
    setSelectedStudent(student);
    setDetailsDialogOpen(true);
  };

  const handleEditNotesMode = () => {
    const initialTasks = {};
    registrationTasks.forEach(task => {
      initialTasks[task] = !selectedStudent.incompleteTasks.includes(task);
    });
    setEditedTasks(initialTasks);
    setEditNotesMode(true);
  };

  const handleCancelNotesEdit = () => {
    setEditNotesMode(false);
    setEditedTasks({});
  };

  const handleTaskToggle = (task) => {
    setEditedTasks(prev => ({
      ...prev,
      [task]: !prev[task]
    }));
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const currentDate = new Date().toLocaleDateString('he-IL');
      let noteContent = `🔴 משימות שטרם הושלמו (עודכן ב-${currentDate}):\n`;
      
      const incompleteTasks = [];
      registrationTasks.forEach(task => {
        if (!editedTasks[task]) {
          incompleteTasks.push(task);
          noteContent += `❌ ${task}\n`;
        }
      });

      if (incompleteTasks.length === 0) {
        noteContent = `✅ כל משימות הרישום הושלמו בהצלחה! (עודכן ב-${currentDate})`;
      }

      const noteToUpdate = selectedStudent.registrationNotes[0];
      const updatedNote = {
        ...noteToUpdate,
        noteContent: noteContent,
        updatedDate: new Date().toISOString()
      };

      const result = await dispatch(updateStudentNote(updatedNote));
      
      if (result.type === 'studentNotes/updateStudentNote/fulfilled') {
        await loadRegistrationTrackingData();
        setEditNotesMode(false);
        handleCloseDialog();
        setAlert({ open: true, message: 'משימות הרישום עודכנו בהצלחה', severity: 'success' });
      } else {
        throw new Error('Failed to update note');
      }
    } catch (error) {
      console.error('שגיאה בעדכון משימות הרישום:', error);
      setAlert({ open: true, message: 'שגיאה בעדכון משימות הרישום', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setDetailsDialogOpen(false);
    setEditNotesMode(false);
    setSelectedStudent(null);
    setEditedTasks({});
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'גבוהה': return '#ef4444';
      case 'בינוני': return '#f59e0b';
      case 'נמוכה': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (incompleteTasks) => {
    if (incompleteTasks.length === 0) {
      return <CheckCircleIcon sx={{ color: '#10b981' }} />;
    } else if (incompleteTasks.length <= 2) {
      return <InfoIcon sx={{ color: '#f59e0b' }} />;
    } else {
      return <ErrorIcon sx={{ color: '#ef4444' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>...טוען נתוני מעקב רישום</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3, direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 2 }}>
            📋 מעקב רישום תלמידים
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            צפייה ומעקב אחר משימות רישום שטרם הושלמו
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
              <CardContent>
                <Typography variant="h3" sx={{ color: '#dc2626', fontWeight: 'bold' }}>
                  {studentsWithRegistrationNotes.filter(s => s.incompleteTasks.length > 0).length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#7f1d1d' }}>
                  תלמידים עם משימות חסרות
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <CardContent>
                <Typography variant="h3" sx={{ color: '#16a34a', fontWeight: 'bold' }}>
                  {studentsWithRegistrationNotes.filter(s => s.incompleteTasks.length === 0).length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#15803d' }}>
                  תלמידים שהושלמו
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: '#fffbeb', border: '1px solid #fed7aa' }}>
              <CardContent>
                <Typography variant="h3" sx={{ color: '#d97706', fontWeight: 'bold' }}>
                  {studentsWithRegistrationNotes.filter(s => s.priority === 'גבוהה').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#92400e' }}>
                  עדיפות גבוהה
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Typography variant="h3" sx={{ color: '#475569', fontWeight: 'bold' }}>
                  {studentsWithRegistrationNotes.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  סה"כ במעקב
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mb: 3, direction: 'rtl' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="...חפש לפי שם, מייל או תעודת זהות"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ 
                    direction: 'rtl',
                    '& .MuiInputBase-input': { textAlign: 'right' }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="סינון לפי סטטוס"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{ 
                    direction: 'rtl',
                    '& .MuiInputBase-input': { textAlign: 'right' }
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="all">כל התלמידים</option>
                  <option value="pending">משימות חסרות</option>
                  <option value="completed">הושלם</option>
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadRegistrationTrackingData}
                  sx={{ direction: 'ltr' }}
                >
                  רענן
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ direction: 'rtl' }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table sx={{ direction: 'rtl' }}>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>סטטוס</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>תלמיד</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>מייל</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>משימות חסרות</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>עדיפות</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>תאריך עדכון</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', direction: 'rtl' }}>פעולות</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filteredStudents.map((student, index) => (
                      <motion.tr
                        key={student.id || index}
                        component={TableRow}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        sx={{ '&:hover': { bgcolor: '#f8fafc' }, direction: 'rtl' }}
                      >
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Tooltip title={
                            student.incompleteTasks.length === 0 
                              ? 'כל המשימות הושלמו' 
                              : `${student.incompleteTasks.length} משימות חסרות`
                          }>
                            {getStatusIcon(student.incompleteTasks)}
                          </Tooltip>
                        </TableCell>
                        
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'right' }}>
                              {student.firstName} {student.lastName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                              ת.ז: {student.id}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ textAlign: 'right' }}>
                          {student.email && student.email.trim() ? (
                            <Tooltip title={`שלח מייל ל-${student.email}`}>
                              <Box 
                                component="a"
                                href={`mailto:${student.email}`}
                                sx={{ 
                                  color: '#1976d2', 
                                  textDecoration: 'none',
                                  '&:hover': { textDecoration: 'underline' },
                                  fontSize: '0.85rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  justifyContent: 'flex-end'
                                }}
                              >
                                📧 {student.email}
                              </Box>
                            </Tooltip>
                          ) : null}
                        </TableCell>
                        
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Box>
                            <Badge badgeContent={student.incompleteTasks.length} color="error">
                              <AssignmentIcon />
                            </Badge>
                            {student.incompleteTasks.length > 0 && (
                              <Box sx={{ mt: 1, textAlign: 'right' }}>
                                {student.incompleteTasks.slice(0, 2).map((task, i) => (
                                  <Chip
                                    key={i}
                                    label={task}
                                    size="small"
                                    sx={{ 
                                      mr: 0.5, 
                                      mb: 0.5, 
                                      bgcolor: '#fef2f2', 
                                      color: '#dc2626',
                                      fontSize: '0.75rem'
                                    }}
                                  />
                                ))}
                                {student.incompleteTasks.length > 2 && (
                                  <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                                    +{student.incompleteTasks.length - 2} נוספות
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Chip
                            label={student.priority}
                            size="small"
                            sx={{
                              bgcolor: `${getPriorityColor(student.priority)}20`,
                              color: getPriorityColor(student.priority),
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ textAlign: 'right' }}>
                            {student.lastNoteDate ? student.lastNoteDate.toLocaleDateString('he-IL') : 'לא זמין'}
                          </Typography>
                        </TableCell>
                        
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => handleViewDetails(student)}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            עדכן משימות
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
            
            {filteredStudents.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  לא נמצאו תלמידים בהתאם לחיפוש
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Dialog
          open={detailsDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '16px', direction: 'rtl' }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#3b82f6', color: 'white', textAlign: 'right' }}>
            <Typography variant="h6">
              פרטי משימות - {selectedStudent?.firstName} {selectedStudent?.lastName}
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            {selectedStudent && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    כאן תוכל לראות את פרטי המשימות של התלמיד
                  </Alert>
                </Grid>
                
                <Grid item xs={12}>
                  <Card sx={{ width: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIcon />
                        משימות רישום ({selectedStudent.incompleteTasks.length})
                      </Typography>
                      
                      {editNotesMode ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            סמן משימות שהושלמו:
                          </Typography>
                          
                          {registrationTasks.map((task, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <input
                                type="checkbox"
                                checked={editedTasks[task] || false}
                                onChange={() => handleTaskToggle(task)}
                                style={{ transform: 'scale(1.2)' }}
                              />
                              <Typography variant="body2" sx={{ 
                                textDecoration: editedTasks[task] ? 'line-through' : 'none',
                                color: editedTasks[task] ? 'text.secondary' : 'text.primary'
                              }}>
                                {task}
                              </Typography>
                            </Box>
                          ))}
                          
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                            <Button 
                              onClick={handleCancelNotesEdit}
                              disabled={saving}
                              size="small"
                            >
                              ביטול
                            </Button>
                            <Button 
                              onClick={handleSaveNotes}
                              disabled={saving}
                              variant="contained"
                              size="small"
                              sx={{ bgcolor: '#10b981' }}
                              startIcon={saving ? <CircularProgress size={16} /> : null}
                            >
                              {saving ? '...שומר' : 'שמור עדכון'}
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <>
                          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                            תלמיד: {selectedStudent.firstName} {selectedStudent.lastName} (ת.ז: {selectedStudent.id})
                          </Typography>
                          
                          {selectedStudent.incompleteTasks.length > 0 ? (
                            <>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                משימות שטרם הושלמו:
                              </Typography>
                              <List dense>
                                {selectedStudent.incompleteTasks.map((task, index) => (
                                  <ListItem key={index}>
                                    <ListItemIcon>
                                      <ErrorIcon sx={{ color: '#ef4444' }} />
                                    </ListItemIcon>
                                    <ListItemText primary={task} />
                                  </ListItem>
                                ))}
                              </List>
                            </>
                          ) : (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                              <CheckCircleIcon sx={{ color: '#10b981', fontSize: 48, mb: 1 }} />
                              <Typography variant="body1" sx={{ color: '#10b981' }}>
                                כל המשימות הושלמו!
                              </Typography>
                            </Box>
                          )}

                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={handleEditNotesMode}
                              startIcon={<EditIcon />}
                              sx={{ fontSize: '0.75rem' }}
                            >
                              עדכן משימות
                            </Button>
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 2, direction: 'rtl' }}>
            <Button onClick={handleCloseDialog}>
              סגור
            </Button>
          </DialogActions>
        </Dialog>

        {/* Alert for notifications */}
        {alert.open && (
          <Alert 
            severity={alert.severity} 
            onClose={() => setAlert({ ...alert, open: false })}
            sx={{ 
              position: 'fixed', 
              top: 20, 
              right: 20, 
              zIndex: 9999,
              direction: 'rtl'
            }}
          >
            {alert.message}
          </Alert>
        )}
      </Box>
    </motion.div>
  );
};

export default RegistrationTracking;
