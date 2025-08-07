import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceHistory } from '../../../store/attendance/fetchAttendanceHistory';
import { fetchStudentAttendanceSummary } from '../../../store/attendance/fetchStudentAttendanceSummary';
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
  Divider
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

const StudentAttendanceHistory = ({ open, onClose, student, embedded = false }) => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);

  const attendanceData = useSelector((state) => state.attendances.attendanceData);
  const attendanceSummary = useSelector((state) => state.attendances.attendanceSummary);
  const loading = useSelector((state) => state.attendances.loading);

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

  // פונקציה לפתיחת דיאלוג מחיקת נוכחות
  const handleDeleteClick = (attendanceId) => {
    setSelectedAttendanceId(attendanceId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteAttendance(selectedAttendanceId));
    setOpenDialog(false);
    setSelectedAttendanceId(null);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setSelectedAttendanceId(null);
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
    if (student?.id && (open || embedded)) {
      fetchAttendanceHistoryData();
      fetchAttendanceSummaryData();
    }
  }, [student, open, embedded, selectedMonth, selectedYear]);

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

  // פונקציה לרינדור התוכן
  const renderAttendanceContent = () => {
    return (
      <Box sx={{ width: '100%' }}>
        {/* פילטרים */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth

                label="בחר שנה"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                size={embedded ? "small" : "medium"}
                sx={{
                  width: '110px',
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
                size={embedded ? "small" : "medium"}
                sx={{
                  width: '110px',

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
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="בחר קורס"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                size={embedded ? "small" : "medium"}
                sx={{
                  width: '110px',

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
                onClick={handleRefreshData}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                sx={{
                  height: embedded ? '40px' : '56px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // ✅ סגול במקום כתום
                  borderRadius: '12px',
                  fontWeight: 'medium',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
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
            {/* סטטיסטיקות - עיצוב אחיד */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
              <Card sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // ✅ ירוק
                color: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ textAlign: 'center', py: embedded ? 1.5 : 2 }}>
                  <School sx={{ fontSize: embedded ? 32 : 40, mb: 1 }} />
                  <Typography variant={embedded ? "h5" : "h4"} fontWeight="bold">
                    {totalLessons}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    סה״כ שיעורים
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', // ✅ כחול
                color: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ textAlign: 'center', py: embedded ? 1.5 : 2 }}>
                  <CheckCircle sx={{ fontSize: embedded ? 32 : 40, mb: 1 }} />
                  <Typography variant={embedded ? "h5" : "h4"} fontWeight="bold">
                    {attendedLessons}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    נוכחות
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // ✅ סגול
                color: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ textAlign: 'center', py: embedded ? 1.5 : 2 }}>
                  <Person sx={{ fontSize: embedded ? 32 : 40, mb: 1 }} />
                  <Typography variant={embedded ? "h5" : "h4"} fontWeight="bold">
                    {attendanceRate}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    אחוז נוכחות
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* טבלת נוכחות - עיצוב אחיד עם טבלת החוגים */}
            <Card sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
              background: 'white',
              border: '1px solid rgba(0,0,0,0.08)'
            }}>
              <TableContainer sx={{ maxHeight: embedded ? '300px' : '400px' }}>
                <Table stickyHeader size={embedded ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: embedded ? '0.9rem' : '1rem',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          py: 2,
                          textAlign: 'right',
                          direction: 'rtl',
                          borderBottom: '2px solid #8b5cf6' // ✅ גבול סגול
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: 1,
                          direction: 'rtl'
                        }}>
                          <CalendarToday sx={{ color: '#8b5cf6', fontSize: 18 }} />
                          <Typography sx={{ fontWeight: 'bold' }}>תאריך</Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: embedded ? '0.9rem' : '1rem',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          py: 2,
                          textAlign: 'right',
                          direction: 'rtl',
                          borderBottom: '2px solid #8b5cf6'
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: 1,
                          direction: 'rtl'
                        }}>
                          <School sx={{ color: '#8b5cf6', fontSize: 18 }} />
                          <Typography sx={{ fontWeight: 'bold' }}>קורס</Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: embedded ? '0.9rem' : '1rem',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          py: 2,
                          textAlign: 'right',
                          direction: 'rtl',
                          borderBottom: '2px solid #8b5cf6'
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: 1,
                          direction: 'rtl'
                        }}>
                          <GroupIcon sx={{ color: '#8b5cf6', fontSize: 18 }} />
                          <Typography sx={{ fontWeight: 'bold' }}>קבוצה</Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: embedded ? '0.9rem' : '1rem',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          py: 2,
                          textAlign: 'right',
                          direction: 'rtl',
                          borderBottom: '2px solid #8b5cf6'
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: 1,
                          direction: 'rtl'
                        }}>
                          <LocationIcon sx={{ color: '#8b5cf6', fontSize: 18 }} />
                          <Typography sx={{ fontWeight: 'bold' }}>סניף</Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: embedded ? '0.9rem' : '1rem',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          py: 2,
                          textAlign: 'right',
                          direction: 'rtl',
                          borderBottom: '2px solid #8b5cf6'
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: 1,
                          direction: 'rtl'
                        }}>
                          <Person sx={{ color: '#8b5cf6', fontSize: 18 }} />
                          <Typography sx={{ fontWeight: 'bold' }}>מדריך</Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: embedded ? '0.9rem' : '1rem',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          py: 2,
                          textAlign: 'right',
                          direction: 'rtl',
                          borderBottom: '2px solid #8b5cf6'
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: 1,
                          direction: 'rtl'
                        }}>
                          <ScheduleIcon sx={{ color: '#8b5cf6', fontSize: 18 }} />
                          <Typography sx={{ fontWeight: 'bold' }}>שעה</Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: embedded ? '0.9rem' : '1rem',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          py: 2,
                          textAlign: 'right',
                          direction: 'rtl',
                          borderBottom: '2px solid #8b5cf6'
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: 1,
                          direction: 'rtl'
                        }}>
                          <CheckCircle sx={{ color: '#8b5cf6', fontSize: 18 }} />
                          <Typography sx={{ fontWeight: 'bold' }}>נוכחות</Typography>
                        </Box>
                      </TableCell>

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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <DeleteIcon sx={{ color: '#8b5cf6', fontSize: 18 }} />
                          <Typography sx={{ fontWeight: 'bold' }}>מחיקה</Typography>
                        </Box>
                      </TableCell>
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
                            '&:nth-of-type(even)': { backgroundColor: 'rgba(139, 92, 246, 0.03)' }, // ✅ סגול עדין
                            '&:hover': {
                              backgroundColor: 'rgba(139, 92, 246, 0.08)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <TableCell align="right" sx={{ py: embedded ? 1.5 : 2 }}>
                            <Typography sx={{
                              fontWeight: 'medium',
                              fontSize: embedded ? '0.85rem' : '1rem',
                              color: '#1e293b'
                            }}>
                              {new Date(record.date).toLocaleDateString('he-IL')}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: embedded ? 1.5 : 2 }}>
                            <Typography sx={{
                              fontWeight: 'medium',
                              fontSize: embedded ? '0.85rem' : '1rem',
                              color: '#1e293b'
                            }}>
                              {record.courseName}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: embedded ? 1.5 : 2 }}>
                            <Chip
                              label={record.groupName}
                              size={embedded ? "small" : "medium"}
                              sx={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', // ✅ כחול
                                color: 'white',
                                fontWeight: 'medium',
                                borderRadius: '12px',
                                fontSize: embedded ? '0.75rem' : '0.875rem'
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ py: embedded ? 1.5 : 2 }}>
                            <Typography sx={{ fontSize: embedded ? '0.85rem' : '1rem' }}>
                              {record.branchName}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ py: embedded ? 1.5 : 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
                              <Avatar sx={{
                                width: embedded ? 28 : 32,
                                height: embedded ? 28 : 32,
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // ✅ ירוק
                                color: 'white',
                                fontSize: embedded ? '0.75rem' : '0.875rem',
                                fontWeight: 'bold'
                              }}>
                                {record.instructorName?.charAt(0)}
                              </Avatar>
                              <Typography sx={{ fontSize: embedded ? '0.8rem' : '0.9rem' }}>
                                {record.instructorName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ py: embedded ? 1.5 : 2 }}>
                            <Box sx={{
                              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // ✅ כתום לשעות
                              borderRadius: '8px',
                              p: embedded ? 0.8 : 1,
                              textAlign: 'center',
                              color: 'white',
                              minWidth: '60px'
                            }}>
                              <Typography sx={{
                                fontWeight: 'bold',
                                fontSize: embedded ? '0.75rem' : '0.85rem'
                              }}>
                                {record.lessonTime}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ py: embedded ? 1.5 : 2 }}>
                            <Chip
                              icon={record.isPresent ? <CheckCircle sx={{ fontSize: embedded ? 16 : 18 }} /> : <Cancel sx={{ fontSize: embedded ? 16 : 18 }} />}
                              label={record.isPresent ? 'נוכח' : 'נעדר'}
                              color={record.isPresent ? 'success' : 'error'}
                              size={embedded ? "small" : "medium"}
                              variant="outlined"
                              sx={{
                                fontSize: embedded ? '0.75rem' : '0.875rem',
                                fontWeight: 'medium'
                              }}
                            />
                          </TableCell>
                           <TableCell align="center" sx={{ py: embedded ? 1.5 : 2 }}>
          <DeleteIcon
            color="error"
            sx={{ cursor: 'pointer', fontSize: embedded ? 20 : 24 }}
            onClick={() => handleDeleteClick(record.attendanceId)}
          />
        </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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
                        <TableCell align="center" sx={{ py: embedded ? 1.5 : 2 }}>
                          <DeleteIcon
                            color="error"
                            sx={{ cursor: 'pointer', fontSize: embedded ? 20 : 24 }}
                            onClick={() => handleDeleteClick(record.attendanceId)}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </>
        )}
        {/* דיאלוג אישור מחיקה */}
        <Dialog open={openDialog} onClose={handleCancel} sx={{ direction: 'rtl' }}>
          <DialogTitle>האם למחוק את הנוכחות בתאריך זה?</DialogTitle>
          <DialogActions>
            <Button onClick={handleCancel}>ביטול</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              מחק
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
    </Dialog>

  );
};

export default StudentAttendanceHistory;











