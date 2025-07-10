import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Chip,
  Tooltip, useMediaQuery, useTheme, Avatar, Badge,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, getMonth } from 'date-fns';
import { he } from 'date-fns/locale';
import { AccessTime, LocationOn, CheckCircle, Event, People, CalendarToday } from '@mui/icons-material';
import { styles } from '../styles/calendarStyles';
import { getGroupsByDay } from '../../../store/group/groupGetByDayThunk';
import { HDate } from '@hebcal/core';

// מערך צבעים לפי חודשים - צבעים נעימים יותר
const MONTH_COLORS = [
  { primary: '#4F86C6', secondary: '#EFF6FF', accent: '#2C5282' },
  { primary: '#E779C1', secondary: '#FCE7F3', accent: '#9D4EDD' },
  { primary: '#48BB78', secondary: '#F0FFF4', accent: '#2F855A' },
  { primary: '#F6AD55', secondary: '#FFFAF0', accent: '#C05621' },
  { primary: '#9F7AEA', secondary: '#F5F3FF', accent: '#6B46C1' },
  { primary: '#FC8181', secondary: '#FFF5F5', accent: '#C53030' },
  { primary: '#4FD1C5', secondary: '#E6FFFA', accent: '#2C7A7B' },
  { primary: '#9AE6B4', secondary: '#F0FFF4', accent: '#38A169' },
  { primary: '#F6AD55', secondary: '#FFFAF0', accent: '#C05621' },
  { primary: '#B794F4', secondary: '#FAF5FF', accent: '#6B46C1' },
  { primary: '#63B3ED', secondary: '#EBF8FF', accent: '#2B6CB0' },
  { primary: '#4FD1C5', secondary: '#E6FFFA', accent: '#2C7A7B' }
];

// שמות החודשים העבריים
const HEBREW_MONTHS = [
  'תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'
];

// פונקציה להמרת תאריך לועזי לעברי - מתוקנת עם hebcal
const getHebrewDate = (date) => {
  try {
    // יצירת תאריך עברי מהתאריך הלועזי
    const hDate = new HDate(date);
    
    // קבלת היום והחודש העברי
    const hebrewDay = hDate.getDate();
    const hebrewMonth = hDate.getMonthName('h'); // 'h' עבור עברית
    
    // המרת מספר היום לגימטריה עברית
    const hebrewDayStr = convertToHebrewNumerals(hebrewDay);
    
    return `${hebrewDayStr} ${hebrewMonth}`;
  } catch (error) {
    console.error('Error converting to Hebrew date:', error);
    // במקרה של שגיאה, החזר תאריך פשוט
    return `${date.getDate()} ${format(date, 'MMMM', { locale: he })}`;
  }
};

// פונקציה להמרת מספרים לגימטריה עברית
const convertToHebrewNumerals = (num) => {
  if (num <= 0 || num > 999) return num.toString();
  
  const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const hundreds = ['', 'ק', 'ר', 'ש', 'ת'];
  
  let result = '';
  
  // מאות
  if (num >= 100) {
    const hundredsDigit = Math.floor(num / 100);
    result += hundreds[hundredsDigit];
    num %= 100;
  }
  
  // עשרות ויחידות
  if (num >= 10) {
    const tensDigit = Math.floor(num / 10);
    result += tens[tensDigit];
    num %= 10;
  }
  
  // יחידות
  if (num > 0) {
    result += ones[num];
  }
  
  // טיפול במקרים מיוחדים (15 = ט"ו, 16 = ט"ז)
  if (result === 'יה') result = 'ט"ו';
  if (result === 'יו') result = 'ט"ז';
  
  // הוספת גרש או גרשיים
  if (result.length === 1) {
    result += "'";
  } else if (result.length > 1) {
    result = result.slice(0, -1) + '"' + result.slice(-1);
  }
  
  return result;
};

// פונקציה לקבלת שם היום בעברית
const getDayOfWeekHebrew = (date) => {
  if (!date) return 'לא צוין';
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return 'תאריך לא תקין';
  
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return days[dateObj.getDay()];
};

// פונקציה לקבלת מידע מורחב על התאריך העברי
const getExtendedHebrewDate = (date) => {
  try {
    const hDate = new HDate(date);
    
    return {
      hebrewDate: getHebrewDate(date),
      hebrewYear: hDate.getFullYear(),
      monthName: hDate.getMonthName('h'),
      dayOfMonth: hDate.getDate(),
      isRoshChodesh: hDate.getDate() === 1,
      isErevRoshChodesh: hDate.getDate() === 29 || hDate.getDate() === 30,
      hebrewDateLong: `${convertToHebrewNumerals(hDate.getDate())} ${hDate.getMonthName('h')} ${convertToHebrewNumerals(hDate.getFullYear())}`
    };
  } catch (error) {
    console.error('Error getting extended Hebrew date:', error);
    return {
      hebrewDate: getHebrewDate(date),
      hebrewYear: null,
      monthName: null,
      dayOfMonth: null,
      isRoshChodesh: false,
      isErevRoshChodesh: false,
      hebrewDateLong: getHebrewDate(date)
    };
  }
};

const WeeklyCalendar = ({ 
  currentDate, 
  onDateSelect, 
  savedAttendanceRecords = {},
  hebrewHolidays = new Map(),
  isActiveDay = () => true,
  getHebrewHolidayInfo = () => null
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [dayGroupsMap, setDayGroupsMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [loadedWeekKey, setLoadedWeekKey] = useState('');

  // Redux state
  const groupsByDay = useSelector(state => state.groups.groupsByDay || []);
  const groupsByDayLoading = useSelector(state => state.groups.groupsByDayLoading || false);

  // מחשב את צבעי החודש הנוכחי - useMemo למניעת יצירה מחדש
  const monthColors = useMemo(() => {
    const monthIndex = getMonth(currentDate);
    return MONTH_COLORS[monthIndex];
  }, [currentDate]);

  // מחשב את ימי השבוע - useMemo למניעת יצירה מחדש
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      const dayGroups = dayGroupsMap.get(dayKey) || [];
      const holidayInfo = getHebrewHolidayInfo(day);
      const extendedHebrewDate = getExtendedHebrewDate(day);
      
      return {
        date: day,
        events: dayGroups,
        isToday: isToday(day),
        hebrewDate: extendedHebrewDate.hebrewDate,
        hebrewDateLong: extendedHebrewDate.hebrewDateLong,
        isRoshChodesh: extendedHebrewDate.isRoshChodesh,
        isErevRoshChodesh: extendedHebrewDate.isErevRoshChodesh,
        isActive: isActiveDay(day),
        holidayInfo,
        isLoading: isLoading
      };
    });
  }, [currentDate, dayGroupsMap, isLoading, isActiveDay, getHebrewHolidayInfo]);

  // מחשב את slots השעות - useMemo למניעת יצירה מחדש
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  // יוצר מפתח ייחודי לשבוע הנוכחי
  const currentWeekKey = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    return format(start, 'yyyy-MM-dd');
  }, [currentDate]);

  // טעינת קבוצות לכל יום בשבוע - רק כשהשבוע משתנה
  useEffect(() => {
    // אם כבר טענו את השבוע הזה, לא צריך לטעון שוב
    if (loadedWeekKey === currentWeekKey || isLoading) {
      return;
    }

    const loadWeekGroups = async () => {
      console.log('🔄 Loading groups for week:', currentWeekKey);
      setIsLoading(true);
      
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      const days = eachDayOfInterval({ start, end });
      
      const newDayGroupsMap = new Map();
      const loadingPromises = [];

      // טען קבוצות לכל יום בשבוע
      for (const day of days) {
        const dayKey = format(day, 'yyyy-MM-dd');
        
        if (!isActiveDay(day)) {
          newDayGroupsMap.set(dayKey, []);
          continue;
        }

        const dayName = getDayOfWeekHebrew(day);
        
        // יצירת Promise לכל יום
        const loadPromise = dispatch(getGroupsByDay(dayName))
          .unwrap()
          .then((result) => {
            console.log(`✅ Loaded ${result?.length || 0} groups for ${dayName} (${dayKey})`);
            newDayGroupsMap.set(dayKey, result || []);
          })
          .catch((error) => {
            console.error(`❌ Failed to load groups for ${dayName}:`, error);
            newDayGroupsMap.set(dayKey, []);
          });
        
        loadingPromises.push(loadPromise);
      }

      // חכה לכל הטעינות
      try {
        await Promise.all(loadingPromises);
        setDayGroupsMap(newDayGroupsMap);
        setLoadedWeekKey(currentWeekKey);
        console.log('✅ Week groups loaded successfully');
      } catch (error) {
        console.error('❌ Error loading week groups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeekGroups();
  }, [currentWeekKey, dispatch, isActiveDay, isLoading, loadedWeekKey, currentDate]);

  // Get events for a specific time slot on a specific day
  const getEventsAtTime = useCallback((day, timeSlot) => {
    if (!day.events || day.events.length === 0) return [];
    
    return day.events.filter(event => {
      if (!event.hour) return false;
      
      const eventHourStr = event.hour.toString();
      const eventHour = eventHourStr.split(':')[0];
      const slotHour = timeSlot.split(':')[0];
      
      return eventHour === slotHour;
    });
  }, []);

  // Check if attendance was recorded for an event
  const hasAttendanceRecord = useCallback((event, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const attendanceKey = `${dateStr}-${event.groupId}`;
    return savedAttendanceRecords[attendanceKey];
  }, [savedAttendanceRecords]);

  // Handle day click
  const handleDayClick = useCallback((day) => {
    console
    console.log('🖱️ Day clicked:', format(day.date, 'yyyy-MM-dd'), getDayOfWeekHebrew(day.date));
    
    if (!day.isActive) {
      console.log('⚠️ Day is not active');
      return;
    }
    
    if (day.events.length === 0) {
      console.log('⚠️ No events for this day');
      return;
    }
    
    onDateSelect(day.date);
  }, [onDateSelect]);

  // Create a simple hash function for consistent colors
  const getColorFromString = useCallback((str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 45%)`;
  }, []);

  // Render week header with dates
  const renderWeekHeader = useCallback(() => {
    const totalEvents = weekDays.reduce((count, day) => count + (day.events?.length || 0), 0);
    
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
            {isLoading ? 'טוען פעילויות...' : `${totalEvents} פעילויות השבוע`}
          </Typography>
          {/* הוספת תאריכים עבריים לכותרת */}
          <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', marginTop: '4px' }}>
            {weekDays[0]?.hebrewDate} - {weekDays[6]?.hebrewDate}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          {weekDays.map((day, index) => (
            <Tooltip
              key={index}
              title={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {format(day.date, 'EEEE, dd/MM/yyyy', { locale: he })}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    {day.hebrewDateLong}
                  </Typography>
                  {day.holidayInfo && (
                    <Typography variant="caption" sx={{ display: 'block', color: '#FFD700' }}>
                      {day.holidayInfo.name}
                    </Typography>
                  )}
                  {day.isRoshChodesh && (
                    <Typography variant="caption" sx={{ display: 'block', color: '#87CEEB' }}>
                      ראש חודש
                    </Typography>
                  )}
                </Box>
              }
              arrow
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: day.isToday ? 'white' : 
                                 !day.isActive ? 'rgba(255,255,255,0.3)' :
                                 day.isRoshChodesh ? 'rgba(135, 206, 235, 0.8)' :
                                 `${monthColors.primary}80`,
                  color: day.isToday ? monthColors.primary : 
                         !day.isActive ? 'rgba(255,255,255,0.7)' :
                         day.isRoshChodesh ? '#1565C0' :
                         'white',
                  border: day.isToday ? `2px solid white` : 
                          day.isRoshChodesh ? `2px solid #87CEEB` :
                          'none',
                  boxShadow: day.isToday ? '0 0 0 2px rgba(255,255,255,0.5)' : 
                            day.isRoshChodesh ? '0 0 0 2px rgba(135, 206, 235, 0.3)' :
                            'none',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  opacity: day.isActive ? 1 : 0.6
                }}
              >
                {isLoading ? (
                  <CircularProgress size={16} sx={{ color: 'inherit' }} />
                ) : (
                  day.date.getDate()
                )}
              </Avatar>
            </Tooltip>
          ))}
        </Box>
      </Box>
    );
  }, [weekDays, monthColors, isLoading, currentDate]);

  // אם עדיין טוען, הצג מסך טעינה
  if (isLoading && weekDays.length === 0) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6">טוען לוח שבועי...</Typography>
      </Box>
    );
  }

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
                    backgroundColor: day.isToday ? `${monthColors.primary}20` : 
                                   !day.isActive ? `${monthColors.secondary}50` :
                                   day.isRoshChodesh ? 'rgba(135, 206, 235, 0.1)' :
                                   monthColors.secondary,
                    color: !day.isActive ? 'text.disabled' : monthColors.accent,
                    borderBottom: `2px solid ${day.isToday ? monthColors.primary : 
                                              day.isRoshChodesh ? '#87CEEB' :
                                              monthColors.primary + '30'}`,
                    borderLeft: `1px solid ${monthColors.primary}20`,
                    padding: '12px 8px',
                    minWidth: day.events?.length > 0 ? '150px' : '100px',
                    transition: 'all 0.3s ease',
                    opacity: day.isActive ? 1 : 0.6,
                    cursor: day.isActive && day.events?.length > 0 ? 'pointer' : 'default'
                  }}
                  onClick={() => handleDayClick(day)}
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
                        color: day.isToday ? monthColors.primary : 
                               !day.isActive ? 'text.disabled' :
                               monthColors.accent,
                        fontWeight: 'bold'
                      }}
                    >
                      {format(day.date, 'EEEE', { locale: he })}
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      backgroundColor: day.isToday ? 'white' : 
                                     day.isRoshChodesh ? 'rgba(135, 206, 235, 0.2)' :
                                     'transparent',
                      borderRadius: '8px',
                      padding: day.isToday || day.isRoshChodesh ? '4px 8px' : '0',
                      boxShadow: day.isToday ? '0 2px 8px rgba(0,0,0,0.1)' : 
                                day.isRoshChodesh ? '0 2px 8px rgba(135, 206, 235, 0.3)' :
                                'none'
                    }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: day.isToday ? 'bold' : 'medium',
                          color: day.isToday ? monthColors.primary : 
                                 day.isRoshChodesh ? '#1565C0' :
                                 !day.isActive ? 'text.disabled' :
                                 'inherit'
                        }}
                      >
                        {format(day.date, 'd')}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          ...styles.dayDate,
                          color: day.isToday ? monthColors.primary : 
                                 day.isRoshChodesh ? '#1565C0' :
                                 !day.isActive ? 'text.disabled' :
                                 'text.secondary'
                        }}
                      >
                        {format(day.date, 'MM/yyyy')}
                      </Typography>
                    </Box>
                    
                    {/* תאריך עברי מסונכרן */}
                    <Typography
                      variant="caption"
                      sx={{
                        ...styles.hebrewDateSmall,
                        color: day.isToday ? monthColors.primary : 
                               day.isRoshChodesh ? '#1565C0' :
                               !day.isActive ? 'text.disabled' :
                               'text.secondary',
                        fontWeight: day.isToday || day.isRoshChodesh ? 'bold' : 'normal',
                        fontSize: '0.65rem',
                        textAlign: 'center',
                        lineHeight: 1.2
                      }}
                    >
                      {day.hebrewDate}
                    </Typography>

                    {/* הצגת ראש חודש */}
                    {day.isRoshChodesh && (
                      <Chip
                        size="small"
                        label="ראש חודש"
                        sx={{
                          marginTop: '2px',
                          backgroundColor: 'rgba(135, 206, 235, 0.3)',
                          color: '#1565C0',
                          fontWeight: 'bold',
                          fontSize: '0.6rem',
                          height: '18px'
                        }}
                      />
                    )}

                    {/* הצגת חג אם יש */}
                    {day.holidayInfo && (
                      <Chip
                        size="small"
                        label={day.holidayInfo.name}
                        sx={{
                          marginTop: '2px',
                          backgroundColor: 'rgba(255, 193, 7, 0.2)',
                          color: '#F57C00',
                          fontWeight: 'bold',
                          fontSize: '0.6rem',
                          height: '20px'
                        }}
                      />
                    )}

                    {/* הצגת מספר פעילויות */}
                    {day.events && day.events.length > 0 && day.isActive && (
                      <Chip
                        size="small"
                        icon={<Event fontSize="small" />}
                        label={`${day.events.length} פעילויות`}
                        sx={{
                          marginTop: '4px',
                          backgroundColor: `${monthColors.primary}20`,
                          color: monthColors.accent,
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: `${monthColors.primary}30`
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDayClick(day);
                        }}
                      />
                    )}

                    {/* הצגת הודעה אם אין פעילויות */}
                    {day.isActive && day.events && day.events.length === 0 && !isLoading && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.6rem',
                          fontStyle: 'italic'
                        }}
                      >
                        אין פעילויות
                      </Typography>
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
                        backgroundColor: day.isToday ? `${monthColors.primary}05` : 
                                       !day.isActive ? `${monthColors.secondary}20` :
                                       day.isRoshChodesh ? 'rgba(135, 206, 235, 0.05)' :
                                       'white',
                        borderLeft: `1px solid ${monthColors.primary}20`,
                        borderBottom: `1px solid ${monthColors.primary}10`,
                        padding: hasEvents ? '12px 8px' : '4px',
                        height: hasEvents ? '120px' : '60px',
                        cursor: hasEvents && day.isActive ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        opacity: day.isActive ? 1 : 0.4,
                        '&:hover': hasEvents && day.isActive ? {
                          backgroundColor: `${monthColors.secondary}30`
                        } : {}
                      }}
                      onClick={() => hasEvents && day.isActive && handleDayClick(day)}
                    >
                      {hasEvents && day.isActive ? (
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
                                  transition: 'all 0.2s ease',
                                  cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDayClick(day);
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
                                      {event.hour ? event.hour.toString() : timeSlot}
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
                      ) : !day.isActive && day.holidayInfo ? (
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                          opacity: 0.6
                        }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#F57C00',
                              fontWeight: 'bold',
                              textAlign: 'center'
                            }}
                          >
                            {day.holidayInfo.name}
                          </Typography>
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

export default WeeklyCalendar;
