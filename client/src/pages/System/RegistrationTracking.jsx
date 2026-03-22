import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StyledTableShell from '../../components/StyledTableShell';
import StatsCard from '../../components/StatsCard';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getStudentNotesByRegistrationTracking } from '../../store/studentNotes/studentNotesGetByRegistrationTracking';
import { selectRegistrationTrackingNotes, selectStudentNotesLoading } from '../../store/studentNotes/studentNoteSlice';
import { fetchStudents } from '../../store/student/studentGetAllThunk';
import { updateStudentNote } from '../../store/studentNotes/studentNoteUpdateThunk';
import { getgroupStudentByStudentId } from '../../store/groupStudent/groupStudentGetByStudentIdThunk';
import StudentCoursesDialog from '../Students/components/studentCoursesDialog';
import { checkUserPermission } from '../../utils/permissions';

const RegistrationTracking = () => {
  const dispatch = useDispatch();
  
  // משימות רישום קבועות
  const registrationTasks = [
    'אמצעי תשלום מולא',
    'מדריך עודכן',
    'הוכנס ל-GIS',
    'הוסבר על התחייבות/הפניה'
  ];
  
  // States
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTask, setFilterTask] = useState('all');
  const [studentsData, setStudentsData] = useState({});
  const [saving, setSaving] = useState(false);
  const [editNotesMode, setEditNotesMode] = useState(false);
  const [editedTasks, setEditedTasks] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  
  // Student details dialog states
  const [studentDetailsDialogOpen, setStudentDetailsDialogOpen] = useState(false);
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [loadingStudentCourses, setLoadingStudentCourses] = useState(false);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Sorting states
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

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
        let clean = line.replace('❌', '').trim();
        // Remove emoji at start if exists (old data)
        clean = clean.replace(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[^\w\s])+/u, '').trim();
        // Try to match to registrationTasks by inclusion
        const matched = registrationTasks.find(task => clean.includes(task) || task.includes(clean));
        if (matched && !tasks.includes(matched)) {
          tasks.push(matched);
        } else if (!matched && clean && !tasks.includes(clean)) {
          // fallback: push clean if not matched
          tasks.push(clean);
        }
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

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort data function
  const sortData = (data, field, direction) => {
    if (!field) return data;
    
    return [...data].sort((a, b) => {
      let aValue, bValue;
      
      switch (field) {
        case 'studentName':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'authorName':
          aValue = (a.registrationNotes?.[0]?.authorName || 'לא ידוע').toLowerCase();
          bValue = (b.registrationNotes?.[0]?.authorName || 'לא ידוע').toLowerCase();
          break;
        case 'status':
          aValue = a.incompleteTasks.length;
          bValue = b.incompleteTasks.length;
          break;
        case 'priority':
          const priorityOrder = { 'גבוהה': 3, 'בינוני': 2, 'נמוכה': 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'updateDate':
          aValue = a.lastNoteDate ? new Date(a.lastNoteDate) : new Date(0);
          bValue = b.lastNoteDate ? new Date(b.lastNoteDate) : new Date(0);
          break;
        case 'incompleteTasks':
          aValue = a.incompleteTasks.length;
          bValue = b.incompleteTasks.length;
          break;
        case 'studentId':
          aValue = parseInt(a.id) || 0;
          bValue = parseInt(b.id) || 0;
          break;
        default:
          return 0;
      }
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  const filteredStudents = React.useMemo(() => {
    let filtered = studentsWithRegistrationNotes.filter(student => {
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

      // סינון לפי משימת רישום
      const matchesTask =
        typeof filterTask === 'undefined' || filterTask === 'all' || student.incompleteTasks.includes(filterTask);

      return matchesSearch && matchesFilter && matchesTask;
    });
    // Apply sorting
    return sortData(filtered, sortField, sortDirection);
  }, [studentsWithRegistrationNotes, searchTerm, filterStatus, filterTask, sortField, sortDirection]);

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

  const handleOpenStudentDetails = async (student) => {
    try {
      // נצטרך לוודא שהתלמיד מכיל את כל הנתונים הנחוצים
      const fullStudentData = studentsData[student.id] || student;
      
      // נוסיף נתונים חסרים אם לא קיימים
      const studentForDialog = {
        ...fullStudentData,
        firstName: fullStudentData.firstName || student.firstName,
        lastName: fullStudentData.lastName || student.lastName,
        id: fullStudentData.id || student.id,
        email: fullStudentData.email || student.email || '',
        phone: fullStudentData.phone || student.phone || '',
        city: fullStudentData.city || student.city || '',
        age: fullStudentData.age || student.age || '',
      };
      
      setSelectedStudentForDetails(studentForDialog);
      
      // פתיחת הדיאלוג מיד - ללא המתנה לטעינת הקורסים
      setStudentDetailsDialogOpen(true);
      
      // איפוס קורסים קודמים ותחילת טעינה חדשה ברקע
      setStudentCourses([]);
      setLoadingStudentCourses(true);
      
      // טעינת קורסי התלמיד ברקע
      try {
        const coursesResult = await dispatch(getgroupStudentByStudentId(student.id));
        if (coursesResult.payload) {
          setStudentCourses(Array.isArray(coursesResult.payload) ? coursesResult.payload : []);
        } else {
          setStudentCourses([]);
        }
      } catch (coursesError) {
        console.error('שגיאה בטעינת קורסי התלמיד:', coursesError);
        setStudentCourses([]);
      } finally {
        setLoadingStudentCourses(false);
      }
      
    } catch (error) {
      console.error('שגיאה בפתיחת פרטי התלמיד:', error);
    }
  };

  const handleCloseStudentDetails = () => {
    setStudentDetailsDialogOpen(false);
    setSelectedStudentForDetails(null);
    setStudentCourses([]);
    setLoadingStudentCourses(false);
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
  {/* סטטיסטיקות רישום */}
  <Box sx={{ 
    display: 'grid',
    gridTemplateColumns: { xs: 'repeat(1, minmax(0, 1fr))', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
    gap: 1,
    mt: 3,
    mb: 3.4,
    width: '75%',
    mx: 'auto'
  }}>
    <StatsCard
      label="משימות חסרות"
      value={studentsWithRegistrationNotes.filter(s => s.incompleteTasks.length > 0).length}
      note="תלמידים שנדרשים"
      bg="linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)"
      icon={ErrorIcon}
      iconBg="rgba(220, 38, 38, 0.12)"
      numberAlign="center"
    />
    <StatsCard
      label="הושלמו"
      value={studentsWithRegistrationNotes.filter(s => s.incompleteTasks.length === 0).length}
      note="תלמידים מוכנים"
      bg="linear-gradient(135deg, #ecfdf3 0%, #dcfce7 100%)"
      icon={CheckCircleIcon}
      iconBg="rgba(34, 197, 94, 0.12)"
      numberAlign="center"
    />
    <StatsCard
      label="עדיפות גבוהה"
      value={studentsWithRegistrationNotes.filter(s => s.priority === 'גבוהה').length}
      note="דורשים טיפול מיידי"
      bg="linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)"
      icon={TrendingUpIcon}
      iconBg="rgba(245, 158, 11, 0.12)"
      numberAlign="center"
    />
    <StatsCard
      label='סה"כ במעקב'
      value={studentsWithRegistrationNotes.length}
      note="כל התלמידים"
       bg="linear-gradient(135deg, #ffe8f9c4 0%, #ffd5f256 100%)"
          icon={AssessmentIcon}
          iconBg="rgba(242, 58, 227, 0.12)"
      numberAlign="center"
    />
  </Box>
        <br/>
        {/* אזור חיפוש עדין ומקצועי */}
        <Box sx={{ 
          mb: 4, 
          direction: 'rtl'
        }}>
         
           

            {/* אזור החיפוש והכפתורים */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              justifyContent: 'center'
            }}>
              {/* שדה החיפוש */}
              <TextField
                label="🔍 חפש תלמיד, קוד תלמיד, או שם רושם"
                variant="outlined"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                size="medium"
                sx={{ 
                  flex: 1,
                  minWidth: 350, 
                  maxWidth: 550,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#fafafa',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      bgcolor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      borderColor: '#3b82f6',
                      bgcolor: '#ffffff',
                      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#64748b',
                    right: 20,
                    left: 'auto',
                    transformOrigin: 'top right',
                    zIndex: 1,
                    backgroundColor: 'transparent',
                    '&.Mui-focused, &.MuiFormLabel-filled': {
                      color: '#3b82f6',
                      right: 25,
                      backgroundColor: '#ffffff',
                      px: 1,
                      transform: 'translate(0, -9px) scale(0.75)',
                      transformOrigin: 'top right'
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    direction: 'rtl',
                    textAlign: 'right',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    pr: 2
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    textAlign: 'right',
                    '& legend': {
                      textAlign: 'right',
                      marginRight: '10px'
                    }
                  }
                }}
              />
              
              {/* סינון לפי משימת רישום */}

              <Box sx={{ minWidth: 180 }}>
                <FormControl fullWidth size="small" sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                  '& .MuiInputLabel-root': {
                    borderRadius: '10px',
                  }
                }}>
                  <InputLabel id="filter-task-label">סנן לפי משימת רישום</InputLabel>
                  <Select
                    labelId="filter-task-label"
                    id="filter-task-select"
                    value={filterTask}
                    label="סנן לפי משימת רישום"
                    onChange={e => setFilterTask(e.target.value)}
                  >
                    <MenuItem value="all" sx={{ direction: 'rtl', textAlign: 'right' }}>הכל</MenuItem>
                    {registrationTasks.map(task => (
                      <MenuItem key={task} value={task} sx={{ direction: 'rtl', textAlign: 'right' }}>{task}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* כפתור רענון */}
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={loadRegistrationTrackingData}
                sx={{
                 
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  bgcolor: '#3b82f6',
                  color: 'white',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease',
                  minWidth: 140,
                  '&:hover': {
                    bgcolor: '#2563eb',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  }
                }}
              >
                רענן נתונים
              </Button>
              
              {/* כפתור איפוס מיון */}
              {sortField && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSortField('');
                    setSortDirection('asc');
                  }}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.5,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    borderColor: '#d1d5db',
                    color: '#6b7280',
                    bgcolor: 'transparent',
                    transition: 'all 0.2s ease',
                    minWidth: 140,
                    '&:hover': {
                      borderColor: '#9ca3af',
                      bgcolor: '#f9fafb',
                      color: '#374151',
                    }
                  }}
                >
                  🔄 איפוס מיון
                </Button>
              )}
            </Box>

            {/* מחוון תוצאות חיפוש */}
            {searchTerm && (
              <Box sx={{ 
                mt: 3, 
                textAlign: 'center',
                p: 2,
                bgcolor: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #e0f2fe'
              }}>
                <Typography variant="body2" sx={{ 
                  color: '#0369a1',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}>
                  מחפש: "{searchTerm}"
                  <Button
                    size="small"
                    onClick={() => setSearchTerm('')}
                    sx={{ 
                      color: '#0369a1', 
                      minWidth: 'auto',
                      p: 0.5,
                      ml: 1,
                      fontSize: '0.8rem'
                    }}
                  >
                    ✕ נקה
                  </Button>
                </Typography>
              </Box>
            )}
        
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
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="body2" sx={{ 
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <InfoIcon sx={{ fontSize: 16 }} />
          מציג {paginatedStudents.length} מתוך {filteredStudents.length} תלמידים
        </Typography>
        {sortField && (
          <Typography variant="caption" sx={{ 
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontWeight: 500
          }}>
            🔄 ממוין לפי: {
              sortField === 'studentName' ? 'שם תלמיד' :
              sortField === 'authorName' ? 'נרשם על ידי' :
              sortField === 'status' ? 'סטטוס' :
              sortField === 'priority' ? 'עדיפות' :
              sortField === 'updateDate' ? 'תאריך עדכון' :
              sortField === 'incompleteTasks' ? 'משימות חסרות' :
              sortField
            } ({sortDirection === 'asc' ? 'עולה' : 'יורד'})
          </Typography>
        )}
      </Box>
    </Box>

        {/* טבלה מעוצבת */}
        <StyledTableShell
          enableSort={true}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          enableHorizontalScroll={true}
          headers={[
            { label: 'סטטוס', field: 'status', align: 'center' },
            { label: 'נרשם על ידי', field: 'authorName', align: 'center', sx: { minWidth: '150px' } },
            { label: 'תלמיד', field: 'studentName', align: 'center' },
            { label: 'משימות חסרות', field: 'incompleteTasks', align: 'center', sx: { width: '250px' } },
            { label: 'עדיפות', field: 'priority', align: 'center' },
            { label: 'תאריך עדכון', field: 'updateDate', align: 'center', sx: { minWidth: '140px' } },
            { label: 'פעולות', align: 'center', sortable: false }
          ]}
        >
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
                        <Tooltip 
                          title="לחץ לצפייה בפרטי התלמיד 👆"
                          placement="top"
                          arrow
                          sx={{
                            '& .MuiTooltip-tooltip': {
                              bgcolor: '#3b82f6',
                              color: 'white',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                            },
                            '& .MuiTooltip-arrow': {
                              color: '#3b82f6'
                            }
                          }}
                        >
                          <Typography 
                            variant="body1" 
                            onClick={() => handleOpenStudentDetails(student)}
                            sx={{ 
                              fontWeight: 700,
                              color: '#1e293b',
                              textAlign: 'center',
                              mb: 0.1,
                              cursor: 'pointer',
                              '&:hover': {
                                color: '#3b82f6',
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            {student.firstName} {student.lastName}
                          </Typography>
                        </Tooltip>
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
        </StyledTableShell>
          
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
        </Box>
          
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

        {/* Student Details Dialog */}
        {selectedStudentForDetails && (
          <StudentCoursesDialog
            open={studentDetailsDialogOpen}
            onClose={handleCloseStudentDetails}
            student={selectedStudentForDetails}
            studentCourses={studentCourses}
            loadingCourses={loadingStudentCourses}
            showAddButton={false}
            title={`פרטי התלמיד: ${selectedStudentForDetails.firstName} ${selectedStudentForDetails.lastName}`}
            subtitle={`ת"ז: ${selectedStudentForDetails.id}${selectedStudentForDetails.email ? ` | 📧 ${selectedStudentForDetails.email}` : ''}`}
          />
        )}

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
