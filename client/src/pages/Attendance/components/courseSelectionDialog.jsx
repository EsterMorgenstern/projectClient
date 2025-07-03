
// import React, { useState, useEffect, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Typography, Box, Button, IconButton, Grid, Card,
//   CardContent, CardHeader, Avatar, List, ListItem,
//   ListItemText, ListItemIcon, Collapse, Divider,
//   Paper, useMediaQuery, useTheme, Chip, Accordion,
//   AccordionSummary, AccordionDetails, CircularProgress,
//   Alert, AlertTitle
// } from '@mui/material';
// import {
//   Close, School, LocationOn, Group, ExpandMore,
//   ExpandLess, NavigateNext, AccessTime, Person,
//   EventBusy, Numbers, Security, Schedule, Today
// } from '@mui/icons-material';
// import { format } from 'date-fns';
// import { he } from 'date-fns/locale';
// import { styles } from '../styles/dialogStyles';

// const CourseSelectionDialog = ({
//   open,
//   onClose,
//   selectedDate,
//   groupsByDay = [],
//   groupsByDayLoading = false,
//   onGroupSelect
// }) => {
//   console.log('🏗️ CourseSelectionDialog rendered with props:', {
//     open,
//     selectedDate,
//     groupsByDayCount: groupsByDay?.length || 0,
//     onGroupSelectType: typeof onGroupSelect
//   });

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const [expandedCourse, setExpandedCourse] = useState(null);

//   // Reset state when dialog opens
//   useEffect(() => {
//     if (open) {
//       setExpandedCourse(null);
//     }
//   }, [open]);

//   // בדיקת תקינות של onGroupSelect
//   if (!onGroupSelect || typeof onGroupSelect !== 'function') {
//     console.error('❌ onGroupSelect is not a function:', onGroupSelect);
//   }

//   // פונקציה לטיפול בלחיצה על קבוצה
//  const handleGroupClick = async (group) => {
//   console.log('🖱️ Group card clicked:', group);
  
//   if (onGroupSelect && typeof onGroupSelect === 'function') {
//     try {
//       // סגור את הדיאלוג מיד
//       onClose();
      
//       // חכה רגע קצר ואז קרא לפונקציה
//       setTimeout(() => {
//         onGroupSelect(group);
//       }, 100);
      
//     } catch (error) {
//       console.error('❌ Error calling onGroupSelect:', error);
//       alert('שגיאה: לא ניתן לבחור קבוצה זו');
//     }
//   } else {
//     console.error('❌ onGroupSelect is not available or not a function');
//     alert('שגיאה: לא ניתן לבחור קבוצה זו');
//   }
// };
//   // ארגון הקבוצות לפי חוג וסניף
//   const organizedGroups = useMemo(() => {
//     if (!groupsByDay || groupsByDay.length === 0) return {};

//     const organized = {};

//     groupsByDay.forEach(group => {
//       const courseName = group.courseName || group.couresName || 'חוג לא ידוע';
//       const branchName = group.branchName || 'סניף לא ידוע';

//       if (!organized[courseName]) {
//         organized[courseName] = {};
//       }

//       if (!organized[courseName][branchName]) {
//         organized[courseName][branchName] = [];
//       }

//       organized[courseName][branchName].push(group);
//     });

//     return organized;
//   }, [groupsByDay]);

//   // בדיקת תקינות תאריך
//   if (!selectedDate) {
//     return (
//       <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{direction:'rtl'}}>
//         <DialogTitle>שגיאה</DialogTitle>
//         <DialogContent>
//           <Typography>לא נבחר תאריך תקין</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose}>סגור</Button>
//         </DialogActions>
//       </Dialog>
//     );
//   }

//   // Handle accordion expansion
//   const handleAccordionChange = (courseName) => (event, isExpanded) => {
//     setExpandedCourse(isExpanded ? courseName : null);
//   };

//   // קבלת צבע לפי חוג
//   const getCourseColor = (courseName) => {
//     const colors = [
//       '#1976d2', '#388e3c', '#f57c00', '#7b1fa2',
//       '#c2185b', '#00796b', '#5d4037', '#455a64',
//       '#e64a19', '#303f9f', '#689f38', '#fbc02d'
//     ];
    
//     let hash = 0;
//     for (let i = 0; i < courseName.length; i++) {
//       hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
//     }
    
//     return colors[Math.abs(hash) % colors.length];
//   };

//   // Render dialog title
//   const renderDialogTitle = () => {
//     const formattedDate = format(selectedDate, 'EEEE, d MMMM yyyy', { locale: he });
//     const dayName = format(selectedDate, 'EEEE', { locale: he });

//     return (
//       <DialogTitle sx={styles.dialogTitle}>
//         <Box sx={styles.dialogTitleContent}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Avatar sx={{ 
//               backgroundColor: theme.palette.primary.main,
//               width: 48,
//               height: 48
//             }}>
//               <Today />
//             </Avatar>
//             <Box>
//               <Typography variant="h6" sx={styles.dialogTitleText}>
//                 חוגים ביום {dayName}
//               </Typography>
//               <Typography variant="subtitle2" color="textSecondary">
//                 {formattedDate}
//               </Typography>
//             </Box>
//           </Box>
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
//       </DialogTitle>
//     );
//   };

//   // Render loading state
//   const renderLoadingState = () => (
//     <Box sx={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       minHeight: 200,
//       gap: 2
//     }}>
//       <CircularProgress size={48} thickness={4} />
//       <Typography variant="h6" color="textSecondary">
//         טוען חוגים...
//       </Typography>
//     </Box>
//   );

//   // Render empty state
//   const renderEmptyState = () => (
//     <Box sx={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       minHeight: 200,
//       gap: 2,
//       textAlign: 'center'
//     }}>
//       <Avatar sx={{
//         width: 80,
//         height: 80,
//         backgroundColor: theme.palette.grey[100],
//         color: theme.palette.grey[400]
//       }}>
//         <EventBusy sx={{ fontSize: 40 }} />
//       </Avatar>
//       <Typography variant="h6" color="textSecondary">
//         אין חוגים מתוכננים ליום זה
//       </Typography>
//       <Typography variant="body2" color="textSecondary">
//         נסה לבחור יום אחר או פנה למנהל המערכת
//       </Typography>
//     </Box>
//   );

//   // Render group card 
//   const renderGroupCard = (group, branchColor, uniqueKey) => {
//     return (
//       <Card
//         key={uniqueKey}
//         component={motion.div}
//         whileHover={{ scale: 1.02, y: -2 }}
//         whileTap={{ scale: 0.98 }}
//         sx={{
//           mb: 2,
//           cursor: 'pointer',
//           border: `2px solid transparent`,
//           transition: 'all 0.2s ease-in-out',
//           '&:hover': {
//             border: `2px solid ${branchColor}`,
//             boxShadow: `0 4px 20px ${branchColor}30`
//           }
//         }}
//         onClick={() => handleGroupClick(group)}
//       >
//         <CardContent sx={{ p: 3 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//             <Box>
//               <Typography variant="h6" sx={{ fontWeight: 'bold', color: branchColor, mb: 1 }}>
//                 {group.courseName || group.couresName || 'שם חוג לא זמין'}
//               </Typography>
//               <Typography variant="body2" color="textSecondary">
//                 קבוצה: {group.groupName || 'לא צוין'}
//               </Typography>
//             </Box>
//             <Chip
//               label={group.branchName || 'סניף לא זמין'}
//               sx={{
//                 backgroundColor: `${branchColor}20`,
//                 color: branchColor,
//                 fontWeight: 'bold'
//               }}
//             />
//           </Box>

//           <Divider sx={{ my: 2 }} />

//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
//                 <Typography variant="body2">
//                   {group.hour || 'שעה לא צוינה'}
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={6}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Group sx={{ fontSize: 16, color: 'text.secondary' }} />
//                 <Typography variant="body2">
//                   {group.studentsCount || 0} תלמידים
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>

//           <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
//             <Button
//               variant="contained"
//               size="small"
//               sx={{ 
//                 backgroundColor: branchColor,
//                 '&:hover': { backgroundColor: branchColor }
//               }}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleGroupClick(group);
//               }}
//             >
//               בחר קבוצה
//               <NavigateNext sx={{ mr: 1 }} />
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     );
//   };

//   // Render groups by course and branch
//   const renderGroupsContent = () => {
//     const courseNames = Object.keys(organizedGroups);

//     if (courseNames.length === 0) {
//       return renderEmptyState();
//     }

//     return (
//       <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
//         {courseNames.map((courseName, courseIndex) => {
//           const courseColor = getCourseColor(courseName);
//           const branches = organizedGroups[courseName];
//           const branchNames = Object.keys(branches);
//           const totalGroups = branchNames.reduce((sum, branchName) => 
//             sum + branches[branchName].length, 0
//           );

//           const courseKey = `course-${courseIndex}-${courseName}`;

//           return (
//             <Accordion
//               key={courseKey}
//               expanded={expandedCourse === courseName}
//               onChange={handleAccordionChange(courseName)}
//               sx={{
//                 mb: 2,
//                 border: `1px solid ${courseColor}30`,
//                 borderRadius: '12px !important',
//                 '&:before': { display: 'none' },
//                 boxShadow: `0 2px 8px ${courseColor}20`
//               }}
//             >
//               <AccordionSummary
//                 expandIcon={<ExpandMore sx={{ color: courseColor }} />}
//                 sx={{
//                   backgroundColor: `${courseColor}10`,
//                   borderRadius: '12px',
//                   '&.Mui-expanded': {
//                     borderBottomLeftRadius: 0,
//                     borderBottomRightRadius: 0
//                   }
//                 }}
//               >
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
//                   <Avatar sx={{
//                     backgroundColor: courseColor,
//                     width: 40,
//                     height: 40
//                   }}>
//                     <School />
//                   </Avatar>
                  
//                   <Box sx={{ flex: 1 }}>
//                     <Typography variant="h6" sx={{ 
//                       fontWeight: 'bold',
//                       color: courseColor
//                     }}>
//                       {courseName}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       {branchNames.length} סניפים • {totalGroups} קבוצות
//                     </Typography>
//                   </Box>

//                   <Chip
//                     label={`${totalGroups} קבוצות`}
//                     size="small"
//                     sx={{
//                       backgroundColor: courseColor,
//                       color: 'white',
//                       fontWeight: 'bold'
//                     }}
//                   />
//                 </Box>
//               </AccordionSummary>

//               <AccordionDetails sx={{ p: 3 }}>
//                 {branchNames.map((branchName, branchIndex) => {
//                   const branchGroups = branches[branchName];
//                   const branchColor = getCourseColor(branchName);
                  
//                   const branchKey = `branch-${courseIndex}-${branchIndex}-${branchName}`;

//                   return (
//                     <Box key={branchKey} sx={{ mb: 3 }}>
//                       <Box sx={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         gap: 2, 
//                         mb: 2,
//                         p: 2,
//                         backgroundColor: `${branchColor}10`,
//                         borderRadius: '8px',
//                         border: `1px solid ${branchColor}30`
//                       }}>
//                         <Avatar sx={{
//                           backgroundColor: branchColor,
//                           width: 32,
//                           height: 32
//                         }}>
//                           <LocationOn />
//                         </Avatar>
                        
//                         <Typography variant="subtitle1" sx={{ 
//                           fontWeight: 'bold',
//                           color: branchColor,
//                           flex: 1
//                         }}>
//                           {branchName}
//                         </Typography>
                        
//                         <Chip
//                           label={`${branchGroups.length} קבוצות`}
//                           size="small"
//                           sx={{
//                             backgroundColor: branchColor,
//                             color: 'white'
//                           }}
//                         />
//                       </Box>

//                       <Box sx={{ pl: 2 }}>
//                         {branchGroups.map((group, groupIndex) => {
//                           const groupKey = group.groupId || `group-${courseIndex}-${branchIndex}-${groupIndex}`;
//                           return renderGroupCard(group, branchColor, groupKey);
//                         })}
//                       </Box>
//                     </Box>
//                   );
//                 })}
//               </AccordionDetails>
//             </Accordion>
//           );
//         })}
//       </Box>
//     );
//   };

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
//       {renderDialogTitle()}

//       <DialogContent sx={{ ...styles.dialogContent, p: 3 }}>
//         <AnimatePresence mode="wait">
//           {groupsByDayLoading ? (
//             <motion.div
//               key="loading"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               {renderLoadingState()}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="content"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               {renderGroupsContent()}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Summary information */}
//         {!groupsByDayLoading && groupsByDay.length > 0 && (
//           <Paper sx={{
//             mt: 3,
//             p: 2,
//             backgroundColor: theme.palette.grey[50],
//             borderRadius: 2,
//             border: `1px solid ${theme.palette.grey[200]}`
//           }}>
//             <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
//               סה"כ {groupsByDay.length} קבוצות זמינות ליום זה
//             </Typography>
//           </Paper>
//         )}
//       </DialogContent>

//       <DialogActions sx={{ 
//         p: 3, 
//         backgroundColor: theme.palette.grey[50],
//         borderTop: `1px solid ${theme.palette.grey[200]}`,
//         justifyContent: 'space-between'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
//           <Typography variant="caption" color="textSecondary">
//             בחר קבוצה כדי לרשום נוכחות
//           </Typography>
//         </Box>
        
//         <Button
//           onClick={onClose}
//           variant="outlined"
//           color="primary"
//           size="large"
//           sx={{ 
//             borderRadius: 2,
//             px: 4,
//             py: 1
//           }}
//         >
//           סגור
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CourseSelectionDialog;
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Button, IconButton, Grid, Card,
  CardContent, CardHeader, Avatar, List, ListItem,
  ListItemText, ListItemIcon, Collapse, Divider,
  Paper, useMediaQuery, useTheme, Chip, Accordion,
  AccordionSummary, AccordionDetails, CircularProgress,
  Alert, AlertTitle
} from '@mui/material';
import {
  Close, School, LocationOn, Group, ExpandMore,
  ExpandLess, NavigateNext, AccessTime, Person,
  EventBusy, Numbers, Security, Schedule, Today
} from '@mui/icons-material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { styles } from '../styles/dialogStyles';

const CourseSelectionDialog = ({
  open,
  onClose,
  selectedDate,
  groupsByDay = [],
  groupsByDayLoading = false,
  onGroupSelect
}) => {
  console.log('🏗️ CourseSelectionDialog rendered with props:', {
    open,
    selectedDate,
    groupsByDayCount: groupsByDay?.length || 0,
    onGroupSelectType: typeof onGroupSelect
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [expandedCourse, setExpandedCourse] = useState(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setExpandedCourse(null);
    }
  }, [open]);

  // בדיקת תקינות של onGroupSelect
  if (!onGroupSelect || typeof onGroupSelect !== 'function') {
    console.error('❌ onGroupSelect is not a function:', onGroupSelect);
  }

  // פונקציה לטיפול בלחיצה על קבוצה
  const handleGroupClick = async (group) => {
    console.log('🖱️ Group card clicked:', group);
    
    if (onGroupSelect && typeof onGroupSelect === 'function') {
      try {
        // קרא לפונקציה מיד
        console.log('✅ Calling onGroupSelect with group:', group);
        await onGroupSelect(group);
        
        // סגור את הדיאלוג אחרי בחירת קבוצה
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
        
      } catch (error) {
        console.error('❌ Error calling onGroupSelect:', error);
        alert('שגיאה: לא ניתן לבחור קבוצה זו');
      }
    } else {
      console.error('❌ onGroupSelect is not available or not a function');
      alert('שגיאה: לא ניתן לבחור קבוצה זו');
    }
  };

  // ארגון הקבוצות לפי חוג וסניף
  const organizedGroups = useMemo(() => {
    if (!groupsByDay || groupsByDay.length === 0) return {};

    const organized = {};

    groupsByDay.forEach(group => {
      const courseName = group.courseName || group.couresName || 'חוג לא ידוע';
      const branchName = group.branchName || 'סניף לא ידוע';

      if (!organized[courseName]) {
        organized[courseName] = {};
      }

      if (!organized[courseName][branchName]) {
        organized[courseName][branchName] = [];
      }

      organized[courseName][branchName].push(group);
    });

    return organized;
  }, [groupsByDay]);

  // בדיקת תקינות תאריך
  if (!selectedDate) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{direction:'rtl'}}>
        <DialogTitle>שגיאה</DialogTitle>
        <DialogContent>
          <Typography>לא נבחר תאריך תקין</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>סגור</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Handle accordion expansion
  const handleAccordionChange = (courseName) => (event, isExpanded) => {
    setExpandedCourse(isExpanded ? courseName : null);
  };

  // קבלת צבע לפי חוג
  const getCourseColor = (courseName) => {
    const colors = [
      '#1976d2', '#388e3c', '#f57c00', '#7b1fa2',
      '#c2185b', '#00796b', '#5d4037', '#455a64',
      '#e64a19', '#303f9f', '#689f38', '#fbc02d'
    ];
    
    let hash = 0;
    for (let i = 0; i < courseName.length; i++) {
      hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Render dialog title
  const renderDialogTitle = () => {
    const formattedDate = format(selectedDate, 'EEEE, d MMMM yyyy', { locale: he });
    const dayName = format(selectedDate, 'EEEE', { locale: he });

    return (
      <DialogTitle sx={styles.dialogTitle}>
        <Box sx={styles.dialogTitleContent}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              backgroundColor: theme.palette.primary.main,
              width: 48,
              height: 48
            }}>
              <Today />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={styles.dialogTitleText}>
                חוגים ביום {dayName}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {formattedDate}
              </Typography>
            </Box>
          </Box>
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
      </DialogTitle>
    );
  };

  // Render loading state
  const renderLoadingState = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
      gap: 2
    }}>
      <CircularProgress size={48} thickness={4} />
      <Typography variant="h6" color="textSecondary">
        טוען חוגים...
      </Typography>
    </Box>
  );

  // Render empty state
  const renderEmptyState = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
      gap: 2,
      textAlign: 'center'
    }}>
      <Avatar sx={{
        width: 80,
        height: 80,
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.grey[400]
      }}>
        <EventBusy sx={{ fontSize: 40 }} />
      </Avatar>
      <Typography variant="h6" color="textSecondary">
        אין חוגים מתוכננים ליום זה
      </Typography>
      <Typography variant="body2" color="textSecondary">
        נסה לבחור יום אחר או פנה למנהל המערכת
      </Typography>
    </Box>
  );

  // Render group card 
  const renderGroupCard = (group, branchColor, uniqueKey) => {
    return (
      <Card
        key={uniqueKey}
        component={motion.div}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        sx={{
          mb: 2,
          cursor: 'pointer',
          border: `2px solid transparent`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            border: `2px solid ${branchColor}`,
            boxShadow: `0 4px 20px ${branchColor}30`
          }
        }}
        onClick={() => handleGroupClick(group)}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: branchColor, mb: 1 }}>
                {group.courseName || group.couresName || 'שם חוג לא זמין'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                קבוצה: {group.groupName || 'לא צוין'}
              </Typography>
            </Box>
            <Chip
              label={group.branchName || 'סניף לא זמין'}
              sx={{
                backgroundColor: `${branchColor}20`,
                color: branchColor,
                fontWeight: 'bold'
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {group.hour || 'שעה לא צוינה'}
                </Typography>
              </Box>
            </Grid>
            {/* <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Group sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {group.studentsCount || 0} תלמידים
                </Typography>
              </Box>
            </Grid> */}
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="small"
              sx={{ 
                backgroundColor: branchColor,
                '&:hover': { backgroundColor: branchColor }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleGroupClick(group);
              }}
            >
              בחר קבוצה
              <NavigateNext sx={{ mr: 1 }} />
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Render groups by course and branch
  const renderGroupsContent = () => {
    const courseNames = Object.keys(organizedGroups);

    if (courseNames.length === 0) {
      return renderEmptyState();
    }

    return (
      <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
        {courseNames.map((courseName, courseIndex) => {
          const courseColor = getCourseColor(courseName);
          const branches = organizedGroups[courseName];
          const branchNames = Object.keys(branches);
          const totalGroups = branchNames.reduce((sum, branchName) => 
            sum + branches[branchName].length, 0
          );

          const courseKey = `course-${courseIndex}-${courseName}`;

          return (
            <Accordion
              key={courseKey}
              expanded={expandedCourse === courseName}
              onChange={handleAccordionChange(courseName)}
              sx={{
                mb: 2,
                border: `1px solid ${courseColor}30`,
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
                boxShadow: `0 2px 8px ${courseColor}20`
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: courseColor }} />}
                sx={{
                  backgroundColor: `${courseColor}10`,
                  borderRadius: '12px',
                  '&.Mui-expanded': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Avatar sx={{
                    backgroundColor: courseColor,
                    width: 40,
                    height: 40
                  }}>
                    <School />
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold',
                      color: courseColor
                    }}>
                      {courseName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {branchNames.length} סניפים • {totalGroups} קבוצות
                    </Typography>
                  </Box>

                  <Chip
                    label={`${totalGroups} קבוצות`}
                    size="small"
                    sx={{
                      backgroundColor: courseColor,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 3 }}>
                {branchNames.map((branchName, branchIndex) => {
                  const branchGroups = branches[branchName];
                  const branchColor = getCourseColor(branchName);
                  
                  const branchKey = `branch-${courseIndex}-${branchIndex}-${branchName}`;

                  return (
                    <Box key={branchKey} sx={{ mb: 3 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        mb: 2,
                        p: 2,
                        backgroundColor: `${branchColor}10`,
                        borderRadius: '8px',
                        border: `1px solid ${branchColor}30`
                      }}>
                        <Avatar sx={{
                          backgroundColor: branchColor,
                          width: 32,
                          height: 32
                        }}>
                          <LocationOn />
                        </Avatar>
                        
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 'bold',
                          color: branchColor,
                          flex: 1
                        }}>
                          {branchName}
                        </Typography>
                        
                        <Chip
                          label={`${branchGroups.length} קבוצות`}
                          size="small"
                          sx={{
                            backgroundColor: branchColor,
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {branchGroups.map((group, groupIndex) => {
                          const groupKey = `group-${courseIndex}-${branchIndex}-${groupIndex}-${group.groupId || groupIndex}`;
                          return renderGroupCard(group, branchColor, groupKey);
                        })}
                      </Box>
                    </Box>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    );
  };

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
      {renderDialogTitle()}

      <DialogContent sx={{ ...styles.dialogContent, p: 3 }}>
        <AnimatePresence mode="wait">
          {groupsByDayLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderLoadingState()}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderGroupsContent()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary information */}
        {!groupsByDayLoading && groupsByDay.length > 0 && (
          <Paper sx={{
            mt: 3,
            p: 2,
            backgroundColor: theme.palette.grey[50],
            borderRadius: 2,
            border: `1px solid ${theme.palette.grey[200]}`
          }}>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
              סה"כ {groupsByDay.length} קבוצות זמינות ליום זה
            </Typography>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        backgroundColor: theme.palette.grey[50],
        borderTop: `1px solid ${theme.palette.grey[200]}`,
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="textSecondary">
            בחר קבוצה כדי לרשום נוכחות
          </Typography>
        </Box>
        
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          size="large"
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1
          }}
        >
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseSelectionDialog;
