import React, { useCallback, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Paper,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { Info as InfoIcon, Cancel as CancelIcon, Add as AddIcon, CheckCircle as CheckCircleIcon, Delete as DeleteIcon } from '@mui/icons-material';

const LessonStatusDialogs = ({
  cancelDialogOpen,
  onCloseCancel,
  cancelForm,
  setCancelForm,
  onCancelLesson,
  onCancelDateChange,
  cancelGroupsOptions,
  bulkCancelDialogOpen,
  onCloseBulkCancel,
  bulkCancelForm,
  setBulkCancelForm,
  onBulkCancel,
  daysOfWeek,
  completionDialogOpen,
  onCloseCompletion,
  completionForm,
  setCompletionForm,
  onCreateCompletion,
  groups = [],
  instructors = [],
  markCompletionDialogOpen,
  onCloseMarkCompletion,
  markCompletionForm,
  setMarkCompletionForm,
  onMarkCompletion,
  onMarkDateChange,
  markCompletionLessonOptions,
  deleteCompletionOpen,
  onCloseDeleteCompletion,
  onConfirmDeleteCompletion,
  deleteCompletionData,
  groupMap,
  formatDate,
  outlinedButtonSx,
  dangerButtonSx,
  warnButtonSx
}) => {
  const rtlLabelSx = {
    '& .MuiInputLabel-root': {
      right: 24,
      left: 'auto',
      transformOrigin: 'top right',
      textAlign: 'right'
    },
    '& .MuiOutlinedInput-notchedOutline legend': {
      textAlign: 'right',
      marginLeft: 'auto',
      marginRight: 0
    }
  };

  const rtlMenuProps = {
    PaperProps: {
      sx: {
        direction: 'rtl !important',
        '& .MuiMenuItem-root': {
          direction: 'rtl !important',
          textAlign: 'right !important',
          justifyContent: 'right !important'
        }
      }
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right'
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'right'
    }
  };

  const getCityColor = (city) => {
    const colors = {
      'אשדוד': '#3B82F6',
      'תל אביב': '#10B981',
      'ירושלים': '#F59E0B',
      'חיפה': '#8B5CF6',
      'באר שבע': '#EF4444',
      'רחובות': '#EC4899',
      'פתח תקווה': '#14B8A6',
      'נתניה': '#F97316',
      'ראשון לציון': '#06B6D4',
      'חולון': '#84CC16',
      'בני ברק': '#6366F1',
      'רמת גן': '#A855F7'
    };
    return colors[city] || '#64748B';
  };

  const getCourseColor = (course) => {
    const colors = {
      'מכינה': '#8B5CF6',
      'א': '#3B82F6',
      'ב': '#10B981',
      'ג': '#F59E0B',
      'ד': '#EF4444',
      'ה': '#EC4899',
      'ו': '#14B8A6',
      'פרטי': '#F97316',
      'קבוצתי': '#06B6D4',
      'מבוגרים': '#84CC16'
    };
    const courseKey = Object.keys(colors).find(key => course?.includes(key));
    return courseKey ? colors[courseKey] : '#64748B';
  };

  const getBranchColor = (branch) => {
    const colors = {
      'גור': '#8B5CF6',
      'ויז': '#3B82F6',
      'ויזניץ': '#3B82F6',
      'בעלזא': '#10B981',
      'ראשון': '#F59E0B',
      'רמלה': '#EF4444',
      'אשדוד': '#EC4899',
      'כללי': '#14B8A6',
      'מרכז': '#F97316'
    };
    const branchKey = Object.keys(colors).find(key => branch?.includes(key));
    return branchKey ? colors[branchKey] : '#64748B';
  };

  const pickLessonField = (lesson, keys, fallback = '') => {
    for (const key of keys) {
      const value = lesson?.[key];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return value;
      }
    }
    return fallback;
  };

  const handleCancelReasonChange = useCallback((e) => {
    setCancelForm(prev => ({ ...prev, reason: e.target.value }));
  }, [setCancelForm]);

  const handleCancelUserChange = useCallback((e) => {
    setCancelForm(prev => ({ ...prev, canceledBy: e.target.value }));
  }, [setCancelForm]);

  const handleCancelLessonIdChange = useCallback((e) => {
    setCancelForm(prev => ({ ...prev, lessonId: e.target.value }));
  }, [setCancelForm]);

  const handleBulkDayChange = useCallback((e) => {
    setBulkCancelForm(prev => ({ ...prev, dayOfWeek: e.target.value }));
  }, [setBulkCancelForm]);

  const handleBulkDateChange = useCallback((value) => {
    setBulkCancelForm(prev => ({ ...prev, date: value }));
  }, [setBulkCancelForm]);

  const handleBulkReasonChange = useCallback((e) => {
    setBulkCancelForm(prev => ({ ...prev, reason: e.target.value }));
  }, [setBulkCancelForm]);

  const handleBulkUserChange = useCallback((e) => {
    setBulkCancelForm(prev => ({ ...prev, createdBy: e.target.value }));
  }, [setBulkCancelForm]);

  const handleCompletionGroupChange = useCallback((e) => {
    setCompletionForm(prev => ({ ...prev, groupId: e.target.value }));
  }, [setCompletionForm]);

  // Log groups when available
  useEffect(() => {
    if (completionDialogOpen && groups && groups.length > 0) {
      console.log('👥 קבוצות זמינות בהוספת השלמה:', groups);
    }
  }, [completionDialogOpen, groups]);

  // Log instructors when available
  useEffect(() => {
    if (completionDialogOpen) {
      console.log('👨‍🏫 מדריכים בדיאלוג:', instructors);
      console.log('📊 מספר מדריכים:', instructors?.length || 0);
    }
  }, [completionDialogOpen, instructors]);

  const handleCompletionDateChange = useCallback((value) => {
    setCompletionForm(prev => ({ ...prev, completionDate: value }));
  }, [setCompletionForm]);

  const handleCompletionHourChange = useCallback((e) => {
    setCompletionForm(prev => ({ ...prev, completionHour: e.target.value }));
  }, [setCompletionForm]);

  const handleCompletionInstructorChange = useCallback((e) => {
    setCompletionForm(prev => ({ ...prev, instructorId: e.target.value }));
  }, [setCompletionForm]);

  const handleCompletionUserChange = useCallback((e) => {
    setCompletionForm(prev => ({ ...prev, createdBy: e.target.value }));
  }, [setCompletionForm]);

  const handleMarkLessonIdChange = useCallback((e) => {
    setMarkCompletionForm(prev => ({ ...prev, lessonId: e.target.value }));
  }, [setMarkCompletionForm]);

  const handleMarkUserChange = useCallback((e) => {
    setMarkCompletionForm(prev => ({ ...prev, markedBy: e.target.value }));
  }, [setMarkCompletionForm]);

  const handleMarkDateChange = useCallback((value) => {
    onMarkDateChange(value);
  }, [onMarkDateChange]);

  const handleMarkLessonChange = useCallback((e) => {
    setMarkCompletionForm(prev => ({ ...prev, lessonId: e.target.value }));
  }, [setMarkCompletionForm]);

  useEffect(() => {
    if (markCompletionLessonOptions && markCompletionLessonOptions.length > 0) {
      console.log('📚 שיעורים שנטענו בסימון השלמה:', markCompletionLessonOptions);
    }
  }, [markCompletionLessonOptions]);

  return (
    <>
      <Dialog
        open={cancelDialogOpen}
        onClose={onCloseCancel}
        fullWidth
        maxWidth="sm"
        dir="rtl"
        PaperProps={{ sx: { borderRadius: 2, direction: 'rtl', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ bgcolor: '#ef4444', color: 'white', textAlign: 'center', py: 2 }}>
          הוספת ביטול שיעור
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
          <Box sx={{ mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(239, 68, 68, 0.12)'
              }}
            >
              <CancelIcon sx={{ fontSize: 35, color: '#ef4444' }} />
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#059669',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <InfoIcon sx={{ fontSize: 18 }} />
              הנתונים נשמרים אוטומטית - ניתן לחזור ולהמשיך בהמשך
            </Typography>
          </Paper>

          <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField
            margin="dense"
            label="תאריך שיעור"
            type="date"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
            InputLabelProps={{ shrink: true, sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            inputProps={{ dir: 'rtl' }}
            value={cancelForm.lessonDate ? format(cancelForm.lessonDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => onCancelDateChange(e.target.value ? new Date(e.target.value) : null)}
          />
          <FormControl fullWidth sx={{ ...rtlLabelSx, '& .MuiOutlinedInput-root': { direction: 'rtl' }, '& .MuiSelect-select': { textAlign: 'right', direction: 'rtl' } }}>
            <InputLabel>שיעור</InputLabel>
            <Select
              label="שיעור"
              value={cancelForm.lessonId}
              onChange={handleCancelLessonIdChange}
              inputProps={{ dir: 'rtl', style: { textAlign: 'right', direction: 'rtl' } }}
              disabled={!cancelForm.lessonDate || cancelGroupsOptions.length === 0}
              sx={{ direction: 'rtl', textAlign: 'right' }}
              MenuProps={rtlMenuProps}
            >
              {cancelGroupsOptions.map((lesson) => {
                const lessonId = lesson.lessonId || lesson.id;
                const groupName = pickLessonField(lesson, ['groupName', 'GroupName'], '---');
                const locationName = pickLessonField(
                  lesson,
                  ['city', 'City', 'branchName', 'BranchName'],
                  'ללא סניף'
                );
                const locationColor = getCityColor(locationName);
                return (
                  <MenuItem 
                    key={lessonId} 
                    value={lessonId} 
                    sx={{ 
                      direction: 'rtl', 
                      textAlign: 'right', 
                      justifyContent: 'right',
                      borderRight: `4px solid ${locationColor}`,
                      mb: 0.5
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Typography 
                        component="span" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: locationColor,
                          minWidth: '80px'
                        }}
                      >
                        {locationName}
                      </Typography>
                      <Typography component="span" sx={{ color: '#374151' }}>
                        {groupName}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            label="סיבה"
            value={cancelForm.reason}
            onChange={handleCancelReasonChange}
            sx={rtlLabelSx}
            inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
            InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            fullWidth
          />
          <TextField
            label="בוטל על ידי"
            value={cancelForm.canceledBy}
            onChange={handleCancelUserChange}
            sx={rtlLabelSx}
            inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
            InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            fullWidth
          />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'ltr' }}>
          <Button
            onClick={onCloseCancel}
            variant="outlined"
            color="error"
            sx={{ borderRadius: '8px', px: 3, py: 1, borderWidth: '2px' }}
          >
            סגור
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px', px: 3, py: 1, bgcolor: '#ef4444', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)' }}
            onClick={onCancelLesson}
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={bulkCancelDialogOpen}
        onClose={onCloseBulkCancel}
        fullWidth
        maxWidth="sm"
        dir="rtl"
        PaperProps={{ sx: { borderRadius: 2, direction: 'rtl', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ bgcolor: '#ef4444', color: 'white', textAlign: 'center', py: 2 }}>
          ביטול לכל הקבוצות ביום
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
          <Box sx={{ mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(239, 68, 68, 0.12)'
              }}
            >
              <CancelIcon sx={{ fontSize: 35, color: '#ef4444' }} />
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#059669',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <InfoIcon sx={{ fontSize: 18 }} />
              ניתן לבטל את כל הקבוצות ביום מסוים בפעולה אחת
            </Typography>
          </Paper>

          <Box sx={{ display: 'grid', gap: 2 }}>
          <FormControl fullWidth sx={rtlLabelSx}>
            <InputLabel>יום בשבוע</InputLabel>
            <Select
              label="יום בשבוע"
              value={bulkCancelForm.dayOfWeek}
              onChange={handleBulkDayChange}
              inputProps={{ dir: 'rtl', style: { textAlign: 'right', direction: 'rtl' } }}
              sx={{ direction: 'rtl', textAlign: 'right' }}
              MenuProps={rtlMenuProps}
            >
              {daysOfWeek.map(day => (
                <MenuItem key={day} value={day} sx={{ direction: 'rtl', textAlign: 'center', justifyContent: 'center' }}>{day}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="תאריך"
            type="date"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
            InputLabelProps={{ shrink: true, sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            inputProps={{ dir: 'rtl' }}
            value={bulkCancelForm.date ? format(bulkCancelForm.date, 'yyyy-MM-dd') : ''}
            onChange={(e) => handleBulkDateChange(e.target.value ? new Date(e.target.value) : null)}
          />
          <TextField
            label="סיבה"
            value={bulkCancelForm.reason}
            onChange={handleBulkReasonChange}
            sx={rtlLabelSx}
            inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
            InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            fullWidth
          />
          <TextField
            label="נוצר על ידי"
            value={bulkCancelForm.createdBy}
            onChange={handleBulkUserChange}
            sx={rtlLabelSx}
            inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
            InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            fullWidth
          />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'ltr' }}>
          <Button
            onClick={onCloseBulkCancel}
            variant="outlined"
            color="error"
            sx={{ borderRadius: '8px', px: 3, py: 1, borderWidth: '2px' }}
          >
            סגור
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px', px: 3, py: 1, bgcolor: '#ef4444', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)' }}
            onClick={onBulkCancel}
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={completionDialogOpen}
        onClose={onCloseCompletion}
        fullWidth
        maxWidth="sm"
        dir="rtl"
        PaperProps={{ sx: { borderRadius: 2, direction: 'rtl', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ bgcolor: '#f59e0b', color: 'white', textAlign: 'center', py: 2 }}>
          הוספת שיעור השלמה
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
          <Box sx={{ mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(245, 158, 11, 0.12)'
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 35, color: '#f59e0b' }} />
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#059669',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <InfoIcon sx={{ fontSize: 18 }} />
              הוספת שיעור השלמה תתווסף להיסטוריית הקבוצה
            </Typography>
          </Paper>

          <Box sx={{ display: 'grid', gap: 2 }}>
          <FormControl fullWidth sx={{ ...rtlLabelSx, '& .MuiOutlinedInput-root': { direction: 'rtl' }, '& .MuiSelect-select': { textAlign: 'right', direction: 'rtl' } }}>
            <InputLabel>קבוצה</InputLabel>
            <Select
              label="קבוצה"
              value={completionForm.groupId}
              onChange={handleCompletionGroupChange}
              inputProps={{ dir: 'rtl', style: { textAlign: 'right', direction: 'rtl' } }}
              sx={{ direction: 'rtl', textAlign: 'right' }}
              MenuProps={rtlMenuProps}
            >
              {groups
                .slice()
                .sort((a, b) => {
                  const courseA = a.courseName || a.CourseName || '';
                  const courseB = b.courseName || b.CourseName || '';
                  const branchA = a.branchName || a.BranchName || '';
                  const branchB = b.branchName || b.BranchName || '';
                  
                  const courseCompare = courseA.localeCompare(courseB, 'he');
                  if (courseCompare !== 0) return courseCompare;
                  
                  return branchA.localeCompare(branchB, 'he');
                })
                .map(g => {
                  const courseName = g.courseName || g.CourseName || '';
                  const branchName = g.branchName || g.BranchName || '';
                  const groupName = g.groupName || g.GroupName || '';
                  const courseColor = getCourseColor(courseName);
                  const branchColor = getBranchColor(branchName);
                  
                  return (
                    <MenuItem 
                      key={g.groupId} 
                      value={g.groupId} 
                      sx={{ 
                        direction: 'rtl', 
                        textAlign: 'right', 
                        justifyContent: 'right',
                        borderRight: `4px solid ${courseColor}`,
                        borderLeft: `4px solid ${branchColor}`,
                        mb: 0.5,
                        px: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                        <Typography 
                          component="span" 
                          sx={{ 
                            fontWeight: 'bold', 
                            color: courseColor,
                            minWidth: '60px',
                            fontSize: '0.9rem'
                          }}
                        >
                          {courseName}
                        </Typography>
                        <Typography 
                          component="span" 
                          sx={{ 
                            fontWeight: '600', 
                            color: branchColor,
                            minWidth: '70px',
                            fontSize: '0.85rem'
                          }}
                        >
                          {branchName}
                        </Typography>
                        <Typography component="span" sx={{ color: '#374151', fontSize: '0.85rem' }}>
                          {groupName}
                        </Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="תאריך"
            type="date"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
            InputLabelProps={{ shrink: true, sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            inputProps={{ dir: 'rtl' }}
            value={completionForm.completionDate ? format(completionForm.completionDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => handleCompletionDateChange(e.target.value ? new Date(e.target.value) : null)}
          />
          <TextField
            label="שעה"
            type="time"
            value={completionForm.completionHour}
            onChange={handleCompletionHourChange}
            sx={rtlLabelSx}
            inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
            InputLabelProps={{ shrink: true, sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            fullWidth
          />
          <FormControl fullWidth sx={{ ...rtlLabelSx, '& .MuiOutlinedInput-root': { direction: 'rtl' }, '& .MuiSelect-select': { textAlign: 'right', direction: 'rtl' } }}>
            <InputLabel>מדריך</InputLabel>
            <Select
              label="מדריך"
              value={completionForm.instructorId}
              onChange={handleCompletionInstructorChange}
              inputProps={{ dir: 'rtl', style: { textAlign: 'right', direction: 'rtl' } }}
              sx={{ direction: 'rtl', textAlign: 'right' }}
              MenuProps={rtlMenuProps}
            >
              <MenuItem value="" sx={{ direction: 'rtl', textAlign: 'center', justifyContent: 'center' }}>
                בחר מדריך
              </MenuItem>
              {instructors.map(instructor => {
                const instructorId = instructor.id;
                const firstName = instructor.firstName || '';
                const lastName = instructor.lastName || '';
                const fullName = `${firstName} ${lastName}`.trim();
                return (
                  <MenuItem 
                    key={instructorId} 
                    value={instructorId}
                    sx={{ 
                      direction: 'rtl', 
                      textAlign: 'right', 
                      justifyContent: 'right',
                      mb: 0.5
                    }}
                  >
                    <Typography component="span" sx={{ color: '#374151', fontSize: '0.9rem' }}>
                      {fullName}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Paper
            elevation={0}
            sx={{
              bgcolor: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: 2,
              p: 1.5,
              textAlign: 'right'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#1e40af',
                fontWeight: 500,
                fontSize: '0.85rem',
                lineHeight: 1.5
              }}
            >
              💡 ניתן לבחור מדריך אחר לצורך ההשלמה החד-פעמית ושאר השיעורים יישארו עם המדריך שנבחר לקבוצה. ניתן להשאיר שדה זה ריק ואז יירשם שהמדריך שביצע את השלמת השיעור הוא המדריך הרגיל המשוייך לקבוצה.
            </Typography>
          </Paper>
          <TextField
            label="נוצר על ידי"
            value={completionForm.createdBy}
            onChange={handleCompletionUserChange}
            sx={rtlLabelSx}
            inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
            InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            fullWidth
          />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'ltr' }}>
          <Button
            onClick={onCloseCompletion}
            variant="outlined"
            color="error"
            sx={{ borderRadius: '8px', px: 3, py: 1, borderWidth: '2px' }}
          >
            סגור
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px', px: 3, py: 1, bgcolor: '#f59e0b', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)' }}
            onClick={onCreateCompletion}
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={markCompletionDialogOpen}
        onClose={onCloseMarkCompletion}
        fullWidth
        maxWidth="sm"
        dir="rtl"
        PaperProps={{ sx: { borderRadius: 2, direction: 'rtl', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ bgcolor: '#f59e0b', color: 'white', textAlign: 'center', py: 2 }}>
          סימון שיעור כהשלמה
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
          <Box sx={{ mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(245, 158, 11, 0.12)'
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 35, color: '#f59e0b' }} />
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#059669',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <InfoIcon sx={{ fontSize: 18 }} />
              ניתן לסמן שיעור קיים כהשלמה
            </Typography>
          </Paper>

          <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField
            margin="dense"
            label="תאריך שיעור"
            type="date"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
            InputLabelProps={{ shrink: true, sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            inputProps={{ dir: 'rtl' }}
            value={markCompletionForm.lessonDate ? format(markCompletionForm.lessonDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => handleMarkDateChange(e.target.value ? new Date(e.target.value) : null)}
          />
          <FormControl fullWidth sx={{ ...rtlLabelSx, '& .MuiOutlinedInput-root': { direction: 'rtl' }, '& .MuiSelect-select': { textAlign: 'right', direction: 'rtl' } }}>
            <InputLabel>שיעור</InputLabel>
            <Select
              label="שיעור"
              value={markCompletionForm.lessonId}
              onChange={handleMarkLessonChange}
              inputProps={{ dir: 'rtl', style: { textAlign: 'right', direction: 'rtl' } }}
              disabled={!markCompletionForm.lessonDate || markCompletionLessonOptions.length === 0}
              sx={{ direction: 'rtl', textAlign: 'right' }}
              MenuProps={rtlMenuProps}
            >
              {markCompletionLessonOptions.map((lesson) => {
                const lessonId = lesson.lessonId || lesson.id;
                const groupName = pickLessonField(lesson, ['groupName', 'GroupName'], '---');
                const locationName = pickLessonField(
                  lesson,
                  ['city', 'City', 'branchName', 'BranchName'],
                  'ללא סניף'
                );
                const locationColor = getCityColor(locationName);
                return (
                  <MenuItem 
                    key={lessonId} 
                    value={lessonId} 
                    sx={{ 
                      direction: 'rtl', 
                      textAlign: 'right', 
                      justifyContent: 'right',
                      borderRight: `4px solid ${locationColor}`,
                      mb: 0.5
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Typography 
                        component="span" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: locationColor,
                          minWidth: '80px'
                        }}
                      >
                        {locationName}
                      </Typography>
                      <Typography component="span" sx={{ color: '#374151' }}>
                        {groupName}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            label="סומן על ידי"
            value={markCompletionForm.markedBy}
            onChange={handleMarkUserChange}
            sx={rtlLabelSx}
            inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
            InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            fullWidth
          />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'ltr' }}>
          <Button
            onClick={onCloseMarkCompletion}
            variant="outlined"
            color="error"
            sx={{ borderRadius: '8px', px: 3, py: 1, borderWidth: '2px' }}
          >
            סגור
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{ borderRadius: '8px', px: 3, py: 1, bgcolor: '#f59e0b', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)' }}
            onClick={onMarkCompletion}
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteCompletionOpen}
        onClose={onCloseDeleteCompletion}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, direction: 'rtl' } }}
      >
        <DialogTitle sx={{ bgcolor: '#dc2626', color: 'white', textAlign: 'center', py: 2, fontWeight: 'bold' }}>
          מחיקת שיעור השלמה
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl', textAlign: 'center' }}>
          <Box sx={{ mb: 3, mt: 1.5, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(220, 38, 38, 0.12)'
              }}
            >
              <DeleteIcon sx={{ fontSize: 35, color: '#dc2626' }} />
            </Box>
          </Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            האם ברצונך למחוק את ההשלמה הזו?
          </Typography>
          {deleteCompletionData && (
            <Paper
              elevation={0}
              sx={{
                bgcolor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 2,
                p: 2,
                mb: 2,
                textAlign: 'right'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#b91c1c' }}>
                <strong>קבוצה:</strong> {groupMap?.get(deleteCompletionData.groupId) || deleteCompletionData.groupId}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#b91c1c', mt: 0.5 }}>
                <strong>תאריך:</strong> {formatDate ? formatDate(deleteCompletionData.lessonDate) : deleteCompletionData.lessonDate}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#b91c1c', mt: 0.5 }}>
                <strong>שעה:</strong> {deleteCompletionData.lessonHour || '---'}
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center', gap: 1 }}>
          <Button variant="outlined" onClick={onCloseDeleteCompletion} sx={outlinedButtonSx}>
            ביטול
          </Button>
          <Button variant="contained" onClick={onConfirmDeleteCompletion} sx={dangerButtonSx}>
            כן, למחוק
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LessonStatusDialogs;
