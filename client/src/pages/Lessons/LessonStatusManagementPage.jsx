import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  Alert,
  IconButton,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import RestoreIcon from '@mui/icons-material/Restore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBack from '@mui/icons-material/ArrowBack';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import LessonStatusDialogs from './components/LessonStatusDialogs';

import { fetchGroups } from '../../store/group/groupGellAllThunk';
import { cancelLesson } from '../../store/lessons/cancelLesson';
import { cancelAllGroupsForDay } from '../../store/lessons/cancelAllGroupsForDay';
import { getCanceledLessons } from '../../store/lessons/getCanceledLessons';
import { getCanceledLessonsByDate } from '../../store/lessons/getCanceledLessonsByDate';
import { undoCancelLesson } from '../../store/lessons/undoCancelLesson';
import { createCompletionLesson } from '../../store/lessons/createCompletionLesson';
import { markLessonAsCompletion } from '../../store/lessons/markLessonAsCompletion';
import { getCompletionLessons } from '../../store/lessons/getCompletionLessons';
import { getCompletionLessonsByGroupId } from '../../store/lessons/getCompletionLessonsByGroupId';
import { getLessonsByDate } from '../../store/lessons/getLessonsByDate';
import { fetchInstructors } from '../../store/instructor/instructorGetAllThunk';
import { useNavigate } from 'react-router-dom';

const LessonStatusManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { canceledLessons = [], completionLessons = [], lessonsByDate = {}, loading = false, error = null } = useSelector(state => state.lessons || {});
  const groupsState = useSelector(state => state.groups || {});
  const instructorsState = useSelector(state => state.instructors || {});
  const user = useSelector(state => state.users?.currentUser || state.user?.currentUser || null);

  const userName = user ? `${user.firstName} ${user.lastName}` : 'מערכת ניהול שיעורים';
  const groups = groupsState.groups || [];
  const instructors = instructorsState.instructors || [];

  const [tab, setTab] = useState(0);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bulkCancelDialogOpen, setBulkCancelDialogOpen] = useState(false);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [markCompletionDialogOpen, setMarkCompletionDialogOpen] = useState(false);

  const [cancelForm, setCancelForm] = useState({ lessonId: '', lessonDate: null, reason: '', canceledBy: userName });
  const [bulkCancelForm, setBulkCancelForm] = useState({ dayOfWeek: '', date: new Date(), reason: '', createdBy: userName });
  const [completionForm, setCompletionForm] = useState({ groupId: '', completionDate: new Date(), completionHour: '18:00', instructorId: '', createdBy: userName });
  const [markCompletionForm, setMarkCompletionForm] = useState({ lessonId: '', lessonDate: null, markedBy: userName });

  const [canceledDateFilter, setCanceledDateFilter] = useState(null);
  const [completionGroupFilter, setCompletionGroupFilter] = useState('');
  const [undoConfirmOpen, setUndoConfirmOpen] = useState(false);
  const [undoLessonData, setUndoLessonData] = useState(null);

  const groupMap = useMemo(() => {
    const map = new Map();
    groups.forEach(g => map.set(g.groupId, g.groupName));
    return map;
  }, [groups]);

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

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(getCanceledLessons());
    dispatch(getCompletionLessons());
    console.log('📊 סטייט מדריכים בעמוד:', instructors);
  }, [dispatch]);

  // Load instructors if empty
  useEffect(() => {
    if (!instructors || instructors.length === 0) {
      dispatch(fetchInstructors());
    }
  }, [dispatch, instructors]);

  useEffect(() => {
    setCancelForm(prev => ({ ...prev, canceledBy: userName }));
    setBulkCancelForm(prev => ({ ...prev, createdBy: userName }));
    setCompletionForm(prev => ({ ...prev, createdBy: userName }));
    setMarkCompletionForm(prev => ({ ...prev, markedBy: userName }));
  }, [userName]);

  const formatDate = (value) => {
    if (!value) return '---';
    try {
      return new Date(value).toLocaleDateString('he-IL');
    } catch {
      return value;
    }
  };

  const debounceTimerRef = useRef(null);

  const handleRefreshCanceled = useCallback(() => {
    setCanceledDateFilter(null);
    dispatch(getCanceledLessons());
  }, [dispatch]);

  const handleRefreshCompletion = useCallback(() => {
    setCompletionGroupFilter('');
    dispatch(getCompletionLessons());
  }, [dispatch]);

  const handleFetchCanceledByDate = useCallback(() => {
    if (!canceledDateFilter) return;
    const date = format(canceledDateFilter, 'yyyy-MM-dd');
    dispatch(getCanceledLessonsByDate({ date }));
  }, [canceledDateFilter, dispatch]);

  const handleFetchCompletionByGroup = useCallback(() => {
    if (!completionGroupFilter) return;
    dispatch(getCompletionLessonsByGroupId({ groupId: completionGroupFilter }));
  }, [completionGroupFilter, dispatch]);

  const handleCancelLesson = useCallback(async () => {
    if (!cancelForm.lessonId || !cancelForm.reason.trim()) return;
    await dispatch(cancelLesson({
      id: Number(cancelForm.lessonId),
      reason: cancelForm.reason.trim(),
      canceledBy: cancelForm.canceledBy || userName
    }));
    setCancelDialogOpen(false);
    setCancelForm({ lessonId: '', lessonDate: null, reason: '', canceledBy: userName });
    dispatch(getCanceledLessons());
  }, [cancelForm, userName, dispatch]);

  const handleCancelDateChange = useCallback((dateValue) => {
    setCancelForm(prev => ({ ...prev, lessonDate: dateValue, lessonId: '' }));
    if (!dateValue) return;
    
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const date = format(dateValue, 'yyyy-MM-dd');
      dispatch(getLessonsByDate({ date }));
    }, 300);
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const cancelGroupsOptions = useMemo(() => {
    if (!cancelForm.lessonDate) return [];
    const key = format(cancelForm.lessonDate, 'yyyy-MM-dd');
    const list = lessonsByDate[key] || [];
    return list
      .filter(l => (l.lessonStatus || l.status || l.Status) !== 'canceled')
      .sort((a, b) => {
        const cityA = a.city || '';
        const cityB = b.city || '';
        return cityA.localeCompare(cityB, 'he');
      });
  }, [cancelForm.lessonDate, lessonsByDate]);


  const handleBulkCancel = useCallback(async () => {
    if (!bulkCancelForm.dayOfWeek || !bulkCancelForm.reason.trim()) return;
    const date = format(bulkCancelForm.date, 'yyyy-MM-dd');
    await dispatch(cancelAllGroupsForDay({
      dayOfWeek: bulkCancelForm.dayOfWeek,
      date,
      reason: bulkCancelForm.reason.trim(),
      createdBy: bulkCancelForm.createdBy || userName
    }));
    setBulkCancelDialogOpen(false);
    setBulkCancelForm({ dayOfWeek: '', date: new Date(), reason: '', createdBy: userName });
    dispatch(getCanceledLessons());
  }, [bulkCancelForm, userName, dispatch]);

  const handleUndoCancel = useCallback(async (lessonId) => {
    await dispatch(undoCancelLesson({ id: lessonId, undoBy: userName }));
    dispatch(getCanceledLessons());
  }, [userName, dispatch]);

  const handleOpenUndoConfirm = useCallback((lesson) => {
    setUndoLessonData(lesson);
    setUndoConfirmOpen(true);
  }, []);

  const handleConfirmUndo = useCallback(async () => {
    if (undoLessonData) {
      await handleUndoCancel(undoLessonData.lessonId || undoLessonData.id);
      setUndoConfirmOpen(false);
      setUndoLessonData(null);
    }
  }, [undoLessonData, handleUndoCancel]);

  const handleCreateCompletion = useCallback(async () => {
    if (!completionForm.groupId) return;
    const completionDate = format(completionForm.completionDate, 'yyyy-MM-dd');
    await dispatch(createCompletionLesson({
      groupId: Number(completionForm.groupId),
      completionDate,
      completionHour: completionForm.completionHour,
      instructorId: completionForm.instructorId ? Number(completionForm.instructorId) : 0,
      createdBy: completionForm.createdBy || userName
    }));
    setCompletionDialogOpen(false);
    setCompletionForm({ groupId: '', completionDate: new Date(), completionHour: '18:00', instructorId: '', createdBy: userName });
    dispatch(getCompletionLessons());
  }, [completionForm, userName, dispatch]);

  const handleMarkCompletion = useCallback(async () => {
    if (!markCompletionForm.lessonId) return;
    await dispatch(markLessonAsCompletion({
      id: Number(markCompletionForm.lessonId),
      markedBy: markCompletionForm.markedBy || userName
    }));
    setMarkCompletionDialogOpen(false);
    setMarkCompletionForm({ lessonId: '', lessonDate: null, markedBy: userName });
    dispatch(getCompletionLessons());
  }, [markCompletionForm, userName, dispatch]);

  const handleMarkDateChange = useCallback((dateValue) => {
    setMarkCompletionForm(prev => ({ ...prev, lessonDate: dateValue, lessonId: '' }));
    if (!dateValue) return;
    
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const date = format(dateValue, 'yyyy-MM-dd');
      dispatch(getLessonsByDate({ date }));
    }, 300);
  }, [dispatch]);

  const markCompletionLessonOptions = useMemo(() => {
    if (!markCompletionForm.lessonDate) return [];
    const key = format(markCompletionForm.lessonDate, 'yyyy-MM-dd');
    const list = lessonsByDate[key] || [];
    return list
      .filter(l => (l.lessonStatus || l.status || l.Status) !== 'canceled')
      .sort((a, b) => {
        const cityA = a.city || '';
        const cityB = b.city || '';
        return cityA.localeCompare(cityB, 'he');
      });
  }, [markCompletionForm.lessonDate, lessonsByDate]);

  const daysOfWeek = [
    'ראשון',
    'שני',
    'שלישי',
    'רביעי',
    'חמישי',
    'שישי',
    'שבת'
  ];

  const primaryButtonSx = {
    borderRadius: 2,
    px: 3,
    py: 1,
    fontWeight: 'bold',
    '& .MuiButton-startIcon': {
      marginLeft: 8,
      marginRight: 0
    },
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
    background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
      boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)'
    }
  };

  const warnButtonSx = {
    borderRadius: 2,
    px: 3,
    py: 1,
    fontWeight: 'bold',
    '& .MuiButton-startIcon': {
      marginLeft: 8,
      marginRight: 0
    },
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
    background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
      boxShadow: '0 6px 16px rgba(245, 158, 11, 0.35)'
    }
  };

  const dangerButtonSx = {
    borderRadius: 2,
    px: 3,
    py: 1,
    fontWeight: 'bold',
    '& .MuiButton-startIcon': {
      marginLeft: 8,
      marginRight: 0
    },
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
    background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)',
      boxShadow: '0 6px 16px rgba(239, 68, 68, 0.35)'
    }
  };

  const outlinedButtonSx = {
    borderRadius: 2,
    px: 2.5,
    py: 1,
    fontWeight: 'bold',
    '& .MuiButton-startIcon': {
      marginLeft: 8,
      marginRight: 0
    }
  };

  return (
    <Box
      dir="rtl"
      sx={{
        background: 'linear-gradient(to right, #e0f2fe, #f8fafc)',
        minHeight: '100vh',
        borderRadius: 8,
        py: 4
      }}
    >
      <Box sx={{ maxWidth: 1300, mx: 'auto', px: 3, direction: 'rtl' }}>
        <Box sx={{ mt: 1, mb: 2, position: 'relative', minHeight: 44 }}>
          <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/lesson-management')}
              sx={{
                borderRadius: 3,
                borderColor: '#64748B',
                color: '#475569',
                '& .MuiButton-startIcon': {
                  marginLeft: 8,
                  marginRight: 0
                },
                '&:hover': {
                  borderColor: '#1E3A8A',
                  color: '#1E3A8A',
                  background: 'rgba(30, 58, 138, 0.05)'
                }
              }}
            >
               ניהול שיעורים
            </Button>
          </Box>
        </Box>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#1E3A8A',
              mb: 1,
              fontFamily: 'Heebo, sans-serif'
            }}
          >
            ניהול סטטוס שיעורים
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#334155',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            ביטולים והשלמות בממשק אחד נוח ומסודר
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            variant="scrollable"
            allowScrollButtonsMobile
            TabIndicatorProps={{
              sx: {
                height: 3,
                borderRadius: 2,
                background: '#1E3A8A'
              }
            }}
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: 2,
              px: 2,
              py: 0.5,
              minHeight: 56,
              border: '1px solid rgba(226, 232, 240, 0.9)',
              '& .MuiTab-root': {
                outline: 'none',
                boxShadow: 'none'
              },
              '& .MuiTab-root:focus': {
                outline: 'none',
                boxShadow: 'none'
              },
              '& .MuiTab-root:focus-visible': {
                outline: 'none'
              },
              '& .MuiTab-root.Mui-focusVisible': {
                outline: 'none',
                boxShadow: 'none'
              },
              '& .MuiTabs-flexContainer': {
                gap: 1,
                justifyContent: 'flex-start',
                width: '100%'
              }
            }}
          >
            <Tab
              label="ביטול שיעורים"
              disableRipple
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                minHeight: 44,
                px: 3,
                color: '#475569',
                transition: 'background-color 0.1s ease',
                '&:hover': {
                  bgcolor: 'transparent'
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none'
                },
                '&:focus-visible': {
                  outline: 'none'
                },
                '&.Mui-focusVisible': {
                  outline: 'none',
                  boxShadow: 'none'
                },
                '&.Mui-selected': {
                  color: '#1E3A8A'
                }
              }}
            />
            <Tab
              label="השלמת שיעורים"
              disableRipple
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                minHeight: 44,
                px: 3,
                color: '#475569',
                transition: 'background-color 0.1s ease',
                '&:hover': {
                  bgcolor: 'transparent'
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none'
                },
                '&:focus-visible': {
                  outline: 'none'
                },
                '&.Mui-focusVisible': {
                  outline: 'none',
                  boxShadow: 'none'
                },
                '&.Mui-selected': {
                  color: '#1E3A8A'
                }
              }}
            />
          </Tabs>
        </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : 'שגיאה לא ידועה'}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={22} />
          <Typography variant="body2">טוען נתונים...</Typography>
        </Box>
      )}

      {tab === 0 && (
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 26px rgba(15, 23, 42, 0.08)' }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCancelDialogOpen(true)} sx={dangerButtonSx}>
                הוספת ביטול
              </Button>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setBulkCancelDialogOpen(true)} sx={outlinedButtonSx}>
                ביטול לכל הקבוצות ביום
              </Button>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefreshCanceled} sx={outlinedButtonSx}>
                רענון
              </Button>
              <TextField
                label="סינון לפי תאריך"
                type="date"
                size="small"
                sx={{
                  minWidth: 200,
                  '& .MuiOutlinedInput-notchedOutline legend': {
                    textAlign: 'right'
                  }
                }}
                InputLabelProps={{ shrink: true, sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
                inputProps={{ dir: 'rtl' }}
                value={canceledDateFilter ? format(canceledDateFilter, 'yyyy-MM-dd') : ''}
                onChange={(e) => setCanceledDateFilter(e.target.value ? new Date(e.target.value) : null)}
              />
              <Button variant="text" onClick={handleFetchCanceledByDate} sx={{ fontWeight: 'bold' }}>
                שלוף לפי תאריך
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)' }}>
              <Table size="small" sx={{ minWidth: 900 }}>
                <TableHead sx={{ background: '#eff6ff' }}>
                  <TableRow>
                    <TableCell align="right">קוד שיעור</TableCell>
                    <TableCell align="right">קבוצה</TableCell>
                    <TableCell align="right">תאריך</TableCell>
                    <TableCell align="right">שעה</TableCell>
                    <TableCell align="right">סטטוס</TableCell>
                    <TableCell align="right">סיבה</TableCell>
                    <TableCell align="right">בוטל על ידי</TableCell>
                    <TableCell align="right">פעולות</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {canceledLessons.length > 0 ? (
                    canceledLessons.map((lesson, idx) => (
                      <TableRow key={lesson.lessonId || lesson.id || idx}>
                        <TableCell align="right">{lesson.lessonId || lesson.id || '---'}</TableCell>
                        <TableCell align="right">{groupMap.get(lesson.groupId) || lesson.groupId || '---'}</TableCell>
                        <TableCell align="right">{formatDate(lesson.lessonDate)}</TableCell>
                        <TableCell align="right">{lesson.lessonHour || '---'}</TableCell>
                        <TableCell align="right">
                          <Chip label="בוטל" color="error" size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">{lesson.cancellationReason || '---'}</TableCell>
                        <TableCell align="right">{lesson.canceledBy || '---'}</TableCell>
                        <TableCell align="right">
                          <IconButton 
                            onClick={() => handleOpenUndoConfirm(lesson)} 
                            size="small" 
                            sx={{ p: 0.5, color: '#10b981', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
                            title="החזר שיעור לסטטוס רגיל"
                          >
                            <RestoreIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        אין שיעורים בסטטוס ביטול
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 26px rgba(15, 23, 42, 0.08)' }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCompletionDialogOpen(true)} sx={warnButtonSx}>
                הוספת השלמה
              </Button>
              <Button variant="outlined" startIcon={<CheckCircleIcon />} onClick={() => setMarkCompletionDialogOpen(true)} sx={outlinedButtonSx}>
                סימון שיעור כהשלמה
              </Button>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefreshCompletion} sx={outlinedButtonSx}>
                רענון
              </Button>
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>סינון לפי קבוצה</InputLabel>
                <Select
                  label="סינון לפי קבוצה"
                  value={completionGroupFilter}
                  onChange={(e) => setCompletionGroupFilter(e.target.value)}
                  MenuProps={rtlMenuProps}
                  sx={{ direction: 'rtl', textAlign: 'right' }}
                  inputProps={{ dir: 'rtl', style: { textAlign: 'right', direction: 'rtl' } }}
                >
                  <MenuItem value="" sx={{ direction: 'rtl', textAlign: 'center', justifyContent: 'center' }}>
                    ללא סינון
                  </MenuItem>
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
                            px: 1.5
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                            <Typography 
                              component="span" 
                              sx={{ 
                                fontWeight: 'bold', 
                                color: courseColor,
                                minWidth: '50px',
                                fontSize: '0.95rem'
                              }}
                            >
                              {courseName}
                            </Typography>
                            <Typography 
                              component="span" 
                              sx={{ 
                                fontWeight: '600', 
                                color: branchColor,
                                minWidth: '60px',
                                fontSize: '0.9rem'
                              }}
                            >
                              {branchName}
                            </Typography>
                            <Typography component="span" sx={{ color: '#374151', fontSize: '0.9rem' }}>
                              {groupName}
                            </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              <Button variant="text" onClick={handleFetchCompletionByGroup} sx={{ fontWeight: 'bold' }}>
                שלוף לפי קבוצה
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)' }}>
              <Table size="small" sx={{ minWidth: 900 }}>
                <TableHead sx={{ background: '#fff7ed' }}>
                  <TableRow>
                    <TableCell align="right">קוד שיעור</TableCell>
                    <TableCell align="right">קבוצה</TableCell>
                    <TableCell align="right">תאריך</TableCell>
                    <TableCell align="right">שעה</TableCell>
                    <TableCell align="right">מדריך</TableCell>
                    <TableCell align="right">סטטוס</TableCell>
                    <TableCell align="right">נוצר על ידי</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completionLessons.length > 0 ? (
                    completionLessons.map((lesson, idx) => {
                      const instructor = instructors.find(i => i.id === lesson.instructorId);
                      const instructorName = instructor 
                        ? `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() 
                        : '---';
                      return (
                        <TableRow key={lesson.lessonId || lesson.id || idx}>
                          <TableCell align="right">{lesson.lessonId || lesson.id || '---'}</TableCell>
                          <TableCell align="right">{groupMap.get(lesson.groupId) || lesson.groupId || '---'}</TableCell>
                          <TableCell align="right">{formatDate(lesson.lessonDate)}</TableCell>
                          <TableCell align="right">{lesson.lessonHour || '---'}</TableCell>
                          <TableCell align="right">{instructorName}</TableCell>
                          <TableCell align="right">
                            <Chip label="השלמה" color="warning" size="small" variant="outlined" />
                          </TableCell>
                          <TableCell align="right">{lesson.createdBy || '---'}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        אין שיעורים בסטטוס השלמה
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <LessonStatusDialogs
        cancelDialogOpen={cancelDialogOpen}
        onCloseCancel={() => setCancelDialogOpen(false)}
        cancelForm={cancelForm}
        setCancelForm={setCancelForm}
        onCancelLesson={handleCancelLesson}
        onCancelDateChange={handleCancelDateChange}
        cancelGroupsOptions={cancelGroupsOptions}
        bulkCancelDialogOpen={bulkCancelDialogOpen}
        onCloseBulkCancel={() => setBulkCancelDialogOpen(false)}
        bulkCancelForm={bulkCancelForm}
        setBulkCancelForm={setBulkCancelForm}
        onBulkCancel={handleBulkCancel}
        daysOfWeek={daysOfWeek}
        completionDialogOpen={completionDialogOpen}
        onCloseCompletion={() => setCompletionDialogOpen(false)}
        completionForm={completionForm}
        setCompletionForm={setCompletionForm}
        onCreateCompletion={handleCreateCompletion}
        groups={groups}
        instructors={instructors}
        markCompletionDialogOpen={markCompletionDialogOpen}
        onCloseMarkCompletion={() => setMarkCompletionDialogOpen(false)}
        markCompletionForm={markCompletionForm}
        setMarkCompletionForm={setMarkCompletionForm}
        onMarkCompletion={handleMarkCompletion}
        onMarkDateChange={handleMarkDateChange}
        markCompletionLessonOptions={markCompletionLessonOptions}
        dangerButtonSx={dangerButtonSx}
        warnButtonSx={warnButtonSx}
      />

      <Dialog
        open={undoConfirmOpen}
        onClose={() => setUndoConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, direction: 'rtl' } }}
      >
        <DialogTitle sx={{ bgcolor: '#10b981', color: 'white', textAlign: 'center', py: 2, fontWeight: 'bold' }}>
          החזרת שיעור לסטטוס רגיל
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl', textAlign: 'center' }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(16, 185, 129, 0.12)'
              }}
            >
              <RestoreIcon sx={{ fontSize: 35, color: '#10b981' }} />
            </Box>
          </Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            האם אתה בטוח?
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            אתה עומד להחזיר את השיעור:
          </Typography>
          {undoLessonData && (
            <Paper
              elevation={0}
              sx={{
                bgcolor: '#f0fdf4',
                border: '1px solid #d1fae5',
                borderRadius: 2,
                p: 2,
                mb: 2,
                textAlign: 'right'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669' }}>
                <strong>קבוצה:</strong> {groupMap.get(undoLessonData.groupId) || undoLessonData.groupId}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669', mt: 0.5 }}>
                <strong>תאריך:</strong> {formatDate(undoLessonData.lessonDate)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669', mt: 0.5 }}>
                <strong>שעה:</strong> {undoLessonData.lessonHour || '---'}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669', mt: 0.5 }}>
                <strong>סיבת ביטול:</strong> {undoLessonData.cancellationReason || '---'}
              </Typography>
            </Paper>
          )}
          <Typography variant="body2" sx={{ color: '#666' }}>
            השיעור יחזור לסטטוס רגיל וייוחזר לתוכנית ההוראה
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'ltr' }}>
          <Button
            onClick={() => setUndoConfirmOpen(false)}
            variant="outlined"
            sx={{ borderRadius: '8px', px: 3, py: 1 }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleConfirmUndo}
            variant="contained"
            sx={{ borderRadius: '8px', px: 3, py: 1, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
          >
            כן, החזר שיעור
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
};

export default LessonStatusManagementPage;
