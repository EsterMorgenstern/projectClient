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
  }); const attendanceRecords = useSelector(state => state.attendances.records || []);
  const loading = useSelector(state =>
    state.courses.loading ||
    state.branches.loading ||
    state.groups.loading ||
    state.students.loading ||
    state.attendances.loading
  );

  // Local state
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
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

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBranches());
    dispatch(fetchGroups());

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
      setStudentsLoaded(false); // איפוס הדגל
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

    // וודא שזה תאריך תקין
    if (!date || (date instanceof Date && isNaN(date.getTime()))) {
      console.error('Invalid date selected:', date);
      setNotification({
        open: true,
        message: 'תאריך לא תקין',
        severity: 'error'
      });
      return;
    }

    setSelectedDate(date);
    setCourseSelectionOpen(true);
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    // In a real app, you would filter branches by course
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
    // In a real app, you would filter groups by course and branch
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

      // סמן שהסטודנטים נטענו - זה יפעיל את ה-useEffect
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

    const dateString = format(selectedDate, 'yyyy-MM-dd');

    // dispatch(updateLocalAttendance({
    //     date: dateString,
    //     studentId,
    //     wasPresent
    // }));
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

        // טען נוכחות לכל הקבוצות הפעילות
        const activeGroups = groups.filter(group => group.isActive !== false);

        for (const group of activeGroups) {
          try {
            // רק אם יש לך את הפונקציה fetchAttendanceRange
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
    // סנכרן נתוני נוכחות כאשר הסטודנטים משתנים
    if (students.length > 0 && selectedGroup && selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const existingAttendance = attendanceRecords[dateString] || [];

      const updatedAttendanceData = {};
      students.forEach(student => {
        const existingRecord = existingAttendance.find(r => r.studentId === student.studentId);
        updatedAttendanceData[student.studentId] = existingRecord ? existingRecord.wasPresent :
          (attendanceData[student.studentId] !== undefined ? attendanceData[student.studentId] : true);
      });

      // עדכן רק אם יש שינוי
      if (Object.keys(updatedAttendanceData).length !== Object.keys(attendanceData).length ||
        Object.keys(updatedAttendanceData).some(key => updatedAttendanceData[key] !== attendanceData[key])) {
        setAttendanceData(updatedAttendanceData);
      }
    }
  }, [students, selectedGroup, selectedDate]);
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
        <Box
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          sx={styles.calendarContainer}
        >
          {viewMode === 'month' && (
            <MonthlyCalendar
              currentDate={currentDate}
              onDateSelect={handleDateSelect}
              groups={groups || []}
              courses={courses || []}
              branches={branches || []}
              savedAttendanceRecords={attendanceRecords || {}}
            />
          )}

          {viewMode === 'week' && (
            <WeeklyCalendar
              currentDate={currentDate}
              onDateSelect={handleDateSelect}
              events={groups} // In a real app, you would transform groups into events
              attendanceRecords={attendanceRecords}
            />
          )}

          {viewMode === 'day' && (
            <DailyCalendar
              currentDate={currentDate}
              onDateSelect={handleDateSelect}
              events={groups} // In a real app, you would transform groups into events
              attendanceRecords={attendanceRecords}
            />
          )}
        </Box>
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
          sx={styles.pageHeader}
        >
          <Typography variant={isMobile ? "h4" : "h3"} sx={styles.pageTitle}>
            לוח נוכחות חוגים
          </Typography>
          <Typography variant="h6" sx={styles.pageSubtitle}>
            ניהול ומעקב אחר נוכחות תלמידים בחוגים
          </Typography>
        </motion.div>

        {renderCalendarHeader()}

        <Paper sx={styles.calendarPaper}>
          {renderCalendarContent()}
        </Paper>

        {/* Course Selection Dialog */}
        <CourseSelectionDialog
          open={courseSelectionOpen}
          onClose={() => setCourseSelectionOpen(false)}
          selectedDate={selectedDate} // וודא שזה לא null
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
