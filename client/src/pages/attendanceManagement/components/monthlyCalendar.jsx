import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  Chip, 
  Tooltip, 
  Badge,
  Avatar
} from '@mui/material';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addDays,
  isWeekend,
  getMonth
} from 'date-fns';
import { he } from 'date-fns/locale';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import { styles } from '../styles/calendarStyles';

// מערך צבעים לפי חודשים - צבעים נעימים יותר
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

// שמות החודשים בעברית
const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

// שמות החודשים העבריים
const HEBREW_JEWISH_MONTHS = [
  'טבת-שבט', 'שבט-אדר', 'אדר-ניסן', 'ניסן-אייר', 'אייר-סיון', 'סיון-תמוז',
  'תמוז-אב', 'אב-אלול', 'אלול-תשרי', 'תשרי-חשון', 'חשון-כסלו', 'כסלו-טבת'
];

// פונקציה להמרת תאריך לועזי לעברי (פשוטה - לצורך הדגמה)
const getHebrewDate = (date) => {
  // בפרויקט אמיתי כדאי להשתמש בספרייה כמו hebcal
  // זו המרה פשוטה לצורך הדגמה
  const day = date.getDate();
  const month = date.getMonth();
  
  // מחזיר מחרוזת פשוטה של יום בחודש עברי
  // במציאות צריך להשתמש בספרייה אמיתית להמרה מדויקת
  return `כ"ז ${HEBREW_JEWISH_MONTHS[month].split('-')[0]}`;
};

const MonthlyCalendar = ({ 
  currentDate, 
  groups, 
  courses, 
  branches, 
  onDateSelect,
  savedAttendanceRecords ,
  attendanceRecords
}) => {
   const getAttendanceForDate = (date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        return attendanceRecords[dateString] || [];
    };
 // פונקציה לחישוב סטטיסטיקות נוכחות ליום
    const getAttendanceStats = (date) => {
        const attendance = getAttendanceForDate(date);
        if (attendance.length === 0) return null;
        
        const present = attendance.filter(a => a.wasPresent).length;
        const total = attendance.length;
        
        return { present, total, percentage: Math.round((present / total) * 100) };
    };

    // ברינדור של כל יום, הוסף אינדיקטור נוכחות
    const renderDayContent = (date) => {
        const stats = getAttendanceStats(date);
        
        return (
            <Box sx={styles.dayContent}>
                {/* תוכן קיים של היום */}
                
                {stats && (
                    <Box sx={styles.attendanceIndicator}>
                        <Chip
                            label={`${stats.present}/${stats.total}`}
                            size="small"
                            color={stats.percentage >= 80 ? "success" : 
                                   stats.percentage >= 60 ? "warning" : "error"}
                            sx={styles.attendanceChip}
                        />
                    </Box>
                )}
            </Box>
        );
    };
    
  const [calendarDays, setCalendarDays] = useState([]);
  const [monthColors, setMonthColors] = useState({});
  
  // קביעת צבעי החודש הנוכחי
  useEffect(() => {
    const monthIndex = getMonth(currentDate);
    setMonthColors(MONTH_COLORS[monthIndex]);
  }, [currentDate]);
  
  // Generate calendar days when current date changes
  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, groups, savedAttendanceRecords]);
  
  // Generate calendar days
  const generateCalendarDays = () => {
    // Get start and end of month
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Get all days in month
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    let firstDayOfWeek = monthStart.getDay();
    
    // Add days from previous month to fill first week
    const prevMonthDays = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = addDays(monthStart, -i - 1);
      prevMonthDays.push(date);
    }
    
    // Add days from next month to complete grid (6 rows of 7 days)
    const nextMonthDays = [];
    const totalDaysNeeded = 42 - (prevMonthDays.length + daysInMonth.length);
    for (let i = 1; i <= totalDaysNeeded; i++) {
      const date = addDays(monthEnd, i);
      nextMonthDays.push(date);
    }
    
    // Combine all days
    const allDays = [...prevMonthDays.reverse(), ...daysInMonth, ...nextMonthDays];
    
    // Create calendar days with events
    const days = allDays.map(date => {
      // Get events for this day
      const dayEvents = getEventsForDay(date);
      
      // Check if any events have attendance recorded
      const hasAttendance = dayEvents.some(event => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const attendanceKey = `${dateStr}-${event.groupId}`;
        return savedAttendanceRecords[attendanceKey];
      });
      
      // Calculate attendance statistics
      const attendanceStats = calculateAttendanceStats(date, dayEvents);
      
      return {
        date,
        day: date.getDate(),
        currentMonth: isSameMonth(date, currentDate),
        isToday: isSameDay(date, new Date()),
        isWeekend: isWeekend(date),
        events: dayEvents,
        hasAttendance,
        attendanceStats,
        hebrewDate: getHebrewDate(date)
      };
    });
    
    setCalendarDays(days);
  };
  
  // Calculate attendance statistics for a day
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
  
  // Get events for a specific day
  const getEventsForDay = (date) => {
    // Get day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = date.getDay();
    const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const hebrewDayName = hebrewDays[dayOfWeek];
    
    if(!groups) return [];
    
    // Filter groups that occur on this day
    return groups.filter(group => {
      // Check if group occurs on this day of week
      return group.dayOfWeek === hebrewDayName;
    }).map(group => {
      // Add course and branch info
      const course = courses.find(c => c.courseId === group.courseId);
      const branch = branches.find(b => b.branchId === group.branchId);
      
      // Check if attendance is recorded
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
  
  // Render month header
  const renderMonthHeader = () => {
    const monthName = HEBREW_MONTHS[getMonth(currentDate)];
    const hebrewMonthName = HEBREW_JEWISH_MONTHS[getMonth(currentDate)];
    const year = format(currentDate, 'yyyy');
    
    return (
      <Box sx={{
        backgroundColor: monthColors.primary,
        color: 'white',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        ,direction:'rtl'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginRight: '12px' }}>
            {hebrewMonthName}
          </Typography>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold',marginRight:'12px' }}>
              {monthName} {year}
            </Typography>
            <Typography variant="subtitle1" sx={{marginRight:'12px'}} >
              {calendarDays.filter(day => day.events.length > 0).length} ימים עם פעילות
            </Typography>
          </Box>
        </Box>
        <Avatar sx={{ 
          backgroundColor: 'white', 
          color: monthColors.primary,
          width: 60,
          height: 60,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {format(currentDate, 'dd')}
          </Typography>
        </Avatar>
      </Box>
    );
  };
  
  // Render week days header
  const renderWeekDays = () => {
    const weekDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    
    // מחשב את האינדקס של היום הראשון בחודש (0 = ראשון, 6 = שבת)
    const firstDayIndex = startOfMonth(currentDate).getDay();
    
    return (
      <Grid container sx={{
        ...styles.weekDaysHeader,
        backgroundColor: monthColors.secondary,
        borderRadius: '8px',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        {weekDays.map((day, index) => (
          <Grid item xs={12/7} key={index} sx={styles.weekDayCell}>
            <Typography 
              variant="subtitle2" 
              sx={{
                ...styles.weekDayText,
                color: index === 6 ? '#E11D48' : monthColors.accent,
                fontWeight: 'bold'
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  // Handle day click
  const handleDayClick = (day) => {
    if (day.events.length > 0) {
      onDateSelect(day.date);
    }
  };
  
  // Render attendance badge
  const renderAttendanceBadge = (day) => {
    if (!day.attendanceStats || day.attendanceStats.totalStudents === 0) return null;
    
    const { presentStudents, totalStudents, percentage } = day.attendanceStats;
    
    let color = 'success';
    if (percentage < 70) color = 'error';
    else if (percentage < 90) color = 'warning';
    
    return (
      <Tooltip 
        title={`נוכחות: ${presentStudents}/${totalStudents} (${percentage}%)`}
        arrow
        placement="top"
      >
        <Box sx={styles.attendanceBadge}>
          <Badge 
            badgeContent={`${percentage}%`} 
            color={color}
            max={100}
            sx={styles.percentageBadge}
          >
            <PeopleIcon color={color} fontSize="small" />
          </Badge>
        </Box>
      </Tooltip>
    );
  };
  
  // Render event chips with colors based on course
  const renderEventChips = (day) => {
    if (!day.events.length) return null;
    
    // Create a simple hash function for consistent colors
    const getColorFromString = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Convert to hex color
      const hue = Math.abs(hash % 360);
      return `hsl(${hue}, 70%, 45%)`;
    };
    
    return day.events.slice(0, 3).map((event, idx) => {
      const courseColor = getColorFromString(event.courseName);
      
      return (
        <Tooltip
          key={idx}
          title={
            <Box>
              <Typography variant="subtitle2">{`${event.courseName} - ${event.groupName}`}</Typography>
              <Typography variant="body2">{`סניף: ${event.branchName}`}</Typography>
              {event.attendanceRecorded && (
                <Typography variant="body2">
                  {`נוכחות: ${event.presentCount}/${event.totalCount} (${Math.round((event.presentCount / event.totalCount) * 100)}%)`}
                </Typography>
              )}
            </Box>
          }
          arrow
          placement="top"
        >
          <Chip
            size="small"
            icon={event.attendanceRecorded ? <CheckCircleIcon fontSize="small" /> : <EventIcon fontSize="small" />}
            label={`${event.courseName} ${event.groupName}`}
            sx={{
              ...styles.eventChip,
              backgroundColor: event.attendanceRecorded 
                ? 'rgba(16, 185, 129, 0.15)' 
                : `${courseColor}20`,
              color: event.attendanceRecorded 
                ? '#065F46' 
                : courseColor,
              borderLeft: `4px solid ${event.attendanceRecorded ? '#10B981' : courseColor}`,
              marginBottom: '4px',
              '&:hover': {
                backgroundColor: event.attendanceRecorded 
                  ? 'rgba(16, 185, 129, 0.25)' 
                  : `${courseColor}30`,
              }
            }}
          />
        </Tooltip>
      );
    });
  };
  
  return (
    <Box sx={{
      ...styles.calendarRoot,
      backgroundColor: monthColors.secondary + '30',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
    }}>
      {renderMonthHeader()}
      {renderWeekDays()}
      
      <Grid container sx={styles.daysGrid}>
        {calendarDays.map((day, index) => (
          <Grid item xs={12/7} key={index}>
            <Paper
              component={motion.div}
              whileHover={{ scale: 1.03, zIndex: 10, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
              whileTap={{ scale: 0.98 }}
              sx={{
                ...styles.dayCell,
                backgroundColor: day.currentMonth 
                  ? (day.isToday 
                    ? monthColors.secondary 
                    : 'white')
                  : '#F8FAFC',
                border: day.isToday 
                  ? `2px solid ${monthColors.primary}` 
                  : day.hasAttendance 
                    ? '2px solid rgba(16, 185, 129, 0.5)' 
                    : '1px solid #E2E8F0',
                boxShadow: day.isToday 
                  ? `0 4px 12px ${monthColors.primary}30` 
                  : 'none',
                position: 'relative',
                overflow: 'hidden',
                '&::before': day.events.length > 0 ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: day.hasAttendance 
                    ? '#10B981' 
                    : monthColors.primary,
                  opacity: 0.7
                } : {},
                '&::after': day.isWeekend ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '0',
                  height: '0',
                  borderStyle: 'solid',
                  borderWidth: '0 12px 12px 0',
                  borderColor: `transparent ${day.isToday ? monthColors.primary : '#94A3B8'} transparent transparent`,
                  opacity: 0.7
                } : {}
              }}
              onClick={() => handleDayClick(day)}
            >
              <Box sx={{
                ...styles.dayHeader,
                borderBottom: `1px dashed ${monthColors.primary}30`
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography 
                    variant="body1" 
                    sx={{
                      ...styles.dayNumber,
                      color: day.isToday 
                        ? monthColors.primary 
                        : day.isWeekend 
                          ? '#94A3B8' 
                          : 'text.primary',
                      fontWeight: day.isToday ? 'bold' : 500
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
                        : 'text.secondary'
                    }}
                  >
                    {day.hebrewDate}
                  </Typography>
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{
                    ...styles.dayOfWeek,
                    color: day.isToday 
                      ? monthColors.primary 
                      : day.isWeekend
                        ? '#94A3B8'
                        : 'text.secondary'
                  }}
                >
                  {format(day.date, 'EEE', { locale: he })}
                </Typography>
              </Box>
              
              {renderAttendanceBadge(day)}
              
              <Box sx={styles.eventsContainer}>
                {renderEventChips(day)}
                
                {day.events.length > 3 && (
                  <Typography 
                    variant="caption" 
                    sx={{
                      ...styles.moreEventsText,
                      backgroundColor: `${monthColors.primary}20`,
                      color: monthColors.accent
                    }}
                  >
                    +{day.events.length - 3} נוספים
                  </Typography>
                )}
              </Box>
              
              {day.events.length === 0 && day.currentMonth && (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '70%',
                  opacity: 0.3
                }}>
                  <CalendarTodayIcon color="disabled" />
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

MonthlyCalendar.defaultProps = {
  events: [],
  savedAttendanceRecords: {}
};

export default MonthlyCalendar;
