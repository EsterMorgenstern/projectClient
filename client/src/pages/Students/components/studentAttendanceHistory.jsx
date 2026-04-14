import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceHistory } from '../../../store/attendance/fetchAttendanceHistory';
import { fetchStudentAttendanceSummary } from '../../../store/attendance/fetchStudentAttendanceSummary';
import { getAllUsers } from '../../../store/user/userGetAllThunk';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import {
  CalendarToday,
  CheckCircle,
  Cancel,
  School,
  Person,
  DateRange,
  History as HistoryIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

import { motion } from 'framer-motion';
import { deleteAttendance } from '../../../store/attendance/attendanceDeleteThunk';
import { batchUpdateAttendances } from '../../../store/attendance/batchUpdateAttendances';
import { checkUserPermission } from '../../../utils/permissions';

const getRecordValue = (record, keys) => {
  for (const key of keys) {
    if (record?.[key] !== undefined && record?.[key] !== null && record?.[key] !== '') {
      return record[key];
    }
  }
  return null;
};

const formatColumnLabel = (key) => {
  const labels = {
    attendanceId: 'מזהה נוכחות',
    AttendanceId: 'מזהה נוכחות',
    studentId: 'מזהה תלמיד',
    StudentId: 'מזהה תלמיד',
    lessonId: 'מזהה שיעור',
    LessonId: 'מזהה שיעור',
    date: 'תאריך',
    Date: 'תאריך',
    dateReport: 'תאריך דיווח',
    DateReport: 'תאריך דיווח',
    lessonDate: 'תאריך שיעור',
    LessonDate: 'תאריך שיעור',
    courseName: 'קורס',
    CourseName: 'קורס',
    groupName: 'קבוצה',
    GroupName: 'קבוצה',
    branchName: 'סניף',
    BranchName: 'סניף',
    instructorName: 'מדריך',
    InstructorName: 'מדריך',
    lessonTime: 'שעה',
    LessonTime: 'שעה',
    wasPresent: 'נוכחות',
    WasPresent: 'נוכחות',
    isPresent: 'נוכחות',
    IsPresent: 'נוכחות',
    statusReport: 'סטטוס דיווח',
    StatusReport: 'סטטוס דיווח',
    healthFundReport: 'קופת חולים',
    HealthFundReport: 'קופת חולים',
    updateDate: 'תאריך עדכון',
    UpdateDate: 'תאריך עדכון',
    updateBy: 'עודכן על ידי',
    UpdateBy: 'עודכן על ידי',
    groupId: 'מזהה קבוצה',
    GroupId: 'מזהה קבוצה'
  };

  if (labels[key]) {
    return labels[key];
  }

  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim();
};

const isDateLikeKey = (key) => /^date|date$/i.test(key);

const parseStatusReport = (value) => {
  const numeric = Number(value);
  return Number.isInteger(numeric) ? numeric : null;
};

const getStatusLabel = (status) => {
  if (status === 1) return 'דווח';
  if (status === 2) return 'לא לדיווח';
  if (status === 3) return 'ממתין לדיווח';
  return 'לא ידוע';
};

const parsePresenceValue = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
    return null;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'present', 'כן'].includes(normalized)) return true;
    if (['false', '0', 'no', 'absent', 'לא'].includes(normalized)) return false;
  }

  return null;
};

const renderPresenceChip = (isPresent, embedded) => (
  <Chip
    icon={isPresent ? <CheckCircle sx={{ fontSize: embedded ? 16 : 18 }} /> : <Cancel sx={{ fontSize: embedded ? 16 : 18 }} />}
    label={isPresent ? 'נוכח' : 'נעדר'}
    color={isPresent ? 'success' : 'error'}
    size={embedded ? 'small' : 'medium'}
    variant="outlined"
    sx={{
      fontSize: embedded ? '0.75rem' : '0.875rem',
      fontWeight: 'medium'
    }}
  />
);

const formatAttendanceValue = (key, value, embedded) => {
  if (value === undefined || value === null || value === '') {
    return '---';
  }

  if (key === 'isPresent' || key === 'wasPresent' || key === 'WasPresent' || key === 'IsPresent') {
    const parsedPresence = parsePresenceValue(value);
    if (parsedPresence === null) {
      return '---';
    }
    return renderPresenceChip(parsedPresence, embedded);
  }

  if (typeof value === 'boolean') {
    return renderPresenceChip(value, embedded);
  }

  if (key === 'statusReport' || key === 'StatusReport') {
    const status = parseStatusReport(value);
    const statusMap = {
      1: { color: 'success', icon: <CheckCircle sx={{ fontSize: embedded ? 16 : 18 }} /> },
      2: { color: 'default', icon: <Cancel sx={{ fontSize: embedded ? 16 : 18 }} /> },
      3: { color: 'warning', icon: <ScheduleIcon sx={{ fontSize: embedded ? 16 : 18 }} /> }
    };
    const style = statusMap[status] || { color: 'default', icon: <ScheduleIcon sx={{ fontSize: embedded ? 16 : 18 }} /> };

    return (
      <Chip
        icon={style.icon}
        label={getStatusLabel(status)}
        color={style.color}
        size={embedded ? 'small' : 'medium'}
        variant="outlined"
        sx={{
          fontSize: embedded ? '0.75rem' : '0.875rem',
          fontWeight: 'medium'
        }}
      />
    );
  }

  if (isDateLikeKey(key)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('he-IL');
    }
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

const StudentAttendanceHistory = ({ open, onClose, student, embedded = false }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatusRecord, setSelectedStatusRecord] = useState(null);
  const [selectedStatusValue, setSelectedStatusValue] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'error' });

  const attendanceData = useSelector((state) => state.attendances.attendanceData);
  const loading = useSelector((state) => state.attendances.loading);
  const allUsers = useSelector((state) => state.users?.users || []);

  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const studentId = student?.id;

  // פונקציה לטעינת נתוני נוכחות
  const fetchAttendanceHistoryData = async () => {
    if (!studentId) {
      return;
    }

    try {
      const params = {
        studentId,
        month: selectedMonth || undefined,
        year: selectedYear || undefined
      };

      await dispatch(fetchAttendanceHistory(params)).unwrap();
    } catch (error) {
      console.error('❌ Error fetching attendance history:', error);
      console.error('❌ Error details:', error.message || error);
    }
  };

  // פונקציה לפתיחת דיאלוג מחיקת נוכחות
  const handleDeleteClick = (attendanceId) => {
    setSelectedAttendanceId(attendanceId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!(checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity })))) return;
    dispatch(deleteAttendance(selectedAttendanceId));
    setOpenDialog(false);
    setSelectedAttendanceId(null);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setSelectedAttendanceId(null);
  };

  const handleOpenStatusDialog = (record) => {
    const currentStatus = parseStatusReport(getRecordValue(record, ['statusReport', 'StatusReport']));
    setSelectedStatusRecord(record);
    setSelectedStatusValue(currentStatus ? String(currentStatus) : '3');
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedStatusRecord(null);
    setSelectedStatusValue('');
  };

  const handleSaveStatusReport = async () => {
    const attendanceId = getRecordValue(selectedStatusRecord, ['attendanceId', 'AttendanceId', 'id', 'Id']);
    if (!attendanceId) {
      setNotification({ open: true, message: 'לא נמצא מזהה נוכחות לעדכון', severity: 'error' });
      return;
    }

    const canEdit = checkUserPermission(
      currentUser?.id || currentUser?.userId,
      (msg, severity) => setNotification({ open: true, message: msg, severity })
    );

    if (!canEdit) {
      return;
    }

    setSavingStatus(true);

    try {
      const rawPresence = getRecordValue(selectedStatusRecord, ['isPresent', 'wasPresent', 'WasPresent', 'IsPresent']);
      const parsedPresence = parsePresenceValue(rawPresence);
      const updatePayload = {
        attendanceId: Number(attendanceId),
        studentId: Number(getRecordValue(selectedStatusRecord, ['studentId', 'StudentId'])) || Number(studentId),
        lessonId: Number(getRecordValue(selectedStatusRecord, ['lessonId', 'LessonId'])) || 0,
        dateReport: getRecordValue(selectedStatusRecord, ['dateReport', 'DateReport', 'date', 'Date']) || null,
        statusReport: Number(selectedStatusValue),
        updateDate: new Date().toISOString(),
        updateBy: Number(currentUser?.id || currentUser?.userId || currentUser?.IdentityCard || currentUser?.identityCard || 0),
        healthFundReport: Number(getRecordValue(selectedStatusRecord, ['healthFundReport', 'HealthFundReport'])) || 0,
        wasPresent: parsedPresence === null ? false : parsedPresence
      };

      await dispatch(batchUpdateAttendances([updatePayload])).unwrap();
      await Promise.all([fetchAttendanceHistoryData(), fetchAttendanceSummaryData()]);

      setNotification({ open: true, message: 'סטטוס הדיווח עודכן בהצלחה', severity: 'success' });
      handleCloseStatusDialog();
    } catch (error) {
      setNotification({ open: true, message: 'עדכון סטטוס הדיווח נכשל', severity: 'error' });
    } finally {
      setSavingStatus(false);
    }
  };

  // פונקציה לטעינת סיכום נוכחות
  const fetchAttendanceSummaryData = async () => {
    if (!studentId) {
      return;
    }

    try {
      await dispatch(fetchStudentAttendanceSummary({
        studentId,
        month: selectedMonth || null,
        year: selectedYear || null
      })).unwrap();
    } catch (error) {
      console.error('❌ Error fetching attendance summary:', error);
      console.error('❌ Summary error details:', error.message || error);
    }
  };

  useEffect(() => {
    if (studentId && (open || embedded)) {
      fetchAttendanceHistoryData();
      fetchAttendanceSummaryData();
    }
  }, [studentId, open, embedded, selectedMonth, selectedYear]);

  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch, allUsers.length]);

  // סינון לפי קורס
  useEffect(() => {
    let filtered = Array.isArray(attendanceData) ? attendanceData : [];

    if (selectedCourse) {
      filtered = filtered.filter((record) =>
        getRecordValue(record, ['courseName', 'CourseName']) === selectedCourse
      );
    }

    setFilteredData(filtered);
  }, [selectedCourse, attendanceData]);

  // חישוב סטטיסטיקות ישירות מהשורות שמוצגות בטבלה
  const summaryStats = useMemo(() => {
    const rows = Array.isArray(filteredData) ? filteredData : [];

    const statusCount = rows.reduce((acc, record) => {
      const status = parseStatusReport(getRecordValue(record, ['statusReport', 'StatusReport']));
      if (status === 1) acc.reported += 1;
      if (status === 2) acc.notForReport += 1;
      if (status === 3) acc.pending += 1;
      return acc;
    }, { reported: 0, notForReport: 0, pending: 0 });

    const presenceStates = rows
      .map((record) => parsePresenceValue(getRecordValue(record, ['isPresent', 'wasPresent', 'WasPresent', 'IsPresent'])))
      .filter((state) => state !== null);

    const present = presenceStates.filter((state) => state === true).length;
    const absent = presenceStates.filter((state) => state === false).length;
    const totalWithPresence = present + absent;

    const attendanceRate = totalWithPresence > 0
      ? ((present / totalWithPresence) * 100).toFixed(1)
      : 0;

    return {
      totalRows: rows.length,
      present,
      absent,
      attendanceRate,
      ...statusCount
    };
  }, [filteredData]);

  // קבלת רשימת קורסים ייחודיים
  const resolveUserName = (idValue) => {
    if (!idValue && idValue !== 0) return '---';
    const numericId = Number(idValue);
    if (allUsers.length > 0) {
      const found = allUsers.find((u) =>
        Number(u?.id ?? u?.Id ?? u?.userId ?? u?.UserId ?? u?.IdentityCard ?? u?.identityCard) === numericId
      );
      if (found) {
        const first = found.firstName ?? found.FirstName ?? '';
        const last = found.lastName ?? found.LastName ?? '';
        const fullName = `${first} ${last}`.trim();
        if (fullName) return fullName;
      }
    }
    return String(idValue);
  };

  const uniqueCourses = [...new Set(
    (Array.isArray(attendanceData) ? attendanceData : [])
      .map((record) => getRecordValue(record, ['courseName', 'CourseName']))
      .filter(Boolean)
  )];

  const attendanceColumns = useMemo(() => {
    const records = Array.isArray(filteredData) && filteredData.length > 0
      ? filteredData
      : Array.isArray(attendanceData)
        ? attendanceData
        : [];

    const keys = new Set();
    records.forEach((record) => {
      Object.keys(record || {}).forEach((key) => keys.add(key));
    });

    const preferredOrder = [
      'AttendanceId', 'attendanceId',
      'StudentId', 'studentId',
      'LessonId', 'lessonId',
      'DateReport', 'dateReport',
      'LessonDate', 'lessonDate', 'Date', 'date',
      'CourseName', 'courseName',
      'GroupName', 'groupName',
      'BranchName', 'branchName',
      'InstructorName', 'instructorName',
      'LessonTime', 'lessonTime',
      'WasPresent', 'wasPresent', 'IsPresent', 'isPresent',
      'StatusReport', 'statusReport',
      'HealthFundReport', 'healthFundReport',
      'UpdateDate', 'updateDate',
      'UpdateBy', 'updateBy',
      'GroupId', 'groupId'
    ];

    const keyList = Array.from(keys).filter((key) => typeof key === 'string' && key.trim().length > 0);
    return [
      ...preferredOrder.filter((key) => keyList.includes(key)),
      ...keyList.filter((key) => !preferredOrder.includes(key))
    ];
  }, [attendanceData, filteredData]);

  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleRefreshData = () => {
    fetchAttendanceHistoryData();
    fetchAttendanceSummaryData();
  };

  // פונקציה לרינדור התוכן
  const renderAttendanceContent = () => {
    const summaryTotal = summaryStats.totalRows;
    const summaryPresent = summaryStats.present;
    const summaryAbsent = summaryStats.absent;
    const summaryRate = summaryStats.attendanceRate;
    const summaryCards = [
      { label: 'סה"כ שיעורים', value: summaryTotal, bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', text: '#065f46', border: '#a7f3d0' },
      { label: 'נוכח', value: summaryPresent, bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', text: '#1e3a8a', border: '#bfdbfe' },
      { label: 'נעדר', value: summaryAbsent, bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', text: '#9f1239', border: '#fecdd3' },
      { label: 'דווח', value: summaryStats.reported, bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', text: '#14532d', border: '#bbf7d0' },
      { label: 'לא לדיווח', value: summaryStats.notForReport, bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', text: '#1e293b', border: '#cbd5e1' },
      { label: 'ממתין לדיווח', value: summaryStats.pending, bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', text: '#9a3412', border: '#fed7aa' },
      { label: 'אחוז נוכחות', value: `${Number(summaryRate).toFixed(1)}%`, bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', text: '#5b21b6', border: '#ddd6fe' }
    ];

    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ mb: 2.2 }}>
          <Grid container sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1, rowGap: 1, alignItems: 'flex-end' }}>
            <Grid size="auto">
              <TextField
                select
                label="בחר שנה"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                size={embedded ? 'small' : 'medium'}
                sx={{
                  width: 128,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#8b5cf6'
                  }
                }}
              >
                <MenuItem value="">כל השנים</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size="auto">
              <TextField
                select
                label="בחר חודש"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                size={embedded ? 'small' : 'medium'}
                sx={{
                  width: 128,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#8b5cf6'
                  }
                }}
              >
                <MenuItem value="">כל החודשים</MenuItem>
                {monthNames.map((month, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size="auto">
              <TextField
                select
                label="בחר קורס"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                size={embedded ? 'small' : 'medium'}
                sx={{
                  width: 146,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#8b5cf6'
                  }
                }}
              >
                <MenuItem value="">כל הקורסים</MenuItem>
                {uniqueCourses.map((course) => (
                  <MenuItem key={course} value={course}>
                    {course}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size="auto">
              <Button
                variant="contained"
                onClick={handleRefreshData}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                sx={{
                  minWidth: 132,
                  height: embedded ? '40px' : '56px',
                  background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                  borderRadius: '12px',
                  fontWeight: 'medium',
                  boxShadow: '0 3px 12px rgba(139, 92, 246, 0.22)',
                  '&:hover': {
                    boxShadow: '0 5px 15px rgba(139, 92, 246, 0.28)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'טוען...' : 'רענן נתונים'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#8b5cf6' }} />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, minmax(0, 1fr))',
                  sm: 'repeat(3, minmax(0, 1fr))',
                  md: 'repeat(4, minmax(0, 1fr))',
                  lg: `repeat(${summaryCards.length}, minmax(0, 1fr))`
                },
                gap: 1.4,
                mb: 2.4,
                width: '100%'
              }}
            >
              {summaryCards.map((item) => (
                <Card
                  key={item.label}
                  sx={{
                    background: item.bg,
                    color: item.text,
                    borderRadius: '16px',
                    border: `1px solid ${item.border}`,
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)'
                  }}
                >
                  <CardContent
                    sx={{
                      minHeight: embedded ? 86 : 98,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      py: embedded ? 1.2 : 1.6
                    }}
                  >
                    <Typography
                      variant={embedded ? 'h5' : 'h4'}
                      fontWeight="bold"
                      sx={{ lineHeight: 1.05, mb: 0.35 }}
                    >
                      {item.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.92, fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Card
              sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                background: 'white',
                border: '1px solid rgba(0,0,0,0.08)'
              }}
            >
              <TableContainer sx={{ maxHeight: embedded ? '300px' : '400px' }}>
                <Table stickyHeader size={embedded ? 'small' : 'medium'}>
                  <TableHead>
                    <TableRow>
                      {attendanceColumns.map((column) => (
                        <TableCell
                          key={column}
                          align="right"
                          sx={{
                            fontWeight: 'bold',
                            fontSize: embedded ? '0.9rem' : '1rem',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                            py: 2,
                            textAlign: 'right',
                            direction: 'rtl',
                            borderBottom: '2px solid #8b5cf6',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Typography sx={{ fontWeight: 'bold' }}>{formatColumnLabel(column)}</Typography>
                        </TableCell>
                      ))}
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: embedded ? '0.9rem' : '1rem',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          py: 2,
                          textAlign: 'center',
                          direction: 'rtl',
                          borderBottom: '2px solid #8b5cf6'
                        }}
                      >
                        <Typography sx={{ fontWeight: 'bold' }}>פעולות</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((record, index) => (
                        <TableRow
                          key={getRecordValue(record, ['attendanceId', 'AttendanceId', 'id', 'Id']) || index}
                          component={motion.tr}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          sx={{
                            '&:nth-of-type(even)': { backgroundColor: 'rgba(139, 92, 246, 0.03)' },
                            '&:hover': {
                              backgroundColor: 'rgba(139, 92, 246, 0.08)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {attendanceColumns.map((column) => {
                            const isUpdateByColumn = column === 'updateBy' || column === 'UpdateBy';
                            const rawValue = record?.[column];
                            const formattedValue = isUpdateByColumn
                              ? resolveUserName(rawValue)
                              : formatAttendanceValue(column, rawValue, embedded);
                            return (
                              <TableCell key={column} align="right" sx={{ py: embedded ? 1.5 : 2 }}>
                                {React.isValidElement(formattedValue) ? (
                                  formattedValue
                                ) : (
                                  <Typography
                                    sx={{
                                      fontWeight: 'medium',
                                      fontSize: embedded ? '0.85rem' : '1rem',
                                      color: '#1e293b',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {formattedValue}
                                  </Typography>
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell align="center" sx={{ py: embedded ? 1.5 : 2 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleOpenStatusDialog(record)}
                              sx={{
                                borderRadius: 999,
                                minWidth: 96,
                                borderColor: '#8b5cf6',
                                color: '#7c3aed',
                                fontWeight: 700,
                                '&:hover': {
                                  borderColor: '#7c3aed',
                                  bgcolor: 'rgba(139, 92, 246, 0.08)'
                                }
                              }}
                            >
                              שנה סטטוס
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={attendanceColumns.length + 1} align="center" sx={{ py: 4 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <HistoryIcon sx={{ fontSize: 60, color: '#8b5cf6', mb: 2, opacity: 0.5 }} />
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                              לא נמצאו נתוני נוכחות
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              עבור הפילטרים שנבחרו
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </>
        )}

        <Dialog open={openDialog} onClose={handleCancel} sx={{ direction: 'rtl' }}>
          <DialogTitle>האם למחוק את הנוכחות בתאריך זה?</DialogTitle>
          <DialogActions>
            <Button onClick={handleCancel}>ביטול</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              מחק
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog} sx={{ direction: 'rtl' }}>
          <DialogTitle>עדכון סטטוס דיווח</DialogTitle>
          <DialogContent sx={{ minWidth: 320, pt: '10px !important' }}>
            <TextField
              select
              fullWidth
              label="סטטוס דיווח"
              value={selectedStatusValue}
              onChange={(event) => setSelectedStatusValue(event.target.value)}
              inputProps={{ dir: 'rtl' }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: { direction: 'rtl' }
                  }
                }
              }}
              sx={{ direction: 'rtl' }}
            >
              <MenuItem value="1" sx={{ direction: 'rtl', justifyContent: 'flex-start' }}>1 - דווח</MenuItem>
              <MenuItem value="2" sx={{ direction: 'rtl', justifyContent: 'flex-start' }}>2 - לא לדיווח</MenuItem>
              <MenuItem value="3" sx={{ direction: 'rtl', justifyContent: 'flex-start' }}>3 - ממתין לדיווח</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStatusDialog}>ביטול</Button>
            <Button
              onClick={handleSaveStatusReport}
              variant="contained"
              disabled={savingStatus || !selectedStatusValue}
              startIcon={savingStatus ? <CircularProgress size={16} color="inherit" /> : null}
            >
              שמור
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  if (embedded) {
    return renderAttendanceContent();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        direction: 'rtl',
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          minHeight: '70vh',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // ✅ סגול במקום כחול
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            <HistoryIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              מעקב נוכחות - {student?.firstName} {student?.lastName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              נתוני נוכחות מפורטים וסטטיסטיקות
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={onClose}
          sx={{
            color: 'white',
            minWidth: 'auto',
            p: 1,
            borderRadius: '50%',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3, background: '#f8fafc' }}>
        {renderAttendanceContent()}
      </DialogContent>

      <Divider sx={{ background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)' }} />

      <DialogActions sx={{
        p: 2.5,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderTop: '1px solid rgba(139, 92, 246, 0.1)'
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="medium"
          sx={{
            borderRadius: '20px',
            px: 4,
            py: 1.2,
            fontSize: '1rem',
            fontWeight: 'medium',
            borderColor: '#8b5cf6',
            color: '#8b5cf6',
            borderWidth: '2px',
            '&:hover': {
              borderColor: '#7c3aed',
              color: '#7c3aed',
              background: 'rgba(139, 92, 246, 0.05)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          סגור
        </Button>
      </DialogActions>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Dialog>

  );
};

export default StudentAttendanceHistory;











