// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Container, Box, Typography, Paper, Tabs, Tab,
//   IconButton, Button, Chip, Avatar, Badge,
//   Grid, Card, CardContent, CardHeader, Divider,
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   List, ListItem, ListItemText, ListItemIcon, ListItemButton,
//   TextField, InputAdornment, Tooltip, Snackbar, Alert,
//   useMediaQuery, useTheme, CircularProgress
// } from '@mui/material';
// import {
//   CalendarMonth, Today, NavigateBefore, NavigateNext,
//   Event, School, LocationOn, Group, Person, CheckCircle,
//   Cancel, Search, FilterList, Save, Comment, Check,
//   ExpandMore, ExpandLess, Close, Info, AccessTime, EventBusy
// } from '@mui/icons-material';

// // Import date utilities
// import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
// import { he } from 'date-fns/locale';

// import { HDate, HebrewCalendar, Location, flags } from '@hebcal/core';
// // Import Redux actions
// import { fetchCourses } from '../../store/course/CoursesGetAllThunk';
// import { fetchBranches } from '../../store/branch/branchGetAllThunk';
// import { fetchGroups } from '../../store/group/groupGellAllThunk';

// // Import custom components
// import MonthlyCalendar from './components/monthlyCalendar'
// import WeeklyCalendar from './components/weeklyCalendar';
// import DailyCalendar from './components/dailyCalendar';
// import AttendanceDialog from './components/attendanceDialog';
// import CourseSelectionDialog from './components/courseSelectionDialog';

// // Import styles
// import { styles } from './styles/attendanceCalendarStyles';
// import { getStudentsByGroupId } from '../../store/student/studentGetByGroup';
// import { fetchAttendanceByDate } from '../../store/attendance/fetchAttendanceByDate';
// import { saveAttendance } from '../../store/attendance/saveAttendance';
// import { updateLocalAttendance } from '../../store/attendance/attendanceSlice';
// import { fetchAttendanceRange } from '../../store/attendance/fetchAttendanceRange';

// const AttendanceCalendar = () => {
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));

//   // Redux state
//   const courses = useSelector(state => state.courses.courses || []);
//   const branches = useSelector(state => state.branches.branches || []);
//   const groups = useSelector(state => state.groups.groups || []);
//   const students = useSelector(state => {
//     return state.students?.studentsByGroup || [];
//   }); 
//   const attendanceRecords = useSelector(state => state.attendances.records || []);
//   const loading = useSelector(state =>
//     state.courses.loading ||
//     state.branches.loading ||
//     state.groups.loading ||
//     state.students.loading ||
//     state.attendances.loading
//   );

//   // Local state
//   const [viewMode, setViewMode] = useState('month');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [courseSelectionOpen, setCourseSelectionOpen] = useState(false);
//   const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [selectedBranch, setSelectedBranch] = useState(null);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [attendanceData, setAttendanceData] = useState({});
//   const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState('all');
//   const [studentsLoaded, setStudentsLoaded] = useState(false);
  
//   // Hebrew holidays state
//   const [hebrewHolidays, setHebrewHolidays] = useState(new Map());

//   // פונקציה לתרגום שמות חגים
//   const translateHolidayName = (englishName) => {
//     const translations = {
//       'Rosh Hashana': 'ראש השנה',
//       'Yom Kippur': 'יום כיפור',
//       'Sukkot': 'סוכות',
//       'Simchat Torah': 'שמחת תורה',
//       'Shmini Atzeret': 'שמיני עצרת',
//       'Chanukah': 'חנוכה',
//       'Tu BiShvat': 'ט"ו בשבט',
//       'Purim': 'פורים',
//       'Pesach': 'פסח',
//       'Lag BaOmer': 'ל"ג בעומר',
//       'Shavuot': 'שבועות',
//       'Tish\'a B\'Av': 'תשעה באב',
//       'Tzom Gedaliah': 'צום גדליה',
//       'Asara B\'Tevet': 'עשרה בטבת',
//       'Ta\'anit Esther': 'תענית אסתר',
//       'Tzom Tammuz': 'צום תמוז',
//       'Erev Rosh Hashana': 'ערב ראש השנה',
//       'Erev Yom Kippur': 'ערב יום כיפור',
//       'Erev Pesach': 'ערב פסח',
//       'Erev Shavuot': 'ערב שבועות',
//       'Erev Sukkot': 'ערב סוכות'
//     };

//     // חפש תרגום מדויק
//     if (translations[englishName]) {
//       return translations[englishName];
//     }

//     // חפש תרגום חלקי - כולל חנוכה וסוכות
//     for (const [english, hebrew] of Object.entries(translations)) {
//       if (englishName.includes(english.replace('Erev ', '')) || 
//           (english === 'Chanukah' && englishName.includes('Chanukah')) ||
//           (english === 'Sukkot' && englishName.includes('Sukkot'))) {
//         return hebrew;
//       }
//     }

//     return englishName;
//   };

//   // פונקציה מדויקת לקבלת מידע על חגים עבריים
//   const getHebrewHolidayInfo = (date) => {
//     try {
//       // קבל חגים לתאריך זה בלבד
//       const events = HebrewCalendar.calendar({
//         start: date,
//         end: date,
//         isHebrewYear: false,
//         candlelighting: false,
//         havdalahMins: 0,
//         sedrot: false,
//         omer: false,
//         modernHolidays: false,
//         roshChodesh: false,
//         minorFasts: false,
//         specialShabbat: false,
//         noModern: true,
//         noRoshChodesh: true,
//         noMinorFasts: true,
//         noModernIsrael: true
//       });

//       // סנן חגים מרכזיים - כולל כל ימי החג
//       const majorHolidays = events.filter(event => {
//         const desc = event.getDesc();
//         const eventFlags = event.getFlags();
        
//         // בדוק אם זה חג מרכזי לפי דגלים
//         const isMajorHoliday = (
//           eventFlags & flags.CHAG ||
//           eventFlags & flags.YOM_TOV_ASSUR_MELAKHA ||
//           eventFlags & flags.MAJOR_FAST ||
//           eventFlags & flags.MINOR_HOLIDAY
//         );
        
//         // או בדוק לפי שם החג - כולל כל הווריאציות
//         const isMajorByName = (
//           desc.includes('Rosh Hashana') ||
//           desc.includes('Yom Kippur') ||
//           desc.includes('Sukkot') ||
//           desc.includes('Simchat Torah') ||
//           desc.includes('Shmini Atzeret') ||
//           desc.includes('Pesach') ||
//           desc.includes('Shavuot') ||
//           desc.includes('Chanukah') ||
//           desc.includes('Purim') ||
//           desc.includes('Tish\'a B\'Av') ||
//           desc.includes('Tu BiShvat') ||
//           desc.includes('Lag BaOmer')
//         );
        
//         return isMajorHoliday || isMajorByName;
//       });

//       if (majorHolidays.length > 0) {
//         const holiday = majorHolidays[0];
//         return {
//           name: translateHolidayName(holiday.getDesc()),
//           desc: holiday.getDesc(),
//           date: date,
//           flags: holiday.getFlags(),
//           isChag: !!(holiday.getFlags() & (flags.CHAG | flags.YOM_TOV_ASSUR_MELAKHA)),
//           isErev: holiday.getDesc().startsWith('Erev'),
//           isCholHamoed: !!(holiday.getFlags() & flags.CHOL_HAMOED),
//           isMinorHoliday: !!(holiday.getFlags() & flags.MINOR_HOLIDAY)
//         };
//       }

//       return null;
//     } catch (error) {
//       console.error('Error getting Hebrew holiday info:', error);
//       return null;
//     }
//   };

//   // פונקציה לטעינת חגים עבריים - מורחבת
//   const loadHebrewHolidays = (year) => {
//     try {
//       const options = {
//         year: year,
//         isHebrewYear: false,
//         candlelighting: false,
//         havdalahMins: 0,
//         sedrot: false,
//         il: true,
//         noHolidayDescriptions: false, // שנה ל-false כדי לקבל יותר פרטים
//         noModern: false, // שנה ל-false כדי לכלול חגים נוספים
//         noRoshChodesh: true,
//         noMinorFasts: false, // שנה ל-false כדי לכלול צומות
//         noModernIsrael: true
//       };

//       const events = HebrewCalendar.calendar(options);
//       const holidaysMap = new Map();

//       events.forEach(event => {
//         const eventFlags = event.getFlags();
//         const desc = event.getDesc();
        
//         // כלול חגים מרכזיים וחגים קטנים
//         const shouldInclude = (
//           eventFlags & (flags.CHAG | flags.YOM_TOV_ASSUR_MELAKHA | flags.MAJOR_FAST | flags.MINOR_HOLIDAY) ||
//           desc.includes('Sukkot') ||
//           desc.includes('Chanukah') ||
//           desc.includes('Pesach') ||
//           desc.includes('Rosh Hashana') ||
//           desc.includes('Yom Kippur') ||
//           desc.includes('Shavuot') ||
//           desc.includes('Purim') ||
//           desc.includes('Simchat Torah') ||
//           desc.includes('Shmini Atzeret')
//         );
        
//         if (shouldInclude) {
//           const dateKey = format(event.getDate().greg(), 'yyyy-MM-dd');
//           holidaysMap.set(dateKey, {
//             name: translateHolidayName(event.render('en')),
//             nameEn: event.render('en'),
//             isChag: !!(eventFlags & (flags.CHAG | flags.YOM_TOV_ASSUR_MELAKHA)),
//             isErev: event.render('en').startsWith('Erev'),
//             isCholHamoed: !!(eventFlags & flags.CHOL_HAMOED),
//             isMinorHoliday: !!(eventFlags & flags.MINOR_HOLIDAY),
//             date: event.getDate().greg()
//           });
//         }
//       });

//       setHebrewHolidays(prev => new Map([...prev, ...holidaysMap]));
//     } catch (error) {
//       console.error('Error loading Hebrew holidays:', error);
//     }
//   };

//   // טעינת חגים עבריים כאשר התאריך משתנה
//   useEffect(() => {
//     const currentYear = currentDate.getFullYear();
//     loadHebrewHolidays(currentYear);
    
//     // טען גם את השנה הבאה אם אנחנו בסוף השנה
//     if (currentDate.getMonth() >= 10) {
//       loadHebrewHolidays(currentYear + 1);
//     }
    
//     // טען גם את השנה הקודמת אם אנחנו בתחילת השנה
//     if (currentDate.getMonth() <= 1) {
//       loadHebrewHolidays(currentYear - 1);
//     }
//   }, [currentDate]);

//   // פונקציה לבדיקה אם תאריך הוא חג עברי
//   const isHebrewHoliday = (date) => {
//     const dateKey = format(date, 'yyyy-MM-dd');
//     return hebrewHolidays.has(dateKey);
//   };

//   // פונקציה מדויקת לבדיקה אם יום פעיל לחוגים
//   const isActiveDay = (date) => {
//     // בדוק אם זה שבת
//     if (date.getDay() === 6) return false;
    
//     // בדוק אם זה חג עברי מרכזי
//     const holidayInfo = getHebrewHolidayInfo(date);
//     if (holidayInfo) {
//       // חסום חגים מרכזיים אבל אפשר חגים קטנים וחול המועד
//       if (holidayInfo.isChag && !holidayInfo.isCholHamoed) {
//         return false;
//       }
      
//       // חסום ערבי חגים מרכזיים
//       if (holidayInfo.isErev && (
//         holidayInfo.desc === 'Erev Yom Kippur' ||
//         holidayInfo.desc === 'Erev Pesach' ||
//         holidayInfo.desc === 'Erev Rosh Hashana'
//       )) {
//         return false;
//       }

//                 // חסום תשעה באב וצומות מרכזיים
//       if (holidayInfo.desc.includes('Tish\'a B\'Av') || 
//           holidayInfo.desc.includes('Tzom Gedaliah') ||
//           holidayInfo.desc.includes('Asara B\'Tevet') ||
//           holidayInfo.desc.includes('Ta\'anit Esther') ||
//           holidayInfo.desc.includes('Tzom Tammuz')) {
//         return false;
//       }
//     }
    
//     return true;
//   };

//   useEffect(() => {
//     dispatch(fetchCourses());
//     dispatch(fetchBranches());
//     dispatch(fetchGroups());
//   }, [dispatch]);

//   useEffect(() => {
//     if (students.length > 0 && selectedGroup && selectedDate && studentsLoaded) {
//       console.log('Students loaded, initializing attendance data:', students);

//       const dateString = format(selectedDate, 'yyyy-MM-dd');
//       const existingAttendance = attendanceRecords[dateString] || [];

//       const initialAttendance = {};
//       students.forEach(student => {
//         const existingRecord = existingAttendance.find(r => r.studentId === student.studentId);
//         initialAttendance[student.studentId] = existingRecord ? existingRecord.wasPresent : true;
//       });

//       setAttendanceData(initialAttendance);
//       setStudentsLoaded(false);
//     }
//   }, [students, selectedGroup, selectedDate, studentsLoaded, attendanceRecords]);

//   // Handle date selection - עם בדיקת חגים מדויקת
//   const handleDateSelect = (date) => {
//     console.log('handleDateSelect called with:', date, typeof date);

//     if (!date || (date instanceof Date && isNaN(date.getTime()))) {
//       console.error('Invalid date selected:', date);
//       setNotification({
//         open: true,
//         message: 'תאריך לא תקין',
//         severity: 'error'
//       });
//       return;
//     }

//     // בדוק אם היום פעיל לחוגים
//     if (!isActiveDay(date)) {
//       const holidayInfo = getHebrewHolidayInfo(date);
//       let message = 'לא ניתן לקבוע נוכחות ביום זה';
      
//       if (holidayInfo) {
//         message = `לא ניתן לקבוע נוכחות ב${holidayInfo.name}`;
//       } else if (date.getDay() === 6) {
//         message = 'לא ניתן לקבוע נוכחות בשבת';
//       }
      
//       setNotification({
//         open: true,
//         message: message,
//         severity: 'warning'
//       });
//       return;
//     }

//     setSelectedDate(date);
//     setCourseSelectionOpen(true);
//   };

//   // Handle view mode change
//   const handleViewModeChange = (event, newMode) => {
//     if (newMode !== null) {
//       setViewMode(newMode);
//     }
//   };

//   // Handle date navigation
//   const handleDateChange = (direction) => {
//     if (viewMode === 'month') {
//       setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
//     } else if (viewMode === 'week') {
//       setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
//     } else if (viewMode === 'day') {
//       setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
//     }
//   };

//   // Handle course selection
//   const handleCourseSelect = (course) => {
//     setSelectedCourse(course);
//     const branchesForCourse = branches.filter(branch =>
//       groups.some(group => group.courseId === course.id && group.branchId === branch.id)
//     );
//     if (branchesForCourse.length === 1) {
//       handleBranchSelect(branchesForCourse[0]);
//     }
//   };

//   // Handle branch selection
//   const handleBranchSelect = (branch) => {
//     setSelectedBranch(branch);
//     const groupsForBranchAndCourse = groups.filter(group =>
//       group.courseId === selectedCourse.id && group.branchId === branch.id
//     );
//     if (groupsForBranchAndCourse.length === 1) {
//       handleGroupSelect(groupsForBranchAndCourse[0]);
//     }
//   };

//   // Handle group selection
//   const handleGroupSelect = async (group) => {
//     console.log('handleGroupSelect called with group:', group);
//     setSelectedGroup(group);

//     try {
//       console.log('Dispatching getStudentsByGroupId with:', group.groupId);
//       await dispatch(getStudentsByGroupId(group.groupId)).unwrap();
//       setStudentsLoaded(true);
//     } catch (error) {
//       console.error('Failed to load students:', error);
//       setNotification({
//         open: true,
//         message: 'שגיאה בטעינת רשימת התלמידים',
//         severity: 'error'
//       });
//       return;
//     }

//     const dateString = format(selectedDate, 'yyyy-MM-dd');

//     try {
//       await dispatch(fetchAttendanceByDate({
//         groupId: group.groupId,
//         date: dateString
//       })).unwrap();
//     } catch (error) {
//       console.warn('No existing attendance found');
//     }

//     setCourseSelectionOpen(false);
//     setAttendanceDialogOpen(true);
//   };

//   // Handle attendance change
//   const handleAttendanceChange = (studentId, wasPresent) => {
//     setAttendanceData(prev => ({
//       ...prev,
//       [studentId]: wasPresent
//     }));
//   };

//   // Handle attendance save
//   const handleSaveAttendance = async (note = '') => {
//     if (!selectedGroup || !selectedDate || !students || students.length === 0) {
//       setNotification({
//         open: true,
//         message: 'חסרים נתונים לשמירת הנוכחות',
//         severity: 'error'
//       });
//       return;
//     }

//     try {
//       const attendanceToSave = {
//         groupId: selectedGroup.groupId,
//         date: format(selectedDate, 'yyyy-MM-dd'),
//         note: note || '',
//         attendanceRecords: Object.keys(attendanceData).map(studentId => {
//           const student = students.find(s => s.studentId === parseInt(studentId));
//           return {
//             studentId: parseInt(studentId),
//             wasPresent: attendanceData[studentId],
//             studentName: student?.studentName || '',
//             note: ''
//           };
//         })
//       };

//       console.log('Saving attendance:', attendanceToSave);
//       await dispatch(saveAttendance(attendanceToSave)).unwrap();

//       setAttendanceDialogOpen(false);
//       setNotification({
//         open: true,
//         message: 'נתוני הנוכחות נשמרו בהצלחה',
//         severity: 'success'
//       });

//       setSelectedCourse(null);
//       setSelectedBranch(null);
//       setSelectedGroup(null);
//       setAttendanceData({});
//       setSelectedDate(null);

//     } catch (error) {
//       console.error('Save attendance error:', error);
//       setNotification({
//         open: true,
//         message: 'שגיאה בשמירת נתוני הנוכחות',
//         severity: 'error'
//       });
//     }
//   };

//   useEffect(() => {
//     const loadMonthlyAttendance = async () => {
//       if (groups.length > 0 && viewMode === 'month') {
//         const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
//         const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

//         const activeGroups = groups.filter(group => group.isActive !== false);

//         for (const group of activeGroups) {
//           try {
//             // רק אם יש לך את הפונקציה fetchAttendanceRange
//             // await dispatch(fetchAttendanceRange({
//             //     groupId: group.groupId,
//             //     startDate,
//             //     endDate
//             // }));
//           } catch (error) {
//             console.error(`Failed to load attendance for group ${group.groupId}:`, error);
//           }
//         }
//       }
//     };

//     loadMonthlyAttendance();
//   }, [currentDate, viewMode, groups, dispatch]);

//   useEffect(() => {
//     if (students.length > 0 && selectedGroup && selectedDate) {
//       const dateString = format(selectedDate, 'yyyy-MM-dd');
//       const existingAttendance = attendanceRecords[dateString] || [];

//       const updatedAttendanceData = {};
//       students.forEach(student => {
//         const existingRecord = existingAttendance.find(r => r.studentId === student.studentId);
//         updatedAttendanceData[student.studentId] = existingRecord ? existingRecord.wasPresent :
//           (attendanceData[student.studentId] !== undefined ? attendanceData[student.studentId] : true);
//       });

//       if (Object.keys(updatedAttendanceData).length !== Object.keys(attendanceData).length ||
//         Object.keys(updatedAttendanceData).some(key => updatedAttendanceData[key] !== attendanceData[key])) {
//         setAttendanceData(updatedAttendanceData);
//       }
//     }
//   }, [students, selectedGroup, selectedDate]);

//   // Handle notification close
//   const handleCloseNotification = () => {
//     setNotification({ ...notification, open: false });
//   };

//   // Render calendar header
//   const renderCalendarHeader = () => {
//     let title = '';

//     if (viewMode === 'month') {
//       title = format(currentDate, 'MMMM yyyy', { locale: he });
//     } else if (viewMode === 'week') {
//       const start = startOfWeek(currentDate, { weekStartsOn: 0 });
//       const end = endOfWeek(currentDate, { weekStartsOn: 0 });
//       title = `${format(start, 'd', { locale: he })}-${format(end, 'd MMMM yyyy', { locale: he })}`;
//     } else if (viewMode === 'day') {
//       title = format(currentDate, 'EEEE, d MMMM yyyy', { locale: he });
//     }

//     return (
//       <Box sx={styles.calendarHeader}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={4}>
//             <Box sx={styles.dateNavigation}>
//               <IconButton onClick={() => handleDateChange('prev')} color="primary">
//                 <NavigateBefore />
//               </IconButton>
//               <Typography variant="h5" sx={styles.dateTitle}>
//                 {title}
//               </Typography>
//               <IconButton onClick={() => handleDateChange('next')} color="primary">
//                 <NavigateNext />
//               </IconButton>
//               <Tooltip title="חזור להיום">
//                 <IconButton
//                   onClick={() => setCurrentDate(new Date())}
//                   color="primary"
//                   sx={styles.todayButton}
//                 >
//                   <Today />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </Grid>

//           <Grid item xs={12} md={4} sx={styles.viewModeSwitcher}>
//             <Tabs
//               value={viewMode}
//               onChange={handleViewModeChange}
//               sx={styles.tabs}
//             >
//               <Tab value="month" label="חודש" icon={<CalendarMonth />} />
//               <Tab value="week" label="שבוע" icon={<Event />} />
//               <Tab value="day" label="יום" icon={<Today />} />
//             </Tabs>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <Box sx={styles.searchAndFilter}>
//               <TextField
//                 placeholder="חיפוש חוג או סניף..."
//                 variant="outlined"
//                 size="small"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Search />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={styles.searchField}
//               />

//               <Button
//                 variant="outlined"
//                 color="primary"
//                 startIcon={<FilterList />}
//                 sx={styles.filterButton}
//               >
//                 סינון
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     );
//   };

//   // Render main content based on view mode
//   const renderCalendarContent = () => {
//     if (loading) {
//       return (
//         <Box sx={styles.loadingContainer}>
//           <CircularProgress size={60} thickness={4} />
//           <Typography variant="h6" sx={styles.loadingText}>
//             טוען נתונים...
//           </Typography>
//         </Box>
//       );
//     }

//     return (
//       <AnimatePresence mode="wait">
//         <Box
//           key={viewMode}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//           sx={styles.calendarContainer}
//         >
//           {viewMode === 'month' && (
//             <MonthlyCalendar
//               currentDate={currentDate}
//               onDateSelect={handleDateSelect}
//               groups={groups || []}
//               courses={courses || []}
//               branches={branches || []}
//               savedAttendanceRecords={attendanceRecords || {}}
//               hebrewHolidays={hebrewHolidays}
//               isActiveDay={isActiveDay}
//               getHebrewHolidayInfo={getHebrewHolidayInfo}
//             />
//           )}

//           {viewMode === 'week' && (
//             <WeeklyCalendar
//               currentDate={currentDate}
//               onDateSelect={handleDateSelect}
//               events={groups}
//               attendanceRecords={attendanceRecords}
//               isActiveDay={isActiveDay}
//               getHebrewHolidayInfo={getHebrewHolidayInfo}
//             />
//           )}

//           {viewMode === 'day' && (
//             <DailyCalendar
//               currentDate={currentDate}
//               onDateSelect={handleDateSelect}
//               events={groups}
//               attendanceRecords={attendanceRecords}
//               isActiveDay={isActiveDay}
//               getHebrewHolidayInfo={getHebrewHolidayInfo}
//             />
//           )}
//         </Box>
//       </AnimatePresence>
//     );
//   };

//   return (
//     <Container maxWidth="xl" sx={styles.root}>
//       <Box sx={styles.pageContainer}>
//         <motion.div
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           sx={styles.pageHeader}
//         >

//           <Typography variant={isMobile ? "h4" : "h3"} sx={styles.pageTitle}>
//             לוח נוכחות חוגים
//           </Typography>
//           <Typography variant="h6" sx={styles.pageSubtitle}>
//             ניהול ומעקב אחר נוכחות תלמידים בחוגים
//           </Typography>
//         </motion.div>

//         {renderCalendarHeader()}

//         <Paper sx={styles.calendarPaper}>
//           {renderCalendarContent()}
//         </Paper>

//         {/* Course Selection Dialog */}
//         <CourseSelectionDialog
//           open={courseSelectionOpen}
//           onClose={() => setCourseSelectionOpen(false)}
//           selectedDate={selectedDate}
//           courses={courses || []}
//           branches={branches || []}
//           groups={groups || []}
//           onCourseSelect={handleCourseSelect}
//           onBranchSelect={handleBranchSelect}
//           onGroupSelect={handleGroupSelect}
//         />

//         {/* Attendance Dialog */}
//         <AttendanceDialog
//           open={attendanceDialogOpen}
//           onClose={() => setAttendanceDialogOpen(false)}
//           selectedDate={selectedDate}
//           selectedCourse={selectedCourse}
//           selectedBranch={selectedBranch}
//           selectedGroup={selectedGroup}
//           students={students}
//           attendanceData={attendanceData}
//           onAttendanceChange={handleAttendanceChange}
//           onSave={handleSaveAttendance}
//         />

//         {/* Notifications */}
//         <Snackbar
//           open={notification.open}
//           autoHideDuration={6000}
//           onClose={handleCloseNotification}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//         >
//           <Alert
//             onClose={handleCloseNotification}
//             severity={notification.severity}
//             sx={styles.alert}
//           >
//             {notification.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Container>
//   );
// };

// export default AttendanceCalendar;




// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Container, Box, Typography, Paper, Tabs, Tab,
//   IconButton, Button, Chip, Avatar, Badge,
//   Grid, Card, CardContent, CardHeader, Divider,
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   List, ListItem, ListItemText, ListItemIcon, ListItemButton,
//   TextField, InputAdornment, Tooltip, Snackbar, Alert,
//   useMediaQuery, useTheme, CircularProgress
// } from '@mui/material';
// import {
//   CalendarMonth, Today, NavigateBefore, NavigateNext,
//   Event, School, LocationOn, Group, Person, CheckCircle,
//   Cancel, Search, FilterList, Save, Comment, Check,
//   ExpandMore, ExpandLess, Close, Info, AccessTime
// } from '@mui/icons-material';

// // Import date utilities
// import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
// import { he } from 'date-fns/locale';

// // Import Hebrew calendar utilities
// import { HDate, HebrewCalendar } from '@hebcal/core';

// // Import Redux actions
// import { fetchCourses } from '../../store/course/CoursesGetAllThunk';
// import { fetchBranches } from '../../store/branch/branchGetAllThunk';
// import { fetchGroups } from '../../store/group/groupGellAllThunk';

// // Import custom components
// import MonthlyCalendar from './components/monthlyCalendar'
// import WeeklyCalendar from './components/weeklyCalendar';
// import DailyCalendar from './components/dailyCalendar';
// import AttendanceDialog from './components/attendanceDialog';
// import CourseSelectionDialog from './components/courseSelectionDialog';

// // Import styles
// import { styles } from './styles/attendanceCalendarStyles';
// import { getStudentsByGroupId } from '../../store/student/studentGetByGroup';
// import { fetchAttendanceByDate } from '../../store/attendance/fetchAttendanceByDate';
// import { saveAttendance } from '../../store/attendance/saveAttendance';
// import { updateLocalAttendance } from '../../store/attendance/attendanceSlice';
// import { fetchAttendanceRange } from '../../store/attendance/fetchAttendanceRange';

// const AttendanceCalendar = () => {
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));

//   // Redux state
//   const courses = useSelector(state => state.courses.courses || []);
//   const branches = useSelector(state => state.branches.branches || []);
//   const groups = useSelector(state => state.groups.groups || []);
//   const students = useSelector(state => {
//     return state.students?.studentsByGroup || [];
//   });
//   const attendanceRecords = useSelector(state => state.attendances.records || []);
//   const loading = useSelector(state =>
//     state.courses.loading ||
//     state.branches.loading ||
//     state.groups.loading ||
//     state.students.loading ||
//     state.attendances.loading
//   );

//   // Local state
//   const [viewMode, setViewMode] = useState('month');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [courseSelectionOpen, setCourseSelectionOpen] = useState(false);
//   const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [selectedBranch, setSelectedBranch] = useState(null);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [attendanceData, setAttendanceData] = useState({});
//   const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState('all');
//   const [studentsLoaded, setStudentsLoaded] = useState(false);
//   const [hebrewHolidays, setHebrewHolidays] = useState(new Map());

//   // פונקציה לטעינת חגים עבריים
//   const loadHebrewHolidays = (year) => {
//     try {
//       const holidays = HebrewCalendar.calendar({ 
//         year, 
//         isHebrewYear: false,
//         candlelighting: false,
//         havdalahMins: 0,
//         sedrot: false,
//         il: true,
//         noModern: false,
//         noRoshChodesh: true,
//         noMinorFasts: false,
//         noModernIsrael: true
//       });
      
//       const holidayMap = new Map();
      
//       holidays.forEach(holiday => {
//         const dateKey = format(holiday.getDate().greg(), 'yyyy-MM-dd');
//         const desc = holiday.getDesc();
        
//         // סנן רק חגים מרכזיים
//         const isMajorHoliday = (
//           desc.includes('Rosh Hashana') ||
//           desc.includes('Yom Kippur') ||
//           desc.includes('Sukkot') ||
//           desc.includes('Simchat Torah') ||
//           desc.includes('Shmini Atzeret') ||
//           desc.includes('Pesach') ||
//           desc.includes('Shavuot') ||
//           desc.includes('Chanukah') ||
//           desc.includes('Purim') ||
//           desc.includes('Tish\'a B\'Av') ||
//           desc.includes('Tu BiShvat') ||
//           desc.includes('Lag BaOmer')
//         );
        
//         if (isMajorHoliday) {
//           holidayMap.set(dateKey, {
//             name: translateHolidayName(desc),
//             nameEn: desc,
//             isYomTov: holiday.isYomTov ? holiday.isYomTov() : false,
//             isChanukah: desc.includes('Chanukah'),
//             isRoshChodesh: desc.includes('Rosh Chodesh')
//           });
//         }
//       });
      
//       setHebrewHolidays(prev => new Map([...prev, ...holidayMap]));
//     } catch (error) {
//       console.error('Error loading Hebrew holidays:', error);
//     }
//   };

//   // פונקציה לתרגום שמות החגים
//   const translateHolidayName = (englishName) => {
//     const translations = {
//       'Rosh Hashana': 'ראש השנה',
//       'Yom Kippur': 'יום כיפור',
//       'Sukkot': 'סוכות',
//       'Shmini Atzeret': 'שמיני עצרת',
//       'Simchat Torah': 'שמחת תורה',
//       'Chanukah': 'חנוכה',
//       'Tu BiShvat': 'ט"ו בשבט',
//       'Purim': 'פורים',
//       'Pesach': 'פסח',
//       'Yom HaShoah': 'יום השואה',
//       'Yom HaZikaron': 'יום הזיכרון',
//       'Yom HaAtzmaut': 'יום העצמאות',
//       'Lag BaOmer': 'ל"ג בעומר',
//       'Yom Yerushalayim': 'יום ירושלים',
//       'Shavuot': 'שבועות',
//       'Tish\'a B\'Av': 'תשעה באב',
//       'Rosh Chodesh': 'ראש חודש'
//     };

//     // חיפוש חלקי לחגים מורכבים
//     for (const [english, hebrew] of Object.entries(translations)) {
//       if (englishName.includes(english)) {
//         return hebrew;
//       }
//     }

//     return englishName;
//   };

//   // פונקציה לבדיקה אם יום פעיל לחוגים
//   const isActiveDay = (date) => {
//     const dateKey = format(date, 'yyyy-MM-dd');
//     const holiday = hebrewHolidays.get(dateKey);
    
//     // בדוק אם זה יום טוב או חג שבו לא מקיימים חוגים
//     if (holiday) {
//       if (holiday.isYomTov || 
//           holiday.name.includes('יום כיפור') ||
//           holiday.name.includes('ראש השנה') ||
//           holiday.name.includes('פסח') ||
//           holiday.name.includes('שבועות') ||
//           holiday.name.includes('סוכות') ||
//           holiday.name.includes('שמיני עצרת') ||
//           holiday.name.includes('שמחת תורה')) {
//         return false;
//       }
//     }
    
//     // בדוק אם זה שבת
//     const dayOfWeek = date.getDay();
//     if (dayOfWeek === 6) {
//       return false;
//     }
    
//     return true;
//   };

//   // פונקציה לקבלת מידע על חג
//   const getHebrewHolidayInfo = (date) => {
//     const dateKey = format(date, 'yyyy-MM-dd');
//     return hebrewHolidays.get(dateKey) || null;
//   };

//   useEffect(() => {
//     dispatch(fetchCourses());
//     dispatch(fetchBranches());
//     dispatch(fetchGroups());
    
//     // טען חגים עבריים לשנה הנוכחית
//     const currentYear = new Date().getFullYear();
//     loadHebrewHolidays(currentYear);
//     loadHebrewHolidays(currentYear + 1);
//   }, [dispatch]);

//   useEffect(() => {
//     if (students.length > 0 && selectedGroup && selectedDate && studentsLoaded) {
//       console.log('Students loaded, initializing attendance data:', students);

//       const dateString = format(selectedDate, 'yyyy-MM-dd');
//       const existingAttendance = attendanceRecords[dateString] || [];

//       const initialAttendance = {};
//       students.forEach(student => {
//         const existingRecord = existingAttendance.find(r => r.studentId === student.studentId);
//         initialAttendance[student.studentId] = existingRecord ? existingRecord.wasPresent : true;
//       });

//       setAttendanceData(initialAttendance);
//       setStudentsLoaded(false);
//     }
//   }, [students, selectedGroup, selectedDate, studentsLoaded, attendanceRecords]);

//   // Handle view mode change
//   const handleViewModeChange = (event, newMode) => {
//     if (newMode !== null) {
//       setViewMode(newMode);
//     }
//   };

//   // Handle date navigation
//   const handleDateChange = (direction) => {
//     if (viewMode === 'month') {
//       setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
//     } else if (viewMode === 'week') {
//       setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
//     } else if (viewMode === 'day') {
//       setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
//     }
//   };

//   // Handle date selection
//   const handleDateSelect = (date) => {
//     console.log('handleDateSelect called with:', date, typeof date);

//     if (!date || (date instanceof Date && isNaN(date.getTime()))) {
//       console.error('Invalid date selected:', date);
//       setNotification({
//         open: true,
//         message: 'תאריך לא תקין',
//         severity: 'error'
//       });
//       return;
//     }

//     if (!isActiveDay(date)) {
//       const holidayInfo = getHebrewHolidayInfo(date);
//       const message = holidayInfo 
//         ? `לא ניתן לקבוע נוכחות ב${holidayInfo.name}`
//         : 'לא ניתן לקבוע נוכחות ביום זה';
      
//       setNotification({
//         open: true,
//         message,
//         severity: 'warning'
//       });
//       return;
//     }

//     setSelectedDate(date);
//     setCourseSelectionOpen(true);
//   };

//   // Handle course selection
//   const handleCourseSelect = (course) => {
//     setSelectedCourse(course);
//     const branchesForCourse = branches.filter(branch =>
//       groups.some(group => group.courseId === course.id && group.branchId === branch.id)
//     );
//     if (branchesForCourse.length === 1) {
//       handleBranchSelect(branchesForCourse[0]);
//     }
//   };

//   // Handle branch selection
//   const handleBranchSelect = (branch) => {
//     setSelectedBranch(branch);
//     const groupsForBranchAndCourse = groups.filter(group =>
//       group.courseId === selectedCourse.id && group.branchId === branch.id
//     );
//     if (groupsForBranchAndCourse.length === 1) {
//       handleGroupSelect(groupsForBranchAndCourse[0]);
//     }
//   };

//   // Handle group selection
//   const handleGroupSelect = async (group) => {
//     console.log('handleGroupSelect called with group:', group);
//     setSelectedGroup(group);

//     try {
//       console.log('Dispatching getStudentsByGroupId with:', group.groupId);
//       await dispatch(getStudentsByGroupId(group.groupId)).unwrap();
//       setStudentsLoaded(true);
//     } catch (error) {
//       console.error('Failed to load students:', error);
//       setNotification({
//         open: true,
//         message: 'שגיאה בטעינת רשימת התלמידים',
//         severity: 'error'
//       });
//       return;
//     }

//     const dateString = format(selectedDate, 'yyyy-MM-dd');

//     try {
//       await dispatch(fetchAttendanceByDate({
//         groupId: group.groupId,
//         date: dateString
//       })).unwrap();
//     } catch (error) {
//       console.warn('No existing attendance found');
//     }

//     setCourseSelectionOpen(false);
//     setAttendanceDialogOpen(true);
//   };

//   // Handle attendance change
//   const handleAttendanceChange = (studentId, wasPresent) => {
//   // Handle attendance change
//     setAttendanceData(prev => ({
//       ...prev,
//       [studentId]: wasPresent
//     }));
//   };

//   // Handle attendance save
//   const handleSaveAttendance = async (note = '') => {
//     if (!selectedGroup || !selectedDate || !students || students.length === 0) {
//       setNotification({
//         open: true,
//         message: 'חסרים נתונים לשמירת הנוכחות',
//         severity: 'error'
//       });
//       return;
//     }

//     try {
//       const attendanceToSave = {
//         groupId: selectedGroup.groupId,
//         date: format(selectedDate, 'yyyy-MM-dd'),
//         note: note || '',
//         attendanceRecords: Object.keys(attendanceData).map(studentId => {
//           const student = students.find(s => s.studentId === parseInt(studentId));
//           return {
//             studentId: parseInt(studentId),
//             wasPresent: attendanceData[studentId],
//             studentName: student?.studentName || '',
//             note: ''
//           };
//         })
//       };

//       console.log('Saving attendance:', attendanceToSave);
//       await dispatch(saveAttendance(attendanceToSave)).unwrap();

//       setAttendanceDialogOpen(false);
//       setNotification({
//         open: true,
//         message: 'נתוני הנוכחות נשמרו בהצלחה',
//         severity: 'success'
//       });

//       // איפוס הבחירות
//       setSelectedCourse(null);
//       setSelectedBranch(null);
//       setSelectedGroup(null);
//       setAttendanceData({});
//       setSelectedDate(null);

//     } catch (error) {
//       console.error('Save attendance error:', error);
//       setNotification({
//         open: true,
//         message: 'שגיאה בשמירת נתוני הנוכחות',
//         severity: 'error'
//       });
//     }
//   };

//   useEffect(() => {
//     const loadMonthlyAttendance = async () => {
//       if (groups.length > 0 && viewMode === 'month') {
//         const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
//         const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

//         const activeGroups = groups.filter(group => group.isActive !== false);

//         for (const group of activeGroups) {
//           try {
//             // await dispatch(fetchAttendanceRange({
//             //     groupId: group.groupId,
//             //     startDate,
//             //     endDate
//             // }));
//           } catch (error) {
//             console.error(`Failed to load attendance for group ${group.groupId}:`, error);
//           }
//         }
//       }
//     };

//     loadMonthlyAttendance();
//   }, [currentDate, viewMode, groups, dispatch]);

//   useEffect(() => {
//     if (students.length > 0 && selectedGroup && selectedDate) {
//       const dateString = format(selectedDate, 'yyyy-MM-dd');
//       const existingAttendance = attendanceRecords[dateString] || [];

//       const updatedAttendanceData = {};
//       students.forEach(student => {
//         const existingRecord = existingAttendance.find(r => r.studentId === student.studentId);
//         updatedAttendanceData[student.studentId] = existingRecord ? existingRecord.wasPresent :
//           (attendanceData[student.studentId] !== undefined ? attendanceData[student.studentId] : true);
//       });

//       if (Object.keys(updatedAttendanceData).length !== Object.keys(attendanceData).length ||
//         Object.keys(updatedAttendanceData).some(key => updatedAttendanceData[key] !== attendanceData[key])) {
//         setAttendanceData(updatedAttendanceData);
//       }
//     }
//   }, [students, selectedGroup, selectedDate, attendanceData]);

//   // Handle notification close
//   const handleCloseNotification = () => {
//     setNotification({ ...notification, open: false });
//   };

//   // Render calendar header
//   const renderCalendarHeader = () => {
//     let title = '';

//     if (viewMode === 'month') {
//       title = format(currentDate, 'MMMM yyyy', { locale: he });
//     } else if (viewMode === 'week') {
//       const start = startOfWeek(currentDate, { weekStartsOn: 0 });
//       const end = endOfWeek(currentDate, { weekStartsOn: 0 });
//       title = `${format(start, 'd', { locale: he })}-${format(end, 'd MMMM yyyy', { locale: he })}`;
//     } else if (viewMode === 'day') {
//       title = format(currentDate, 'EEEE, d MMMM yyyy', { locale: he });
//     }

//     return (
//       <Box sx={styles.calendarHeader}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={4}>
//             <Box sx={styles.dateNavigation}>
//               <IconButton onClick={() => handleDateChange('prev')} color="primary">
//                 <NavigateBefore />
//               </IconButton>
//               <Typography variant="h5" sx={styles.dateTitle}>
//                 {title}
//               </Typography>
//               <IconButton onClick={() => handleDateChange('next')} color="primary">
//                 <NavigateNext />
//               </IconButton>
//               <Tooltip title="חזור להיום">
//                 <IconButton
//                   onClick={() => setCurrentDate(new Date())}
//                   color="primary"
//                   sx={styles.todayButton}
//                 >
//                   <Today />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </Grid>

//           <Grid item xs={12} md={4} sx={styles.viewModeSwitcher}>
//             <Tabs
//               value={viewMode}
//               onChange={handleViewModeChange}
//               sx={styles.tabs}
//             >
//               <Tab value="month" label="חודש" icon={<CalendarMonth />} />
//               <Tab value="week" label="שבוע" icon={<Event />} />
//               <Tab value="day" label="יום" icon={<Today />} />
//             </Tabs>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <Box sx={styles.searchAndFilter}>
//               <TextField
//                 placeholder="חיפוש חוג או סניף..."
//                 variant="outlined"
//                 size="small"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Search />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={styles.searchField}
//               />

//               <Button
//                 variant="outlined"
//                 color="primary"
//                 startIcon={<FilterList />}
//                 sx={styles.filterButton}
//               >
//                 סינון
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     );
//   };

//   // Render main content based on view mode
//   const renderCalendarContent = () => {
//     if (loading) {
//       return (
//         <Box sx={styles.loadingContainer}>
//           <CircularProgress size={60} thickness={4} />
//           <Typography variant="h6" sx={styles.loadingText}>
//             טוען נתונים...
//           </Typography>
//         </Box>
//       );
//     }

//     return (
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={viewMode}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Box sx={styles.calendarContainer}>
//             {viewMode === 'month' && (
//               <MonthlyCalendar
//                 currentDate={currentDate}
//                 onDateSelect={handleDateSelect}
//                 groups={groups || []}
//                 courses={courses || []}
//                 branches={branches || []}
//                 savedAttendanceRecords={attendanceRecords || {}}
//                 hebrewHolidays={hebrewHolidays}
//                 isActiveDay={isActiveDay}
//                 getHebrewHolidayInfo={getHebrewHolidayInfo}
//               />
//             )}

//             {viewMode === 'week' && (
//               <WeeklyCalendar
//                 currentDate={currentDate}
//                 onDateSelect={handleDateSelect}
//                 events={groups}
//                 attendanceRecords={attendanceRecords}
//                 hebrewHolidays={hebrewHolidays}
//                 isActiveDay={isActiveDay}
//                 getHebrewHolidayInfo={getHebrewHolidayInfo}
//               />
//             )}

//             {viewMode === 'day' && (
//               <DailyCalendar
//                 currentDate={currentDate}
//                 onDateSelect={handleDateSelect}
//                 events={groups}
//                 attendanceRecords={attendanceRecords}
//                 hebrewHolidays={hebrewHolidays}
//                 isActiveDay={isActiveDay}
//                 getHebrewHolidayInfo={getHebrewHolidayInfo}
//               />
//             )}
//           </Box>
//         </motion.div>
//       </AnimatePresence>
//     );
//   };

//   return (
//     <Container maxWidth="xl" sx={styles.root}>
//       <Box sx={styles.pageContainer}>
//         <motion.div
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Box sx={styles.pageHeader}>
//             <Typography variant={isMobile ? "h4" : "h3"} sx={styles.pageTitle}>
//               לוח נוכחות חוגים
//             </Typography>
//             <Typography variant="h6" sx={styles.pageSubtitle}>
//               ניהול ומעקב אחר נוכחות תלמידים בחוגים
//             </Typography>
//           </Box>
//         </motion.div>

//         {renderCalendarHeader()}

//         <Paper sx={styles.calendarPaper}>
//           {renderCalendarContent()}
//         </Paper>

//         {/* Course Selection Dialog */}
//         <CourseSelectionDialog
//           open={courseSelectionOpen}
//           onClose={() => setCourseSelectionOpen(false)}
//           selectedDate={selectedDate}
//           courses={courses || []}
//           branches={branches || []}
//           groups={groups || []}
//           onCourseSelect={handleCourseSelect}
//           onBranchSelect={handleBranchSelect}
//           onGroupSelect={handleGroupSelect}
//         />

//         {/* Attendance Dialog */}
//         <AttendanceDialog
//           open={attendanceDialogOpen}
//           onClose={() => setAttendanceDialogOpen(false)}
//           selectedDate={selectedDate}
//           selectedCourse={selectedCourse}
//           selectedBranch={selectedBranch}
//           selectedGroup={selectedGroup}
//           students={students}
//           attendanceData={attendanceData}
//           onAttendanceChange={handleAttendanceChange}
//           onSave={handleSaveAttendance}
//         />

//         {/* Notifications */}
//         <Snackbar
//           open={notification.open}
//           autoHideDuration={6000}
//           onClose={handleCloseNotification}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//         >
//           <Alert
//             onClose={handleCloseNotification}
//             severity={notification.severity}
//             sx={styles.alert}
//           >
//             {notification.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Container>
//   );
// };

// export default AttendanceCalendar;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container, Box, Typography, Paper, Tabs, Tab,
  IconButton, Button, Chip, Avatar, Badge,
  Grid, Card, CardContent, CardHeader, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemIcon, ListItemButton,
  TextField, InputAdornment, Tooltip, Snackbar, Alert,
  useMediaQuery, useTheme, CircularProgress
} from '@mui/material';
import {
  CalendarMonth, Today, NavigateBefore, NavigateNext,
  Event, School, LocationOn, Group, Person, CheckCircle,
  Cancel, Search, FilterList, Save, Comment, Check,
  ExpandMore, ExpandLess, Close, Info, AccessTime
} from '@mui/icons-material';

// Import date utilities
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { he } from 'date-fns/locale';

// Import Hebrew calendar utilities
import { HDate, HebrewCalendar } from '@hebcal/core';

// Import Redux actions
import { fetchCourses } from '../../store/course/CoursesGetAllThunk';
import { fetchBranches } from '../../store/branch/branchGetAllThunk';
import { fetchGroups } from '../../store/group/groupGellAllThunk';

// Import custom components
import MonthlyCalendar from './components/monthlyCalendar'
import WeeklyCalendar from './components/weeklyCalendar';
import DailyCalendar from './components/dailyCalendar';
import AttendanceDialog from './components/attendanceDialog';
import CourseSelectionDialog from './components/courseSelectionDialog';

// Import styles
import { styles } from './styles/attendanceCalendarStyles';
import { getStudentsByGroupId } from '../../store/student/studentGetByGroup';
import { fetchAttendanceByDate } from '../../store/attendance/fetchAttendanceByDate';
import { saveAttendance } from '../../store/attendance/saveAttendance';
import { updateLocalAttendance } from '../../store/attendance/attendanceSlice';
import { fetchAttendanceRange } from '../../store/attendance/fetchAttendanceRange';

const AttendanceCalendar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Redux state
  const courses = useSelector(state => state.courses.courses || []);
  const branches = useSelector(state => state.branches.branches || []);
  const groups = useSelector(state => state.groups.groups || []);
  const students = useSelector(state => {
    return state.students?.studentsByGroup || [];
  });
  const attendanceRecords = useSelector(state => state.attendances.records || []);
  const loading = useSelector(state =>
    state.courses.loading ||
    state.branches.loading ||
    state.groups.loading ||
    state.students.loading ||
    state.attendances.loading
  );

  // Local state
  const [viewMode, setViewMode] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [courseSelectionOpen, setCourseSelectionOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [hebrewHolidays, setHebrewHolidays] = useState(new Map());

  // פונקציה לטעינת חגים עבריים
  const loadHebrewHolidays = (year) => {
    try {
      const holidays = HebrewCalendar.calendar({ 
        year, 
        isHebrewYear: false,
        candlelighting: false,
        havdalahMins: 0,
        sedrot: false,
        il: true,
        noModern: false,
        noRoshChodesh: true,
        noMinorFasts: false,
        noModernIsrael: false
      });
      
      const holidayMap = new Map();
      
      holidays.forEach(holiday => {
        const dateKey = format(holiday.getDate().greg(), 'yyyy-MM-dd');
        const desc = holiday.getDesc();
        
        // סנן רק חגים מרכזיים
        const isMajorHoliday = (
          desc.includes('Rosh Hashana') ||
          desc.includes('Yom Kippur') ||
          desc.includes('Sukkot') ||
          desc.includes('Simchat Torah') ||
          desc.includes('Shmini Atzeret') ||
          desc.includes('Pesach') ||
          desc.includes('Shavuot') ||
          desc.includes('Chanukah') ||
          desc.includes('Purim') ||
          desc.includes('Tish\'a B\'Av') ||
          desc.includes('Tu BiShvat') ||
          desc.includes('Lag BaOmer') ||
          desc.includes('Yom HaShoah') ||
          desc.includes('Yom HaZikaron') ||
          desc.includes('Yom HaAtzmaut') ||
          desc.includes('Yom Yerushalayim')
        );
        
        if (isMajorHoliday) {
          holidayMap.set(dateKey, {
            name: translateHolidayName(desc),
            nameEn: desc,
            isYomTov: holiday.isYomTov ? holiday.isYomTov() : false,
            isChanukah: desc.includes('Chanukah'),
            isRoshChodesh: desc.includes('Rosh Chodesh')
          });
        }
      });
      
      setHebrewHolidays(prev => new Map([...prev, ...holidayMap]));
    } catch (error) {
      console.error('Error loading Hebrew holidays:', error);
    }
  };

  // פונקציה לתרגום שמות החגים - מתוקנת
  const translateHolidayName = (englishName) => {
    const translations = {
      'Rosh Hashana': 'ראש השנה',
      'Yom Kippur': 'יום כיפור',
      'Sukkot': 'סוכות',
      'Shmini Atzeret': 'שמיני עצרת',
      'Simchat Torah': 'שמחת תורה',
      'Chanukah': 'חנוכה',
      'Tu BiShvat': 'ט"ו בשבט',
      'Purim': 'פורים',
      'Pesach': 'פסח',
      'Yom HaShoah': 'יום השואה',
      'Yom HaZikaron': 'יום הזיכרון',
      'Yom HaAtzmaut': 'יום העצמאות',
      'Lag BaOmer': 'ל"ג בעומר',
      'Yom Yerushalayim': 'יום ירושלים',
      'Shavuot': 'שבועות',
      'Tish\'a B\'Av': 'תשעה באב',
      'Rosh Chodesh': 'ראש חודש'
    };

    // חיפוש חלקי לחגים מורכבים
    for (const [english, hebrew] of Object.entries(translations)) {
      if (englishName.includes(english)) {
        return hebrew;
      }
    }

    return englishName;
  };

  // פונקציה לבדיקה אם יום פעיל לחוגים
  const isActiveDay = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const holiday = hebrewHolidays.get(dateKey);
    
    // בדוק אם זה יום טוב או חג שבו לא מקיימים חוגים
    if (holiday) {
      if (holiday.isYomTov || 
          holiday.name.includes('יום כיפור') ||
          holiday.name.includes('ראש השנה') ||
          holiday.name.includes('פסח') ||
          holiday.name.includes('שבועות') ||
          holiday.name.includes('סוכות') ||
          holiday.name.includes('שמיני עצרת') ||
          holiday.name.includes('שמחת תורה')) {
        return false;
      }
    }
    
    // בדוק אם זה שבת
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 6) {
      return false;
    }
    
    return true;
  };

  // פונקציה לקבלת מידע על חג
  const getHebrewHolidayInfo = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return hebrewHolidays.get(dateKey) || null;
  };

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBranches());
    dispatch(fetchGroups());
    
    // טען חגים עבריים לשנה הנוכחית
    const currentYear = new Date().getFullYear();
    loadHebrewHolidays(currentYear);
    loadHebrewHolidays(currentYear + 1);
  }, [dispatch]);

  useEffect(() => {
    if (students.length > 0 && selectedGroup && selectedDate && studentsLoaded) {
      console.log('Students loaded, initializing attendance data:', students);

      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const existingAttendance = attendanceRecords[dateString] || [];

      const initialAttendance = {};
      students.forEach(student => {
        const existingRecord = existingAttendance.find(r => r.studentId === student.studentId);
        initialAttendance[student.studentId] = existingRecord ? existingRecord.wasPresent : true;
      });

      setAttendanceData(initialAttendance);
      setStudentsLoaded(false);
    }
  }, [students, selectedGroup, selectedDate, studentsLoaded, attendanceRecords]);

  // Handle view mode change
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Handle date navigation
  const handleDateChange = (direction) => {
    if (viewMode === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else if (viewMode === 'day') {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1));
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    console.log('handleDateSelect called with:', date, typeof date);

    if (!date || (date instanceof Date && isNaN(date.getTime()))) {
      console.error('Invalid date selected:', date);
      setNotification({
        open: true,
        message: 'תאריך לא תקין',
        severity: 'error'
      });
      return;
    }

    if (!isActiveDay(date)) {
      const holidayInfo = getHebrewHolidayInfo(date);
      const message = holidayInfo 
        ? `לא ניתן לקבוע נוכחות ב${holidayInfo.name}`
        : 'לא ניתן לקבוע נוכחות ביום זה';
      
      setNotification({
        open: true,
        message,
        severity: 'warning'
      });
      return;
    }

    setSelectedDate(date);
    setCourseSelectionOpen(true);
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    const branchesForCourse = branches.filter(branch =>
      groups.some(group => group.courseId === course.id && group.branchId === branch.id)
    );
    if (branchesForCourse.length === 1) {
      handleBranchSelect(branchesForCourse[0]);
    }
  };

  // Handle branch selection
  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    const groupsForBranchAndCourse = groups.filter(group =>
      group.courseId === selectedCourse.id && group.branchId === branch.id
    );
    if (groupsForBranchAndCourse.length === 1) {
      handleGroupSelect(groupsForBranchAndCourse[0]);
    }
  };

  // Handle group selection
  const handleGroupSelect = async (group) => {
    console.log('handleGroupSelect called with group:', group);
    setSelectedGroup(group);

    try {
      console.log('Dispatching getStudentsByGroupId with:', group.groupId);
      await dispatch(getStudentsByGroupId(group.groupId)).unwrap();
      setStudentsLoaded(true);
    } catch (error) {
      console.error('Failed to load students:', error);
      setNotification({
        open: true,
        message: 'שגיאה בטעינת רשימת התלמידים',
        severity: 'error'
      });
      return;
    }
    // טען נוכחות קיימת
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    try {
      await dispatch(fetchAttendanceByDate({
        groupId: group.groupId,
        date: dateString
      })).unwrap();
    } catch (error) {
      console.warn('No existing attendance found');
    }

    setCourseSelectionOpen(false);
    setAttendanceDialogOpen(true);
  };

  // Handle attendance change
  const handleAttendanceChange = (studentId, wasPresent) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: wasPresent
    }));
  };

  // Handle attendance save
  const handleSaveAttendance = async (note = '') => {
    if (!selectedGroup || !selectedDate || !students || students.length === 0) {
      setNotification({
        open: true,
        message: 'חסרים נתונים לשמירת הנוכחות',
        severity: 'error'
      });
      return;
    }

    try {
      const attendanceToSave = {
        groupId: selectedGroup.groupId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        note: note || '',
        attendanceRecords: Object.keys(attendanceData).map(studentId => {
          const student = students.find(s => s.studentId === parseInt(studentId));
          return {
            studentId: parseInt(studentId),
            wasPresent: attendanceData[studentId],
            studentName: student?.studentName || '',
            note: ''
          };
        })
      };

      console.log('Saving attendance:', attendanceToSave);
      await dispatch(saveAttendance(attendanceToSave)).unwrap();

      setAttendanceDialogOpen(false);
      setNotification({
        open: true,
        message: 'נתוני הנוכחות נשמרו בהצלחה',
        severity: 'success'
      });

      // איפוס הבחירות
      setSelectedCourse(null);
      setSelectedBranch(null);
      setSelectedGroup(null);
      setAttendanceData({});
      setSelectedDate(null);

    } catch (error) {
      console.error('Save attendance error:', error);
      setNotification({
        open: true,
        message: 'שגיאה בשמירת נתוני הנוכחות',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    const loadMonthlyAttendance = async () => {
      if (groups.length > 0 && viewMode === 'month') {
        const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
        const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

        const activeGroups = groups.filter(group => group.isActive !== false);

        for (const group of activeGroups) {
          try {
            // await dispatch(fetchAttendanceRange({
            //     groupId: group.groupId,
            //     startDate,
            //     endDate
            // }));
          } catch (error) {
            console.error(`Failed to load attendance for group ${group.groupId}:`, error);
          }
        }
      }
    };

    loadMonthlyAttendance();
  }, [currentDate, viewMode, groups, dispatch]);

  useEffect(() => {
    if (students.length > 0 && selectedGroup && selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const existingAttendance = attendanceRecords[dateString] || [];

      const updatedAttendanceData = {};
      students.forEach(student => {
        const existingRecord = existingAttendance.find(r => r.studentId === student.studentId);
        updatedAttendanceData[student.studentId] = existingRecord ? existingRecord.wasPresent :
          (attendanceData[student.studentId] !== undefined ? attendanceData[student.studentId] : true);
      });

      if (Object.keys(updatedAttendanceData).length !== Object.keys(attendanceData).length ||
        Object.keys(updatedAttendanceData).some(key => updatedAttendanceData[key] !== attendanceData[key])) {
        setAttendanceData(updatedAttendanceData);
      }
    }
  }, [students, selectedGroup, selectedDate, attendanceData]);

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Render calendar header
  const renderCalendarHeader = () => {
    let title = '';

    if (viewMode === 'month') {
      title = format(currentDate, 'MMMM yyyy', { locale: he });
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      title = `${format(start, 'd', { locale: he })}-${format(end, 'd MMMM yyyy', { locale: he })}`;
    } else if (viewMode === 'day') {
      title = format(currentDate, 'EEEE, d MMMM yyyy', { locale: he });
    }

    return (
      <Box sx={styles.calendarHeader}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={styles.dateNavigation}>
              <IconButton onClick={() => handleDateChange('prev')} color="primary">
                <NavigateBefore />
              </IconButton>
              <Typography variant="h5" sx={styles.dateTitle}>
                {title}
              </Typography>
              <IconButton onClick={() => handleDateChange('next')} color="primary">
                <NavigateNext />
              </IconButton>
              <Tooltip title="חזור להיום">
                <IconButton
                  onClick={() => setCurrentDate(new Date())}
                  color="primary"
                  sx={styles.todayButton}
                >
                  <Today />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} sx={styles.viewModeSwitcher}>
            <Tabs
              value={viewMode}
              onChange={handleViewModeChange}
              sx={styles.tabs}
            >
              <Tab value="month" label="חודש" icon={<CalendarMonth />} />
              <Tab value="week" label="שבוע" icon={<Event />} />
              <Tab value="day" label="יום" icon={<Today />} />
            </Tabs>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={styles.searchAndFilter}>
              <TextField
                placeholder="חיפוש חוג או סניף..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={styles.searchField}
              />

              <Button
                variant="outlined"
                color="primary"
                startIcon={<FilterList />}
                sx={styles.filterButton}
              >
                סינון
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Render main content based on view mode
  const renderCalendarContent = () => {
    if (loading) {
      return (
        <Box sx={styles.loadingContainer}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={styles.loadingText}>
            טוען נתונים...
          </Typography>
        </Box>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={styles.calendarContainer}>
            {viewMode === 'month' && (
              <MonthlyCalendar
                currentDate={currentDate}
                onDateSelect={handleDateSelect}
                groups={groups || []}
                courses={courses || []}
                branches={branches || []}
                savedAttendanceRecords={attendanceRecords || {}}
                hebrewHolidays={hebrewHolidays}
                isActiveDay={isActiveDay}
                getHebrewHolidayInfo={getHebrewHolidayInfo}
              />
            )}

            {viewMode === 'week' && (
              <WeeklyCalendar
                currentDate={currentDate}
                onDateSelect={handleDateSelect}
                events={groups}
                attendanceRecords={attendanceRecords}
                hebrewHolidays={hebrewHolidays}
                isActiveDay={isActiveDay}
                getHebrewHolidayInfo={getHebrewHolidayInfo}
              />
            )}

            {viewMode === 'day' && (
              <DailyCalendar
                currentDate={currentDate}
                onDateSelect={handleDateSelect}
                events={groups}
                attendanceRecords={attendanceRecords}
                hebrewHolidays={hebrewHolidays}
                isActiveDay={isActiveDay}
                getHebrewHolidayInfo={getHebrewHolidayInfo}
              />
            )}
          </Box>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Container maxWidth="xl" sx={styles.root}>
      <Box sx={styles.pageContainer}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={styles.pageHeader}>
            <Typography variant={isMobile ? "h4" : "h3"} sx={styles.pageTitle}>
              לוח נוכחות חוגים
            </Typography>
            <Typography variant="h6" sx={styles.pageSubtitle}>
              ניהול ומעקב אחר נוכחות תלמידים בחוגים
            </Typography>
          </Box>
        </motion.div>

        {renderCalendarHeader()}

        <Paper sx={styles.calendarPaper}>
          {renderCalendarContent()}
        </Paper>

        {/* Course Selection Dialog */}
        <CourseSelectionDialog
          open={courseSelectionOpen}
          onClose={() => setCourseSelectionOpen(false)}
          selectedDate={selectedDate}
          courses={courses || []}
          branches={branches || []}
          groups={groups || []}
          onCourseSelect={handleCourseSelect}
          onBranchSelect={handleBranchSelect}
          onGroupSelect={handleGroupSelect}
        />

        {/* Attendance Dialog */}
        <AttendanceDialog
          open={attendanceDialogOpen}
          onClose={() => setAttendanceDialogOpen(false)}
          selectedDate={selectedDate}
          selectedCourse={selectedCourse}
          selectedBranch={selectedBranch}
          selectedGroup={selectedGroup}
          students={students}
          attendanceData={attendanceData}
          onAttendanceChange={handleAttendanceChange}
          onSave={handleSaveAttendance}
        />

        {/* Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={styles.alert}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default AttendanceCalendar;
