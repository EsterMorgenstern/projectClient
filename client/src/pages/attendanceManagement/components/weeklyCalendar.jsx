import React, { useState, useEffect } from 'react';
import { 
  Box, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Chip, 
  Tooltip, useMediaQuery, useTheme 
} from '@mui/material';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { he } from 'date-fns/locale';
import { AccessTime, LocationOn, CheckCircle } from '@mui/icons-material';
import { styles } from '../styles/calendarStyles';

// Hebrew date utilities
const getHebrewDate = (date) => {
  // Placeholder - use a proper Hebrew calendar library in production
  return "כ״ז אייר";
};

const WeeklyCalendar = ({ currentDate, onDateSelect, events, attendanceRecords }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [weekDays, setWeekDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  
  // Generate week days and time slots
  useEffect(() => {
    // Get days of the week
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });
    
    // Process days with events
    const processedDays = days.map(day => {
      // Find events for this day
      const dayEvents = events.filter(event => {
        // In a real app, match the day of week with the event's day
        return day.getDay() === new Date(event.dayOfWeek === "ראשון" ? 0 : 
                                         event.dayOfWeek === "שני" ? 1 :
                                         event.dayOfWeek === "שלישי" ? 2 :
                                         event.dayOfWeek === "רביעי" ? 3 :
                                         event.dayOfWeek === "חמישי" ? 4 :
                                         event.dayOfWeek === "שישי" ? 5 : 6).getDay();
      });
      
      return {
        date: day,
        events: dayEvents,
        isToday: isToday(day)
      };
    });
    
    setWeekDays(processedDays);
    
    // Generate time slots from 8:00 to 20:00
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    setTimeSlots(slots);
    
  }, [currentDate, events]);
  
  // Get events for a specific time slot on a specific day
  const getEventsAtTime = (day, timeSlot) => {
    return day.events.filter(event => {
      // In a real app, you would compare the event's time with the time slot
      // For demo, we'll use the hour part of the time slot
      const eventHour = event.hour ? event.hour.split(':')[0] : null;
      const slotHour = timeSlot.split(':')[0];
      return eventHour === slotHour;
    });
  };
  
  // Check if attendance was recorded for an event
  const hasAttendanceRecord = (event, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return attendanceRecords[`${dateStr}-${event.groupId}`];
  };
  
  return (
    <Box className={styles.weeklyCalendarRoot}>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={styles.timeHeaderCell}>
                שעה
              </TableCell>
              {weekDays.map((day, index) => (
                <TableCell 
                  key={index} 
                  align="center"
                  className={`${styles.dayHeaderCell} ${day.isToday ? styles.todayHeaderCell : ''}`}
                >
                  <Box className={styles.dayHeaderContent}>
                    <Typography variant="subtitle2" className={styles.dayName}>
                      {format(day.date, 'EEEE', { locale: he })}
                    </Typography>
                    <Typography variant="body2" className={styles.dayDate}>
                      {format(day.date, 'd/M')}
                    </Typography>
                    <Typography variant="caption" className={styles.hebrewDateSmall}>
                      {getHebrewDate(day.date)}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((timeSlot, timeIndex) => (
              <TableRow key={timeIndex} className={timeIndex % 2 === 0 ? styles.evenRow : ''}>
                <TableCell className={styles.timeCell}>
                  {timeSlot}
                </TableCell>
                {weekDays.map((day, dayIndex) => {
                  const eventsAtTime = getEventsAtTime(day, timeSlot);
                  return (
                    <TableCell 
                      key={dayIndex} 
                      align="center"
                      className={`${styles.eventCell} ${day.isToday ? styles.todayCell : ''}`}
                      onClick={() => eventsAtTime.length > 0 && onDateSelect(day.date)}
                    >
                      {eventsAtTime.length > 0 ? (
                        <Box className={styles.weeklyEventsContainer}>
                          {eventsAtTime.map((event, eventIndex) => {
                            const hasAttendance = hasAttendanceRecord(event, day.date);
                            return (
                              <motion.div
                                key={eventIndex}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className={`${styles.weeklyEventCard} ${hasAttendance ? styles.attendanceRecordedCard : ''}`}
                              >
                                <Typography 
                                  variant="body2" 
                                  className={styles.eventTitle}
                                >
                                  {event.courseName || 'חוג'} - {event.groupName}
                                </Typography>
                                <Box className={styles.eventDetails}>
                                  <Box className={styles.eventDetail}>
                                    <AccessTime fontSize="small" className={styles.eventIcon} />
                                    <Typography variant="caption">
                                      {event.hour}
                                    </Typography>
                                  </Box>
                                  <Box className={styles.eventDetail}>
                                    <LocationOn fontSize="small" className={styles.eventIcon} />
                                    <Typography variant="caption">
                                      {event.branchName || 'סניף'}
                                    </Typography>
                                  </Box>
                                </Box>
                                {hasAttendance && (
                                  <Chip
                                    size="small"
                                    icon={<CheckCircle fontSize="small" />}
                                    label={`נוכחות: ${hasAttendance.presentCount || 0}`}
                                    className={styles.attendanceChip}
                                  />
                                )}
                              </motion.div>
                            );
                          })}
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

export default WeeklyCalendar;
