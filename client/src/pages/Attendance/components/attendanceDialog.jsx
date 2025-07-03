// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { motion } from 'framer-motion';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Typography, Box, Button, IconButton, Grid, Divider,
//   List, ListItem, ListItemText, ListItemIcon, Avatar,
//   Checkbox, TextField, Chip, Paper, useMediaQuery, useTheme,
//   Alert
// } from '@mui/material';
// import {
//   Close, Group, CheckCircle, Cancel, Save, Comment,
//   Person, Check, AccessTime, LocationOn, School
// } from '@mui/icons-material';
// import { format } from 'date-fns';
// import { he } from 'date-fns/locale';
// import { styles } from '../styles/dialogStyles';

// const AttendanceDialog = ({
//   open,
//   onClose,
//   selectedDate,
//   selectedCourse,
//   selectedBranch,
//   selectedGroup,
//   students = [],
//   attendanceData = {},
//   onAttendanceChange,
//   onSave
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [note, setNote] = useState('');

//   // Debug logs
//   useEffect(() => {
//     console.log('📋 AttendanceDialog - Props changed:', {
//       open,
//       selectedGroup: selectedGroup?.groupName,
//       selectedCourse: selectedCourse?.courseName || selectedCourse?.couresName,
//       selectedBranch: selectedBranch?.branchName || selectedBranch?.name,
//       studentsCount: students?.length || 0,
//       attendanceDataKeys: Object.keys(attendanceData || {}).length
//     });
    
//     // אפס את ההערה כשמשנים קבוצה
//     if (open && selectedGroup) {
//       setNote('');
//     }
//   }, [open, selectedGroup, selectedCourse, selectedBranch, students, attendanceData]);

//   // קבלת נתוני נוכחות מ-Redux
//   const attendanceRecords = useSelector(state => state.attendance?.records || {});
//   const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
//   const hasExistingAttendance = attendanceRecords[dateString]?.length > 0;

//   // חישוב סטטיסטיקות נוכחות - עם בדיקת תקינות
//   const presentCount = students && Object.keys(attendanceData).length > 0 ?
//     Object.values(attendanceData).filter(present => present).length : 0;
//   const totalStudents = students ? students.length : 0;
//   const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

//   // סימון כל התלמידים כנוכחים
//   const markAllPresent = () => {
//     if (students && students.length > 0) {
//       students.forEach(student => {
//         const studentId = student.studentId || student.id;
//         if (studentId && onAttendanceChange) {
//           onAttendanceChange(studentId, true);
//         }
//       });
//     }
//   };

//   // סימון כל התלמידים כנעדרים
//   const markAllAbsent = () => {
//     if (students && students.length > 0) {
//       students.forEach(student => {
//         const studentId = student.studentId || student.id;
//         if (studentId && onAttendanceChange) {
//           onAttendanceChange(studentId, false);
//         }
//       });
//     }
//   };

//   // טיפול בשמירה עם הערות
//   const handleSave = () => {
//     if (onSave) {
//       onSave(note);
//       setNote('');
//     }
//   };

//   // בדיקה אם הדיאלוג צריך להיות פתוח
//   if (!open || !selectedCourse || !selectedBranch || !selectedGroup || !selectedDate) {
//     console.log('❌ AttendanceDialog - Missing required props:', {
//       open,
//       selectedCourse: !!selectedCourse,
//       selectedBranch: !!selectedBranch,
//       selectedGroup: !!selectedGroup,
//       selectedDate: !!selectedDate
//     });
//     return null;
//   }

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       sx={{
//         '& .MuiDialog-paper': {
//           borderRadius: '20px',
//           maxHeight: '90vh',
//           direction: 'rtl'
//         }
//       }}
//     >
//       <DialogTitle sx={styles.dialogTitle}>
//         <Box sx={styles.dialogTitleContent}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Avatar sx={{
//               backgroundColor: theme.palette.primary.main,
//               width: 48,
//               height: 48
//             }}>
//               <Group />
//             </Avatar>
//             <Box>
//               <Typography variant="h6" sx={styles.dialogTitleText}>
//                 רישום נוכחות
//               </Typography>
//               <Typography variant="subtitle2" color="textSecondary">
//                 {selectedCourse?.courseName || selectedCourse?.couresName || 'חוג לא זמין'} - 
//                 קבוצה {selectedGroup?.groupName || 'לא זמין'}
//               </Typography>
//             </Box>
//           </Box>
          
//           {hasExistingAttendance && (
//             <Chip
//               label="נוכחות קיימת"
//               color="info"
//               size="small"
//               sx={{ ml: 2 }}
//             />
//           )}
          
//           <IconButton
//             edge="end"
//             color="inherit"
//             onClick={onClose}
//             aria-label="close"
//             sx={styles.closeButton}
//           >
//             <Close />
//           </IconButton>
//         </Box>
        
//         <Box sx={{ mt: 1, px: 1 }}>
//           <Typography variant="body2" sx={styles.dialogSubtitle}>
//             {selectedDate && format(selectedDate, 'EEEE, d MMMM yyyy', { locale: he })} | 
//             שעה: {selectedGroup?.hour || 'לא צוין'} | 
//             סניף: {selectedBranch?.branchName || selectedBranch?.name || 'לא זמין'}
//           </Typography>
//         </Box>
//       </DialogTitle>

//       <DialogContent sx={{ ...styles.dialogContent, p: 3 }}>
//         {hasExistingAttendance && (
//           <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
//             <Typography variant="body2">
//               נוכחות כבר נרשמה לתאריך זה. שמירה חוזרת תחליף את הנתונים הקיימים.
//             </Typography>
//           </Alert>
//         )}

//         {/* סטטיסטיקות מהירות */}
//         <Paper sx={{
//           p: 2,
//           mb: 3,
//           backgroundColor: '#f8f9fa',
//           borderRadius: 2,
//           border: '1px solid #e9ecef'
//         }}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={3}>
//               <Box sx={{ textAlign: 'center' }}>
//                 <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
//                   {totalStudents}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   סה"כ תלמידים
//                 </Typography>
//               </Box>
//             </Grid>
            
//             <Grid item xs={12} sm={3}>
//               <Box sx={{ textAlign: 'center' }}>
//                 <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
//                   {presentCount}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   נוכחים
//                 </Typography>
//               </Box>
//             </Grid>
            
//             <Grid item xs={12} sm={3}>
//               <Box sx={{ textAlign: 'center' }}>
//                 <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
//                   {totalStudents - presentCount}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   נעדרים
//                 </Typography>
//               </Box>
//             </Grid>
            
//             <Grid item xs={12} sm={3}>
//               <Box sx={{ textAlign: 'center' }}>
//                 <Typography variant="h4" sx={{ 
//                   fontWeight: 'bold', 
//                   color: attendancePercentage >= 80 ? '#4caf50' : 
//                          attendancePercentage >= 60 ? '#ff9800' : '#f44336'
//                 }}>
//                   {attendancePercentage}%
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   אחוז נוכחות
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* כפתורי פעולה מהירה */}
//         <Box sx={{ 
//           display: 'flex', 
//           gap: 2, 
//           mb: 3,
//           justifyContent: 'center'
//         }}>
//           <Button
//             variant="contained"
//             color="success"
//             startIcon={<CheckCircle />}
//             onClick={markAllPresent}
//             sx={{ borderRadius: 2, px: 3 }}
//           >
//             סמן הכל כנוכחים
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             startIcon={<Cancel />}
//             onClick={markAllAbsent}
//             sx={{ borderRadius: 2, px: 3 }}
//           >
//             סמן הכל כנעדרים
//           </Button>
//         </Box>

//         {/* רשימת תלמידים */}
//         <Paper sx={{
//           borderRadius: 2,
//           overflow: 'hidden',
//           border: '1px solid #e0e0e0'
//         }}>
//           <Box sx={{
//             backgroundColor: '#f5f5f5',
//             p: 2,
//             borderBottom: '1px solid #e0e0e0'
//           }}>
//             <Typography variant="h6" sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               gap: 1,
//               fontWeight: 'bold'
//             }}>
//               <Person />
//               רשימת תלמידים ({students.length})
//             </Typography>
//           </Box>

//           <List sx={styles.studentsList}>
//             {students.map((student, index) => {
//               const studentId = student.studentId || student.id;
//               const uniqueKey = `${selectedGroup?.groupId || 'no-group'}-${studentId || index}-${selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'no-date'}`;
              
//               return (
//                 <React.Fragment key={uniqueKey}>
//                   <ListItem
//                     sx={{
//                       ...styles.studentListItem,
//                       ...(index % 2 === 0 ? styles.evenRow : {})
//                     }}
//                   >
//                     <ListItemIcon sx={styles.studentAvatar}>
//                       <Avatar
//                         src={student.imageUrl}
//                         sx={{
//                           ...styles.avatar,
//                           ...(attendanceData[studentId] ? styles.presentAvatar : styles.absentAvatar)
//                         }}
//                       >
//                         {student.studentName ? student.studentName.charAt(0) : 'ת'}
//                       </Avatar>
//                     </ListItemIcon>

//                     <Box sx={{ flex: 1, mr: 2 }}> 
//                       <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
//                         {student.studentName || 'תלמיד ללא שם'}
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
//                         <Typography variant="body2" color="textSecondary">
//                           גיל: {student.age || 'לא צוין'}
//                         </Typography>
//                         {student.attendanceRate && (
//                           <>
//                             <Typography variant="body2" color="textSecondary">•</Typography>
//                             <Chip
//                               label={`נוכחות כללית: ${student.attendanceRate}%`}
//                               size="small"
//                               color={
//                                 student.attendanceRate > 90 ? 'success' :
//                                   student.attendanceRate > 75 ? 'primary' :
//                                     student.attendanceRate > 60 ? 'warning' : 'error'
//                               }
//                               variant="outlined"
//                             />
//                           </>
//                         )}
//                       </Box>
//                     </Box>

//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                       <Chip
//                         label={attendanceData[studentId] ? 'נוכח' : 'נעדר'}
//                         color={attendanceData[studentId] ? 'success' : 'error'}
//                         variant="filled"
//                         sx={{ 
//                           fontWeight: 'bold', 
//                           minWidth: 70,
//                           fontSize: '0.8rem'
//                         }}
//                       />
                      
//                       <Checkbox
//                         edge="end"
//                         checked={attendanceData[studentId] || false}
//                         onChange={() => {
//                           if (onAttendanceChange && studentId) {
//                             onAttendanceChange(studentId, !attendanceData[studentId]);
//                           }
//                         }}
//                         icon={<Cancel sx={{ fontSize: 32 }} color="error" />}
//                         checkedIcon={<CheckCircle sx={{ fontSize: 32 }} color="success" />}
//                         sx={{
//                           '&:hover': {
//                             backgroundColor: 'transparent'
//                           },
//                           '& .MuiSvgIcon-root': {
//                             transition: 'all 0.2s ease-in-out'
//                           }
//                         }}
//                       />
//                     </Box>
//                   </ListItem>
//                   {index < students.length - 1 && <Divider key={`divider-${uniqueKey}`} />}
//                 </React.Fragment>
//               );
//             })}
//           </List>
//         </Paper>

//         {students.length === 0 && (
//           <Box sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             minHeight: 200,
//             gap: 2
//           }}>
//             <Avatar sx={{
//               width: 80,
//               height: 80,
//               backgroundColor: '#f5f5f5',
//               color: '#999'
//             }}>
//               <Person sx={{ fontSize: 40 }} />
//             </Avatar>
//             <Typography variant="h6" color="text.secondary">
//               אין תלמידים רשומים לקבוצה
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               נסה לבחור קבוצה אחרת או פנה למנהל המערכת
//             </Typography>
//           </Box>
//         )}

//         {/* הערות לשיעור */}
//         <Box sx={{ mt: 3 }}>
//           <Typography variant="h6" sx={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             gap: 1,
//             mb: 2,
//             fontWeight: 'bold'
//           }}>
//             <Comment />
//             הערות לשיעור
//           </Typography>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             placeholder="הוסף הערות לגבי השיעור, התקדמות התלמידים, או כל מידע רלוונטי אחר..."
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             variant="outlined"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 2
//               }
//             }}
//           />
//         </Box>

//         {/* אינדיקטור התקדמות נוכחות */}
//         <Box sx={{ mt: 3 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               התקדמות רישום נוכחות
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//               {presentCount}/{totalStudents} ({attendancePercentage}%)
//             </Typography>
//           </Box>
          
//           <Box sx={{
//             width: '100%',
//             height: 12,
//             backgroundColor: '#e0e0e0',
//             borderRadius: 6,
//             overflow: 'hidden'
//           }}>
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${attendancePercentage}%` }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               style={{
//                 height: '100%',
//                 background: attendancePercentage >= 80 
//                   ? 'linear-gradient(90deg, #4caf50, #66bb6a)'
//                   : attendancePercentage >= 60 
//                     ? 'linear-gradient(90deg, #ff9800, #ffb74d)'
//                     : 'linear-gradient(90deg, #f44336, #ef5350)',
//                 borderRadius: '6px'
//               }}
//             />
//           </Box>
//         </Box>

//         {/* מידע נוסף על הקבוצה */}
//         <Paper sx={{
//           mt: 3,
//           p: 2,
//           backgroundColor: theme.palette.grey[50],
//           borderRadius: 2,
//           border: `1px solid ${theme.palette.grey[200]}`
//         }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={4}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <School sx={{ fontSize: 16, color: 'text.secondary' }} />
//                 <Typography variant="body2" color="textSecondary">
//                   חוג: {selectedCourse?.courseName || selectedCourse?.couresName || 'לא זמין'}
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
//                 <Typography variant="body2" color="textSecondary">
//                   סניף: {selectedBranch?.branchName || selectedBranch?.name || 'לא זמין'}
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
//                 <Typography variant="body2" color="textSecondary">
//                   שעה: {selectedGroup?.hour || 'לא צוין'}
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>
//       </DialogContent>

//       <DialogActions sx={{ 
//         p: 3, 
//         backgroundColor: '#f8f9fa',
//         borderTop: '1px solid #e0e0e0',
//         gap: 2,
//         justifyContent: 'space-between'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <Typography variant="caption" color="textSecondary">
//             {totalStudents > 0 ? `${presentCount} מתוך ${totalStudents} תלמידים נוכחים` : 'אין תלמידים'}
//           </Typography>
//         </Box>
        
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             onClick={onClose}
//             variant="outlined"
//             color="error"
//             size="large"
//             sx={{ 
//               borderRadius: 2,
//               px: 4,
//               py: 1.5
//             }}
//           >
//             ביטול
//           </Button>
          
//           <Button
//             variant="contained"
//             startIcon={<Save />}
//             onClick={handleSave}
//             disabled={students.length === 0}
//             size="large"
//             sx={{ 
//               borderRadius: 2,
//               px: 4,
//               py: 1.5,
//               background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
//               '&:hover': {
//                 background: 'linear-gradient(45deg, #1976d2, #00bcd4)'
//               },
//               '&:disabled': {
//                 background: '#ccc',
//                 color: '#666'
//               }
//             }}
//           >
//             שמור נוכחות
//           </Button>
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AttendanceDialog;
// import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Button, IconButton, Grid, Divider,
  List, ListItem, ListItemText, ListItemIcon, Avatar,
  Checkbox, TextField, Chip, Paper, useMediaQuery, useTheme,
  Alert, CircularProgress
} from '@mui/material';
import {
  Close, Group, CheckCircle, Cancel, Save, Comment,
  Person, Check, AccessTime, LocationOn, School
} from '@mui/icons-material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { styles } from '../styles/dialogStyles';
 import React, { useEffect, useState } from 'react';

const AttendanceDialog = ({
  open,
  onClose,
  selectedDate,
  selectedCourse,
  selectedBranch,
  selectedGroup,
  students = [],
  attendanceData = {},
  onAttendanceChange,
  onSave,
  // הוסף props חדשים
  courseName,
  branchName,
  groupName
}) => {
  // כל ה-hooks כמו קודם...
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [note, setNote] = useState('');
  const attendanceRecords = useSelector(state => state.attendance?.records || {});
  
  // חישוב ערכים
  const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const hasExistingAttendance = attendanceRecords[dateString]?.length > 0;
  const presentCount = students && Object.keys(attendanceData).length > 0 ?
    Object.values(attendanceData).filter(present => present).length : 0;
  const totalStudents = students ? students.length : 0;
  const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  // השתמש בנתונים שהועברו כ-props במקום לחפש אותם
  const displayCourseName = courseName || selectedCourse?.courseName || selectedCourse?.couresName || selectedCourse?.name || 'חוג לא זמין';
  const displayBranchName = branchName || selectedBranch?.branchName || selectedBranch?.name || 'סניף לא זמין';
  const displayGroupName = groupName || selectedGroup?.groupName || selectedGroup?.name || 'קבוצה לא זמינה';

  useEffect(() => {
    console.log('📋 AttendanceDialog - Display names:', {
      displayCourseName,
      displayBranchName,
      displayGroupName,
      courseName,
      branchName,
      groupName
    });
  }, [displayCourseName, displayBranchName, displayGroupName, courseName, branchName, groupName]);

  // שאר הפונקציות כמו קודם...
  const markAllPresent = () => {
    if (students && students.length > 0) {
      students.forEach(student => {
        const studentId = student.studentId || student.id;
        if (studentId && onAttendanceChange) {
          onAttendanceChange(studentId, true);
        }
      });
    }
  };

  const markAllAbsent = () => {
    if (students && students.length > 0) {
      students.forEach(student => {
        const studentId = student.studentId || student.id;
        if (studentId && onAttendanceChange) {
          onAttendanceChange(studentId, false);
        }
      });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(note);
      setNote('');
    }
  };

  if (!open) {
    return null;
  }

  // בדיקה פשוטה יותר
  if (!selectedDate) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '20px',
            direction: 'rtl'
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            טוען נתוני הקבוצה...
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          maxHeight: '90vh',
          direction: 'rtl'
        }
      }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        <Box sx={styles.dialogTitleContent}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              backgroundColor: theme.palette.primary.main,
              width: 48,
              height: 48
            }}>
              <Group />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={styles.dialogTitleText}>
                רישום נוכחות
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {displayCourseName} - קבוצה {displayGroupName}
              </Typography>
            </Box>
          </Box>
          
          {hasExistingAttendance && (
            <Chip
              label="נוכחות קיימת"
              color="info"
              size="small"
              sx={{ ml: 2 }}
            />
          )}
          
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            sx={styles.closeButton}
          >
            <Close />
          </IconButton>
        </Box>
        
        <Box sx={{ mt: 1, px: 1 }}>
          <Typography variant="body2" sx={styles.dialogSubtitle}>
            {selectedDate && format(selectedDate, 'EEEE, d MMMM yyyy', { locale: he })} | 
            שעה: {selectedGroup?.hour || 'לא צוין'} | 
            סניף: {displayBranchName}
          </Typography>
        </Box>
      </DialogTitle>

      {/* שאר התוכן נשאר כמו קודם... */}
      <DialogContent sx={{ ...styles.dialogContent, p: 3 }}>
        {/* כל התוכן כמו קודם */}
        {hasExistingAttendance && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              נוכחות כבר נרשמה לתאריך זה. שמירה חוזרת תחליף את הנתונים הקיימים.
            </Typography>
          </Alert>
        )}

        {/* סטטיסטיקות מהירות */}
        <Paper sx={{
          p: 2,
          mb: 3,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid #e9ecef'
        }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                  {totalStudents}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  סה"כ תלמידים
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  {presentCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  נוכחים
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                  {totalStudents - presentCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  נעדרים
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: attendancePercentage >= 80 ? '#4caf50' : 
                         attendancePercentage >= 60 ? '#ff9800' : '#f44336'
                }}>
                  {attendancePercentage}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  אחוז נוכחות
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* כפתורי פעולה מהירה */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          justifyContent: 'center'
        }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={markAllPresent}
            sx={{ borderRadius: 2, px: 3 }}
          >
            סמן הכל כנוכחים
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Cancel />}
            onClick={markAllAbsent}
            sx={{ borderRadius: 2, px: 3 }}
          >
            סמן הכל כנעדרים
          </Button>
        </Box>

        {/* רשימת תלמידים */}
        <Paper sx={{
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e0e0e0'
        }}>
          <Box sx={{
            backgroundColor: '#f5f5f5',
            p: 2,
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontWeight: 'bold'
            }}>
              <Person />
              רשימת תלמידים ({students.length})
            </Typography>
          </Box>

          <List sx={styles.studentsList}>
            {students.map((student, index) => {
              const studentId = student.studentId || student.id;
              const uniqueKey = `${selectedGroup?.groupId || 'no-group'}-${studentId || index}-${selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'no-date'}`;
              
              return (
                <React.Fragment key={uniqueKey}>
                  <ListItem
                    sx={{
                      ...styles.studentListItem,
                      ...(index % 2 === 0 ? styles.evenRow : {})
                    }}
                  >
                    <ListItemIcon sx={styles.studentAvatar}>
                      <Avatar

                        src={student.imageUrl}
                        sx={{
                          ...styles.avatar,
                          ...(attendanceData[studentId] ? styles.presentAvatar : styles.absentAvatar)
                        }}
                      >
                        {student.studentName ? student.studentName.charAt(0) : 'ת'}
                      </Avatar>
                    </ListItemIcon>

                    <Box sx={{ flex: 1, mr: 2 }}> 
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {student.studentName || 'תלמיד ללא שם'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">
                          גיל: {student.age || 'לא צוין'}
                        </Typography>
                        {student.attendanceRate && (
                          <>
                            <Typography variant="body2" color="textSecondary">•</Typography>
                            <Chip
                              label={`נוכחות כללית: ${student.attendanceRate}%`}
                              size="small"
                              color={
                                student.attendanceRate > 90 ? 'success' :
                                  student.attendanceRate > 75 ? 'primary' :
                                    student.attendanceRate > 60 ? 'warning' : 'error'
                              }
                              variant="outlined"
                            />
                          </>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={attendanceData[studentId] ? 'נוכח' : 'נעדר'}
                        color={attendanceData[studentId] ? 'success' : 'error'}
                        variant="filled"
                        sx={{ 
                          fontWeight: 'bold', 
                          minWidth: 70,
                          fontSize: '0.8rem'
                        }}
                      />
                      
                      <Checkbox
                        edge="end"
                        checked={attendanceData[studentId] || false}
                        onChange={() => {
                          if (onAttendanceChange && studentId) {
                            onAttendanceChange(studentId, !attendanceData[studentId]);
                          }
                        }}
                        color="primary"
                        size="large"
                        sx={{
                          '& .MuiSvgIcon-root': {
                            fontSize: '1.5rem'
                          }
                        }}
                      />
                    </Box>
                  </ListItem>
                  
                  {index < students.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </Paper>

        {/* הערות */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ 
            mb: 2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <Comment />
            הערות (אופציונלי)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="הוסף הערות על השיעור או נוכחות התלמידים..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={styles.dialogActions}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderRadius: 2, 
            px: 3,
            borderColor: '#e0e0e0',
            color: '#666'
          }}
        >
          ביטול
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          startIcon={<Save />}
          disabled={!students || students.length === 0}
          sx={{ 
            borderRadius: 2, 
            px: 4,
            fontWeight: 'bold'
          }}
        >
          שמור נוכחות
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceDialog;

