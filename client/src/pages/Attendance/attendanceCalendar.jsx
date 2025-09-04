
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
import { clearGroupsByDay } from '../../store/group/groupSlice';
import { getGroupsByDay } from '../../store/group/groupGetByDayThunk';

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
import { isMarkedForDay } from '../../store/attendance/attendanceGetIsMarkedForDay';

const AttendanceCalendar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Redux state
  const courses = useSelector(state => state.courses.courses || []);
  const branches = useSelector(state => state.branches.branches || []);
  const groups = useSelector(state => state.groups.groups || []);
  const groupsByDay = useSelector(state => state.groups.groupsByDay || []);
  const groupsByDayLoading = useSelector(state => state.groups.groupsByDayLoading || false);
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
 const isMarkedForDayStatus = useSelector(state => state.attendances.isMarkedForDay || {});
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
        noRoshChodesh: false,
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
          desc.includes('Yom Yerushalayim') ||
          desc.includes('Tzom Gedaliah') ||
          desc.includes('Fast of Gedaliah') ||
          desc.includes('Fast of the 17th of Tammuz') ||
          desc.includes('17th of Tammuz')
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
      
      // הוסף חגים מותאמים אישית
      addCustomHolidays(year);
    } catch (error) {
      console.error('Error loading Hebrew holidays:', error);
    }
  };

  // פונקציה להוספת חגים מותאמים אישית
  const addCustomHolidays = (year) => {
    try {
      const customHolidays = new Map();
      
      // השתמש בספרייה העברית לחישוב תאריכים מדויקים
      try {
        // ג' תשרי - צום גדליה
        const gTishrei = new HDate(3, 'Tishrei', year + 1).greg();
        const gTishreiKey = format(gTishrei, 'yyyy-MM-dd');
        customHolidays.set(gTishreiKey, {
          name: 'צום גדליה',
          nameEn: 'Fast of Gedaliah',
          isYomTov: false,
          isCustom: true
        });

        // י"א-י"ד תשרי - בין יו"כ לסוכות
        for (let i = 11; i <= 14; i++) {
          const betweenDate = new HDate(i, 'Tishrei', year + 1).greg();
          const dateKey = format(betweenDate, 'yyyy-MM-dd');
          customHolidays.set(dateKey, {
            name: 'בין יו"כ לסוכות',
            nameEn: 'Between Yom Kippur and Sukkot',
            isYomTov: false,
            isCustom: true
          });
        }

        // י"ז תמוז - יום צום
        const yudZayinTammuz = new HDate(17, 'Tamuz', year).greg();
        const yudZayinTammuzKey = format(yudZayinTammuz, 'yyyy-MM-dd');
        customHolidays.set(yudZayinTammuzKey, {
          name: 'יום צום',
          nameEn: '17th of Tammuz',
          isYomTov: false,
          isCustom: true
        });

        // ח'-כ"ט אב - בין הזמנים (עד לפני ראש השנה, לא כולל א' אלול)
        for (let i = 8; i <= 29; i++) {
          const benHazmanimDate = new HDate(i, 'Av', year).greg();
          const dateKey = format(benHazmanimDate, 'yyyy-MM-dd');
          customHolidays.set(dateKey, {
            name: 'בין הזמנים',
            nameEn: 'Between the times',
            isYomTov: false,
            isCustom: true
          });
        }

        // ל' אב - ערב ראש השנה (כלול בבין הזמנים)
        try {
          const erevRoshHashana = new HDate(30, 'Av', year).greg();
          const erevRoshHashanaKey = format(erevRoshHashana, 'yyyy-MM-dd');
          customHolidays.set(erevRoshHashanaKey, {
            name: 'בין הזמנים',
            nameEn: 'Between the times - Erev Rosh Hashana',
            isYomTov: false,
            isCustom: true
          });
        } catch (dateError) {
          // אב יכול להיות רק 29 ימים
        }

        // הערה: א' אלול לא נכלל בבין הזמנים - זה יום פעיל לחוגים

      } catch (hebrewDateError) {
        console.warn('Error calculating Hebrew dates, using approximations:', hebrewDateError);
        
        // גיבוי - השתמש בתאריכים גרגוריאניים משוערים
        // ג' תשרי בערך בספטמבר
        const approxTishrei3 = new Date(year, 8, 20); // 20 בספטמבר
        const approxKey = format(approxTishrei3, 'yyyy-MM-dd');
        customHolidays.set(approxKey, {
          name: 'צום גדליה',
          nameEn: 'Fast of Gedaliah (approx)',
          isYomTov: false,
          isCustom: true
        });
      }
      
      setHebrewHolidays(prev => new Map([...prev, ...customHolidays]));
    } catch (error) {
      console.error('Error adding custom holidays:', error);
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
      'Rosh Chodesh': 'ראש חודש',
      'Tzom Gedaliah': 'צום גדליה',
      'Fast of Gedaliah': 'צום גדליה',
      'Fast of the 17th of Tammuz': 'יום צום',
      '17th of Tammuz': 'יום צום'
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
    // ראשית, בדוק תאריכים מיוחדים שתמיד פעילים לחוגים (לפני בדיקת חגים)
    
    // בדוק תאריך מיוחד - י"ד אייר (חוגים פעילים)
    try {
      const currentYear = date.getFullYear();
      const yudDaletIyar = new HDate(14, 'Iyyar', currentYear).greg();
      
      if (isSameDay(date, yudDaletIyar)) {
        return true; // י"ד אייר - חוגים פעילים
      }
    } catch (hebrewDateError) {
      // גיבוי - בדוק תאריך גרגוריאני משוער
      const month = date.getMonth() + 1;
      const day = date.getDate();
      if (month === 5 && day === 14) { // י"ד אייר בערך ב-14 במאי
        return true;
      }
    }

    // בדוק תאריך מיוחד - א' אלול (חוגים פעילים)
    try {
      const currentYear = date.getFullYear();
      const alephElul = new HDate(1, 'Elul', currentYear).greg();
      
      if (isSameDay(date, alephElul)) {
        return true; // א' אלול - חוגים פעילים
      }
    } catch (hebrewDateError) {
      // גיבוי - בדוק תאריך גרגוריאני משוער (בערך באוגוסט-ספטמבר)
      console.warn('Could not calculate exact Hebrew date for Aleph Elul');
    }

    // אחרי בדיקת התאריכים המיוחדים, בדוק חגים
    const dateKey = format(date, 'yyyy-MM-dd');
    const holiday = hebrewHolidays.get(dateKey);

    // בדוק אם זה יום טוב או חג שבו לא מקיימים חוגים
    if (holiday) {
      // חגים שבהם כן מקיימים חוגים
      const allowedHolidays = [
        'ט"ו בשבט',
        'יום השואה',
        'יום העצמאות',
        'יום הזיכרון',
        'יום ירושלים',
        'ראש חודש'
      ];

      // אם זה חג מותר - יום פעיל
      if (allowedHolidays.some(allowedHoliday => holiday.name.includes(allowedHoliday))) {
        return true;
      }

      // חגים שתמיד לא פעילים
      const blockedHolidays = [
        'צום גדליה',
        'בין יו"כ לסוכות',
        'יום צום',
        'בין הזמנים'
      ];

      // אם זה חג חסום - לא פעיל
      if (blockedHolidays.some(blockedHoliday => holiday.name.includes(blockedHoliday))) {
        return false;
      }

      // כל שאר החגים - לא פעילים
      return false;
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
    // ראשית, בדוק אם זה א' אלול - אם כן, אל תחזיר מידע על חג
    try {
      const currentYear = date.getFullYear();
      const alephElul = new HDate(1, 'Elul', currentYear).greg();
      
      if (isSameDay(date, alephElul)) {
        return null; // א' אלול - לא מציג כחג, זה יום פעיל רגיל
      }
    } catch (hebrewDateError) {
      // אם יש שגיאה בחישוב התאריך העברי, המשך לבדיקה רגילה
    }

    const dateKey = format(date, 'yyyy-MM-dd');
    return hebrewHolidays.get(dateKey) || null;
  };

  // פונקציה לקבלת שם היום בעברית
  const getHebrewDayName = (date) => {
    if (!date) {
      console.warn('getHebrewDayName received null/undefined date');
      return 'לא צוין';
    }

    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      console.warn('getHebrewDayName received invalid date:', date);
      return 'תאריך לא תקין';
    }

    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    return days[dateObj.getDay()];
  };
useEffect(() => {
  const loadMonthlyAttendanceStatus = async () => {
    if (viewMode === 'month') {
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
      const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

      // טען סטטוס נוכחות לכל יום בחודש
      const loadPromises = daysInMonth.map(async (date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        
        // בדוק אם כבר יש נתונים עבור התאריך הזה
        if (isMarkedForDayStatus[dateString] === undefined) {
          try {
            await dispatch(isMarkedForDay({ date: dateString }));
          } catch (error) {
            console.warn(`Failed to check attendance status for ${dateString}:`, error);
          }
        }
      });

      // הרץ את כל הבדיקות במקביל
      await Promise.allSettled(loadPromises);
    }
  };

  loadMonthlyAttendanceStatus();
}, [currentDate, viewMode, dispatch, isMarkedForDayStatus]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          dispatch(fetchCourses()).unwrap(),
          dispatch(fetchBranches()).unwrap(),
          dispatch(fetchGroups()).unwrap()
        ]);

        // טען חגים עבריים לשנה הנוכחית
        const currentYear = new Date().getFullYear();
        loadHebrewHolidays(currentYear);
        loadHebrewHolidays(currentYear + 1);

      } catch (error) {
        console.error('Error initializing data:', error);
        setNotification({
          open: true,
          message: 'שגיאה בטעינת נתוני המערכת',
          severity: 'error'
        });
      }
    };

    initializeData();
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
  const handleDateSelect = async (date) => {
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

    // טען קבוצות ליום זה
    const dayName = getDayOfWeekHebrew(date);
    console.log('Loading groups for day:', dayName);

    try {
      await dispatch(getGroupsByDay(dayName)).unwrap();
      setCourseSelectionOpen(true);
    } catch (error) {
      console.error('Failed to load groups for day:', error);
      setNotification({
        open: true,
        message: 'שגיאה בטעינת חוגים ליום זה',
        severity: 'error'
      });
    }
  };

  // הוסף פונקציה לקבלת יום בשבוע בעברית
  const getDayOfWeekHebrew = (date) => {
    if (!date) {
      console.warn('getDayOfWeekHebrew received null/undefined date');
      return 'לא צוין';
    }

    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      console.warn('getDayOfWeekHebrew received invalid date:', date);
      return 'תאריך לא תקין';
    }

    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    return days[dateObj.getDay()];
  };
  //  handleGroupSelect
const handleGroupSelect = async (group) => {
  console.log('🔍 handleGroupSelect called with group:', group);
  
  if (!selectedDate) {
    setNotification({
      open: true,
      message: 'שגיאה: לא נבחר תאריך',
      severity: 'error'
    });
    return;
  }
  
  const course = {
    courseId: group.courseId || group.course_id,
    courseName: group.courseName,
    couresName: group.courseName, // לתאימות לאחור
    name: group.courseName
  };
  // במקום לחפש במערכים, השתמש בנתונים שכבר יש בקבוצה
  const branch = {
    branchId: group.branchId || group.branch_id,
    branchName: group.branchName,
    name: group.branchName
  };
  
  console.log('🔍 Found course:', course);
  console.log('🔍 Found branch:', branch);
  
  if (!course.courseName || !branch.name) {
    console.error('❌ Course or branch not found');
    setNotification({
      open: true,
      message: 'לא נמצאו נתוני החוג או הסניף',
      severity: 'error'
    });
    return;
  }

  // עדכן את ה-state
  setSelectedGroup(group);
  setSelectedCourse(course);
  setSelectedBranch(branch);

   console.log('🔄 Setting state with:', {
    course: course.courseName,
    branch: branch.branchName,
    group: group.groupName
  });

  try {
    // טען תלמידים
    console.log('📚 Loading students for group:', group.groupId);
    await dispatch(getStudentsByGroupId(group.groupId)).unwrap();
    setStudentsLoaded(true); // חשוב!
    console.log('✅ Students loaded successfully');
    
    // טען נוכחות קיימת
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    try {
      await dispatch(fetchAttendanceByDate({
        groupId: group.groupId,
        date: dateString
      })).unwrap();
    } catch (error) {
      console.warn('⚠️ No existing attendance found');
    }

    // סגור דיאלוג בחירה ופתח דיאלוג נוכחות
    setCourseSelectionOpen(false);
    setAttendanceDialogOpen(true);
    
  } catch (error) {
    console.error('❌ Error loading data:', error);
    setNotification({
      open: true,
      message: 'שגיאה בטעינת נתוני הקבוצה',
      severity: 'error'
    });
  }
};
  
  const renderDialogs = () => {
    const groupsByDay = useSelector(state => state.groups.groupsByDay || []);
    const groupsByDayLoading = useSelector(state => state.groups.groupsByDayLoading || false);

    return (
      <>
        {/* Course Selection Dialog */}
        <CourseSelectionDialog
          open={courseSelectionOpen}
          onClose={() => {
            setCourseSelectionOpen(false);
            dispatch(clearGroupsByDay());
            setSelectedDate(null);
          }}
          selectedDate={selectedDate}
          groupsByDay={groupsByDay || []}
          groupsByDayLoading={groupsByDayLoading || false}
          onGroupSelect={handleGroupSelect}
        />

        {/* Attendance Dialog */}
      <AttendanceDialog
  open={attendanceDialogOpen}
  onClose={() => {
    console.log('🔄 Closing attendance dialog');
    setAttendanceDialogOpen(false);
    resetSelections();
  }}
  selectedDate={selectedDate}
  selectedCourse={selectedCourse}
  selectedBranch={selectedBranch}
  selectedGroup={selectedGroup}
  students={students}
  attendanceData={attendanceData}
  onAttendanceChange={handleAttendanceChange}
  onSave={handleSaveAttendance}
  courseName={selectedCourse?.courseName || selectedCourse?.couresName || selectedCourse?.name}
  branchName={selectedBranch?.branchName || selectedBranch?.name}
  groupName={selectedGroup?.groupName || selectedGroup?.name}
/>
      </>
    );
  };

  const handleAttendanceChange = (studentId, wasPresent) => {
  console.log('📝 Attendance changed:', { studentId, wasPresent });
  setAttendanceData(prev => ({
    ...prev,
    [studentId]: wasPresent
  }));
};
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

    console.log('💾 Saving attendance:', attendanceToSave);
    await dispatch(saveAttendance(attendanceToSave)).unwrap();

    setAttendanceDialogOpen(false);
    setNotification({
      open: true,
      message: 'נתוני הנוכחות נשמרו בהצלחה',
      severity: 'success'
    });

    // איפוס הבחירות
    resetSelections();

  } catch (error) {
    console.error('❌ Save attendance error:', error);
    setNotification({
      open: true,
      message: 'שגיאה בשמירת נתוני הנוכחות',
      severity: 'error'
    });
  }
};


  const resetSelections = () => {
    setSelectedCourse(null);
    setSelectedBranch(null);
    setSelectedGroup(null);
    setAttendanceData({});
    setSelectedDate(null);
    setStudentsLoaded(false);
    dispatch(clearGroupsByDay());
  };

  useEffect(() => {
  console.log('------------------📊 State updated:', {
    selectedCourse: selectedCourse?.courseId,
    selectedBranch: selectedBranch?.branchId,
    selectedGroup: selectedGroup?.groupName,
    attendanceDialogOpen
  });
}, [selectedCourse, selectedBranch, selectedGroup, attendanceDialogOpen]);

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
    if (students.length > 0 && selectedGroup && selectedDate && attendanceDialogOpen) {
      console.log('Initializing attendance data for students:', students.length);

      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const existingAttendance = attendanceRecords[dateString] || [];

      const initialAttendance = {};
      students.forEach(student => {
        const existingRecord = existingAttendance.find(r => r.studentId === student.studentId);
        initialAttendance[student.studentId] = existingRecord ? existingRecord.wasPresent : true;
      });

      console.log('Setting initial attendance data:', initialAttendance);
      setAttendanceData(initialAttendance);
    }
  }, [students, selectedGroup, selectedDate, attendanceDialogOpen, attendanceRecords]);

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


  const renderCourseSelectionDialog = () => {
    const groupsByDay = useSelector(state => state.groups.groupsByDay || []);
    const groupsByDayLoading = useSelector(state => state.groups.groupsByDayLoading || false);

    return (
      <CourseSelectionDialog
        open={courseSelectionOpen}
        onClose={() => {
          setCourseSelectionOpen(false);
          dispatch(clearGroupsByDay());
          setSelectedDate(null);
        }}
        selectedDate={selectedDate}
        groupsByDay={groupsByDay}
        groupsByDayLoading={groupsByDayLoading}
        onGroupSelect={handleGroupSelect}
      />
    );
  };

  // Render main content based on view mode
  const renderCalendarContent = () => {
    if (loading) {
      return (
        <Box sx={styles.loadingContainer}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={styles.loadingText}>
           ... טוען נתונים
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
                isMarkedForDayStatus={isMarkedForDayStatus}
              />
            )}

            {viewMode === 'week' && (
  <WeeklyCalendar
    currentDate={currentDate}
    onDateSelect={handleDateSelect}
    savedAttendanceRecords={attendanceRecords}
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
          onClose={() => {
            console.log('🔄 Closing course selection dialog');
            setCourseSelectionOpen(false);
            dispatch(clearGroupsByDay());
            // אל תאפס את selectedDate כאן
          }}
          selectedDate={selectedDate}
          groupsByDay={useSelector(state => state.groups.groupsByDay || [])}
          groupsByDayLoading={useSelector(state => state.groups.groupsByDayLoading || false)}
          onGroupSelect={handleGroupSelect}
        />
        {/* Attendance Dialog */}
        <AttendanceDialog
          open={attendanceDialogOpen}
          onClose={() => {
            console.log('🔄 Closing attendance dialog');
            setAttendanceDialogOpen(false);
            // אל תאפס את הנתונים כאן - רק סגור את הדיאלוג
          }}
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
