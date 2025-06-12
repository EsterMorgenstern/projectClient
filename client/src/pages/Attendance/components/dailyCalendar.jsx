import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, Typography, Grid, Paper, Divider, Chip, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Card, CardContent, 
  Avatar, useMediaQuery, useTheme 
} from '@mui/material';
import { 
  AccessTime, LocationOn, Group, School, 
  CheckCircle, Person, Info 
} from '@mui/icons-material';
import { format, isToday } from 'date-fns';
import { he } from 'date-fns/locale';
import { styles } from '../styles/calendarStyles';

// Hebrew date utilities
const getHebrewDate = (date) => {
  // Placeholder - use a proper Hebrew calendar library in production
  return "כ״ז אייר";
};

const DailyCalendar = ({ currentDate, onDateSelect, events, attendanceRecords }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [timeSlots, setTimeSlots] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);
  
  // Generate time slots and filter events for the current day
  useEffect(() => {
    // Generate time slots from 8:00 to 20:00
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    setTimeSlots(slots);
    
    // Filter events for the current day
    const filteredEvents = events.filter(event => {
      // In a real app, match the day of week with the event's day
      return currentDate.getDay() === new Date(event.dayOfWeek === "ראשון" ? 0 : 
                                              event.dayOfWeek === "שני" ? 1 :
                                              event.dayOfWeek === "שלישי" ? 2 :
                                              event.dayOfWeek === "רביעי" ? 3 :
                                              event.dayOfWeek === "חמישי" ? 4 :
                                              event.dayOfWeek === "שישי" ? 5 : 6).getDay();
    });
    
    // Add attendance information to events
    const eventsWithAttendance = filteredEvents.map(event => {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const hasAttendance = attendanceRecords[`${dateStr}-${event.groupId}`];
      
      return {
        ...event,
        hasAttendance,
        presentCount: hasAttendance ? hasAttendance.presentCount : 0
      };
    });
    
    setDayEvents(eventsWithAttendance);
  }, [currentDate, events, attendanceRecords]);
  
  // Get events for a specific time slot
  const getEventsAtTime = (timeSlot) => {
    return dayEvents.filter(event => {
      // In a real app, you would compare the event's time with the time slot
      // For demo, we'll use the hour part of the time slot
      const eventHour = event.hour ? event.hour.split(':')[0] : null;
      const slotHour = timeSlot.split(':')[0];
      return eventHour === slotHour;
    });
  };
  
  // Render day header
  const renderDayHeader = () => {
    const dayName = format(currentDate, 'EEEE', { locale: he });
    const formattedDate = format(currentDate, 'd MMMM yyyy', { locale: he });
    const hebrewDate = getHebrewDate(currentDate);
    
    return (
      <Box sx={`${styles.dayViewHeader} ${isToday(currentDate) ? styles.todayHeader : ''}`}>
        <Box>
          <Typography variant="h6" sx={styles.dayViewTitle}>
            {dayName}, {formattedDate}
          </Typography>
          <Typography variant="body2" sx={styles.dayViewHebrewDate}>
            {hebrewDate}
          </Typography>
        </Box>
        
        <Chip 
          label={`${dayEvents.length} חוגים`} 
          icon={<School />} 
          color="primary" 
          sx={styles.eventsCountChip}
        />
      </Box>
    );
  };
  
  return (
    <Box sx={styles.dailyCalendarRoot}>
      {renderDayHeader()}
      
      {dayEvents.length > 0 ? (
        <TableContainer component={Paper} sx={styles.dailyTableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.timeHeaderCell}>
                  שעה
                </TableCell>
                <TableCell sx={styles.eventsHeaderCell}>
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
                    sx={`${styles.timeSlotRow} ${timeIndex % 2 === 0 ? styles.evenRow : ''}`}
                  >
                    <TableCell sx={styles.timeCell}>
                      {timeSlot}
                    </TableCell>
                    <TableCell sx={styles.dailyEventsCell}>
                      {eventsAtTime.length > 0 ? (
                        <Grid container spacing={2}>
                          {eventsAtTime.map((event, eventIndex) => (
                            <Grid item xs={12} sm={6} md={4} key={eventIndex}>
                              <Card 
                                component={motion.div}
                                whileHover={{ scale: 1.03, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                sx={`${styles.dailyEventCard} ${event.hasAttendance ? styles.attendanceRecordedCard : ''}`}
                                onClick={() => onDateSelect(currentDate)}
                              >
                                <CardContent sx={styles.dailyEventCardContent}>
                                  <Box sx={styles.dailyEventHeader}>
                                    <Typography variant="subtitle1" sx={styles.dailyEventTitle}>
                                      {event.courseName || 'חוג'} - קבוצה {event.groupName}
                                    </Typography>
                                    {event.hasAttendance && (
                                      <CheckCircle color="success" fontSize="small" />
                                    )}
                                  </Box>
                                  
                                  <Divider sx={styles.eventDivider} />
                                  
                                  <Box sx={styles.eventDetailsList}>
                                    <Box sx={styles.eventDetailItem}>
                                      <AccessTime fontSize="small" sx={styles.eventDetailIcon} />
                                      <Typography variant="body2">
                                        {event.hour}
                                      </Typography>
                                    </Box>
                                    
                                    <Box sx={styles.eventDetailItem}>
                                      <LocationOn fontSize="small" sx={styles.eventDetailIcon} />
                                      <Typography variant="body2">
                                        {event.branchName || 'סניף'}
                                      </Typography>
                                    </Box>
                                    
                                    <Box sx={styles.eventDetailItem}>
                                      <Group fontSize="small" sx={styles.eventDetailIcon} />
                                      <Typography variant="body2">
                                        {event.maxStudents || '?'} תלמידים
                                      </Typography>
                                    </Box>
                                  </Box>
                                  
                                  {event.hasAttendance && (
                                    <Box sx={styles.attendanceInfo}>
                                      <Divider sx={styles.eventDivider} />
                                      <Typography variant="body2" sx={styles.attendanceText}>
                                        נוכחים: {event.presentCount} מתוך {event.maxStudents || '?'}
                                      </Typography>
                                    </Box>
                                  )}
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Box sx={styles.noEventsContainer}>
                          <Typography variant="body2" sx={styles.noEventsText}>
                            אין חוגים בשעה זו
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={styles.noEventsForDayContainer}>
          <Info fontSize="large" sx={styles.noEventsIcon} />
          <Typography variant="h6" sx={styles.noEventsTitle}>
            אין חוגים ביום זה
          </Typography>
          <Typography variant="body2" sx={styles.noEventsSubtitle}>
            ניתן להוסיף חוגים חדשים דרך מסך ניהול החוגים
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DailyCalendar;
