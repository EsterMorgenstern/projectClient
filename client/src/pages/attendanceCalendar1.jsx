
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Container,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Checkbox,
  Avatar,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Collapse,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  School as CourseIcon,
  LocationOn as BranchIcon,
  Group as GroupIcon,
  PersonAdd as EnrollIcon,
  ArrowBack as BackIcon,
  Event as CalendarIcon,
  Person as StudentIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Add as AddIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Diversity3 as SectorIcon,
  CalendarMonth as DayIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
  Today as TodayIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { fetchCourses } from '../store/course/CoursesGetAllThunk';
import { fetchBranches } from '../store/branch/branchGetAllThunk';
import { getGroupsByCourseId } from '../store/group/groupGetGroupsByCourseIdThunk';
import { getgroupStudentByStudentId } from '../store/groupStudent/groupStudentGetByStudentIdThunk';

// ייבוא ספריית תאריכים עברית
import { HebrewCalendar, HDate, Location, Locale } from '@hebcal/core';

const AttendanceCalendar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Redux state
  const courses = useSelector(state => state.courses.courses || []);
  const branches = useSelector(state => state.branches.branches || []);
  const groups = useSelector(state => state.groups.groupsByCourseId || []);
  const loading = useSelector(state =>
    state.courses.loading ||
    state.branches.loading ||
    state.groups.loading
  );

  // Local state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [dayCoursesDialog, setDayCoursesDialog] = useState(false);
  const [dayCourses, setDayCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceDialog, setAttendanceDialog] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [filter, setFilter] = useState('all'); // all, courses, branches
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [savedAttendance, setSavedAttendance] = useState({});
  const [attendanceNote, setAttendanceNote] = useState('');
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [weekDays, setWeekDays] = useState([]);
  const [weekStartDate, setWeekStartDate] = useState(null);

  // הגדרת מיקום בישראל לחישוב תאריכים עבריים
  const israelLocation = Location.lookup('Jerusalem');

  // מיפוי חודשים עבריים לעברית
  const hebrewMonthsMap = {
    'Nisan': 'ניסן',
    'Iyyar': 'אייר',
    'Sivan': 'סיון',
    'Tamuz': 'תמוז',
    'Av': 'אב',
    'Elul': 'אלול',
    'Tishrei': 'תשרי',
    'Cheshvan': 'חשון',
    'Kislev': 'כסלו',
    'Tevet': 'טבת',
    'Shvat': 'שבט',
    'Adar': 'אדר',
    'Adar I': 'אדר א׳',
    'Adar II': 'אדר ב׳'
  };

  // מיפוי חודשים לועזיים לעברית
  const gregorianMonthsMap = {
    0: 'ינואר',
    1: 'פברואר',
    2: 'מרץ',
    3: 'אפריל',
    4: 'מאי',
    5: 'יוני',
    6: 'יולי',
    7: 'אוגוסט',
    8: 'ספטמבר',
    9: 'אוקטובר',
    10: 'נובמבר',
    11: 'דצמבר'
  };

  // יצירת לוח שנה לחודש הנוכחי
  useEffect(() => {
    if (viewMode === 'month') {
      generateCalendarDays();
    } else if (viewMode === 'week') {
      generateWeekDays();
    }
  }, [currentDate, viewMode]);

  // טעינת נתונים ראשונית
  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBranches());
  }, [dispatch]);

  // פונקציה ליצירת מערך ימי החודש
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // היום הראשון בחודש
    const firstDayOfMonth = new Date(year, month, 1);
    // היום האחרון בחודש
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // מספר הימים בחודש
    const daysInMonth = lastDayOfMonth.getDate();
    
    // היום בשבוע של היום הראשון בחודש (0 = ראשון, 6 = שבת)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // התאמה ללוח שנה שמתחיל ביום ראשון
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days = [];
    
    // ימים מהחודש הקודם
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      const hebrewDate = new HDate(date);
      days.push({
        date,
        day: daysInPrevMonth - i,
        currentMonth: false,
        isToday: isSameDay(date, new Date()),
        hebrewDate: hebrewDate.toString('h'),
        events: getEventsForDay(date)
      });
    }
    
    // ימים מהחודש הנוכחי
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const hebrewDate = new HDate(date);
      days.push({
        date,
        day: i,
        currentMonth: true,
        isToday: isSameDay(date, new Date()),
        hebrewDate: hebrewDate.toString('h'),
        events: getEventsForDay(date)
      });
    }
    
    // ימים מהחודש הבא
    const daysNeeded = 42 - days.length; // תמיד נציג 6 שורות של 7 ימים
    for (let i = 1; i <= daysNeeded; i++) {
      const date = new Date(year, month + 1, i);
      const hebrewDate = new HDate(date);
      days.push({
        date,
        day: i,
        currentMonth: false,
        isToday: isSameDay(date, new Date()),
        hebrewDate: hebrewDate.toString('h'),
        events: getEventsForDay(date)
      });
    }
    
    setCalendarDays(days);
  };

  // פונקציה ליצירת מערך ימי השבוע
  const generateWeekDays = () => {
    // אם לא נבחר תאריך התחלה לשבוע, נשתמש בתאריך הנוכחי
    const startDate = weekStartDate || new Date(currentDate);
    
    // מציאת יום ראשון של השבוע הנוכחי
    const dayOfWeek = startDate.getDay(); // 0 = ראשון, 6 = שבת
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    // שמירת תאריך תחילת השבוע
    setWeekStartDate(new Date(startDate));
    
    const days = [];
    
    // יצירת 7 ימים החל מיום ראשון
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const hebrewDate = new HDate(date);
      days.push({
        date,
        day: date.getDate(),
        dayOfWeek: i,
        currentMonth: date.getMonth() === currentDate.getMonth(),
        isToday: isSameDay(date, new Date()),
        hebrewDate: hebrewDate.toString('h'),
        events: getEventsForDay(date)
      });
    }
    
    setWeekDays(days);
  };

  // בדיקה אם שני תאריכים הם אותו יום
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  };

  // פונקציה לקבלת אירועים ליום מסוים (חוגים)
  const getEventsForDay = (date) => {
    // כאן נחזיר את החוגים שמתקיימים ביום זה
    // לדוגמה, נבדוק אם היום בשבוע של התאריך תואם ליום של החוג
    const dayOfWeek = date.getDay();
    const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const hebrewDayName = hebrewDays[dayOfWeek];
    
    // סינון החוגים שמתקיימים ביום זה
    const dayEvents = groups.filter(group => group.dayOfWeek === hebrewDayName);
    
    // בדיקה אם יש נתוני נוכחות שמורים ליום זה
    dayEvents.forEach(event => {
      const attendanceKey = `${date.toDateString()}-${event.groupId}`;
      if (savedAttendance[attendanceKey]) {
        event.attendanceRecorded = true;
        event.presentCount = Object.values(savedAttendance[attendanceKey].attendance).filter(present => present).length;
      }
    });
    
    return dayEvents;
  };

  // פונקציה לטיפול בלחיצה על יום בלוח השנה
  const handleDateClick = (day) => {
    setSelectedDate(day.date);
    
    // קבלת החוגים ליום זה
    const dayEvents = day.events;
    
    // ארגון החוגים לפי סניפים וסוגי חוגים
    const organizedEvents = organizeEventsByBranchAndCourse(dayEvents);
    
    setDayCourses(organizedEvents);
    setDayCoursesDialog(true);
  };

  // פונקציה לארגון החוגים לפי סניפים וסוגי חוגים
  const organizeEventsByBranchAndCourse = (events) => {
    const organized = {};
    
    events.forEach(event => {
      // מציאת הסניף והחוג המתאימים
      const branch = branches.find(b => b.branchId === event.branchId);
      const course = courses.find(c => c.courseId === event.courseId);
      
      if (branch && course) {
        if (!organized[branch.name]) {
          organized[branch.name] = {
            branchId: branch.branchId,
            branchName: branch.name,
            branchCity: branch.city,
            courses: {}
          };
        }
        
        if (!organized[branch.name].courses[course.couresName]) {
          organized[branch.name].courses[course.couresName] = {
            courseId: course.courseId,
            courseName: course.couresName,
            groups: []
          };
        }
        
        organized[branch.name].courses[course.couresName].groups.push({
          ...event,
          branchName: branch.name,
          courseName: course.couresName
        });
      }
    });
    
    return organized;
  };

  // פונקציה לטיפול בלחיצה על חוג ספציפי
  const handleCourseClick = async (group) => {
    setSelectedCourse(group);
    
    try {
      // כאן נטען את רשימת התלמידים בחוג
      // לדוגמה, נשתמש בנתונים מדומים
      const mockStudents = [
        { id: 1, name: 'ישראל ישראלי', age: 10, attendanceRate: 85 },
        { id: 2, name: 'שרה כהן', age: 9, attendanceRate: 92 },
        { id: 3, name: 'יוסף לוי', age: 11, attendanceRate: 78 },
        { id: 4, name: 'רחל גולדברג', age: 10, attendanceRate: 95 },
        { id: 5, name: 'משה פרידמן', age: 9, attendanceRate: 88 },
        { id: 6, name: 'חנה רוזנברג', age: 10, attendanceRate: 90 },
        { id: 7, name: 'דוד שטיין', age: 11, attendanceRate: 82 },
        { id: 8, name: 'אסתר וייס', age: 9, attendanceRate: 93 }
      ];
      
      setStudents(mockStudents);
      
      // בדיקה אם יש נתוני נוכחות שמורים ליום ולחוג זה
      const attendanceKey = `${selectedDate.toDateString()}-${group.groupId}`;
      if (savedAttendance[attendanceKey]) {
        setAttendance(savedAttendance[attendanceKey].attendance);
        setAttendanceNote(savedAttendance[attendanceKey].note || '');
      } else {
        // אתחול נתוני נוכחות ריקים
        const initialAttendance = {};
        mockStudents.forEach(student => {
          initialAttendance[student.id] = true; // ברירת מחדל: כולם נוכחים
        });
        setAttendance(initialAttendance);
        setAttendanceNote('');
      }
      
      setAttendanceDialog(true);
    } catch (error) {
      console.error("Error fetching students:", error);
      setNotification({
        open: true,
        message: 'שגיאה בטעינת רשימת התלמידים',
        severity: 'error'
      });
    }
  };

  // פונקציה לשמירת נתוני נוכחות
  const handleSaveAttendance = () => {
    try {
      // יצירת מפתח ייחודי ליום ולחוג
      const attendanceKey = `${selectedDate.toDateString()}-${selectedCourse.groupId}`;
      
      // שמירת נתוני הנוכחות
      const updatedSavedAttendance = {
        ...savedAttendance,
        [attendanceKey]: {
          attendance,
          note: attendanceNote,
          timestamp: new Date().toISOString()
        }
      };
      
      setSavedAttendance(updatedSavedAttendance);
      
      // כאן יש לשלוח את הנתונים לשרת
      // לדוגמה: dispatch(saveAttendanceThunk({ groupId: selectedCourse.groupId, date: selectedDate, attendance, note: attendanceNote }));
      
      setAttendanceDialog(false);
      setNotification({
        open: true,
        message: 'נתוני הנוכחות נשמרו בהצלחה',
        severity: 'success'
      });
      
      // עדכון מספר הנוכחים בחוג ביום זה
      const presentCount = Object.values(attendance).filter(present => present).length;
      
      // עדכון הנתונים בלוח השנה
      updateCalendarWithAttendance(selectedDate, selectedCourse.groupId, presentCount);
      
    } catch (error) {
      console.error("Error saving attendance:", error);
      setNotification({
        open: true,
        message: 'שגיאה בשמירת נתוני הנוכחות',
        severity: 'error'
      });
    }
  };

  // פונקציה לעדכון לוח השנה עם נתוני נוכחות
  const updateCalendarWithAttendance = (date, groupId, presentCount) => {
    if (viewMode === 'month') {
      const updatedCalendarDays = calendarDays.map(day => {
        if (isSameDay(day.date, date)) {
          // עדכון האירועים של היום
          const updatedEvents = day.events.map(event => {
            if (event.groupId === groupId) {
              return {
                ...event,
                attendanceRecorded: true,
                presentCount
              };
            }
            return event;
          });
          
          return {
            ...day,
            events: updatedEvents,
            hasAttendance: true // סימון שיש נוכחות ביום זה
          };
        }
        return day;
      });
      
      setCalendarDays(updatedCalendarDays);
    } else if (viewMode === 'week') {
      const updatedWeekDays = weekDays.map(day => {
        if (isSameDay(day.date, date)) {
          // עדכון האירועים של היום
          const updatedEvents = day.events.map(event => {
            if (event.groupId === groupId) {
              return {
                ...event,
                attendanceRecorded: true,
                presentCount
              };
            }
            return event;
          });
          
          return {
            ...day,
            events: updatedEvents,
            hasAttendance: true // סימון שיש נוכחות ביום זה
          };
        }
        return day;
      });
      
      setWeekDays(updatedWeekDays);
    }
  };

  // פונקציה לטיפול בשינוי חודש
  const handleMonthChange = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        if (viewMode === 'month') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else if (viewMode === 'week') {
          newDate.setDate(newDate.getDate() - 7);
          setWeekStartDate(null); // איפוס תאריך התחלת השבוע כדי שיחושב מחדש
        }
      } else {
        if (viewMode === 'month') {
          newDate.setMonth(newDate.getMonth() + 1);
        } else if (viewMode === 'week') {
          newDate.setDate(newDate.getDate() + 7);
          setWeekStartDate(null); // איפוס תאריך התחלת השבוע כדי שיחושב מחדש
        }
      }
      return newDate;
    });
  };

  // פונקציה לחזרה לחודש הנוכחי
  const handleGoToToday = () => {
    setCurrentDate(new Date());
    setWeekStartDate(null); // איפוס תאריך התחלת השבוע כדי שיחושב מחדש
  };

  // פונקציה לטיפול בשינוי מצב תצוגה
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
      
      // איפוס תאריך התחלת השבוע כדי שיחושב מחדש
      if (newMode === 'week') {
        setWeekStartDate(null);
      }
    }
  };

  // פונקציה לטיפול בשינוי סינון
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setFilterMenuAnchor(null);
  };

  // פונקציה לטיפול בשינוי חיפוש
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // פונקציה לטיפול בפתיחת/סגירת סניף
  const handleToggleBranch = (branchName) => {
    setExpandedBranch(expandedBranch === branchName ? null : branchName);
  };

  // פונקציה לטיפול בשינוי נוכחות תלמיד
  const handleAttendanceChange = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  // פונקציה לסגירת הודעה
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // רינדור ראש הלוח
  const renderCalendarHeader = () => {
    // קבלת שם החודש העברי והלועזי
    const hebrewDate = new HDate(currentDate);
    const hebrewMonthName = hebrewMonthsMap[hebrewDate.getMonthName('h')] || hebrewDate.getMonthName('h');
    const hebrewYear = hebrewDate.getFullYear();
    const gregorianMonthName = gregorianMonthsMap[currentDate.getMonth()];
    
    // כותרת בהתאם למצב התצוגה
    let headerTitle = '';
    if (viewMode === 'month') {
      headerTitle = `${gregorianMonthName} ${currentDate.getFullYear()}`;
    } else if (viewMode === 'week') {
      // אם יש תאריך התחלת שבוע
      if (weekStartDate) {
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekStartDate.getDate() + 6);
        
        // פורמט התאריכים
        const startDay = weekStartDate.getDate();
        const endDay = weekEndDate.getDate();
        const startMonth = gregorianMonthsMap[weekStartDate.getMonth()];
        const endMonth = gregorianMonthsMap[weekEndDate.getMonth()];
        
        if (startMonth === endMonth) {
          headerTitle = `${startDay}-${endDay} ${startMonth} ${weekStartDate.getFullYear()}`;
        } else {
          headerTitle = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${weekStartDate.getFullYear()}`;
        }
      }
    }
    
    return (
      <Box sx={{ mb: 3 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => handleMonthChange('prev')} color="primary">
                <PrevIcon />
              </IconButton>
              <Typography variant="h5" fontWeight="bold" color="#1E3A8A" sx={{ mx: 2 }}>
                {headerTitle}
              </Typography>
              <IconButton onClick={() => handleMonthChange('next')} color="primary">
                <NextIcon />
              </IconButton>
              <Tooltip title="חזור להיום">
                <IconButton 
                  onClick={handleGoToToday} 
                  color="primary" 
                  sx={{ ml: 1, bgcolor: 'rgba(59, 130, 246, 0.1)' }}
                >
                  <TodayIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ textAlign: 'center', my: { xs: 2, md: 0 } }}>
            <Typography variant="h6" color="#64748B">
              {hebrewMonthName} {hebrewYear}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
            <Tabs 
              value={viewMode} 
              onChange={handleViewModeChange}
              sx={{ 
                '& .MuiTab-root': { 
                  minWidth: 'auto',
                  px: { xs: 1, sm: 2 }
                }
              }}
            >
              <Tab value="month" label="חודש" />
              <Tab value="week" label="שבוע" />
              <Tab value="day" label="יום" />
            </Tabs>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="חיפוש חוג או סניף..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              flexGrow: 1, 
              maxWidth: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterIcon />}
            onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
            sx={{ 
              borderRadius: '8px',
              borderWidth: '2px',
              '&:hover': { borderWidth: '2px' }
            }}
          >
            סינון
          </Button>
          
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={() => setFilterMenuAnchor(null)}
          >
            <MenuItem onClick={() => handleFilterChange('all')}>
              <ListItemIcon>
                {filter === 'all' && <CheckIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText>הכל</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange('courses')}>
              <ListItemIcon>
                {filter === 'courses' && <CheckIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText>חוגים</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleFilterChange('branches')}>
              <ListItemIcon>
                {filter === 'branches' && <CheckIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText>סניפים</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    );
  };

  // רינדור ימי השבוע
  const renderWeekDays = () => {
    const weekDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    
    return (
      <Grid container sx={{ mb: 1, textAlign: 'center' }}>
        {weekDays.map((day, index) => (
          <Grid item xs={12/7} key={index}>
            <Typography 
              variant="subtitle2" 
              fontWeight="bold" 
              color={index === 6 ? '#E11D48' : '#1E293B'}
              sx={{ py: 1 }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  // רינדור לוח השנה החודשי
  const renderMonthView = () => {
    return (
      <Grid container spacing={1}>
        {renderWeekDays()}
        
        <Grid container>
          {calendarDays.map((day, index) => (
            <Grid item xs={12/7} key={index}>
              <Paper
                component={motion.div}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  p: { xs: 1, md: 2 },
                  height: { xs: 100, sm: 120, md: 140 },
                  borderRadius: 2,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: day.hasAttendance 
                    ? 'rgba(16, 185, 129, 0.1)' // צבע ירוק בהיר אם יש נוכחות
                    : day.isToday 
                      ? 'rgba(59, 130, 246, 0.1)' 
                      : day.currentMonth ? 'white' : 'rgba(241, 245, 249, 0.7)',
                  border: day.hasAttendance
                    ? '2px solid rgba(16, 185, 129, 0.5)'
                    : day.isToday ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                  opacity: day.currentMonth ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    bgcolor: day.hasAttendance
                      ? 'rgba(16, 185, 129, 0.15)'
                      : day.isToday 
                        ? 'rgba(59, 130, 246, 0.15)' 
                        : 'rgba(241, 245, 249, 0.5)',
                  }
                }}
                onClick={() => handleDateClick(day)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography 
                    variant="body1" 
                    color={
                      day.hasAttendance
                        ? '#10B981'
                        : day.isToday ? '#3B82F6' : day.currentMonth ? 'text.primary' : 'text.secondary'
                    }
                    fontWeight={day.isToday || day.hasAttendance ? 'bold' : 'normal'}
                  >
                    {day.day}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                  >
                    {day.hebrewDate}
                  </Typography>
                </Box>
                
                {/* אירועים (חוגים) */}
                <Box sx={{ 
                  mt: 1, 
                  maxHeight: { xs: 60, sm: 70 }, 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5
                }}>
                  {day.events.slice(0, 3).map((event, idx) => (
                    <Chip
                      key={idx}
                      size="small"
                      label={`${event.courseName || 'חוג'} ${event.groupName}`}
                      sx={{ 
                        height: 'auto',
                        py: 0.3,
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        backgroundColor: event.attendanceRecorded 
                          ? 'rgba(16, 185, 129, 0.2)' 
                          : 'rgba(99, 102, 241, 0.2)',
                        color: event.attendanceRecorded ? '#065F46' : '#4338CA',
                        fontWeight: event.attendanceRecorded ? 'bold' : 'normal',
                        '& .MuiChip-label': {
                          px: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }
                      }}
                    />
                  ))}
                  
                  {day.events.length > 3 && (
                    <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                      +{day.events.length - 3} נוספים
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  };

  // רינדור תצוגת שבוע
  const renderWeekView = () => {
    const timeSlots = [
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
      '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];
    
    // פונקציה עזר לקבלת אירועים בשעה מסוימת
    const getEventsAtTime = (day, timeSlot) => {
      return day.events.filter(event => {
        // הנחה: שדה hour מכיל את השעה בפורמט "HH:MM"
        const eventHour = event.hour ? event.hour.split(':')[0] : null;
        const slotHour = timeSlot.split(':')[0];
        return eventHour === slotHour;
      });
    };
    
    return (
      <Box sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E2E8F0', borderRadius: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    width: '80px', 
                    bgcolor: '#F8FAFC', 
                    borderBottom: '2px solid #E2E8F0',
                    fontWeight: 'bold'
                  }}
                >
                  שעה
                </TableCell>
                {weekDays.map((day, index) => (
                  <TableCell 
                    key={index} 
                    align="center"
                    sx={{ 
                      bgcolor: day.isToday ? 'rgba(59, 130, 246, 0.1)' : '#F8FAFC',
                      borderBottom: '2px solid #E2E8F0',
                      borderLeft: index === weekDays.length - 1 ? 'none' : '1px solid #E2E8F0',
                      fontWeight: 'bold',
                      minWidth: '150px'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color={day.isToday ? '#3B82F6' : '#1E293B'}>
                        {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][day.dayOfWeek]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {day.day} / {day.date.getMonth() + 1}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {day.hebrewDate}
                      </Typography>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map((timeSlot, timeIndex) => (
                <TableRow key={timeIndex} sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(241, 245, 249, 0.3)' } }}>
                  <TableCell 
                    sx={{ 
                      width: '80px', 
                      borderRight: '1px solid #E2E8F0',
                      bgcolor: '#F8FAFC',
                      fontWeight: 'bold',
                      color: '#64748B'
                    }}
                  >
                    {timeSlot}
                  </TableCell>
                  {weekDays.map((day, dayIndex) => {
                    const eventsAtTime = getEventsAtTime(day, timeSlot);
                    return (
                      <TableCell 
                        key={dayIndex} 
                        align="center"
                        sx={{ 
                          position: 'relative',
                          height: '100px',
                          p: 1,
                          borderLeft: dayIndex === weekDays.length - 1 ? 'none' : '1px solid #E2E8F0',
                          cursor: eventsAtTime.length > 0 ? 'pointer' : 'default',
                          '&:hover': {
                            bgcolor: eventsAtTime.length > 0 ? 'rgba(241, 245, 249, 0.5)' : 'inherit'
                          }
                        }}
                        onClick={() => eventsAtTime.length > 0 && handleDateClick(day)}
                      >
                        {eventsAtTime.length > 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {eventsAtTime.map((event, eventIndex) => (
                              <Paper
                                key={eventIndex}
                                elevation={0}
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: event.attendanceRecorded 
                                    ? 'rgba(16, 185, 129, 0.2)' 
                                    : 'rgba(99, 102, 241, 0.2)',
                                  border: event.attendanceRecorded 
                                    ? '1px solid rgba(16, 185, 129, 0.5)' 
                                    : '1px solid rgba(99, 102, 241, 0.5)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'start',
                                  transition: 'transform 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.02)'
                                  }
                                }}
                              >
                                <Typography 
                                  variant="body2" 
                                  fontWeight="bold"
                                  color={event.attendanceRecorded ? '#065F46' : '#4338CA'}
                                >
                                  {event.courseName} - {event.groupName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TimeIcon sx={{ fontSize: '0.8rem', mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                      {event.hour}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <BranchIcon sx={{ fontSize: '0.8rem', mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                      {event.branchName}
                                    </Typography>
                                  </Box>
                                </Box>
                                {event.attendanceRecorded && (
                                  <Chip
                                    size="small"
                                    label={`נוכחות: ${event.presentCount || 0}`}
                                    sx={{ 
                                      height: 20, 
                                      mt: 0.5,
                                      fontSize: '0.65rem',
                                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                                      color: '#065F46'
                                    }}
                                  />
                                )}
                              </Paper>
                            ))}
                          </Box>
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // רינדור תצוגת יום
  const renderDayView = () => {
    // כאן יש לממש את תצוגת היום
    const timeSlots = [
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
      '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];
    
    // אם אין תאריך נבחר, נשתמש בתאריך הנוכחי
    const dayToShow = selectedDate || currentDate;
    const hebrewDate = new HDate(dayToShow);
    
    // קבלת היום בשבוע
    const dayOfWeek = dayToShow.getDay();
    const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const hebrewDayName = hebrewDays[dayOfWeek];
    
    // קבלת האירועים ליום זה
    const dayEvents = getEventsForDay(dayToShow);
    
    // פונקציה עזר לקבלת אירועים בשעה מסוימת
    const getEventsAtTime = (timeSlot) => {
      return dayEvents.filter(event => {
        // הנחה: שדה hour מכיל את השעה בפורמט "HH:MM"
        const eventHour = event.hour ? event.hour.split(':')[0] : null;
        const slotHour = timeSlot.split(':')[0];
        return eventHour === slotHour;
      });
    };
    
    // פורמט התאריך
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dayToShow.toLocaleDateString('he-IL', dateOptions);
    
    return (
      <Box>
        <Box sx={{ 
          mb: 3, 
          p: 2, 
          borderRadius: 2, 
          bgcolor: 'rgba(59, 130, 246, 0.05)', 
          border: '1px solid rgba(59, 130, 246, 0.2)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="#1E3A8A">
              {hebrewDayName}, {formattedDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {hebrewDate.toString('h')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PrevIcon />}
              onClick={() => {
                const newDate = new Date(dayToShow);
                newDate.setDate(newDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
              sx={{ borderRadius: '8px' }}
            >
              יום קודם
            </Button>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<NextIcon />}
              onClick={() => {
                const newDate = new Date(dayToShow);
                newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
              sx={{ borderRadius: '8px' }}
            >
              יום הבא
            </Button>
          </Box>
        </Box>
        
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E2E8F0', borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    width: '80px', 
                    bgcolor: '#F8FAFC', 
                    borderBottom: '2px solid #E2E8F0',
                    fontWeight: 'bold'
                  }}
                >
                  שעה
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: '#F8FAFC',
                    borderBottom: '2px solid #E2E8F0',
                    fontWeight: 'bold'
                  }}
                >
                  חוגים
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map((timeSlot, timeIndex) => {
                const eventsAtTime = getEventsAtTime(timeSlot);
                return (
                  <TableRow 
                    key={timeIndex} 
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: 'rgba(241, 245, 249, 0.3)' },
                      height: eventsAtTime.length > 0 ? 'auto' : '80px'
                    }}
                  >
                    <TableCell 
                      sx={{ 
                        width: '80px', 
                        borderRight: '1px solid #E2E8F0',
                        bgcolor: '#F8FAFC',
                        fontWeight: 'bold',
                        color: '#64748B'
                      }}
                    >
                      {timeSlot}
                    </TableCell>
                    <TableCell sx={{ p: eventsAtTime.length > 0 ? 2 : 1 }}>
                      {eventsAtTime.length > 0 ? (
                        <Grid container spacing={2}>
                          {eventsAtTime.map((event, eventIndex) => (
                            <Grid item xs={12} sm={6} md={4} key={eventIndex}>
                              <Paper
                                elevation={2}
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  cursor: 'pointer',
                                  bgcolor: event.attendanceRecorded 
                                    ? 'rgba(16, 185, 129, 0.1)' 
                                    : 'white',
                                  border: event.attendanceRecorded 
                                    ? '1px solid rgba(16, 185, 129, 0.3)' 
                                    : '1px solid rgba(0,0,0,0.1)',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                                    transform: 'translateY(-2px)'
                                  }
                                }}
                                onClick={() => handleCourseClick(event)}
                              >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    {event.courseName} - קבוצה {event.groupName}
                                  </Typography>
                                  {event.attendanceRecorded && (
                                    <Tooltip title="נוכחות נרשמה">
                                      <CheckIcon color="success" fontSize="small" />
                                    </Tooltip>
                                  )}
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <TimeIcon fontSize="small" sx={{ color: '#6366F1', mr: 1 }} />
                                  <Typography variant="body2">
                                    {event.hour}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <BranchIcon fontSize="small" sx={{ color: '#6366F1', mr: 1 }} />
                                  <Typography variant="body2">
                                    {event.branchName}
                                  </Typography>
                                </Box>
                                
                                {event.attendanceRecorded && (
                                  <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                                    <Typography variant="body2" color="text.secondary">
                                      נוכחים: {event.presentCount || 0} מתוך {event.maxStudents || '?'}
                                    </Typography>
                                  </Box>
                                )}
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary" align="center">
                          אין חוגים בשעה זו
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // רינדור דיאלוג החוגים ליום נבחר
  const renderDayCoursesDialog = () => {
    if (!selectedDate) return null;
    
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = selectedDate.toLocaleDateString('he-IL', dateOptions);
    const hebrewDate = new HDate(selectedDate).toString('h');
    
    return (
      <Dialog
        open={dayCoursesDialog}
        onClose={() => setDayCoursesDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#3B82F6',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}
        >
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ mr: 1 }} />
              חוגים ליום {formattedDate}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              {hebrewDate}
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setDayCoursesDialog(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
          {Object.keys(dayCourses).length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {Object.keys(dayCourses).map((branchName) => {
                const branch = dayCourses[branchName];
                const isExpanded = expandedBranch === branchName;
                
                return (
                  <Card 
                    key={branch.branchId} 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2,
                      overflow: 'visible',
                      boxShadow: isExpanded 
                        ? '0 10px 25px rgba(0,0,0,0.1)' 
                        : '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                    component={motion.div}
                    variants={itemVariants}
                  >
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: '#10B981' }}>
                          <BranchIcon />
                        </Avatar>
                      }
                      title={
                        <Typography variant="h6" fontWeight="bold">
                          {branchName}
                        </Typography>
                      }
                      subheader={branch.branchCity}
                      action={
                        <IconButton onClick={() => handleToggleBranch(branchName)}>
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      }
                      sx={{ 
                        bgcolor: 'rgba(16, 185, 129, 0.05)',
                        '& .MuiCardHeader-content': { mr: 2 }
                      }}
                    />
                    
                    <Collapse in={isExpanded || expandedBranch === null}>
                      <CardContent sx={{ pt: 0 }}>
                        {Object.keys(branch.courses).map((courseName) => {
                          const course = branch.courses[courseName];
                          
                          return (
                            <Box key={course.courseId} sx={{ mt: 3 }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: 2,
                                pb: 1,
                                borderBottom: '1px solid rgba(0,0,0,0.1)'
                              }}>
                                <CourseIcon sx={{ color: '#6366F1', mr: 1 }} />
                                <Typography variant="subtitle1" fontWeight="bold" color="#1E3A8A">
                                  {courseName}
                                </Typography>
                              </Box>
                              
                              <Grid container spacing={2}>
                                {course.groups.map((group) => (
                                  <Grid item xs={12} sm={6} md={4} key={group.groupId}>
                                    <Paper
                                      elevation={2}
                                      component={motion.div}
                                      whileHover={{ scale: 1.03 }}
                                      whileTap={{ scale: 0.98 }}
                                      sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        bgcolor: group.attendanceRecorded 
                                          ? 'rgba(16, 185, 129, 0.1)' 
                                          : 'white',
                                        border: group.attendanceRecorded 
                                          ? '1px solid rgba(16, 185, 129, 0.3)' 
                                          : '1px solid rgba(0,0,0,0.1)',
                                        '&:hover': {
                                          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                                        }
                                      }}
                                      onClick={() => handleCourseClick(group)}
                                    >
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                          קבוצה {group.groupName}
                                        </Typography>
                                        {group.attendanceRecorded && (
                                          <Tooltip title="נוכחות נרשמה">
                                            <CheckIcon color="success" fontSize="small" />
                                          </Tooltip>
                                        )}
                                      </Box>
                                      
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <TimeIcon fontSize="small" sx={{ color: '#6366F1', mr: 1 }} />
                                        <Typography variant="body2">
                                          {group.hour}
                                        </Typography>
                                      </Box>
                                      
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <StudentIcon fontSize="small" sx={{ color: '#6366F1', mr: 1 }} />
                                        <Typography variant="body2">
                                          גילאים: {group.ageRange || 'לא צוין'}
                                        </Typography>
                                      </Box>
                                      
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <SectorIcon fontSize="small" sx={{ color: '#6366F1', mr: 1 }} />
                                        <Typography variant="body2">
                                          מגזר: {group.sector || 'כללי'}
                                        </Typography>
                                      </Box>
                                      
                                      {group.attendanceRecorded && (
                                        <Box sx={{ mt: 2, pt: 1, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                                          <Typography variant="body2" color="text.secondary">
                                            נוכחים: {group.presentCount || 0} מתוך {group.maxStudents || '?'}
                                          </Typography>
                                        </Box>
                                      )}
                                    </Paper>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          );
                        })}
                      </CardContent>
                    </Collapse>
                  </Card>
                );
              })}
            </motion.div>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 5
              }}
            >
              <InfoIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" textAlign="center">
                אין חוגים ביום זה
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                ניתן להוסיף חוגים חדשים דרך מסך ניהול החוגים
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
          <Button
            onClick={() => setDayCoursesDialog(false)}
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: '8px',
              px: 4,
              py: 1,
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
                bgcolor: 'rgba(59, 130, 246, 0.05)'
              }
            }}
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // רינדור דיאלוג נוכחות תלמידים
  const renderAttendanceDialog = () => {
    if (!selectedCourse || !selectedDate) return null;
    
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = selectedDate.toLocaleDateString('he-IL', dateOptions);
    
    return (
      <Dialog
        open={attendanceDialog}
        onClose={() => setAttendanceDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#6366F1',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}
        >
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <GroupIcon sx={{ mr: 1 }} />
              רישום נוכחות: {selectedCourse.courseName} - קבוצה {selectedCourse.groupName}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              {formattedDate} | {selectedCourse.hour}
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setAttendanceDialog(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
          <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2">
                  <strong>חוג:</strong> {selectedCourse.courseName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2">
                  <strong>קבוצה:</strong> {selectedCourse.groupName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2">
                  <strong>סניף:</strong> {selectedCourse.branchName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2">
                  <strong>שעה:</strong> {selectedCourse.hour}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Typography variant="subtitle1" fontWeight="bold" color="#1E3A8A" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <StudentIcon sx={{ mr: 1 }} />
            רשימת תלמידים
          </Typography>
          
          <Paper 
            elevation={0} 
            sx={{ 
              border: '1px solid rgba(0,0,0,0.1)', 
              borderRadius: 2,
              overflow: 'hidden',
              mb: 3
            }}
          >
            <List sx={{ p: 0 }}>
              {students.map((student, index) => (
                <React.Fragment key={student.id}>
                  <ListItem
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={attendance[student.id] || false}
                        onChange={() => handleAttendanceChange(student.id)}
                        icon={<AbsentIcon color="error" />}
                        checkedIcon={<PresentIcon color="success" />}
                      />
                    }
                    sx={{ 
                      bgcolor: index % 2 === 0 ? 'rgba(241, 245, 249, 0.5)' : 'white',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(99, 102, 241, 0.05)'
                      }
                    }}
                  >
                    <ListItemButton role={undefined} dense>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: attendance[student.id] 
                              ? 'rgba(16, 185, 129, 0.2)' 
                              : 'rgba(239, 68, 68, 0.2)',
                            color: attendance[student.id] ? '#10B981' : '#EF4444'
                          }}
                        >
                          {student.name.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={student.name}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="body2" component="span">
                              גיל: {student.age}
                            </Typography>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 14 }} />
                            <Chip
                              label={`נוכחות: ${student.attendanceRate}%`}
                              size="small"
                              color={
                                student.attendanceRate > 90 ? 'success' :
                                student.attendanceRate > 75 ? 'primary' :
                                student.attendanceRate > 60 ? 'warning' : 'error'
                              }
                              sx={{ height: 20 }}
                            />
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < students.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="#1E3A8A" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <CommentIcon sx={{ mr: 1, fontSize: 20 }} />
              הערות לשיעור
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="הוסף הערות לגבי השיעור, התקדמות התלמידים, או כל מידע רלוונטי אחר..."
              value={attendanceNote}
              onChange={(e) => setAttendanceNote(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              סה"כ נוכחים: {Object.values(attendance).filter(present => present).length} מתוך {students.length}
            </Typography>
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                // סימון כל התלמידים כנוכחים
                const allPresent = {};
                students.forEach(student => {
                  allPresent[student.id] = true;
                });
                setAttendance(allPresent);
              }}
            >
              סמן הכל כנוכחים
            </Button>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
          <Button
            onClick={() => setAttendanceDialog(false)}
            variant="outlined"
            color="error"
            sx={{
              borderRadius: '8px',
              px: 3,
              py: 1,
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
                bgcolor: 'rgba(239, 68, 68, 0.05)'
              }
            }}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: '8px',
              px: 4,
              py: 1,
              bgcolor: '#6366F1',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                bgcolor: '#4F46E5',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
              },
              transition: 'all 0.3s ease'
            }}
            onClick={handleSaveAttendance}
          >
            שמור נוכחות
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          padding: { xs: 2, md: 4 },
          background: 'linear-gradient(to right, #e0f2fe, #f8fafc)',
          minHeight: '100vh',
          borderRadius: 2,
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant={isMobile ? "h4" : "h3"}
            sx={{
              fontWeight: 'bold',
              color: '#1E3A8A',
              mb: 1,
              fontFamily: 'Heebo, sans-serif',
              textAlign: 'center',
            }}
          >
            לוח נוכחות חוגים
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#334155',
              textAlign: 'center',
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            ניהול ומעקב אחר נוכחות תלמידים בחוגים
          </Typography>
        </motion.div>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <Box>
            {renderCalendarHeader()}
            
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1, sm: 2, md: 3 },
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {viewMode === 'month' && renderMonthView()}
                  {viewMode === 'week' && renderWeekView()}
                  {viewMode === 'day' && renderDayView()}
                </motion.div>
              </AnimatePresence>
            </Paper>
          </Box>
        )}
        
        {/* דיאלוגים */}
        {renderDayCoursesDialog()}
        {renderAttendanceDialog()}
        
        {/* הודעות */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};



export default AttendanceCalendar;
