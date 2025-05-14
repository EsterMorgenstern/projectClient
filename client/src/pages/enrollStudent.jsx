import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Container,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
  recomposeColor
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  School as CourseIcon,
  LocationOn as BranchIcon,
  Group as GroupIcon,
  PersonAdd as EnrollIcon,
  ArrowBack as BackIcon,
  Event as ScheduleIcon,
  Person as StudentIcon,
  CheckCircle as AvailableIcon,
  Cancel as FullIcon
} from '@mui/icons-material';
import { fetchCourses } from '../store/course/CoursesGetAllThunk';
import { fetchBranches } from '../store/branch/branchGetAllThunk';
import { getGroupsByCourseId } from '../store/group/groupGetGroupsByCourseIdThunk';
import { getStudentById } from '../store/student/studentGetByIdThunk';

const EnrollStudent = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Redux state
  const courses = useSelector(state => state.courses.courses || []);
  const branches = useSelector(state => state.branches.branches || []);
  const groups = useSelector(state => state.groups.groupsByCourseId || []);
  const loading = useSelector(state =>
    state.courses.loading ||
    state.branches.loading ||
    state.groups.loading
  );

  // Local state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [view, setView] = useState('courses'); // courses, branches, groups

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchBranches());
    }
  }, [selectedCourse, dispatch]);

  useEffect(() => {
    if (selectedCourse && selectedBranch) {
      dispatch(getGroupsByCourseId(selectedCourse.courseId));
      debugger
    }
  }, [selectedBranch, selectedCourse, dispatch]);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedBranch(null);
    setSelectedGroup(null);
    setView('branches');
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setView('groups');
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    if (group.maxStudents > 0) {
      setEnrollDialogOpen(true);
    } else {
      setNotification({
        open: true,
        message: 'אין מקומות פנויים בקבוצה זו',
        severity: 'error'
      });
    }
  };

  const handleEnrollStudent = async() => {
    if (!studentId.trim()) {
      setNotification({
        open: true,
        message: 'נא להזין מספר תעודת זהות',
        severity: 'error'
      });
      return;
    }


    setEnrollDialogOpen(false);
    setStudentId('');
    setNotification({
      open: true,
      message: 'התלמיד נרשם בהצלחה לחוג',
      severity: 'success'
    });
  };

  const handleBack = () => {
    if (view === 'groups') {
      setView('branches');
      setSelectedGroup(null);
    } else if (view === 'branches') {
      setView('courses');
      setSelectedBranch(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
 const handleGetStudentById=async()=>{
   await dispatch(getStudentById(studentId))  ;
 }
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Render course cards
  const renderCourses = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Grid container spacing={3} justifyContent="center">
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={3}
                component={motion.div}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
                onClick={() => handleCourseSelect(course)}
              >
                <CourseIcon sx={{ fontSize: 60, color: '#3B82F6', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" textAlign="center" color="#1E3A8A">
                  {course.couresName}
                </Typography>
                <Divider sx={{ width: '80%', my: 2 }} />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {course.description || 'קורס מקצועי לכל הגילאים'}
                </Typography>
                <Chip
                  label={`${course.totalGroups || 'מספר'} קבוצות`}
                  color="primary"
                  size="small"
                  sx={{ mt: 2 }}
                />
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  // Render branch cards
  const renderBranches = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleBack}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          חזרה לחוגים
        </Button>
        <Typography variant="h5" fontWeight="bold" color="#1E3A8A">
          {selectedCourse?.name} - בחר סניף
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {branches.map((branch) => (
          <Grid item xs={12} sm={6} md={4} key={branch.id}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={3}
                component={motion.div}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
                onClick={() => handleBranchSelect(branch)}
              >
                <BranchIcon sx={{ fontSize: 50, color: '#10B981', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" textAlign="center" color="#1E3A8A">
                  {branch.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                  {branch.address}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {branch.groupsCount || 'מספר'} קבוצות זמינות
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  // Render group cards
  const renderGroups = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleBack}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          חזרה לסניפים
        </Button>
        <Typography variant="h5" fontWeight="bold" color="#1E3A8A">
          {selectedCourse?.name} - {selectedBranch?.name} - בחר קבוצה
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {groups.filter(group => group.branchId === selectedBranch?.branchId).map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={3}
                component={motion.div}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  background: group.availableSpots > 0
                    ? 'linear-gradient(135deg, #ffffff 0%, #f0fff4 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #fff0f0 100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => handleGroupSelect(group)}
              >
                {group.availableSpots <= 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: 'error.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      transform: 'rotate(0deg)',
                      zIndex: 1
                    }}
                  >
                    מלא
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GroupIcon sx={{ fontSize: 40, color: '#6366F1', mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="#1E3A8A">
                    קבוצה {group.groupName}
                  </Typography>
                </Box>

                <Divider sx={{ width: '100%', mb: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ScheduleIcon fontSize="small" sx={{ color: '#6366F1', mr: 1 }} />
                  <Typography variant="body2">
                    {group.hour} {group.dayOfWeek}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StudentIcon fontSize="small" sx={{ color: '#6366F1', mr: 1 }} />
                  <Typography variant="body2">
                    גילאים: {group.ageRange }
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 'auto', pt: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    icon={group.maxStudents > 0 ? <AvailableIcon /> : <FullIcon />}
                    label={`${group.maxStudents } מקומות פנויים`}
                    color={group.maxStudents > 0 ? "success" : "error"}
                    variant="outlined"
                    size="small"
                  />

                  <Tooltip title={group.maxStudents > 0 ? "לחץ לשיבוץ תלמיד" : "אין מקומות פנויים"}>
                    <span>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={group.maxStudents <= 0}
                        startIcon={<EnrollIcon />}
                        sx={{
                          bgcolor: group.maxStudents > 0 ? '#10B981' : 'grey.400',
                          '&:hover': {
                            bgcolor: group.maxStudents > 0 ? '#059669' : 'grey.400',
                          }
                        }}
                      >
                        שבץ
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          padding: { xs: 2, md: 4 },
          background: 'linear-gradient(to right, #e0f2fe, #f8fafc)',
          minHeight: '100vh',
          borderRadius: 2,
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant={isMobile ? "h4" : "h3"}
            sx={{
              fontWeight: 'bold',
              color: '#1E3A8A',
              mb: 1,
              fontFamily: 'Heebo, sans-serif',
              textAlign: 'center',
            }}
          >
            שיבוץ תלמידים לחוגים
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#334155',
              textAlign: 'center',
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            בחר חוג, סניף וקבוצה כדי לשבץ תלמיד בקלות ובמהירות
          </Typography>
        </motion.div>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: view === 'courses' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: view === 'courses' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'courses' && renderCourses()}
              {view === 'branches' && renderBranches()}
              {view === 'groups' && renderGroups()}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Enrollment Dialog */}
        <Dialog
          open={enrollDialogOpen}
          onClose={() => setEnrollDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: { xs: '90%', sm: '400px' }
            }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#1E3A8A', color: 'white', textAlign: 'center' }}>
            שיבוץ תלמיד לחוג
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 ,direction:'rtl'}}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                פרטי החוג:
              </Typography>
              <Typography variant="body2">
                <strong>חוג:</strong> {selectedCourse?.courseName}
              </Typography>
              <Typography variant="body2">
                <strong>סניף:</strong> {selectedBranch?.name}
              </Typography>
              <Typography variant="body2">
                <strong>קבוצה:</strong> {selectedGroup?.groupName}
              </Typography>
              <Typography variant="body2">
                <strong>מגזר:</strong> {selectedGroup?.sector}
              </Typography>
              <Typography variant="body2">
                <strong>מקומות פנויים:</strong> {selectedGroup?.maxStudents}
              </Typography>
            </Box>

            <TextField
              autoFocus
              margin="dense"
              id="studentId"
              label="מספר תעודת זהות של התלמיד"
              type="text"
              fullWidth
              variant="outlined"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              sx={{ mt: 2 }}
              inputProps={{ dir: 'rtl' }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
            <Button
              onClick={() => setEnrollDialogOpen(false)}
              variant="outlined"
              color="error"
            >
              ביטול
            </Button>
            <Button
            //handleGetStudentById
              onClick={()=>{handleEnrollStudent}}
              variant="contained"
              color="primary"
              startIcon={<EnrollIcon />}
            >
              שבץ תלמיד
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default EnrollStudent;
