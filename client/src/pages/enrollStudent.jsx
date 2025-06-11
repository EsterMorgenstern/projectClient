import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel

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
  Cancel as FullIcon,
  Add as AddIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Diversity3 as SectorIcon,
  CalendarMonth as DayIcon,
  LocationOn
} from '@mui/icons-material';
import { fetchCourses } from '../store/course/CoursesGetAllThunk';
import { fetchBranches } from '../store/branch/branchGetAllThunk';
import { getGroupsByCourseId } from '../store/group/groupGetGroupsByCourseIdThunk';
import { groupStudentAddThunk } from '../store/groupStudent/groupStudentAddThunk';
import { getgroupStudentByStudentId } from '../store/groupStudent/groupStudentGetByStudentIdThunk';
import { addCourse } from '../store/course/courseAddThunk';
import { addBranch } from '../store/branch/branchAddThunk';
import { addGroup } from '../store/group/groupAddThunk';
import StudentCoursesDialog from './studentCoursesDialog';
import { getStudentById } from '../store/student/studentGetByIdThunk';
const EnrollStudent = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  // Redux state
  const courses = useSelector(state => state.courses.courses || []);
  const branches = useSelector(state => state.branches.branches || []);
  const groups = useSelector(state => state.groups.groupsByCourseId || []);
  const groupStudents = useSelector(state => state.groupStudents.groupStudentById || []);
  const loading = useSelector(state =>
    state.courses.loading ||
    state.branches.loading ||
    state.groups.loading ||
    state.groupStudents.loading
  );

  // Local state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [view, setView] = useState('courses'); // courses, branches, groups
  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
  const [addBranchDialogOpen, setAddBranchDialogOpen] = useState(false);
  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
  const [studentCoursesDialog, setStudentCoursesDialog] = useState(false);
  const [viewCoursesDialog, setViewCoursesDialog] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);
  const [selectedStudentCourses, setSelectedStudentCourses] = useState([]);

  const [studentCourses, setStudentCourses] = useState([]);
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [studentGroupData, setStudentGroupData] = useState({
    studentId: 0,
    groupId: null,
    entrollmentDate: new Date(Date.now()).toLocaleDateString('he-IL'),
    isActive: true
  });
const [studentCoursesDialogOpen, setStudentCoursesDialogOpen] = useState(false);
const [selectedStudentForDialog, setSelectedStudentForDialog] = useState(null);
const [selectedStudentCoursesForDialog, setSelectedStudentCoursesForDialog] = useState([]);

  // State for new course, branch, and group
  const [newCourse, setNewCourse] = useState({ couresName: '', description: '' });
  const [newBranch, setNewBranch] = useState({ name: '', address: '', city: '' });
  const [newGroup, setNewGroup] = useState({
    groupName: '',
    dayOfWeek: '',
    hour: '',
    ageRange: '',
    maxStudents: 0,
    sector: '',
    numOfLessons: '',
    startDate: '',
    instructorId: 0,
    courseId: '',
    branchId: '',
  });
  const allowedSectors = ['כללי', 'חסידי', 'גור', 'ליטאי'];
  const allowedDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];

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
    }
  }, [selectedBranch, selectedCourse, dispatch]);


  useEffect(() => {
    console.log('🔍 Debug Info:');
    console.log('selectedCourse:', selectedCourse);
    console.log('groups:', groups);
    console.log('branches:', branches);

    if (groups && groups.length > 0) {
      console.log('First group structure:', groups[0]);
    }
    if (branches && branches.length > 0) {
      console.log('First branch structure:', branches[0]);
    }
  }, [selectedCourse, groups, branches]);
  useEffect(() => {
    if (selectedCourse && selectedCourse.courseId) {
      console.log('🔄 Loading groups for course:', selectedCourse.courseId);
      dispatch(getGroupsByCourseId(selectedCourse.courseId));
    }
  }, [selectedCourse, dispatch]);


  const getActiveGroupsCountForBranch = (branchId) => {
    if (!selectedCourse || !groups || groups.length === 0) return 0;

    const courseId = selectedCourse.courseId || selectedCourse.id;

    const activeGroups = groups.filter(group => {
      // בדיקות גמישות לשדות שונים:
      const branchMatches =
        group.branchId === branchId ||
        group.branch_id === branchId ||
        group.BranchId === branchId;

      const courseMatches =
        group.courseId === courseId ||
        group.course_id === courseId ||
        group.CourseId === courseId;

      return branchMatches && courseMatches;
    });

    return activeGroups.length;
  };

  // פונקציה לקבלת צבע לפי מספר קבוצות
  const getGroupsCountColor = (count) => {
    if (count === 0) return '#ef4444'; // אדום - אין קבוצות
    if (count <= 2) return '#f59e0b'; // כתום - מעט קבוצות
    if (count <= 4) return '#10b981'; // ירוק - מספר טוב של קבוצות
    return '#059669'; // ירוק כהה - הרבה קבוצות
  };

  // פונקציה לקבלת טקסט סטטוס
  const getGroupsStatusText = (count) => {
    if (count === 0) return 'אין קבוצות פעילות';
    if (count === 1) return 'קבוצה אחת זמינה';
    return `${count} קבוצות זמינות`;
  };
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
    setStudentGroupData({ ...studentGroupData, groupId: group.groupId });
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


  // פונקציה לטיפול בלחיצה על כפתור שיבוץ תלמיד
  const handleEnrollStudent = async () => {
    if (!studentId.trim()) {
      setNotification({
        open: true,
        message: 'נא להזין מספר תעודת זהות',
        severity: 'error'
      });
      return;
    }
    console.log("Current selectedGroup:", selectedGroup);

    if (!selectedGroup) {
      setNotification({
        open: true,
        message: 'לא נבחרה קבוצה',
        severity: 'error'
      });
      return;
    }

    // בדיקה ספציפית של groupId
    const groupId = selectedGroup.groupId || selectedGroup.id;
    if (!groupId) {
      setNotification({
        open: true,
        message: 'מזהה הקבוצה חסר או לא תקין',
        severity: 'error'
      });
      return;
    }



    try {
      // יצירת אובייקט עם כל הנתונים הדרושים
      const entrollmentDate = {
        studentId: studentId,
        groupId: groupId,
        entrollmentDate: new Date(Date.now()).toLocaleDateString('he-IL'),
        isActive: true
      };

      await dispatch(groupStudentAddThunk(entrollmentDate));

      setEnrollDialogOpen(false);

      await dispatch(getGroupsByCourseId(selectedCourse.courseId));
      // הצגת הודעת הצלחה עם כפתור לצפייה בחוגים
      setNotification({
        open: true,
        message: 'התלמיד נרשם בהצלחה לחוג',
        severity: 'success',
        action: (
          <Button
            color="inherit"
            size="small"
            onClick={() => fetchAndShowStudentCourses(studentId)}
            sx={{
              fontWeight: 'bold',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            צפה בחוגים
          </Button>
        )
      });

      // איפוס שדה תעודת הזהות
      setStudentId('');
    } catch (error) {
      console.error("Error enrolling student:", error);
      setNotification({
        open: true,
        message: 'שגיאה ברישום התלמיד: ' + (error.message || 'אנא נסה שנית'),
        severity: 'error'
      });
    }
  };

  // פונקציה לקבלת חוגי התלמיד והצגתם
const fetchAndShowStudentCourses = async (studentId) => {
  try {
    console.log("Fetching courses for student ID:", studentId);

    // קבלת פרטי התלמיד
    let studentData = null;
    try {
      const studentResponse = await dispatch(getStudentById(studentId));
      if (studentResponse && studentResponse.payload) {
        studentData = {
          id: studentResponse.payload.id,
          firstName: studentResponse.payload.firstName || 'תלמיד',
          lastName: studentResponse.payload.lastName || `מספר ${studentId}`
        };
      }
    } catch (studentError) {
      console.log("Could not fetch student details, using default");
      studentData = {
        id: studentId,
        firstName: 'תלמיד',
        lastName: `מספר ${studentId}`
      };
    }

    // קבלת חוגי התלמיד
    let coursesData = [];
    try {
      const response = await dispatch(getgroupStudentByStudentId(studentId));
      console.log("Server response:", response);

      if (response && response.payload && response.payload.length > 0) {
        coursesData = response.payload.map(item => ({
          groupStudentId: item.groupStudentId || item.id,
          courseName: item.course?.couresName || "חוג לא ידוע",
          groupName: item.group?.groupName || "קבוצה לא ידועה",
          branchName: item.branch?.name || "סניף לא ידוע",
          branchCity: item.branch?.city || "עיר לא ידועה",
          dayOfWeek: item.group?.dayOfWeek || "יום לא ידוע",
          hour: item.group?.hour || "שעה לא ידועה",
          ageRange: item.group?.ageRange || "לא צוין",
          sector: item.group?.sector || "כללי",
          instructorName: item.instructor?.name || "לא צוין",
           isActive: item.isActive !== undefined ? item.isActive : true,
          enrollmentDate: item.enrollmentDate ? 
            new Date(item.enrollmentDate).toLocaleDateString('he-IL') : 
            new Date().toLocaleDateString('he-IL')
        }));
      }
    } catch (coursesError) {
      console.log("Could not fetch student courses:", coursesError);
      coursesData = [];
    }

    // הגדרת הנתונים לדיאלוג
    setSelectedStudentForDialog(studentData);
    setSelectedStudentCoursesForDialog(coursesData);
    setStudentCoursesDialogOpen(true);

  } catch (error) {
    console.error("Error in fetchAndShowStudentCourses:", error);
    
    // במקרה של שגיאה, עדיין נציג את הדיאלוג עם מידע בסיסי
    setSelectedStudentForDialog({
      id: studentId,
      firstName: 'תלמיד',
      lastName: `מספר ${studentId}`
    });
    setSelectedStudentCoursesForDialog([]);
    setStudentCoursesDialogOpen(true);
  }
};

  // עדכון הפונקציה לסגירת ההודעה כדי לתמוך בפעולות נוספות
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };




  // פונקציה להוספת חוג חדש
  const handleAddCourse = async () => {
    if (!newCourse.couresName) {
      setNotification({
        open: true,
        message: 'נא להזין שם חוג',
        severity: 'error'
      });
      return;
    }

    try {
      await dispatch(addCourse(newCourse));
      setAddCourseDialogOpen(false);
      setNewCourse({ couresName: '', description: '' });

      // רענון רשימת החוגים
      dispatch(fetchCourses());

      setNotification({
        open: true,
        message: 'החוג נוסף בהצלחה',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'שגיאה בהוספת החוג: ' + (error.message || 'אנא נסה שנית'),
        severity: 'error'
      });
    }
  };

  // פונקציה להוספת סניף חדש
  const handleAddBranch = async () => {
    if (!newBranch.name || !newBranch.city) {
      setNotification({
        open: true,
        message: 'נא להזין שם סניף ועיר',
        severity: 'error'
      });
      return;
    }

    try {
      await dispatch(addBranch(newBranch));
      setAddBranchDialogOpen(false);
      setNewBranch({ name: '', address: '', city: '' });

      // רענון רשימת הסניפים
      dispatch(fetchBranches());

      setNotification({
        open: true,
        message: 'הסניף נוסף בהצלחה',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'שגיאה בהוספת הסניף: ' + (error.message || 'אנא נסה שנית'),
        severity: 'error'
      });
    }
  };

  // פונקציה להוספת קבוצה חדשה
  const handleAddGroup = async () => {
    if (!newGroup.groupName || !newGroup.dayOfWeek || !newGroup.hour) {
      setNotification({
        open: true,
        message: 'נא למלא את כל השדות הנדרשים',
        severity: 'error'
      });
      return;
    }

    // הוספת מזהי החוג והסניף הנוכחיים
    const groupData = {
      ...newGroup,
      courseId: selectedCourse?.courseId,
      branchId: selectedBranch?.branchId
    };

    try {
      await dispatch(addGroup(groupData));
      setAddGroupDialogOpen(false);
      setNewGroup({
        groupName: '',
        dayOfWeek: '',
        hour: '',
        ageRange: '',
        maxStudents: 0,
        sector: '',
        numOfLessons: 0,
        startDate: '',
        instructorId: 0,
        courseId: '',
        branchId: ''
      });

      // רענון רשימת הקבוצות
      if (selectedCourse) {
        dispatch(getGroupsByCourseId(selectedCourse.courseId));
        debugger
      }

      setNotification({
        open: true,
        message: 'הקבוצה נוספה בהצלחה',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'שגיאה בהוספת הקבוצה: ' + (error.message || 'אנא נסה שנית'),
        severity: 'error'
      });
    }
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
      dir="rtl"
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

        {/* Add Course Card */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
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
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f7ff 100%)',
                transition: 'all 0.3s ease',
                border: '2px dashed #3B82F6',
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(135deg, #dbeeff 0%, #e8f0ff 100%)',
                }
              }}
              onClick={() => setAddCourseDialogOpen(true)}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(59, 130, 246, 0.1)',
                  mb: 2
                }}
              >
                <AddIcon sx={{ fontSize: 40, color: '#3B82F6' }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" textAlign="center" color="#1E3A8A">
                הוסף חוג חדש
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );

  // Render branch cards - עם מיון לפי עיר
  const renderBranches = () => {
    // מיון הסניפים לפי עיר
    const sortedBranches = [...branches].sort((a, b) => {
      if (a.city < b.city) return -1;
      if (a.city > b.city) return 1;
      return 0;
    });

    // קיבוץ הסניפים לפי עיר
    const branchesByCity = sortedBranches.reduce((acc, branch) => {
      const city = branch.city || 'אחר';
      if (!acc[city]) {
        acc[city] = [];
      }
      acc[city].push(branch);
      return acc;
    }, {});

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      // dir="rtl"
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            variant="contained"
            sx={{
              mr: 2,
              bgcolor: '#1E40AF',
              color: 'white',
              borderRadius: '12px',
              px: 3,
              py: 1,
              boxShadow: '0 4px 14px rgba(30, 64, 175, 0.25)',
              '&:hover': {
                bgcolor: '#1E3A8A',
                boxShadow: '0 6px 20px rgba(30, 64, 175, 0.35)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            חזרה לחוגים
          </Button>
          <Typography variant="h5" fontWeight="bold" color="#1E3A8A">
            {selectedCourse?.couresName} - בחר סניף
          </Typography>
        </Box>

        {/* הצגת הסניפים מקובצים לפי עיר */}
        {Object.entries(branchesByCity).map(([city, cityBranches]) => (
          <Box key={city} sx={{ mb: 4 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              pb: 1,
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              justifyContent: 'center'
            }}>
              <Typography variant="h6" fontWeight="bold" color="#1E3A8A">
                {city}
              </Typography>
              <LocationOn sx={{ color: '#10B981', ml: 1 }} /> {/* שינוי mr ל-ml */}
            </Box>

            <Grid container spacing={3} justifyContent="flex-start">
              {cityBranches.map((branch) => {
                const activeGroupsCount = getActiveGroupsCountForBranch(branch.branchId);
                const groupsColor = getGroupsCountColor(activeGroupsCount);
                const statusText = getGroupsStatusText(activeGroupsCount);

                return (
                  <Grid item xs={12} sm={6} md={4} key={branch.branchId}>
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
                          cursor: activeGroupsCount > 0 ? 'pointer' : 'not-allowed',
                          background: activeGroupsCount > 0
                            ? 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)'
                            : 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                          transition: 'all 0.3s ease',
                          border: `2px solid ${activeGroupsCount > 0 ? 'transparent' : '#e5e7eb'}`,
                          opacity: activeGroupsCount > 0 ? 1 : 0.7,
                          '&:hover': {
                            boxShadow: activeGroupsCount > 0
                              ? '0 8px 25px rgba(0,0,0,0.15)'
                              : '0 4px 12px rgba(0,0,0,0.1)',
                          }
                        }}
                        onClick={() =>  handleBranchSelect(branch)}
                      >
                        {/* אייקון סניף עם אינדיקטור סטטוס */}
                        <Box sx={{ position: 'relative', mb: 2 }}>
                          <BranchIcon
                            sx={{
                              fontSize: 50,
                              color: activeGroupsCount > 0 ? '#10B981' : '#9ca3af',
                              transition: 'color 0.3s ease'
                            }}
                          />
                          {/* נקודת סטטוס */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -2,
                              right: -2,
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: groupsColor,
                              border: '2px solid white',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                          />
                        </Box>

                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          textAlign="center"
                          color={activeGroupsCount > 0 ? "#1E3A8A" : "#6b7280"}
                          sx={{ transition: 'color 0.3s ease' }}
                        >
                          {branch.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          textAlign="center"
                          sx={{ mt: 1 }}
                        >
                          {branch.address}
                        </Typography>

                        {/* מידע על קבוצות עם צבע דינמי */}
                        <Box sx={{
                          mt: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: activeGroupsCount > 0
                            ? `${groupsColor}15`
                            : '#f3f4f6',
                          border: `1px solid ${groupsColor}30`,
                          minWidth: '100%',
                          justifyContent: 'center'
                        }}>
                          <GroupIcon
                            fontSize="small"
                            sx={{ color: groupsColor }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: groupsColor,
                              fontWeight: 'bold',
                              fontSize: '0.85rem'
                            }}
                          >
                            {statusText}
                          </Typography>
                        </Box>

                      </Paper>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}

        {/* Add Branch Card */}
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
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
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #e6fff7 0%, #f0fff4 100%)',
                  transition: 'all 0.3s ease',
                  border: '2px dashed #10B981',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    background: 'linear-gradient(135deg, #d1ffee 0%, #e8ffef 100%)',
                  }
                }}
                onClick={() => setAddBranchDialogOpen(true)}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(16, 185, 129, 0.1)',
                    mb: 2
                  }}
                >
                  <AddIcon sx={{ fontSize: 40, color: '#10B981' }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" textAlign="center" color="#1E3A8A">
                  הוסף סניף חדש
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    );
  };

  // Render group cards
  const renderGroups = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    // dir="rtl"
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleBack}
          variant="contained"
          sx={{
            bgcolor: '#10B981',
            color: 'white',
            borderRadius: '12px',
            px: 3,
            py: 1,
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
            '&:hover': {
              bgcolor: '#059669',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          חזרה לסניפים
        </Button>
        <Typography variant="h5" fontWeight="bold" color="#1E3A8A">
          {selectedCourse?.couresName} - {selectedBranch?.name} - בחר קבוצה
        </Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        {groups.filter(group => group.branchId === selectedBranch?.branchId).map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.groupId}>
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
                  <DayIcon fontSize="small" sx={{ color: '#6366F1', mr: 1 }} />
                  <Typography variant="body2">
                    {group.hour} {group.dayOfWeek}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StudentIcon fontSize="small" sx={{ color: '#6366F1', mr: 1 }} />
                  <Typography variant="body2">
                    גילאים: {group.ageRange}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SectorIcon fontSize="small" sx={{ color: '#6366F1', mr: 1 }} />
                  <Typography variant="body2">
                    מגזר: {group.sector || 'כללי'}
                  </Typography>
                </Box>
                <Box sx={{ mt: 'auto', pt: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    icon={group.maxStudents > 0 ? <AvailableIcon /> : <FullIcon />}
                    label={`${group.maxStudents} מקומות פנויים`}
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
                          borderRadius: '8px',
                          boxShadow: group.maxStudents > 0 ? '0 4px 10px rgba(16, 185, 129, 0.2)' : 'none',
                          '&:hover': {
                            bgcolor: group.maxStudents > 0 ? '#059669' : 'grey.400',
                            boxShadow: group.maxStudents > 0 ? '0 6px 15px rgba(16, 185, 129, 0.3)' : 'none',
                          },
                          transition: 'all 0.3s ease'
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

        {/* Add Group Card */}
        <Grid item xs={12} sm={6} md={4}>
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
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #e6e6ff 0%, #f0f0ff 100%)',
                transition: 'all 0.3s ease',
                border: '2px dashed #6366F1',
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(135deg, #dedeff 0%, #e8e8ff 100%)',
                }
              }}
              onClick={() => setAddGroupDialogOpen(true)}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(99, 102, 241, 0.1)',
                  mb: 2
                }}
              >
                <AddIcon sx={{ fontSize: 40, color: '#6366F1' }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" textAlign="center" color="#1E3A8A">
                הוסף קבוצה חדשה
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
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
              minWidth: { xs: '90%', sm: '400px' },
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: '#1E3A8A',
              color: 'white',
              textAlign: 'center',
              py: 2
            }}
          >
            שיבוץ תלמיד לחוג
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.25)',
                  mb: 2
                }}
              >
                <EnrollIcon sx={{ fontSize: 45, color: '#3B82F6' }} />
              </Box>
            </Box>
            <Box
              sx={{
                mb: 3,
                p: 3,
                bgcolor: 'rgba(59, 130, 246, 0.05)',
                borderRadius: 2,
                border: '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: '0 2px 10px rgba(59, 130, 246, 0.1)'
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#1E3A8A">
                פרטי החוג:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>חוג:</strong> {selectedCourse?.couresName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>עיר:</strong> {selectedBranch?.city}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>סניף:</strong> {selectedBranch?.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>קבוצה:</strong> {selectedGroup?.groupName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>מגזר:</strong> {selectedGroup?.sector || 'כללי'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>מקומות פנויים:</strong> {selectedGroup?.maxStudents}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>יום בשבוע:</strong> {selectedGroup?.dayOfWeek}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>שעה:</strong> {selectedGroup?.hour}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>טווח גילאים:</strong> {selectedGroup?.ageRange || 'לא צוין'}
                  </Typography>
                </Grid>
                {selectedGroup?.startDate && (
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>תאריך התחלה:</strong> {new Date(selectedGroup.startDate).toLocaleDateString('he-IL')}
                    </Typography>
                  </Grid>
                )}
                {selectedGroup?.numOfLessons && (
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>מספר שיעורים:</strong> {selectedGroup.numOfLessons}
                    </Typography>
                  </Grid>
                )}
              </Grid>
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
              onChange={(e) => { setStudentId(e.target.value) }}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3B82F6',
                    borderWidth: '2px'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3B82F6',
                    borderWidth: '2px'
                  }
                }
              }}
              inputProps={{ dir: 'rtl' }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'rtl' }}>
            <Button
              onClick={handleEnrollStudent}
              variant="contained"
              color="primary"
              startIcon={<EnrollIcon />}
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.2,
                bgcolor: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                boxShadow: '0 6px 18px rgba(59, 130, 246, 0.35)',
                '&:hover': {
                  bgcolor: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.45)',
                  transform: 'translateY(-2px)'
                },
                '&:active': {
                  transform: 'translateY(1px)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                },
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              שבץ תלמיד
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Course Dialog */}
        <Dialog
          open={addCourseDialogOpen}
          onClose={() => setAddCourseDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: { xs: '90%', sm: '400px' },
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: '#3B82F6',
              color: 'white',
              textAlign: 'center',
              py: 2
            }}
          >
            הוספת חוג חדש
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(59, 130, 246, 0.1)',
                }}
              >
                <CourseIcon sx={{ fontSize: 35, color: '#3B82F6' }} />
              </Box>
            </Box>
            <TextField
              autoFocus
              margin="dense"
              label="שם החוג"
              type="text"
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              inputProps={{ dir: 'rtl' }}
              value={newCourse.couresName}
              onChange={(e) => setNewCourse({ ...newCourse, couresName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="תיאור החוג"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={{ mb: 2 }}
              inputProps={{ dir: 'rtl' }}
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
            <Button
              onClick={() => setAddCourseDialogOpen(false)}
              variant="outlined"
              color="error"
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  bgcolor: 'rgba(239, 68, 68, 0.05)'
                }
              }}
            >
              ביטול
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                bgcolor: '#3B82F6',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  bgcolor: '#2563EB',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
              onClick={handleAddCourse}
            >
              הוסף חוג
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Branch Dialog */}
        <Dialog
          open={addBranchDialogOpen}
          onClose={() => setAddBranchDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: { xs: '90%', sm: '400px' },
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: '#10B981',
              color: 'white',
              textAlign: 'center',
              py: 2
            }}
          >
            הוספת סניף חדש
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(16, 185, 129, 0.1)',
                }}
              >
                <BranchIcon sx={{ fontSize: 35, color: '#10B981' }} />
              </Box>
            </Box>
            <TextField
              autoFocus
              margin="dense"
              label="שם הסניף"
              type="text"
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              inputProps={{ dir: 'rtl' }}
              value={newBranch.name}
              onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="כתובת"
              type="text"
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              inputProps={{ dir: 'rtl' }}
              value={newBranch.address}
              onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
            />
            <TextField
              margin="dense"
              label="עיר"
              type="text"
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              inputProps={{ dir: 'rtl' }}
              value={newBranch.city}
              onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
            />

          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
            <Button
              onClick={() => setAddBranchDialogOpen(false)}
              variant="outlined"
              color="error"
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  bgcolor: 'rgba(239, 68, 68, 0.05)'
                }
              }}
            >
              ביטול
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                bgcolor: '#10B981',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  bgcolor: '#059669',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
              onClick={handleAddBranch}
            >
              הוסף סניף
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={addGroupDialogOpen}
          onClose={() => setAddGroupDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: { xs: '90%', sm: '500px' },
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: '#6366F1',
              color: 'white',
              textAlign: 'center',
              py: 2
            }}
          >
            הוספת קבוצה חדשה
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(99, 102, 241, 0.1)',
                }}
              >
                <GroupIcon sx={{ fontSize: 35, color: '#6366F1' }} />
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="שם הקבוצה"
                  type="text"
                  fullWidth
                  variant="outlined"
                  inputProps={{ dir: 'rtl' }}
                  value={newGroup.groupName}
                  onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense" variant="outlined" sx={{ minWidth: '100%' }}>
                  <InputLabel id="day-select-label">יום בשבוע</InputLabel>
                  <Select
                    labelId="day-select-label"
                    id="day-select"
                    value={newGroup.dayOfWeek}
                    onChange={(e) => setNewGroup({ ...newGroup, dayOfWeek: e.target.value })}
                    label="יום בשבוע"
                    inputProps={{ dir: 'rtl' }}
                    startAdornment={<DayIcon sx={{ color: '#6366F1', mr: 1 }} />}
                  >
                    {allowedDays.map((dayOfWeek) => (
                      <MenuItem key={dayOfWeek} value={dayOfWeek}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {dayOfWeek}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="שעה"
                  type="time"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={newGroup.hour}
                  onChange={(e) => setNewGroup({ ...newGroup, hour: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="טווח גילאים"
                  type="text"
                  fullWidth
                  variant="outlined"
                  inputProps={{ dir: 'rtl' }}
                  value={newGroup.ageRange}
                  onChange={(e) => setNewGroup({ ...newGroup, ageRange: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="מספר מקומות מקסימלי"
                  type="number"
                  fullWidth
                  variant="outlined"
                  inputProps={{ min: 1 }}
                  value={newGroup.maxStudents}
                  onChange={(e) => setNewGroup({ ...newGroup, maxStudents: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense" variant="outlined" sx={{ minWidth: '100%' }}>
                  <InputLabel id="sector-select-label">מגזר</InputLabel>
                  <Select
                    labelId="sector-select-label"
                    id="sector-select"
                    value={newGroup.sector}
                    onChange={(e) => setNewGroup({ ...newGroup, sector: e.target.value })}
                    label="מגזר"
                    inputProps={{ dir: 'rtl' }}
                    startAdornment={<SectorIcon sx={{ color: '#6366F1', mr: 1 }} />}
                  >
                    {allowedSectors.map((sector) => (
                      <MenuItem key={sector} value={sector}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {sector}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} variant="outlined">
                <TextField
                  margin="dense"
                  label="תאריך התחלה"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ dir: 'rtl' }}
                  value={newGroup.startDate}
                  onChange={(e) => setNewGroup({ ...newGroup, startDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="מספר שיעורים"
                  type="number"
                  fullWidth
                  variant="outlined"
                  inputProps={{ dir: 'rtl' }}
                  value={newGroup.numOfLessons}
                  onChange={(e) => setNewGroup({ ...newGroup, numOfLessons: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="קוד מדריך"
                  type="number"
                  fullWidth
                  variant="outlined"
                  inputProps={{ dir: 'rtl' }}
                  value={newGroup.instructorId}
                  onChange={(e) => setNewGroup({ ...newGroup, instructorId: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
            <Button
              onClick={() => setAddGroupDialogOpen(false)}
              variant="outlined"
              color="error"
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  bgcolor: 'rgba(239, 68, 68, 0.05)'
                }
              }}
            >
              ביטול
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                bgcolor: '#6366F1',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  bgcolor: '#4F46E5',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
              onClick={handleAddGroup}
            >
              הוסף קבוצה
            </Button>
          </DialogActions>
        </Dialog>

        {/* Student Courses Dialog */}
        <Dialog
          open={studentCoursesDialog}
          onClose={() => setStudentCoursesDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: '#3B82F6',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2
            }}
          >
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              חוגים של {selectedStudentName}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setStudentCoursesDialog(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            {groupStudents.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TableContainer component={Paper} sx={{ direction: 'rtl', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: 2 }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f8fafc' }}>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>שם החוג</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>קבוצה</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>סניף</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>מדריך</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>יום ושעה</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>תאריך התחלה</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>סטטוס</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupStudents.map((gs, index) => (
                        <TableRow
                          key={gs.groupStudentId}
                          component={motion.tr}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          sx={{
                            '&:nth-of-type(odd)': { bgcolor: 'rgba(59, 130, 246, 0.03)' },
                            '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' },
                            transition: 'background-color 0.3s'
                          }}
                        >
                          <TableCell align="right" component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                              <CourseIcon sx={{ color: '#3B82F6', fontSize: 20 }} />

                              <Typography sx={{ fontWeight: 'medium' }}>{gs.courseName}</Typography>
                            </Box>
                          </TableCell>

                          <TableCell align="right">{gs.groupName}</TableCell>
                          <TableCell align="right">{gs.branchName}</TableCell>
                          <TableCell align="right">{gs.instructorName}</TableCell>
                          <TableCell align="right">{gs.dayOfWeek} {gs.hour}</TableCell>                          <TableCell align="right">{gs.enrollmentDate}</TableCell>
                          <TableCell align="right">
                            <Chip
                              icon={gs.isActive === true ? <CheckIcon /> : <CloseIcon />}
                              label={gs.isActive}
                              color={gs.isActive === true ? "success" : "error"}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </motion.div>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 5
                }}
              >
                <InfoIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" textAlign="center">
                  אין חוגים רשומים לתלמיד זה
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                  ניתן לרשום את התלמיד לחוגים חדשים דרך מסך השיבוץ
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
            <Button
              onClick={() => setStudentCoursesDialog(false)}
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  bgcolor: 'rgba(59, 130, 246, 0.05)'
                }
              }}
            >
              סגור
            </Button>
          </DialogActions>
        </Dialog>

       <StudentCoursesDialog
          open={studentCoursesDialogOpen}
          onClose={() => {
            setStudentCoursesDialogOpen(false);
            setSelectedStudentForDialog(null);
            setSelectedStudentCoursesForDialog([]);
          }}
          student={selectedStudentForDialog}
          studentCourses={selectedStudentCoursesForDialog}
          showAddButton={false} // לא נציג כפתור הוספה כי אנחנו כבר בעמוד ההרשמה
          title={selectedStudentForDialog ? `החוגים של ${selectedStudentForDialog.firstName} ${selectedStudentForDialog.lastName}` : null}
          subtitle={selectedStudentForDialog ? `ת"ז: ${selectedStudentForDialog.id}` : null}
        />

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={notification.action ? 10000 : 6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          action={notification.action}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
            action={notification.action}
          >
            {notification.message}
          </Alert>
        </Snackbar>

      </Box>
    </Container>
  );
};

export default EnrollStudent;