// import React, { useState, useEffect } from 'react';
// import { 
//   Box, Table, TableBody, TableCell, TableContainer, 
//   TableHead, TableRow, Paper, Typography, Chip, 
//   Tooltip, useMediaQuery, useTheme 
// } from '@mui/material';
// import { motion } from 'framer-motion';
// import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
// import { he } from 'date-fns/locale';
// import { AccessTime, LocationOn, CheckCircle } from '@mui/icons-material';
// import { styles } from '../styles/calendarStyles';

// // Hebrew date utilities
// const getHebrewDate = (date) => {
//   // Placeholder - use a proper Hebrew calendar library in production
//   return "כ״ז אייר";
// };

// const WeeklyCalendar = ({ currentDate, onDateSelect, events, attendanceRecords }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const [weekDays, setWeekDays] = useState([]);
//   const [timeSlots, setTimeSlots] = useState([]);
  
//   // Generate week days and time slots
//   useEffect(() => {
//     // Get days of the week
//     const start = startOfWeek(currentDate, { weekStartsOn: 0 });
//     const end = endOfWeek(currentDate, { weekStartsOn: 0 });
//     const days = eachDayOfInterval({ start, end });
    
//     // Process days with events
//     const processedDays = days.map(day => {
//       // Find events for this day
//       const dayEvents = events.filter(event => {
//         // In a real app, match the day of week with the event's day
//         return day.getDay() === new Date(event.dayOfWeek === "ראשון" ? 0 : 
//                                          event.dayOfWeek === "שני" ? 1 :
//                                          event.dayOfWeek === "שלישי" ? 2 :
//                                          event.dayOfWeek === "רביעי" ? 3 :
//                                          event.dayOfWeek === "חמישי" ? 4 :
//                                          event.dayOfWeek === "שישי" ? 5 : 6).getDay();
//       });
      
//       return {
//         date: day,
//         events: dayEvents,
//         isToday: isToday(day)
//       };
//     });
    
//     setWeekDays(processedDays);
    
//     // Generate time slots from 8:00 to 20:00
//     const slots = [];
//     for (let hour = 8; hour <= 20; hour++) {
//       slots.push(`${hour.toString().padStart(2, '0')}:00`);
//     }
//     setTimeSlots(slots);
    
//   }, [currentDate, events]);
  
//   // Get events for a specific time slot on a specific day
//   const getEventsAtTime = (day, timeSlot) => {
//     return day.events.filter(event => {
//       // In a real app, you would compare the event's time with the time slot
//       // For demo, we'll use the hour part of the time slot
//       const eventHour = event.hour ? event.hour.split(':')[0] : null;
//       const slotHour = timeSlot.split(':')[0];
//       return eventHour === slotHour;
//     });
//   };
  
//   // Check if attendance was recorded for an event
//   const hasAttendanceRecord = (event, date) => {
//     const dateStr = format(date, 'yyyy-MM-dd');
//     return attendanceRecords[`${dateStr}-${event.groupId}`];
//   };
  
//   return (
//     <Box sx={styles.weeklyCalendarRoot}>
//       <TableContainer component={Paper} sx={styles.tableContainer}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell sx={styles.timeHeaderCell}>
//                 שעה
//               </TableCell>
//               {weekDays.map((day, index) => (
//                 <TableCell 
//                   key={index} 
//                   align="center"
//                   sx={`${styles.dayHeaderCell} ${day.isToday ? styles.todayHeaderCell : ''}`}
//                 >
//                   <Box sx={styles.dayHeaderContent}>
//                     <Typography variant="subtitle2" sx={styles.dayName}>
//                       {format(day.date, 'EEEE', { locale: he })}
//                     </Typography>
//                     <Typography variant="body2" sx={styles.dayDate}>
//                       {format(day.date, 'd/M')}
//                     </Typography>
//                     <Typography variant="caption" sx={styles.hebrewDateSmall}>
//                       {getHebrewDate(day.date)}
//                     </Typography>
//                   </Box>
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {timeSlots.map((timeSlot, timeIndex) => (
//               <TableRow key={timeIndex} sx={timeIndex % 2 === 0 ? styles.evenRow : ''}>
//                 <TableCell sx={styles.timeCell}>
//                   {timeSlot}
//                 </TableCell>
//                 {weekDays.map((day, dayIndex) => {
//                   const eventsAtTime = getEventsAtTime(day, timeSlot);
//                   return (
//                     <TableCell 
//                       key={dayIndex} 
//                       align="center"
//                       sx={`${styles.eventCell} ${day.isToday ? styles.todayCell : ''}`}
//                       onClick={() => eventsAtTime.length > 0 && onDateSelect(day.date)}
//                     >
//                       {eventsAtTime.length > 0 ? (
//                         <Box sx={styles.weeklyEventsContainer}>
//                           {eventsAtTime.map((event, eventIndex) => {
//                             const hasAttendance = hasAttendanceRecord(event, day.date);
//                             return (
//                               <motion.div
//                                 key={eventIndex}
//                                 whileHover={{ scale: 1.03 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 sx={`${styles.weeklyEventCard} ${hasAttendance ? styles.attendanceRecordedCard : ''}`}
//                               >
//                                 <Typography 
//                                   variant="body2" 
//                                   sx={styles.eventTitle}
//                                 >
//                                   {event.courseName || 'חוג'} - {event.groupName}
//                                 </Typography>
//                                 <Box sx={styles.eventDetails}>
//                                   <Box sx={styles.eventDetail}>
//                                     <AccessTime fontSize="small" sx={styles.eventIcon} />
//                                     <Typography variant="caption">
//                                       {event.hour}
//                                     </Typography>
//                                   </Box>
//                                   <Box sx={styles.eventDetail}>
//                                     <LocationOn fontSize="small" sx={styles.eventIcon} />
//                                     <Typography variant="caption">
//                                       {event.branchName || 'סניף'}
//                                     </Typography>
//                                   </Box>
//                                 </Box>
//                                 {hasAttendance && (
//                                   <Chip
//                                     size="small"
//                                     icon={<CheckCircle fontSize="small" />}
//                                     label={`נוכחות: ${hasAttendance.presentCount || 0}`}
//                                     sx={styles.attendanceChip}
//                                   />
//                                 )}
//                               </motion.div>
//                             );
//                           })}
//                         </Box>
//                       ) : null}
//                     </TableCell>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default WeeklyCalendar;
import React, { useState, useEffect } from 'react';
import { 
  Box, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Chip, 
  Tooltip, useMediaQuery, useTheme, Avatar, Badge
} from '@mui/material';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, getMonth } from 'date-fns';
import { he } from 'date-fns/locale';
import { AccessTime, LocationOn, CheckCircle, Event, People, CalendarToday } from '@mui/icons-material';
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

const WeeklyCalendar = ({ currentDate, onDateSelect, events, attendanceRecords }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [weekDays, setWeekDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [monthColors, setMonthColors] = useState({});
  
  // קביעת צבעי החודש הנוכחי
  useEffect(() => {
    const monthIndex = getMonth(currentDate);
    setMonthColors(MONTH_COLORS[monthIndex]);
  }, [currentDate]);
  
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
        isToday: isToday(day),
        hebrewDate: getHebrewDate(day)
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
  
  // Render week header with dates
  const renderWeekHeader = () => {
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
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            שבוע {format(weekDays[0]?.date || currentDate, 'dd/MM')} - {format(weekDays[6]?.date || currentDate, 'dd/MM/yyyy')}
          </Typography>
          <Typography variant="subtitle1">
            {weekDays.reduce((count, day) => count + day.events.length, 0)} פעילויות השבוע
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          {weekDays.map((day, index) => (
            <Tooltip 
              key={index} 
              title={format(day.date, 'EEEE, dd/MM', { locale: he })}
              arrow
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  backgroundColor: day.isToday ? 'white' : `${monthColors.primary}80`,
                  color: day.isToday ? monthColors.primary : 'white',
                  border: day.isToday ? `2px solid white` : 'none',
                  boxShadow: day.isToday ? '0 0 0 2px rgba(255,255,255,0.5)' : 'none',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}
              >
                {day.date.getDate()}
              </Avatar>
            </Tooltip>
          ))}
        </Box>
      </Box>
    );
  };
  
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
  
  return (
    <Box sx={{
      ...styles.weeklyCalendarRoot,
      backgroundColor: monthColors.secondary + '30',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
    }}>
      {renderWeekHeader()}
      
      <TableContainer 
        component={Paper} 
        sx={{
          ...styles.tableContainer,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{
                  ...styles.timeHeaderCell,
                  backgroundColor: monthColors.secondary,
                  color: monthColors.accent,
                  borderBottom: `2px solid ${monthColors.primary}30`,
                  width: '80px',
                  padding: '16px 8px',
                  textAlign: 'center'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  שעה
                </Typography>
              </TableCell>
              {weekDays.map((day, index) => (
                <TableCell 
                  key={index} 
                  align="center"
                  sx={{
                    ...styles.dayHeaderCell,
                    backgroundColor: day.isToday ? `${monthColors.primary}20` : monthColors.secondary,
                    color: monthColors.accent,
                    borderBottom: `2px solid ${day.isToday ? monthColors.primary : monthColors.primary + '30'}`,
                    borderLeft: `1px solid ${monthColors.primary}20`,
                    padding: '12px 8px',
                    minWidth: day.events.length > 0 ? '150px' : '100px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{
                    ...styles.dayHeaderContent,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        ...styles.dayName,
                        color: day.isToday ? monthColors.primary : monthColors.accent,
                        fontWeight: 'bold'
                      }}
                    >
                      {format(day.date, 'EEEE', { locale: he })}
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      backgroundColor: day.isToday ? 'white' : 'transparent',
                      borderRadius: '8px',
                      padding: day.isToday ? '4px 8px' : '0',
                      boxShadow: day.isToday ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: day.isToday ? 'bold' : 'medium',
                          color: day.isToday ? monthColors.primary : 'inherit'
                        }}
                      >
                        {format(day.date, 'd')}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          ...styles.dayDate,
                          color: day.isToday ? monthColors.primary : 'text.secondary'
                        }}
                      >
                        {format(day.date, 'MM/yyyy')}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        ...styles.hebrewDateSmall,
                        color: day.isToday ? monthColors.primary : 'text.secondary',
                        fontWeight: day.isToday ? 'bold' : 'normal'
                      }}
                    >
                      {day.hebrewDate}
                    </Typography>
                    
                    {day.events.length > 0 && (
                      <Chip
                        size="small"
                        icon={<Event fontSize="small" />}
                        label={`${day.events.length} פעילויות`}
                        sx={{
                          marginTop: '4px',
                          backgroundColor: `${monthColors.primary}20`,
                          color: monthColors.accent,
                          fontWeight: 'bold',
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((timeSlot, timeIndex) => (
              <TableRow 
                key={timeIndex} 
                sx={{
                  ...timeIndex % 2 === 0 ? styles.evenRow : {},
                  '&:hover': {
                    backgroundColor: `${monthColors.secondary}30`
                  }
                }}
              >
                <TableCell 
                  sx={{
                    ...styles.timeCell,
                    backgroundColor: `${monthColors.secondary}50`,
                    color: monthColors.accent,
                    borderRight: `1px solid ${monthColors.primary}20`,
                    padding: '8px',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {timeSlot}
                  </Typography>
                </TableCell>
                {weekDays.map((day, dayIndex) => {
                  const eventsAtTime = getEventsAtTime(day, timeSlot);
                  const hasEvents = eventsAtTime.length > 0;
                  
                  return (
                    <TableCell 
                      key={dayIndex} 
                      align="center"
                      sx={{
                        ...styles.eventCell,
                        backgroundColor: day.isToday ? `${monthColors.primary}05` : 'white',
                        borderLeft: `1px solid ${monthColors.primary}20`,
                        borderBottom: `1px solid ${monthColors.primary}10`,
                        padding: hasEvents ? '12px 8px' : '4px',
                        height: hasEvents ? '120px' : '60px',
                        cursor: hasEvents ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        '&:hover': hasEvents ? {
                          backgroundColor: `${monthColors.secondary}30`
                        } : {}
                      }}
                      onClick={() => hasEvents && onDateSelect(day.date)}
                    >
                      {hasEvents ? (
                        <Box sx={{
                          ...styles.weeklyEventsContainer,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          {eventsAtTime.map((event, eventIndex) => {
                            const hasAttendance = hasAttendanceRecord(event, day.date);
                            const courseColor = getColorFromString(event.courseName || 'חוג');
                            
                            return (
                              <motion.div
                                key={eventIndex}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                  backgroundColor: hasAttendance 
                                    ? 'rgba(16, 185, 129, 0.1)' 
                                    : `${courseColor}10`,
                                  borderRadius: '8px',
                                  border: `1px solid ${hasAttendance ? 'rgba(16, 185, 129, 0.3)' : `${courseColor}30`}`,
                                  borderLeft: `4px solid ${hasAttendance ? '#10B981' : courseColor}`,
                                  padding: '10px',
                                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Box sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  marginBottom: '6px'
                                }}>
                                  <Typography 
                                    variant="subtitle2" 
                                    sx={{
                                      fontWeight: 'bold',
                                      color: hasAttendance ? '#065F46' : courseColor,
                                      fontSize: '0.85rem'
                                    }}
                                  >
                                    {event.courseName || 'חוג'} - {event.groupName}
                                  </Typography>
                                  
                                  {hasAttendance && (
                                    <Badge 
                                      badgeContent={
                                        Math.round((hasAttendance.presentCount / hasAttendance.totalCount) * 100) + '%'
                                      } 
                                      color="success"
                                      sx={{
                                        '& .MuiBadge-badge': {
                                          fontSize: '0.65rem',
                                          height: '18px',
                                          minWidth: '18px',
                                          padding: '0 4px'
                                        }
                                      }}
                                    >
                                      <CheckCircle 
                                        fontSize="small" 
                                        sx={{ color: '#10B981' }} 
                                      />
                                    </Badge>
                                  )}
                                </Box>
                                
                                <Box sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '8px'
                                }}>
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                    borderRadius: '4px',
                                    padding: '2px 6px'
                                  }}>
                                    <AccessTime 
                                      fontSize="small" 
                                      sx={{ 
                                        fontSize: '0.8rem', 
                                        marginRight: '4px',
                                        color: 'text.secondary'
                                      }} 
                                    />
                                    <Typography variant="caption">
                                      {event.hour || timeSlot}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                    borderRadius: '4px',
                                    padding: '2px 6px'
                                  }}>
                                    <LocationOn 
                                      fontSize="small" 
                                      sx={{ 
                                        fontSize: '0.8rem', 
                                        marginRight: '4px',
                                        color: 'text.secondary'
                                      }} 
                                    />
                                    <Typography variant="caption">
                                      {event.branchName || 'סניף'}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                {hasAttendance && (
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '6px',
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    borderRadius: '4px',
                                    padding: '3px 6px'
                                  }}>
                                    <People 
                                      fontSize="small" 
                                      sx={{ 
                                        fontSize: '0.8rem', 
                                        marginRight: '4px',
                                        color: '#065F46'
                                      }} 
                                    />
                                    <Typography 
                                      variant="caption"
                                      sx={{ color: '#065F46', fontWeight: 'medium' }}
                                    >
                                      נוכחות: {hasAttendance.presentCount}/{hasAttendance.totalCount}
                                    </Typography>
                                  </Box>
                                )}
                              </motion.div>
                            );
                          })}
                        </Box>
                      ) : (
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                          opacity: 0.3
                        }}>
                          <CalendarToday fontSize="small" color="disabled" />
                        </Box>
                      )}
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

WeeklyCalendar.defaultProps = {
  events: [],
  attendanceRecords: {}
};

export default WeeklyCalendar;
