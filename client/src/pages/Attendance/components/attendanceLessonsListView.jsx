import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
  Pagination
} from '@mui/material';
import { format, isBefore, isAfter, isEqual, startOfDay } from 'date-fns';
import { he } from 'date-fns/locale';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EventIcon from '@mui/icons-material/Event';
import TodayIcon from '@mui/icons-material/Today';
import HistoryIcon from '@mui/icons-material/History';
import ChecklistIcon from '@mui/icons-material/Checklist';

const CITY_COLORS = ['#2563eb', '#0ea5e9', '#14b8a6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const BRANCH_COLORS = ['#0284c7', '#06b6d4', '#10b981', '#84cc16', '#f59e0b', '#f97316', '#d946ef', '#7c3aed'];
const COURSE_COLORS = ['#1d4ed8', '#0f766e', '#15803d', '#b45309', '#be123c', '#6d28d9', '#0f766e', '#334155'];

const normalizeLabel = (value, fallback) => {
  const text = String(value ?? '').trim();
  return text || fallback;
};

const getColorByKey = (key = '', palette = CITY_COLORS) => {
  const normalized = String(key || 'default').toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
};

const AttendanceLessonsListView = ({
  lessons = [],
  branches = [],
  loading = false,
  onReportAttendance
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [showOnlyOverdueUnreported, setShowOnlyOverdueUnreported] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(1);

  const today = startOfDay(new Date());

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const branchMatch = selectedBranchId === 'all' || String(lesson.branchId || '') === String(selectedBranchId);
      const dateMatch = !selectedDate || lesson.lessonDate === selectedDate;
      const overdueUnreported = isBefore(new Date(lesson.lessonDate), today) && !lesson.isReported && lesson.lessonStatus !== 'canceled';
      const overdueMatch = !showOnlyOverdueUnreported || overdueUnreported;

      return branchMatch && dateMatch && overdueMatch;
    });
  }, [lessons, selectedBranchId, selectedDate, showOnlyOverdueUnreported, today]);

  const sortedLessons = useMemo(() => {
    return [...filteredLessons].sort((a, b) => {
      const dateA = String(a.lessonDate || '');
      const dateB = String(b.lessonDate || '');
      const dateCompare = dateA.localeCompare(dateB);
      if (dateCompare !== 0) return dateCompare;

      const hourA = String(a.hour || '');
      const hourB = String(b.hour || '');
      return hourA.localeCompare(hourB);
    });
  }, [filteredLessons]);

  const totalPages = Math.max(1, Math.ceil(sortedLessons.length / rowsPerPage));

  useEffect(() => {
    setPage(1);
  }, [selectedBranchId, selectedDate, showOnlyOverdueUnreported, rowsPerPage]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedLessons = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return sortedLessons.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedLessons, page, rowsPerPage]);

  const getStatusChip = (lesson) => {
    const lessonDay = startOfDay(new Date(lesson.lessonDate));

    if (lesson.lessonStatus === 'canceled') {
      return <Chip icon={<EventBusyIcon />} label="בוטל" size="small" sx={{ backgroundColor: 'rgba(220,38,38,0.12)', color: '#b91c1c' }} />;
    }

    if (lesson.lessonStatus === 'completion') {
      return <Chip icon={<AutorenewIcon />} label="השלמה" size="small" sx={{ backgroundColor: 'rgba(234,88,12,0.12)', color: '#c2410c' }} />;
    }

    if (isAfter(lessonDay, today)) {
      return <Chip icon={<EventIcon />} label="עתידי" size="small" sx={{ backgroundColor: 'rgba(37,99,235,0.12)', color: '#1d4ed8' }} />;
    }

    if (isEqual(lessonDay, today)) {
      return <Chip icon={<TodayIcon />} label="היום" size="small" sx={{ backgroundColor: 'rgba(14,165,233,0.12)', color: '#0369a1' }} />;
    }

    return <Chip icon={<HistoryIcon />} label="עבר" size="small" sx={{ backgroundColor: 'rgba(100,116,139,0.14)', color: '#334155' }} />;
  };

  return (
    <Box sx={{ direction: 'rtl' }}>
      <Paper
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)',
          border: '1px solid rgba(99,102,241,0.16)'
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <FormControl fullWidth size="small">
            <InputLabel id="attendance-branch-filter-label">סניף</InputLabel>
            <Select
              labelId="attendance-branch-filter-label"
              value={selectedBranchId}
              label="סניף"
              onChange={(e) => setSelectedBranchId(e.target.value)}
              sx={{
                '& .MuiSelect-select': {
                  textAlign: 'right'
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    direction: 'rtl'
                  }
                },
                MenuListProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      textAlign: 'right',
                      justifyContent: 'flex-start'
                    }
                  }
                }
              }}
            >
              <MenuItem value="all">כל הסניפים</MenuItem>
              {branches.map((branch) => (
                <MenuItem key={branch.branchId} value={String(branch.branchId)}>
                  {branch.name || branch.city || `סניף ${branch.branchId}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            type="date"
            label="תאריך"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <FormControlLabel
            control={(
              <Switch
                checked={showOnlyOverdueUnreported}
                onChange={(e) => setShowOnlyOverdueUnreported(e.target.checked)}
                color="warning"
              />
            )}
            label="רק שיעורים שטרם דווחו ועבר זמנם"
            sx={{ whiteSpace: 'nowrap', mr: 0 }}
          />
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
              רשימת שיעורים לדיווח נוכחות
            </Typography>
            <Stack direction="row" spacing={2.25} alignItems="center" >
              
                <FormControl size="small" sx={{ minWidth: 132 }}>
                  <Select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    renderValue={(value) => `מציג: ${value}`}
                    sx={{
                      borderRadius: 999,
                      backgroundColor: '#f1f5f9',
                      fontWeight: 700,
                      color: '#1f2937',
                      '& .MuiSelect-select': {
                        py: 0.55,
                        px: 1.25,
                        textAlign: 'right'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#dbe4ef'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#93c5fd'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: { direction: 'rtl' }
                      },
                      MenuListProps: {
                        sx: {
                          '& .MuiMenuItem-root': {
                            textAlign: 'right',
                            justifyContent: 'flex-start'
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value={20}>20 להצגה</MenuItem>
                    <MenuItem value={50}>50 להצגה</MenuItem>
                    <MenuItem value={100}>100 להצגה</MenuItem>
                  </Select>
                </FormControl>
              <Chip icon={<ChecklistIcon />} label={`סה\"כ: ${filteredLessons.length} שיעורים`} color="primary" variant="outlined" />
            </Stack>
          </Stack>
        </Box>

        {filteredLessons.length === 0 ? (
          <Box sx={{ p: 3 }}>
            {loading ? (
              <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="center" sx={{ py: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>
                  טוען נתונים, אנא המתן...
                </Typography>
              </Stack>
            ) : (
              <Alert severity="info">לא נמצאו שיעורים לפי הסינון שנבחר.</Alert>
            )}
          </Box>
        ) : (
          <Box sx={{ p: 1.5 }}>
            {loading && (
              <Alert
                severity="info"
                sx={{ mb: 1.25, alignItems: 'center' }}
                icon={<CircularProgress size={16} />}
              >
                מתבצעת טעינת נתונים. הרשימה נשארת מוצגת עד לסיום העדכון.
              </Alert>
            )}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '120px 170px 1fr 180px' },
                gap: 1,
                px: 1.25,
                py: 1.1,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
                border: '1px solid #dbe4ef',
                mb: 1,
                color: '#475569',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                '& > *': {
                  justifySelf: 'stretch',
                  textAlign: { xs: 'right', md: 'center' }
                }
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', fontSize: '0.9rem', lineHeight: 1.2 }}>סטטוס</Typography>

              <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', fontSize: '0.9rem', lineHeight: 1.2 }}>חוג / סניף / עיר</Typography>

              <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', fontSize: '0.9rem', lineHeight: 1.2 }}>פרטי שיעור</Typography>

              <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', fontSize: '0.9rem', lineHeight: 1.2 }}>פעולה</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {paginatedLessons.map((lesson, index) => {
                const absoluteIndex = (page - 1) * rowsPerPage + index;
                const cityName = normalizeLabel(lesson.city || lesson.branchName, 'עיר לא ידועה');
                const branchName = normalizeLabel(lesson.branchName, 'סניף לא ידוע');
                const courseName = normalizeLabel(lesson.courseName, 'חוג לא ידוע');

                const cityColor = getColorByKey(cityName, CITY_COLORS);
                const courseColor = getColorByKey(courseName, COURSE_COLORS);

                const metaRows = [
                  { kind: 'course', label: courseName, prefix: 'חוג' },
                  { kind: 'branch', label: branchName, prefix: 'סניף' },
                  { kind: 'city', label: cityName, prefix: 'עיר' }
                ].filter((item, itemIndex, arr) => {
                  const normalized = item.label.toLowerCase().trim();
                  return arr.findIndex((x) => x.label.toLowerCase().trim() === normalized) === itemIndex;
                });

                const isOverdueUnreported =
                  isBefore(new Date(lesson.lessonDate), today)
                  && !lesson.isReported
                  && lesson.lessonStatus !== 'canceled';

                return (
                  <Box
                    key={`${lesson.lessonId || absoluteIndex}-${lesson.groupId}-${lesson.lessonDate}`}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '120px 170px 1fr 180px' },
                      gap: 1,
                      alignItems: 'center',
                      px: 1.5,
                      py: 1.1,
                      borderRadius: 1.5,
                      border: '1px solid #e2e8f0',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: isOverdueUnreported
                        ? 'rgba(254,243,199,0.4)'
                        : absoluteIndex % 2 === 0
                          ? '#ffffff'
                          : '#f8fafc'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 7,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1
                      }}
                    >
                      <Tooltip title={`חוג: ${courseName}`} placement="left" arrow>
                        <Box sx={{ flex: 1, backgroundColor: courseColor }} />
                      </Tooltip>
                      <Tooltip title={`עיר: ${cityName}`} placement="left" arrow>
                        <Box sx={{ flex: 1, backgroundColor: cityColor }} />
                      </Tooltip>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'center' }, gap: 0.75, flexWrap: 'wrap' }}>
                      {getStatusChip(lesson)}
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        alignItems: { xs: 'flex-start', md: 'center' }
                      }}
                    >
                      {metaRows.map((meta) => (
                        <Stack
                          key={`${lesson.lessonId || absoluteIndex}-${meta.kind}`}
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          justifyContent={{ xs: 'flex-start', md: 'center' }}
                        >
                          <Typography
                            variant={meta.kind === 'course' ? 'body2' : 'caption'}
                            sx={{
                              color: meta.kind === 'course' ? '#0f172a' : '#475569',
                              fontWeight: meta.kind === 'course' ? 700 : 500,
                              textAlign: { xs: 'right', md: 'center' }
                            }}
                          >
                            {meta.prefix}: {meta.label}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>

                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 0.25 }}>
                        {lesson.groupName || 'קבוצה לא ידועה'}
                      </Typography>
                      {(lesson.notes || lesson.Notes) && (
                        <Typography
                          variant="caption"
                          sx={{ color: '#475569', display: 'block', mb: 0.25, whiteSpace: 'pre-wrap' }}
                        >
                          {lesson.notes || lesson.Notes}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: '#475569' }}>
                        {format(new Date(lesson.lessonDate), 'EEEE, d MMMM yyyy', { locale: he })} | שעה: {lesson.hour || 'לא צוינה'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' } }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => onReportAttendance?.(lesson)}
                        disabled={lesson.lessonStatus === 'canceled'}
                        sx={{ borderRadius: 2, px: 1.75 }}
                      >
                        דווח נוכחות
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, nextPage) => setPage(nextPage)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AttendanceLessonsListView;
