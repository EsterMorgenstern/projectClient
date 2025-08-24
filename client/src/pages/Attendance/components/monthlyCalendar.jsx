import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Grid, Typography, Paper, Box, Chip, Tooltip, Badge, Avatar, useTheme
} from '@mui/material';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth,
  isSameDay, addDays, isWeekend, getMonth
} from 'date-fns';
import { he } from 'date-fns/locale';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import EventBusy from '@mui/icons-material/EventBusy';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import { HDate } from '@hebcal/core';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import { 
  styles
  } from '../styles/calendarStyles';

// צבעים נעימים לעין
const MONTH_COLORS = [

  { primary: '#4F86C6', secondary: '#EFF6FF', accent: '#2C5282' }, // ינואר - כחול נעים
  { primary: '#E779C1', secondary: '#FCE7F3', accent: '#9D4EDD' }, // פברואר - ורוד נעים
  { primary: '#48BB78', secondary: '#F0FFF4', accent: '#2F855A' }, // מרץ - ירוק נעים
  { primary: '#F6AD55', secondary: '#FFFAF0', accent: '#C05621' }, // אפריל - כתום נעים
  { primary: '#9F7AEA', secondary: '#F5F3FF', accent: '#6B46C1' }, // מאי - סגול נעים
  { primary: '#FC8181', secondary: '#FFF5F5', accent: '#C53030' }, // יוני - אדום נעים
  { primary: '#4FD1C5', secondary: '#E6FFFA', accent: '#2C7A7B' }, // יולי - טורקיז נעים
  { primary: '#9AE6B4', secondary: '#F0FFF4', accent: '#38A169' }, // אוגוסט - ירוק בהיר נעים
  { primary: '#F6AD55', secondary: '#FFFAF0', accent: '#C05621' }, // ספטמבר - כתום נעים
  { primary: '#B794F4', secondary: '#FAF5FF', accent: '#6B46C1' }, // אוקטובר - סגול בהיר נעים
  { primary: '#63B3ED', secondary: '#EBF8FF', accent: '#2B6CB0' }, // נובמבר - כחול בהיר נעים
  { primary: '#4FD1C5', secondary: '#E6FFFA', accent: '#2C7A7B' }  // דצמבר - טורקיז נעים
];


// צבעים לסניפים שונים
const COURSE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];

// שמות החודשים בעברית ובלועזית
const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

const HEBREW_CALENDAR_MONTHS = [
  'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיון',
  'תמוז', 'אב', 'אלול', 'תשרי', 'חשון', 'כסלו'
];

const MonthlyCalendar = ({
  currentDate,
  onDateSelect,
  groups,
  courses,
  branches,
  savedAttendanceRecords,
  hebrewHolidays,
  isActiveDay,
  getHebrewHolidayInfo,
   isMarkedForDayStatus = {} 
}) => {
  const theme = useTheme();
  const [calendarDays, setCalendarDays] = useState([]);
  const [monthColors, setMonthColors] = useState({});

  // קביעת צבעי החודש הנוכחי
  useEffect(() => {
    const monthIndex = getMonth(currentDate);
    setMonthColors(MONTH_COLORS[monthIndex]);
  }, [currentDate]);

  // Generate calendar days
  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, groups, savedAttendanceRecords]);

 const generateCalendarDays = () => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // תיקון חישוב ימי החודש הקודם
  let firstDayOfWeek = monthStart.getDay(); // 0 = ראשון, 1 = שני, וכו'
  // אל תשנה את firstDayOfWeek כי 0 = ראשון זה נכון
  
  const prevMonthDays = [];
  // אם firstDayOfWeek = 0 (ראשון), אז לא צריך ימים קודמים
  // אם firstDayOfWeek = 1 (שני), צריך יום אחד קודם (ראשון)
  for (let i = firstDayOfWeek; i > 0; i--) {
    const date = addDays(monthStart, -i);
    prevMonthDays.push(date);
  }

  // חישוב ימי החודש הבא
  const totalDaysShown = prevMonthDays.length + daysInMonth.length;
  const weeksNeeded = Math.ceil(totalDaysShown / 7);
  const totalCellsNeeded = weeksNeeded * 7;
  const nextMonthDaysNeeded = totalCellsNeeded - totalDaysShown;
  
  const nextMonthDays = [];
  for (let i = 1; i <= nextMonthDaysNeeded; i++) {
    const date = addDays(monthEnd, i);
    nextMonthDays.push(date);
  }

  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  
  console.log(`Total days: ${allDays.length}, should be divisible by 7: ${allDays.length % 7 === 0}`);
  console.log(`First day of month: ${format(monthStart, 'EEEE')}, day number: ${firstDayOfWeek}`);
    const days = allDays.map((date,index )=> {
      const dayEvents = getEventsForDay(date);
      const hasAttendance = dayEvents.some(event => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const attendanceKey = `${dateStr}-${event.groupId}`;
        return savedAttendanceRecords[attendanceKey];
      });

      const attendanceStats = calculateAttendanceStats(date, dayEvents);
      const isActiveDayForEvents = isActiveDay ? isActiveDay(date) : true;
      const holidayInfo = getHebrewHolidayInfo ? getHebrewHolidayInfo(date) : null;

   const dateStr = format(date, 'yyyy-MM-dd');
   const isDayFullyMarked = isMarkedForDayStatus[dateStr] === true;

      return {
        id: `${format(date, 'yyyy-MM-dd')}-${index}`,
        date,
        day: date.getDate(),
        currentMonth: isSameMonth(date, currentDate),
        isToday: isSameDay(date, new Date()),
        isWeekend: isWeekend(date),
        events: dayEvents,
        hasAttendance,
        attendanceStats,
        hebrewDate: getHebrewDate(date),
        isActiveDay: isActiveDayForEvents,
        holidayInfo: holidayInfo,
        groupsCount: dayEvents.length,
        hasGroups: dayEvents.length > 0,
        pieChartData: createPieChartData(dayEvents),
        isDayFullyMarked
      };
    });

    setCalendarDays(days);
  };

  // יצירת נתונים לגרף עוגה
  const createPieChartData = (events) => {
    if (!events || events.length === 0) return [];

    // קיבוץ לפי סניף
    const branchGroups = {};
    events.forEach(event => {
      const branchName = event.branchName || 'סניף לא ידוע';
      if (!branchGroups[branchName]) {
        branchGroups[branchName] = {
          name: branchName,
          count: 0,
          groups: []
        };
      }
      branchGroups[branchName].count++;
      branchGroups[branchName].groups.push(event);
    });

    // המרה למערך עם צבעים
    return Object.values(branchGroups).map((branch, index) => ({
      name: branch.name,
      value: branch.count,
      color: COURSE_COLORS[index % COURSE_COLORS.length],
      groups: branch.groups
    }));
  };

  const getHebrewDate = (date) => {
    try {
      const hdate = new HDate(date);
      const hebrewDay = hdate.getDate();
      const hebrewMonthNameEn = hdate.getMonthName();

      const monthTranslations = {
        'Tishrei': 'תשרי', 'Cheshvan': 'חשון', 'Kislev': 'כסלו', 'Tevet': 'טבת',
        "Sh'vat": 'שבט', 'Adar': 'אדר', 'Adar I': 'אדר א\'', 'Adar II': 'אדר ב\'',
        'Nisan': 'ניסן', 'Iyyar': 'אייר', 'Sivan': 'סיון', 'Tamuz': 'תמוז',
        'Av': 'אב', 'Elul': 'אלול'
      };

      const hebrewNumbers = {
        1: 'א\'', 2: 'ב\'', 3: 'ג\'', 4: 'ד\'', 5: 'ה\'', 6: 'ו\'', 7: 'ז\'', 8: 'ח\'', 9: 'ט\'', 10: 'י\'',
        11: 'י"א', 12: 'י"ב', 13: 'י"ג', 14: 'י"ד', 15: 'ט"ו', 16: 'ט"ז', 17: 'י"ז', 18: 'י"ח', 19: 'י"ט', 20: 'כ\'',
        21: 'כ"א', 22: 'כ"ב', 23: 'כ"ג', 24: 'כ"ד', 25: 'כ"ה', 26: 'כ"ו', 27: 'כ"ז', 28: 'כ"ח', 29: 'כ"ט', 30: 'ל\'', 31: 'ל"א'
      };

      const hebrewDayStr = hebrewNumbers[hebrewDay] || hebrewDay.toString();
      const translatedMonth = monthTranslations[hebrewMonthNameEn] || hebrewMonthNameEn;

      return `${hebrewDayStr} ${translatedMonth}`;

    } catch (error) {
      console.error('Error converting to Hebrew date:', error);
      return '';
    }
  };

  const calculateAttendanceStats = (date, events) => {
    if (!events.length) return null;

    let totalStudents = 0;
    let presentStudents = 0;

    events.forEach(event => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const attendanceKey = `${dateStr}-${event.groupId}`;
      const attendanceRecord = savedAttendanceRecords[attendanceKey];

      if (attendanceRecord) {
        totalStudents += attendanceRecord.totalCount || 0;
        presentStudents += attendanceRecord.presentCount || 0;
      }
    });

    return {
      totalStudents,
      presentStudents,
      percentage: totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0
    };
  };

  const getEventsForDay = (date) => {
    const dayOfWeek = date.getDay();
    const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const hebrewDayName = hebrewDays[dayOfWeek];

    if (!groups) return [];

    return groups.filter(group => {
      return group.dayOfWeek === hebrewDayName;
    }).map(group => {
      const course = courses.find(c => c.courseId === group.courseId);
      const branch = branches.find(b => b.branchId === group.branchId);
      const dateStr = format(date, 'yyyy-MM-dd');
      const attendanceKey = `${dateStr}-${group.groupId}`;
      const attendanceRecord = savedAttendanceRecords[attendanceKey];

      return {
        ...group,
        courseName: course ? course.couresName : 'חוג לא ידוע',
        branchName: branch ? branch.name : 'סניף לא ידוע',
        attendanceRecorded: !!attendanceRecord,
        presentCount: attendanceRecord ? attendanceRecord.presentCount : 0,
        totalCount: attendanceRecord ? attendanceRecord.totalCount : 0
      };
    });
  };

  // כותרת החודש 
const renderMonthHeader = () => {
  const monthName = HEBREW_MONTHS[getMonth(currentDate)];
  const hebrewMonthName = HEBREW_CALENDAR_MONTHS[getMonth(currentDate)];
  const year = format(currentDate, 'yyyy');

  const monthStats = {
    totalDaysWithGroups: calendarDays.filter(day => day.currentMonth && day.hasGroups).length,
    totalGroups: calendarDays.reduce((sum, day) => day.currentMonth ? sum + day.groupsCount : sum, 0),
    daysWithAttendance: calendarDays.filter(day => day.currentMonth && day.hasAttendance).length,
    // תיקון - ספירה נכונה של ימים עם נוכחות מלאה
    daysWithFullAttendance: calendarDays.filter(day => 
      day.currentMonth && 
      day.hasGroups && 
      day.isDayFullyMarked === true
    ).length
  };

  return (
    <Box sx={{
      background: `linear-gradient(135deg, ${monthColors.primary} 0%, ${monthColors.accent} 100%)`,
      color: 'white',
      padding: '24px',
      borderRadius: '20px',
      marginBottom: '20px',
      boxShadow: `0 8px 32px ${monthColors.primary}40`,
      position: 'relative',
      overflow: 'hidden',
      direction: 'rtl',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 0 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: '3px solid rgba(255,255,255,0.3)',
            width: { xs: 60, md: 80 },
            height: { xs: 60, md: 80 },
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 'bold'
          }}>
            {format(currentDate, 'MM')}
          </Avatar>
          
          <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="h3" sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 0.5
            }}>
              {monthName} {year}
            </Typography>
            <Typography variant="h5" sx={{
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
              opacity: 0.9,
              fontWeight: '500'
            }}>
              {hebrewMonthName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', md: 'flex-end' }
        }}>
          <Chip
            icon={<CalendarTodayIcon />}
            label={`${monthStats.totalDaysWithGroups} ימים פעילים`}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
          <Chip
            icon={<GroupIcon />}
            label={`${monthStats.totalGroups} חוגים`}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
          <Chip
            icon={<CheckCircleIcon />}
            label={`${monthStats.daysWithFullAttendance}/${monthStats.totalDaysWithGroups} ימים הושלמו`}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

  // כותרת ימי השבוע
 const renderWeekDays = () => {
 const weekDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
      backgroundColor: monthColors.secondary,
      borderRadius: '12px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      padding: '16px 8px',
      direction: 'rtl'
    }}>
      {weekDays.map((day, index) => (
        <Box key={`weekday-${index}`} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '8px 12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            width: '100%',
            textAlign: 'center'
          }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: index === 6 ? '#E53E3E' : monthColors.accent, // שבת יהיה אדום
                fontWeight: 'bold',
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {day}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
  // רינדור גרף עוגה עבור יום
 const renderPieChart = (day) => {
  if (!day.pieChartData || day.pieChartData.length === 0) return null;

  return (
    <Box sx={{
      position: 'relative',
      width: { xs: 40, sm: 45, md: 50 }, // הקטנת הגודל
      height: { xs: 40, sm: 45, md: 50 }, // הקטנת הגודל
      margin: '0 auto'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={day.pieChartData}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius="100%"
            paddingAngle={day.pieChartData.length > 1 ? 2 : 0}
            dataKey="value"
            stroke="none"
          >
            {day.pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* מספר כולל במרכז */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '50%',
        width: { xs: 16, sm: 18, md: 20 }, // הקטנת הגודל
        height: { xs: 16, sm: 18, md: 20 }, // הקטנת הגודל
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        border: '2px solid #f0f0f0'
      }}>
        <Typography variant="caption" sx={{
          fontWeight: 'bold',
          fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' }, // הקטנת הפונט
          color: '#333'
        }}>
          {day.groupsCount}
        </Typography>
      </Box>
    </Box>
  );
};
  // רינדור תוכן היום
  const renderDayContent = (day) => {
  const groupsCount = day.events.length;
  const hasAttendance = day.hasAttendance;

  if (!day.isActiveDay) {
    return (
      <Box sx={styles.emptyDayState}>
        {day.holidayInfo ? (
          <>
            <EventBusy sx={{
              ...styles.emptyDayIcon,
              color: '#F6AD55'
            }} />
            <Typography variant="caption" sx={{
              ...styles.holidayText,
              backgroundColor: 'rgba(246, 173, 85, 0.1)',
              color: '#C05621',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: { xs: '0.65rem', sm: '0.7rem' }
            }}>
              {day.holidayInfo.name}
            </Typography>
          </>
        ) : day.isWeekend ? (
          <>
            <StarIcon sx={{
              ...styles.emptyDayIcon,
              color: '#9F7AEA'
            }} />
            <Typography variant="caption" sx={{
              ...styles.emptyDayText,
              color: '#6B46C1',
              fontSize: { xs: '0.65rem', sm: '0.7rem' }
            }}>
              שבת קודש
            </Typography>
          </>
        ) : (
          <>
            <CalendarTodayIcon sx={styles.emptyDayIcon} />
            <Typography variant="caption" sx={styles.emptyDayText}>
              יום מנוחה
            </Typography>
          </>
        )}
      </Box>
    );
  }

  if (groupsCount === 0) {
    return (
      <Box sx={styles.emptyDayState}>
        <CalendarTodayIcon sx={{
          ...styles.emptyDayIcon,
          color: '#CBD5E0'
        }} />
        <Typography variant="caption" sx={{
          ...styles.emptyDayText,
          fontSize: { xs: '0.65rem', sm: '0.7rem' }
        }}>
          אין חוגים
        </Typography>
      </Box>
    );
  }

  // יום עם חוגים - הצגת גרף עוגה
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      py: 1,
      position: 'relative' // הוסף את זה
    }}>
            <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          // הוסף margin-top כשיש נוכחות מלאה
          marginTop: day.isDayFullyMarked ? '32px' : '0px',
          transition: 'margin-top 0.2s ease'
        }}
      >
        <Tooltip
          title={
            <Box sx={{ direction: 'rtl' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                קבוצות ביום זה:
              </Typography>
              {day.pieChartData.map((branch, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, direction: 'rtl' }}>
                  <Typography variant="body2">
                    {branch.value} {branch.value === 1 ? 'קבוצה' : 'קבוצות'} - {branch.name}
                  </Typography>
                  <Box sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: branch.color,
                    borderRadius: '50%'
                  }} />
                </Box>
              ))}
              {hasAttendance && day.attendanceStats && (
                <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.3)', direction: 'rtl' }}>
                  <Typography variant="body2">
                    נוכחות: {day.attendanceStats.presentStudents}/{day.attendanceStats.totalStudents} 
                    ({day.attendanceStats.percentage}%)
                  </Typography>
                </Box>
              )}
              {day.isDayFullyMarked && (
                <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.3)', direction: 'rtl' }}>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    ✓ נוכחות נקבעה לכל הקבוצות
                  </Typography>
                </Box>
              )}
            </Box>
          }
          arrow
          placement="top"
        >
          <Box sx={{ position: 'relative' }}>
            {renderPieChart(day)}
              
            {(hasAttendance || day.isDayFullyMarked) && (
              <Box sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                zIndex: 10
              }}>
                <CheckCircleIcon
                  sx={{
                    fontSize: 16,
                    color: day.isDayFullyMarked ? '#4caf50' : getAttendanceColor(day.attendanceStats?.percentage || 0),
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    filter: `drop-shadow(0 2px 4px ${day.isDayFullyMarked ? '#4caf50' : getAttendanceColor(day.attendanceStats?.percentage || 0)}40)`
                  }}
                />
              </Box>
            )}
          </Box>
        </Tooltip>
      </motion.div>

      <Typography variant="caption" sx={{
        fontSize: { xs: '0.7rem', sm: '0.75rem' },
        fontWeight: '600',
        color: '#4A5568',
        textAlign: 'center'
      }}>
        {formatGroupsCountText(groupsCount)}
      </Typography>

      {/* עדכן את הצגת הסטטוס */}
      {day.isDayFullyMarked ? (
        <Typography
          variant="caption"
          sx={{
            color: '#4caf50',
            fontWeight: 'bold',
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid rgba(76, 175, 80, 0.4)'
          }}
        >
          ✓ הושלם
        </Typography>
      ) : hasAttendance && day.attendanceStats ? (
        <Typography
          variant="caption"
          sx={{
            color: getAttendanceColor(day.attendanceStats.percentage),
            fontWeight: 'bold',
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            backgroundColor: `${getAttendanceColor(day.attendanceStats.percentage)}20`,
            padding: '2px 6px',
            borderRadius: '4px',
            border: `1px solid ${getAttendanceColor(day.attendanceStats.percentage)}40`
          }}
        >
          {day.attendanceStats.percentage}%
        </Typography>
      ) : null}
    </Box>
  );
};

  // טיפול בלחיצה על יום
  const handleDayClick = (day) => {
    if (day.isActiveDay && day.events.length > 0) {
      onDateSelect(day.date);
    } else if (!day.isActiveDay) {
      console.log('Day is not active for events:', day.holidayInfo?.name || 'Weekend/Holiday');
    } else if (day.events.length === 0) {
      console.log('No events scheduled for this day');
    }
  };

  return (
    <Box sx={{
      ...styles.calendarRoot,
      backgroundColor: `${monthColors.secondary}30`,
      padding: '20px',
      borderRadius: '20px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
      direction: 'rtl'
    }}>
      {renderMonthHeader()}
      {renderWeekDays()}

    <Box sx={{
  ...styles.daysGrid,
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)', // בדיוק 7 עמודות
  gap: '8px',
  direction: 'rtl',
  width: '100%',
  backgroundColor: '#f8fafc',
  padding: '8px',
  borderRadius: '12px'
}}>
  {calendarDays.map((day, index) => {
    const uniqueKey = `${format(day.date, 'yyyy-MM-dd')}-${index}`;

    return (
      <Paper
        key={uniqueKey}
        component={motion.div}
        whileHover={{
          scale: day.isActiveDay && day.events.length > 0 ? 1.03 : 1,
          zIndex: day.isActiveDay && day.events.length > 0 ? 10 : 1
        }}
        whileTap={{
          scale: day.isActiveDay && day.events.length > 0 ? 0.98 : 1
        }}
        sx={{
          ...styles.dayCell,
          minHeight: { xs: '100px', sm: '120px', md: '140px' },
          aspectRatio: '1', // יחס 1:1 לריבוע מושלם
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: day.currentMonth
            ? (day.isToday
                ? monthColors.light
                : !day.isActiveDay
                  ? theme.palette.grey[50]
                  : 'white')
            : '#F8FAFC',
          border: day.isToday
            ? `2px solid ${monthColors.primary}`
            : day.hasAttendance
              ? `2px solid ${getAttendanceColor(day.attendanceStats?.percentage || 0)}60`
              : !day.isActiveDay
                ? `1px solid ${theme.palette.grey[200]}`
                : '1px solid #E2E8F0',
          boxShadow: day.isToday
            ? `0 4px 20px ${monthColors.primary}30`
            : day.hasAttendance
              ? `0 2px 12px ${getAttendanceColor(day.attendanceStats?.percentage || 0)}20`
              : 'none',
          cursor: day.isActiveDay && day.events.length > 0 ? 'pointer' : 'default',
          opacity: !day.currentMonth ? 0.4 : (!day.isActiveDay ? 0.7 : 1),
          position: 'relative',
          overflow: 'hidden',
          direction: 'rtl',
          
          // אינדיקטור עליון לסטטוס היום
          '&::before': day.events.length > 0 || day.holidayInfo ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            backgroundColor: day.holidayInfo
              ? '#F6AD55'
              : day.hasAttendance
                ? getAttendanceColor(day.attendanceStats?.percentage || 0)
                : monthColors.primary,
            opacity: 0.8
          } : {},
          
          '&:hover': day.isActiveDay && day.events.length > 0 ? {
            boxShadow: `0 8px 30px ${monthColors.primary}40`,
            borderColor: monthColors.primary
          } : {}
        }}
        onClick={() => handleDayClick(day)}
      >
        {/* כותרת היום */}
        <Box sx={{
          ...styles.dayHeader,
          borderBottom: `1px dashed ${monthColors.primary}30`,
          direction: 'rtl',
          padding: '6px 8px',
          minHeight: 'auto',
          flex: '0 0 auto',
           display: 'flex',
  justifyContent: 'space-between', // פיזור בין השני צדדים
  alignItems: 'flex-start'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , flex: 1}}>
            <Typography
              variant="body1"
              sx={{
                ...styles.dayNumber,
                color: day.isToday
                  ? monthColors.primary
                  : day.isWeekend
                    ? '#9F7AEA'
                    : !day.isActiveDay
                      ? theme.palette.grey[400]
                      : 'text.primary',
              fontWeight: day.isToday ? 'bold' : 600,
        fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' }, // הגדל קצת
        textAlign: 'center' // מרכוז
      }}
    >
              {day.day}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                ...styles.hebrewDate,
                color: day.isToday
                  ? monthColors.primary
                  : !day.isActiveDay
                    ? theme.palette.grey[400]
                    : 'text.secondary',
                fontSize: { xs: '0.55rem', sm: '0.6rem' },
                textAlign: 'center' // מרכוז
              }}
            >
              {day.hebrewDate}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                color: day.isToday
                  ? monthColors.primary
                  : day.isWeekend
                    ? '#9F7AEA'
                    : !day.isActiveDay
                      ? theme.palette.grey[400]
                      : 'text.secondary',
                fontSize: { xs: '0.55rem', sm: '0.6rem' },
                fontWeight: '500'
              }}
            >
              {format(day.date, 'EEE', { locale: he })}
            </Typography>

            {/* אינדיקטור חג */}
            {day.holidayInfo && (
              <Tooltip title={day.holidayInfo.name} arrow>
                <EventBusy
                  sx={{
                    fontSize: 10,
                    color: '#F6AD55',
                    mt: 0.5,
                    filter: 'drop-shadow(0 2px 4px rgba(246, 173, 85, 0.3))'
                  }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* תוכן היום */}
        <Box sx={{ 
          flex: 1,
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          padding: '4px',
          minHeight: 0
        }}>
          {renderDayContent(day)}
        </Box>
      </Paper>
    );
  })}
</Box>
      {/* מקרא משופר */}
      <Box sx={{
        mt: 3,
        p: 3,
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        direction: 'rtl'
      }}>
        <Typography variant="h6" sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          color: '#2D3748',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <EventIcon color="primary" />
          מקרא וסימנים
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: '#4A5568' }}>
              סוגי ימים:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: '#4caf50' }} />
                <Typography variant="body2">נוכחות נרשמה</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EventBusy sx={{ fontSize: 20, color: '#F6AD55' }} />
                <Typography variant="body2">חג/יום מנוחה</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <StarIcon sx={{ fontSize: 20, color: '#9F7AEA' }} />
                <Typography variant="body2">שבת קודש</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: '#4A5568' }}>
              גרף עוגה - חלוקת סניפים:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'conic-gradient(#FF6B6B 0deg 120deg, #4ECDC4 120deg 240deg, #45B7D1 240deg 360deg)',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
                <Typography variant="body2">כל צבע מייצג סניף שונה</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '2px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  3
                </Box>
                <Typography variant="body2">המספר במרכז = סה"כ קבוצות</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'conic-gradient(#FF6B6B 0deg 180deg, #4ECDC4 180deg 360deg)',
                  position: 'relative'
                }}>
                  <CheckCircleIcon sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    fontSize: 12,
                    color: '#10B981',
                    backgroundColor: 'white',
                    borderRadius: '50%'
                  }} />
                </Box>
                <Typography variant="body2">V ירוק = נוכחות נרשמה</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* דוגמאות צבעים לחוגים */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #E2E8F0' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: '#4A5568' }}>
            צבעי הסניפים:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {COURSE_COLORS.slice(0, 8).map((color, index) => (
              <Chip
                key={index}
                label={`סניף ${index + 1}`}
                size="small"
                sx={{
                  backgroundColor: color,
                  color: 'white',
                  fontWeight: 'bold',
                  '& .MuiChip-label': {
                    fontSize: '0.75rem'
                  }
                }}
              />
            ))}
            <Chip
              label="ועוד..."
              size="small"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// פונקציות עזר
const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return '#10B981'; // ירוק
  if (percentage >= 75) return '#3B82F6'; // כחול
  if (percentage >= 60) return '#F59E0B'; // כתום
  return '#EF4444'; // אדום
};

const formatGroupsCountText = (count) => {
  if (count === 0) return 'אין חוגים';
  if (count === 1) return 'חוג אחד';
  if (count === 2) return 'שני חוגים';
  return `${count} חוגים`;
};

// ברירות מחדל
MonthlyCalendar.defaultProps = {
  groups: [],
  courses: [],
  branches: [],
  savedAttendanceRecords: {},
  hebrewHolidays: new Map(),
  isActiveDay: () => true,
  getHebrewHolidayInfo: () => null,
  isMarkedForDayStatus: {}
};

export default MonthlyCalendar;

