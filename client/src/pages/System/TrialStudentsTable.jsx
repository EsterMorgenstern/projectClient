import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, TextField, Button, CircularProgress,
  IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem,
  TablePagination, Alert, Snackbar, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, InputAdornment
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getGroupStudentsByStatus } from '../../store/groupStudent/groupStudentGetByStatusThunk';
import { updateGroupStudent } from '../../store/groupStudent/groupStudentUpdateThunk';
import { getgroupStudentByStudentId } from '../../store/groupStudent/groupStudentGetByStudentIdThunk';
import { checkUserPermission } from '../../utils/permissions';
import StatsCard from '../../components/StatsCard';
import StudentCoursesDialog from '../Students/components/studentCoursesDialog';

const months = [
  { value: 'all', label: 'כל התאריכים' },
  { value: 0, label: 'ינואר' }, { value: 1, label: 'פברואר' },
  { value: 2, label: 'מרץ' }, { value: 3, label: 'אפריל' },
  { value: 4, label: 'מאי' }, { value: 5, label: 'יוני' },
  { value: 6, label: 'יולי' }, { value: 7, label: 'אוגוסט' },
  { value: 8, label: 'ספטמבר' }, { value: 9, label: 'אוקטובר' },
  { value: 10, label: 'נובמבר' }, { value: 11, label: 'דצמבר' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'הכל' },
  { value: 4, label: '🔍 ניסיון' },
  { value: 3, label: '🤝 ליד' },
  { value: 1, label: '✅ פעיל' },
  { value: 2, label: '🚪 עזב' },
];

const getStatusMeta = (code) => {
  switch (Number(code)) {
    case 1: return { label: 'פעיל', color: 'success', bg: '#dcfce7', text: '#166534' };
    case 2: return { label: 'עזב', color: 'error', bg: '#fee2e2', text: '#991b1b' };
    case 3: return { label: 'ליד', color: 'warning', bg: '#fef3c7', text: '#92400e' };
    case 4: return { label: 'ניסיון', color: 'info', bg: '#e0f2fe', text: '#075985' };
    default: return { label: 'לא ידוע', color: 'default', bg: '#f3f4f6', text: '#374151' };
  }
};

const TrialStudentsTable = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.users?.currentUser || state.user?.currentUser || null);
  const { groupStudentByStatus, statusLoading } = useSelector(state => state.groupStudents);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(4);
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterTrialMonth, setFilterTrialMonth] = useState('all');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editStatus, setEditStatus] = useState(4);
  const [editTrialDate, setEditTrialDate] = useState('');
  const [editEnrollmentDate, setEditEnrollmentDate] = useState('');
  const [saving, setSaving] = useState(false);

  // Notification
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Student details dialog
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [loadingStudentCourses, setLoadingStudentCourses] = useState(false);

  const handleOpenStudentDetails = async (row) => {
    const student = {
      id: row.studentId,
      firstName: row.studentFirstName || row.studentName || '',
      lastName: row.studentLastName || '',
      email: row.email || '',
      phone: row.phone || '',
    };
    setSelectedStudent(student);
    setStudentDialogOpen(true);
    setStudentCourses([]);
    setLoadingStudentCourses(true);
    try {
      const result = await dispatch(getgroupStudentByStudentId(row.studentId));
      if (result.payload) {
        setStudentCourses(Array.isArray(result.payload) ? result.payload : []);
      }
    } catch (e) {
      console.error('שגיאה בטעינת חוגי התלמיד:', e);
    } finally {
      setLoadingStudentCourses(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    console.log('🔄 [TrialStudentsTable] loadData called');
    dispatch(getGroupStudentsByStatus('all'));
  };

  // Debug: log Redux state changes
  useEffect(() => {
    console.log('📊 [TrialStudentsTable] groupStudentByStatus changed:', {
      isArray: Array.isArray(groupStudentByStatus),
      length: groupStudentByStatus?.length,
      statusLoading,
      firstItem: groupStudentByStatus?.[0],
    });
  }, [groupStudentByStatus, statusLoading]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(groupStudentByStatus)) return [];

    return groupStudentByStatus.filter(gs => {
      const statusCode = Number(gs.isActive ?? gs.IsActive);

      // סינון סטטוס
      if (filterStatus !== 'all' && statusCode !== Number(filterStatus)) return false;

      // חיפוש חופשי
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        const name = `${gs.studentFirstName ?? ''} ${gs.studentLastName ?? ''} ${gs.studentName ?? ''}`.toLowerCase();
        const groupName = (gs.groupName ?? '').toLowerCase();
        const id = String(gs.studentId ?? '');
        if (!name.includes(term) && !groupName.includes(term) && !id.includes(term)) return false;
      }

      // סינון לפי חודש רישום
      if (filterMonth !== 'all') {
        const date = gs.enrollmentDate || gs.EnrollmentDate;
        if (!date) return false;
        if (new Date(date).getMonth() !== Number(filterMonth)) return false;
      }

      // סינון לפי חודש ניסיון
      if (filterTrialMonth !== 'all') {
        const date = gs.trialDate || gs.TrialDate;
        if (!date || (typeof date === 'string' && date.startsWith('0001'))) return false;
        if (new Date(date).getMonth() !== Number(filterTrialMonth)) return false;
      }

      return true;
    });
  }, [groupStudentByStatus, filterStatus, searchTerm, filterMonth, filterTrialMonth]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const trialCount = useMemo(() =>
    (groupStudentByStatus || []).filter(gs => Number(gs.isActive ?? gs.IsActive) === 4).length,
    [groupStudentByStatus]
  );

  const trialWithoutDateCount = useMemo(() =>
    (groupStudentByStatus || []).filter(gs => {
      const td = gs.trialDate || gs.TrialDate;
      const hasDate = td && !(typeof td === 'string' && td.startsWith('0001'));
      return Number(gs.isActive ?? gs.IsActive) === 4 && !hasDate;
    }).length,
    [groupStudentByStatus]
  );

  const handleOpenEdit = (row) => {
    setEditingRow(row);
    setEditStatus(Number(row.isActive ?? row.IsActive));
    setEditTrialDate(row.trialDate || row.TrialDate || '');
    setEditEnrollmentDate(row.enrollmentDate || row.EnrollmentDate || '');
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!checkUserPermission(currentUser?.id || currentUser?.userId,
      (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;

    setSaving(true);
    try {
      await dispatch(updateGroupStudent({
        groupStudentId: editingRow.groupStudentId,
        studentId: editingRow.studentId,
        groupName: editingRow.groupName,
        enrollmentDate: editEnrollmentDate || editingRow.enrollmentDate,
        isActive: editStatus,
        trialDate: editStatus === 4 ? (editTrialDate || null) : (editingRow.trialDate || null),
      }));
      setNotification({ open: true, message: 'הנתונים עודכנו בהצלחה', severity: 'success' });
      setEditDialogOpen(false);
      loadData();
    } catch {
      setNotification({ open: true, message: 'שגיאה בשמירה', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (val) => {
    if (!val) return '—';
    if (typeof val === 'string' && val.startsWith('0001')) return '—';
    try { return new Date(val).toLocaleDateString('he-IL'); } catch { return '—'; }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Box sx={{ direction: 'rtl' }}>

        {/* כותרת — סגנון כמו StudentHealthFundTable */}
        <Paper
          elevation={0}
          sx={{
            mb: 2.5,
            p: { xs: 2, md: 2.5 },
            borderRadius: 3,
            border: '1px solid #dbeafe',
            background: 'linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%)',
            boxShadow: '0 8px 24px rgba(37,99,235,0.08)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1d4fbaff', textAlign: 'right', fontFamily: 'inherit', fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
                מעקב שיעורי ניסיון
              </Typography>
              <Typography variant="body2" sx={{ color: '#5b6b84', mt: 0.75, fontFamily: 'inherit' }}>
                כל התלמידים לפי סטטוס — סינון, מיון ועדכון ישיר
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadData}
              sx={{
                borderRadius: '999px',
                direction: 'ltr',
                fontWeight: 700,
                px: 3,
                py: 1,
                fontSize: '0.92rem',
                fontFamily: 'inherit',
                boxShadow: '0 8px 18px rgba(37,99,235,0.18)',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)' }
              }}
            >
              רענן
            </Button>
          </Box>
        </Paper>

        {/* כרטיסי סטטיסטיקה */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 1.5, mb: 2.5
        }}>
          <StatsCard
            label="בשיעור ניסיון"
            value={trialCount}
            note="סטטוס ניסיון פעיל"
            bg="linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)"
            icon={ScienceIcon}
            iconBg="rgba(14,165,233,0.15)"
            numberAlign="center"
          />
          <StatsCard
            label="ניסיון ללא תאריך"
            value={trialWithoutDateCount}
            note="יש למלא תאריך ניסיון"
            bg="linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)"
            icon={SearchIcon}
            iconBg="rgba(245,158,11,0.15)"
            numberAlign="center"
          />
          <StatsCard
            label="סה״כ רשומות"
            value={(groupStudentByStatus || []).length}
            note="כל הרשומות"
            bg="linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
            icon={CheckCircleIcon}
            iconBg="rgba(59,130,246,0.12)"
            numberAlign="center"
          />
          <StatsCard
            label="תוצאות מסוננות"
            value={filteredData.length}
            note="לפי הסינון הנוכחי"
            bg="linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)"
            icon={SearchIcon}
            iconBg="rgba(139,92,246,0.12)"
            numberAlign="center"
          />
        </Box>

        {/* פס סינונים — כמו StudentHealthFundTable */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            px: { xs: 1.5, md: 2 },
            py: 2,
            borderRadius: 3,
            bgcolor: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 20px rgba(15,23,42,0.05)'
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="חיפוש שם / קבוצה / ת״ז"
              size="small"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
              sx={{
                flex: 1,
                minWidth: 240,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '999px',
                  bgcolor: '#f8fbff',
                  direction: 'rtl',
                  pr: 2,
                  '& fieldset': { borderColor: '#dbeafe' },
                  '&:hover': { boxShadow: '0 4px 12px rgba(37,99,235,0.10)' },
                  '&.Mui-focused': { boxShadow: '0 4px 16px rgba(37,99,235,0.16)' }
                },
                '& input': { textAlign: 'right', fontSize: '0.92rem', fontFamily: 'inherit' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#93c5fd', fontSize: '1.1rem' }} />
                  </InputAdornment>
                )
              }}
            />

            <FormControl size="small" sx={{ minWidth: 150, direction: 'rtl', '& .MuiOutlinedInput-notchedOutline legend': { textAlign: 'right', marginRight: '20px' }, '& .MuiInputLabel-shrink': { transform: 'translate(0, -9px) scale(0.75)' } }}>
              <InputLabel sx={{ right: 20, left: 'auto', transformOrigin: 'top right' }}>סטטוס</InputLabel>
              <Select value={filterStatus} label="סטטוס"
                onChange={e => { setFilterStatus(e.target.value); setPage(0); }}
                sx={{ borderRadius: '12px', direction: 'rtl', bgcolor: 'white' }}>
                {STATUS_OPTIONS.map(o => (
                  <MenuItem key={o.value} value={o.value} sx={{ direction: 'rtl' }}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 165, direction: 'rtl', '& .MuiOutlinedInput-notchedOutline legend': { textAlign: 'right', marginRight: '20px' }, '& .MuiInputLabel-shrink': { transform: 'translate(0, -9px) scale(0.75)' } }}>
              <InputLabel sx={{ right: 20, left: 'auto', transformOrigin: 'top right' }}>חודש רישום</InputLabel>
              <Select value={filterMonth} label="חודש רישום"
                onChange={e => { setFilterMonth(e.target.value); setPage(0); }}
                sx={{ borderRadius: '12px', direction: 'rtl', bgcolor: 'white' }}>
                {months.map(m => <MenuItem key={m.value} value={m.value} sx={{ direction: 'rtl' }}>{m.label}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 165, direction: 'rtl', '& .MuiOutlinedInput-notchedOutline legend': { textAlign: 'right', marginRight: '20px' }, '& .MuiInputLabel-shrink': { transform: 'translate(0, -9px) scale(0.75)' } }}>
              <InputLabel sx={{ right: 20, left: 'auto', transformOrigin: 'top right' }}>חודש ניסיון</InputLabel>
              <Select value={filterTrialMonth} label="חודש ניסיון"
                onChange={e => { setFilterTrialMonth(e.target.value); setPage(0); }}
                sx={{ borderRadius: '12px', direction: 'rtl', bgcolor: 'white' }}>
                {months.map(m => <MenuItem key={m.value} value={m.value} sx={{ direction: 'rtl' }}>{m.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* טבלה */}
        {statusLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={50} />
          </Box>
        ) : (
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small" sx={{ minWidth: 750 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
                    {['שם תלמיד', 'ת״ז', 'קבוצה', 'סטטוס', 'תאריך התחלה', 'תאריך ניסיון', 'פעולות'].map(h => (
                      <TableCell key={h} align="right"
                        sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.98rem', py: 1.5, borderBottom: 'none' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <ScienceIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                          <Typography>אין תוצאות לפי הסינון הנוכחי</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row, idx) => {
                      const statusMeta = getStatusMeta(row.isActive ?? row.IsActive);
                      const trialDate = row.trialDate || row.TrialDate;
                      const normalizedTrialDate = trialDate && !(typeof trialDate === 'string' && trialDate.startsWith('0001')) ? trialDate : null;
                      const isTrialMissingDate = Number(row.isActive ?? row.IsActive) === 4 && !normalizedTrialDate;
                      return (
                        <TableRow key={row.groupStudentId ?? idx}
                          sx={{
                            '&:nth-of-type(even)': { bgcolor: 'rgba(248, 250, 252, 0.5)' },
                            '&:hover': {
                              bgcolor: 'rgba(59, 130, 246, 0.04)',
                              transform: 'scale(1.005)',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)'
                            },
                            borderRight: Number(row.isActive ?? row.IsActive) === 4 ? '4px solid #0EA5E9' : 'none',
                            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                            direction: 'rtl',
                          }}>
                          <TableCell align="right" sx={{ py: 1.5 }}>
                            <Tooltip title="לחץ לצפייה בפרטי התלמיד" placement="top" arrow>
                              <Typography
                                onClick={() => handleOpenStudentDetails(row)}
                                sx={{
                                  fontWeight: 700,
                                  color: '#1e293b',
                                  fontSize: '0.95rem',
                                  cursor: 'pointer',
                                  display: 'inline',
                                  '&:hover': { color: '#3b82f6', textDecoration: 'underline' }
                                }}
                              >
                                {row.studentFirstName || row.studentName || '—'} {row.studentLastName || ''}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.5, color: '#64748b', fontSize: '0.85rem' }}>
                            {row.studentId || '—'}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.5, color: '#374151', fontSize: '0.88rem' }}>
                            {row.groupName || '—'}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.5 }}>
                            <Chip
                              label={statusMeta.label}
                              size="small"
                              sx={{ bgcolor: statusMeta.bg, color: statusMeta.text, fontWeight: 'bold', fontSize: '0.78rem', px: 1 }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.5, color: '#64748b', fontSize: '0.86rem', fontWeight: 500 }}>
                            {formatDate(row.enrollmentDate || row.EnrollmentDate)}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.5 }}>
                            {normalizedTrialDate ? (
                              <Typography sx={{ fontSize: '0.86rem', color: '#0369a1', fontWeight: 600 }}>
                                {formatDate(normalizedTrialDate)}
                              </Typography>
                            ) : (
                              <Chip label="לא הוזן" size="small"
                                sx={{ bgcolor: isTrialMissingDate ? '#fef3c7' : '#f3f4f6',
                                  color: isTrialMissingDate ? '#92400e' : '#9ca3af',
                                  fontSize: '0.75rem', fontWeight: isTrialMissingDate ? 'bold' : 'normal' }} />
                            )}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.5 }}>
                            <Tooltip title="עדכן סטטוס / תאריך ניסיון">
                              <IconButton size="small" onClick={() => handleOpenEdit(row)}
                                sx={{ color: '#3b82f6', '&:hover': { bgcolor: 'rgba(59,130,246,0.1)', transform: 'translateY(-1px)' }, transition: 'all 0.2s ease' }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="שורות לעמוד:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} מתוך ${count}`}
              sx={{ direction: 'rtl', borderTop: '1px solid #e2e8f0' }}
            />
          </Paper>
        )}

        {/* דיאלוג עריכה */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth
          PaperProps={{ sx: { borderRadius: 3, direction: 'rtl' } }}>
          <DialogTitle sx={{ bgcolor: '#0EA5E9', color: 'white', fontWeight: 'bold', textAlign: 'right' }}>
            ✏️ עדכון רשומה
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {editingRow && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#374151', fontWeight: 600, textAlign: 'right' }}>
                  {editingRow.studentFirstName || editingRow.studentName} {editingRow.studentLastName || ''} — {editingRow.groupName}
                </Typography>

                <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-notchedOutline legend': { textAlign: 'right' } }}>
                  <InputLabel sx={{ right: 14, left: 'auto', transformOrigin: 'top right' }}>סטטוס</InputLabel>
                  <Select value={editStatus} label="סטטוס"
                    onChange={e => setEditStatus(Number(e.target.value))}
                    sx={{ direction: 'rtl', borderRadius: 2 }}>
                    {STATUS_OPTIONS.filter(o => o.value !== 'all').map(o => (
                      <MenuItem key={o.value} value={o.value} sx={{ direction: 'rtl' }}>{o.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  label="תאריך התחלה"
                  value={editEnrollmentDate ? editEnrollmentDate.split('T')[0] : ''}
                  onChange={e => setEditEnrollmentDate(e.target.value)}
                  InputLabelProps={{ shrink: true, sx: { right: 14, left: 'auto', transformOrigin: 'top right' } }}
                  inputProps={{ dir: 'ltr' }}
                  size="small"
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, '& .MuiOutlinedInput-notchedOutline legend': { textAlign: 'right' } }}
                />

                <TextField
                  type="date"
                  label="תאריך שיעור ניסיון"
                  value={editTrialDate ? editTrialDate.split('T')[0] : ''}
                  onChange={e => setEditTrialDate(e.target.value)}
                  InputLabelProps={{ shrink: true, sx: { right: 14, left: 'auto', transformOrigin: 'top right', color: '#0EA5E9' } }}
                  inputProps={{ dir: 'ltr' }}
                  size="small"
                  fullWidth
                  helperText="שמור גם לאחר מעבר מניסיון לפעיל"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#0EA5E9' } }, '& .MuiOutlinedInput-notchedOutline legend': { textAlign: 'right' } }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button onClick={() => setEditDialogOpen(false)} variant="outlined"
              sx={{ borderRadius: 2, borderColor: '#d1d5db', color: '#6b7280' }}>
              ביטול
            </Button>
            <Button onClick={handleSaveEdit} variant="contained" disabled={saving}
              sx={{ borderRadius: 2, bgcolor: '#0EA5E9', '&:hover': { bgcolor: '#0284C7' } }}>
              {saving ? <CircularProgress size={20} color="inherit" /> : 'שמור'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={notification.open} autoHideDuration={4000}
          onClose={() => setNotification(n => ({ ...n, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={notification.severity} onClose={() => setNotification(n => ({ ...n, open: false }))}>
            {notification.message}
          </Alert>
        </Snackbar>

        {/* דיאלוג פרטי תלמיד */}
        {selectedStudent && (
          <StudentCoursesDialog
            open={studentDialogOpen}
            onClose={() => { setStudentDialogOpen(false); setSelectedStudent(null); setStudentCourses([]); }}
            student={selectedStudent}
            studentCourses={studentCourses}
            loadingCourses={loadingStudentCourses}
            showAddButton={false}
          />
        )}
      </Box>
    </motion.div>
  );
};

export default TrialStudentsTable;
