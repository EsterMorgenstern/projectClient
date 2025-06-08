         import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Assessment,
  Download,
  DateRange,
  Group,
  TrendingUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceReportsOverall } from '../../../store/attendance/fetchAttendanceReportsOverall';
import { fetchAttendanceReportsMonthly } from '../../../store/attendance/fetchAttendenceReportsMonthly';

const AttendanceReports = ({ open, onClose }) => {
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groups, setGroups] = useState([]);

  const dispatch = useDispatch();
  
  // תיקון: קבלת נתונים מ-Redux store בצורה נכונה
  const attendanceState = useSelector(state => state.attendances);
  const { 
    attendanceReportsMonthly, 
    attendanceReportsOverall, 
    loading, 
    error 
  } = attendanceState;

  // תיקון: הסרת הפונקציות מה-console.log
  console.log('Redux State:', attendanceState);
  console.log('Monthly Reports:', attendanceReportsMonthly);
  console.log('Overall Reports:', attendanceReportsOverall);
  console.log('Loading:', loading);
  console.log('Error:', error);

  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => currentYear - 2 + i);

  // טעינת קבוצות
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:5248/api/Group/GetAll');
        if (response.ok) {
          const data = await response.json();
          console.log('Groups loaded:', data);
          setGroups(data);
        } else {
          console.error('Failed to fetch groups:', response.status);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    if (open) {
      fetchGroups();
    }
  }, [open]);

  // טעינת נתוני דוח
  const fetchReportData = async () => {
    console.log('Fetching report data:', {
      reportType,
      selectedMonth,
      selectedYear,
      selectedGroup
    });

    try {
      if (reportType === 'monthly') {
        const result = await dispatch(fetchAttendanceReportsMonthly({ 
          groupId: selectedGroup, 
          selectedMonth, 
          selectedYear 
        }));
        console.log('Monthly report result:', result);
      } else if (reportType === 'overall') {
        const result = await dispatch(fetchAttendanceReportsOverall({ 
          selectedMonth, 
          selectedYear 
        }));
        console.log('Overall report result:', result);
      }
    } catch (error) {
      console.error('Error in fetchReportData:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchReportData();
    }
  }, [open, reportType, selectedMonth, selectedYear, selectedGroup]);

  // תיקון: קבלת הנתונים הנכונים לפי סוג הדוח
  const reportData = reportType === 'monthly' ? attendanceReportsMonthly : attendanceReportsOverall;
  
  console.log('Current report data:', reportData);
  console.log('Report data type:', typeof reportData);
  console.log('Report data keys:', reportData ? Object.keys(reportData) : 'null');

  const renderMonthlyReport = () => {
    if (!reportData || typeof reportData !== 'object') {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            אין נתונים להצגה
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            נתונים: {JSON.stringify(reportData)}
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        {/* סטטיסטיקות כלליות */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: '#EBF8FF' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Group sx={{ fontSize: 40, color: '#3B82F6', mb: 1 }} />
                <Typography variant="h4" color="#1E40AF">
                  {reportData.overallStatistics?.totalGroups || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  קבוצות
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: '#F0FDF4' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assessment sx={{ fontSize: 40, color: '#10B981', mb: 1 }} />
                <Typography variant="h4" color="#059669">
                  {reportData.overallStatistics?.totalStudents || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  תלמידים
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: '#FEF3F2' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <DateRange sx={{ fontSize: 40, color: '#EF4444', mb: 1 }} />
                <Typography variant="h4" color="#DC2626">
                  {reportData.overallStatistics?.totalLessons || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  שיעורים
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: '#FEF7CD' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: '#F59E0B', mb: 1 }} />
                <Typography variant="h4" color="#D97706">
                  {reportData.overallStatistics?.overallAttendanceRate || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  אחוז נוכחות כללי
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* טבלת קבוצות */}
        {reportData.groups && Array.isArray(reportData.groups) && reportData.groups.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>קבוצה</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>קורס</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>סניף</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>תלמידים</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>שיעורים</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>אחוז נוכחות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.groups.map((group, index) => (
                  <TableRow
                    key={group.groupId || index}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    sx={{
                      '&:nth-of-type(odd)': { bgcolor: 'rgba(59, 130, 246, 0.03)' },
                      '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' }
                    }}
                  >
                    <TableCell align="right">{group.groupName || 'לא זמין'}</TableCell>
                    <TableCell align="right">{group.courseName || 'לא זמין'}</TableCell>
                    <TableCell align="right">{group.branchName || 'לא זמין'}</TableCell>
                    <TableCell align="right">{group.totalStudents || 0}</TableCell>
                    <TableCell align="right">{group.totalLessons || 0}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${group.averageAttendanceRate || 0}%`}
                        color={
                          (group.averageAttendanceRate || 0) >= 90 ? 'success' :
                          (group.averageAttendanceRate || 0) >= 75 ? 'primary' :
                          (group.averageAttendanceRate || 0) >= 60 ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              אין נתוני קבוצות להצגה
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Groups data: {JSON.stringify(reportData.groups)}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderOverallReport = () => {
    if (!reportData || typeof reportData !== 'object') {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            אין נתונים להצגה
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  סטטיסטיקות כלליות
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>סה״כ קבוצות:</Typography>
                    <Typography fontWeight="bold">{reportData.totalGroups || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>סה״כ תלמידים:</Typography>
                    <Typography fontWeight="bold">{reportData.totalStudents || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>סה״כ שיעורים:</Typography>
                    <Typography fontWeight="bold">{reportData.totalLessons || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>אחוז נוכחות כללי:</Typography>
                    <Chip
                      label={`${reportData.overallAttendanceRate || 0}%`}
                      color={
                        (reportData.overallAttendanceRate || 0) >= 90 ? 'success' :
                        (reportData.overallAttendanceRate || 0) >= 75 ? 'primary' :
                        (reportData.overallAttendanceRate || 0) >= 60 ? 'warning' : 'error'
                      }
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{
        direction:'rtl',
        '& .MuiDialog-paper': {
          borderRadius: 12,
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#059669',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Assessment />
        דוחות נוכחות
      </DialogTitle>
<br />
      <DialogContent sx={{ p: 3 }}>
        {/* פילטרים */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="סוג דוח"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="monthly">דוח חודשי</MenuItem>
              <MenuItem value="overall">סטטיסטיקות כלליות</MenuItem>
            </TextField>
          </Grid>

         
         <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="שנה"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="חודש"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {monthNames.map((month, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {reportType === 'monthly' && (
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="קבוצה (אופציונלי)"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <MenuItem value="">כל הקבוצות</MenuItem>
                {groups.map(group => (
                  <MenuItem key={group.groupId} value={group.groupId}>
                    {group.groupName} - {group.courseId}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={fetchReportData}
              sx={{ height: '56px' }}
              disabled={Boolean(loading)}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'עדכן דוח'}
            </Button>
          </Grid>
        </Grid>

        {/* הצגת שגיאות */}
        {error && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#FEF2F2', borderRadius: 2, border: '1px solid #FECACA' }}>
            <Typography color="error" variant="h6" gutterBottom>
              שגיאה בטעינת הנתונים
            </Typography>
            <Typography color="error" variant="body2">
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </Typography>
          </Box>
        )}

       

        {/* תוכן הדוח */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>טוען נתונים...</Typography>
          </Box>
        ) : (
          <Box>
            {reportType === 'monthly' && renderMonthlyReport()}
            {reportType === 'overall' && renderOverallReport()}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          startIcon={<Download />}
          variant="outlined"
          color="primary"
          disabled={!reportData || Boolean(loading)}
        >
          ייצא לאקסל
        </Button>
        <Button onClick={onClose} variant="outlined" color="primary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceReports;
