import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { exportGroupsToExcelWithData } from '../../../utils/exportGroupsToExcelWithData';
import { exportBranchToExcel, validateGroupsDataForExport } from '../../../utils/exportBranchToExcel';
import { getGroupsByBranch } from '../../../store/group/groupGetGroupsByBranchThunk';
import EditStudentDialog from '../../Students/components/EditStudentDialog';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportGroupStudentsToExcel } from '../../Groups/components/GroupStudentsExportExcel';
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
  InputLabel,
  Menu,
  ListItemIcon,
  ListItemText
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
  CalendarToday as CalendarIcon,
  LocationOn,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Rocket as RocketIcon,
  Psychology as AIIcon,
  Visibility as ViewIcon,
  PersonAdd as PersonAddIcon,
  DeleteSweep,
} from '@mui/icons-material';
import { fetchCourses } from '../../../store/course/CoursesGetAllThunk';
import { fetchBranches } from '../../../store/branch/branchGetAllThunk';
import { getGroupsByCourseId } from '../../../store/group/groupGetGroupsByCourseIdThunk';
import { fetchGroups } from '../../../store/group/groupGellAllThunk';
import { groupStudentAddThunk } from '../../../store/groupStudent/groupStudentAddThunk';
import { getgroupStudentByStudentId } from '../../../store/groupStudent/groupStudentGetByStudentIdThunk';
import { getStudentsByGroupId } from '../../../store/group/groupGetStudentsByGroupId';
import { clearStudentsInGroup } from '../../../store/group/groupSlice';
import AddStudentDialog from '../../Students/components/AddStudentDialog';
import AddStudentHealthFundDialog from '../../Students/components/AddStudentHealthFundDialog';
import { addCourse } from '../../../store/course/courseAddThunk';
import { updateCourse } from '../../../store/course/courseUpdateThunk';
import { addBranch } from '../../../store/branch/branchAddThunk';
import { updateBranch } from '../../../store/branch/branchUpdateThunk';
import { addGroup } from '../../../store/group/groupAddThunk';
import { updateGroup } from '../../../store/group/groupUpdateThunk';
import { deleteCourse } from '../../../store/course/courseDeleteThunk';
import { deleteBranch } from '../../../store/branch/branchDelete';
import { deleteGroup } from '../../../store/group/groupDeleteThunk';
import { FindBestGroupsForStudent } from '../../../store/group/groupFindBestGroupForStudent';
import StudentCoursesDialog from '../../Students/components/studentCoursesDialog';
import { getStudentById } from '../../../store/student/studentGetByIdThunk';
import { editStudent } from '../../../store/student/studentEditThunk';
import { addStudentNote } from '../../../store/studentNotes/studentNoteAddThunk';
import SmartMatchingSystem from './smartMatchingSystem';
import EnrollmentSuccess from './enrollmentSuccess';
import { checkUserPermission } from'../../../utils/permissions';
import StudentSearchDialog from '../../../components/StudentSearchDialog';
import GroupCard from '../../../components/GroupCard';

import './style/enrollStudent.css';
import { fetchInstructors } from '../../../store/instructor/instructorGetAllThunk';
const EnrollStudent = () => {
  // ...existing code...

  // כפתור יצוא לאקסל - פונקציה כללית
  const handleExportGroupsExcel = async () => {
    try {
     
      setNotification({ 
        open: true, 
        message: 'מתחיל ייצוא קבוצות לאקסל...', 
        severity: 'info' 
      });

      // ייצוא כל הקבוצות עם הנתונים
      await exportGroupsToExcelWithData();
      
      setNotification({ 
        open: true, 
        message: 'הקבוצות יוצאו בהצלחה לאקסל!', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('שגיאה בייצוא קבוצות:', error);
      setNotification({ 
        open: true, 
        message: 'שגיאה בייצוא קבוצות לאקסל', 
        severity: 'error' 
      });
    }
  };

  // כפתור יצוא סניף לאקסל - פונקציה חדשה
  const handleExportBranchExcel = async () => {
    try {
      if (!selectedBranch) {
        setNotification({ 
          open: true, 
          message: 'לא נבחר סניף לייצוא', 
          severity: 'error' 
        });
        return;
      }

      // הצגת הודעה על התחלת הייצוא
      setNotification({ 
        open: true, 
        message: `מתחיל ייצוא נתוני ${selectedBranch.name}...`, 
        severity: 'info' 
      });

      // קבלת נתוני הקבוצות והתלמידים של הסניף
      console.log('🔄 מבקש נתוני סניף:', selectedBranch.branchId);
      const result = await dispatch(getGroupsByBranch(selectedBranch.branchId));
      
      if (result.meta.requestStatus === 'fulfilled' && result.payload) {
        const branchData = result.payload;
        
        // וואליצציה של הנתונים
        if (!validateGroupsDataForExport(branchData)) {
          setNotification({ 
            open: true, 
            message: 'אין נתונים תקינים לייצוא בסניף זה', 
            severity: 'warning' 
          });
          return;
        }

        // ייצוא לאקסל
        const exportResult = exportBranchToExcel(branchData, selectedBranch.name);
        
        if (exportResult.success) {
          setNotification({ 
            open: true, 
            message: `נתוני ${selectedBranch.name} יוצאו בהצלחה! ${exportResult.message}`, 
            severity: 'success' 
          });
        } else {
          throw new Error(exportResult.error);
        }
      } else {
        throw new Error('לא הצלחנו לקבל נתוני סניף מהשרת');
      }

    } catch (error) {
      console.error('❌ שגיאה בייצוא סניף:', error);
      setNotification({ 
        open: true, 
        message: `שגיאה בייצוא נתוני ${selectedBranch?.name || 'הסניף'}: ${error.message}`, 
        severity: 'error' 
      });
    }
  };
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const CustomAIIcon = () => (
    <Box component="span" sx={{ fontSize: '60px' }}>🤖</Box>
  );

  const CustomRocketIcon = () => (
    <Box component="span" sx={{ fontSize: '24px' }}>🚀</Box>
  );

  // Redux state
  const courses = useSelector(state => state.courses.courses || []);
  const branches = useSelector(state => state.branches.branches || []);
  const groups = useSelector(state => state.groups.groupsByCourseId || []);
  const allGroups = useSelector(state => state.groups.groups || []); // כל הקבוצות מכל החוגים/סניפים
  const groupStudents = useSelector(state => state.groupStudents.groupStudentById || []);
  const bestGroup = useSelector(state => state.groups.bestGroupForStudent);
  const studentsInGroup = useSelector(state => state.groups.studentsInGroup || []);
  const studentsInGroupLoading = useSelector(state => state.groups.studentsInGroupLoading);
  const instructors = useSelector(state => state.instructors.instructors || []);
  const groupsByBranch = useSelector(state => state.groups.groupsByBranch || []);
  const groupsByBranchLoading = useSelector(state => state.groups.groupsByBranchLoading);

  const loading = useSelector(state =>
    state.courses.loading ||
    state.branches.loading ||
    state.groups.loading ||
    state.groupStudents.loading
  );

  // קבלת המשתמש הנוכחי
  const currentUser = useSelector(state => {
    return state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null;
  });

  // פונקציה לקבלת פרטי המשתמש
  const getUserDetails = (user) => {
    if (!user) return { fullName: 'מערכת', role: 'מערכת אוטומטית' };
    
    const firstName = user.firstName || user.FirstName || 'משתמש';
    const lastName = user.lastName || user.LastName || 'אורח';
    const role = user.role || user.Role || 'מורה';
    
    return {
      fullName: `${firstName} ${lastName}`,
      role
    };
  };

  // Local state - כל המשתנים במקום אחד
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [enrollDate, setEnrollDate] = useState('');
  const [groupStatus, setGroupStatus] = useState(true); // סטטוס קבוצה - פעיל/לא פעיל
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [view, setView] = useState('courses'); // courses, branches, groups, days
  const [selectedDay, setSelectedDay] = useState(null); // ליום שנבחר במיון לפי ימים
const [selectedInstructorId, setSelectedInstructorId] = useState('');
const [studentLessons, setStudentLessons] = useState(0);

  // Dialog states
  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
  const [addBranchDialogOpen, setAddBranchDialogOpen] = useState(false);
  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
  
  // Edit dialog states
  const [editCourseDialogOpen, setEditCourseDialogOpen] = useState(false);
  const [editBranchDialogOpen, setEditBranchDialogOpen] = useState(false);
  const [editGroupDialogOpen, setEditGroupDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [studentCoursesDialogOpen, setStudentCoursesDialogOpen] = useState(false);
  const [selectedStudentForDialog, setSelectedStudentForDialog] = useState(null);
  const [selectedStudentCoursesForDialog, setSelectedStudentCoursesForDialog] = useState([]);

  // Edit student dialog states
  const [editStudentDialogOpen, setEditStudentDialogOpen] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);

  // Delete functionality state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(''); // 'course', 'branch', 'group'
  const [itemToDelete, setItemToDelete] = useState(null);

  // Menu state
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItemForMenu, setSelectedItemForMenu] = useState(null);
  const [menuType, setMenuType] = useState('');

  // Smart Matching states
  const [algorithmDialogOpen, setAlgorithmDialogOpen] = useState(false);
  const [smartMatchingOpen, setSmartMatchingOpen] = useState(false);
  const [smartMatchingStudentId, setSmartMatchingStudentId] = useState('');
  const [smartMatchingStudentData, setSmartMatchingStudentData] = useState(null);
  const [showBestGroupDialog, setShowBestGroupDialog] = useState(false);
  const [enrollmentSuccessOpen, setEnrollmentSuccessOpen] = useState(false);
  const [successData, setSuccessData] = useState({ student: null, group: null });
  const [studentsListDialogOpen, setStudentsListDialogOpen] = useState(false);
  const [selectedGroupForStudents, setSelectedGroupForStudents] = useState(null);
  const [enhancedStudentsInGroup, setEnhancedStudentsInGroup] = useState([]);
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);

  // Health Fund Dialog state
  const [healthFundDialogOpen, setHealthFundDialogOpen] = useState(false);
  const [selectedStudentForHealthFund, setSelectedStudentForHealthFund] = useState(null);

  // Student Group Search states
  const [studentSearchDialogOpen, setStudentSearchDialogOpen] = useState(false);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [studentGroups, setStudentGroups] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResultDialogOpen, setSearchResultDialogOpen] = useState(false);
  const [searchStudentName, setSearchStudentName] = useState('');

  // Form data states
  const [studentGroupData, setStudentGroupData] = useState({
    studentId: 0,
    groupId: null,
    entrollmentDate: '',
    isActive: true
  });

  // New item states
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

  // Constants
  const allowedSectors = ['כללי', 'חסידי', 'גור', 'ליטאי'];
  const allowedDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'];
  // --- Render Days Filter ---
  const renderDaysFilter = () => {
    // סינון ימים שיש בהם קבוצות
    const groupsSource = Array.isArray(allGroups) ? allGroups : Object.values(allGroups).flat();
    const daysWithGroups = allowedDays.filter(day => 
      groupsSource.some(group => group.dayOfWeek === day && group.isActive !== false)
    );
    
    // אם אין ימים עם קבוצות, לא מציגים כלום
    if (daysWithGroups.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', mt: 4, color: '#94a3b8', fontWeight: 400, fontSize: '0.95rem' }}>
          אין קבוצות זמינות כרגע
        </Box>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', direction: 'rtl', justifyContent: 'center', gap: 1.5, mb: 4, mt: 3, flexWrap: 'wrap' }}>
        {daysWithGroups.map((day) => (
          <Button
            key={day}
            variant="text"
            onClick={() => setSelectedDay(day)}
            sx={{
              minWidth: 100,
              fontWeight: 500,
              borderRadius: '16px',
              fontSize: '0.9rem',
              py: 1,
              px: 2.5,
              background: selectedDay === day
                ? 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)'
                : 'transparent',
              color: selectedDay === day ? '#4f46e5' : '#94a3b8',
              border: selectedDay === day ? '1.5px solid #c7d2fe' : '1.5px solid transparent',
              boxShadow: selectedDay === day
                ? '0 2px 8px rgba(99, 102, 241, 0.15)'
                : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                background: selectedDay === day
                  ? 'linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%)'
                  : 'rgba(241, 245, 249, 0.8)',
                color: selectedDay === day ? '#4338ca' : '#64748b',
                borderColor: selectedDay === day ? '#a5b4fc' : '#e2e8f0',
                boxShadow: '0 3px 10px rgba(99, 102, 241, 0.12)'
              }
            }}
          >
            {day}
          </Button>
        ))}
        <Button
          variant="text"
          onClick={() => setSelectedDay(null)}
          sx={{
            ml: 2,
            fontWeight: 400,
            fontSize: '0.85rem',
            color: '#cbd5e1',
            textDecoration: 'none',
            borderRadius: '12px',
            px: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(203, 213, 225, 0.1)',
              color: '#94a3b8'
            }
          }}
        >
          איפוס
        </Button>
      </Box>
    );
  };

  // --- Render Groups By Day (Hierarchical: Course -> Branch -> Groups) ---
  const renderGroupsByDay = () => {
    // שימוש בנתונים מ-state.groups.groups בלבד (כל הקבוצות מכל החוגים/סניפים)
    const groupsSource = Array.isArray(allGroups) ? allGroups : Object.values(allGroups).flat();
    if (!selectedDay) {
      return (
        <Box sx={{ textAlign: 'center', mt: 4, color: '#64748b', fontWeight: 500 }}>
          בחר יום להצגת כל הקבוצות המתקיימות בו
        </Box>
      );
    }
    const filteredGroups = groupsSource.filter(group => group.dayOfWeek === selectedDay);
    if (filteredGroups.length === 0) {
      return null; // לא מציג כלום אם אין קבוצות
    }
    // בניית מבנה היררכי: חוג -> סניף -> קבוצות
    const hierarchy = {};
    filteredGroups.forEach(group => {
      const course = courses.find(c => c.courseId === group.courseId) || {
        courseId: group.courseId,
        courseName: group.courseName || group.couresName
      };
      const branchFromStore = branches.find(b => b.branchId === group.branchId);
      const branch = branchFromStore || {
        branchId: group.branchId,
        name: group.branchName || group.branch?.name,
        address: group.branchAddress || group.address,
        city: group.branchCity || group.city
      };
      const courseId = course?.courseId || group.courseId;
      const branchId = branch?.branchId || group.branchId;

      const branchNameFallback = branch?.name
        || branch?.branchName
        || group.branchName
        || group.branch?.name
        || (branchId ? `סניף #${branchId}` : 'סניף לא ידוע');

      const branchObj = {
        ...branch,
        name: branchNameFallback,
        city: branch?.city || group.branchCity || group.city,
        address: branch?.address || group.branchAddress || group.address
      };
      if (!hierarchy[courseId]) {
        hierarchy[courseId] = { course, branches: {} };
      }
      if (!hierarchy[courseId].branches[branchId]) {
        hierarchy[courseId].branches[branchId] = { branch: branchObj, groups: [] };
      }
      hierarchy[courseId].branches[branchId].groups.push(group);
    });
    return (
      <Box sx={{ mt: 3 }}>
        {Object.values(hierarchy).map(({ course, branches }, courseIdx) => (
          <Box key={course?.courseId || courseIdx} sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="bold" color="#1E3A8A" sx={{ mb: 2, textAlign: 'right' }}>
              {course?.couresName || 'חוג לא ידוע'}
            </Typography>
            {Object.values(branches).map(({ branch, groups }, branchIdx) => (
              <Box key={branch?.branchId || branchIdx} sx={{ mb: 3, pl: { xs: 0, md: 4 } }}>
                <Typography variant="h6" fontWeight={600} color="#0ea5e9" sx={{ mb: 1, textAlign: 'right' }}>
                  {branch?.name || 'סניף לא ידוע'}
                  {branch?.city ? ` (${branch.city})` : ''}
                </Typography>
                <Box dir="rtl">
                  <Grid container spacing={3} justifyContent="flex-start">
                    {groups.map((group, idx) => {
                      const instructor = instructors.find(i => i.instructorId === group.instructorId);
                      return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={`group-day-${group.groupId || idx}`}>
                          <GroupCard
                            group={group}
                            instructor={instructor}
                            handleViewStudents={handleViewStudents}
                            handleAddStudentAndEnroll={handleAddStudentAndEnroll}
                            handleGroupSelect={handleGroupSelect}
                            exportGroupStudentsToExcel={exportGroupStudentsToExcel}
                            dispatch={dispatch}
                            handleMenuOpen={handleMenuOpen}
                            itemVariants={itemVariants}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    );
  };

const dayOrder = {
  'ראשון': 1,
  'שני': 2,
  'שלישי': 3,
  'רביעי': 4,
  'חמישי': 5
};

function parseHour(hourStr) {
  if (!hourStr || typeof hourStr !== 'string') return 0;
  const [h, m] = hourStr.split(':').map(Number);
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
}

const sortedGroups = groups
  .filter(group => group.branchId === selectedBranch?.branchId)
  .slice()
  .sort((a, b) => {
    const dayA = dayOrder[a.dayOfWeek] || 99;
    const dayB = dayOrder[b.dayOfWeek] || 99;
    if (dayA !== dayB) return dayA - dayB;
    return parseHour(a.hour) - parseHour(b.hour);
  });

  // Effects
  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchGroups()); // טען את כל הקבוצות לכל החוגים/סניפים בכניסה לעמוד
    dispatch(fetchBranches()); // טען גם סניפים כדי שתצוגת "לפי ימים" תדע שמות סניפים בלי בחירת חוג
  }, [dispatch]);

  useEffect(() => {
  if (addGroupDialogOpen) {
    dispatch(fetchInstructors());
  }
}, [addGroupDialogOpen, dispatch]);

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

  // 💾 שמירת נתוני הקבוצה החדשה ל-localStorage
  useEffect(() => {
    const formData = {
      newGroup,
      newBranch,
      newCourse,
      selectedCourse,
      selectedBranch
    };
    
    // שמור רק אם יש נתונים בטופס
    const hasData = newGroup.groupName || newGroup.dayOfWeek || newGroup.hour ||
                   newBranch.name || newBranch.address ||
                   newCourse.couresName || newCourse.description;
    
    if (hasData) {
      console.log('💾 שומר נתוני טופס ל-localStorage:', formData);
      localStorage.setItem('enrollmentFormData', JSON.stringify(formData));
    }
  }, [newGroup, newBranch, newCourse, selectedCourse, selectedBranch]);

  // 📥 טעינת נתוני הטופס מ-localStorage בטעינת הדף
  useEffect(() => {
    const savedData = localStorage.getItem('enrollmentFormData');
    if (savedData) {
      try {
        const formData = JSON.parse(savedData);
        console.log('📥 טוען נתוני טופס מ-localStorage:', formData);
        
        if (formData.newGroup) {
          setNewGroup(prev => ({ ...prev, ...formData.newGroup }));
        }
        if (formData.newBranch) {
          setNewBranch(prev => ({ ...prev, ...formData.newBranch }));
        }
        if (formData.newCourse) {
          setNewCourse(prev => ({ ...prev, ...formData.newCourse }));
        }
        if (formData.selectedCourse) {
          setSelectedCourse(formData.selectedCourse);
        }
        if (formData.selectedBranch) {
          setSelectedBranch(formData.selectedBranch);
        }
      } catch (error) {
        console.error('❌ שגיאה בטעינת נתונים מ-localStorage:', error);
        localStorage.removeItem('enrollmentFormData');
      }
    }
  }, []); // רק בטעינה הראשונית

useEffect(() => {
  if (open && !enrollDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setEnrollDate(`${yyyy}-${mm}-${dd}`);
  }
}, [open, enrollDate]);
useEffect(() => {
  if (
    selectedGroup &&
    enrollDate &&
    selectedGroup.startDate &&
    selectedGroup.dayOfWeek &&
    selectedGroup.numOfLessons
  ) {
    const dayOfWeekMap = {
      'ראשון': 0,
      'שני': 1,
      'שלישי': 2,
      'רביעי': 3,
      'חמישי': 4,
      'שישי': 5,
      'שבת': 6
    };
    const lessonDayOfWeek = dayOfWeekMap[selectedGroup.dayOfWeek];
    const lessonsCount = Math.max(selectedGroup.numOfLessons - selectedGroup.lessonsCompleted, 0);
    setStudentLessons(lessonsCount);
  } else {
    setStudentLessons(0);
  }
}, [enrollDate, selectedGroup]);
  // 🗑️ פונקציה לניקוי נתוני הטופס מ-localStorage
  const clearFormData = () => {
    console.log('🗑️ מנקה נתוני טופס מ-localStorage');
    localStorage.removeItem('enrollmentFormData');
  };

  // 🔄 פונקציה לאיפוס הטופס
  const resetForm = () => {
    setNewGroup({
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
    setNewBranch({ name: '', address: '', city: '' });
    setNewCourse({ couresName: '', description: '' });
    clearFormData();
  };

  const handleEnrollmentSuccess = (data) => {
    console.log('🎉 רישום הושלם בהצלחה:', data);

    setSuccessData({
      student: data.student || data,
      group: data.group || data
    });

    setSmartMatchingOpen(false);
    setEnrollmentSuccessOpen(true);

    // ניקוי נתוני הטופס לאחר רישום מוצלח
    clearFormData();

    // רענון הנתונים
    if (selectedCourse) {
      dispatch(getGroupsByCourseId(selectedCourse.courseId));
    }
  };
  // פונקציה שמחשבת את מספר השיעורים לתלמיד
/**
 * מחשבת את מספר השיעורים לתלמיד בקבוצה לפי תאריך התחלה, שיעורים שהיו, ושיעורים "אבודים"
 * @param {string} groupStartDate - תאריך התחלת הקבוצה (YYYY-MM-DD)
 * @param {string} enrollDate - תאריך התחלת התלמיד (YYYY-MM-DD)
 * @param {number} lessonDayOfWeek - יום בשבוע בו מתקיים השיעור (0=ראשון, 1=שני, ...)
 * @param {number} numOfLessons - מספר שיעורים כולל בקבוצה
 * @param {number} lessonsCompleted - מספר שיעורים שכבר התקיימו בקבוצה
 * @returns {number} מספר שיעורים לתלמיד
 */


function calculateStudentLessons(groupStartDate, enrollDate, lessonDayOfWeek, numOfLessons, lessonsCompleted) {
  if (!groupStartDate || !enrollDate || lessonDayOfWeek === undefined || !numOfLessons) return 0;

  let lessonDates = [];
  let current = new Date(groupStartDate);
  while (current.getDay() !== lessonDayOfWeek) {
    current.setDate(current.getDate() + 1);
  }
  for (let i = 0; i < numOfLessons; i++) {
    lessonDates.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  const today = new Date();
  today.setHours(0,0,0,0); // השוואה לפי יום בלבד
  const enroll = new Date(enrollDate);
  enroll.setHours(0,0,0,0);

  // השתמש תמיד ב-lessonsCompleted אם קיים
  const completed = typeof lessonsCompleted === 'number' ? lessonsCompleted : lessonDates.filter(date => date < today).length;

  // אם תאריך ההרשמה הוא היום או לפני, לא מחסירים missedLessons
  let missedLessons = 0;
  if (enroll > today) {
    missedLessons = lessonDates.filter(date => date >= today && date < enroll).length;
  }

  let studentLessons = numOfLessons - completed - missedLessons;
  return Math.max(studentLessons, 0);
}
 const handleMenuOpen = (event, item, type) => {
    event.stopPropagation();
    event.preventDefault();
    setMenuAnchor(event.currentTarget);
    setSelectedItemForMenu(item);
    setMenuType(type);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedItemForMenu(null);
    setMenuType('');
  };

  const handleDeleteFromMenu = () => {
    if (selectedItemForMenu && menuType) {
      handleDeleteClick(selectedItemForMenu, menuType);
    }
    handleMenuClose();
  };

  // Delete functions
  const handleDeleteClick = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !deleteType) return;

    try {
      let deleteAction;
      let itemId;
      let successMessage;

      switch (deleteType) {
        case 'course':
          deleteAction = deleteCourse;
          itemId = itemToDelete.courseId;
          successMessage = 'החוג נמחק בהצלחה';
          break;
        case 'branch':
          deleteAction = deleteBranch;
          itemId = itemToDelete.branchId;
          successMessage = 'הסניף נמחק בהצלחה';
          break;
        case 'group':
          deleteAction = deleteGroup;
          itemId = itemToDelete.groupId;
          successMessage = 'הקבוצה נמחקה בהצלחה';
          break;
        default:
          throw new Error('Invalid delete type');
      }
if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
      console.log(`Deleting ${deleteType} with ID:`, itemId);

      await dispatch(deleteAction(itemId));

      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteType('');

      // Refresh the appropriate data
      if (deleteType === 'course') {
        dispatch(fetchCourses());
      } else if (deleteType === 'branch') {
        dispatch(fetchBranches());
      } else if (deleteType === 'group' && selectedCourse) {
        dispatch(getGroupsByCourseId(selectedCourse.courseId));
      }

      setNotification({
        open: true,
        message: successMessage,
        severity: 'success'
      });

    } catch (error) {
      console.error('Error deleting item:', error);
      setNotification({
        open: true,
        message: 'שגיאה במחיקה: ' + (error.message || 'אנא נסה שנית'),
        severity: 'error'
      });
    }
  };
  const getActiveGroupsCountForBranch = (branchId) => {
    if (!selectedCourse || !groups || groups.length === 0) return 0;

    const courseId = selectedCourse.courseId || selectedCourse.id;

    const activeGroups = groups.filter(group => {
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

  const getGroupsCountColor = (count) => {
    if (count === 0) return '#ef4444';
    if (count <= 2) return '#f59e0b';
    if (count <= 4) return '#10b981';
    return '#059669';
  };

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
    console.log('🔍 handleGroupSelect called with group:', group);
    setSelectedGroup(group);
    setStudentGroupData({ ...studentGroupData, groupId: group.groupId });
    setGroupStatus(true); // איפוס הסטטוס לפעיל כברירת מחדל
    
    // עדכון הקורס והסניף בהתאם לקבוצה שנבחרה (עם fallback מתוך הנתונים של הקבוצה)
    const courseFromStore = courses.find(c => c.courseId === group.courseId);
    const branchFromStore = branches.find(b => b.branchId === group.branchId);

    const courseFallback = courseFromStore || {
      courseId: group.courseId,
      courseName: group.courseName || group.couresName
    };

    const branchNameFallback = branchFromStore?.name
      || branchFromStore?.branchName
      || group.branchName
      || group.branch?.name
      || (group.branchId ? `סניף #${group.branchId}` : 'סניף לא ידוע');

    const branchFallback = {
      branchId: branchFromStore?.branchId || group.branchId,
      name: branchNameFallback,
      address: branchFromStore?.address || group.branchAddress || group.address,
      city: branchFromStore?.city || group.branchCity || group.city
    };
    
    setSelectedCourse(courseFallback);
    setSelectedBranch(branchFallback);
    
    if (group.maxStudents > 0) {
      console.log('✅ Opening enroll dialog');
      setEnrollDialogOpen(true);
    } else {
      setNotification({
        open: true,
        message: 'אין מקומות פנויים בקבוצה זו',
        severity: 'error'
      });
    }
  };

  const handleViewStudents = async (group) => {
    setSelectedGroupForStudents(group);
    setStudentsListDialogOpen(true);
    setEnhancedStudentsInGroup([]); // Clear previous data
    
    try {
      const groupId = group.groupId || group.id;
      console.log('Getting students by group ID...', groupId);
      
      // Get students in group
      const result = await dispatch(getStudentsByGroupId(groupId));
      
      // Get full details for each student
      if (result.payload && result.payload.length > 0) {
        console.log('Students in group basic data:', result.payload);
        
        // Fetch full details for each student
        const studentsWithFullDetails = await Promise.all(
          result.payload.map(async (student) => {
            try {
              const studentDetails = await dispatch(getStudentById(student.studentId));
              if (studentDetails.payload) {
                return {
                  ...student,
                  fullDetails: studentDetails.payload
                };
              }
              return student;
            } catch (error) {
              console.error(`Error fetching details for student ${student.studentId}:`, error);
              return student;
            }
          })
        );
        
        console.log('Students with full details:', studentsWithFullDetails);
        setEnhancedStudentsInGroup(studentsWithFullDetails);
      } else {
        // No students in group
        console.log('No students found in group');
        setEnhancedStudentsInGroup([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setEnhancedStudentsInGroup([]);
      setNotification({
        open: true,
        message: 'שגיאה בטעינת רשימת התלמידים',
        severity: 'error'
      });
    }
  };

  const handleViewStudentDetails = async (student) => {
    console.log('👁️ Viewing student details:', student);
    
    // Convert the student object to match the expected format
    const studentForDialog = {
      id: student.studentId,
      firstName: student.studentName?.split(' ')[0] || '',
      lastName: student.studentName?.split(' ').slice(1).join(' ') || '',
      ...student
    };

    try {
      // Get the full student details including courses
      const studentResult = await dispatch(getStudentById(student.studentId));
      if (studentResult.payload) {
        setSelectedStudentForDialog(studentResult.payload);
      } else {
        setSelectedStudentForDialog(studentForDialog);
      }
      
      // Get student's courses
      await dispatch(getgroupStudentByStudentId(student.studentId));
      
      setStudentCoursesDialogOpen(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
      // Still open dialog with available data
      setSelectedStudentForDialog(studentForDialog);
      setStudentCoursesDialogOpen(true);
    }
  };

  const handleEditStudentDetails = async (student) => {
    console.log('✏️ Editing student details:', student);
    
    try {
      // Use fullDetails if available, otherwise Student object, otherwise fetch from server
      if (student.fullDetails) {
        setSelectedStudentForEdit(student.fullDetails);
        setEditStudentDialogOpen(true);
      } else if (student.Student) {
        setSelectedStudentForEdit(student.Student);
        setEditStudentDialogOpen(true);
      } else {
        // Fallback: Get full student details from the server
        const studentResult = await dispatch(getStudentById(student.studentId));
        
        if (studentResult.payload) {
          setSelectedStudentForEdit(studentResult.payload);
          setEditStudentDialogOpen(true);
        } else {
          setNotification({
            open: true,
            message: 'לא ניתן למצוא את פרטי התלמיד',
            severity: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching student for edit:', error);
      setNotification({
        open: true,
        message: 'שגיאה בטעינת פרטי התלמיד לעריכה',
        severity: 'error'
      });
    }
  };

  // פונקציה ליצירת הערה אוטומטית לתלמיד חדש
  const createAutomaticRegistrationNote = async (studentId) => {
    try {
      const userDetails = getUserDetails(currentUser);
      
      const currentDate = new Date().toLocaleDateString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const noteData = {
        studentId: studentId,
        noteContent: `שובץ לקבוצה בתאריך ${currentDate}`,
        noteType: 'כללי',
        priority: 'בינוני',
        isPrivate: false,
        authorName: userDetails.fullName,
        authorRole: userDetails.role,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };
if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
      console.log('📝 Creating automatic registration note:', noteData);
      
      const result = await dispatch(addStudentNote(noteData));
      
      if (addStudentNote.fulfilled.match(result)) {
        console.log('✅ Automatic registration note created successfully');
      } else {
        console.warn('⚠️ Failed to create automatic registration note:', result.payload);
      }
    } catch (error) {
      console.error('❌ Error creating automatic registration note:', error);
      // לא נציג שגיאה למשתמש כי זו פונקציה רקעית
    }
  };

  const handleAddStudentAndEnroll = async (studentData, message, severity) => {
    console.log('🚀 handleAddStudentAndEnroll called with:', { studentData, message, severity });
    
    if (severity === 'success' && studentData) {
      // שמירת פרטי התלמיד לפתיחת דיאלוג קופת חולים
      setSelectedStudentForHealthFund(studentData);
      
      // בדיקה אם studentData הוא אובייקט תקין
      if (typeof studentData !== 'object' || !studentData.id) {
        console.error('❌ Invalid studentData received:', studentData);
        setNotification({
          open: true,
          message: 'שגיאה: נתוני התלמיד לא תקינים',
          severity: 'error'
        });
        return;
      }
      try {
        console.log('🔍 Student data received:', studentData);
        console.log('🔍 Selected group:', selectedGroup);
        
        // בדיקות תקינות
        if (!selectedGroup || !selectedGroup.groupId) {
          setNotification({
            open: true,
            message: 'שגיאה: לא נבחרה קבוצה תקינה',
            severity: 'error'
          });
          return;
        }

        if (!studentData.id) {
          setNotification({
            open: true,
            message: 'שגיאה: מזהה תלמיד חסר',
            severity: 'error'
          });
          return;
        }
       
        // שיבוץ התלמיד החדש לקבוצה הנוכחית
        const entrollmentData = {
          studentId: studentData.id, // אותו טיפוס כמו בפונקציה הרגילה
          groupId: selectedGroup.groupId,
          enrollmentDate: studentData.enrollDate, 
          isActive: studentData.groupStatus !== undefined ? studentData.groupStatus : groupStatus
        };
if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
        console.log('🔍 Enrollment data to send:', entrollmentData);

        const enrollResult = await dispatch(groupStudentAddThunk(entrollmentData));
        
        console.log('🔍 Enrollment result:', enrollResult);
        
        if (enrollResult.type === 'groupStudent/addGroupStudent/fulfilled') {
          // יצירת הערה אוטומטית לתלמיד החדש
          await createAutomaticRegistrationNote(studentData.id);
          
          // עדכון רשימת הקבוצות
          if (selectedCourse) {
            await dispatch(getGroupsByCourseId(selectedCourse.courseId));
          }

        setNotification({
          open: true,
          message: `התלמיד ${studentData.firstName} ${studentData.lastName} נוסף בהצלחה ושובץ לקבוצה`,
          severity: 'success',
          action: (
            <Box sx={{ direction: 'rtl', textAlign: 'right', display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                size="small"
                onClick={() => fetchAndShowStudentCourses(studentData.id)}
                sx={{
                  fontWeight: 'bold',
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  px: 2,
                  ml: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                צפה בחוגים
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={() => handleOpenHealthFundDialog(studentData)}
                sx={{
                  fontWeight: 'bold',
                  bgcolor: 'rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(16, 185, 129, 0.4)',
                  }
                }}
              >
                🏥 קופת חולים
              </Button>
            </Box>
          )
        });
        }
        
      } catch (error) {
        console.error('❌ Error enrolling new student:', error);
        setNotification({
          open: true,
          message: `התלמיד נוסף בהצלחה אך היתה שגיאה בשיבוץ לקבוצה: ${error.message || 'אנא נסה שנית'}`,
          severity: 'warning',
          action: (
            <>
              <Button
                color="inherit"
                size="small"
                onClick={() => fetchAndShowStudentCourses(studentData.id)}
                sx={{
                  fontWeight: 'bold',
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  px: 2,
                  ml: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                צפה בחוגים
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={() => handleOpenHealthFundDialog(studentData)}
                sx={{
                  fontWeight: 'bold',
                  bgcolor: 'rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(16, 185, 129, 0.4)',
                  }
                }}
              >
                🏥 קופת חולים
              </Button>
            </>
          )
        });
      }
    } else if (severity === 'error') {
      console.log('❌ Error in AddStudentDialog:', message);
      setNotification({
        open: true,
        message: message,
        severity: 'error'
      });
    } else {
      console.log('⚠️ Unexpected callback from AddStudentDialog:', { studentData, message, severity });
    }
  };

 const handleEnrollStudent = async () => {
  if (!studentId.trim()) {
    setNotification({
      open: true,
      message: 'נא להזין מספר תעודת זהות',
      severity: 'error'
    });
    return;
  }

  if (!selectedGroup) {
    setNotification({
      open: true,
      message: 'לא נבחרה קבוצה',
      severity: 'error'
    });
    return;
  }

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
    const entrollmentDate = {
      studentId: studentId,
      groupId: groupId,
      enrollmentDate: enrollDate ? new Date(enrollDate).toISOString().split('T')[0] : '',
      isActive: groupStatus
    };
if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
    await dispatch(groupStudentAddThunk(entrollmentDate));

    setEnrollDialogOpen(false);

    await dispatch(getGroupsByCourseId(selectedCourse.courseId));

   

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

    setStudentId('');
    setEnrollDate('');
  } catch (error) {
    console.error("Error enrolling student:", error);
    setNotification({
      open: true,
      message: 'שגיאה ברישום התלמיד: ' + (error.message || 'אנא נסה שנית'),
      severity: 'error'
    });
  }
};

 const handleSmartMatchingOpen = async () => {
    if (!smartMatchingStudentId.trim()) {
      setNotification({
        open: true,
        message: 'נא להזין מספר תעודת זהות',
        severity: 'error'
      });
      return;
    }

    try {
      console.log('🔍 מחפש פרטי תלמיד:', smartMatchingStudentId);

      // קבלת פרטי התלמיד
      const studentResponse = await dispatch(getStudentById(smartMatchingStudentId));

      let studentData = {
        id: smartMatchingStudentId,
        firstName: 'תלמיד',
        lastName: `מספר ${smartMatchingStudentId}`
      };

      if (studentResponse && studentResponse.payload) {
        studentData = {
          id: studentResponse.payload.id || smartMatchingStudentId,
          firstName: studentResponse.payload.firstName || 'תלמיד',
          lastName: studentResponse.payload.lastName || `מספר ${smartMatchingStudentId}`,
          sector: studentResponse.payload.sector,
          age: studentResponse.payload.age,
          city: studentResponse.payload.city
        };

        console.log('✅ נתוני תלמיד נטענו:', studentData);
      } else {
        console.log('⚠️ לא נמצאו פרטי תלמיד, ממשיך עם נתונים בסיסיים');
      }

      setSmartMatchingStudentData(studentData);
      setAlgorithmDialogOpen(false);
      setSmartMatchingOpen(true);

    } catch (error) {
      console.error('❌ שגיאה בקבלת פרטי התלמיד:', error);

      // גם אם יש שגיאה, נמשיך עם הנתונים הבסיסיים
      const basicStudentData = {
        id: smartMatchingStudentId,
        firstName: 'תלמיד',
        lastName: `מספר ${smartMatchingStudentId}`
      };

      setSmartMatchingStudentData(basicStudentData);
      setAlgorithmDialogOpen(false);
      setSmartMatchingOpen(true);

      setNotification({
        open: true,
        message: 'לא נמצאו פרטי התלמיד, אך המערכת תמשיך לחפש קבוצות מתאימות',
        severity: 'warning'
      });
    }
  };


  const fetchAndShowStudentCourses = async (studentId) => {
    try {
      console.log("Fetching courses for student ID:", studentId);

      let studentData = null;
      try {
        const studentResponse = await dispatch(getStudentById(studentId));
        console.log("Student response:", studentResponse);

        if (studentResponse && studentResponse.payload) {
          studentData = {
            id: studentResponse.payload.id,
            firstName: studentResponse.payload.firstName || 'תלמיד',
            lastName: studentResponse.payload.lastName || `מספר ${studentId}`
          };
        }
      } catch (studentError) {
        console.log("Could not fetch student details:", studentError);
        studentData = {
          id: studentId,
          firstName: 'תלמיד',
          lastName: `מספר ${studentId}`
        };
      }

      let coursesData = [];
      try {
        const response = await dispatch(getgroupStudentByStudentId(studentId));
        console.log("Raw server response:", response);

        if (response && response.payload) {
          console.log("Response payload:", response.payload);

          const dataArray = Array.isArray(response.payload) ? response.payload : [response.payload];

          coursesData = dataArray.map((item, index) => {
            console.log(`Processing item ${index}:`, item);

            return {
              groupStudentId: item.groupStudentId || item.id || `temp-${index}`,
              courseName: item.course?.couresName ||
                item.course?.courseName ||
                item.courseName ||
                item.Course?.couresName ||
                item.Course?.courseName ||
                "חוג לא ידוע",
              groupName: item.group?.groupName ||
                item.groupName ||
                item.Group?.groupName ||
                "קבוצה לא ידועה",
              branchName: item.branch?.name ||
                item.branchName ||
                item.Branch?.name ||
                "סניף לא ידוע",
              branchCity: item.branch?.city ||
                item.branchCity ||
                item.Branch?.city ||
                "עיר לא ידועה",
              dayOfWeek: item.group?.dayOfWeek ||
                item.dayOfWeek ||
                item.Group?.dayOfWeek ||
                "יום לא ידוע",
              hour: item.group?.hour ||
                item.hour ||
                item.Group?.hour ||
                "שעה לא ידועה",
              ageRange: item.group?.ageRange ||
                item.ageRange ||
                item.Group?.ageRange ||
                "לא צוין",
              sector: item.group?.sector ||
                item.sector ||
                item.Group?.sector ||
                "כללי",
              instructorName: item.instructor?.name ||
                item.instructorName ||
                item.Instructor?.name ||
                "לא צוין",
              isActive: item.isActive !== undefined ? item.isActive : true,
              enrollmentDate: item.enrollmentDate ?
                new Date(item.enrollmentDate).toLocaleDateString('he-IL') :
                item.entrollmentDate ?
                  new Date(item.entrollmentDate).toLocaleDateString('he-IL') :
                  new Date().toLocaleDateString('he-IL')
            };
          });

          console.log("Processed courses data:", coursesData);
        }
      } catch (coursesError) {
        console.error("Error fetching student courses:", coursesError);
        coursesData = [];
      }

      setSelectedStudentForDialog(studentData);
      setSelectedStudentCoursesForDialog(coursesData);
      setStudentCoursesDialogOpen(true);

    } catch (error) {
      console.error("Error in fetchAndShowStudentCourses:", error);

      setSelectedStudentForDialog({
        id: studentId,
        firstName: 'תלמיד',
        lastName: `מספר ${studentId}`
      });
      setSelectedStudentCoursesForDialog([]);
      setStudentCoursesDialogOpen(true);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Student Group Search functionality
  const handleStudentGroupSearch = async () => {
    if (!searchStudentId.trim()) {
      setNotification({
        open: true,
        message: 'אנא הכנס קוד תלמיד',
        severity: 'warning'
      });
      return;
    }

    setSearchLoading(true);
    try {
      // First, try to get student details
      let studentName = '';
      try {
        const studentResponse = await dispatch(getStudentById(parseInt(searchStudentId)));
        if (studentResponse.payload) {
          const student = studentResponse.payload;
          studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
          setSearchStudentName(studentName);
        }
      } catch (studentError) {
        console.log('Could not fetch student details:', studentError);
        setSearchStudentName('');
      }

      // Then get the student's groups
      const response = await dispatch(getgroupStudentByStudentId(parseInt(searchStudentId)));
      
      if (response.payload && response.payload.length > 0) {
        setStudentGroups(response.payload);
        setSearchResultDialogOpen(true);
        setStudentSearchDialogOpen(false);
      } else {
        setNotification({
          open: true,
          message: 'לא נמצאו קבוצות עבור תלמיד זה',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('שגיאה בחיפוש קבוצות תלמיד:', error);
      setNotification({
        open: true,
        message: 'שגיאה בחיפוש קבוצות התלמיד',
        severity: 'error'
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleOpenStudentSearch = () => {
    setStudentSearchDialogOpen(true);
  };

  // Health Fund Dialog functions
  const handleOpenHealthFundDialog = (studentData = null) => {
    console.log('🏥 handleOpenHealthFundDialog called with:', studentData);
    console.log('🏥 selectedStudentForHealthFund:', selectedStudentForHealthFund);
    
    const student = studentData || selectedStudentForHealthFund;
    console.log('🏥 Final student data:', student);
    
    if (student && student.id) {
      setSelectedStudentForHealthFund(student);
      setHealthFundDialogOpen(true);
      
      // סגור את דיאלוג השיבוץ לחוג אם הוא פתוח
      setAddStudentDialogOpen(false);
      
      console.log('✅ Health fund dialog opened');
    } else {
      console.error('❌ No student data available for health fund dialog');
      setNotification({
        open: true,
        message: 'שגיאה: לא נמצאו פרטי תלמיד',
        severity: 'error'
      });
    }
  };

  const handleCloseHealthFundDialog = () => {
    setHealthFundDialogOpen(false);
    setSelectedStudentForHealthFund(null);
  };

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
      if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
      console.log('🔄 Adding course:', newCourse);
      const result = await dispatch(addCourse(newCourse));
      
      console.log('📥 Add course result:', result);
      
      // בדיקה אם הפעולה הצליחה
      if (result.type && result.type.includes('fulfilled')) {
        console.log('✅ Course added successfully');
        
        // ולידציה נוספת - רענון רשימת החוגים ובדיקה שהחוג נוסף
        await dispatch(fetchCourses());
        
        setAddCourseDialogOpen(false);
        
        // איפוס הטופס לאחר הוספה מוצלחת מאומתת
        resetForm();

        setNotification({
          open: true,
          message: '✅ החוג נוסף בהצלחה למערכת',
          severity: 'success'
        });
      } else {
        // הפעולה נכשלה
        console.error('❌ Course addition failed:', result);
        
        let errorMessage = 'שגיאה בהוספת החוג: ';
        if (result.payload) {
          errorMessage += typeof result.payload === 'string' ? result.payload : JSON.stringify(result.payload);
        } else if (result.error) {
          errorMessage += result.error.message || result.error;
        } else {
          errorMessage += 'אנא נסה שנית';
        }
        
        setNotification({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('❌ Exception during course addition:', error);
      setNotification({
        open: true,
        message: '❌ שגיאה בהוספת החוג: ' + (error.message || 'אנא נסה שנית'),
        severity: 'error'
      });
    }
  };

  const handleAddBranch = async () => {
    if (!newBranch.name || !newBranch.city) {
      setNotification({
        open: true,
        message: 'נא להזין שם סניף ועיר',
        severity: 'error'
      });
      return;
    }

    // וודא שיש חוג נבחר
    if (!selectedCourse || (!selectedCourse.courseId && !selectedCourse.id)) {
      setNotification({
        open: true,
        message: 'נא לבחור חוג לפני הוספת סניף',
        severity: 'error'
      });
      return;
    }

    try {
      // הוסף את courseId לסניף החדש
      const branchToAdd = {
        ...newBranch,
        courseId: selectedCourse.courseId || selectedCourse.id
      };
if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
      console.log('🔄 Adding branch:', branchToAdd);
      const result = await dispatch(addBranch(branchToAdd));
      
      console.log('📥 Add branch result:', result);
      
      // בדיקה אם הפעולה הצליחה
      if (result.type && result.type.includes('fulfilled')) {
        console.log('✅ Branch added successfully');
        
        // ולידציה נוספת - רענון רשימת הסניפים
        await dispatch(fetchBranches());
        
        setAddBranchDialogOpen(false);
        
        // איפוס הטופס לאחר הוספה מוצלחת מאומתת
        resetForm();

        setNotification({
          open: true,
          message: `✅ הסניף נוסף בהצלחה לחוג ${selectedCourse.couresName || selectedCourse.name}`,
          severity: 'success'
        });
      } else {
        // הפעולה נכשלה
        console.error('❌ Branch addition failed:', result);
        
        let errorMessage = 'שגיאה בהוספת הסניף: ';
        if (result.payload) {
          errorMessage += typeof result.payload === 'string' ? result.payload : JSON.stringify(result.payload);
        } else if (result.error) {
          errorMessage += result.error.message || result.error;
        } else {
          errorMessage += 'אנא נסה שנית';
        }
        
        setNotification({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('❌ Exception during branch addition:', error);
      setNotification({
        open: true,
        message: '❌ שגיאה בהוספת הסניף: ' + (error.message || 'אנא נסה שנית'),
        severity: 'error'
      });
    }
  };

  const handleAddGroup = async () => {
    // בדיקת שדות חובה
    const requiredFields = [
      { field: 'groupName', name: 'שם הקבוצה' },
      { field: 'dayOfWeek', name: 'יום בשבוע' },
      { field: 'hour', name: 'שעה' },
      { field: 'ageRange', name: 'טווח גילאים' },
      { field: 'maxStudents', name: 'מספר תלמידים מקסימלי' },
      { field: 'sector', name: 'מגזר' },
      { field: 'numOfLessons', name: 'מספר שיעורים' },
      { field: 'startDate', name: 'תאריך התחלה' }
     
    ];

    // בדיקה אם יש שדות חסרים (כולל קוד מדריך שלא יכול להיות 0)
    const missingFields = requiredFields.filter(({ field }) => {
      const value = newGroup[field];
     
      return !value || value === '' || value === 0;
    });

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(({ name }) => name).join(', ');
      setNotification({
        open: true,
        message: `חייבים למלא את כל הנתונים הבאים: ${missingFieldNames}`,
        severity: 'error'
      });
      return;
    }

    // בדיקת פורמט טווח גילאים
    const ageRangePattern = /^\d+-\d+$/;
    if (!ageRangePattern.test(newGroup.ageRange)) {
      setNotification({
        open: true,
        message: 'טווח גילאים חייב להיות בפורמט: גיל-גיל (דוגמא: 2-8 או 6-9)',
        severity: 'error'
      });
      return;
    }

    // בדיקה שהגיל הראשון קטן מהשני
    const [minAge, maxAge] = newGroup.ageRange.split('-').map(Number);
    if (minAge >= maxAge) {
      setNotification({
        open: true,
        message: 'הגיל הראשון חייב להיות קטן מהגיל השני (דוגמא: 2-8)',
        severity: 'error'
      });
      return;
    }

    const groupData = {
      ...newGroup,
       instructorId: selectedInstructorId,
      courseId: selectedCourse?.courseId,
      branchId: selectedBranch?.branchId
    };

    try {
      if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
      console.log('🔄 Adding group:', groupData);
      const result = await dispatch(addGroup(groupData));
      
      console.log('📥 Add group result:', result);
      
      // בדיקה אם הפעולה הצליחה
      if (result.type && result.type.includes('fulfilled')) {
        console.log('✅ Group added successfully');
        
        setAddGroupDialogOpen(false);
        
        // איפוס הטופס לאחר הוספה מוצלחת מאומתת
        resetForm();

        // ולידציה נוספת - רענון רשימת הקבוצות
        if (selectedCourse) {
          await dispatch(getGroupsByCourseId(selectedCourse.courseId));
        }

        setNotification({
          open: true,
          message: `✅ הקבוצה "${newGroup.groupName}" נוספה בהצלחה לסניף ${selectedBranch?.branchName || 'הנבחר'}`,
          severity: 'success'
        });
      } else {
        // הפעולה נכשלה
        console.error('❌ Group addition failed:', result);
        
        let errorMessage = 'שגיאה בהוספת הקבוצה: ';
        if (result.payload) {
          errorMessage += typeof result.payload === 'string' ? result.payload : JSON.stringify(result.payload);
        } else if (result.error) {
          errorMessage += result.error.message || result.error;
        } else {
          errorMessage += 'אנא נסה שנית';
        }
        
        setNotification({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('❌ Exception during group addition:', error);
      setNotification({
        open: true,
        message: '❌ שגיאה בהוספת הקבוצה: ' + (error.message || 'אנא נסה שנית'),
        severity: 'error'
      });
    }
  };

  // Update functions
  const handleUpdateCourse = async () => {
    if (!editingItem || !editingItem.couresName) {
      setNotification({
        open: true,
        message: 'נא להזין שם החוג',
        severity: 'error'
      });
      return;
    }

    try {
      if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
      await dispatch(updateCourse(editingItem));
      setEditCourseDialogOpen(false);
      setEditingItem(null);
      
      dispatch(fetchCourses());

      setNotification({
        open: true,
        message: 'החוג עודכן בהצלחה',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'שגיאה בעדכון החוג',
        severity: 'error'
      });
    }
  };
// קומפוננטה לאייקון סטטוס
// function StatusIcon({ status }) {
//   if (status === 'פעיל') {
//     return <span role="img" aria-label="פעיל" style={{ fontSize: 13 }}>✅</span>;
//   }
//   if (status === 'ליד') {
//     return <span role="img" aria-label="ליד" style={{ fontSize: 13 }}>🤝</span>;
//   }
//   if (status === 'לא רלוונטי') {
//     return <span role="img" aria-label="לא רלוונטי" style={{ fontSize: 13 }}>🚫</span>;
//   }
//   return null;
// }
  const handleUpdateBranch = async () => {
    if (!editingItem || !editingItem.name || !editingItem.city) {
      setNotification({
        open: true,
        message: 'נא להזין שם סניף ועיר',
        severity: 'error'
      });
      return;
    }

    try {
      if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
      await dispatch(updateBranch(editingItem));
      setEditBranchDialogOpen(false);
      setEditingItem(null);
      
      dispatch(fetchBranches());

      setNotification({
        open: true,
        message: 'הסניף עודכן בהצלחה',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'שגיאה בעדכון הסניף',
        severity: 'error'
      });
    }
  };

  const handleUpdateGroup = async () => {
    // בדיקת שדות חובה (אותה ולידציה כמו בהוספה)
    const requiredFields = [
      { field: 'groupName', name: 'שם הקבוצה' },
      { field: 'dayOfWeek', name: 'יום בשבוע' },
      { field: 'hour', name: 'שעה' },
      { field: 'ageRange', name: 'טווח גילאים' },
      { field: 'sector', name: 'מגזר' },
      { field: 'numOfLessons', name: 'מספר שיעורים' },
      { field: 'startDate', name: 'תאריך התחלה' },
      { field: 'instructorId', name: 'קוד מדריך' }
    ];

    const missingFields = requiredFields.filter(({ field }) => {
      const value = editingItem[field];
      return !value || value === '' || value === 0;
    });

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(({ name }) => name).join(', ');
      setNotification({
        open: true,
        message: `חייבים למלא את כל הנתונים הבאים: ${missingFieldNames}`,
        severity: 'error'
      });
      return;
    }

    // בדיקת פורמט טווח גילאים
    const ageRangePattern = /^\d+-\d+$/;
    if (!ageRangePattern.test(editingItem.ageRange)) {
      setNotification({
        open: true,
        message: 'טווח גילאים חייב להיות בפורמט: גיל-גיל (דוגמא: 2-8 או 6-9)',
        severity: 'error'
      });
      return;
    }

    // בדיקה שהגיל הראשון קטן מהשני
    const [minAge, maxAge] = editingItem.ageRange.split('-').map(Number);
    if (minAge >= maxAge) {
      setNotification({
        open: true,
        message: 'הגיל הראשון חייב להיות קטן מהגיל השני (דוגמא: 2-8)',
        severity: 'error'
      });
      return;
    }

    try {
      if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
      await dispatch(updateGroup(editingItem));
      setEditGroupDialogOpen(false);
      setEditingItem(null);
      
      if (selectedCourse) {
        dispatch(getGroupsByCourseId(selectedCourse.courseId));
      }

      setNotification({
        open: true,
        message: 'הקבוצה עודכנה בהצלחה',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'שגיאה בעדכון הקבוצה',
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

  // Render menu
  // Edit functions
  const handleEditFromMenu = () => {
    if (selectedItemForMenu && menuType) {
      setEditingItem(selectedItemForMenu);
      
      switch (menuType) {
        case 'course':
          setEditCourseDialogOpen(true);
          break;
        case 'branch':
          setEditBranchDialogOpen(true);
          break;
        case 'group':
          setEditGroupDialogOpen(true);
          break;
        default:
          break;
      }
    }
    handleMenuClose();
  };

  const renderMenu = () => (
    <Menu
      anchorEl={menuAnchor}
      open={Boolean(menuAnchor)}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          minWidth: 150
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem
        onClick={handleEditFromMenu}
        sx={{
          color: '#3B82F6',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '&:hover': {
            bgcolor: 'rgba(59, 130, 246, 0.1)'
          }
        }}
      >
        <EditIcon fontSize="small" sx={{ color: '#3B82F6' }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          ערוך
        </Typography>
      </MenuItem>
      <MenuItem
        onClick={handleDeleteFromMenu}
        sx={{
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '&:hover': {
            bgcolor: 'rgba(239, 68, 68, 0.1)'
          }
        }}
      >
        <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          מחק
        </Typography>
      </MenuItem>
    </Menu>
  );

  // Render Smart Matching Button + Student Group Search Button Together
  const renderSmartMatchingButton = () => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: 2,
      mb: 3,
      mt: 2,
      flexWrap: 'wrap'
    }}>
      {/* Smart Matching Button */}
      <Button
        onClick={() => setAlgorithmDialogOpen(true)}
        disabled={loading}
        variant="contained"
        sx={{
          borderRadius: '16px',
          px: 3.5,
          py: 1.8,
          fontSize: '1rem',
          fontWeight: 600,
          color: '#1e3a8a',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1.5px solid #bfdbfe',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.15)',
          minHeight: '56px',
          minWidth: '280px',
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '1.5px solid #3b82f6',
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.2)',
            color: '#1d4ed8',
            transform: 'translateY(-2px)'
          },
          '&:disabled': {
            opacity: 0.6,
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            color: '#94a3b8'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1.5,
          flexDirection: 'column'
        }}>
          <Typography sx={{ fontSize: '1.6rem' }}>🎯</Typography>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.2 }}>
              מערכת התאמה חכמה
            </Typography>
            <Typography sx={{ fontWeight: 400, fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.3 }}>
              אלגוריתם מתקדם
            </Typography>
          </Box>
        </Box>
      </Button>

      {/* Student Group Search Button */}
      <Button
        onClick={handleOpenStudentSearch}
        disabled={loading}
        variant="contained"
        sx={{
          borderRadius: '16px',
          px: 3.5,
          py: 1.8,
          fontSize: '1rem',
          fontWeight: 600,
          color: '#1e40af',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1.5px solid #bae6fd',
          boxShadow: '0 4px 15px rgba(14, 165, 233, 0.15)',
          minHeight: '56px',
          minWidth: '280px',
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
            border: '1.5px solid #0ea5e9',
            boxShadow: '0 6px 20px rgba(14, 165, 233, 0.2)',
            color: '#0369a1',
            transform: 'translateY(-2px)'
          },
          '&:disabled': {
            opacity: 0.6,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            color: '#94a3b8'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1.5,
          flexDirection: 'column'
        }}>
          <Typography sx={{ fontSize: '1.6rem' }}>🔍</Typography>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.2 }}>
              חיפוש קבוצות
            </Typography>
            <Typography sx={{ fontWeight: 400, fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.3 }}>
              לפי קוד או שם תלמיד
            </Typography>
          </Box>
        </Box>
      </Button>
    </Box>
  );



  // Render course cards
  const renderCourses = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir="rtl"
    >
      
      {/* שורת כפתור הוספה */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2, mt: 4 }}>
      
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddCourseDialogOpen(true)}
          sx={{
            bgcolor: '#3B82F6',
            color: 'white',
            borderRadius: '10px',
            px: 2,
            py: 0.5,
            fontSize: '1rem',
            minWidth: 120,
            height: 36,
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
            '&:hover': {
              bgcolor: '#2563eb',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          הוסף חוג חדש
        </Button>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        {courses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`course-${course.courseId || course.id || index}`}>
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
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
                onClick={() => handleCourseSelect(course)}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleMenuOpen(e, course, 'course');
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    color: '#6b7280',
                    bgcolor: 'rgba(107, 114, 128, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(107, 114, 128, 0.2)',
                    },
                    zIndex: 10
                  }}
                  size="small"
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>

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
  const renderBranches = () => {
    // סנן רק סניפים הקשורים לחוג שנבחר
    const filteredBranches = branches.filter(branch => {
      return branch.courseId === selectedCourse?.courseId || 
             branch.courseId === selectedCourse?.id ||
             !branch.courseId;
    });

    const sortedBranches = [...filteredBranches].sort((a, b) => {
      if (a.city < b.city) return -1;
      if (a.city > b.city) return 1;
      return 0;
    });

    const branchesByCity = sortedBranches.reduce((acc, branch) => {
      const city = branch.city || 'אחר';
      if (!acc[city]) {
        acc[city] = [];
      }
      acc[city].push(branch);
      return acc;
    }, {});

    // פריסה חדשה: 5 עמודות של ערים, מתחת לכל עיר סניפים בטור
    const cityNames = Object.keys(branchesByCity);
    const rows = [];
    for (let i = 0; i < cityNames.length; i += 5) {
      rows.push(cityNames.slice(i, i + 5));
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        dir="rtl"
      >
               
        <Box sx={{ mb: 3, mt: 4, display: 'flex', direction: 'rtl', alignItems: 'center', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-start' }}>
         <Button
            endIcon={<BackIcon style={{ transform: 'scaleX(-1)' }} />}
            onClick={handleBack}
            variant="contained"
            sx={{
              direction: 'ltr',
              bgcolor: '#1E40AF',
              color: 'white',
              borderRadius: '12px',
              px: 3,
              py: 1,
              boxShadow: '0 4px 14px rgba(30, 64, 175, 0.25)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#1E3A8A',
                boxShadow: '0 6px 20px rgba(30, 64, 175, 0.35)'
              }
            }}
          >
            חזרה לחוגים
          </Button>
           <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddBranchDialogOpen(true)}
            sx={{
              bgcolor: '#10B981',
              color: 'white',
              borderRadius: '10px',
              px: 2,
              py: 0.5,
              fontSize: '1rem',
              minWidth: 120,
              height: 36,
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
              '&:hover': {
                bgcolor: '#059669',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            הוסף סניף חדש
          </Button>
          <Typography variant="h5" fontWeight="bold" color="#1E3A8A">
            {selectedCourse?.couresName} - בחר סניף
          </Typography>
    {/* כפתור יצוא כללי */}
        <Button
          variant="contained"
          onClick={handleExportGroupsExcel}
          sx={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            color: '#374151',
            border: '2px solid #e5e7eb',
            borderRadius: '18px',
            px: 4,
            py: 2,
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            minWidth: 260,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textTransform: 'none',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)',
              transition: 'left 0.6s ease-in-out'
            },
            '&:hover': {
              background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
              border: '2px solid #3b82f6',
              color: '#1e40af',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)',
              transform: 'translateY(-1px)',
              '&::before': {
                left: '100%'
              }
            },
            '&:active': {
              transform: 'translateY(0px)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            letterSpacing: '0.01em'
          }}>
            <Box sx={{ fontSize: '18px', opacity: 0.8 }}>📊</Box>
            <span>יצוא קבוצות + תלמידים לאקסל</span>
          </Box>
        </Button>
         
        </Box><br />
        {/* טבלת ערים וסניפים */}
        <Box sx={{ width: '100%', overflowX: 'auto', mt: 2 }}>
          {rows.map((citiesRow, rowIdx) => (
            <Grid container spacing={2} key={`cities-row-${rowIdx}`} sx={{ mb: 4 }}>
              {citiesRow.map((city, colIdx) => (
                <Grid item xs={12} sm={6} md={2.4} key={`city-col-${city}-${colIdx}`}> {/* 2.4*5=12 */}
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 3, minHeight: 320, minWidth: 200, maxWidth: 280, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f5f7fa' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold" color="#1E3A8A">
                        {city}
                      </Typography>
                      <LocationOn sx={{ color: '#10B981', ml: 1 }} />
                    </Box>
                    {branchesByCity[city].map((branch, branchIdx) => {
                      const activeGroupsCount = getActiveGroupsCountForBranch(branch.branchId);
                      const groupsColor = getGroupsCountColor(activeGroupsCount);
                      const statusText = getGroupsStatusText(activeGroupsCount);
                      return (
                        <Paper
                          key={`branch-${branch.branchId || branch.id || `${colIdx}-${branchIdx}`}`}
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            mb: 2,
                            width: '100%',
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
                            position: 'relative',
                            '&:hover': {
                              boxShadow: activeGroupsCount > 0
                                ? '0 8px 25px rgba(0,0,0,0.15)'
                                : '0 4px 12px rgba(0,0,0,0.1)',
                            }
                          }}
                          onClick={() => handleBranchSelect(branch)}
                        >
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleMenuOpen(e, branch, 'branch');
                            }}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              zIndex: 10
                            }}
                            size="small"
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                          <BranchIcon sx={{ fontSize: 40, color: '#10B981', mb: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold" textAlign="center" color="#1E3A8A">
                            {branch.name}
                          </Typography>
                          <Divider sx={{ width: '80%', my: 1 }} />
                          <Typography variant="body2" color="text.secondary" textAlign="center">
                            {branch.address || 'כתובת לא ידועה'}
                          </Typography>
                          <Chip
                            label={`ילדים פעילים: ${branch.maxGroupSize }`}
                            color="secondary"
                            size="small"
                            sx={{ mt: 1, bgcolor: '#6366F1', color: 'white', fontWeight: 'bold' }}
                          />
                          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                            {statusText}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>
      </motion.div>
    );
  };

  // Render group cards
  const renderGroups = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir="rtl"
    >
     
      <Box sx={{ mb: 3, mt: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Button
          endIcon={<BackIcon style={{ transform: 'scaleX(-1)' }} />}
          onClick={handleBack}
          variant="contained"
          sx={{
            direction:'ltr',
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
          {/* Add Group Card */}
        {/* שורת כפתור הוספה לקבוצות */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddGroupDialogOpen(true)}
            sx={{
              bgcolor: '#6366F1',
              color: 'white',
              borderRadius: '10px',
              px: 2,
              py: 0.5,
              fontSize: '1rem',
              minWidth: 120,
              height: 36,
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
              '&:hover': {
                bgcolor: '#4f46e5',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            הוסף קבוצה חדשה
          </Button>
        </Box>
        <Typography variant="h5" fontWeight="bold" color="#1E3A8A">
          {(() => {
            const courseName = selectedCourse?.couresName || selectedCourse?.courseName || 'חוג לא ידוע';
            const branchAddress = selectedBranch?.address || selectedBranch?.name || 'כתובת לא ידועה';
            return `${courseName} - ${branchAddress} - בחר קבוצה`;
          })()}
        </Typography>
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
        {/* כפתור יצוא סניף */}
        <Button
          variant="contained"
          onClick={handleExportBranchExcel}
          disabled={groupsByBranchLoading}
          sx={{
            background: 'linear-gradient(135deg, #4ee884ff 0%, #5036d6ff 100%)',
            color: 'white',
            border: '2px solid #f2f5fbff',
            borderRadius: '18px',
            px: 4,
            py: 2,
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(16, 120, 185, 0.25)',
            minWidth: 240,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textTransform: 'none',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              background: 'linear-gradient(135deg, #057496ff 0%, #045178ff 100%)',
              border: '2px solid #056196ff',
              boxShadow: '0 8px 25px rgba(16, 165, 185, 0.35)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
            '&:disabled': {
              opacity: 0.6,
              cursor: 'not-allowed'
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            letterSpacing: '0.01em'
          }}>
            {groupsByBranchLoading ? (
              <CircularProgress size={16} sx={{ color: 'white' }} />
            ) : (
              <Box sx={{ fontSize: '18px' }}>🏢</Box>
            )}
            <span>יצוא פרטי סניף לאקסל</span>
          </Box>
        </Button>

      
      </Box>
      </Box>
      {/* מיון לפי ימים ושעות, הצגת יום רק אם יש קבוצות */}
      {(() => {
        // קיבוץ לפי יום
        const groupsByDay = {};
        sortedGroups.forEach(group => {
          if (!groupsByDay[group.dayOfWeek]) groupsByDay[group.dayOfWeek] = [];
          groupsByDay[group.dayOfWeek].push(group);
        });
        // סדר הימים לפי dayOrder - הצגת רק ימים שיש בהם קבוצות
        const daysSorted = Object.keys(dayOrder)
          .filter(day => groupsByDay[day] && groupsByDay[day].length > 0)
          .sort((a, b) => dayOrder[a] - dayOrder[b]);
        
        // אם אין יום אחד עם קבוצות, הצג הודעה
        if (daysSorted.length === 0) {
          return (
            <Box sx={{ textAlign: 'center', mt: 4, color: '#64748b', fontWeight: 500 }}>
              אין קבוצות זמינות בסניף זה
            </Box>
          );
        }
        
        return daysSorted.map(day => (
          <Box key={day} sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" color="#6366F1" sx={{ mb: 2, textAlign: 'right' }}>
              יום {day}
            </Typography>
            <Grid container spacing={3} justifyContent="flex-start" dir="rtl">
              {groupsByDay[day].map((group, index) => (
                <Grid item xs={12} sx={{direction:'rtl'}} sm={6} md={4} key={`group-${group.groupId || group.id || index}`}>
                  <GroupCard
                    group={group}
                    instructor={group.instructor}
                    handleViewStudents={handleViewStudents}
                    handleAddStudentAndEnroll={handleAddStudentAndEnroll}
                    handleGroupSelect={handleGroupSelect}
                    exportGroupStudentsToExcel={exportGroupStudentsToExcel}
                    dispatch={dispatch}
                    handleMenuOpen={handleMenuOpen}
                    itemVariants={itemVariants}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ));
      })()}

      
    </motion.div>
  );


  // --- Render View Tabs ---
  const renderViewTabs = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3, mb: 3, flexWrap: 'wrap' }}>
      <Button
        variant="text"
        onClick={() => setView('courses')}
        sx={{
          minWidth: 110,
          fontWeight: 500,
          borderRadius: '14px',
          py: 1.2,
          px: 2.5,
          fontSize: '0.9rem',
          background: view === 'courses'
            ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
            : 'transparent',
          color: view === 'courses' ? '#0284c7' : '#94a3b8',
          border: view === 'courses' ? '1.5px solid #bae6fd' : '1.5px solid transparent',
          boxShadow: view === 'courses' ? '0 2px 8px rgba(14, 165, 233, 0.12)' : 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: view === 'courses'
              ? 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)'
              : 'rgba(241, 245, 249, 0.6)',
            color: view === 'courses' ? '#0369a1' : '#64748b',
            borderColor: view === 'courses' ? '#7dd3fc' : '#e2e8f0',
            transform: 'translateY(-1px)'
          }
        }}
      >
לפי חוג   </Button>
      <Button
        variant="text"
        onClick={() => {
          setView('days');
          setSelectedCourse(null);
          setSelectedBranch(null);
        }}
        sx={{
          minWidth: 110,
          fontWeight: 500,
          borderRadius: '14px',
          py: 1.2,
          px: 2.5,
          fontSize: '0.9rem',
          background: view === 'days'
            ? 'linear-gradient(135deg, #f0f9ff 0%, #cdeafc 100%)'
            : 'transparent',
          color: view === 'days' ? '#0284c7' : '#94a3b8',
          border: view === 'days' ? '1.5px solid #bae6fd' : '1.5px solid transparent',
          boxShadow: view === 'days' ? '0 2px 8px rgba(14, 165, 233, 0.12)' : 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: view === 'days'
              ? 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)'
              : 'rgba(241, 245, 249, 0.6)',
            color: view === 'days' ? '#0369a1' : '#64748b',
            borderColor: view === 'days' ? '#7dd3fc' : '#e2e8f0',
            transform: 'translateY(-1px)'
          }
        }}
      >
         לפי יום 
      </Button>
    </Box>
  );

  // --- Main Render ---
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          padding: { xs: 2, md: 4 },
          background: 'linear-gradient(to right, #e0f2fe, #f8fafc)',
          minHeight: '100vh',
          borderRadius: 8
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
              mb: 3,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            בחר חוג, סניף וקבוצה כדי לשבץ תלמיד בקלות ובמהירות
          </Typography>
          {/* הודעה על שמירה אוטומטית */}
          <Paper
            elevation={0}
            sx={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1.5px solid #e2e8f0',
              borderRadius: 2,
              p: 1.5,
              mb: 2,
              textAlign: 'center',
              maxWidth: '360px',
              mx: 'auto'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#475569',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.8,
                fontSize: '0.8rem',
                lineHeight: 1.4
              }}
            >
              <Typography component="span" sx={{ fontSize: '0.9rem' }}>💾</Typography>
              הנתונים נשמרים אוטומטית
            </Typography>
            {/* כפתור ניקוי נתונים */}
            <Box sx={{ mt: 1 }}>
              <Button
                onClick={resetForm}
                variant="text"
                size="small"
                startIcon={<DeleteSweep sx={{ fontSize: '1rem' }} />}
                sx={{
                  borderRadius: '12px',
                  px: 2,
                  py: 0.8,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#64748b',
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: '#fee2e2',
                    color: '#dc2626'
                  }
                }}
              >
                נקה נתונים
              </Button>
            </Box>
          </Paper>
        </motion.div>

        {/* Smart Matching Button + Student Group Search Button */}
        {renderSmartMatchingButton()}

        {renderViewTabs()}
        {view === 'courses' && renderCourses()}
        {view === 'branches' && renderBranches()}
        {view === 'groups' && renderGroups()}
        {view === 'days' && (
          <>
            {renderDaysFilter()}
            {renderGroupsByDay()}
          </>
        )}

        {/* Render Menu */}
        {renderMenu()}

        {/* Smart Matching Dialog */}
        <Dialog
          open={algorithmDialogOpen}
          onClose={() => setAlgorithmDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: '#f8fafc',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              minWidth: { xs: '90%', sm: '500px' }
            }
          }}
        >
          <DialogTitle
            style={{
    background: 'linear-gradient(135deg,#2a5298 50%,#4facfe 100%)', // ✅ אותו רקע כמו הnavbar
              color: 'white',
              textAlign: 'center',
              padding: '20px',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: 'white'
            }}>
              <span style={{ color: 'white' }}>מערכת התאמה חכמה</span>
            </div>


          </DialogTitle>
          <DialogContent sx={{ px: 4, py: 3, direction: 'rtl' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <CustomAIIcon />
              </motion.div>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E3A8A', mb: 1 }}>
                אלגוריתם מתקדם לשיבוץ אוטומטי
              </Typography>
              <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.6 }}>
                הזן מספר תעודת זהות של התלמיד והמערכת תמצא עבורך את החוג המתאים ביותר
                על בסיס גיל, מגזר, מקומות פנויים ומיקום גיאוגרפי
              </Typography>
            </Box>

            {/* <Box sx={{ 
              bgcolor: 'rgba(102, 126, 234, 0.05)', 
              borderRadius: 3, 
              p: 1, 
              mb: 1,
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#667eea', mb: 2 }}>
                🔍 המערכת בודקת:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <Typography variant="body2">• התאמת גיל</Typography>
                <Typography variant="body2">• מגזר מתאים</Typography>
                <Typography variant="body2">• זמינות מקומות</Typography>
                <Typography variant="body2">• קרבה גיאוגרפית</Typography>
              </Box>
            </Box> */}

            <TextField
              autoFocus
              label="מספר תעודת זהות"
              type="text"
              fullWidth
              variant="outlined"
              value={smartMatchingStudentId}
              onChange={(e) => setSmartMatchingStudentId(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'white',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                    borderWidth: '2px'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                    borderWidth: '2px'
                  }
                }
              }}
              inputProps={{ dir: 'rtl' }}
              placeholder="הזן מספר תעודת זהות..."
            />
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'space-between', px: 4, pb: 3 }}>
            <Button
              variant="outlined"
              color="error"
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.2,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px'
                }
              }}
              onClick={() => {
                setAlgorithmDialogOpen(false);
                setSmartMatchingStudentId('');
              }}
            >
              ביטול
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.2,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                  },
                  '&:disabled': {
                    opacity: 0.6
                  }
                }}
                onClick={handleSmartMatchingOpen}
                disabled={!smartMatchingStudentId.trim()}
                startIcon={<CustomRocketIcon />}
              >
                מצא חוגים מושלמים
              </Button>
            </motion.div>
          </DialogActions>
        </Dialog>

        {/* Smart Matching System Modal */}
        <Dialog
          open={smartMatchingOpen}
          onClose={() => setSmartMatchingOpen(false)}
          maxWidth="xl"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              minHeight: '80vh',
              maxHeight: '90vh',
              overflow: 'hidden', // חשוב!
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >


          <DialogContent
            sx={{
              p: 0,
              bgcolor: '#f8fafc',
              flex: 1, // תופס את כל המקום הזמין
              overflow: 'hidden', // מסתיר את הגלילה הכללית
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {smartMatchingStudentData && (
              <Box sx={{
                height: '100%',
                overflow: 'auto', // מאפשר גלילה פנימית
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '10px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                  }
                }
              }}>
                <SmartMatchingSystem
                  studentData={smartMatchingStudentData}
                  onEnrollSuccess={handleEnrollmentSuccess}
                  onClose={() => setSmartMatchingOpen(false)}
                />
              </Box>
            )}
          </DialogContent>
        </Dialog>
        {/* Enrollment Success Modal */}
        <AnimatePresence>
          {enrollmentSuccessOpen && (
            <EnrollmentSuccess
              student={successData.student}
              group={successData.group}
              onClose={() => {
                setEnrollmentSuccessOpen(false);
                setSuccessData({ student: null, group: null });

                // רענון הנתונים אחרי סגירת הודעת ההצלחה
                if (selectedCourse) {
                  dispatch(getGroupsByCourseId(selectedCourse.courseId));
                }
              }}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              direction: 'rtl',
              borderRadius: 2,
              minWidth: { xs: '90%', sm: '400px' },
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: '#ef4444',
              color: 'white',
              textAlign: 'center',
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <DeleteIcon />
            אישור מחיקה
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2, textAlign: 'center', marginTop: '10px' }}>
            <Typography variant="h6" gutterBottom>
              האם אתה בטוח שברצונך למחוק את {
                deleteType === 'course' ? 'החוג' :
                  deleteType === 'branch' ? 'הסניף' :
                    deleteType === 'group' ? 'הקבוצה' : 'הפריט'
              }?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {itemToDelete && (
                deleteType === 'course' ? itemToDelete.couresName :
                  deleteType === 'branch' ? `${itemToDelete.name} - ${itemToDelete.city}` :
                    deleteType === 'group' ? `קבוצה ${itemToDelete.groupName}` : ''
              )}
            </Typography>
            <Typography variant="body2" color="error.main" sx={{ mt: 2, fontWeight: 'bold' }}>
              פעולה זו לא ניתנת לביטול!
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                }
              }}
            >
              ביטול
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                bgcolor: '#ef4444',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
                '&:hover': {
                  bgcolor: '#dc2626',
                  boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              מחק
            </Button>
          </DialogActions>
        </Dialog>

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
                    <strong>חוג:</strong> {selectedCourse?.courseName || selectedCourse?.couresName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>עיר:</strong> {selectedBranch?.city}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>סניף:</strong> {selectedBranch?.address || selectedBranch?.name || 'כתובת לא ידועה'}
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
                {selectedGroup?.numOfLessons && (
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>מספר שיעורים שהיו:</strong> {selectedGroup.lessonsCompleted}
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
                bgcolor: 'rgba(59,130,246,0.04)',
                borderRadius: '14px',
                boxShadow: '0 2px 8px rgba(59,130,246,0.08)',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  fontWeight: 'bold',
                  fontSize: '1.08rem',
                  letterSpacing: '0.04em',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3B82F6',
                    borderWidth: '2px'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3B82F6',
                    borderWidth: '2px'
                  }
                },
                '& .MuiInputAdornment-root': {
                  color: '#3B82F6',
                  fontSize: '1.3rem'
                }
              }}
              inputProps={{ dir: 'rtl', maxLength: 9, style: { fontWeight: 'bold', fontSize: '1.08rem', letterSpacing: '0.04em' } }}
              InputProps={{
                startAdornment: (
                  <span style={{marginRight:8, color:'#3B82F6', fontSize:'1.3rem'}}>🆔</span>
                )
              }}
              helperText="יש להזין 9 ספרות של תעודת זהות"
            />
         <TextField
  label="תאריך התחלה"
  type="date"
  value={enrollDate}
  onChange={e => setEnrollDate(e.target.value)}
  InputLabelProps={{ shrink: true }}
  fullWidth
  sx={{
    mt: 2,
    bgcolor: 'rgba(16,185,129,0.04)',
    borderRadius: '14px',
    boxShadow: '0 2px 8px rgba(16,185,129,0.08)',
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      letterSpacing: '0.04em',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#10B981',
        borderWidth: '2px'
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#10B981',
        borderWidth: '2px'
      }
    },
    '& .MuiInputAdornment-root': {
      color: '#10B981',
      fontSize: '1.3rem'
    }
  }}
  InputProps={{
    startAdornment: (
      <span style={{marginRight:8, color:'#10B981', fontSize:'1.3rem'}}>📅</span>
    )
  }}
  helperText="יש לבחור תאריך התחלה לחוג"
/>

{/* בחירת סטטוס קבוצה */}
<Box sx={{ mt: 2, mb: 2 }}>
  <Typography variant="subtitle2" sx={{ mb: 1, color: '#374151', fontWeight: 'bold' }}>
    סטטוס בקבוצה:
  </Typography>
  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
    <Button
      variant={groupStatus === true ? 'contained' : 'outlined'}
      onClick={() => setGroupStatus(true)}
      sx={{
        borderRadius: '12px',
        px: 3,
        py: 1,
        fontWeight: 'bold',
        bgcolor: groupStatus === true ? '#10B981' : 'transparent',
        borderColor: '#10B981',
        color: groupStatus === true ? 'white' : '#10B981',
        '&:hover': {
          bgcolor: groupStatus === true ? '#059669' : 'rgba(16, 185, 129, 0.1)',
          borderColor: '#10B981'
        }
      }}
    >
      ✅ פעיל
    </Button>
    <Button
      variant={groupStatus === false ? 'contained' : 'outlined'}
      onClick={() => setGroupStatus(false)}
      sx={{
        borderRadius: '12px',
        px: 3,
        py: 1,
        fontWeight: 'bold',
        bgcolor: groupStatus === false ? '#efa544ff' : 'transparent',
        borderColor: '#efa544ff',
        color: groupStatus === false ? 'white' : '#efa544ff',
        '&:hover': {
          bgcolor: groupStatus === false ? '#ed992cff' : 'rgba(239, 68, 68, 0.1)',
          borderColor: '#efa544ff'
        }
      }}
    >
      🤝 ליד 
    </Button>
  </Box>
  <Typography variant="caption" sx={{ 
    display: 'block', 
    textAlign: 'center', 
    mt: 1, 
    color: '#6B7280' 
  }}>
    {groupStatus ? 'התלמיד יהיה פעיל בקבוצה ותירשם נוכחות' : 'התלמיד יהיה רשום אך לא פעיל בקבוצה'}
  </Typography>
</Box>

{/* חישוב מספר השיעורים לתלמיד ותאריכים עתידיים */}
{(() => {
  const dayOfWeekMap = {
    'ראשון': 0,
    'שני': 1,
    'שלישי': 2,
    'רביעי': 3,
    'חמישי': 4,
    'שישי': 5,
    'שבת': 6
  };

  const lessonDayOfWeek =
    typeof selectedGroup?.dayOfWeek === 'string'
      ? dayOfWeekMap[selectedGroup.dayOfWeek]
      : selectedGroup?.dayOfWeek;

  const groupStartDate = selectedGroup?.startDate;
  const numOfLessons = selectedGroup?.numOfLessons || 0;
  const lessonsCompleted = selectedGroup?.lessonsCompleted || 0;

  // === פונקציה עוזרת לבניית מערך תאריכים של כל השיעורים ===
function getAllLessonDates(startDate, lessonDay, totalLessons) {
  if (!startDate || typeof lessonDay !== 'number' || totalLessons <= 0) return [];
  const lessons = [];
  // נוודא שעובדים על תאריכים חופפים (00:00)
  let current = new Date(startDate.getFullYear ? startDate : new Date(startDate));
  current = new Date(current.getFullYear(), current.getMonth(), current.getDate());
  // מצא את היום הראשון שבו השיעור מתקיים (כולל startDate אם מתאים)
  while (current.getDay() !== lessonDay) {
    current.setDate(current.getDate() + 1);
  }
  for (let i = 0; i < totalLessons; i++) {
    lessons.push(new Date(current.getFullYear(), current.getMonth(), current.getDate()));
    current.setDate(current.getDate() + 7);
  }
  return lessons;
}

function calculateStudentLessons(groupStart, enroll, lessonDay, totalLessons, lessonsDone) {
  if (!groupStart || !enroll || typeof lessonDay !== 'number' || totalLessons <= 0) 
    return { count: 0, dates: [] };

  const allLessons = getAllLessonDates(new Date(groupStart), lessonDay, totalLessons);
  const enrollDateObj = new Date(enroll);
  const enrollMid = new Date(enrollDateObj.getFullYear(), enrollDateObj.getMonth(), enrollDateObj.getDate());

  // אילו שיעורים לפי לו"ז הם מתאריך ההרשמה והלאה
  const remainingLessons = allLessons.filter(d => d >= enrollMid);

  // מספר שיעורים שנשארו לתלמיד
  const studentLessonsCount = remainingLessons.length;

  // אם רוצים לשמור על עקביות עם סה״כ - כבר היו שיעורים
  // אפשר לוודא שהוא לא עולה על numOfLessons - lessonsCompleted
  const maxAllowed = Math.max(totalLessons - lessonsDone, 0);
  const finalCount = Math.min(studentLessonsCount, maxAllowed);

  const studentDates = remainingLessons.slice(0, finalCount);

  return { count: finalCount, dates: studentDates };
}




  // חישוב פשוט: מספר שיעורים כללי פחות שיעורים שהיו
  const studentLessonsCount = Math.max(numOfLessons - lessonsCompleted, 0);

  return (
    <Box sx={{ mt: 2, bgcolor: '#ECFDF5', p: 2, borderRadius: 2 }}>
      <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 'bold' }}>
        מספר שיעורים לתלמיד: {studentLessonsCount}
      </Typography>
    </Box>
  );
})()}

          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'rtl', gap: 2 }}>
            <Button
              onClick={handleEnrollStudent}
              variant="contained"
              color="primary"
              startIcon={<EnrollIcon />}
              sx={{
                direction: 'ltr',
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
            
            <Button
              onClick={() => {
                setEnrollDialogOpen(false);
                setAddStudentDialogOpen(true);
              }}
              variant="outlined"
              color="success"
              startIcon={<PersonAddIcon />}
              sx={{
                direction:'ltr',
                borderRadius: '12px',
                px: 3,
                py: 1.2,
                borderColor: '#10B981',
                color: '#10B981',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#059669',
                  color: '#059669',
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  borderWidth: '2px',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)',
                },
                '&:active': {
                  transform: 'translateY(1px)',
                },
                transition: 'all 0.3s ease',
                fontSize: '0.95rem',
                fontWeight: 'bold'
              }}
            >
              הוסף תלמיד חדש ושבץ מיידית
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
            
            {/* הודעה על שמירה אוטומטית */}
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 2,
                p: 2,
                mb: 3,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#059669',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <InfoIcon sx={{ fontSize: 18 }} />
                הנתונים נשמרים אוטומטית - תוכל לעבור ללשוניות אחרות ולחזור
              </Typography>
            </Paper>
            
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
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={resetForm}
                variant="outlined"
                color="warning"
                startIcon={<DeleteSweep />}
                sx={{
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  borderWidth: '2px',
                  color: '#f59e0b',
                  borderColor: '#f59e0b',
                  '&:hover': {
                    borderWidth: '2px',
                    bgcolor: 'rgba(245, 158, 11, 0.05)',
                    borderColor: '#d97706'
                  }
                }}
              >
                איפוס טופס
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
            </Box>
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
            
            {/* הודעה על שמירה אוטומטית */}
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 2,
                p: 2,
                mb: 3,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#059669',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <InfoIcon sx={{ fontSize: 18 }} />
                הנתונים נשמרים אוטומטית - תוכל לעבור ללשוניות אחרות ולחזור
              </Typography>
            </Paper>
            
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
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={resetForm}
                variant="outlined"
                color="warning"
                startIcon={<DeleteSweep />}
                sx={{
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  borderWidth: '2px',
                  color: '#f59e0b',
                  borderColor: '#f59e0b',
                  '&:hover': {
                    borderWidth: '2px',
                    bgcolor: 'rgba(245, 158, 11, 0.05)',
                    borderColor: '#d97706'
                  }
                }}
              >
                איפוס טופס
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
            </Box>
          </DialogActions>
        </Dialog>

        {/* Add Group Dialog */}
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
            
            {/* הודעה על שמירה אוטומטית */}
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 2,
                p: 2,
                mb: 3,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#059669',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <InfoIcon sx={{ fontSize: 18 }} />
                הנתונים נשמרים אוטומטית - תוכל לעבור ללשוניות אחרות ולחזור
              </Typography>
            </Paper>
            
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
                  placeholder="דוגמא: 2-8 או 6-9"
                  helperText="הכנס טווח גילאים בפורמט: גיל-גיל (דוגמא: 2-8)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="מספר מקומות פנויים"
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
                <FormControl fullWidth>
  <InputLabel>בחר מדריך</InputLabel>
  <Select
    value={selectedInstructorId}
    onChange={e => setSelectedInstructorId(e.target.value)}
    label="בחר מדריך"
  >
    {instructors.map(inst => (
      <MenuItem key={inst.id} value={inst.id}>
        {inst.firstName} {inst.lastName}
      </MenuItem>
    ))}
  </Select>
</FormControl>
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
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={resetForm}
                variant="outlined"
                color="warning"
                startIcon={<DeleteSweep />}
                sx={{
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  borderWidth: '2px',
                  color: '#f59e0b',
                  borderColor: '#f59e0b',
                  '&:hover': {
                    borderWidth: '2px',
                    bgcolor: 'rgba(245, 158, 11, 0.05)',
                    borderColor: '#d97706'
                  }
                }}
              >
                איפוס טופס
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
            </Box>
          </DialogActions>
        </Dialog>

        {/* Best Group Dialog */}
        <Dialog
          open={showBestGroupDialog}

          onClose={() => setShowBestGroupDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }
          }}
        >
          <DialogTitle sx={{
            bgcolor: '#10B981',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            textAlign: 'center',
            py: 2
          }}>
            🎉 נמצאה קבוצה מומלצת
          </DialogTitle>

          <DialogContent sx={{ px: 4, py: 3 }}>
            {bestGroup ? (
              <Box sx={{
                bgcolor: '#f0fdf4',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
              }}>
                <Typography variant="body1" fontWeight="bold" color="#065f46" gutterBottom>
                  {bestGroup.groupName}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2"><strong>חוג:</strong> {bestGroup.groupName}</Typography>
                <Typography variant="body2"><strong>מגזר:</strong> {bestGroup.sector || 'כללי'}</Typography>
                <Typography variant="body2"><strong>יום בשבוע:</strong> {bestGroup.dayOfWeek}</Typography>
                <Typography variant="body2"><strong>שעה:</strong> {bestGroup.hour}</Typography>
                <Typography variant="body2"><strong>טווח גילאים:</strong> {bestGroup.ageRange}</Typography>
                <Typography variant="body2"><strong>מקומות פנויים:</strong> {bestGroup.maxStudents}</Typography>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                לא נמצאה קבוצה מתאימה.
              </Typography>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center', px: 3, pb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowBestGroupDialog(false)}
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.2,
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              סגור
            </Button>
          </DialogActions>
        </Dialog>

        {/* Student Courses Dialog */}
        <StudentCoursesDialog
          open={studentCoursesDialogOpen}
          onClose={() => {
            setStudentCoursesDialogOpen(false);
            setSelectedStudentForDialog(null);
            setSelectedStudentCoursesForDialog([]);
          }}
          student={selectedStudentForDialog}
          studentCourses={selectedStudentCoursesForDialog}
          showAddButton={false}
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
       <AnimatePresence>
      {enrollmentSuccessOpen && (
        <EnrollmentSuccess
          student={successData.student}
          group={successData.group}
          onClose={() => {
            setEnrollmentSuccessOpen(false);
            setSuccessData({ student: null, group: null });
          }}
        />
      )}
    </AnimatePresence>
    
    {/* Edit Course Dialog */}
    <Dialog
      open={editCourseDialogOpen}
      onClose={() => {
        setEditCourseDialogOpen(false);
        setEditingItem(null);
      }}
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
        עריכת חוג
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
          value={editingItem?.couresName || ''}
          onChange={(e) => setEditingItem({ ...editingItem, couresName: e.target.value })}
        />
        <TextField
          margin="dense"
          label="תיאור"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          inputProps={{ dir: 'rtl' }}
          value={editingItem?.description || ''}
          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setEditCourseDialogOpen(false);
            setEditingItem(null);
          }}
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
          startIcon={<CheckIcon />}
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
          onClick={handleUpdateCourse}
        >
          עדכן חוג
        </Button>
      </DialogActions>
    </Dialog>

    {/* Edit Branch Dialog */}
    <Dialog
      open={editBranchDialogOpen}
      onClose={() => {
        setEditBranchDialogOpen(false);
        setEditingItem(null);
      }}
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
        עריכת סניף
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
          value={editingItem?.name || ''}
          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="כתובת"
          type="text"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          inputProps={{ dir: 'rtl' }}
          value={editingItem?.address || ''}
          onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })}
        />
        <TextField
          margin="dense"
          label="עיר"
          type="text"
          fullWidth
          variant="outlined"
          inputProps={{ dir: 'rtl' }}
          value={editingItem?.city || ''}
          onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setEditBranchDialogOpen(false);
            setEditingItem(null);
          }}
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
          startIcon={<CheckIcon />}
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
          onClick={handleUpdateBranch}
        >
          עדכן סניף
        </Button>
      </DialogActions>
    </Dialog>

    {/* Edit Group Dialog */}
    <Dialog
      open={editGroupDialogOpen}
      onClose={() => {
        setEditGroupDialogOpen(false);
        setEditingItem(null);
      }}
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
          bgcolor: '#6366F1',
          color: 'white',
          textAlign: 'center',
          py: 2
        }}
      >
        עריכת קבוצה
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
              value={editingItem?.groupName || ''}
              onChange={(e) => setEditingItem({ ...editingItem, groupName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel>יום בשבוע</InputLabel>
              <Select
                value={editingItem?.dayOfWeek || ''}
                onChange={(e) => setEditingItem({ ...editingItem, dayOfWeek: e.target.value })}
                label="יום בשבוע"
              >
                {allowedDays.map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
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
              value={editingItem?.hour || ''}
              onChange={(e) => setEditingItem({ ...editingItem, hour: e.target.value })}
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
              value={editingItem?.ageRange || ''}
              onChange={(e) => setEditingItem({ ...editingItem, ageRange: e.target.value })}
              placeholder="דוגמא: 2-8 או 6-9"
              helperText="הכנס טווח גילאים בפורמט: גיל-גיל (דוגמא: 2-8)"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="מספר מקומות פנויים"
              type="number"
              fullWidth
              variant="outlined"
              value={editingItem?.maxStudents || 0}
              onChange={(e) => setEditingItem({ ...editingItem, maxStudents: parseInt(e.target.value) || 0 })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel>מגזר</InputLabel>
              <Select
                value={editingItem?.sector || ''}
                onChange={(e) => setEditingItem({ ...editingItem, sector: e.target.value })}
                label="מגזר"
              >
                {allowedSectors.map((sector) => (
                  <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="מספר שיעורים"
              type="number"
              fullWidth
              variant="outlined"
              value={editingItem?.numOfLessons || 0}
              onChange={(e) => setEditingItem({ ...editingItem, numOfLessons: parseInt(e.target.value) || 0 })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="תאריך התחלה"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={editingItem?.startDate || ''}
              onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setEditGroupDialogOpen(false);
            setEditingItem(null);
          }}
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
          startIcon={<CheckIcon />}
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            bgcolor: '#6366F1',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
            '&:hover': {
              bgcolor: '#5B5FD6',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
            },
            transition: 'all 0.3s ease'
          }}
          onClick={handleUpdateGroup}
        >
          עדכן קבוצה
        </Button>
      </DialogActions>
    </Dialog>

    {/* Students List Dialog */}
    <Dialog
      open={studentsListDialogOpen}
      onClose={() => {
        setStudentsListDialogOpen(false);
        setSelectedGroupForStudents(null);
        setEnhancedStudentsInGroup([]);
        dispatch(clearStudentsInGroup());
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          direction: 'rtl'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#6366F1', 
        color: 'white', 
        fontWeight: 'bold',
        borderRadius: '16px 16px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        direction: 'rtl'
      }}>
        <ViewIcon />
        רשימת התלמידים - קבוצה {selectedGroupForStudents?.groupName}
      </DialogTitle>
      <DialogContent sx={{ p: 3, direction: 'rtl' }}>
        {studentsInGroupLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4} sx={{ direction: 'rtl' }}>
            <CircularProgress sx={{ color: '#6366F1' }} />
            <Typography sx={{ mr: 2 }}>טוען רשימת תלמידים...</Typography>
          </Box>
        ) : studentsInGroup.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={4} sx={{ direction: 'rtl' }}>
            <StudentIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              אין תלמידים רשומים לקבוצה זו
            </Typography>
          </Box>
        ) : (
          <Box sx={{ direction: 'rtl' }}>
            <Typography variant="body1" sx={{ mb: 1, color: '#6366F1', fontWeight: 'bold', textAlign: 'right' }}>
              סה"כ {studentsInGroup.length} תלמידים רשומים
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#64748b', textAlign: 'right', display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon sx={{ fontSize: 16 }} />
              לחץ על כרטיס התלמיד לצפייה בפרטים המלאים
            </Typography>
            <Grid container spacing={2}>
              {(enhancedStudentsInGroup.length > 0 ? enhancedStudentsInGroup : studentsInGroup).map((student, index) => {
                console.log('🔍 Student data structure:', student);
                return (
                <Grid item xs={12} sm={6} md={4} key={student.studentId || index}>
                  <Tooltip title="לחץ לצפייה בפרטים המלאים של התלמיד" arrow>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid #e5e7eb',
                        direction: 'rtl',
                        textAlign: 'right',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          borderColor: '#6366F1',
                          transform: 'translateY(-2px)',
                          backgroundColor: 'rgba(99, 102, 241, 0.05)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => handleViewStudentDetails(student)}
                    >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} sx={{ direction: 'rtl' }}>
                      <Box display="flex" alignItems="center" sx={{ direction: 'rtl' }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 1 }}>
                          {student.studentName}
                        </Typography>
                        <StudentIcon sx={{ color: '#6366F1' }} />
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="ערוך פרטי התלמיד">
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: '#10b981',
                              '&:hover': { 
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                transform: 'scale(1.1)'
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditStudentDetails(student);
                            
                            }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <InfoIcon sx={{ color: '#6366F1', fontSize: 18, opacity: 0.7 }} />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                      <span>🆔 ת"ז: {student.fullDetails?.id || student.Student?.id || student.studentId || student.id}</span>
                    </Typography>
                    {(student.fullDetails?.phone || student.Student?.phone || student.phone) && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                        <span>📞 טלפון: {student.fullDetails?.phone || student.Student?.phone || student.phone}</span>
                      </Typography>
                    )}
                    {(student.fullDetails?.secondaryPhone || student.Student?.secondaryPhone || student.secondaryPhone) && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                        <span>📱 טלפון נוסף: {student.fullDetails?.secondaryPhone || student.Student?.secondaryPhone || student.secondaryPhone}</span>
                      </Typography>
                    )}
                    {(student.fullDetails?.email || student.Student?.email || student.email) && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                        <span>📧 מייל: {student.fullDetails?.email || student.Student?.email || student.email}</span>
                      </Typography>
                    )}
                    {(student.fullDetails?.age || student.Student?.age || student.age) && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                        <span>🎂 גיל: {student.fullDetails?.age || student.Student?.age || student.age}</span>
                      </Typography>
                    )}
                    {(student.fullDetails?.class || student.Student?.class || student.class) && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          📚 כיתה: {student.fullDetails?.class || student.Student?.class || student.class}
                        </span>
                      </Typography>
                    )}
                    {(student.fullDetails?.city || student.Student?.city || student.city) && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                        <span>🏙️ עיר: {student.fullDetails?.city || student.Student?.city || student.city}</span>
                      </Typography>
                    )}
                    {(student.fullDetails?.school || student.Student?.school || student.school) && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                        <span>🏫 בית ספר: {student.fullDetails?.school || student.Student?.school || student.school}</span>
                      </Typography>
                    )}
                    {(student.fullDetails?.sector || student.Student?.sector || student.sector) && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                        <span>🌍 מגזר: {student.fullDetails?.sector || student.Student?.sector || student.sector}</span>
                      </Typography>
                    )}
                    {(student.fullDetails?.healthFund || student.Student?.healthFund || student.healthFund) && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                        <span>🏥 קופת חולים: {student.fullDetails?.healthFund || student.Student?.healthFund || student.healthFund}</span>
                      </Typography>
                    )}
                      {(student.fullDetails?.createdBy || student.Student?.createdBy || student.createdBy) && (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2, opacity: 0.7 }}><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
                            <span>נוצר ע"י: {student.fullDetails?.createdBy || student.Student?.createdBy || student.createdBy}</span>
                          </span>
                        </Typography>
                      )}
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                      <span>📅 תאריך רישום: {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString('he-IL') : 'לא זמין'}</span>
                    </Typography>
                   <Typography
  variant="body2"
  color="text.secondary"
  sx={{
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    justifyContent: 'flex-start',
    direction: 'rtl'
  }}
>
  {/* <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <StatusIcon status={student.student?.status} />
    סטטוס: {student.student?.status}
  </span> */}


</Typography>
 <Typography
  variant="body2"
  color="text.secondary"
  sx={{
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    justifyContent: 'flex-start',
    direction: 'rtl'
  }}
>
  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    {student.isActive ? '✅' : '❌'}
    סטטוס בחוג: {student.isActive ? 'פעיל' : 'לא פעיל'}
  </span>
</Typography>

                    {student.branchName && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                        <span>🏢 סניף: {student.branchName}</span>
                      </Typography>
                    )}
                    {student.instructorName && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                        <span>👨‍🏫 מדריך: {student.instructorName}</span>
                      </Typography>
                    )}
                   
                  </Paper>
                  </Tooltip>
                </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, direction: 'rtl' }}>
        <Button
          variant="outlined"
          onClick={() => {
            setStudentsListDialogOpen(false);
            setSelectedGroupForStudents(null);
            setEnhancedStudentsInGroup([]);
            dispatch(clearStudentsInGroup());
          }}
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            borderColor: '#6366F1',
            color: '#6366F1',
            '&:hover': {
              borderColor: '#5B5FD6',
              bgcolor: 'rgba(99, 102, 241, 0.05)',
            }
          }}
        >
          סגור
        </Button>
      </DialogActions>
    </Dialog>

    {/* Add Student Dialog for Enrollment */}
    <AddStudentDialog
      open={addStudentDialogOpen}
      onClose={() => setAddStudentDialogOpen(false)}
      onSuccess={handleAddStudentAndEnroll}
      title="הוסף תלמיד חדש ושבץ לקבוצה"
      submitButtonText=" הוסף ושבץ מיידית"
      keepOpenAfterSubmit={false}
      selectedGroup={selectedGroup}
      groupStatus={groupStatus}
      onGroupStatusChange={setGroupStatus}
      lessonInfo={{
        totalLessons: selectedGroup?.numOfLessons || 0,
        completedLessons: selectedGroup?.lessonsCompleted || 0,
        studentLessons: Math.max((selectedGroup?.numOfLessons || 0) - (selectedGroup?.lessonsCompleted || 0), 0)
      }}
    />

    {/* דיאלוג קופת חולים */}
    <AddStudentHealthFundDialog
      open={healthFundDialogOpen}
      onClose={handleCloseHealthFundDialog}
      studentId={selectedStudentForHealthFund?.id}
      onSuccess={() => {
        handleCloseHealthFundDialog();
        setNotification({
          open: true,
          message: '!קופת חולים נוספה בהצלחה לתלמיד',
          severity: 'success'
        });
      }}
    />

    {/* דיאלוג שיבוץ תלמיד קיים */}
    {editStudentDialogOpen && selectedStudentForEdit && selectedGroup && (
      <Dialog
        open={editStudentDialogOpen}
        onClose={() => {
          setEditStudentDialogOpen(false);
          setSelectedStudentForEdit(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', direction: 'rtl' } }}
      >
        <DialogTitle sx={{ bgcolor: '#3b82f6', color: 'white', textAlign: 'right' }}>
          <Typography variant="h6">שיבוץ תלמיד קיים לחוג</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1E3A8A' }}>
              {selectedStudentForEdit.firstName} {selectedStudentForEdit.lastName} | ת"ז: {selectedStudentForEdit.id}
            </Typography>
          </Box>
          <Box sx={{ mb: 2, bgcolor: '#F3F4F6', p: 2, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: '#374151' }}>
              <strong>קבוצה:</strong> {selectedGroup.groupName}<br />
              <strong>יום בשבוע:</strong> {selectedGroup.dayOfWeek}<br />
              <strong>תאריך התחלה:</strong> {selectedGroup.startDate}<br />
              <strong>מספר שיעורים בקבוצה:</strong> {selectedGroup.numOfLessons}
            </Typography>
            {/* הצגת מספר שיעורים לתלמיד מתחת לתאריך התחלה */}
            {(() => {
              // המרת יום השבוע למספר
              const dayOfWeekMap = {
                'ראשון': 0,
                'שני': 1,
                'שלישי': 2,
                'רביעי': 3,
                'חמישי': 4,
                'שישי': 5,
                'שבת': 6
              };
              let lessonDayOfWeek = selectedGroup.dayOfWeek;
              if (typeof lessonDayOfWeek === 'string') {
                lessonDayOfWeek = dayOfWeekMap[lessonDayOfWeek];
              }
              const groupStartDate = selectedGroup.startDate;
              const numOfLessons = selectedGroup.numOfLessons;
              const lessonsCompleted = selectedGroup.lessonsCompleted || 0;
              // השתמש בשדה enrollDate שהמשתמש ממלא
              const enrollDateCalc = enrollDate || groupStartDate;
              function getStudentLessonDates(groupStartDate, enrollDate, lessonDayOfWeek, numOfLessons) {
                let start = new Date(Math.max(new Date(groupStartDate), new Date(enrollDate)));
                let lessons = [];
                let count = 0;
                while (start.getDay() !== lessonDayOfWeek) {
                  start.setDate(start.getDate() + 1);
                }
                while (count < numOfLessons) {
                  lessons.push(new Date(start));
                  start.setDate(start.getDate() + 7);
                  count++;
                }
                return lessons;
              }
              // חישוב פשוט: מספר שיעורים כללי פחות שיעורים שהיו
              const studentLessonsCount = Math.max(numOfLessons - lessonsCompleted, 0);
              return (
                  <Box sx={{ mt: 2, bgcolor: '#ECFDF5', p: 2, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                      מספר שיעורים לתלמיד: {studentLessonsCount}
                    </Typography>
                  </Box>
                );
            })()}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, direction: 'rtl' }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setEditStudentDialogOpen(false);
              setSelectedStudentForEdit(null);
            }}
            sx={{ borderRadius: '8px', px: 3, py: 1 }}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => {/* כאן תוכל להוסיף את הלוגיקה לשיבוץ */}}
            sx={{ borderRadius: '8px', px: 3, py: 1, bgcolor: '#3B82F6', color: 'white' }}
          >
            שבץ תלמיד
          </Button>
        </DialogActions>
      </Dialog>
    )}
   

    {/* Edit Student Dialog */}
    <Dialog
      open={editStudentDialogOpen}
      onClose={() => {
        setEditStudentDialogOpen(false);
        setSelectedStudentForEdit(null);
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px', direction: 'rtl' }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#3b82f6', color: 'white', textAlign: 'right' }}>
        <Typography variant="h6">
          ערוך פרטי תלמיד
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {selectedStudentForEdit && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם פרטי"
                value={selectedStudentForEdit.firstName || ''}
                onChange={(e) => setSelectedStudentForEdit(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))}
                sx={{ direction: 'rtl' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="שם משפחה"
                value={selectedStudentForEdit.lastName || ''}
                onChange={(e) => setSelectedStudentForEdit(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))}
                sx={{ direction: 'rtl' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="טלפון"
                value={selectedStudentForEdit.phone || ''}
                onChange={(e) => setSelectedStudentForEdit(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
                sx={{ direction: 'rtl' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="📱 טלפון נוסף"
                value={selectedStudentForEdit.secondaryPhone || ''}
                onChange={(e) => setSelectedStudentForEdit(prev => ({
                  ...prev,
                  secondaryPhone: e.target.value
                }))}
                sx={{ direction: 'rtl' }}
                placeholder="טלפון נוסף (אופציונלי)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="אימייל"
                value={selectedStudentForEdit.email || ''}
                onChange={(e) => setSelectedStudentForEdit(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                sx={{ direction: 'rtl' }}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, direction: 'rtl' }}>
        <Button 
          onClick={() => {
            setEditStudentDialogOpen(false);
            setSelectedStudentForEdit(null);
          }}
        >
          ביטול
        </Button>
        <Button 
          variant="contained"
          onClick={async () => {
            if (selectedStudentForEdit) {
              try {
                if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
                // Use editStudent thunk to update student
                const result = await dispatch(editStudent(selectedStudentForEdit));
                if (result.type === 'students/editStudent/fulfilled') {
                  setNotification({
                    open: true,
                    message: 'פרטי התלמיד עודכנו בהצלחה',
                    severity: 'success'
                  });
                  setEditStudentDialogOpen(false);
                  setSelectedStudentForEdit(null);
                  // Refresh the group data if needed
                  if (selectedGroup) {
                    dispatch(getStudentsByGroupId(selectedGroup.id));
                  }
                } else {
                  throw new Error('Failed to update student');
                }
              } catch (error) {
                console.error('Error updating student:', error);
                setNotification({
                  open: true,
                  message: 'שגיאה בעדכון פרטי התלמיד',
                  severity: 'error'
                });
              }
            }
          }}
        >
          שמור שינויים
        </Button>
      </DialogActions>
    </Dialog>

    {/* Edit Student Dialog */}
    <EditStudentDialog
      open={editStudentDialogOpen}
      onClose={() => {
        setEditStudentDialogOpen(false);
        setSelectedStudentForEdit(null);
      }}
      student={selectedStudentForEdit}
      onStudentUpdated={async (updatedStudent) => {
        try {
          // Refresh the students list for the current group with full details
          if (selectedGroupForStudents) {
            console.log('🔄 Refreshing students list after update...');
            await handleViewStudents(selectedGroupForStudents);
          }
          setNotification({
            open: true,
            message: 'פרטי התלמיד עודכנו בהצלחה',
            severity: 'success'
          });
        } catch (error) {
          console.error('Error refreshing students after update:', error);
          setNotification({
            open: true,
            message: 'הנתונים עודכנו אך יש בעיה בטעינה מחדש',
            severity: 'warning'
          });
        }
      }}
    />

    {/* Student Group Search Dialog */}
    <Dialog
      open={studentSearchDialogOpen}
      onClose={() => setStudentSearchDialogOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontWeight: 'bold', 
        color: '#1e40af',
        borderBottom: '1px solid #e2e8f0',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <span style={{ fontSize: '28px' }}>🔍</span>
          חיפוש קבוצות תלמיד
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#64748b' }}>
          הכנס קוד תלמיד כדי למצוא את כל הקבוצות בהן הוא רשום
        </Typography>
        
        <TextField
          fullWidth
          label="קוד תלמיד"
          value={searchStudentId}
          onChange={(e) => setSearchStudentId(e.target.value)}
          type="number"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '18px',
              textAlign: 'center',
              '& fieldset': {
                borderColor: '#cbd5e1',
                borderWidth: 2
              },
              '&:hover fieldset': {
                borderColor: '#10b981'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#10b981',
                borderWidth: 2
              }
            },
            '& .MuiInputLabel-root': {
             
             
              '&.Mui-focused': {
                color: '#10b981'
              }
            }
          }}
          placeholder="...הכנס מספר תלמיד"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleStudentGroupSearch();
            }
          }}
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={() => setStudentSearchDialogOpen(false)}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            borderColor: '#cbd5e1',
            color: '#64748b',
            '&:hover': {
              borderColor: '#94a3b8',
              backgroundColor: '#f8fafc'
            }
          }}
        >
          ביטול
        </Button>
        <Button
          onClick={handleStudentGroupSearch}
          variant="contained"
          disabled={searchLoading || !searchStudentId.trim()}
          sx={{
            borderRadius: 2,
            px: 4,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            },
            '&:disabled': {
              background: '#cbd5e1',
              color: '#94a3b8'
            }
          }}
        >
          {searchLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
             ...מחפש
            </Box>
          ) : (
            'חפש קבוצות'
          )}
        </Button>
      </DialogActions>
    </Dialog>

    {/* Student Groups Results Dialog */}
    <Dialog
      open={searchResultDialogOpen}
      onClose={() => setSearchResultDialogOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontWeight: 'bold', 
        color: '#1e40af',
        borderBottom: '1px solid #e2e8f0',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <span style={{ fontSize: '28px' }}>📚</span>
          קבוצות התלמיד {searchStudentName && `${searchStudentName} `}
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {studentGroups.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {studentGroups.map((groupStudent, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    width: 320,
                    minWidth: 320,
                    maxWidth: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    background: groupStudent.isActive 
                      ? 'linear-gradient(135deg, #ffffff 0%, #f0fff4 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #fff0f0 100%)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    direction: 'rtl',
                    textAlign: 'right',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  {!groupStudent.isActive && (
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
                        zIndex: 1
                      }}
                    >
                      לא פעיל
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'flex-start' }}>
                    <GroupIcon sx={{ fontSize: 40, color: '#6366F1', ml: 1 }} />
                    <Typography variant="h6" fontWeight="bold" color="#1E3A8A">
                      <span style={{wordBreak: 'break-word', whiteSpace: 'pre-line'}}>
                        קבוצה {groupStudent.groupName || 'לא זמין'}
                      </span>
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ width: '100%', mb: 2 }} />
                  
                  {groupStudent.dayOfWeek && groupStudent.hour && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                      <DayIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                      <Typography variant="body2">
                        {groupStudent.hour} {groupStudent.dayOfWeek}
                      </Typography>
                    </Box>
                  )}

                  {groupStudent.ageRange && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                      <StudentIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                      <Typography variant="body2">
                        גילאים: {groupStudent.ageRange}
                      </Typography>
                    </Box>
                  )}
                  
                  {groupStudent.sector && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                      <SectorIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                      <Typography variant="body2">
                        מגזר: {groupStudent.sector || 'כללי'}
                      </Typography>
                    </Box>
                  )}

                  {groupStudent.courseName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                      <CourseIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                      <Typography variant="body2">
                        חוג: {groupStudent.courseName}
                      </Typography>
                    </Box>
                  )}
                  
                  {groupStudent.branchName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                      <BranchIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                      <Typography variant="body2">
                        סניף: {groupStudent.branchName}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mt: 'auto', pt: 2, width: '100%' }}>
                    {/* שורה ראשונה: תאריך רישום */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, direction:'ltr'}}>
                      <Chip
                        icon={<CalendarIcon />}
                        label={`רישום: ${groupStudent.entrollmentDate ? new Date(groupStudent.entrollmentDate).toLocaleDateString('he-IL') : 'לא זמין'}`}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    
                    {/* שורה שנייה: סטטוס */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, direction:'ltr'}}>
                      <Chip
                        icon={groupStudent.isActive ? <AvailableIcon /> : <FullIcon />}
                        label={groupStudent.isActive ? 'פעיל' : 'לא פעיל'}
                        color={groupStudent.isActive ? "success" : "error"}
                        variant="filled"
                        size="small"
                        sx={{
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="#64748b">
              לא נמצאו קבוצות עבור תלמיד זה
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={() => {
            setSearchResultDialogOpen(false);
            setSearchStudentId('');
            setStudentGroups([]);
            setSearchStudentName('');
          }}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 4,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
            }
          }}
        >
          סגור
        </Button>
      </DialogActions>
    </Dialog>
    {/* Student Search Dialog - New Component with ID and Name search */}
    <StudentSearchDialog
      open={studentSearchDialogOpen}
      onClose={() => setStudentSearchDialogOpen(false)}
    />
    
    </Container>
  );


};

export default EnrollStudent;