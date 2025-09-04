import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button,
  Box, Typography, TableContainer, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Avatar, Divider,
  Card, CardContent, Grid, IconButton, Tabs, Tab,
  Accordion, AccordionSummary, AccordionDetails,
  Menu, MenuItem, DialogContentText
} from '@mui/material';

import {
  Add, Check as CheckIcon, Close as CloseIcon,
  School as CourseIcon, Info as InfoIcon, Person as PersonIcon,
  Schedule as ScheduleIcon, LocationOn as LocationIcon,
  Group as GroupIcon, CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon, Notes as NotesIcon,
  ExpandMore as ExpandMoreIcon, Warning as WarningIcon,
  Error as ErrorIcon, CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon,
  Payment as PaymentIcon, Receipt as ReceiptIcon
} from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNotesByStudentId } from '../../../store/studentNotes/studentNotesGetById';
import AddStudentNoteDialog from './addStudentNoteDialog';
import { checkUserPermission } from '../../../utils/permissions';
import { addStudentNote } from '../../../store/studentNotes/studentNoteAddThunk';
import StudentAttendanceHistory from './studentAttendanceHistory';
import { RefreshCwIcon } from 'lucide-react';
import { deleteStudentNote } from '../../../store/studentNotes/studentNoteDeleteThunk';
import { updateStudentNote } from '../../../store/studentNotes/studentNoteUpdateThunk';
import PaymentsTab from '../../Payments/PaymentsTab';
import PaymentHistoryTab from '../../Payments/PaymentHistoryTab';
import { deleteGroupStudent } from '../../../store/groupStudent/groupStudentDeleteThunk';
import { getgroupStudentByStudentId } from '../../../store/groupStudent/groupStudentGetByStudentIdThunk';
import { updateGroupStudent } from '../../../store/groupStudent/groupStudentUpdateThunk';
import { getGroupWithStudentsById } from '../../../store/group/groupGetGroupWithStudentsByIdThunk';
import GroupDialog from '../../Groups/components/groupDialog';

const StudentCoursesDialog = ({
  open,
  onClose,
  student,
  studentCourses = [],
  showAddButton = true,
  title = null,
  subtitle = null,
  onCourseDeleted
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // moved here: edit dialog states
  const [editCourseDialogOpen, setEditCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editCourseLoading, setEditCourseLoading] = useState(false);

  // כל ה-useState hooks בתחילה
  const [currentTab, setCurrentTab] = useState(0);
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [localStudentCourses, setLocalStudentCourses] = useState(studentCourses);
  const [editNoteDialogOpen, setEditNoteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuNoteId, setMenuNoteId] = useState(null);
  const [courseMenuAnchor, setCourseMenuAnchor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteCourseConfirmOpen, setDeleteCourseConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(false);
const [groupDialogOpen, setGroupDialogOpen] = useState(false);
const [selectedGroupId, setSelectedGroupId] = useState(null);

  // כל ה-useSelector hooks
  const studentNotes = useSelector((state) => state.studentNotes.studentNotes);
  const notesLoading = useSelector((state) => state.studentNotes.loading);
  const groupStudentById = useSelector((state) => state.groupStudents.groupStudentById);
  const groupStudentLoading = useSelector((state) => state.groupStudents.loading);
   const groupWithStudents = useSelector((state) => state.groups.groupWithStudents);

  // כל ה-useEffect hooks בסוף
  useEffect(() => {
    if (groupStudentById && groupStudentById.length > 0) {
      setLocalStudentCourses(groupStudentById);
    } else {
      setLocalStudentCourses(studentCourses);
    }
  }, [studentCourses, groupStudentById]);

  useEffect(() => {
    if (open && student?.id) {
      dispatch(getNotesByStudentId(student.id));
      dispatch(getgroupStudentByStudentId(student.id));
    }
  }, [open, student?.id, dispatch]);

  // Early return אחרי כל ה-hooks
  if (!student) return null;

  const dialogTitle = title || `${student.firstName} ${student.lastName}`;
  const dialogSubtitle = subtitle || `ת"ז: ${student.id}${student.email ? ` | 📧 ${student.email}` : ''}`;

  const getNoteTypeColor = (noteType) => {
    switch (noteType?.toLowerCase()) {
      case 'חיובי': return { color: '#059669', bg: '#d1fae5', icon: CheckCircleIcon };
      case 'שלילי': return { color: '#dc2626', bg: '#fee2e2', icon: ErrorIcon };
      case 'אזהרה': return { color: '#d97706', bg: '#fef3c7', icon: WarningIcon };
      case 'כללי': return { color: '#3b82f6', bg: '#dbeafe', icon: InfoIcon };
      default: return { color: '#6b7280', bg: '#f3f4f6', icon: NotesIcon };
    }
  };

  const handleSaveNote = async (noteData) => {
    // מניעת שמירת הערת "מעקב רישום" כפולה
    if (noteData.noteType === 'מעקב רישום' && studentNotes.some(n => n.noteType === 'מעקב רישום')) {
      alert('לא ניתן להוסיף יותר מהערת מעקב רישום אחת לתלמיד.');
      return;
    }
    try {
  if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
  const result = await dispatch(addStudentNote(noteData));
      if (result.type === 'studentNotes/add/fulfilled') {
        await dispatch(getNotesByStudentId(student.id));
      } else {
        alert('שגיאה בשמירת ההערה.');
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleUpdateNote = async (noteData) => {
    try {
      await dispatch(updateStudentNote({
        noteId: selectedNote.noteId,
        ...noteData
      }));
      dispatch(getNotesByStudentId(student.id));
      setEditNoteDialogOpen(false);
      setSelectedNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async () => {
    try {
      await dispatch(deleteStudentNote(noteToDelete.noteId));
      dispatch(getNotesByStudentId(student.id));
      setDeleteConfirmOpen(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleMenuOpen = (event, noteId) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setMenuNoteId(noteId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuNoteId(null);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setEditNoteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = (note) => {
    setNoteToDelete(note);
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleCourseMenuOpen = (event, course) => {
    event.stopPropagation();
    setCourseMenuAnchor(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setEditCourseDialogOpen(true);
    handleCourseMenuClose();
  };

  const handleEditCourseSave = async (updatedFields) => {
    setEditCourseLoading(true);
    try {
      const payload = {
        groupStudentId: editingCourse.groupStudentId,
        studentId: editingCourse.studentId,
        groupName: updatedFields.groupName !== undefined ? updatedFields.groupName : editingCourse.groupName,
        enrollmentDate: updatedFields.enrollmentDate,
        isActive: updatedFields.isActive
      };
      await dispatch(updateGroupStudent(payload));
      dispatch(getgroupStudentByStudentId(editingCourse.studentId));
      setEditCourseDialogOpen(false);
      setEditingCourse(null);
    } catch (error) {
      // handle error
    } finally {
      setEditCourseLoading(false);
    }
  };

  const handleCourseMenuClose = () => {
    setCourseMenuAnchor(null);
    setSelectedCourse(null);
  };

  const handleDeleteCourseConfirm = (course) => {
    setCourseToDelete(course);
    setDeleteCourseConfirmOpen(true);
    handleCourseMenuClose();
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete?.groupStudentId) {
      console.error('No groupStudentId found for course:', courseToDelete);
      return;
    }

    setDeletingCourse(true);
    try {
      console.log('🗑️ Deleting course with groupStudentId:', courseToDelete.groupStudentId);

      const result = await dispatch(deleteGroupStudent(courseToDelete.groupStudentId));

      if (deleteGroupStudent.fulfilled.match(result)) {
        console.log('✅ Course deleted successfully');

        // עדכון מיידי של הרשימה המקומית
        setLocalStudentCourses(prev =>
          prev.filter(course => course.groupStudentId !== courseToDelete.groupStudentId)
        );

        // קריאה ל-callback לעדכון הרשימה בקומפוננטה האב
        if (onCourseDeleted) {
          onCourseDeleted(courseToDelete.groupStudentId);
        }

        // רענון הנתונים מהשרת
        dispatch(getgroupStudentByStudentId(student.id));

        setDeleteCourseConfirmOpen(false);
        setCourseToDelete(null);

      } else {
        console.error('❌ Failed to delete course:', result.payload);
        alert('שגיאה במחיקת החוג: ' + (result.payload?.message || result.payload || 'שגיאה לא ידועה'));
      }
    } catch (error) {
      console.error('❌ Error deleting course:', error);
      alert('שגיאה במחיקת החוג: ' + error.message);
    } finally {
      setDeletingCourse(false);
    }
  };

  const renderStudentNotes = () => {
    if (!studentNotes || studentNotes.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          אין הערות עבור תלמיד זה
        </Typography>
      );
    }

    const noteTypes = [
      { value: 'כללי', label: 'כללי', color: '#3b82f6', icon: InfoIcon },
      { value: 'חיובי', label: 'חיובי', color: '#059669', icon: CheckCircleIcon },
      { value: 'שלילי', label: 'שלילי', color: '#dc2626', icon: ErrorIcon },
      { value: 'אזהרה', label: 'אזהרה', color: '#d97706', icon: WarningIcon }
    ];

    const priorities = [
      { value: 'נמוך', label: 'נמוך', color: '#6b7280' },
      { value: 'בינוני', label: 'בינוני', color: '#d97706' },
      { value: 'גבוה', label: 'גבוה', color: '#dc2626' }
    ];

    return (
      <Box sx={{ mt: 2 }}>
        <AnimatePresence>
          {studentNotes.map((note, index) => {
            const selectedNoteType = noteTypes.find(type => type.value === note.noteType) || noteTypes[0];
            const selectedPriority = priorities.find(priority => priority.value === note.priority) || priorities[0];

            return (
              <motion.div
                key={note.noteId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Accordion sx={{ mb: 1, borderRadius: '8px !important' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: `${selectedNoteType?.color}10`,
                      borderLeft: `4px solid ${selectedNoteType?.color}`,
                      borderRadius: '8px',
                      mb: 1,
                      '&:hover': {
                        backgroundColor: `${selectedNoteType?.color}20`,
                      },
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        gap: 2
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Avatar sx={{
                        bgcolor: selectedNoteType?.color,
                        width: 32,
                        height: 32
                      }}>
                        {selectedNoteType?.icon && (
                          <selectedNoteType.icon sx={{ fontSize: 16 }} />
                        )}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                          {note.noteType}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontSize='13px'>
                          {new Date(note.createdDate).toLocaleDateString('he-IL')} • {note.authorName} • {note.authorRole}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {note.priority && (
                          <Chip
                            label={note.priority}
                            size="small"
                            sx={{
                              bgcolor: `${selectedPriority?.color}20`,
                              color: selectedPriority?.color,
                              fontWeight: 'bold'
                            }}
                          />
                        )}

                        {note.isPrivate && (
                          <Chip
                            label="פרטי"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}

                        <Box
                          component="div"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuOpen(e, note.noteId);
                          }}
                          sx={{
                            p: 0.5,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 32,
                            minHeight: 32,
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                          }}
                        >
                          <MoreVertIcon sx={{ fontSize: 20 }} />
                        </Box>
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography variant="body2">
                      {note.noteContent}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>
    );
  };

 return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="xl"
          fullWidth
          sx={{
            direction: 'rtl',
            '& .MuiDialog-paper': {
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              maxWidth: '1200px',
              width: '95vw',
              maxHeight: '90vh',
            },
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: 0,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{
                    width: 50,
                    height: 50,
                    background: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <PersonIcon sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 0.5 }}>
                      {dialogTitle}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      {dialogSubtitle}
                    </Typography>
                  </Box>
                </Box>

                <IconButton onClick={onClose} sx={{
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }
                }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 0, background: '#f8fafc' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{
                  px: 2,
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#10b981',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: '#64748b',
                    '&.Mui-selected': {
                      color: '#10b981',
                      fontWeight: 600
                    },
                    '&:hover': {
                      color: '#059669',
                      backgroundColor: 'rgba(16, 185, 129, 0.04)'
                    }
                  }
                }}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab
                  icon={<CourseIcon />}
                  label={`חוגים (${localStudentCourses.length})`}
                  iconPosition="start"
                  sx={{
                    minHeight: '60px',
                    fontSize: '0.95rem',
                    minWidth: 'auto',
                    px: 2
                  }}
                />
                <Tab
                  icon={<NotesIcon />}
                  label={`הערות (${studentNotes?.length || 0})`}
                  iconPosition="start"
                  sx={{
                    minHeight: '60px',
                    fontSize: '0.95rem',
                    minWidth: 'auto',
                    px: 2
                  }}
                />
                <Tab
                  icon={<HistoryIcon />}
                  label="מעקב נוכחות"
                  iconPosition="start"
                  sx={{
                    minHeight: '60px',
                    fontSize: '0.95rem',
                    minWidth: 'auto',
                    px: 2
                  }}
                />
                <Tab
                  icon={<PaymentIcon />}
                  label="אמצעי תשלום"
                  iconPosition="start"
                  sx={{
                    minHeight: '60px',
                    fontSize: '0.95rem',
                    minWidth: 'auto',
                    px: 2
                  }}
                />
                <Tab
                  icon={<ReceiptIcon />}
                  label="היסטוריית תשלומים"
                  iconPosition="start"
                  sx={{
                    minHeight: '60px',
                    fontSize: '0.95rem',
                    minWidth: 'auto',
                    px: 2
                  }}
                />
              </Tabs>
            </Box>
            <Box sx={{ p: 2.5 }}>
              {currentTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {localStudentCourses && localStudentCourses.length > 0 ? (
                    <Box>
                      {/* סטטיסטיקות */}
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, mb: 2.5, height: '150px' }}>
                        <Card sx={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <CourseIcon sx={{ fontSize: 36, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                              {localStudentCourses.length}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              חוגים רשומים
                            </Typography>
                          </CardContent>
                        </Card>

                        <Card sx={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                          color: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <CheckIcon sx={{ fontSize: 36, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                              {localStudentCourses.filter(c => c.isActive).length}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              חוגים פעילים
                            </Typography>
                          </CardContent>
                        </Card>

                        <Card sx={{
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          color: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <LocationIcon sx={{ fontSize: 36, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                              {new Set(localStudentCourses.map(c => c.branchName)).size}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              סניפים שונים
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>

                      {/* טבלת החוגים */}
                      <Card sx={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                        background: 'white',
                        border: '1px solid rgba(0,0,0,0.08)'
                      }}>
                        <TableContainer sx={{ maxHeight: '350px' }}>
                          <Table stickyHeader size="medium">
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                    py: 2,
                                    textAlign: 'right',
                                    direction: 'rtl',
                                    borderBottom: '2px solid #10b981'
                                  }}
                                >
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 1,
                                    direction: 'rtl'
                                  }}>
                                    <CourseIcon sx={{ color: '#10b981', fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: 'bold' }}>שם החוג</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                    py: 2,
                                    textAlign: 'right',
                                    direction: 'rtl',
                                    borderBottom: '2px solid #10b981'
                                  }}
                                >
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 1,
                                    direction: 'rtl'
                                  }}>
                                    <GroupIcon sx={{ color: '#10b981', fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: 'bold' }}>קבוצה</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                    py: 2,
                                    textAlign: 'right',
                                    direction: 'rtl',
                                    borderBottom: '2px solid #10b981'
                                  }}
                                >
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 1,
                                    direction: 'rtl'
                                  }}>
                                    <LocationIcon sx={{ color: '#10b981', fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: 'bold' }}>סניף</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                    py: 2,
                                    textAlign: 'right',
                                    direction: 'rtl',
                                    borderBottom: '2px solid #10b981'
                                  }}
                                >
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 1,
                                    direction: 'rtl'
                                  }}>
                                    <PersonIcon sx={{ color: '#10b981', fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: 'bold' }}>מדריך</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                    py: 2,
                                    textAlign: 'right',
                                    direction: 'rtl',
                                    borderBottom: '2px solid #10b981'
                                  }}
                                >
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 1,
                                    direction: 'rtl'
                                  }}>
                                    <ScheduleIcon sx={{ color: '#10b981', fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: 'bold' }}>יום ושעה</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                    py: 2,
                                    textAlign: 'right',
                                    direction: 'rtl',
                                    borderBottom: '2px solid #10b981'
                                  }}
                                >
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 1,
                                    direction: 'rtl'
                                  }}>
                                    <CalendarIcon sx={{ color: '#10b981', fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: 'bold' }}>תאריך התחלה</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                    py: 2,
                                    textAlign: 'right',
                                    direction: 'rtl',
                                    borderBottom: '2px solid #10b981'
                                  }}
                                >
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 1,
                                    direction: 'rtl'
                                  }}>
                                    <AssignmentIcon sx={{ color: '#10b981', fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: 'bold' }}>סטטוס</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                    py: 2,
                                    textAlign: 'center',
                                    borderBottom: '2px solid #10b981',
                                    width: '80px'
                                  }}
                                >
                                  <Typography sx={{ fontWeight: 'bold' }}>פעולות</Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <AnimatePresence>
                                {localStudentCourses.map((course, index) => (
                                  <TableRow
                                    key={course.groupStudentId || index}
                                    component={motion.tr}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    sx={{
                                      '&:nth-of-type(even)': { backgroundColor: 'rgba(16, 185, 129, 0.03)' },
                                      '&:hover': {
                                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                                      },
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    <TableCell align="right" sx={{ py: 2 }}>
                                      <Typography sx={{
                                        fontWeight: 'medium',
                                        fontSize: '1rem',
                                        color: '#1e293b'
                                      }}>
                                        {course.courseName}
                                      </Typography>
                                    </TableCell>

                                    <TableCell align="right" sx={{ py: 2 }}>
                                      <Chip
                                        label={course.groupName}
                                        size="small"
                                        sx={{
                                          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                                          color: 'white',
                                          fontWeight: 'medium',
                                          borderRadius: '12px',
                                          fontSize: '0.875rem'
                                        }}
                                      />
                                    </TableCell>

                                    <TableCell align="right" sx={{ py: 2 }}>
                                      <Typography sx={{ fontSize: '1rem' }}>
                                        {course.branchName}
                                      </Typography>
                                    </TableCell>

                                    <TableCell align="right" sx={{ py: 2 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
                                        <Avatar sx={{
                                          width: 32,
                                          height: 32,
                                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                          color: 'white',
                                          fontSize: '0.875rem',
                                          fontWeight: 'bold'
                                        }}>
                                          {course.instructorName?.charAt(0)}
                                        </Avatar>
                                        <Typography sx={{ fontSize: '0.9rem' }}>
                                          {course.instructorName}
                                        </Typography>
                                      </Box>
                                    </TableCell>

                                    <TableCell align="right" sx={{ py: 2 }}>
                                      <Box sx={{
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        borderRadius: '12px',
                                        p: 1.5,
                                        textAlign: 'center',
                                        color: 'white'
                                      }}>
                                        <Typography sx={{
                                          fontWeight: 'bold',
                                          fontSize: '0.8rem'
                                        }}>
                                          {course.dayOfWeek}
                                        </Typography>
                                        <Typography sx={{
                                          fontSize: '0.75rem',
                                          opacity: 0.9
                                        }}>
                                          {course.hour}
                                        </Typography>
                                      </Box>
                                    </TableCell>

                                    <TableCell align="center" sx={{ py: 2 }}>
                                      <Typography sx={{
                                        fontSize: '0.85rem',
                                      }}>
                                        {course.enrollmentDate}
                                      </Typography>
                                    </TableCell>

                                    <TableCell align="right" sx={{ py: 2 }}>
                                      <Chip
                                        icon={course.isActive === true ? <CheckIcon sx={{ fontSize: 18 }} /> : <CloseIcon sx={{ fontSize: 18 }} />}
                                        label={course.isActive ? 'פעיל' : 'לא פעיל'}
                                        color={course.isActive === true ? "success" : "error"}
                                        variant="outlined"
                                        size="medium"
                                        sx={{ fontSize: '0.875rem' }}
                                      />
                                    </TableCell>

                                    <TableCell align="center" sx={{ py: 2 }}>
                                      <IconButton
                                        onClick={(e) => handleCourseMenuOpen(e, course)}
                                        size="small"
                                        disabled={deletingCourse}
                                        sx={{
                                          color: '#6b7280',
                                          '&:hover': {
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                            color: '#dc2626'
                                          },
                                          '&:disabled': {
                                            opacity: 0.5
                                          },
                                          transition: 'all 0.2s ease'
                                        }}
                                      >
                                        <MoreVertIcon />
                                      </IconButton>
                                     <IconButton
  onClick={() => {
    setSelectedGroupId(course.groupId);
    setGroupDialogOpen(true);
    dispatch(getGroupWithStudentsById(course.groupId));
  }}
  size="small"
  sx={{
    color: '#10b981',
    '&:hover': {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#059669'
    },
    transition: 'all 0.2s ease'
  }}
  title="מעבר לקבוצה"
>
  <GroupIcon />
</IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </AnimatePresence>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Card>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                      <InfoIcon sx={{ fontSize: 60, color: '#10b981', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#1e293b', mb: 2, textAlign: 'center' }}>
                        אין חוגים רשומים לתלמיד זה
                      </Typography>
                      {showAddButton && (
                        <Button
                          variant="contained"
                          size="medium"
                          startIcon={<Add />}
                          onClick={() => {
                            navigate('/entrollStudent');
                            onClose();
                          }}
                          sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '20px',
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 'medium',
                            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                            '&:hover': {
                              boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          הוסף חוג ראשון
                        </Button>
                      )}
                    </Box>
                  )}
                </motion.div>
              )}

              {/* טאב ההערות */}
              {currentTab === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {renderStudentNotes()}
                </motion.div>
              )}

              {/* טאב הנוכחות */}
              {currentTab === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    background: 'white',
                    border: '1px solid rgba(0,0,0,0.08)',
                    minHeight: '400px'
                  }}>
                    <Box sx={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Avatar sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                      }}>
                        <HistoryIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          מעקב נוכחות
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          נתוני נוכחות מפורטים לכל החוגים
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ p: 2 }}>
                      <StudentAttendanceHistory
                        student={student}
                        embedded={true}
                        open={true}
                        onClose={() => { }}
                      />
                    </Box>
                  </Card>
                </motion.div>
              )}

              {/* טאב אמצעי תשלום */}
              {currentTab === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <PaymentsTab student={student} embedded={true} />
                </motion.div>
              )}

              {/* טאב היסטוריית תשלומים */}
              {currentTab === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <PaymentHistoryTab student={student} embedded={true} />
                </motion.div>
              )}
            </Box>
          </DialogContent>

          <Divider sx={{ background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }} />

          <DialogActions sx={{
            p: 2.5,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(16, 185, 129, 0.1)'
          }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {showAddButton && currentTab === 0 && (
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<Add sx={{ fontSize: 20 }} />}
                  onClick={() => {
                    navigate('/entrollStudent');
                    onClose();
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '20px',
                    px: 3,
                    py: 1.2,
                    fontSize: '1rem',
                    fontWeight: 'medium',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  הוסף חוג
                </Button>
              )}

              {currentTab === 1 && (
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<Add sx={{ fontSize: 20 }} />}
                  onClick={() => setAddNoteDialogOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    borderRadius: '20px',
                    px: 3,
                    py: 1.2,
                    fontSize: '1rem',
                    fontWeight: 'medium',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  הוסף הערה
                </Button>
              )}
            </Box>
            <Button
              onClick={onClose}
              variant="outlined"
              size="medium"
              sx={{
                borderRadius: '20px',
                px: 4,
                py: 1.2,
                fontSize: '1rem',
                fontWeight: 'medium',
                borderColor: '#10b981',
                color: '#10b981',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#059669',
                  color: '#059669',
                  background: 'rgba(16, 185, 129, 0.05)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              סגור
            </Button>
          </DialogActions>

          {/* דיאלוג הוספת הערה */}
          <AddStudentNoteDialog
            open={addNoteDialogOpen}
            onClose={() => setAddNoteDialogOpen(false)}
            student={student}
            onSave={handleSaveNote}
          />

          {/* דיאלוג עריכת הערה */}
          <AddStudentNoteDialog
            open={editNoteDialogOpen}
            onClose={() => {
              setEditNoteDialogOpen(false);
              setSelectedNote(null);
            }}
            student={student}
            onSave={handleUpdateNote}
            editMode={true}
            noteData={selectedNote}
          />

          {/* דיאלוג מחיקת הערה */}
          <Dialog
            open={deleteConfirmOpen}
            onClose={() => {
              setDeleteConfirmOpen(false);
              setNoteToDelete(null);
            }}
            sx={{
              direction: 'rtl'
            }}
          >
            <DialogTitle sx={{ textAlign: 'center', color: '#dc2626', fontWeight: 'bold' }}>
              מחיקת הערה
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ textAlign: 'center', fontSize: '1rem' }}>
                האם אתה בטוח שברצונך למחוק את ההערה הזו?
                <br />
                פעולה זו לא ניתנת לביטול.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
              <Button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setNoteToDelete(null);
                }}
                variant="outlined"
              >
                ביטול
              </Button>
              <Button
                onClick={handleDeleteNote}
                variant="contained"
                color="error"
              >
                מחק
              </Button>
            </DialogActions>
          </Dialog>

          {/* דיאלוג מחיקת חוג */}
          <Dialog
            open={deleteCourseConfirmOpen}
            onClose={() => {
              setDeleteCourseConfirmOpen(false);
              setCourseToDelete(null);
            }}
            sx={{
              direction: 'rtl'
            }}
          >
            <DialogTitle sx={{
              textAlign: 'center',
              color: '#dc2626',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}>
              <DeleteIcon />
              מחיקת חוג
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ textAlign: 'center', fontSize: '1rem', mb: 2 }}>
                האם אתה בטוח שברצונך למחוק את התלמיד מהחוג הבא?
              </DialogContentText>
              {courseToDelete && (
                <Box sx={{
                  background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                  borderRadius: '12px',
                  p: 2,
                  border: '1px solid #fca5a5'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#dc2626', mb: 1 }}>
                    {courseToDelete.courseName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    קבוצה: {courseToDelete.groupName} | סניף: {courseToDelete.branchName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    מדריך: {courseToDelete.instructorName}
                  </Typography>
                </Box>
              )}
              <Typography variant="body2" sx={{
                textAlign: 'center',
                mt: 2,
                color: '#dc2626',
                fontWeight: 'medium'
              }}>
                פעולה זו לא ניתנת לביטול!
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 2 }}>
              <Button
                onClick={() => {
                  setDeleteCourseConfirmOpen(false);
                  setCourseToDelete(null);
                }}
                variant="outlined"
                disabled={deletingCourse}
                sx={{
                  borderRadius: '12px',
                  px: 3
                }}
              >
                ביטול
              </Button>
              <Button
                onClick={handleDeleteCourse}
                variant="contained"
                color="error"
                disabled={deletingCourse}
                startIcon={deletingCourse ? null : <DeleteIcon />}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
                  }
                }}
              >
                {deletingCourse ? 'מוחק...' : 'מחק חוג'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* תפריט פעולות להערות */}
          <Menu
            anchorEl={courseMenuAnchor}
            open={Boolean(courseMenuAnchor)}
            onClose={handleCourseMenuClose}
            sx={{ direction: 'rtl' }}
          >
            <MenuItem
              onClick={() => handleEditCourse(selectedCourse)}
            >
              <EditIcon fontSize="small" sx={{ ml: 1 }} />
              ערוך סטטוס/תאריך התחלה
            </MenuItem>
            <MenuItem
              onClick={() => handleDeleteCourseConfirm(selectedCourse)}
              sx={{ 
                color: '#dc2626',
                '&:hover': {
                  backgroundColor: 'rgba(220, 38, 38, 0.1)'
                }
              }}
            >
              <DeleteIcon fontSize="small" sx={{ ml: 1 }} />
              הסר מהחוג
            </MenuItem>
          </Menu>
          {/* Edit Course Dialog */}
          {editingCourse && (
            <Dialog open={editCourseDialogOpen} onClose={() => { setEditCourseDialogOpen(false); setEditingCourse(null); }} sx={{ direction: 'rtl' }}>
              <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>עריכת סטטוס ותאריך התחלה</DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 320 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {editingCourse.courseName} | קבוצה: {editingCourse.groupName} | סניף: {editingCourse.branchName}
                  </Typography>
                  <Box>
                    <Typography variant="subtitle2">סטטוס</Typography>
                    <Button
                      variant={editingCourse.isActive ? 'contained' : 'outlined'}
                      color={editingCourse.isActive ? 'success' : 'error'}
                      sx={{ mr: 2 }}
                      onClick={() => setEditingCourse({ ...editingCourse, isActive: !editingCourse.isActive })}
                    >
                      {editingCourse.isActive ? 'פעיל' : 'לא פעיל'}
                    </Button>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">תאריך התחלה</Typography>
                    <input
                      type="date"
                      value={editingCourse.enrollmentDate ? editingCourse.enrollmentDate.slice(0,10) : ''}
                      onChange={e => setEditingCourse({ ...editingCourse, enrollmentDate: e.target.value })}
                      style={{ fontSize: '1rem', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '8px' }}
                    />
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
                <Button onClick={() => { setEditCourseDialogOpen(false); setEditingCourse(null); }} variant="outlined">ביטול</Button>
                <Button
                  onClick={() => handleEditCourseSave({ isActive: editingCourse.isActive, enrollmentDate: editingCourse.enrollmentDate })}
                  variant="contained"
                  color="primary"
                  disabled={editCourseLoading}
                >
                  שמור
                </Button>
              </DialogActions>
            </Dialog>
          )}
<GroupDialog
  open={groupDialogOpen}
  onClose={() => setGroupDialogOpen(false)}
  group={groupWithStudents}
/>
        </Dialog>
      )}
    </AnimatePresence>
  );

};
export default StudentCoursesDialog;
