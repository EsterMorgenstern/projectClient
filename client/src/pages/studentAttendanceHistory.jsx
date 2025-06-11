import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceHistory } from '../store/attendance/fetchAttendanceHistory';
import { fetchStudentAttendanceSummary } from '../store/attendance/fetchStudentAttendanceSummary';
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
  CircularProgress
} from '@mui/material';
import {
  CalendarToday,
  CheckCircle,
  Cancel,
  School,
  Person,
  DateRange
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const StudentAttendanceHistory = ({ open, onClose, student }) => {
  const dispatch = useDispatch();
  
  const attendanceData= useSelector((state) => state.attendances.attendanceData);
  const attendanceSummary = useSelector((state) => state.attendances.attendanceSummary);
  const loading= useSelector((state) => state.attendances.loading);

  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCourse, setSelectedCourse] = useState('');

  // פונקציה לטעינת נתוני נוכחות
const fetchAttendanceHistoryData = async () => {
    if (!student?.id) {
        console.log('No student ID available');
        return;
    }

    console.log('Fetching attendance history for:', {
        studentId: student.id,
        selectedMonth,
        selectedYear
    });

    try {
        const result = await dispatch(fetchAttendanceHistory({
            studentId: student.id,
            selectedMonth,
            selectedYear
        })).unwrap();
        console.log('Attendance history result:', result);
    } catch (error) {
        console.error('Error fetching attendance history:', error);
    }
};

  // פונקציה לטעינת סיכום נוכחות
  const fetchAttendanceSummaryData = async () => {
    if (!student?.id) return;

    try {
      await dispatch(fetchStudentAttendanceSummary({
        studentId: student.id,
        month: selectedMonth,
        year: selectedYear
      })).unwrap();
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    }
  };

  useEffect(() => {
    if (student?.id && open) {
      fetchAttendanceHistoryData();
      fetchAttendanceSummaryData();
    }
  }, [student, open, selectedMonth, selectedYear]);

  // סינון לפי קורס
  useEffect(() => {
    let filtered = Array.isArray(attendanceData) ? attendanceData : [];

    if (selectedCourse) {
      filtered = filtered.filter(record =>
        record.courseName === selectedCourse
      );
    }

    setFilteredData(filtered);
  }, [selectedCourse, attendanceData]);

  // חישוב סטטיסטיקות מהנתונים המסוננים
  const totalLessons = filteredData.length;
  const attendedLessons = filteredData.filter(record => record.isPresent).length;
  const attendanceRate = totalLessons > 0 ? ((attendedLessons / totalLessons) * 100).toFixed(1) : 0;

  // קבלת רשימת קורסים ייחודיים
  const uniqueCourses = [...new Set((Array.isArray(attendanceData) ? attendanceData : []).map(record => record.courseName))];

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

    return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        direction:'rtl',
        '& .MuiDialog-paper': {
          borderRadius: 12,
          minHeight: '70vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#3B82F6',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CalendarToday />
        <Typography variant="h6">
          היסטוריית נוכחות - {student?.firstName} {student?.lastName}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <br />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              label="בחר שנה"
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
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              label="בחר חודש"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="">כל החודשים</MenuItem>
              {monthNames.map((month, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              label="בחר קורס"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <MenuItem value="">כל הקורסים</MenuItem>
              {uniqueCourses.map(course => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                fetchAttendanceHistory();
                fetchAttendanceSummary();
              }}
              sx={{ height: '56px' }}
            >
              רענן נתונים
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : ( 
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ bgcolor: '#EBF8FF' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <School sx={{ fontSize: 40, color: '#3B82F6', mb: 1 }} />
                    <Typography variant="h4" color="#1E40AF">
                      {totalLessons}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      סה״כ שיעורים
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ bgcolor: '#F0FDF4' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 40, color: '#10B981', mb: 1 }} />
                    <Typography variant="h4" color="#059669">
                      {attendedLessons}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      נוכחות
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ bgcolor: '#FEF3F2' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Person sx={{ fontSize: 40, color: '#EF4444', mb: 1 }} />
                    <Typography variant="h4" color="#DC2626">
                      {attendanceRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      אחוז נוכחות
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* טבלת נוכחות */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>תאריך</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>קורס</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>קבוצה</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>סניף</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>מדריך</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>שעה</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>נוכחות</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((record, index) => (
                      <TableRow
                        key={record.attendanceId || index}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        sx={{
                          '&:nth-of-type(odd)': { bgcolor: 'rgba(59, 130, 246, 0.03)' },
                          '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' }
                        }}
                      >
                        <TableCell align="right">
                          {new Date(record.date).toLocaleDateString('he-IL')}
                        </TableCell>
                        <TableCell align="right">{record.courseName}</TableCell>
                        <TableCell align="right">{record.groupName}</TableCell>
                        <TableCell align="right">{record.branchName}</TableCell>
                        <TableCell align="right">{record.instructorName}</TableCell>
                        <TableCell align="right">{record.lessonTime}</TableCell>
                        <TableCell align="right">
                          <Chip
                            icon={record.isPresent ? <CheckCircle /> : <Cancel />}
                            label={record.isPresent ? 'נוכח' : 'נעדר'}
                            color={record.isPresent ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          לא נמצאו נתוני נוכחות עבור הפילטרים שנבחרו
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentAttendanceHistory;