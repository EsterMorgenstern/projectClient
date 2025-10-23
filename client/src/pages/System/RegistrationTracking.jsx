import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserPermission } from '../../utils/permissions';
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
  TablePagination,
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
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Redux selectors
  const registrationTrackingNotes = useSelector(selectRegistrationTrackingNotes);
  const notesLoading = useSelector(selectStudentNotesLoading);
const currentUser = useSelector(state => state.user?.currentUser || state.users?.currentUser || null);

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
      // שמור רק הערת "מעקב רישום" אחת (הכי חדשה) לכל תלמיד
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
      if (note.noteType === 'מעקב רישום') {
        if (!studentData.registrationNotes.length || new Date(note.updatedDate || note.createdDate) > new Date(studentData.registrationNotes[0].updatedDate || studentData.registrationNotes[0].createdDate)) {
          studentData.registrationNotes[0] = note;
        }
      }
      // אפשר להוסיף הערות אחרות אם צריך
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
    // חיפוש חכם לפי שם תלמיד, נרשם על ידי, וקוד תלמיד
    const term = searchTerm.trim().toLowerCase();
    let matchesSearch = false;
    if (!term) {
      matchesSearch = true;
    } else {
      // שם פרטי/משפחה
      if (student.firstName?.toLowerCase().includes(term) || student.lastName?.toLowerCase().includes(term)) {
        matchesSearch = true;
      }
      // קוד תלמיד
      if (student.id?.toString().includes(term)) {
        matchesSearch = true;
      }
      // נרשם על ידי
      if (student.registrationNotes && student.registrationNotes.length > 0) {
        const authorName = student.registrationNotes[0].authorName?.toLowerCase() || '';
        if (authorName.includes(term)) {
          matchesSearch = true;
        }
      }
      // אימייל
      if (student.email?.toLowerCase().includes(term)) {
        matchesSearch = true;
      }
    }
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'pending' && student.incompleteTasks.length > 0) ||
      (filterStatus === 'completed' && student.incompleteTasks.length === 0);
    return matchesSearch && matchesFilter;
  });

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated data
  const paginatedStudents = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredStudents.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredStudents, page, rowsPerPage]);

  // Reset page when search changes
  React.useEffect(() => {
    setPage(0);
  }, [searchTerm]);

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
  if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setAlert({ open: true, message: msg, severity }))) {
    setSaving(false);
    return;
  }
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

  // פונקציה שמחשבת כמה תלמידים רשמה כל אחת
  const getAuthorCounts = (students) => {
    const counts = {};
    students.forEach(student => {
      const author = student.registrationNotes && student.registrationNotes.length > 0 && student.registrationNotes[0].authorName
        ? student.registrationNotes[0].authorName
        : 'לא ידוע';
      counts[author] = (counts[author] || 0) + 1;
    });
    return counts;
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
    ><Box sx={{ 
        background: 'linear-gradient(to right, #e0f2fe, #f8fafc)',
          minHeight: '100vh',
          borderRadius: 8,
        py: 4
      }}>
      <Box sx={{ p: 3, direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
        <Box sx={{ mb: 6 }}>
        
          <Typography
            variant={"h3"}
            sx={{
              fontWeight: 'bold',
              color: '#1E3A8A',
              mb: 1,
              fontFamily: 'Heebo, sans-serif',
              textAlign: 'center',
            }}
          >
מעקב רישום          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#334155',
              textAlign: 'center',
              mb: 3,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
      ניהול רישום התלמידים במערכת    
      </Typography>
          
      </Box>
  {/* סטטיסטיקות רישום - עיצוב אלגנטי ומתקדם */}
  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
    <Grid container spacing={4} sx={{ maxWidth: '1200px' }}>
      <Grid item xs={12} md={3}>
        <Card sx={{ 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 50%, #fca5a5 100%)', 
          borderRadius: '20px', 
          boxShadow: '0 10px 30px rgba(220, 38, 38, 0.15)', 
          transition: 'all 0.3s ease',
          border: '1px solid rgba(220, 38, 38, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': { 
            transform: 'translateY(-8px)', 
            boxShadow: '0 20px 40px rgba(220, 38, 38, 0.25)',
            '& .stat-icon': { transform: 'scale(1.1) rotate(5deg)' },
            '& .stat-number': { transform: 'scale(1.05)' }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #dc2626, #ef4444)'
          }
        }}>
          <CardContent sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <Box className="stat-icon" sx={{ 
                fontSize: 40, 
                transition: 'transform 0.3s ease',
                filter: 'drop-shadow(0 4px 8px rgba(220, 38, 38, 0.3))'
              }}>❌</Box>
              <Typography className="stat-number" variant="h3" sx={{ 
                color: '#dc2626', 
                fontWeight: 800,
                fontSize: '2.5rem',
                transition: 'transform 0.3s ease',
                textShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
              }}>
                {studentsWithRegistrationNotes.filter(s => s.incompleteTasks.length > 0).length}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#7f1d1d', 
                fontWeight: 600,
                fontSize: '0.95rem',
                textAlign: 'center'
              }}>
                תלמידים עם משימות חסרות
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card sx={{ 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)', 
          borderRadius: '20px', 
          boxShadow: '0 10px 30px rgba(22, 163, 74, 0.15)', 
          transition: 'all 0.3s ease',
          border: '1px solid rgba(22, 163, 74, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': { 
            transform: 'translateY(-8px)', 
            boxShadow: '0 20px 40px rgba(22, 163, 74, 0.25)',
            '& .stat-icon': { transform: 'scale(1.1) rotate(-5deg)' },
            '& .stat-number': { transform: 'scale(1.05)' }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #16a34a, #22c55e)'
          }
        }}>
          <CardContent sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <Box className="stat-icon" sx={{ 
                fontSize: 40, 
                transition: 'transform 0.3s ease',
                filter: 'drop-shadow(0 4px 8px rgba(22, 163, 74, 0.3))'
              }}>✅</Box>
              <Typography className="stat-number" variant="h3" sx={{ 
                color: '#16a34a', 
                fontWeight: 800,
                fontSize: '2.5rem',
                transition: 'transform 0.3s ease',
                textShadow: '0 2px 4px rgba(22, 163, 74, 0.2)'
              }}>
                {studentsWithRegistrationNotes.filter(s => s.incompleteTasks.length === 0).length}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#15803d', 
                fontWeight: 600,
                fontSize: '0.95rem',
                textAlign: 'center'
              }}>
                תלמידים שהושלמו
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card sx={{ 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fdba74 100%)', 
          borderRadius: '20px', 
          boxShadow: '0 10px 30px rgba(217, 119, 6, 0.15)', 
          transition: 'all 0.3s ease',
          border: '1px solid rgba(217, 119, 6, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': { 
            transform: 'translateY(-8px)', 
            boxShadow: '0 20px 40px rgba(217, 119, 6, 0.25)',
            '& .stat-icon': { transform: 'scale(1.1) rotate(10deg)' },
            '& .stat-number': { transform: 'scale(1.05)' }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #d97706, #f59e0b)'
          }
        }}>
          <CardContent sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <Box className="stat-icon" sx={{ 
                fontSize: 40, 
                transition: 'transform 0.3s ease',
                filter: 'drop-shadow(0 4px 8px rgba(217, 119, 6, 0.3))'
              }}>🔥</Box>
              <Typography className="stat-number" variant="h3" sx={{ 
                color: '#d97706', 
                fontWeight: 800,
                fontSize: '2.5rem',
                transition: 'transform 0.3s ease',
                textShadow: '0 2px 4px rgba(217, 119, 6, 0.2)'
              }}>
                {studentsWithRegistrationNotes.filter(s => s.priority === 'גבוהה').length}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#92400e', 
                fontWeight: 600,
                fontSize: '0.95rem',
                textAlign: 'center'
              }}>
                עדיפות גבוהה
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card sx={{ 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)', 
          borderRadius: '20px', 
          boxShadow: '0 10px 30px rgba(71, 85, 105, 0.15)', 
          transition: 'all 0.3s ease',
          border: '1px solid rgba(71, 85, 105, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': { 
            transform: 'translateY(-8px)', 
            boxShadow: '0 20px 40px rgba(71, 85, 105, 0.25)',
            '& .stat-icon': { transform: 'scale(1.1) rotate(-10deg)' },
            '& .stat-number': { transform: 'scale(1.05)' }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #475569, #64748b)'
          }
        }}>
          <CardContent sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <Box className="stat-icon" sx={{ 
                fontSize: 40, 
                transition: 'transform 0.3s ease',
                filter: 'drop-shadow(0 4px 8px rgba(71, 85, 105, 0.3))'
              }}>📊</Box>
              <Typography className="stat-number" variant="h3" sx={{ 
                color: '#475569', 
                fontWeight: 800,
                fontSize: '2.5rem',
                transition: 'transform 0.3s ease',
                textShadow: '0 2px 4px rgba(71, 85, 105, 0.2)'
              }}>
                {studentsWithRegistrationNotes.length}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#64748b', 
                fontWeight: 600,
                fontSize: '0.95rem',
                textAlign: 'center'
              }}>
                סה"כ במעקב
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
        
        {/* אזור חיפוש מעוצב */}
        <Box sx={{ 
          mb: 4, 
          p: 4,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%)',
          borderRadius: '54px',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          direction: 'rtl',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)'
          }
        }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <TextField
              label="  🔍 חפש תלמיד, קוד תלמיד, או שם רושם"
              variant="filled"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              size="large"
              sx={{ 
                flex: 1,
                minWidth: 400, 
                maxWidth: 700,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  bgcolor: 'white',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.12)',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '1.1rem',
                  '&:hover': {
                    boxShadow: '0 12px 35px rgba(59, 130, 246, 0.18)',
                    transform: 'translateY(-2px)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 15px 45px rgba(59, 130, 246, 0.25)',
                    transform: 'translateY(-3px)',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: '#64748b',
                  right: 14,
                  left: 'auto',
                  transformOrigin: 'top right',
                  '&.Mui-focused, &.MuiFormLabel-filled': {
                    // right: 14,
                    // left: 'auto'
                  }
                },
                '& .MuiOutlinedInput-input': {
                  direction: 'rtl',
                  textAlign: 'right',
                  fontSize: '1.1rem',
                  py: 2
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    {/* <SearchIcon sx={{ 
                      color: '#3b82f6', 
                      fontSize: '1.5rem',
                      filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
                    }} /> */}
                  </InputAdornment>
                )
              }}
            />
            
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadRegistrationTrackingData}
              sx={{
                borderRadius: '20px',
                px: 4,
                py: 2,
                fontSize: '1.0rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                border: 'none',
                transition: 'all 0.3s ease',
                minWidth: 160,
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                  boxShadow: '0 12px 35px rgba(59, 130, 246, 0.4)',
                  transform: 'translateY(-3px)',
                },
                '&:active': {
                  transform: 'translateY(-1px)',
                }
              }}
            >
              רענן נתונים
            </Button>
          </Box>
        </Box>

        {/* מונה תלמידים */}
      <Box sx={{ 
      mb: 2, 
      p: 2, 
      bgcolor: '#e1eefbff', 
      borderRadius: 2, 
      border: '1px solid #d7e4f6ff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      direction: 'rtl'
    }}>
      <Typography variant="h6" sx={{ 
        color: '#1e40af', 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        📊
        סה"כ תלמידים בטבלה: {filteredStudents.length}
      </Typography>
      
      <Typography variant="body2" sx={{ 
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <InfoIcon sx={{ fontSize: 16 }} />
        מציג {paginatedStudents.length} מתוך {filteredStudents.length} תלמידים
      </Typography>
    </Box>

        {/* טבלה מעוצבת */}
        <Paper 
          sx={{ 
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            direction: 'rtl'
          }}
        >
          <TableContainer>
            <Table sx={{ direction: 'rtl' }}>
              <TableHead 
                sx={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  '& .MuiTableCell-head': {
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    py: 1,
                    borderBottom: 'none'
                  }
                }}
              >
                <TableRow>
                  <TableCell sx={{ textAlign: 'center', direction: 'rtl' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                      <Box sx={{ fontSize: '1.4em', mb: 0.2 }}>📊</Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                        סטטוס
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', direction: 'rtl' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                      <Box sx={{ fontSize: '1.4em', mb: 0.2 }}>👤</Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                        נרשם על ידי
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', direction: 'rtl' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                      <Box sx={{ fontSize: '1.4em', mb: 0.2 }}>🎓</Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                        תלמיד
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', direction: 'rtl', width: '250px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                      <Box sx={{ fontSize: '1.4em', mb: 0.2 }}>📋</Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                        משימות חסרות
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', direction: 'rtl' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                      <Box sx={{ fontSize: '1.4em', mb: 0.2 }}>⚡</Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                        עדיפות
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', direction: 'rtl' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                      <Box sx={{ fontSize: '1.4em', mb: 0.2 }}>📅</Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                        תאריך עדכון
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', direction: 'rtl' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                      <Box sx={{ fontSize: '1.4em', mb: 0.2 }}>🎯</Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                        פעולות
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.map((student, index) => (
                  <TableRow 
                    key={student.id || index} 
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'rgba(59, 130, 246, 0.04)',
                        transform: 'scale(1.005)',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)'
                      },
                      '&:nth-of-type(even)': {
                        bgcolor: 'rgba(248, 250, 252, 0.5)'
                      },
                      direction: 'rtl',
                      borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
                    }}
                  >
                    <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Tooltip title={
                          student.incompleteTasks.length === 0 
                            ? 'כל המשימות הושלמו' 
                            : `${student.incompleteTasks.length} משימות חסרות`
                        }>
                          <Box sx={{
                            p: 0.5,
                            borderRadius: '50%',
                            bgcolor: student.incompleteTasks.length === 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getStatusIcon(student.incompleteTasks)}
                          </Box>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {student.registrationNotes && student.registrationNotes.length > 0 && student.registrationNotes[0].authorName ? (
                          <>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 600,
                              color: '#1e293b',
                              textAlign: 'center'
                            }}>
                              {student.registrationNotes[0].authorName}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: '#64748b',
                              textAlign: 'center'
                            }}>
                              {student.registrationNotes[0].authorRole || 'רושם'}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" sx={{ 
                            textAlign: 'center', 
                            color: '#94a3b8',
                            fontStyle: 'italic'
                          }}>
                            לא ידוע
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ 
                          fontWeight: 700,
                          color: '#1e293b',
                          textAlign: 'center',
                          mb: 0.1
                        }}>
                          {student.firstName} {student.lastName}
                        </Typography>
                        <Chip
                          label={`קוד תלמיד: ${student.id}`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(59, 130, 246, 0.1)',
                            color: '#3b82f6',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            fontFamily: 'monospace'
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 0.5, width: '250px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <Badge 
                          badgeContent={student.incompleteTasks.length} 
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              bgcolor: student.incompleteTasks.length === 0 ? '#10b981' : '#ef4444',
                              color: 'white',
                              fontWeight: 'bold'
                            }
                          }}
                        >
                          <AssignmentIcon sx={{ 
                            color: student.incompleteTasks.length === 0 ? '#10b981' : '#ef4444',
                            fontSize: '1.5rem'
                          }} />
                        </Badge>
                        {student.incompleteTasks.length > 0 && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, alignItems: 'center' }}>
                            {student.incompleteTasks.slice(0, 2).map((task, i) => (
                              <Chip
                                key={i}
                                label={task}
                                size="small"
                                sx={{ 
                                  bgcolor: '#fef2f2', 
                                  color: '#dc2626', 
                                  fontSize: '0.7rem',
                                  maxWidth: '120px',
                                  '& .MuiChip-label': {
                                    px: 0.5
                                  }
                                }}
                              />
                            ))}
                            {student.incompleteTasks.length > 2 && (
                              <Typography variant="caption" sx={{ 
                                color: '#64748b',
                                textAlign: 'center',
                                fontWeight: 500
                              }}>
                                +{student.incompleteTasks.length - 2} נוספות
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                      <Chip
                        label={student.priority}
                        size="medium"
                        sx={{
                          bgcolor: `${getPriorityColor(student.priority)}15`,
                          color: getPriorityColor(student.priority),
                          fontWeight: 700,
                          borderRadius: '12px',
                          px: 2,
                          '&:hover': {
                            bgcolor: `${getPriorityColor(student.priority)}25`,
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 600,
                          color: '#1e293b',
                          textAlign: 'center'
                        }}>
                          {student.lastNoteDate ? student.lastNoteDate.toLocaleDateString('he-IL') : 'לא זמין'}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: '#64748b',
                          textAlign: 'center'
                        }}>
                          עדכון אחרון
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => handleViewDetails(student)}
                        sx={{ 
                          borderRadius: '12px',
                          px: 1.5,
                          py: 0.5,
                          bgcolor: '#3b82f6',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                          '&:hover': {
                            bgcolor: '#1d4ed8',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        עדכן משימות
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {filteredStudents.length > 0 && (
            <TablePagination
              component="div"
              count={filteredStudents.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              labelRowsPerPage="שורות בעמוד:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} מתוך ${count !== -1 ? count : `יותר מ-${to}`}`
              }
              sx={{
                direction: 'rtl',
                '& .MuiTablePagination-toolbar': {
                  direction: 'rtl',
                  paddingLeft: 2,
                  paddingRight: 2
                },
                '& .MuiTablePagination-selectLabel': {
                  margin: 0
                },
                '& .MuiTablePagination-displayedRows': {
                  margin: 0
                },
                '& .MuiTablePagination-select': {
                  textAlign: 'right'
                },
                '& .MuiTablePagination-actions': {
                  marginLeft: 0,
                  marginRight: 20
                }
              }}
            />
          )}
          
          {filteredStudents.length === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '0 0 20px 20px'
            }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '50%',
                p: 3,
                mb: 3,
                display: 'inline-flex',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
              }}>
                <SearchIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>
              <Typography variant="h5" sx={{ 
                color: '#1e293b',
                fontWeight: 'bold',
                mb: 1
              }}>
                לא נמצאו תלמידים
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#64748b',
                mb: 3
              }}>
                {searchTerm ? `לא נמצאו תלמידים המתאימים לחיפוש "${searchTerm}"` : 'לא נמצאו תלמידים במעקב רישום'}
              </Typography>
              {searchTerm && (
                <Button
                  variant="outlined"
                  onClick={() => setSearchTerm('')}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': {
                      bgcolor: 'rgba(59, 130, 246, 0.1)',
                      borderColor: '#1d4ed8'
                    }
                  }}
                >
                  נקה חיפוש
                </Button>
              )}
            </Box>
          )}
        </Paper>        <Dialog
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
      </Box>  </Box>
    </motion.div>
  );
};

export default RegistrationTracking;
