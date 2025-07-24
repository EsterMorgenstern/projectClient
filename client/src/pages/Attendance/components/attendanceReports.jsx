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
  Chip,
  FormControl,
  InputLabel,
  Select,
  Alert,
  IconButton,
  Divider,
  Slide
} from '@mui/material';
import {
  Assessment,
  Download,
  DateRange,
  Group,
  TrendingUp,
  TrendingDown,
  School,
  Analytics,
  BarChart,
  Close as CloseIcon,
  Refresh
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceReportsMonthly } from '../../../store/attendance/fetchAttendenceReportsMonthly';
import { fetchAttendanceReportsOverall } from '../../../store/attendance/fetchAttendanceReportsOverall';
import { fetchCourses } from '../../../store/course/CoursesGetAllThunk';
import { fetchBranches } from '../../../store/branch/branchGetAllThunk';
import { fetchGroups } from '../../../store/group/groupGellAllThunk';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const AttendanceReports = ({ open, onClose }) => {
  const dispatch = useDispatch();

  // Redux state
  const attendanceState = useSelector((state) => state.attendances);
  const coursesState = useSelector((state) => state.courses);
  const branchesState = useSelector((state) => state.branches);
  const groupsState = useSelector((state) => state.groups);

  // Local state
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [dataLoading, setDataLoading] = useState(false);

  // Derived state
  const reportData = reportType === 'monthly'
    ? attendanceState?.attendanceReportsMonthly
    : attendanceState?.attendanceReportsOverall;
  const loading = attendanceState?.loading || false;
  const error = attendanceState?.error;

  const courses = coursesState?.courses || [];
  const branches = branchesState?.branches || [];
  const groups = groupsState?.groups || [];

  // Filtered data
  const filteredBranches = selectedCourse
    ? branches.filter(branch =>
      groups.some(group =>
        group.courseId === parseInt(selectedCourse) &&
        group.branchId === branch.branchId
      )
    )
    : branches;

  const filteredGroups = groups.filter(group => {
    if (selectedCourse && group.courseId !== parseInt(selectedCourse)) return false;
    if (selectedBranch && group.branchId !== parseInt(selectedBranch)) return false;
    return true;
  });

  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Load basic data
  const loadBasicData = async () => {
    setDataLoading(true);
    try {
      await Promise.all([
        dispatch(fetchCourses()),
        dispatch(fetchBranches()),
        dispatch(fetchGroups())
      ]);
    } catch (error) {
      console.error('Error loading basic data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Load basic data on mount
  useEffect(() => {
    if (open && (courses.length === 0 || branches.length === 0 || groups.length === 0)) {
      loadBasicData();
    }
  }, [open]);

  // Handle course change
  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedBranch('');
    setSelectedGroup('');
  };

  // Handle branch change
  const handleBranchChange = (branchId) => {
    setSelectedBranch(branchId);
    setSelectedGroup('');
  };

  // Fetch report data
  const fetchReportData = async () => {
  try {
    if (reportType === 'monthly') {
      const params = {
        selectedMonth,
        selectedYear
      };
      if (selectedGroup) {
        params.groupId = selectedGroup;
      }
      await dispatch(fetchAttendanceReportsMonthly(params));
    } else if (reportType === 'overall') {
      await dispatch(fetchAttendanceReportsOverall({
        selectedMonth,
        selectedYear
      }));
    }
  } catch (error) {
    console.error('Error fetching report data:', error);
  }
};
//
const exportToExcel = () => {
  if (!reportData) {
    console.warn('אין נתונים לייצוא');
    return;
  }

  try {
    const workbook = XLSX.utils.book_new();
    
    if (reportType === 'monthly' && reportData.groups && Array.isArray(reportData.groups)) {
      // יצירת גיליון לנתוני קבוצות
      const groupsData = reportData.groups.map(group => ({
        'קבוצה': group.groupName,
        'קורס': group.courseName,
        'סניף': group.branchName,
        'תלמידים': group.totalStudents,
        'שיעורים': group.totalLessons,
        'אחוז נוכחות': `${group.averageAttendanceRate}%`
      }));
      
      const groupsWorksheet = XLSX.utils.json_to_sheet(groupsData);
      XLSX.utils.book_append_sheet(workbook, groupsWorksheet, 'נתוני קבוצות');
      
      // יצירת גיליון לסטטיסטיקות כלליות
      if (reportData.overallStatistics) {
        const statsData = [
          { 'פרמטר': 'סה״כ קבוצות', 'ערך': reportData.overallStatistics.totalGroups || 0 },
          { 'פרמטר': 'סה״כ תלמידים', 'ערך': reportData.overallStatistics.totalStudents || 0 },
          { 'פרמטר': 'סה״כ שיעורים', 'ערך': reportData.overallStatistics.totalLessons || 0 },
          { 'פרמטר': 'אחוז נוכחות כללי', 'ערך': `${reportData.overallStatistics.overallAttendanceRate || 0}%` }
        ];
        
        const statsWorksheet = XLSX.utils.json_to_sheet(statsData);
        XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'סטטיסטיקות כלליות');
      }
    } else if (reportType === 'overall') {
      // יצירת גיליון לדוח כללי
      const overallData = [
        { 'פרמטר': 'סה״כ קבוצות', 'ערך': reportData.totalGroups || 0 },
        { 'פרמטר': 'סה״כ תלמידים', 'ערך': reportData.totalStudents || 0 },
        { 'פרמטר': 'סה״כ שיעורים', 'ערך': reportData.totalLessons || 0 },
        { 'פרמטר': 'אחוז נוכחות כללי', 'ערך': `${reportData.overallAttendanceRate || 0}%` }
      ];
      
      const overallWorksheet = XLSX.utils.json_to_sheet(overallData);
      XLSX.utils.book_append_sheet(workbook, overallWorksheet, 'דוח כללי');
    }
    
    // יצירת שם קובץ
    const fileName = `דוח_נוכחות_${reportType === 'monthly' ? 'חודשי' : 'כללי'}_${monthNames[selectedMonth - 1]}_${selectedYear}.xlsx`;
    
    // שמירת הקובץ
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, fileName);
    
    console.log('הקובץ יוצא בהצלחה:', fileName);
  } catch (error) {
    console.error('שגיאה בייצוא לאקסל:', error);
  }
};
  const renderMonthlyReport = () => {
    if (!reportData) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* סטטיסטיקות כלליות */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card sx={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                border: '1px solid #93c5fd',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -15,
                  right: -15,
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  borderRadius: '50%',
                  opacity: 0.1
                }} />
                <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1, py: 2 }}>
                  <Group sx={{ fontSize: 32, color: '#1e40af', mb: 1 }} />
                  <Typography variant="h4" color="#1e40af" fontWeight="bold">
                    {reportData.overallStatistics?.totalGroups || 0}
                  </Typography>
                  <Typography variant="body2" color="#1e40af" fontWeight="medium">
                    קבוצות
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card sx={{
                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                border: '1px solid #86efac',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -15,
                  right: -15,
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  opacity: 0.1
                }} />
                <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1, py: 2 }}>
                  <Assessment sx={{ fontSize: 32, color: '#059669', mb: 1 }} />
                  <Typography variant="h4" color="#059669" fontWeight="bold">
                    {reportData.overallStatistics?.totalStudents || 0}
                  </Typography>
                  <Typography variant="body2" color="#059669" fontWeight="medium">
                    תלמידים
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card sx={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                border: '1px solid #fca5a5',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -15,
                  right: -15,
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '50%',
                  opacity: 0.1
                }} />
                <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1, py: 2 }}>
                  <DateRange sx={{ fontSize: 32, color: '#dc2626', mb: 1 }} />
                  <Typography variant="h4" color="#dc2626" fontWeight="bold">
                    {reportData.overallStatistics?.totalLessons || 0}
                  </Typography>
                  <Typography variant="body2" color="#dc2626" fontWeight="medium">
                    שיעורים
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={3}>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card sx={{
                background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
                border: '1px solid #facc15',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -15,
                  right: -15,
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '50%',
                  opacity: 0.1
                }} />
                <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1, py: 2 }}>
                  <TrendingUp sx={{ fontSize: 32, color: '#d97706', mb: 1 }} />
                  <Typography variant="h4" color="#d97706" fontWeight="bold">
                    {reportData.overallStatistics?.overallAttendanceRate || 0}%
                  </Typography>
                  <Typography variant="body2" color="#d97706" fontWeight="medium">
                    אחוז נוכחות כללי
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* טבלת קבוצות */}
        {reportData.groups && Array.isArray(reportData.groups) && reportData.groups.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              background: 'white',
              border: '1px solid #e2e8f0'
            }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 2.5,
                textAlign: 'center'
              }}>
                <Analytics sx={{ fontSize: 28, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  פירוט נתוני הקבוצות
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  {monthNames[selectedMonth - 1]} {selectedYear}
                </Typography>
              </Box>

              <TableContainer sx={{ maxHeight: '400px' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          background: '#f8fafc',
                          borderBottom: '2px solid #667eea',
                          color: '#1e293b'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
                          <Group sx={{ color: '#667eea', fontSize: 18 }} />
                          קבוצה
                      </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          background: '#f8fafc',
                          borderBottom: '2px solid #667eea',
                          color: '#1e293b'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
                          <School sx={{ color: '#667eea', fontSize: 18 }} />
                          קורס
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          background: '#f8fafc',
                          borderBottom: '2px solid #667eea',
                          color: '#1e293b'
                        }}
                      >
                        סניף
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          background: '#f8fafc',
                          borderBottom: '2px solid #667eea',
                          color: '#1e293b'
                        }}
                      >
                        תלמידים
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          background: '#f8fafc',
                          borderBottom: '2px solid #667eea',
                          color: '#1e293b'
                        }}
                      >
                        שיעורים
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          background: '#f8fafc',
                          borderBottom: '2px solid #667eea',
                          color: '#1e293b'
                        }}
                      >
                        אחוז נוכחות
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.groups.map((group, index) => (
                      <motion.tr
                        key={group.groupId}
                        component={TableRow}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{ backgroundColor: 'rgba(102, 126, 234, 0.05)' }}
                        sx={{
                          '&:nth-of-type(even)': {
                            backgroundColor: 'rgba(248, 250, 252, 0.8)'
                          },
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Typography fontWeight="medium" color="#1e293b">
                            {group.groupName}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Typography color="#475569">
                            {group.courseName}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Typography color="#475569">
                            {group.branchName}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Chip
                            label={group.totalStudents}
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                              color: '#3730a3',
                              fontWeight: 'bold',
                              borderRadius: '12px'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Chip
                            label={group.totalLessons}
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                              color: '#92400e',
                              fontWeight: 'bold',
                              borderRadius: '12px'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Chip
                            label={`${group.averageAttendanceRate}%`}
                            size="small"
                            color={
                              group.averageAttendanceRate >= 90 ? 'success' :
                                group.averageAttendanceRate >= 75 ? 'primary' :
                                  group.averageAttendanceRate >= 60 ? 'warning' : 'error'
                            }
                            sx={{
                              fontWeight: 'bold',
                              borderRadius: '12px'
                            }}
                          />
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{
              textAlign: 'center',
              py: 6,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: 3,
              border: '2px dashed #cbd5e1'
            }}>
              <Analytics sx={{ fontSize: 64, color: '#64748b', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" fontWeight="bold">
                אין נתוני קבוצות להצגה
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                לא נמצאו נתונים עבור התקופה הנבחרת
              </Typography>
            </Box>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderOverallReport = () => {
    if (!reportData || typeof reportData !== 'object') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{
            textAlign: 'center',
            py: 8,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: 3,
            border: '2px dashed #cbd5e1'
          }}>
            <Analytics sx={{ fontSize: 80, color: '#64748b', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" fontWeight="bold">
              אין נתונים להצגה
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              בחר פרמטרים ולחץ על "עדכן דוח" כדי לראות את הנתונים
            </Typography>
          </Box>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0'
            }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 3,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -30,
                  left: -30,
                  width: 120,
                  height: 120,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }} />
                <Analytics sx={{ fontSize: 40, mb: 1.5, position: 'relative', zIndex: 1 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ position: 'relative', zIndex: 1 }}>
                  סטטיסטיקות כלליות
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 0.5, position: 'relative', zIndex: 1 }}>
                  {monthNames[selectedMonth - 1]} {selectedYear}
                </Typography>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2.5,
                      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                      borderRadius: 2,
                      border: '1px solid #93c5fd'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Group sx={{ color: '#1e40af', fontSize: 24 }} />
                        <Typography variant="h6" fontWeight="600" color="#1e40af">
                          סה״כ קבוצות:
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" color="#1e40af">
                        {reportData.totalGroups || 0}
                      </Typography>
                    </Box>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2.5,
                      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                      borderRadius: 2,
                      border: '1px solid #86efac'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <School sx={{ color: '#059669', fontSize: 24 }} />
                        <Typography variant="h6" fontWeight="600" color="#059669">
                          סה״כ תלמידים:
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" color="#059669">
                        {reportData.totalStudents || 0}
                      </Typography>
                    </Box>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2.5,
                      background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                      borderRadius: 2,
                      border: '1px solid #fca5a5'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DateRange sx={{ color: '#dc2626', fontSize: 24 }} />
                        <Typography variant="h6" fontWeight="600" color="#dc2626">
                          סה״כ שיעורים:
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" color="#dc2626">
                        {reportData.totalLessons || 0}
                      </Typography>
                    </Box>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2.5,
                      background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
                      borderRadius: 2,
                      border: '1px solid #facc15'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TrendingUp sx={{ color: '#d97706', fontSize: 24 }} />
                        <Typography variant="h6" fontWeight="600" color="#d97706">
                          אחוז נוכחות כללי:
                        </Typography>
                      </Box>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Chip
                          label={`${reportData.overallAttendanceRate || 0}%`}
                          color={
                            (reportData.overallAttendanceRate || 0) >= 90 ? 'success' :
                              (reportData.overallAttendanceRate || 0) >= 75 ? 'primary' :
                                (reportData.overallAttendanceRate || 0) >= 60 ? 'warning' : 'error'
                          }
                          sx={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            px: 2,
                            py: 1.5,
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}
                        />
                      </motion.div>
                    </Box>
                  </motion.div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      TransitionComponent={Transition}
      sx={{
        direction: 'rtl',
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          minHeight: '80vh',
          maxHeight: '95vh',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2.5,
          px: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
          <Assessment sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              דוחות נוכחות
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              ניתוח וסטטיסטיקות מתקדמות
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            background: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
              transform: 'rotate(90deg)'
            },
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, background: '#f8fafc' }}>
        <Box sx={{ p: 3 }}>
          {/* הודעת שגיאה אם יש */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    שגיאה בטעינת הנתונים
                  </Typography>
                  <Typography variant="body2">
                    {typeof error === 'string' ? error : 'אירעה שגיאה לא צפויה'}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    onClick={loadBasicData}
                    disabled={dataLoading}
                    variant="contained"
                    color="warning"
                    size="small"
                    startIcon={dataLoading ? <CircularProgress size={16} /> : <Refresh />}
                    sx={{ borderRadius: 2 }}
                  >
                    {dataLoading ? 'טוען...' : 'נסה שוב'}
                  </Button>
                </Box>
              </Alert>
            </motion.div>
          )}

          {/* פילטרים מעוצבים */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{
                  color: '#1e293b',
                  fontWeight: 'bold',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <BarChart sx={{ color: '#667eea' }} />
                  פילטרים ובחירת נתונים
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={2}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="סוג דוח"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          background: 'white',
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    >
                      <MenuItem value="monthly">דוח חודשי</MenuItem>
                      <MenuItem value="overall">סטטיסטיקות כלליות</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="שנה"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          background: 'white',
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
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
                     
                      size="small"
                      label="חודש"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      sx={{
                        minWidth: 120,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          background: 'white',
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                      }}
                    >
                      {monthNames.map((month, index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                          {month}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* בחירת חוג */}
                  {reportType === 'monthly' && (
                    <>
                      <Grid item xs={12} md={2} sx={{minWidth: 70}}>
                        <FormControl fullWidth size="small">
                          <InputLabel>חוג</InputLabel>
                          <Select
                            value={selectedCourse}
                            onChange={(e) => handleCourseChange(e.target.value)}
                            label="חוג"
                            sx={{
                              borderRadius: 2,
                              background: 'white',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#667eea',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#667eea',
                              },
                            }}
                          >
                            <MenuItem value="">כל החוגים</MenuItem>
                            {courses.map(course => (
                              <MenuItem key={course.courseId} value={course.courseId}>
                            {course.couresName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* בחירת סניף */}
                      <Grid item xs={12} md={2} sx={{minWidth: 80}}>
                        <FormControl fullWidth size="small" disabled={!selectedCourse}>
                          <InputLabel>סניף</InputLabel>
                          <Select
                            value={selectedBranch}
                            onChange={(e) => handleBranchChange(e.target.value)}
                            label="סניף"
                            sx={{
                              borderRadius: 2,
                              background: selectedCourse ? 'white' : '#f1f5f9',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: selectedCourse ? '#667eea' : '#cbd5e1',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: selectedCourse ? '#667eea' : '#cbd5e1',
                              },
                            }}
                          >
                            <MenuItem value="">כל הסניפים</MenuItem>
                            {filteredBranches.map(branch => (
                              <MenuItem key={branch.branchId} value={branch.branchId}>
                                {branch.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* בחירת קבוצה */}
                      <Grid item xs={12} md={2} sx={{minWidth: 80}}>
                        <FormControl fullWidth size="small" disabled={!selectedCourse}>
                          <InputLabel>קבוצה</InputLabel>
                          <Select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            label="קבוצה"
                            sx={{
                              borderRadius: 2,
                              background: selectedCourse ? 'white' : '#f1f5f9',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: selectedCourse ? '#667eea' : '#cbd5e1',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: selectedCourse ? '#667eea' : '#cbd5e1',
                              },
                            }}
                          >
                            <MenuItem value="">כל הקבוצות</MenuItem>
                            {filteredGroups.map(group => (
                              <MenuItem key={group.groupId} value={group.groupId}>
                                {group.groupName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                </Grid>

                {/* כפתור עדכון דוח */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={fetchReportData}
                    disabled={Boolean(loading)}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Assessment />}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '12px',
                      px: 3,
                      py: 1,
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                        transform: 'translateY(-1px)'
                      },
                      '&:disabled': {
                        background: '#e2e8f0',
                        color: '#94a3b8',
                        boxShadow: 'none'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {loading ? 'טוען נתונים...' : 'עדכן דוח'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* תוכן הדוח */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 6,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: 3,
                  border: '2px dashed #cbd5e1'
                }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <CircularProgress size={48} sx={{ color: '#667eea', mb: 2 }} />
                  </motion.div>
                  <Typography variant="h6" sx={{ color: '#475569', fontWeight: '600' }}>
                    טוען נתונים...
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                    אנא המתן בזמן שאנחנו מכינים את הדוח עבורך
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {reportType === 'monthly' && renderMonthlyReport()}
                {reportType === 'overall' && renderOverallReport()}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </DialogContent>

      <Divider sx={{ background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)' }} />

      <DialogActions sx={{
        p: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        justifyContent: 'center',
        gap: 2
      }}>
        <Button
          startIcon={<Download />}
          variant="contained"
          color="success"
          disabled={!reportData || Boolean(loading)}
          onClick={exportToExcel}
          sx={{
            borderRadius: '12px',
            px: 3,
            py: 1,
            fontSize: '0.9rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
              transform: 'translateY(-1px)'
            },
            '&:disabled': {
              background: '#e2e8f0',
              color: '#94a3b8',
              boxShadow: 'none'
            },
            transition: 'all 0.2s ease'
          }}
        >
          ייצא לאקסל
        </Button>

        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: '12px',
            px: 3,
            py: 1,
            fontSize: '0.9rem',
            fontWeight: '600',
            borderWidth: '2px',
            borderColor: '#667eea',
            color: '#667eea',
            '&:hover': {
              borderWidth: '2px',
              borderColor: '#5a67d8',
              background: 'rgba(102, 126, 234, 0.05)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceReports;
