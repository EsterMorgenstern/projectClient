
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { exportGroupsToExcelWithData } from '../../../utils/exportGroupsToExcelWithData';
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
import { groupStudentAddThunk } from '../../../store/groupStudent/groupStudentAddThunk';
import { getgroupStudentByStudentId } from '../../../store/groupStudent/groupStudentGetByStudentIdThunk';
import { getStudentsByGroupId } from '../../../store/group/groupGetStudentsByGroupId';
import { clearStudentsInGroup } from '../../../store/group/groupSlice';
import AddStudentDialog from '../../Students/components/AddStudentDialog';
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

import './style/enrollStudent.css';
import { fetchInstructors } from '../../../store/instructor/instructorGetAllThunk';
const EnrollStudent = () => {
  // ...existing code...

  // כפתור יצוא לאקסל
  const handleExportGroupsExcel = async () => {
  if (!selectedGroup) {
    setNotification({ open: true, message: 'לא נבחרה קבוצה לייצוא', severity: 'error' });
    return;
  }
  await exportGroupStudentsToExcel(selectedGroup.groupId, selectedGroup.groupName, dispatch);
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
  const groupStudents = useSelector(state => state.groupStudents.groupStudentById || []);
  const bestGroup = useSelector(state => state.groups.bestGroupForStudent);
  const studentsInGroup = useSelector(state => state.groups.studentsInGroup || []);
  const studentsInGroupLoading = useSelector(state => state.groups.studentsInGroupLoading);
const instructors = useSelector(state => state.instructors.instructors || []);

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
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [view, setView] = useState('courses'); // courses, branches, groups
const [selectedInstructorId, setSelectedInstructorId] = useState('');

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
  const allowedDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];

const dayOrder = {
  'ראשון': 1,
  'שני': 2,
  'שלישי': 3,
  'רביעי': 4,
  'חמישי': 5,
  'שישי': 6,
  'שבת': 7
};

function parseHour(hourStr) {
  if (!hourStr) return 0;
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


  //   <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
  //     <motion.div
  //       whileHover={{ scale: 1.02 }}
  //       whileTap={{ scale: 0.98 }}
  //     >
  //       <Button
  //         variant="contained"
  //         size="large"
  //         onClick={() => setAlgorithmDialogOpen(true)}
  //         sx={{
  //           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  //           borderRadius: '20px',
  //           px: 4,
  //           py: 2,
  //           fontSize: '1.1rem',
  //           fontWeight: 'bold',
  //           boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
  //           '&:hover': {
  //             background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
  //             boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
  //           },
  //           transition: 'all 0.3s ease'
  //         }}
  //         startIcon={
  //          <CustomRocketIcon />
  //         }
  //       >
  //         מערכת התאמה חכמה - שיבוץ אוטומטי
  //       </Button>
  //     </motion.div>
  //   </Box>
  // );

  // Menu functions
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
          isActive: true
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
          message: `התלמיד ${studentData.firstName} ${studentData.lastName} נוסף בהצלחה ושובץ לקבוצה!`,
          severity: 'success',
          action: (
            <Button
              color="inherit"
              size="small"
              onClick={() => fetchAndShowStudentCourses(studentData.id)}
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
        });          // סגירת דיאלוג הרישום
          setEnrollDialogOpen(false);
          setStudentId('');
        } else {
          // הצגת שגיאה ספציפית מהשרת
          const errorMessage = enrollResult.payload || 'שגיאה לא ידועה בשיבוץ';
          console.error('❌ Enrollment failed:', errorMessage);
          
          setNotification({
            open: true,
            message: `התלמיד נוסף בהצלחה אך היתה שגיאה בשיבוץ לקבוצה: ${errorMessage}`,
            severity: 'warning',
            action: (
              <Button
                color="inherit"
                size="small"
                onClick={() => fetchAndShowStudentCourses(studentData.id)}
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
        }
        
      } catch (error) {
        console.error('❌ Error enrolling new student:', error);
        setNotification({
          open: true,
          message: `התלמיד נוסף בהצלחה אך היתה שגיאה בשיבוץ לקבוצה: ${error.message || 'אנא נסה שנית'}`,
          severity: 'warning',
          action: (
            <Button
              color="inherit"
              size="small"
              onClick={() => fetchAndShowStudentCourses(studentData.id)}
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
alert('תאריך רישום: ' + (enrollDate ? new Date(enrollDate).toISOString().split('T')[0] : ''));
  try {
    const entrollmentDate = {
      studentId: studentId,
      groupId: groupId,
      enrollmentDate: enrollDate ? new Date(enrollDate).toISOString().split('T')[0] : '',
      isActive: true
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

  // Render Smart Matching Button
  const renderSmartMatchingButton = () => (
    <motion.div
      className="smart-matching-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.button
        className="smart-matching-trigger-main"
                onClick={() => setAlgorithmDialogOpen(true)}
        disabled={loading}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="button-content">
          <motion.div
            className="button-icon"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            🎯
          </motion.div>
          <div className="button-text">
            <h3>מערכת התאמה חכמה</h3>
            <p>אלגוריתם מתקדם למציאת החוג המושלם לכל תלמיד</p>
          </div>
          <motion.div
            className="button-arrow"
            animate={{ x: [0, 5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ←
          </motion.div>
        </div>
        <div className="button-glow"></div>
      </motion.button>
    </motion.div>
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
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
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
      // בדוק אם הסניף קשור לחוג שנבחר
      return branch.courseId === selectedCourse?.courseId || 
             branch.courseId === selectedCourse?.id ||
             // אם אין courseId בסניף, זה אומר שהוא זמין לכל החוגים (מבנה ישן)
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

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        dir="rtl"
      >
        <Box sx={{ mb: 3, display: 'flex',direction:'rtl', alignItems: 'center', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-end'  }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'row-reverse', justifyContent: 'flex-end', gap: 2 }}>
            <Typography variant="h5" fontWeight="bold" color="#1E3A8A">
              {selectedCourse?.couresName} - בחר סניף
            </Typography>
             {/* שורת כפתור הוספה לסניפים */}
        {Object.keys(branchesByCity).length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
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
          </Box>
        )}
            <Button
              endIcon={<BackIcon style={{ transform: 'scaleX(-1)' }} />}
              onClick={handleBack}
              variant="contained"
              sx={{
                direction:'ltr',
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
           
          </Box>
        </Box>

        {/* בדיקה אם יש סניפים זמינים */}
        {Object.keys(branchesByCity).length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-start', flexDirection: 'row-reverse', gap: 2 }}>
            <Button
              startIcon={<BackIcon />}
              onClick={handleBack}
              variant="contained"
              sx={{
                bgcolor: '#1E40AF',
                color: 'white',
                borderRadius: '12px',
                px: 3,
                py: 1,
                boxShadow: '0 4px 14px rgba(30, 64, 175, 0.25)',
                '&:hover': {
                  bgcolor: '#1E3A8A',
                  boxShadow: '0 6px 20px rgba(30, 64, 175, 0.35)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              חזרה לחוגים
            </Button>
            
            <Typography variant="h5" fontWeight="bold" color="#1E3A8A">
              {selectedCourse?.couresName} - בחר סניף
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddBranchDialogOpen(true)}
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                bgcolor: '#10B981',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  bgcolor: '#059669',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              הוסף סניף ראשון
            </Button>
          </Box>
        ) : (
          Object.entries(branchesByCity).map(([city, cityBranches], cityIndex) => (
          <Box key={`city-${city}-${cityIndex}`} sx={{ mb: 4 }}>
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
              <LocationOn sx={{ color: '#10B981', ml: 1 }} />
            </Box>

            <Grid container spacing={3} justifyContent="center" dir="rtl">
              {cityBranches.map((branch, branchIndex) => {
                const activeGroupsCount = getActiveGroupsCountForBranch(branch.branchId);
                const groupsColor = getGroupsCountColor(activeGroupsCount);
                const statusText = getGroupsStatusText(activeGroupsCount);

                return (
                  <Grid item xs={12} sm={6} md={4} key={`branch-${branch.branchId || branch.id || `${cityIndex}-${branchIndex}`}`}>
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

                        <Box sx={{ position: 'relative', mb: 2 }}>
                          <BranchIcon
                            sx={{
                              fontSize: 50,
                              color: activeGroupsCount > 0 ? '#10B981' : '#9ca3af',
                              transition: 'color 0.3s ease'
                            }}
                          />
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
          ))
        )}

       
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
     
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
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
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleExportGroupsExcel}
          sx={{
            background: 'linear-gradient(90deg, #10b981 0%, #3B82F6 100%)',
            color: 'white',
            borderRadius: '16px',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            fontSize: '1.15rem',
            boxShadow: '0 6px 24px rgba(59,130,246,0.12)',
            minWidth: 220,
            transition: 'all 0.3s',
            '&:hover': {
              background: 'linear-gradient(90deg, #059669 0%, #2563eb 100%)',
              boxShadow: '0 10px 32px rgba(59,130,246,0.18)',
            }
          }}
        >
          <span style={{fontWeight:'bold'}}>יצוא קבוצות + תלמידים לאקסל</span>
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
        // סדר הימים לפי dayOrder
        const daysSorted = Object.keys(dayOrder)
          .filter(day => groupsByDay[day] && groupsByDay[day].length > 0)
          .sort((a, b) => dayOrder[a] - dayOrder[b]);
        return daysSorted.map(day => (
          <Box key={day} sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" color="#6366F1" sx={{ mb: 2, textAlign: 'right' }}>
              יום {day}
            </Typography>
            <Grid container spacing={3} justifyContent="flex-start" dir="rtl">
              {groupsByDay[day].map((group, index) => (
                <Grid item xs={12} sm={6} md={4} key={`group-${group.groupId || group.id || index}`}>
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
                        width: 320,
                        minWidth: 320,
                        maxWidth: 320,
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        background: group.availableSpots > 0
                          ? 'linear-gradient(135deg, #ffffff 0%, #f0fff4 100%)'
                          : 'linear-gradient(135deg, #ffffff 0%, #fff0f0 100%)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        direction: 'rtl',
                        textAlign: 'right',
                        '&:hover': {
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        }
                      }}
                      onClick={() => handleGroupSelect(group)}
                    >
                      <IconButton
  onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    exportGroupStudentsToExcel(group.groupId, group.groupName, dispatch);
  }}
  sx={{
    position: 'absolute',
    top: 8,
    left: 40,
    color: '#3B82F6',
    bgcolor: 'rgba(59, 130, 246, 0.1)',
    '&:hover': {
      bgcolor: 'rgba(59, 130, 246, 0.2)',
    },
    zIndex: 10
  }}
  size="small"
>
  <Tooltip title="ייצוא לאקסל">
    <FileDownloadIcon fontSize="small" />
  </Tooltip>
</IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleMenuOpen(e, group, 'group');
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
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'flex-start' }}>
                        <GroupIcon sx={{ fontSize: 40, color: '#6366F1', ml: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#1E3A8A">
                          <span style={{wordBreak: 'break-word', whiteSpace: 'pre-line'}}>
                            קבוצה {group.groupName}
                          </span>
                        </Typography>
                      </Box>
                      <Divider sx={{ width: '100%', mb: 2 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                        <DayIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                        <Typography variant="body2">
                          {group.hour} {group.dayOfWeek}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                        <StudentIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                        <Typography variant="body2">
                          גילאים: {group.ageRange}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                        <SectorIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                        <Typography variant="body2">
                          מגזר: {group.sector || 'כללי'}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 'auto', pt: 2, width: '100%' }}>
                        {/* שורה ראשונה: מקומות פנויים */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 ,direction:'ltr'}}>
                          <Chip
                            icon={group.maxStudents > 0 ? <AvailableIcon /> : <FullIcon />}
                            label={`${group.maxStudents} מקומות פנויים`}
                            color={group.maxStudents > 0 ? "success" : "error"}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                        {/* שורה שנייה: צפה ברשימת התלמידים */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewStudents(group);
                            }}
                            sx={{
                              direction:'ltr',
                              borderColor: '#6366F1',
                              color: '#6366F1',
                              borderRadius: '8px',
                              px: 2,
                              '&:hover': {
                                borderColor: '#4f46e5',
                                color: '#4f46e5',
                                bgcolor: 'rgba(99, 102, 241, 0.1)',
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            צפה ברשימת התלמידים בקבוצה זו
                          </Button>
                        </Box>
                        {/* שורה שלישית: כפתור שיבוץ תלמיד */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                          <Tooltip title={group.maxStudents > 0 ? "לחץ לשיבוץ תלמיד" : "אין מקומות פנויים"}>
                            <span>
                              <Button
                                variant="contained"
                                size="small"
                                disabled={group.maxStudents <= 0}
                                startIcon={<EnrollIcon />}
                                sx={{
                                  direction:'ltr',
                                  bgcolor: group.maxStudents > 0 ? '#10B981' : 'grey.400',
                                  borderRadius: '8px',
                                  boxShadow: group.maxStudents > 0 ? '0 4px 10px rgba(16, 185, 129, 0.2)' : 'none',
                                  px: 3,
                                  py: 1,
                                  '&:hover': {
                                    bgcolor: group.maxStudents > 0 ? '#059669' : 'grey.400',
                                    boxShadow: group.maxStudents > 0 ? '0 6px 15px rgba(16, 185, 129, 0.3)' : 'none',
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                שבץ תלמיד חדש/קיים לקבוצה זו
                              </Button>
                            </span>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        ));
      })()}

      
    </motion.div>
  );

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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper
              elevation={1}
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 3,
                p: 2,
                mb: 4,
                textAlign: 'center',
                maxWidth: '600px',
                mx: 'auto'
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
                  gap: 1,
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                <InfoIcon sx={{ fontSize: 20 }} />
                💾 הנתונים נשמרים אוטומטית - תוכל לעבור ללשוניות אחרות ולחזור בכל עת
              </Typography>
              
              {/* כפתור ניקוי נתונים */}
              <Box sx={{ mt: 2 }}>
                <Button
                  onClick={resetForm}
                  variant="outlined"
                  size="small"
                  startIcon={<DeleteSweep />}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    fontSize: '0.75rem',
                    color: '#f59e0b',
                    borderColor: '#f59e0b',
                    '&:hover': {
                      bgcolor: 'rgba(245, 158, 11, 0.05)',
                      borderColor: '#d97706'
                    }
                  }}
                >
                  נקה את כל הנתונים השמורים
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </motion.div>

        {/* Smart Matching Button */}
        {renderSmartMatchingButton()}

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
                        <span>📚 כיתה: {student.fullDetails?.class || student.Student?.class || student.class}</span>
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
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-start', direction: 'rtl' }}>
                      <span>{student.isActive ? '✅' : '❌'} סטטוס: {student.isActive ? 'פעיל' : 'לא פעיל'}</span>
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
    />

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
   
    
    </Container>
  );


};

export default EnrollStudent;