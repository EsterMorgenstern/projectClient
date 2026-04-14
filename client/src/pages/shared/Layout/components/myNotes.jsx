import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container, Box, Typography, Paper, Card, CardContent, CardHeader,
  IconButton, Button, Chip, Avatar, Divider, Grid, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem,
  ListItemText, ListItemIcon, ListItemSecondaryAction,
  useMediaQuery, useTheme, CircularProgress, Alert, Snackbar,
  InputAdornment, Tooltip, Menu, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import {
  StickyNote2, Edit, Delete, Search, FilterList,
  Person, School, CalendarToday, MoreVert, Close,
  Visibility, VisibilityOff, BookmarkBorder, Bookmark,
  // ✅ הוסף אייקונים נוספים
  Info as InfoIcon, CheckCircle as CheckCircleIcon,
  Error as ErrorIcon, Warning as WarningIcon, Notes as NotesIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

// Import Redux actions
import { getNotesByUserId } from '../../../../store/studentNotes/studentNotesGetByUserId'
import { updateStudentNote } from '../../../../store/studentNotes/studentNoteUpdateThunk';
import { deleteStudentNote } from '../../../../store/studentNotes/studentNoteDeleteThunk';
import { clearNotes } from '../../../../store/studentNotes/studentNoteSlice';
// ✅ הוסף import לקבלת רשימת תלמידים
import { fetchStudents } from '../../../../store/student/studentGetAllThunk';

// ✅ Import הדיאלוג המוכן
import AddStudentNoteDialog from '../../../Students/components/addStudentNoteDialog';
import { selectUserData } from '../../../../store/user/userSlice';
import { checkUserPermission } from '../../../../utils/permissions';

const MyNotes = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // ✅ Redux state - תיקון לפי userSlice.js
  const { notesByUser, loading, error } = useSelector(state => state.studentNotes);
  
  // ✅ קבלת המשתמש הנוכחי - לפי המבנה שלך
const { userById, currentUser } = useSelector(selectUserData);  
const currentUserI = userById || currentUser;

  // ✅ הוסף קבלת רשימת תלמידים
  const { students } = useSelector(state => state.students);

  // ✅ פונקציה לקבלת userId
  const getUserId = () => {
    console.log('🔍 Getting user ID...');
    console.log('Current user:', currentUserI);
    
    if (currentUserI) {
      // נסה שדות שונים של userId
      const userId = currentUserI.userId || 
                    currentUserI.id || 
                    currentUserI.UserId || 
                    currentUserI.ID;
      
      console.log('✅ Found user ID:', userId);
      return userId;
    }
    
    console.log('❌ No user ID found');
    return null;
  };

  // ✅ פונקציה לקבלת שם תלמיד לפי ID
  const getStudentName = (studentId) => {
    if (!studentId || !students || students.length === 0) {
      return `תלמיד ${studentId || 'לא ידוע'}`;
    }
    
    const student = students.find(s => 
      s.studentId === studentId || 
      s.id === studentId || 
      s.ID === studentId ||
      s.Id === studentId
    );
    
    if (student) {
      return `${student.firstName || student.FirstName || ''} ${student.lastName || student.LastName || ''}`.trim() || 
             `תלמיד ${studentId}`;
    }
    
    return `תלמיד ${studentId}`;
  };

  // ✅ פונקציה לקבלת צבע וסמל לפי סוג הערה (כמו ב-studentCoursesDialog)
  const getNoteTypeColor = (noteType) => {
    switch (noteType?.toLowerCase()) {
      case 'חיובי': return { color: '#059669', bg: '#d1fae5', icon: CheckCircleIcon };
      case 'שלילי': return { color: '#dc2626', bg: '#fee2e2', icon: ErrorIcon };
      case 'אזהרה': return { color: '#d97706', bg: '#fef3c7', icon: WarningIcon };
      case 'כללי': return { color: '#3b82f6', bg: '#dbeafe', icon: InfoIcon };
      default: return { color: '#6b7280', bg: '#f3f4f6', icon: NotesIcon };
    }
  };

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedNote, setSelectedNote] = useState(null);
  
  // ✅ הוסף state למיון
  const [sortBy, setSortBy] = useState('date'); // 'date', 'student', 'type'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  
  // ✅ State עבור הדיאלוג המוכן - רק לעריכה
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [noteDialogData, setNoteDialogData] = useState(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // ✅ useEffect מתוקן - טען גם תלמידים
  useEffect(() => {
    const userId = getUserId();
    console.log('🔄 useEffect - User ID:', userId);
    
    if (userId) {
      console.log('📡 Dispatching getNotesByUserId with ID:', userId);
      dispatch(getNotesByUserId(userId));
      
      // ✅ טען גם רשימת תלמידים
      dispatch(fetchStudents({ page: 1, pageSize: 1000 })); // טען הרבה תלמידים
    } else {
      console.log('⚠️ No user ID available, cannot fetch notes');
      setNotification({
        open: true,
        message: 'לא ניתן לטעון הערות - משתמש לא מחובר',
        severity: 'warning'
      });
    }
  }, [dispatch, currentUserI]);

  // ✅ Debug - הוסף console.log לראות מה מתקבל
  useEffect(() => {
    console.log('📝 Notes by user updated:', notesByUser);
    console.log('📝 Notes count:', notesByUser?.length || 0);
    console.log('👥 Students loaded:', students?.length || 0);
  }, [notesByUser, students]);

  // ✅ פונקציה למיון הערות
  const sortNotes = (notes) => {
    return [...notes].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          const dateA = new Date(a.createdDate || a.CreatedDate);
          const dateB = new Date(b.createdDate || b.CreatedDate);
          comparison = dateA - dateB;
          break;
          
        case 'student':
          const studentA = getStudentName(a.studentId || a.StudentId);
          const studentB = getStudentName(b.studentId || b.StudentId);
          comparison = studentA.localeCompare(studentB, 'he');
          break;
          
        case 'type':
          const typeA = a.noteType || a.NoteType || 'כללי';
          const typeB = b.noteType || b.NoteType || 'כללי';
          comparison = typeA.localeCompare(typeB, 'he');
          break;
          
        default:
          return 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  // ✅ Filter notes based on search and filter type - מתוקן עם שמות תלמידים ומיון
  const filteredNotes = sortNotes((notesByUser || []).filter(note => {
    console.log('🔍 Filtering note:', note); // debug
    
    // ✅ השתמש בשמות השדות הנכונים מהשרת
    const noteText = note.noteContent || note.NoteContent || ''; // תוכן ההערה
    const studentName = getStudentName(note.studentId || note.StudentId); // שם התלמיד
    const noteType = note.noteType || note.NoteType || 'כללי'; // סוג הערה
    
    const matchesSearch = 
      noteText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noteType.toLowerCase().includes(searchTerm.toLowerCase());
    
    // ✅ השתמש בשם השדה הנכון
    const isPrivate = note.isPrivate || note.IsPrivate || false;
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'private' && isPrivate) ||
                         (filterType === 'public' && !isPrivate);
    
    return matchesSearch && matchesFilter;
  }));

  // ✅ פונקציה לעריכה בלבד - הוסרה הוספה
  const handleEditNote = (note) => {
    console.log('🔧 Editing note:', note);
    
    // ✅ המר את הנתונים לפורמט שהדיאלוג מצפה לו - כולל שם תלמיד
    const studentId = note.studentId || note.StudentId;
    const studentName = getStudentName(studentId);
    
    const dialogData = {
      noteId: note.noteId || note.NoteId,
      studentId: studentId,
      studentName: studentName, // ✅ הוסף שם תלמיד
      authorId: note.authorId || note.AuthorId,
      authorName: note.authorName || note.AuthorName,
      authorRole: note.authorRole || note.AuthorRole,
      noteContent: note.noteContent || note.NoteContent,
      noteType: note.noteType || note.NoteType || 'כללי',
      priority: note.priority || note.Priority || 'נמוך',
      isPrivate: note.isPrivate || note.IsPrivate || false,
      isActive: note.isActive !== undefined ? note.isActive : (note.IsActive !== undefined ? note.IsActive : true),
      createdDate: note.createdDate || note.CreatedDate,
      updatedDate: note.updatedDate || note.UpdatedDate
    };

    setSelectedNote(note);
    setEditMode(true);
    setNoteDialogData(dialogData);
    setDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleDeleteNote = (note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  // ✅ פונקציית שמירה מעודכנת לדיאלוג המוכן - רק לעריכה
  const handleSaveNote = async (noteData) => {
    console.log('💾 Saving note from dialog:', noteData);
    
    const userId = getUserId();
    
    if (!userId) {
      setNotification({
        open: true,
        message: 'שגיאה: משתמש לא מחובר',
        severity: 'error'
      });
      return;
    }

    if (!(checkUserPermission(userId, (msg, severity) => setNotification({ open: true, message: msg, severity })))) return;
    try {
      // ✅ התאם את הנתונים לשרת
      const serverNoteData = {
        studentId: parseInt(noteData.studentId),
        authorId: parseInt(noteData.authorId || userId),
        authorName: noteData.authorName,
        authorRole: noteData.authorRole,
        noteContent: noteData.noteContent,
        noteType: noteData.noteType || 'כללי',
        priority: noteData.priority || 'נמוך',
        isPrivate: Boolean(noteData.isPrivate),
        isActive: Boolean(noteData.isActive),
        createdDate: noteData.createdDate || new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };

      console.log('📤 Sending to server:', serverNoteData);

      // רק עריכה - הוסרה אפשרות הוספה
      await dispatch(updateStudentNote({ 
        noteId: selectedNote.noteId || selectedNote.NoteId, 
        ...serverNoteData 
      })).unwrap();
      
      setNotification({
        open: true,
        message: 'ההערה עודכנה בהצלחה',
        severity: 'success'
      });

      // רענן את ההערות
      dispatch(getNotesByUserId(userId));
      
    } catch (error) {
      console.error('❌ Error saving note:', error);
      setNotification({
        open: true,
        message: `שגיאה בעדכון ההערה: ${error.message || 'שגיאה לא ידועה'}`,
        severity: 'error'
      });
    }
  };

  const handleConfirmDelete = async () => {
    const userId = getUserId();
    if (!(checkUserPermission(userId, (msg, severity) => setNotification({ open: true, message: msg, severity })))) return;
    try {
      const noteId = noteToDelete.noteId || noteToDelete.NoteId;
      await dispatch(deleteStudentNote(noteId)).unwrap();
      setNotification({
        open: true,
        message: 'ההערה נמחקה בהצלחה',
        severity: 'success'
      });
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
                                        
      // רענן את ההערות
      if (userId) {
        dispatch(getNotesByUserId(userId));
      }
    } catch (error) {
      console.error('❌ Error deleting note:', error);
      setNotification({
        open: true,
        message: 'שגיאה במחיקת ההערה',
        severity: 'error'
      });
    }
  };

  // ✅ פונקציה לשינוי מיון
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      // אם זה אותו מיון, שנה את הכיוון
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // מיון חדש
      setSortBy(newSortBy);
      setSortOrder(newSortBy === 'date' ? 'desc' : 'asc'); // תאריכים בסדר יורד, שאר בסדר עולה
    }
  };

  // ✅ הוסף בדיקה אם המשתמש מחובר
  if (!currentUserI) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <StickyNote2 sx={{ fontSize: 80, color: '#cbd5e0', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            נדרשת התחברות
          </Typography>
          <Typography variant="body1" color="text.secondary">
            כדי לצפות בהערות שלך, עליך להתחבר למערכת
          </Typography>
        </Paper>
      </Box>
    );
  }

  const styles = {
    root: {
        borderRadius:9,
      minHeight: '100vh',
 overflowY: 'auto',
       py: 4
    },
    container: {
      direction: 'rtl',
      maxWidth: '1200px',
    },
    header: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: 3,
      p: 3,
      mb: 3,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontWeight: 700,
      background: '#2d49c7ff',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      mb: 1
    },
    searchBar: {
      background: 'white',
      borderRadius: 2,
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'rgba(102, 126, 234, 0.3)',
        },
        '&:hover fieldset': {
          borderColor: '#667eea',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#667eea',
        },
      }
    },
    filterChips: {
      display: 'flex',
      gap: 1,
      flexWrap: 'wrap',
      mt: 2,
      direction:'ltr'
    },
    // ✅ הוסף סטיילים למיון
    sortControls: {
      display: 'flex',
      gap: 1,
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    sortButton: {
      minWidth: 'auto',
      px: 2,
      py: 1,
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 600,
      transition: 'all 0.2s ease'
    },
    noteCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: 3,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '2px solid transparent',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        borderColor: 'rgba(102, 126, 234, 0.3)'
      }
    },
    noteHeader: {
      pb: 1
    },
    studentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      mb: 1
    },
    noteText: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#2d3748',
      mb: 2
    },
    noteFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mt: 2,
      pt: 2,
      borderTop: '1px solid rgba(0, 0, 0, 0.1)'
    },
    emptyState: {
      textAlign: 'center',
      p: 6,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <Box sx={styles.root}>
      <Container maxWidth="xl" sx={styles.container}>
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={styles.header}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ 
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  width: 56,
                  height: 56
                }}>
                  <StickyNote2 sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={styles.title}>
                    ההערות שלי
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {/* ✅ הסר את פרטי המשתמש, השאר רק מספר הערות */}
                    {`סה"כ הערות: ${filteredNotes.length} | מוצגות: ${filteredNotes.length}`}
                  </Typography>
                </Box>
              </Box>
              {/* ✅ הוסר כפתור "הוסף הערה" */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontStyle: 'italic',
                  textAlign: 'center',
                  px: 3,
                  py: 1,
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: 2,
                  border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                  💡 להוספת הערות חדשות, עבור לעמוד התלמידים ובחר תלמיד
                </Typography>
              </Box>
            </Box>

            {/* Search, Filter and Sort */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="חיפוש בהערות, שמות תלמידים או סוג הערה..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={styles.searchBar}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box sx={styles.filterChips}>
                  <Chip
                    label="הכל"
                    onClick={() => setFilterType('all')}
                    color={filterType === 'all' ? 'primary' : 'default'}
                    variant={filterType === 'all' ? 'filled' : 'outlined'}
                  />
                  <Chip
                    label="פרטיות"
                    onClick={() => setFilterType('private')}
                    color={filterType === 'private' ? 'primary' : 'default'}
                    variant={filterType === 'private' ? 'filled' : 'outlined'}
                    icon={<VisibilityOff />}
                  />
                  <Chip
                    label="ציבוריות"
                    onClick={() => setFilterType('public')}
                    color={filterType === 'public' ? 'primary' : 'default'}
                    variant={filterType === 'public' ? 'filled' : 'outlined'}
                    icon={<Visibility />}
                  />
                </Box>
              </Grid>

              {/* ✅ הוסף בקרות מיון */}
              <Grid item xs={12} md={3}>
                <Box sx={styles.sortControls}>
                  <SortIcon color="action" />
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    מיון לפי:
                  </Typography>
                  <Button
                    size="small"
                    variant={sortBy === 'date' ? 'contained' : 'outlined'}
                    onClick={() => handleSortChange('date')}
                    sx={styles.sortButton}
                  >
                    תאריך {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </Button>
                  <Button
                    size="small"
                    variant={sortBy === 'student' ? 'contained' : 'outlined'}
                    onClick={() => handleSortChange('student')}
                    sx={styles.sortButton}
                  >
                    תלמיד {sortBy === 'student' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </Button>
                  <Button
                    size="small"
                    variant={sortBy === 'type' ? 'contained' : 'outlined'}
                    onClick={() => handleSortChange('type')}
                    sx={styles.sortButton}
                  >
                    סוג {sortBy === 'type' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Notes Grid */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ ml: 2, color: 'white' }}>
              טוען הערות...
            </Typography>
          </Box>
        ) : filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={styles.emptyState}>
              <StickyNote2 sx={{ fontSize: 80, color: '#cbd5e0', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                {searchTerm ? 'לא נמצאו הערות' : 'עדיין לא כתבת הערות'}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                {searchTerm ? 'נסה לשנות את מילות החיפוש' : 'כדי להוסיף הערות, עבור לעמוד התלמידים ובחר תלמיד'}
              </Typography>
              {/* ✅ הוסר כפתור "כתוב הערה ראשונה" */}
              <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(102, 126, 234, 0.1)', 
                borderRadius: 2,
                border: '1px solid rgba(102, 126, 234, 0.2)',
                mt: 3
              }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  💡 איך להוסיף הערות?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1. עבור לעמוד "תלמידים" בתפריט הראשי<br/>
                  2. בחר תלמיד מהרשימה<br/>
                  3. לחץ על "הוסף הערה" בפרופיל התלמיד<br/>
                  4. כתוב את ההערה ושמור
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredNotes.map((note, index) => {
                // ✅ קבל נתוני התלמיד והסוג
                const studentId = note.studentId || note.StudentId;
                const studentName = getStudentName(studentId);
                const noteType = note.noteType || note.NoteType || 'כללי';
                const typeConfig = getNoteTypeColor(noteType);
                const TypeIcon = typeConfig.icon;

                return (
                  <Grid item xs={12} sm={6} lg={4} key={note.noteId || note.NoteId}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card sx={{
                        ...styles.noteCard,
                        borderLeft: `4px solid ${typeConfig.color}` // ✅ הוסף קו צבעוני לפי סוג
                      }}>
                        <CardHeader
                          sx={styles.noteHeader}
                          avatar={
                            <Avatar sx={{ 
                              bgcolor: typeConfig.bg,
                              color: typeConfig.color,
                              width: 40,
                              height: 40
                            }}>
                              <TypeIcon fontSize="small" />
                            </Avatar>
                          }
                          title={
                            <Box>
                              {/* ✅ הצג שם תלמיד בולט */}
                              <Typography variant="h6" component="div" sx={{ 
                                fontWeight: 'bold',
                                color: '#1a202c',
                                mb: 0.5
                              }}>
                                {studentName}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                {/* ✅ Chip לסוג הערה */}
                                <Chip
                                  size="small"
                                  label={noteType}
                                  sx={{
                                    bgcolor: typeConfig.bg,
                                    color: typeConfig.color,
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem'
                                  }}
                                />
                                {/* ✅ Chip לפרטיות */}
                                {(note.isPrivate || note.IsPrivate) && (
                                  <Chip
                                    size="small"
                                    icon={<VisibilityOff />}
                                    label="פרטי"
                                    color="secondary"
                                    variant="outlined"
                                  />
                                )}
                                {/* ✅ Chip לעדיפות */}
                                {(note.priority || note.Priority) && (note.priority || note.Priority) !== 'נמוך' && (
                                  <Chip
                                    size="small"
                                    label={note.priority || note.Priority}
                                    color={
                                      (note.priority || note.Priority) === 'דחוף' ? 'error' :
                                      (note.priority || note.Priority) === 'גבוה' ? 'warning' : 'info'
                                    }
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </Box>
                          }
                          action={
                            <IconButton
                              onClick={(e) => {
                                setSelectedNote(note);
                                setMenuAnchor(e.currentTarget);
                              }}
                              size="small"
                            >
                              <MoreVert />
                            </IconButton>
                          }
                        />
                        <CardContent>
                          <Typography sx={styles.noteText}>
                            {/* ✅ הצג את תוכן ההערה */}
                            {note.noteContent || note.NoteContent}
                          </Typography>
                          
                          <Box sx={styles.noteFooter}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarToday fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {/* ✅ השתמש בשם השדה הנכון */}
                                {(note.createdDate || note.CreatedDate) ? 
                                  format(new Date(note.createdDate || note.CreatedDate), 'dd/MM/yyyy HH:mm', { locale: he }) : 
                                  'תאריך לא זמין'
                                }
                              </Typography>
                              {/* ✅ הצג אם עודכן */}
                              {(note.updatedDate || note.UpdatedDate) && 
                               (note.updatedDate || note.UpdatedDate) !== (note.createdDate || note.CreatedDate) && (
                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                  (עודכן)
                                </Typography>
                              )}
                            </Box>
                            <Box display="flex" gap={1}>
                              <Tooltip title="ערוך הערה">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditNote(note)}
                                  color="primary"
                                  sx={{
                                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                                    '&:hover': {
                                      bgcolor: 'rgba(102, 126, 234, 0.2)',
                                    }
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="מחק הערה">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteNote(note)}
                                  color="error"
                                  sx={{
                                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                                    '&:hover': {
                                      bgcolor: 'rgba(239, 68, 68, 0.2)',
                                    }
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </AnimatePresence>
          </Grid>
        )}

        {/* ✅ הוסר Floating Action Button */}

        {/* ✅ הדיאלוג המוכן לעריכה בלבד */}
        <AddStudentNoteDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedNote(null);
            setEditMode(false);
            setNoteDialogData(null);
          }}
          onSave={handleSaveNote}
          editMode={editMode}
          noteData={noteDialogData}
          currentUser={currentUserI}
          // ✅ הוסף פרמטרים נוספים שהדיאלוג צריך
          selectedStudent={noteDialogData ? {
            studentId: noteDialogData.studentId,
            studentName: noteDialogData.studentName,
            firstName: noteDialogData.studentName?.split(' ')[0] || '',
            lastName: noteDialogData.studentName?.split(' ').slice(1).join(' ') || ''
          } : null}
          students={students || []} // רשימת כל התלמידים לבחירה
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }
          }}
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'error.main' }}>
                <Delete />
              </Avatar>
              <Box>
                <Typography variant="h6">אישור מחיקה</Typography>
                {noteToDelete && (
                  <Typography variant="body2" color="text.secondary">
                    הערה על {getStudentName(noteToDelete.studentId || noteToDelete.StudentId)}
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              האם אתה בטוח שברצונך למחוק את ההערה?
            </Typography>
            {noteToDelete && (
              <Paper sx={{ 
                p: 2, 
                mt: 2, 
                bgcolor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  "{(noteToDelete.noteContent || noteToDelete.NoteContent)?.substring(0, 100)}
                  {(noteToDelete.noteContent || noteToDelete.NoteContent)?.length > 100 ? '...' : ''}"
                </Typography>
              </Paper>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              פעולה זו לא ניתנת לביטול.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
            >
              ביטול
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              startIcon={<Delete />}
            >
              מחק הערה
            </Button>
          </DialogActions>
        </Dialog>

        {/* Menu for note actions */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <MenuItem onClick={() => handleEditNote(selectedNote)}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography>ערוך הערה</Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedNote && `על ${getStudentName(selectedNote.studentId || selectedNote.StudentId)}`}
              </Typography>
            </ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleDeleteNote(selectedNote)} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error.main">מחק הערה</Typography>
              <Typography variant="caption" color="text.secondary">
                פעולה בלתי הפיכה
              </Typography>
            </ListItemText>
          </MenuItem>
        </Menu>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            severity={notification.severity}
            sx={{ 
              width: '100%',
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default MyNotes;
