import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid, Typography, Paper, Box, Chip } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays } from 'date-fns';
import { he } from 'date-fns/locale';
import { styles } from '../styles/calendarStyles';


const MonthlyCalendar = ({ 
  currentDate, 
  groups, 
  courses, 
  branches, 
  onDateSelect,
  savedAttendanceRecords 
}) => {
  MonthlyCalendar.defaultProps = {
  events: [],
  attendanceRecords: {}
};
  const [calendarDays, setCalendarDays] = useState([]);
  
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
      
      return {
        date,
        day: date.getDate(),
        currentMonth: isSameMonth(date, currentDate),
        isToday: isSameDay(date, new Date()),
        events: dayEvents,
        hasAttendance
      };
    });
    
    setCalendarDays(days);
  };
  
  // Get events for a specific day
  const getEventsForDay = (date) => {
    // Get day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = date.getDay();
    const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const hebrewDayName = hebrewDays[dayOfWeek];
    if(!groups)return [];
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
        presentCount: attendanceRecord ? attendanceRecord.presentCount : 0
      };
    });
  };
  
  // Render week days header
  const renderWeekDays = () => {
    const weekDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    
    return (
      <Grid container className={styles.weekDaysHeader}>
        {weekDays.map((day, index) => (
          <Grid item xs={12/7} key={index} className={styles.weekDayCell}>
            <Typography 
              variant="subtitle2" 
              className={`${styles.weekDayText} ${index === 6 ? styles.sabbathDay : ''}`}
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
  
  return (
    <Box className={styles.calendarRoot}>
      {renderWeekDays()}
      
      <Grid container className={styles.daysGrid}>
        {calendarDays.map((day, index) => (
          <Grid item xs={12/7} key={index}>
            <Paper
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                ${styles.dayCell}
                ${!day.currentMonth ? styles.outsideMonthDay : ''}
                ${day.isToday ? styles.todayCell : ''}
                ${day.hasAttendance ? styles.hasAttendanceCell : ''}
              `}
              onClick={() => handleDayClick(day)}
            >
              <Box className={styles.dayHeader}>
                <Typography 
                  variant="body1" 
                  className={`
                    ${styles.dayNumber}
                    ${day.isToday ? styles.todayNumber : ''}
                    ${day.hasAttendance ? styles.hasAttendanceNumber : ''}
                  `}
                >
                  {day.day}
                </Typography>
                <Typography 
                  variant="caption" 
                  className={styles.hebrewDate}
                >
                  {format(day.date, 'dd/MM')}
                </Typography>
              </Box>
              
              <Box className={styles.eventsContainer}>
                {day.events.slice(0, 3).map((event, idx) => (
                  <Chip
                    key={idx}
                    size="small"
                    label={`${event.courseName} ${event.groupName}`}
                    className={`
                      ${styles.eventChip}
                      ${event.attendanceRecorded ? styles.attendanceRecorded : ''}
                    `}
                  />
                ))}
                
                {day.events.length > 3 && (
                  <Typography variant="caption" className={styles.moreEventsText}>
                    +{day.events.length - 3} נוספים
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MonthlyCalendar;
