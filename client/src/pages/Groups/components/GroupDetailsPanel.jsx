import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Container,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CakeIcon from '@mui/icons-material/Cake';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getGroupDetails } from '../../../store/group/groupGetDetailsThunk';



const GroupDetailsPanel = ({ groupId: propGroupId } = {}) => {
  const dispatch = useDispatch();
  const { groupId: routeGroupId } = useParams();
  const navigate = useNavigate();
  
  // Support both prop and route params
  const groupId = propGroupId || routeGroupId;
  
  const { groupDetails, groupDetailsLoading, groupDetailsError } = useSelector(state => state.groups || {});

  useEffect(() => {
    if (groupId) {
      dispatch(getGroupDetails(groupId));
    }
  }, [groupId, dispatch]);

  // Helper functions to safely extract data
  const group = groupDetails || {};
  const lessons = group.lessons || [];
  const students = group.students || [];

  const [lessonStats, setLessonStats] = useState({
    completed: 0,
    canceled: 0,
    future: 0,
    reported: 0,
    unreported: 0
  });

  useEffect(() => {
    if (lessons && lessons.length > 0) {
      const stats = {
        completed: lessons.filter(l => l.status === 'completed').length,
        canceled: lessons.filter(l => l.status === 'canceled').length,
        future: lessons.filter(l => l.status === 'future').length,
        reported: lessons.filter(l => l.isReported).length,
        unreported: lessons.filter(l => !l.isReported).length
      };
      setLessonStats(stats);
    }
  }, [lessons]);

  if (!group || !groupId) return null;

  if (groupDetailsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (groupDetailsError) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        שגיאה בטעינת פרטי הקבוצה: {typeof groupDetailsError === 'string' ? groupDetailsError : 'שגיאה לא ידועה'}
      </Alert>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'canceled':
        return 'error';
      case 'future':
        return 'info';
      case 'plus':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: 'בוצע',
      canceled: 'בוטל',
      future: 'עתידי',
      plus: 'השלמה'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '---';
    try {
      return new Date(dateString).toLocaleDateString('he-IL');
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '---';
    try {
      const d = new Date(dateString);
      return `${d.toLocaleDateString('he-IL')} ${d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '---';
    return timeString.substring(0, 5);
  };

  // Normalize server fields
  const courseName = group?.course?.couresName || group?.course?.courseName || group?.courseName || '---';
  const branchName = group?.branch?.name || group?.branchName || '---';
  const branchCity = group?.branch?.city || group?.branchCity || '---';
  const branchAddress = group?.branch?.address || group?.branchAddress || '---';
  const instructorFullName = (group?.instructor?.fullName)
    || [group?.instructor?.firstName, group?.instructor?.lastName].filter(Boolean).join(' ')
    || group?.instructorName
    || group?.instructorId
    || '---';
  const hourValue = group?.hour || group?.Hour || group?.schedule?.hour || '';

  const normalizedLessons = (lessons || []).map((l) => ({
    ...l,
    status: l.status || l.Status || 'future',
    isReported: l.isReported ?? l.IsReported ?? l.reported ?? false,
    lessonDate: l.lessonDate || l.LessonDate || l.date || l.Date,
    lessonHour: l.lessonHour || l.LessonHour || l.hour || l.Hour,
    createdAt: l.createdAt || l.CreatedAt,
    createdBy: l.createdBy || l.CreatedBy,
  }));

  const normalizedStudents = (students || []).map((s) => {
    const name = s.studentName
      || s.fullName
      || [s.firstName, s.lastName].filter(Boolean).join(' ');
    const age = s.age || s.Age || s.studentAge || null;
    const phone = s.phone || s.phoneNumber || s.mobile;
    const status = s.status || s.Status || s.studentStatus || 'פעיל';
    return {
      ...s,
      studentId: s.studentId || s.id || s.Id,
      studentName: name || '---',
      age: age,
      phone: phone || undefined,
      status: status,
    };
  });

  const remainingLessons = (group.numOfLessons || 0) - (group.lessonsCompleted || 0);
  const progressPercent = group.numOfLessons ? ((group.lessonsCompleted || 0) / group.numOfLessons) * 100 : 0;

  return (
      <Container maxWidth="lg"  sx={{ minHeight: '100vh',  px: 2, direction: 'rtl' }}>
        {/* כפתור חזרה - מופיע רק כשמשתמשים ב-route params */}
        {routeGroupId && (
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/classes-management')}
              sx={{ color: '#1976d2', fontWeight: 'bold', textTransform: 'none', fontSize: 16 }}
            >
              חזור לקבוצות
            </Button>
          </Box>
        )}

        {/* כותרת */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            borderRadius: 3,
            p: 3,
            mb: 3,
            boxShadow: '0 12px 40px rgba(25, 118, 210, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <GroupIcon sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {group.groupName}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {courseName} • {branchName}
            </Typography>
          </Box>
        </Box>

        {/* כרטיס מידע עיקרי */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: '#1976d2', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.12)' }}>
                <AssignmentIcon fontSize="small" />
              </Box>
              פרטי הקבוצה
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, background: '#f0f7ff', borderRadius: 2 }}>
                  <EventIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>קורס</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{courseName}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, background: '#f0f7ff', borderRadius: 2 }}>
                  <LocationOnIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>סניף</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{branchName}</Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {branchCity}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {branchAddress}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, background: '#f0f7ff', borderRadius: 2 }}>
                  <PersonIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>מדריך</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{instructorFullName}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, background: '#fff8f0', borderRadius: 2 }}>
                  <AccessTimeIcon sx={{ color: '#ff9800', fontSize: 28 }} />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>לוח זמנים</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{group.dayOfWeek || group.DayOfWeek || '---'}</Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>{formatTime(hourValue)}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, background: '#f0fff8', borderRadius: 2 }}>
                  <EventIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>טווח גילאים</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{group.ageRange || group.AgeRange || '---'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, background: '#f9f0ff', borderRadius: 2 }}>
                  <InfoIcon sx={{ color: '#9c27b0', fontSize: 28 }} />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>מגזר</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{group.sector || group.Sector || '---'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, background: '#fffbf0', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>תאריך התחלה</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{formatDate(group.startDate || group.StartDate)}</Typography>
                </Box>
              </Grid>
                        </Grid>
          </CardContent>
        </Card>

        {/* סיכום שיעורים */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: '#1976d2', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.12)' }}>
                <BarChartIcon fontSize="small" />
              </Box>
              סיכום שיעורים
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  התקדמות: {group.lessonsCompleted || 0} / {group.numOfLessons || 0}
                </Typography>
              </Box>
              <Box sx={{ position: 'relative' }}>
                <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 14, borderRadius: 7 }} />
                <Typography
                  variant="body2"
                  sx={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontWeight: 'bold',
                    color: '#0d47a1'
                  }}
                >
                  {Math.round(progressPercent)}%
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ background: '#e8f5e9', p: 2, borderRadius: 2, textAlign: 'center', boxShadow: 1 }}>
                  <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 32, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>הושלמו</Typography>
                  <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{lessonStats.completed}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ background: '#fff3e0', p: 2, borderRadius: 2, textAlign: 'center', boxShadow: 1 }}>
                  <ScheduleIcon sx={{ color: '#ff9800', fontSize: 32, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>עתידיים</Typography>
                  <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'bold' }}>{lessonStats.future}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ background: '#ffebee', p: 2, borderRadius: 2, textAlign: 'center', boxShadow: 1 }}>
                  <CancelIcon sx={{ color: '#f44336', fontSize: 32, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>בוטלו</Typography>
                  <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 'bold' }}>{lessonStats.canceled}</Typography>
                </Box>
    
    
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ background: '#f3e5f5', p: 2, borderRadius: 2, textAlign: 'center', boxShadow: 1 }}>
                  <InfoIcon sx={{ color: '#9c27b0', fontSize: 32, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>לא דווחו</Typography>
                  <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>{lessonStats.unreported}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ background: '#ede7f6', p: 2, borderRadius: 2, textAlign: 'center', boxShadow: 1 }}>
                  <EventIcon sx={{ color: '#673ab7', fontSize: 32, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>נותרו</Typography>
                  <Typography variant="h6" sx={{ color: '#673ab7', fontWeight: 'bold' }}>{remainingLessons}</Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ background: '#f5f5f5', p: 2, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>👥 מקומות בקבוצה:</strong> {(group.maxStudents || 0) + (normalizedStudents?.length || 0)} | פנויים: {group.maxStudents || 0}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* שיעורים */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: '#1976d2', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.12)' }}>
                <CalendarMonthIcon fontSize="small" />
              </Box>
              רשימת שיעורים ({normalizedLessons?.length || 0})
            </Typography>

            {/* Legend - הסטטוסים הקיימים */}
            <Box sx={{ mb: 2, p: 1.5, background: 'linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)', borderRadius: 1.5, border: '1px solid #ddd' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ fontWeight: '600', color: '#555', fontSize: '0.75rem' }}>
                  סטטוסים:
                </Typography>
                <Chip label="בוצע" color="success" size="small" variant="outlined" sx={{ height: 24, fontSize: '0.7rem' }} />
                <Chip label="עתידי" color="info" size="small" variant="outlined" sx={{ height: 24, fontSize: '0.7rem' }} />
                <Chip label="בוטל" color="error" size="small" variant="outlined" sx={{ height: 24, fontSize: '0.7rem' }} />
                <Chip label="השלמה" color="warning" size="small" variant="outlined" sx={{ height: 24, fontSize: '0.7rem' }} />
              </Box>
            </Box>

            <TableContainer sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ background: '#f0f0f0' }}>
                  <TableRow>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1976d2' }}>תאריך</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1976d2' }}>שעה</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1976d2' }}>סטטוס</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1976d2' }}>דווח</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1976d2' }}>נוצר על ידי</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {normalizedLessons && normalizedLessons.length > 0 ? (
                    normalizedLessons.map((lesson, idx) => (
                      <TableRow key={lesson.lessonId || idx} hover sx={{ '&:hover': { background: '#f9f9f9' } }}>
                        <TableCell align="right">{formatDate(lesson.lessonDate)}</TableCell>
                        <TableCell align="right">{formatTime(lesson.lessonHour)}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={getStatusLabel(lesson.status)}
                            color={getStatusColor(lesson.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {lesson.isReported ? (
                            <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                          ) : (
                            <CancelIcon sx={{ color: '#f44336', fontSize: 20 }} />
                          )}
                        </TableCell>
                        <TableCell align="right">{lesson.createdBy || '---'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                          אין שיעורים
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* תלמידים */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: '#1976d2', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.12)' }}>
                <GroupsIcon fontSize="small" />
              </Box>
              התלמידים הרשומים ({normalizedStudents?.length || 0})
            </Typography>
            {normalizedStudents && normalizedStudents.length > 0 ? (
              <Grid container spacing={2}>
                {normalizedStudents.map((student, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={student.studentId || idx}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        background: '#f9fbfd',
                        border: '1px solid #e4e9f2',
                        boxShadow: '0 12px 30px rgba(17, 24, 39, 0.06)'
                      }}
                    >
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1f2a60' }}>
                            {student.studentName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6071a1', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <BadgeIcon sx={{ fontSize: 16 }} /> {student.studentId}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, alignItems: 'center' }}>
                          {student.phone && (
                            <Chip
                              size="small"
                              icon={<PhoneIphoneIcon sx={{ fontSize: 16 }} />}
                              label={student.phone}
                              sx={{
                                background: '#eef2ff',
                                color: '#1f2a60',
                                fontWeight: 'bold'
                              }}
                            />
                          )}
                          {student.status && (
                            <Chip
                              size="small"
                              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                              label={student.status}
                              sx={{
                                background: '#d4edda',
                                color: '#155724',
                                fontWeight: 'bold'
                              }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="textSecondary">
                  אין תלמידים רשומים
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
  );
};

export default GroupDetailsPanel;
