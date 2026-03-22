
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
  Today, NavigateBefore, NavigateNext,
  Event, School, LocationOn, Group, Person, CheckCircle,
  Cancel, Search, FilterList, Save, Comment, Check,
  ExpandMore, ExpandLess, Close, Info, AccessTime
} from '@mui/icons-material';


// Import date utilities
import { format, addMonths, subMonths, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { he } from 'date-fns/locale';

// Import Hebrew calendar utilities
import { HDate, HebrewCalendar } from '@hebcal/core';

// Import Redux actions
import { fetchCourses } from '../../store/course/CoursesGetAllThunk';
import { fetchBranches } from '../../store/branch/branchGetAllThunk';
import { fetchGroups } from '../../store/group/groupGellAllThunk';
import { clearGroupsByDay } from '../../store/group/groupSlice';

// Import custom components
import MonthlyCalendar from './components/monthlyCalendar'
import AttendanceDialog from './components/attendanceDialog';
import CourseSelectionDialog from './components/courseSelectionDialog';
import AttendanceLessonsListView from './components/attendanceLessonsListView';

// Import styles
import { styles } from './styles/attendanceCalendarStyles';
import { getStudentsByGroupId } from '../../store/student/studentGetByGroup';
import { fetchAttendanceByDate } from '../../store/attendance/fetchAttendanceByDate';
import { batchUpdateAttendances } from '../../store/attendance/batchUpdateAttendances';
import { getLessonsByDate } from '../../store/lessons/getLessonsByDate';
import { getLessonsByDateRange } from '../../store/lessons/getLessonsByDateRange';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

const getAttendanceStudentId = (record) => record?.studentId ?? record?.StudentId ?? null;
const getAttendancePresence = (record) => record?.wasPresent ?? record?.WasPresent ?? true;
const getAttendanceRecordId = (record) => record?.attendanceId ?? record?.AttendanceId ?? 0;

const AttendanceCalendar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Redux state
  const courses = useSelector(state => state.courses.courses ?? EMPTY_ARRAY);
  const branches = useSelector(state => state.branches.branches ?? EMPTY_ARRAY);
  const groups = useSelector(state => state.groups.groups ?? EMPTY_ARRAY);
  const lessonsByDate = useSelector(state => state.lessons.lessonsByDate ?? EMPTY_OBJECT);
  const lessonsLoading = useSelector(state => state.lessons.loading || false);
  const attendanceMarkedStatus = useSelector(state => state.attendances.attendanceMarkedStatus ?? EMPTY_OBJECT);
  const students = useSelector(state => state.students?.studentsByGroup ?? EMPTY_ARRAY);
  const attendanceRecords = useSelector(state => state.attendances.records ?? EMPTY_OBJECT);
  const currentUser = useSelector(state => (
    state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null
  ));
  const loading = useSelector(state =>
    state.courses.loading ||
    state.branches.loading ||
    state.groups.loading ||
    state.students.loading ||
    state.attendances.loading
  );

  const mapLessonStatus = (lesson) => lesson?.lessonStatus || lesson?.status || lesson?.Status || 'future';
  const normalizeLessonField = (lesson, keys, fallback = null) => {
    for (const key of keys) {
      const value = lesson?.[key];
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return fallback;
  };
  // Local state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayMode, setDisplayMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  const [courseSelectionOpen, setCourseSelectionOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [hebrewHolidays, setHebrewHolidays] = useState(new Map());

  const groupsForSelectedDate = React.useMemo(() => {
    if (!selectedDate) return [];

    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const lessonsForDate = lessonsByDate[dateKey] || [];

    return lessonsForDate.map((lesson) => {
      const lessonGroupId = normalizeLessonField(lesson, ['groupId', 'GroupId']);
      const lessonCourseId = normalizeLessonField(lesson, ['courseId', 'CourseId']);
      const lessonBranchId = normalizeLessonField(lesson, ['branchId', 'BranchId']);
      const lessonGroupName = normalizeLessonField(lesson, ['groupName', 'GroupName'], 'קבוצה לא ידועה');

      const groupFromStore = groups.find((g) => g.groupId === lessonGroupId)
        || groups.find((g) => g.groupName === lessonGroupName);
      const course = courses.find((c) => c.courseId === (groupFromStore?.courseId || lessonCourseId));
      const branch = branches.find((b) => b.branchId === (groupFromStore?.branchId || lessonBranchId));

      const resolvedGroupId = groupFromStore?.groupId || lessonGroupId;
      if (!resolvedGroupId) return null;

      return {
        ...groupFromStore,
        groupId: resolvedGroupId,
        courseId: groupFromStore?.courseId || lessonCourseId,
        branchId: groupFromStore?.branchId || lessonBranchId,
        groupName: groupFromStore?.groupName || lessonGroupName,
        lessonId: normalizeLessonField(lesson, ['lessonId', 'LessonId', 'id', 'Id']),
        lessonStatus: mapLessonStatus(lesson),
        lessonDate: normalizeLessonField(lesson, ['lessonDate', 'LessonDate', 'date', 'Date'], dateKey),
        hour: normalizeLessonField(lesson, ['lessonHour', 'LessonHour', 'hour', 'Hour'], groupFromStore?.hour),
        courseName: normalizeLessonField(lesson, ['courseName', 'CourseName'], course?.couresName || course?.courseName || groupFromStore?.courseName),
        branchName: normalizeLessonField(lesson, ['branchName', 'BranchName', 'city', 'City'], branch?.name || branch?.city || groupFromStore?.branchName),
        branchAddress: normalizeLessonField(lesson, ['branchAddress', 'BranchAddress'], branch?.address || branch?.name || branch?.city)
      };
    }).filter(Boolean);
  }, [selectedDate, lessonsByDate, groups, courses, branches]);

  const lessonRowsForList = React.useMemo(() => {
    const rows = [];

    Object.entries(lessonsByDate).forEach(([dateKey, lessonsForDate]) => {
      (lessonsForDate || []).forEach((lesson) => {
        const lessonGroupId = normalizeLessonField(lesson, ['groupId', 'GroupId']);
        const lessonCourseId = normalizeLessonField(lesson, ['courseId', 'CourseId']);
        const lessonBranchId = normalizeLessonField(lesson, ['branchId', 'BranchId']);
        const lessonGroupName = normalizeLessonField(lesson, ['groupName', 'GroupName'], 'קבוצה לא ידועה');

        const groupFromStore = groups.find((g) => g.groupId === lessonGroupId)
          || groups.find((g) => g.groupName === lessonGroupName);
        const course = courses.find((c) => c.courseId === (groupFromStore?.courseId || lessonCourseId));
        const branch = branches.find((b) => b.branchId === (groupFromStore?.branchId || lessonBranchId));

        const resolvedGroupId = groupFromStore?.groupId || lessonGroupId;
        if (!resolvedGroupId) return;

        const lessonStatus = mapLessonStatus(lesson);
        const lessonDate = normalizeLessonField(lesson, ['lessonDate', 'LessonDate', 'date', 'Date'], dateKey);
        const attendanceKey = `${resolvedGroupId}-${lessonDate}`;

        rows.push({
          groupId: resolvedGroupId,
          groupName: groupFromStore?.groupName || lessonGroupName,
          courseId: groupFromStore?.courseId || lessonCourseId,
          courseName: normalizeLessonField(lesson, ['courseName', 'CourseName'], course?.couresName || course?.courseName || groupFromStore?.courseName),
          branchId: groupFromStore?.branchId || lessonBranchId,
          city: normalizeLessonField(lesson, ['city', 'City'], branch?.city || branch?.name || groupFromStore?.branchName),
          branchName: normalizeLessonField(lesson, ['branchName', 'BranchName', 'city', 'City'], branch?.name || branch?.city || groupFromStore?.branchName),
          hour: normalizeLessonField(lesson, ['lessonHour', 'LessonHour', 'hour', 'Hour'], groupFromStore?.hour),
          lessonId: normalizeLessonField(lesson, ['lessonId', 'LessonId', 'id', 'Id']),
          lessonDate,
          lessonStatus,
          isReported: lessonStatus === 'done' || attendanceMarkedStatus[attendanceKey] === true,
          rawGroup: {
            ...groupFromStore,
            groupId: resolvedGroupId,
            courseId: groupFromStore?.courseId || lessonCourseId,
            branchId: groupFromStore?.branchId || lessonBranchId,
            groupName: groupFromStore?.groupName || lessonGroupName,
            courseName: normalizeLessonField(lesson, ['courseName', 'CourseName'], course?.couresName || course?.courseName || groupFromStore?.courseName),
            branchName: normalizeLessonField(lesson, ['branchName', 'BranchName', 'city', 'City'], branch?.name || branch?.city || groupFromStore?.branchName),
            hour: normalizeLessonField(lesson, ['lessonHour', 'LessonHour', 'hour', 'Hour'], groupFromStore?.hour)
          }
        });
      });
    });

    return rows.sort((a, b) => {
      const dateCompare = a.lessonDate.localeCompare(b.lessonDate);
      if (dateCompare !== 0) return dateCompare;
      return String(a.hour || '').localeCompare(String(b.hour || ''));
    });
  }, [lessonsByDate, groups, courses, branches, attendanceMarkedStatus]);

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
        noRoshChodesh: false
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
      // מחק א' אלול מהמפה כדי שלא יוצג כחג
      try {
        const alephElul = new HDate(1, 'Elul', year).greg();
        const alephElulKey = format(alephElul, 'yyyy-MM-dd');
        holidayMap.delete(alephElulKey);
      } catch (e) {
        console.warn("לא ניתן לחשב א' אלול למחיקה מהמפה", e);
      }
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

        // ט' תשרי (ערב יום כיפור) - חסימה
        const tetTishrei = new HDate(9, 'Tishrei', year + 1).greg();
        const tetTishreiKey = format(tetTishrei, 'yyyy-MM-dd');
        customHolidays.set(tetTishreiKey, {
          name: 'ערב יום כיפור',
          nameEn: 'Erev Yom Kippur',
          isYomTov: false,
          isCustom: true
        });

        // י' תשרי (יום כיפור) - כבר מופיע בחגים המרכזיים

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

        // אסרו חג סוכות (כ"ג תשרי)
        const isruChagSukkot = new HDate(23, 'Tishrei', year + 1).greg();
        const isruChagSukkotKey = format(isruChagSukkot, 'yyyy-MM-dd');
        customHolidays.set(isruChagSukkotKey, {
          name: 'אסרו חג סוכות',
          nameEn: 'Isru Chag Sukkot',
          isYomTov: false,
          isCustom: true
        });

        // חנוכה: כ"ד כסלו - ב' טבת
        for (let i = 24; i <= 30; i++) {
          const hanukkahDate = new HDate(i, 'Kislev', year + 1).greg();
          const dateKey = format(hanukkahDate, 'yyyy-MM-dd');
          customHolidays.set(dateKey, {
            name: 'חנוכה',
            nameEn: 'Hanukkah',
            isYomTov: false,
            isCustom: true
          });
        }
        for (let i = 1; i <= 2; i++) {
          const hanukkahDate = new HDate(i, 'Tevet', year + 1).greg();
          const dateKey = format(hanukkahDate, 'yyyy-MM-dd');
          customHolidays.set(dateKey, {
            name: 'חנוכה',
            nameEn: 'Hanukkah',
            isYomTov: false,
            isCustom: true
          });
        }

        // י' טבת
        const yudTevet = new HDate(10, 'Tevet', year + 1).greg();
        const yudTevetKey = format(yudTevet, 'yyyy-MM-dd');
        customHolidays.set(yudTevetKey, {
          name: 'יום צום',
          nameEn: '10th of Tevet',
          isYomTov: false,
          isCustom: true
        });

        // י"ג-ט"ו אדר
        for (let i = 13; i <= 15; i++) {
          const adarDate = new HDate(i, 'Adar', year + 1).greg();
          const dateKey = format(adarDate, 'yyyy-MM-dd');
          customHolidays.set(dateKey, {
            name: ' פורים',
            nameEn: 'Purim',
            isYomTov: false,
            isCustom: true
          });
        }

        // ח'-כ"ב ניסן (פסח + אסרו חג)
        for (let i = 8; i <= 22; i++) {
          const pesachDate = new HDate(i, 'Nisan', year + 1).greg();
          const dateKey = format(pesachDate, 'yyyy-MM-dd');
          customHolidays.set(dateKey, {
            name: 'פסח',
            nameEn: 'Pesach',
            isYomTov: false,
            isCustom: true
          });
        }

        // ז' סיון
        const zainSivan = new HDate(7, 'Sivan', year + 1).greg();
        const zainSivanKey = format(zainSivan, 'yyyy-MM-dd');
        customHolidays.set(zainSivanKey, {
          name: 'אסרו חג שבועות',
          nameEn: 'Isru Chag Shavuot',
          isYomTov: false,
          isCustom: true
        });

        // י"ז תמוז
        const yudZayinTammuz = new HDate(17, 'Tamuz', year + 1).greg();
        const yudZayinTammuzKey = format(yudZayinTammuz, 'yyyy-MM-dd');
        customHolidays.set(yudZayinTammuzKey, {
          name: 'יום צום',
          nameEn: '17th of Tammuz',
          isYomTov: false,
          isCustom: true
        });

        // 10 בתמוז
        const yudTamuz = new HDate(10, 'Tamuz', year + 1).greg();
        const yudTamuzKey = format(yudTamuz, 'yyyy-MM-dd');
        customHolidays.set(yudTamuzKey, {
          name: 'יום צום',
          nameEn: '10th of Tamuz',
          isYomTov: false,
          isCustom: true
        });

        // בין הזמנים - ח' אב עד כ"ט אב
        for (let i = 8; i <= 29; i++) {
          const benHazmanimDate = new HDate(i, 'Av', year + 1).greg();
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
          const erevRoshHashana = new HDate(30, 'Av', year + 1).greg();
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

        // כ"ט אלול - ערב ראש השנה
        try {
          const kafTetElul = new HDate(29, 'Elul', year + 1).greg();
          const kafTetElulKey = format(kafTetElul, 'yyyy-MM-dd');
          customHolidays.set(kafTetElulKey, {
            name: 'ערב ראש השנה',
            nameEn: 'Erev Rosh Hashana',
            isYomTov: false,
            isCustom: true
          });
        } catch (dateError) {}

        // י"ד אייר - יום שמותר בו חוגים (לא חסום)
        // לא נוסיף אותו ל-customHolidays כדי שלא ייחסם

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
    // י"ח אייר תמיד יום פעיל לחוגים (ל"ג בעומר)
    try {
      const hdate = new HDate(date);
      if (hdate.getMonthName() === 'Iyyar' && hdate.getDate() === 18) {
        return true; // י"ח אייר - חוגים פעילים תמיד
      }
    } catch (e) {}
    // י"ד אייר תמיד יום פעיל לחוגים
    try {
      const hdate = new HDate(date);
      if (hdate.getMonthName() === 'Iyyar' && hdate.getDate() === 14) {
        return true; // י"ד אייר - חוגים פעילים תמיד
      }
    } catch (e) {}
    // חסימה מפורשת לכ"ב ניסן
    try {
      const hdate = new HDate(date);
      if (hdate.getMonthName() === 'Nisan' && hdate.getDate() === 22) {
        return false; // כ"ב ניסן - חסום תמיד
      }
    } catch (e) {}
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

    // בדוק תאריך מיוחד - א' אלול (חוגים פעילים תמיד)
    try {
      const hdate = new HDate(date);
      if (hdate.getMonthName() === 'Elul' && hdate.getDate() === 1) {
        return true; // א' אלול - חוגים פעילים תמיד
      }
    } catch (hebrewDateError) {
      // גיבוי - בדוק תאריך גרגוריאני משוער (בערך באוגוסט-ספטמבר)
      const month = date.getMonth() + 1;
      const day = date.getDate();
      // א' אלול נופל לרוב באוגוסט/ספטמבר
      if ((month === 8 || month === 9) && day === 1) {
        return true;
      }
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
        'ראש חודש',
        'פסח שני'
       

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
    // א' אלול הוא יום לימודים רגיל ולכן לא יוצג כחג.
    try {
      const hdate = new HDate(date);
      if (hdate.getMonthName() === 'Elul' && hdate.getDate() === 1) {
        return null;
      }
    } catch (hebrewDateError) {
      // אם החישוב העברי נכשל, נמשיך לבדיקה הרגילה מהמפה.
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
    const initializeData = async () => {
      try {
        await Promise.all([
          dispatch(fetchCourses()).unwrap(),
          dispatch(fetchBranches()).unwrap(),
          dispatch(fetchGroups()).unwrap()
        ]);

        // טען חגים עבריים לשנה הגרגוריאנית הנוכחית והשנה הבאה
        const currentYear = new Date().getFullYear();
        loadHebrewHolidays(currentYear);
        loadHebrewHolidays(currentYear + 1);

        // טען גם לפי השנה העברית הנוכחית (למניעת חוסר ב"בין הזמנים")
        try {
          const today = new Date();
          const hdate = new HDate(today);
          const hebrewYear = hdate.getFullYear();
          // נטען רק אם לא טענו כבר (למניעת כפילות)
          if (hebrewYear !== currentYear && hebrewYear !== currentYear + 1) {
            loadHebrewHolidays(hebrewYear);
          }
        } catch (e) {
          console.warn('לא ניתן לחשב שנה עברית לטעינת חגים נוספים', e);
        }

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
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const existingAttendance = attendanceRecords[dateString] || [];

      const initialAttendance = {};
      students.forEach(student => {
        const currentStudentId = student.studentId || student.id;
        const existingRecord = existingAttendance.find(r => getAttendanceStudentId(r) === currentStudentId);
        initialAttendance[currentStudentId] = existingRecord ? getAttendancePresence(existingRecord) : true;
      });

      setAttendanceData(initialAttendance);
      setStudentsLoaded(false);
    }
  }, [students, selectedGroup, selectedDate, studentsLoaded, attendanceRecords]);

  // Handle date navigation
  const handleDateChange = (direction) => {
    setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };


  // Handle date selection 
  const handleDateSelect = async (date) => {
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

    // טען שיעורים לפי תאריך בפועל
    const dateKey = format(date, 'yyyy-MM-dd');

    try {
      await dispatch(getLessonsByDate({ date: dateKey })).unwrap();
      setCourseSelectionOpen(true);
    } catch (error) {
      console.error('Failed to load lessons by date:', error);
      setNotification({
        open: true,
        message: 'שגיאה בטעינת שיעורים לתאריך זה',
        severity: 'error'
      });
    }
  };

  //  handleGroupSelect
const handleGroupSelect = async (group, dateOverride = null) => {
  const effectiveDate = dateOverride || selectedDate;

  if (!effectiveDate) {
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
  setSelectedLessonId(group.lessonId || 0);
  setSelectedCourse(course);
  setSelectedBranch(branch);

  try {
    // טען תלמידים
    await dispatch(getStudentsByGroupId(group.groupId)).unwrap();
    setStudentsLoaded(true); // חשוב!
    
    // טען נוכחות קיימת
    const dateString = format(effectiveDate, 'yyyy-MM-dd');
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

const handleListLessonSelect = async (lessonRow) => {
  if (!lessonRow?.lessonDate || !lessonRow?.rawGroup) return;

  const selectedLessonDate = new Date(lessonRow.lessonDate);
  if (Number.isNaN(selectedLessonDate.getTime())) return;

  setSelectedDate(selectedLessonDate);
  await handleGroupSelect(lessonRow.rawGroup, selectedLessonDate);
};

  const handleAttendanceChange = (studentId, wasPresent) => {
  setAttendanceData(prev => ({
    ...prev,
    [studentId]: wasPresent
  }));
};
const handleSaveAttendance = async () => {
  if (!selectedGroup || !selectedDate || !students || students.length === 0 || !selectedLessonId) {
    setNotification({
      open: true,
      message: 'חסרים נתונים לשמירת הנוכחות',
      severity: 'error'
    });
    return;
  }

  try {
    const currentUserId = currentUser?.id || currentUser?.userId || currentUser?.IdentityCard || currentUser?.identityCard || 'Unknown';
    const now = new Date();
    const updateDatetime = format(now, 'yyyy-MM-dd HH:mm:ss');
    const reportDate = format(selectedDate, 'yyyy-MM-dd');
    const existingAttendance = attendanceRecords[reportDate] || [];

    const attendanceRecordsPayload = Object.keys(attendanceData).map(studentId => {
      const parsedStudentId = parseInt(studentId, 10);
      const existingRecord = existingAttendance.find(record => getAttendanceStudentId(record) === parsedStudentId);

      return {
        attendanceId: getAttendanceRecordId(existingRecord),
        studentId: parsedStudentId,
        lessonId: selectedLessonId,
        dateReport: reportDate,
        statusReport: '',
        updateDate: updateDatetime,
        updateBy: String(currentUserId),
        healthFundReport: '',
        wasPresent: attendanceData[studentId]
      };
    });

    console.log('📤 Sending attendanceRecords to server:', attendanceRecordsPayload);

    await dispatch(batchUpdateAttendances(attendanceRecordsPayload)).unwrap();

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
    setSelectedLessonId(null);
    setAttendanceData({});
    setSelectedDate(null);
    setStudentsLoaded(false);
    dispatch(clearGroupsByDay());
  };

  useEffect(() => {
    const loadMonthlyAttendance = async () => {
      if (groups.length > 0) {
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
  }, [currentDate, groups, dispatch]);

  useEffect(() => {
    const loadMonthLessons = async () => {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      const startDate = format(start, 'yyyy-MM-dd');
      const endDate = format(end, 'yyyy-MM-dd');

      try {
        await dispatch(getLessonsByDateRange({ startDate, endDate })).unwrap();
      } catch (rangeError) {
        const days = eachDayOfInterval({ start, end });
        const missingDates = days
          .map(day => format(day, 'yyyy-MM-dd'))
          .filter(dateKey => !lessonsByDate[dateKey]);

        if (!missingDates.length) return;

        await Promise.allSettled(
          missingDates.map(dateKey => dispatch(getLessonsByDate({ date: dateKey })))
        );
      }
    };

    loadMonthLessons();
  }, [currentDate, dispatch]);

  useEffect(() => {
    if (students.length > 0 && selectedGroup && selectedDate && attendanceDialogOpen) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const existingAttendance = attendanceRecords[dateString] || [];

      const initialAttendance = {};
      students.forEach(student => {
        const currentStudentId = student.studentId || student.id;
        const existingRecord = existingAttendance.find(r => getAttendanceStudentId(r) === currentStudentId);
        initialAttendance[currentStudentId] = existingRecord ? getAttendancePresence(existingRecord) : true;
      });

      setAttendanceData(initialAttendance);
    }
  }, [students, selectedGroup, selectedDate, attendanceDialogOpen, attendanceRecords]);

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Render calendar header
  const renderCalendarHeader = () => {
    const title = format(currentDate, 'MMMM yyyy', { locale: he });

    return (
      <Box sx={styles.calendarHeader}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 1.25,
            flexWrap: 'nowrap',
            direction: 'rtl',
            overflowX: 'auto',
            py: 0.5
          }}
        >
          
            <Tabs
              value={displayMode}
              onChange={(_, newMode) => {
                if (newMode) setDisplayMode(newMode);
              }}
              sx={{
                minHeight: 46,
                marginRight: '1%',
                '& .MuiTabs-indicator': {
                  height: 4,
                  borderRadius: 999,
                  backgroundColor: '#1e3a8a'
                },
                '& .MuiTab-root': {
                  minHeight: 46,
                  fontWeight: 700,
                  color: '#475569',
                  px: { xs: 2, sm: 2.75 },
                  whiteSpace: 'nowrap'
                },
                '& .Mui-selected': {
                  color: '#1e3a8a !important'
                }
              }}
            >
              <Tab value="calendar" label="תצוגת לוח" />
              <Tab value="list" label="תצוגת רשימה" />
            </Tabs>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              backgroundColor: '#eff4fa',
              border: '1px solid #d7e2ef',
              px: 0.80,
              py: 0.40,
              marginRight: '16%',
              minWidth: 'fit-content'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.15 }}>
              <IconButton onClick={() => handleDateChange('prev')} color="primary" size="small">
                <NavigateBefore />
              </IconButton>
              <Typography
                variant="h5"
                sx={(theme) => ({
                  ...styles.dateTitle(theme),
                  mx: 0.75,
                  fontSize: { xs: '1.25rem', sm: '1.55rem' },
                  lineHeight: 1.2,
                  fontFamily: 'Heebo, Assistant, sans-serif',
                  fontWeight: 700,
                  color: '#1e3a8a',
                  whiteSpace: 'nowrap'
                })}
              >
                {title}
              </Typography>
              <IconButton onClick={() => handleDateChange('next')} color="primary" size="small">
                <NavigateNext />
              </IconButton>
              <Tooltip title="חזור להיום">
                <IconButton
                  onClick={() => setCurrentDate(new Date())}
                  color="primary"
                  size="small"
                  sx={{ ...styles.todayButton, ml: 0.5 }}
                >
                  <Today />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </Box>
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
           ... טוען נתונים
          </Typography>
        </Box>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="month"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={styles.calendarContainer}>
            {displayMode === 'calendar' ? (
              <MonthlyCalendar
                currentDate={currentDate}
                onDateSelect={handleDateSelect}
                groups={groups || []}
                courses={courses || []}
                branches={branches || []}
                lessonsByDate={lessonsByDate || {}}
                savedAttendanceRecords={attendanceRecords || {}}
                hebrewHolidays={hebrewHolidays}
                isActiveDay={isActiveDay}
                getHebrewHolidayInfo={getHebrewHolidayInfo}
              />
            ) : (
              <AttendanceLessonsListView
                lessons={lessonRowsForList}
                branches={branches}
                loading={lessonsLoading}
                onReportAttendance={handleListLessonSelect}
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
            setCourseSelectionOpen(false);
            dispatch(clearGroupsByDay());
            // אל תאפס את selectedDate כאן
          }}
          selectedDate={selectedDate}
          groupsByDay={groupsForSelectedDate}
          groupsByDayLoading={lessonsLoading && groupsForSelectedDate.length === 0}
          onGroupSelect={handleGroupSelect}
        />
        {/* Attendance Dialog */}
        <AttendanceDialog
          open={attendanceDialogOpen}
          onClose={() => {
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
