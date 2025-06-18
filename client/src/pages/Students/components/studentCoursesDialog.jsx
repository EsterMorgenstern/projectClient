// import React, { useState, useEffect } from 'react';
// import {
//   Dialog, DialogActions, DialogContent, DialogTitle, Button,
//   Box, Typography, TableContainer, Paper, Table, TableHead,
//   TableRow, TableCell, TableBody, Chip, Avatar, Divider,
//   Card, CardContent, Grid, IconButton, Tabs, Tab,
//   Accordion, AccordionSummary, AccordionDetails
// } from '@mui/material';
// import {
//   Add, Check as CheckIcon, Close as CloseIcon,
//   School as CourseIcon, Info as InfoIcon, Person as PersonIcon,
//   Schedule as ScheduleIcon, LocationOn as LocationIcon,
//   Group as GroupIcon, CalendarToday as CalendarIcon,
//   Assignment as AssignmentIcon, Notes as NotesIcon,
//   ExpandMore as ExpandMoreIcon, Warning as WarningIcon,
//   Error as ErrorIcon, CheckCircle as CheckCircleIcon,
//   History as HistoryIcon

// } from '@mui/icons-material';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { getNotesByStudentId } from '../store/studentNotes/studentNotesGetById';
// import AddStudentNoteDialog from './addStudentNoteDialog';
// import { addStudentNote } from '../store/studentNotes/studentNoteAddThunk';
// import StudentAttendanceHistory from './studentAttendanceHistory';
// const StudentCoursesDialog = ({
//   open,
//   onClose,
//   student,
//   studentCourses = [],
//   showAddButton = true,
//   title = null,
//   subtitle = null
// }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [currentTab, setCurrentTab] = useState(0);
//   const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loadingAttendance, setLoadingAttendance] = useState(false);

//   const studentNotes = useSelector((state) => state.studentNotes.studentNotes);
//   const notesLoading = useSelector((state) => state.studentNotes.loading);

//   useEffect(() => {
//     if (open && student?.id) {
//       dispatch(getNotesByStudentId(student.id));
//     }
//   }, [open, student?.id, dispatch]);

//   if (!student) return null;

//   const dialogTitle = title || `${student.firstName} ${student.lastName}`;
//   const dialogSubtitle = subtitle || `ת"ז: ${student.id}`;

//   const getNoteTypeColor = (noteType) => {
//     switch (noteType?.toLowerCase()) {
//       case 'חיובי': return { color: '#059669', bg: '#d1fae5', icon: CheckCircleIcon };
//       case 'שלילי': return { color: '#dc2626', bg: '#fee2e2', icon: ErrorIcon };
//       case 'אזהרה': return { color: '#d97706', bg: '#fef3c7', icon: WarningIcon };
//       case 'כללי': return { color: '#3b82f6', bg: '#dbeafe', icon: InfoIcon };
//       default: return { color: '#6b7280', bg: '#f3f4f6', icon: NotesIcon };
//     }
//   };

//   const handleSaveNote = async (noteData) => {
//     try {
//       await dispatch(addStudentNote(noteData));
//       dispatch(getNotesByStudentId(student.id));
//     } catch (error) {
//       console.error('Error saving note:', error);
//     }
//   };

//   const renderStudentNotes = () => {
//     if (notesLoading) {
//       return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//           <Typography variant="body1">טוען הערות...</Typography> {/* ✅ הגדלתי */}
//         </Box>
//       );
//     }

//     if (!studentNotes || studentNotes.length === 0) {
//       return (
//         <Box sx={{ textAlign: 'center', py: 6 }}>
//           <NotesIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
//           <Typography variant="h6" color="text.secondary">
//             אין הערות לתלמיד זה
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}> {/* ✅ הגדלתי מ-body2 */}
//             ניתן להוסיף הערות חדשות דרך כפתור "הוסף הערה"
//           </Typography>
//         </Box>
//       );
//     }

//     return (
//       <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
//         {studentNotes.map((note, index) => {
//           const noteTypeConfig = getNoteTypeColor(note.noteType);
//           const IconComponent = noteTypeConfig.icon;

//           return (
//             <motion.div
//               key={note.noteId}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//             >
//               <Accordion sx={{ mb: 1, borderRadius: '12px !important' }}>
//                 <AccordionSummary
//                   expandIcon={<ExpandMoreIcon />}
//                   sx={{
//                     background: noteTypeConfig.bg,
//                     borderRadius: '12px',
//                     minHeight: '64px', // ✅ הגדלתי
//                     '&:hover': { background: noteTypeConfig.bg }
//                   }}
//                 >
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
//                     <Avatar sx={{
//                       bgcolor: noteTypeConfig.color,
//                       width: 40, // ✅ הגדלתי
//                       height: 40
//                     }}>
//                       <IconComponent sx={{ fontSize: 20 }} /> {/* ✅ הגדלתי */}
//                     </Avatar>

//                     <Box sx={{ flex: 1 }}>
//                       <Typography variant="body1" fontWeight="bold"> {/* ✅ הגדלתי מ-subtitle2 */}
//                         {note.noteType || 'הערה כללית'}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary"> {/* ✅ הגדלתי מ-caption */}
//                         {new Date(note.createdDate).toLocaleDateString('he-IL')} • {note.authorName}
//                       </Typography>
//                     </Box>

//                     {note.priority && (
//                       <Chip
//                         label={note.priority}
//                         size="medium" // ✅ הגדלתי מ-small
//                         color={note.priority === 'גבוה' ? 'error' : note.priority === 'בינוני' ? 'warning' : 'default'}
//                       />
//                     )}
//                   </Box>
//                 </AccordionSummary>

//                 <AccordionDetails sx={{ pt: 2 }}>
//                   <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}> {/* ✅ הגדלתי מ-body2 */}
//                     {note.noteContent}
//                   </Typography>

//                   <Divider sx={{ my: 1.5 }} />

//                   <Grid container spacing={1}>
//                     <Grid item xs={6}>
//                       <Typography variant="body2" color="text.secondary"> {/* ✅ הגדלתי מ-caption */}
//                         נוצר על ידי: {note.authorName}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2" color="text.secondary"> {/* ✅ הגדלתי מ-caption */}
//                         עודכן: {new Date(note.updatedDate).toLocaleDateString('he-IL')}
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </AccordionDetails>
//               </Accordion>
//             </motion.div>
//           );
//         })}
//       </Box>
//     );
//   };

//   return (
//     <AnimatePresence>
//       {open && (
//         <Dialog
//           open={open}
//           onClose={onClose}
//           maxWidth="xl"
//           fullWidth
//           sx={{
//             direction: 'rtl',
//             '& .MuiDialog-paper': {
//               borderRadius: '20px',
//               overflow: 'hidden',
//               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//               background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
//               maxWidth: '1200px',
//               width: '95vw',
//               maxHeight: '90vh',
//             },
//           }}
//         >
//           {/* Header */}
//           <DialogTitle sx={{
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             color: 'white',
//             padding: 0,
//             position: 'relative',
//             overflow: 'hidden'
//           }}>
//             <Box sx={{ position: 'relative', zIndex: 1, p: 2.5 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <Avatar sx={{
//                     width: 50,
//                     height: 50,
//                     background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
//                     fontSize: '1.2rem',
//                     fontWeight: 'bold',
//                     boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
//                   }}>
//                     <PersonIcon sx={{ fontSize: 24 }} />
//                   </Avatar>
//                   <Box>
//                     <Typography variant="h5" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 0.5 }}>
//                       {dialogTitle}
//                     </Typography>
//                     <Typography variant="body1" sx={{ opacity: 0.9 }}> {/* ✅ הגדלתי מ-body2 */}
//                       {dialogSubtitle}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <IconButton onClick={onClose} sx={{ color: 'white' }}>
//                   <CloseIcon />
//                 </IconButton>
//               </Box>
//             </Box>
//           </DialogTitle>

//           <DialogContent sx={{ p: 0, background: '#f8fafc' }}>
//             {/* טאבים */}
//             <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
//               <Tabs
//                 value={currentTab}
//                 onChange={(e, newValue) => setCurrentTab(newValue)}
//                 sx={{ px: 2 }}
//               >
//                 <Tab
//                   icon={<CourseIcon />}
//                   label={`חוגים (${studentCourses.length})`}
//                   iconPosition="start"
//                   sx={{
//                     minHeight: '60px',
//                     fontSize: '0.95rem'
//                   }}
//                 />
//                 <Tab
//                   icon={<NotesIcon />}
//                   label={`הערות (${studentNotes?.length || 0})`}
//                   iconPosition="start"
//                   sx={{
//                     minHeight: '60px',
//                     fontSize: '0.95rem'
//                   }}
//                 />
//                 <Tab
//                   icon={<HistoryIcon />}
//                   label="נוכחות"
//                   iconPosition="start"
//                   sx={{
//                     minHeight: '60px',
//                     fontSize: '0.95rem'
//                   }}
//                 />
//               </Tabs>
//             </Box>

//             {/* תוכן הטאבים */}
//             <Box sx={{ p: 2.5 }}>
//               {currentTab === 0 && (
//                 // טאב החוגים
//                 <>
//                   {studentCourses && studentCourses.length > 0 ? (
//                     <Box>
//                       {/* סטטיסטיקות */}
//                       <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, mb: 2.5 }}>
//                         <Card sx={{
//                           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                           color: 'white',
//                           borderRadius: '12px',
//                           boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
//                         }}>
//                           <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
//                             <CourseIcon sx={{ fontSize: 32, mb: 0.5 }} />
//                             <Typography variant="h5" fontWeight="bold">
//                               {studentCourses.length}
//                             </Typography>
//                             <Typography variant="body2">
//                               חוגים רשומים
//                             </Typography>
//                           </CardContent>
//                         </Card>

//                         <Card sx={{
//                           background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
//                           color: '#8b4513',
//                           borderRadius: '12px',
//                           boxShadow: '0 4px 12px rgba(252, 182, 159, 0.3)'
//                         }}>
//                           <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
//                             <CheckIcon sx={{ fontSize: 32, mb: 0.5 }} />
//                             <Typography variant="h5" fontWeight="bold">
//                               {studentCourses.filter(c => c.isActive).length}
//                             </Typography>
//                             <Typography variant="body2">
//                               חוגים פעילים
//                             </Typography>
//                           </CardContent>
//                         </Card>

//                         <Card sx={{
//                           background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
//                           color: '#2d3748',
//                           borderRadius: '12px',
//                           boxShadow: '0 4px 12px rgba(168, 237, 234, 0.3)'
//                         }}>
//                           <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
//                             <LocationIcon sx={{ fontSize: 32, mb: 0.5 }} />
//                             <Typography variant="h5" fontWeight="bold">
//                               {new Set(studentCourses.map(c => c.branchName)).size}
//                             </Typography>
//                             <Typography variant="body2">
//                               סניפים שונים
//                             </Typography>
//                           </CardContent>
//                         </Card>
//                       </Box>

//                       {/* טבלת החוגים */}
//                       <Card sx={{
//                         borderRadius: '16px',
//                         overflow: 'hidden',
//                         boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//                         background: 'white'
//                       }}>
//                         <TableContainer sx={{ maxHeight: '350px' }}>
//                           <Table stickyHeader size="medium">
//                             <TableHead>
//                               <TableRow>
//                                 <TableCell
//                                   align="right"
//                                   sx={{
//                                     fontWeight: 'bold',
//                                     fontSize: '1rem',
//                                     background: '#f8fafc',
//                                     py: 2,
//                                     textAlign: 'right', // ✅ הוספתי
//                                     direction: 'rtl' // ✅ הוספתי
//                                   }}
//                                 >
//                                   <Box sx={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'flex-start', // ✅ שיניתי מ-flex-end
//                                     gap: 1,
//                                     direction: 'rtl' // ✅ הוספתי
//                                   }}>
//                                     <CourseIcon sx={{ color: '#667eea', fontSize: 18 }} />
//                                     שם החוג
//                                   </Box>
//                                 </TableCell>
//                                 <TableCell
//                                   align="right"
//                                   sx={{
//                                     fontWeight: 'bold',
//                                     fontSize: '1rem',
//                                     background: '#f8fafc',
//                                     py: 2,
//                                     textAlign: 'right',
//                                     direction: 'rtl'
//                                   }}
//                                 >
//                                   <Box sx={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'flex-start', // ✅ שיניתי
//                                     gap: 1,
//                                     direction: 'rtl'
//                                   }}>
//                                     <Typography sx={{ fontWeight: 'bold' }}>קבוצה</Typography>
//                                     <GroupIcon sx={{ color: '#667eea', fontSize: 18 }} />
//                                   </Box>
//                                 </TableCell>

//                                 <TableCell
//                                   align="right"
//                                   sx={{
//                                     fontWeight: 'bold',
//                                     fontSize: '1rem',
//                                     background: '#f8fafc',
//                                     py: 2,
//                                     textAlign: 'right',
//                                     direction: 'rtl'
//                                   }}
//                                 >
//                                   <Box sx={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'flex-start', // ✅ שיניתי
//                                     gap: 1,
//                                     direction: 'rtl'
//                                   }}>
//                                     <Typography sx={{ fontWeight: 'bold' }}>סניף</Typography>
//                                     <LocationIcon sx={{ color: '#667eea', fontSize: 18 }} />
//                                   </Box>
//                                 </TableCell>

//                                 <TableCell
//                                   align="right"
//                                   sx={{
//                                     fontWeight: 'bold',
//                                     fontSize: '1rem',
//                                     background: '#f8fafc',
//                                     py: 2,
//                                     textAlign: 'right',
//                                     direction: 'rtl'
//                                   }}
//                                 >
//                                   <Box sx={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'flex-start', // ✅ שיניתי
//                                     gap: 1,
//                                     direction: 'rtl'
//                                   }}>
//                                     <Typography sx={{ fontWeight: 'bold' }}>מדריך</Typography>
//                                     <PersonIcon sx={{ color: '#667eea', fontSize: 18 }} />
//                                   </Box>
//                                 </TableCell>

//                                 <TableCell
//                                   align="right"
//                                   sx={{
//                                     fontWeight: 'bold',
//                                     fontSize: '1rem',
//                                     background: '#f8fafc',
//                                     py: 2,
//                                     textAlign: 'right',
//                                     direction: 'rtl'
//                                   }}
//                                 >
//                                   <Box sx={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'flex-start', // ✅ שיניתי
//                                     gap: 1,
//                                     direction: 'rtl'
//                                   }}>
//                                     <Typography sx={{ fontWeight: 'bold' }}>יום ושעה</Typography>
//                                     <ScheduleIcon sx={{ color: '#667eea', fontSize: 18 }} />
//                                   </Box>
//                                 </TableCell>

//                                 <TableCell
//                                   align="right"
//                                   sx={{
//                                     fontWeight: 'bold',
//                                     fontSize: '1rem',
//                                     background: '#f8fafc',
//                                     py: 2,
//                                     textAlign: 'right',
//                                     direction: 'rtl'
//                                   }}
//                                 >
//                                   <Box sx={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'flex-start', // ✅ שיניתי
//                                     gap: 1,
//                                     direction: 'rtl'
//                                   }}>
//                                     <Typography sx={{ fontWeight: 'bold' }}>תאריך התחלה</Typography>
//                                     <CalendarIcon sx={{ color: '#667eea', fontSize: 18 }} />
//                                   </Box>
//                                 </TableCell>

//                                 <TableCell
//                                   align="right"
//                                   sx={{
//                                     fontWeight: 'bold',
//                                     fontSize: '1rem',
//                                     background: '#f8fafc',
//                                     py: 2,
//                                     textAlign: 'right',
//                                     direction: 'rtl'
//                                   }}
//                                 >
//                                   <Box sx={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'flex-start', // ✅ שיניתי
//                                     gap: 1,
//                                     direction: 'rtl'
//                                   }}>
//                                     <Typography sx={{ fontWeight: 'bold' }}>סטטוס</Typography>
//                                     <AssignmentIcon sx={{ color: '#667eea', fontSize: 18 }} />
//                                   </Box>
//                                 </TableCell>
//                               </TableRow>
//                             </TableHead>
//                             <TableBody>
//                               <AnimatePresence>
//                                 {studentCourses.map((course, index) => (
//                                   <TableRow
//                                     key={course.groupStudentId || index}
//                                     component={motion.tr}
//                                     initial={{ opacity: 0, y: 10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: index * 0.05 }}
//                                     sx={{
//                                       '&:nth-of-type(even)': { backgroundColor: 'rgba(248, 250, 252, 0.8)' },
//                                       '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.05)' }
//                                     }}
//                                   >
//                                     <TableCell align="right" sx={{ py: 2 }}> {/* ✅ הגדלתי מ-1.5 */}
//                                       <Typography sx={{
//                                         fontWeight: 'medium',
//                                         fontSize: '1rem', // ✅ הגדלתי מ-0.875rem
//                                         color: '#2d3748'
//                                       }}>
//                                         {course.courseName}
//                                       </Typography>
//                                     </TableCell>

//                                     <TableCell align="right" sx={{ py: 2 }}>
//                                       <Chip
//                                         label={course.groupName}
//                                         size="medium" // ✅ הגדלתי מ-small
//                                         sx={{
//                                           background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
//                                           color: '#8b4513',
//                                           fontWeight: 'medium',
//                                           borderRadius: '12px',
//                                           fontSize: '0.875rem' // ✅ הגדלתי מ-0.75rem
//                                         }}
//                                       />
//                                     </TableCell>

//                                     <TableCell align="right" sx={{ py: 2 }}>
//                                       <Typography sx={{ fontSize: '1rem' }}> {/* ✅ הגדלתי מ-0.875rem */}
//                                         {course.branchName}
//                                       </Typography>
//                                     </TableCell>

//                                     <TableCell align="right" sx={{ py: 2 }}>
//                                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
//                                         <Avatar sx={{
//                                           width: 32, // ✅ הגדלתי מ-28
//                                           height: 32,
//                                           background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
//                                           color: '#2d3748',
//                                           fontSize: '0.875rem' // ✅ הגדלתי מ-0.75rem
//                                         }}>
//                                           {course.instructorName?.charAt(0)}
//                                         </Avatar>
//                                         <Typography sx={{ fontSize: '0.85rem' }}> {/* ✅ הגדלתי מ-0.875rem */}
//                                           {course.instructorName}
//                                         </Typography>
//                                       </Box>
//                                     </TableCell>
//                                     <TableCell align="right" sx={{ py: 2 }}>
//                                       <Box sx={{
//                                         background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
//                                         borderRadius: '8px',
//                                         p: 1.5, // ✅ הגדלתי מ-1
//                                         textAlign: 'center'
//                                       }}>
//                                         <Typography sx={{
//                                           fontWeight: 'medium',
//                                           color: '#3730a3',
//                                           fontSize: '0.9rem' // ✅ הגדלתי מ-0.8rem
//                                         }}>
//                                           {course.dayOfWeek}
//                                         </Typography>
//                                         <Typography sx={{
//                                           fontSize: '0.85rem', // ✅ הגדלתי מ-0.75rem
//                                           color: '#5b21b6'
//                                         }}>
//                                           {course.hour}
//                                         </Typography>
//                                       </Box>
//                                     </TableCell>
//                                     <TableCell align="center" sx={{ py: 2 }}>

//                                       <Typography sx={{
//                                         fontSize: '0.85rem',
//                                       }}>
//                                         {course.enrollmentDate}
//                                       </Typography>

//                                     </TableCell>

//                                     <TableCell align="right" sx={{ py: 2 }}>
//                                       <Chip
//                                         icon={course.isActive === true ? <CheckIcon sx={{ fontSize: 18 }} /> : <CloseIcon sx={{ fontSize: 18 }} />}
//                                         label={course.isActive ? 'פעיל' : 'לא פעיל'}
//                                         color={course.isActive === true ? "success" : "error"}
//                                         variant="outlined"
//                                         size="medium" // ✅ הגדלתי מ-small
//                                         sx={{ fontSize: '0.875rem' }} // ✅ הגדלתי מ-0.75rem
//                                       />
//                                     </TableCell>
//                                   </TableRow>
//                                 ))}
//                               </AnimatePresence>
//                             </TableBody>
//                           </Table>
//                         </TableContainer>
//                       </Card>
//                     </Box>
//                   ) : (
//                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
//                       <InfoIcon sx={{ fontSize: 50, color: '#94a3b8', mb: 2 }} />
//                       <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#2d3748', mb: 2, textAlign: 'center' }}>
//                         אין חוגים רשומים לתלמיד זה
//                       </Typography>
//                       {showAddButton && (
//                         <Button
//                           variant="contained"
//                           size="medium"
//                           startIcon={<Add />}
//                           onClick={() => {
//                             navigate('/entrollStudent');
//                             onClose();
//                           }}
//                           sx={{
//                             background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
//                             borderRadius: '20px',
//                             px: 3,
//                             py: 1.5,
//                             fontSize: '1rem', // ✅ הגדלתי מ-0.95rem
//                             fontWeight: 'medium'
//                           }}
//                         >
//                           הוסף חוג ראשון
//                         </Button>
//                       )}
//                     </Box>
//                   )}
//                 </>
//               )}

//               {/* טאב ההערות */}
//               {currentTab === 1 && (
//                 <motion.div
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   {renderStudentNotes()}
//                 </motion.div>
//               )}
//               {currentTab === 2 && (
//                 <motion.div
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <StudentAttendanceHistory
//                     student={student}
//                     embedded={true}
//                     open={true}
//                   />
//                 </motion.div>
//               )}
//             </Box>
//           </DialogContent>

//           <Divider sx={{ background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)' }} />

//           <DialogActions sx={{ p: 2.5, background: 'white', justifyContent: 'space-between' }}>
//   <Box sx={{ display: 'flex', gap: 1.5 }}>
//     {showAddButton && currentTab === 0 && (
//       <Button
//         variant="contained"
//         size="medium"
//         startIcon={<Add sx={{ fontSize: 20 }} />}
//         onClick={() => {
//           navigate('/entrollStudent');
//           onClose();
//         }}
//         sx={{
//           background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
//           borderRadius: '20px',
//           px: 3,
//           py: 1.2,
//           fontSize: '1rem',
//           fontWeight: 'medium'
//         }}
//       >
//         הוסף חוג
//       </Button>
//     )}

//     {currentTab === 1 && (
//       <Button
//         variant="contained"
//         size="medium"
//         startIcon={<Add sx={{ fontSize: 20 }} />}
//         onClick={() => setAddNoteDialogOpen(true)}
//         sx={{
//           background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//           borderRadius: '20px',
//           px: 3,
//           py: 1.2,
//           fontSize: '1rem',
//           fontWeight: 'medium'
//         }}
//       >
//         הוסף הערה
//       </Button>
//     )}

//     {currentTab === 2 && (
//       <Button
//         variant="contained"
//         size="medium"
//         startIcon={<ScheduleIcon sx={{ fontSize: 20 }} />}
//         onClick={() => {
//           navigate('/attendanceCalendar');
//           onClose();
//         }}
//         sx={{
//           background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
//           borderRadius: '20px',
//           px: 3,
//           py: 1.2,
//           fontSize: '1rem',
//           fontWeight: 'medium'
//         }}
//       >
//         רשום נוכחות
//       </Button>
//     )}
//   </Box>

//   <Button
//     onClick={onClose}
//     variant="outlined"
//     size="medium"
//     sx={{
//       borderRadius: '20px',
//       px: 4,
//       py: 1.2,
//       fontSize: '1rem',
//       fontWeight: 'medium',
//       borderColor: '#667eea',
//       color: '#667eea',
//       '&:hover': {
//         borderColor: '#764ba2',
//         color: '#764ba2',
//         background: 'rgba(102, 126, 234, 0.05)'
//       }
//     }}
//   >
//     סגור
//   </Button>
// </DialogActions>


//           {/* דיאלוג הוספת הערה */}
//           <AddStudentNoteDialog
//             open={addNoteDialogOpen}
//             onClose={() => setAddNoteDialogOpen(false)}
//             student={student}
//             onSave={handleSaveNote}
//           />
//         </Dialog>
//       )}
//     </AnimatePresence>
//   );
// };

// export default StudentCoursesDialog;


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
  MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon  // ← הוסף את אלה כאן
} from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNotesByStudentId } from '../../../store/studentNotes/studentNotesGetById';
import AddStudentNoteDialog from './addStudentNoteDialog';
import { addStudentNote } from '../../../store/studentNotes/studentNoteAddThunk';
import StudentAttendanceHistory from './studentAttendanceHistory';
import { RefreshCwIcon } from 'lucide-react';
import { deleteStudentNote } from '../../../store/studentNotes/studentNoteDeleteThunk';
import { updateStudentNote } from '../../../store/studentNotes/studentNoteUpdateThunk';

const StudentCoursesDialog = ({
  open,
  onClose,
  student,
  studentCourses = [],
  showAddButton = true,
  title = null,
  subtitle = null
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState(0);
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const studentNotes = useSelector((state) => state.studentNotes.studentNotes);
  const notesLoading = useSelector((state) => state.studentNotes.loading);

  const [editNoteDialogOpen, setEditNoteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuNoteId, setMenuNoteId] = useState(null);


  useEffect(() => {
    if (open && student?.id) {
      dispatch(getNotesByStudentId(student.id));
    }
  }, [open, student?.id, dispatch]);

  if (!student) return null;

  const dialogTitle = title || `${student.firstName} ${student.lastName}`;
  const dialogSubtitle = subtitle || `ת"ז: ${student.id}`;

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
    try {
      await dispatch(addStudentNote(noteData));
      dispatch(getNotesByStudentId(student.id));
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
const renderStudentNotes = () => {
   console.log('student object:', student);
    console.log('studentNotes:', studentNotes);
    console.log('studentNotes length:', studentNotes?.length);
    console.log('studentNotes type:', typeof studentNotes,  typeof studentNotes);
    if (!studentNotes || studentNotes.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                אין הערות עבור תלמיד זה
            </Typography>
        );
    }

    // הגדר את הסוגים והעדיפויות כאן
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
                    // הגדר את הסוג והעדיפות לכל הערה
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
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {note.noteType}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(note.createdDate).toLocaleDateString('he-IL')} • {note.authorName}
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
          {/* Header - צבע חדש */}
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // ✅ ירוק במקום סגול
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
                    background: 'rgba(255, 255, 255, 0.2)', // ✅ שקוף לבן
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
            {/* טאבים - עיצוב אחיד */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{ px: 2 }}
              >
                <Tab
                  icon={<CourseIcon />}
                  label={`חוגים (${studentCourses.length})`}
                  iconPosition="start"
                  sx={{
                    minHeight: '60px',
                    fontSize: '0.95rem'
                  }}
                />
                <Tab
                  icon={<NotesIcon />}
                  label={`הערות (${studentNotes?.length || 0})`}
                  iconPosition="start"
                  sx={{
                    minHeight: '60px',
                    fontSize: '0.95rem'
                  }}
                />
                <Tab
                  icon={<HistoryIcon />}
                  label="מעקב נוכחות"
                  iconPosition="start"
                  sx={{
                    minHeight: '60px',
                    fontSize: '0.95rem'
                  }}
                />
              </Tabs>
            </Box>

            {/* תוכן הטאבים */}
            <Box sx={{ p: 2.5 }}>
              {currentTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* טאב החוגים */}
                  {studentCourses && studentCourses.length > 0 ? (
                    <Box>
                      {/* סטטיסטיקות - צבעים אחידים */}
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, mb: 2.5, height: '150px' }}>
                        <Card sx={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // ✅ ירוק
                          color: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <CourseIcon sx={{ fontSize: 36, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                              {studentCourses.length}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              חוגים רשומים
                            </Typography>
                          </CardContent>
                        </Card>

                        <Card sx={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', // ✅ כחול
                          color: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            {/* <CheckIcon sx={{ fontSize: */}
                            <CheckIcon sx={{ fontSize: 36, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                              {studentCourses.filter(c => c.isActive).length}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              חוגים פעילים
                            </Typography>
                          </CardContent>
                        </Card>

                        <Card sx={{
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // ✅ סגול
                          color: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <LocationIcon sx={{ fontSize: 36, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                              {new Set(studentCourses.map(c => c.branchName)).size}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              סניפים שונים
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>

                      {/* טבלת החוגים - עיצוב אחיד */}
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
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', // ✅ גרדיאנט עדין
                                    py: 2,
                                    textAlign: 'right',
                                    direction: 'rtl',
                                    borderBottom: '2px solid #10b981' // ✅ גבול ירוק
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
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <AnimatePresence>
                                {studentCourses.map((course, index) => (
                                  <TableRow
                                    key={course.groupStudentId || index}
                                    sx={{
                                      '&:nth-of-type(even)': { backgroundColor: 'rgba(16, 185, 129, 0.03)' }, // ✅ ירוק עדין
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
                                        fontWeight: 'small',
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
                                          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', // ✅ כחול
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
                                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // ✅ סגול
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
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // ✅ כתום
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
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // ✅ ירוק
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

              {/* טאב הנוכחות - עיצוב משודרג */}
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
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // ✅ סגול במקום כתום
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
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // ✅ ירוק
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
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', // ✅ כחול להערות
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
                borderColor: '#10b981', // ✅ גבול ירוק
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

          {/* Edit Note Dialog */}
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

          {/* Delete Dialog */}
          <Dialog
            open={deleteConfirmOpen}
            onClose={() => {
              setDeleteConfirmOpen(false);
              setNoteToDelete(null);
            }}
            sx={{
              direction:'rtl'
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

          {/* Menu for note actions */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                const note = studentNotes.find(n => n.noteId === menuNoteId);
                handleEditNote(note);
              }}
            >
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              עריכה
            </MenuItem>
            <MenuItem
              onClick={() => {
                const note = studentNotes.find(n => n.noteId === menuNoteId);
                handleDeleteConfirm(note);
              }}
              sx={{ color: '#dc2626' }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              מחיקה
            </MenuItem>
          </Menu>

        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default StudentCoursesDialog;
