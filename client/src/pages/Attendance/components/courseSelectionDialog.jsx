import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Button, IconButton, Grid, Card,
  CardContent, Avatar, Divider, Paper, useMediaQuery, 
  useTheme, Chip, Accordion, AccordionSummary, AccordionDetails, 
  CircularProgress, Badge, LinearProgress
} from '@mui/material';
import {
  Close, School, LocationOn, Group, ExpandMore,
  NavigateNext, AccessTime, EventBusy, Schedule, Today,
  CheckCircle, Cancel, HourglassEmpty, TrendingUp,
  Assessment, Event
} from '@mui/icons-material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { styles } from '../styles/dialogStyles';
import { isMarkedForDate } from '../../../store/attendance/attendanceGetIsMarkedForGroup';
import { useCalendarCancellations } from './useCalendarCancellations';
import { fetchLessonCancellations } from '../../../store/lessonsCancelation/lessonsCancelationGetAll';

const CourseSelectionDialog = ({
  open,
  onClose,
  selectedDate,
  groupsByDay = [],
  groupsByDayLoading = false,
  onGroupSelect
}) => {
  // console.log('🏗️ CourseSelectionDialog rendered with props:', {
  //   open,
  //   selectedDate,
  //   groupsByDayCount: groupsByDay?.length || 0,
  //   onGroupSelectType: typeof onGroupSelect
  // });

  // כל ה-hooks צריכים להיות בתחילת הקומפוננטה
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State hooks
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [checkingAttendance, setCheckingAttendance] = useState(new Set());
  const [attendanceChecked, setAttendanceChecked] = useState(false);

  // Redux selectors
  const attendanceMarkedStatus = useSelector(state => state.attendances?.attendanceMarkedStatus || {});
  const attendanceCheckLoading = useSelector(state => state.attendances?.attendanceCheckLoading || false);

  // Cancellation hooks
  const {
    getCancellationForGroupAndDate,
    getCancellationsForDate,
    hasAnyCancellationsOnDate,
    getCancellationCountForDate
  } = useCalendarCancellations();

  // פונקציות עזר
  const getAttendanceStatus = (groupId) => {
    if (!selectedDate) return null;
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const key = `${groupId}-${dateString}`;
    
    return attendanceMarkedStatus[key];
  };

  const isCheckingAttendanceForGroup = (groupId) => {
    return checkingAttendance.has(groupId);
  };

  const getGroupCancellation = (groupId) => {
    if (!selectedDate) return null;
    return getCancellationForGroupAndDate(groupId, selectedDate);
  };

  // ארגון הקבוצות לפי חוג וסניף
  const organizedGroups = useMemo(() => {
    if (!groupsByDay || groupsByDay.length === 0) return {};

    const organized = {};

    groupsByDay.forEach(group => {
      const courseName = group.courseName || group.couresName || 'חוג לא ידוע';
      const branchAddress = group.branchAddress || group.address || group.branchName || 'כתובת לא ידועה';

      if (!organized[courseName]) {
        organized[courseName] = {};
      }

      if (!organized[courseName][branchAddress]) {
        organized[courseName][branchAddress] = [];
      }

      organized[courseName][branchAddress].push(group);
    });

    return organized;
  }, [groupsByDay]);

  // חישוב סטטיסטיקות כלליות
  const overallStats = useMemo(() => {
    if (!selectedDate || !groupsByDay.length) {
      return { marked: 0, unmarked: 0, checking: 0, unknown: 0, cancelled: 0, total: 0 };
    }

    return groupsByDay.reduce((stats, group) => {
      const cancellation = getGroupCancellation(group.groupId);
      const attendanceStatus = getAttendanceStatus(group.groupId);
      const isChecking = isCheckingAttendanceForGroup(group.groupId);
      
      if (cancellation) {
        stats.cancelled++;
      } else if (isChecking) {
        stats.checking++;
      } else if (attendanceStatus === true) {
        stats.marked++;
      } else if (attendanceStatus === false) {
        stats.unmarked++;
      } else {
        stats.unknown++;
      }
      stats.total++;
      return stats;
    }, { marked: 0, unmarked: 0, checking: 0, unknown: 0, cancelled: 0, total: 0 });
  }, [groupsByDay, attendanceMarkedStatus, checkingAttendance, selectedDate]);

  // Effects
  useEffect(() => {
    if (open) {
      setExpandedCourse(null);
      setCheckingAttendance(new Set());
      setAttendanceChecked(false);
      dispatch(fetchLessonCancellations());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (open && selectedDate && groupsByDay.length > 0 && !groupsByDayLoading && !attendanceChecked) {
      console.log('🔍 Auto-checking attendance for all groups on dialog open');
      checkAttendanceForAllGroups();
    }
  }, [open, selectedDate, groupsByDay, groupsByDayLoading, attendanceChecked]);

  const checkAttendanceForAllGroups = async () => {
    if (!selectedDate || !groupsByDay.length) return;

    console.log('🔄 Starting attendance check for all groups');
    setAttendanceChecked(true);

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const newCheckingSet = new Set();
    
    groupsByDay.forEach(group => {
      const groupId = group.groupId;
      const key = `${groupId}-${dateString}`;
      
      if (attendanceMarkedStatus[key] === undefined) {
        newCheckingSet.add(groupId);
      }
    });
    
    setCheckingAttendance(newCheckingSet);

    const checkPromises = Array.from(newCheckingSet).map(async (groupId) => {
      try {
        console.log(`🔍 Checking attendance for group ${groupId} on ${dateString}`);
        await dispatch(isMarkedForDate({ 
          groupId, 
          date: dateString 
        })).unwrap();
        
        console.log(`✅ Attendance check completed for group ${groupId}`);
        
        setCheckingAttendance(prev => {
          const newSet = new Set(prev);
          newSet.delete(groupId);
          return newSet;
        });
        
      } catch (error) {
        console.error(`❌ Failed to check attendance for group ${groupId}:`, error);
        
        setCheckingAttendance(prev => {
          const newSet = new Set(prev);
          newSet.delete(groupId);
          return newSet;
        });
      }
    });

    await Promise.allSettled(checkPromises);
    
    console.log('✅ All attendance checks completed');
  };

  const handleGroupClick = async (group) => {
    console.log('🖱️ Group card clicked:', group);
    
    const cancellation = getGroupCancellation(group.groupId);
    if (cancellation) {
      console.log('⚠️ Cannot select cancelled lesson:', cancellation);
      return;
    }
    
    if (onGroupSelect && typeof onGroupSelect === 'function') {
      try {
        console.log('✅ Calling onGroupSelect with group:', group);
        await onGroupSelect(group);
        
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
        
      } catch (error) {
        console.error('❌ Error calling onGroupSelect:', error);
        alert('שגיאה: לא ניתן לבחור קבוצה זו');
      }
    } else {
      console.error('❌ onGroupSelect is not available or not a function');
      alert('שגיאה: לא ניתן לבחור קבוצה זו');
    }
  };

  const handleAccordionChange = (courseName) => (event, isExpanded) => {
    setExpandedCourse(isExpanded ? courseName : null);
  };

  const getCourseColor = (courseName) => {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
    ];
    
    let hash = 0;
    for (let i = 0; i < courseName.length; i++) {
      hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // בדיקת תקינות תאריך מוקדמת
  if (!selectedDate) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth 
        sx={{
          direction:'rtl',
          '& .MuiDialog-paper': {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            שגיאה
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
          <Typography variant="h6">לא נבחר תאריך תקין</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={onClose}
            variant="contained"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
              borderRadius: 3,
              px: 4
            }}
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Render functions
  const renderDialogTitle = () => {
    const formattedDate = format(selectedDate, 'EEEE, d MMMM yyyy', { locale: he });
    const dayName = format(selectedDate, 'EEEE', { locale: he });
    const dateHasCancellations = hasAnyCancellationsOnDate(selectedDate);
    const cancellationCount = getCancellationCountForDate(selectedDate);

    return (
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              width: 56,
              height: 56,
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              <Today sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                mb: 0.5
              }}>
                חוגים ביום {dayName}
              </Typography>
              <Typography variant="subtitle1" sx={{ 
                opacity: 0.9,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}>
                {formattedDate}
              </Typography>
              
              {dateHasCancellations && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Cancel sx={{ fontSize: 18, color: '#ffcdd2' }} />
                  <Typography variant="caption" sx={{ 
                    color: '#ffcdd2', 
                    fontWeight: 'bold',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}>
                    {cancellationCount} ביטולי שיעורים
                  </Typography>
                </Box>
              )}
              
              {checkingAttendance.size > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <CircularProgress size={16} thickness={4} sx={{ color: 'rgba(255,255,255,0.8)' }} />
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}>
                    בודק נוכחות עבור {checkingAttendance.size} קבוצות...
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
    );
  };

  const renderLoadingState = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
      gap: 3,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: 3,
      margin: 2
    }}>
      <CircularProgress 
        size={60} 
        thickness={4} 
        sx={{ 
          color: '#667eea',
          filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))'
        }} 
      />
      <Typography variant="h6" sx={{ 
        color: '#475569',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        טוען חוגים...
      </Typography>
      <Typography variant="body2" sx={{ 
        color: '#64748b',
        textAlign: 'center',
        maxWidth: 300
      }}>
        אנא המתן בזמן שאנו טוענים את רשימת החוגים עבור התאריך שנבחר
      </Typography>
    </Box>
  );

  const renderEmptyState = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
      gap: 3,
      background: 'linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%)',
      borderRadius: 3,
      margin: 2,
      border: '2px dashed #c084fc',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }
    }}>
      <Avatar sx={{
        width: 80,
        height: 80,
        backgroundColor: '#c084fc',
        background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
        boxShadow: '0 8px 32px rgba(192, 132, 252, 0.3)',
        position: 'relative',
        zIndex: 1
      }}>
        <EventBusy sx={{ fontSize: 40 }} />
      </Avatar>
      <Typography variant="h5" sx={{ 
        color: '#7c3aed',
        fontWeight: 'bold',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        אין חוגים מתוכננים ליום זה
      </Typography>
      <Typography variant="body1" sx={{ 
        color: '#8b5cf6',
        textAlign: 'center',
        maxWidth: 400,
        position: 'relative',
        zIndex: 1
      }}>
        {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: he })}
      </Typography>
    </Box>
  );

  const renderStatsBar = () => (
    <Paper sx={{
      p: 3,
      mb: 3,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: 3,
      border: '1px solid rgba(102, 126, 234, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Assessment sx={{ color: '#667eea', fontSize: 24 }} />
        <Typography variant="h6" sx={{ 
          fontWeight: 'bold',
          color: '#1e293b',
          flex: 1
        }}>
          סטטוס נוכחות
        </Typography>
        <Chip
          label={`${overallStats.total} קבוצות`}
          sx={{
            backgroundColor: '#667eea',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: 2
          }}
        />
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={6} sm={2.4}>
          <Box sx={{
            textAlign: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(76, 175, 80, 0.15)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
            }
          }}>
            <CheckCircle sx={{ color: '#4caf50', fontSize: 28, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              {overallStats.marked}
            </Typography>
            <Typography variant="caption" sx={{ color: '#388e3c', fontWeight: 'medium' }}>
              נקבעה
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={6} sm={2.4}>
          <Box sx={{
            textAlign: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            border: '1px solid rgba(255, 152, 0, 0.2)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 152, 0, 0.15)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(255, 152, 0, 0.2)'
            }
          }}>
            <HourglassEmpty sx={{ color: '#ff9800', fontSize: 28, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
              {overallStats.unmarked}
            </Typography>
            <Typography variant="caption" sx={{ color: '#ef6c00', fontWeight: 'medium' }}>
              לא נקבעה
            </Typography>
          </Box>
        </Grid>
        
        {overallStats.cancelled > 0 && (
          <Grid item xs={6} sm={2.4}>
            <Box sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.15)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)'
              }
            }}>
              <Cancel sx={{ color: '#f44336', fontSize: 28, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {overallStats.cancelled}
              </Typography>
              <Typography variant="caption" sx={{ color: '#c62828', fontWeight: 'medium' }}>
                בוטלו
              </Typography>
            </Box>
          </Grid>
        )}
        
        {overallStats.checking > 0 && (
          <Grid item xs={6} sm={2.4}>
            <Box sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              border: '1px solid rgba(33, 150, 243, 0.2)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.15)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
              }
            }}>
              <CircularProgress size={28} thickness={4} sx={{ color: '#2196f3', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {overallStats.checking}
              </Typography>
              <Typography variant="caption" sx={{ color: '#1565c0', fontWeight: 'medium' }}>
                בודק
              </Typography>
            </Box>
          </Grid>
        )}
        
        <Grid item xs={6} sm={2.4}>
          <Box sx={{
            textAlign: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.15)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
            }
          }}>
            <Group sx={{ color: '#667eea', fontSize: 28, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#5a67d8' }}>
              {overallStats.total}
            </Typography>
            <Typography variant="caption" sx={{ color: '#4c51bf', fontWeight: 'medium' }}>
              סה"כ
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderGroupCard = (group) => {
    const attendanceStatus = getAttendanceStatus(group.groupId);
    const isChecking = isCheckingAttendanceForGroup(group.groupId);
    const cancellation = getGroupCancellation(group.groupId);
    const isCancelled = !!cancellation;
    
    let statusColor = '#64748b';
    let statusBgColor = 'rgba(100, 116, 139, 0.1)';
    let statusIcon = <Schedule />;
    let statusText = 'לא נבדק';
    
    if (isCancelled) {
      statusColor = '#dc2626';
      statusBgColor = 'rgba(220, 38, 38, 0.1)';
      statusIcon = <Cancel />;
      statusText = 'בוטל';
    } else if (isChecking) {
      statusColor = '#2563eb';
      statusBgColor = 'rgba(37, 99, 235, 0.1)';
      statusIcon = <CircularProgress size={16} thickness={4} sx={{ color: '#2563eb' }} />;
      statusText = 'בודק...';
    } else if (attendanceStatus === true) {
      statusColor = '#16a34a';
      statusBgColor = 'rgba(22, 163, 74, 0.1)';
      statusIcon = <CheckCircle />;
      statusText = 'נקבעה';
    } else if (attendanceStatus === false) {
      statusColor = '#ea580c';
      statusBgColor = 'rgba(234, 88, 12, 0.1)';
      statusIcon = <HourglassEmpty />;
      statusText = 'לא נקבעה';
    }

    return (
      <motion.div
        key={group.groupId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: isCancelled ? 1 : 1.02 }}
        whileTap={{ scale: isCancelled ? 1 : 0.98 }}
      >
        <Card sx={{
          mb: 2,
          cursor: isCancelled ? 'not-allowed' : 'pointer',
          opacity: isCancelled ? 0.7 : 1,
          borderRadius: 3,
          border: '2px solid',
          borderColor: isCancelled ? '#fca5a5' : '#e2e8f0',
          background: isCancelled 
            ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: isCancelled 
            ? '0 4px 12px rgba(220, 38, 38, 0.15)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: isCancelled 
              ? 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)'
              : `linear-gradient(90deg, ${statusColor} 0%, ${statusColor}aa 100%)`,
            opacity: isCancelled ? 1 : 0,
            transition: 'opacity 0.3s ease'
          },
          '&:hover::before': {
            opacity: 1
          },
          '&:hover': {
            borderColor: isCancelled ? '#fca5a5' : statusColor,
            boxShadow: isCancelled 
              ? '0 4px 12px rgba(220, 38, 38, 0.15)'
              : `0 8px 25px ${statusColor}33`,
            transform: isCancelled ? 'none' : 'translateY(-2px)'
          }
        }}
        onClick={() => !isCancelled && handleGroupClick(group)}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Avatar sx={{
              width: 56,
              height: 56,
              background: isCancelled 
                ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                : `linear-gradient(135deg, ${getCourseColor(group.courseName || group.couresName)} 0%, ${getCourseColor(group.courseName || group.couresName)}dd 100%)`,
              boxShadow: isCancelled 
                ? '0 4px 12px rgba(220, 38, 38, 0.3)'
                : `0 4px 12px ${getCourseColor(group.courseName || group.couresName)}44`,
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {isCancelled ? (
                <Cancel sx={{ fontSize: 28 }} />
              ) : (
                (group.courseName || group.couresName || 'ח').charAt(0)
              )}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{
                  fontWeight: 'bold',
                  color: isCancelled ? '#dc2626' : '#1e293b',
                  textDecoration: isCancelled ? 'line-through' : 'none'
                }}>
                  קבוצה {group.groupName}
                </Typography>
                
                <Chip
                  icon={statusIcon}
                  label={statusText}
                  size="small"
                  sx={{
                    backgroundColor: statusBgColor,
                    color: statusColor,
                    fontWeight: 'bold',
                    border: `1px solid ${statusColor}33`,
                    '& .MuiChip-icon': {
                      color: statusColor
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime sx={{ fontSize: 16, color: '#64748b' }} />
                  <Typography variant="body2" color="text.secondary">
                    {group.hour || 'שעה לא צוינה'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16, color: '#64748b' }} />
                  <Typography variant="body2" color="text.secondary">
                    {group.branchName || 'סניף לא ידוע'}
                  </Typography>
                </Box>
              </Box>

              {isCancelled && cancellation && (
                <Box sx={{
                  p: 2,
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  borderRadius: 2,
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  mb: 2
                }}>
                  <Typography variant="body2" sx={{ 
                    color: '#dc2626',
                    fontWeight: 'bold',
                    mb: 0.5
                  }}>
                    סיבת הביטול:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f1d1d' }}>
                    {cancellation.reason || 'לא צוינה סיבה'}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  חוג: {group.courseName || group.couresName || 'לא ידוע'}
                </Typography>
                
                {!isCancelled && (
                  <NavigateNext sx={{ 
                    fontSize: 16, 
                    color: '#64748b',
                    transition: 'transform 0.2s ease',
                    transform: 'translateX(0)',
                    '.MuiCard-root:hover &': {
                      transform: 'translateX(-4px)'
                    }
                  }} />
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
    );
  };

  const renderCourseAccordion = (courseName, branches) => {
    const courseColor = getCourseColor(courseName);
    const isExpanded = expandedCourse === courseName;
    
    // חישוב סטטיסטיקות לחוג
    const courseGroups = Object.values(branches).flat();
    const courseStats = courseGroups.reduce((stats, group) => {
      const cancellation = getGroupCancellation(group.groupId);
      const attendanceStatus = getAttendanceStatus(group.groupId);
      const isChecking = isCheckingAttendanceForGroup(group.groupId);
      
      if (cancellation) {
        stats.cancelled++;
      } else if (isChecking) {
        stats.checking++;
      } else if (attendanceStatus === true) {
        stats.marked++;
      } else if (attendanceStatus === false) {
        stats.unmarked++;
      } else {
        stats.unknown++;
      }
      stats.total++;
      return stats;
    }, { marked: 0, unmarked: 0, checking: 0, unknown: 0, cancelled: 0, total: 0 });

    return (
      <Accordion
        key={courseName}
        expanded={isExpanded}
        onChange={handleAccordionChange(courseName)}
        sx={{
          mb: 2,
          borderRadius: '16px !important',
          border: '2px solid',
          borderColor: isExpanded ? courseColor : '#e2e8f0',
          boxShadow: isExpanded 
            ? `0 8px 25px ${courseColor}33`
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          background: isExpanded
            ? `linear-gradient(135deg, ${courseColor}11 0%, ${courseColor}05 100%)`
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:before': {
            display: 'none'
          },
          '&.Mui-expanded': {
            margin: '0 0 16px 0'
          }
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMore sx={{ 
              color: isExpanded ? courseColor : '#64748b',
              transition: 'all 0.3s ease'
            }} />
          }
          sx={{
            p: 3,
            minHeight: 'auto !important',
            '&.Mui-expanded': {
              minHeight: 'auto !important'
            },
            '& .MuiAccordionSummary-content': {
              margin: '0 !important',
              '&.Mui-expanded': {
                margin: '0 !important'
              }
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
            <Avatar sx={{
              width: 64,
              height: 64,
              background: `linear-gradient(135deg, ${courseColor} 0%, ${courseColor}dd 100%)`,
              boxShadow: `0 4px 12px ${courseColor}44`,
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}>
              <School sx={{ fontSize: 32 }} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 1
              }}>
                {courseName}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`${courseStats.total} קבוצות`}
                  size="small"
                  sx={{
                    backgroundColor: `${courseColor}22`,
                    color: courseColor,
                    fontWeight: 'bold',
                    border: `1px solid ${courseColor}44`
                  }}
                />
                
                {courseStats.marked > 0 && (
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: 14 }} />}
                    label={`${courseStats.marked} נקבעה`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(22, 163, 74, 0.1)',
                      color: '#16a34a',
                      fontWeight: 'bold',
                      border: '1px solid rgba(22, 163, 74, 0.2)'
                    }}
                  />
                )}
                
                {courseStats.unmarked > 0 && (
                  <Chip
                    icon={<HourglassEmpty sx={{ fontSize: 14 }} />}
                    label={`${courseStats.unmarked} לא נקבעה`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(234, 88, 12, 0.1)',
                      color: '#ea580c',
                      fontWeight: 'bold',
                      border: '1px solid rgba(234, 88, 12, 0.2)'
                    }}
                  />
                )}
                
                {courseStats.cancelled > 0 && (
                  <Chip
                    icon={<Cancel sx={{ fontSize: 14 }} />}
                    label={`${courseStats.cancelled} בוטל`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      color: '#dc2626',
                      fontWeight: 'bold',
                      border: '1px solid rgba(220, 38, 38, 0.2)'
                    }}
                  />
                )}
                
                {courseStats.checking > 0 && (
                  <Chip
                    icon={<CircularProgress size={12} thickness={4} sx={{ color: '#2563eb' }} />}
                    label={`${courseStats.checking} בודק`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      fontWeight: 'bold',
                      border: '1px solid rgba(37, 99, 235, 0.2)'
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0, pb: 2 }}>
          <Box sx={{ px: 3 }}>
            <Divider sx={{ 
              mb: 3, 
              borderColor: `${courseColor}33`,
              borderWidth: 1
            }} />
            
            {Object.entries(branches).map(([branchName, branchGroups]) => (
              <Box key={branchName} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{
                  fontWeight: 'bold',
                  color: '#475569',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <LocationOn sx={{ fontSize: 20, color: courseColor }} />
                  סניף {branchName}
                  <Chip
                    label={`${branchGroups.length} קבוצות`}
                    size="small"
                    sx={{
                      backgroundColor: `${courseColor}11`,
                      color: courseColor,
                      fontWeight: 'bold',
                      mr: 1
                    }}
                  />
                </Typography>
                
                <Box sx={{ pl: 2 }}>
                  {branchGroups.map(group => renderGroupCard(group))}
                </Box>
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  // Main render
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        direction: 'rtl',
        '& .MuiDialog-paper': {
          borderRadius: 4,
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }
      }}
    >
      {renderDialogTitle()}

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {groupsByDayLoading ? (
            renderLoadingState()
          ) : !groupsByDay || groupsByDay.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {renderStatsBar()}
              
              <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
                {Object.entries(organizedGroups).map(([courseName, branches]) =>
                  renderCourseAccordion(courseName, branches)
                )}
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderTop: '1px solid #e2e8f0',
        gap: 2
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            borderColor: '#cbd5e1',
            color: '#475569',
            fontWeight: 'bold',
                      '&:hover': {
              borderColor: '#94a3b8',
              backgroundColor: 'rgba(71, 85, 105, 0.05)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(71, 85, 105, 0.15)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          סגור
        </Button>
        
        {!groupsByDayLoading && groupsByDay && groupsByDay.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
              בחר קבוצה לרישום נוכחות
            </Typography>
            
            {checkingAttendance.size > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} thickness={4} sx={{ color: '#667eea' }} />
                <Typography variant="caption" color="text.secondary">
                  בודק נוכחות...
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CourseSelectionDialog;
 
