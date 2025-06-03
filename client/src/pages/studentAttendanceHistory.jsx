
import React, { useState, useEffect } from 'react';
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
  const [attendanceData, setAttendanceData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);

  // פונקציה לטעינת נתוני נוכחות
  const fetchAttendanceHistory = async () => {
    if (!student?.id) return;

    setLoading(true);
    try {
      let url = `https://localhost:5248/api/attendance/student/${student.id}/history`;
      const params = new URLSearchParams();

      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
      } else {
        console.error('Failed to fetch attendance history');
        setAttendanceData([]);
      }
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לטעינת סיכום נוכחות
  const fetchAttendanceSummary = async () => {
    if (!student?.id) return;

    try {
      let url = `https://localhost:5248/api/attendance/student/${student.id}/summary`;
      const params = new URLSearchParams();

      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSummaryData(data);
      }
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    }
  };

  useEffect(() => {
    if (student?.id && open) {
      fetchAttendanceHistory();
      fetchAttendanceSummary();
    }
  }, [student, open, selectedMonth, selectedYear]);

  // סינון לפי קורס
  useEffect(() => {
    let filtered = attendanceData;

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
  const uniqueCourses = [...new Set(attendanceData.map(record => record.courseName))];

  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
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
        {/* פילטרים */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
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
            {/* סטטיסטיקות */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                          לא נמצאו נתוני נוכחות
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          נסה לשנות את הפילטרים או לבדוק שהתלמיד רשום לחוגים
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
