import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Box, Typography, Chip, InputAdornment,
  Skeleton, Tooltip, Snackbar, Alert, IconButton,
  Grid, Divider, Paper,
  TableBody, TableRow, TableCell
} from '@mui/material';
import {
  Add, Edit, Delete, Info as InfoIcon, Search as SearchIcon,
  Close as CloseIcon, School as SchoolIcon,
  Group as GroupIcon, ArrowBack,
  LocationOn as LocationIcon, CalendarToday as DayIcon, ChildCare as StudentIcon, Apartment as SectorIcon,
  CheckCircleOutline as AvailableIcon, Cancel as FullIcon, Person as PersonIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups } from '../../store/group/groupGellAllThunk';
import { getGroupsByBranch } from '../../store/group/groupGetGroupsByBranchThunk';
import { getGroupsByCourseId } from '../../store/group/groupGetGroupsByCourseIdThunk';
import { addGroup } from '../../store/group/groupAddThunk';
import { updateGroup } from '../../store/group/groupUpdateThunk';
import { deleteGroup } from '../../store/group/groupDeleteThunk';
import { fetchCourses } from '../../store/course/CoursesGetAllThunk';
import { addCourse } from '../../store/course/courseAddThunk';
import { updateCourse } from '../../store/course/courseUpdateThunk';
import { deleteCourse } from '../../store/course/courseDeleteThunk';
import { fetchBranches } from '../../store/branch/branchGetAllThunk';
import { addBranch } from '../../store/branch/branchAddThunk';
import { updateBranch } from '../../store/branch/branchUpdateThunk';
import { deleteBranch } from '../../store/branch/branchDelete';
import { CourseDialog, BranchDialog, GroupDialog, DeleteConfirmDialog } from './components/ManagementDialogs';
// Instructors are already loaded in redux state, no need to refetch on every group update
import GroupDetailsPanel from './components/GroupDetailsPanel';
import StyledTableShell from '../../components/StyledTableShell';
import StatsCard from '../../components/StatsCard';
import '../styles/tableStyles.css';

// Loading Skeleton
const LoadingSkeleton = () => (
  <Grid container spacing={3} sx={{ p: 3 }}>
    {[...Array(4)].map((_, i) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
        <Skeleton variant="rectangular" height={200} />
      </Grid>
    ))}
  </Grid>
);

const GroupsTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groupsState = useSelector(state => state.groups || {});
  // Use groupsByBranch if a branch is selected, otherwise use groups
  const {
    groups = groupsState.groups || [],
    groupsByBranch = groupsState.groupsByBranch || [],
    groupsByBranchId = groupsState.groupsByBranchId || null,
    groupsByBranchLoading = groupsState.groupsByBranchLoading || false,
    loading: groupsLoading,
    error
  } = groupsState;
  const { courses = [], loading: coursesLoading } = useSelector(state => state.courses || {});
  const { branches = [], loading: branchesLoading } = useSelector(state => state.branches || {});
  const { instructors = [] } = useSelector(state => state.instructors || {});

  // Loading רק בטעינה ראשונית - אם כל הנתונים עדיין ריקים
  const isInitialLoad = courses.length === 0 && branches.length === 0 && groups.length === 0;
  const loading = isInitialLoad && (groupsLoading || coursesLoading || branchesLoading);

  // Main navigation state
  const [view, setView] = useState('courses'); // 'courses' -> 'branches'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBranches, setExpandedBranches] = useState({});

  // Dialog states
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [openBranchDialog, setOpenBranchDialog] = useState(false);
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  // Edit states
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState(null); // 'course', 'branch', 'group'

  // Form data - עם useMemo להימנע מיצירת reference חדש בכל render
  const initialFormData = useMemo(() => ({
    couresName: '',
    description: '',
    name: '',
    address: '',
    city: '',
    groupName: '',
    groupId: '',
    CourseId: '',
    branchId: '',
    instructorId: '',
    dayOfWeek: '',
    hour: '',
    location: '',
    maxStudents: '',
    ageRange: '',
    sector: '',
    numOfLessons: '',
    startDate: '',
    lessonsCompleted: '',
    isActive: true
  }), []);

  const [formData, setFormData] = useState(initialFormData);

  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [openGroupDetailsDialog, setOpenGroupDetailsDialog] = useState(false);
  const [displayedGroups, setDisplayedGroups] = useState([]); // State to trigger re-render when groups change
  const [optimisticPending, setOptimisticPending] = useState(false); // כשהפעלנו עדכון אופטימי
  const groupsVersionRef = useRef(0); // מונה שינויים ב-groups מרידאקס
  const optimisticVersionRef = useRef(0); // הגרסה בעת העדכון האופטימי
  const lastBranchGroupsRef = useRef([]);
  const initialLoadRef = useRef(false);

  // Initial load - טעינה ראשונית אחת במקביל לכל הנתונים
  useEffect(() => {
    if (initialLoadRef.current) {
      return;
    }
    initialLoadRef.current = true;
    dispatch(fetchCourses());
    dispatch(fetchBranches());
    dispatch(fetchGroups());
  }, [dispatch]);

  // When a course is selected, load its groups only
  useEffect(() => {
    if (selectedCourse) {
      const courseId = selectedCourse.courseId || selectedCourse.id || selectedCourse.CourseId;
      if (courseId) {
        dispatch(getGroupsByCourseId(courseId));
      }
    }
  }, [selectedCourse, dispatch]);

  // When a branch is selected - immediately load its groups
  useEffect(() => {
    if (selectedBranch) {
      const branchId = selectedBranch.branchId || selectedBranch.id || selectedBranch.BranchId;
      if (branchId) {
        dispatch(getGroupsByBranch(branchId));
      }
    }
  }, [selectedBranch, dispatch]);

  // Helper functions - עם memoization לביצועים מיטביים
  const getBranchesForCourse = useCallback((courseId) => {
    return branches.filter(b => (b.courseId === courseId || b.CourseId === courseId));
  }, [branches]);

  const getCourseName = useCallback((courseId) => {
    return courses.find(c => c.courseId === courseId || c.id === courseId || c.CourseId === courseId)?.couresName || '-';
  }, [courses]);

  const getBranchName = useCallback((branchId) => {
    return branches.find(b => b.branchId === branchId || b.id === branchId || b.BranchId === branchId)?.name || '-';
  }, [branches]);

  const getGroupsForBranch = useCallback((branchId) => {
    // Use all groups array for accurate count
    const allGroups = groups || [];
    const result = allGroups.filter(g => {
      const gBranchId = g.branchId || g.BranchId;
      return gBranchId === branchId || gBranchId === Number(branchId);
    });
    return result;
  }, [groups]);

  const getGroupsByDay = useCallback((groupsList) => {
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'];
    const grouped = {};
    days.forEach(day => grouped[day] = []);
    groupsList.forEach(g => {
      const day = g.dayOfWeek || g.day || 'ראשון';
      if (grouped[day]) grouped[day].push(g);
      else grouped['ראשון'].push(g);
    });
    return grouped;
  }, []);

  // Memoized calculations - מחושבים פעם אחת בלבד ברמת הקומפוננטה
  const branchGroupsData = useMemo(() => {
    if (!selectedBranch) return [];
    const branchId = selectedBranch.branchId || selectedBranch.id || selectedBranch.BranchId;

    // Prefer Redux-provided branch groups only if they match the current branchId
    if (groupsByBranch && groupsByBranch.length > 0 && groupsByBranchId === branchId) {
      return groupsByBranch;
    }

    // Fallback: filter from main groups array for immediate display
    const filtered = getGroupsForBranch(branchId);
    if (filtered.length > 0) return filtered;

    // If loading and no data yet, preserve last known groups to avoid clearing UI
    if (groupsByBranchLoading && lastBranchGroupsRef.current && lastBranchGroupsRef.current.length > 0) {
      return lastBranchGroupsRef.current;
    }

    return filtered; // empty
  }, [selectedBranch, groupsByBranch, groupsByBranchId, groupsByBranchLoading, getGroupsForBranch, groups]);

  const sortedGroupsData = useMemo(() => {
    // פשוט מחזירים את הקבוצות ללא מיון לפי ימים
    return branchGroupsData;
  }, [branchGroupsData]);

  // Update displayed groups when sortedGroupsData changes - ensures Component re-renders
  useEffect(() => {
    if (optimisticPending) return; // אל תדרוך על עדכון אופטימי
    setDisplayedGroups(sortedGroupsData);
    // Update last non-empty cache per branch
    if (selectedBranch) {
      if (sortedGroupsData && sortedGroupsData.length > 0) {
        lastBranchGroupsRef.current = sortedGroupsData;
      }
    } else {
      lastBranchGroupsRef.current = [];
    }
  }, [sortedGroupsData, selectedBranch, optimisticPending]);

  // כאשר בתצוגת טבלה ללא סניף נבחר, שמור את הקבוצות המלאות ל-displayedGroups כדי לאפשר עדכון אופטימי גם שם
  useEffect(() => {
    // ספירת גרסאות של groups מרידאקס
    groupsVersionRef.current += 1;

    // אם אנחנו באמצע עדכון אופטימי, אל תדרוך עליו עד שיגיע נתון חדש
    if (optimisticPending && groupsVersionRef.current <= optimisticVersionRef.current) {
      return;
    }

    // אם הגיעו נתונים חדשים לאחר אופטימיסטי - אפשר לדרוך, וסמן שסיימנו את האופטימיסטי
    if (optimisticPending && groupsVersionRef.current > optimisticVersionRef.current) {
      setOptimisticPending(false);
    }

    if (viewMode === 'table' && !selectedBranch) {
      setDisplayedGroups(groups);
    }
  }, [viewMode, selectedBranch, groups, optimisticPending]);

  // Dialog handlers - עם useCallback למניעת re-renders מיותרים
  const handleOpenGroupDetails = useCallback((group) => {
    const groupId = group.groupId || group.id || group.GroupId;
    navigate(`/group/${groupId}`);
  }, [navigate]);

  const handleOpenCourseDialog = useCallback((course = null) => {
    if (course) {
      setEditingItem(course);
      setEditType('course');
      setFormData(prev => ({
        ...prev,
        couresName: course.couresName || '',
        description: course.description || ''
      }));
    } else {
      setEditingItem(null);
      setEditType('course');
      setFormData(prev => ({ ...initialFormData, couresName: '', description: '' }));
    }
    setOpenCourseDialog(true);
  }, []);

  const handleOpenBranchDialog = useCallback((branch = null) => {
    if (branch) {
      setEditingItem(branch);
      setEditType('branch');
      setFormData(prev => ({
        ...prev,
        name: branch.name || '',
        address: branch.address || '',
        city: branch.city || ''
      }));
    } else {
      setEditingItem(null);
      setEditType('branch');
      setFormData(prev => ({ ...initialFormData, name: '', address: '', city: '' }));
    }
    setOpenBranchDialog(true);
  }, []);

  const handleOpenGroupDialog = useCallback((group = null) => {
    if (group) {
      let parsedDay = '';
      let parsedHour = '';
      if (group.schedule) {
        const parts = group.schedule.split(' ');
        parsedDay = parts[0] || '';
        parsedHour = parts[1] || '';
      }
      parsedDay = parsedDay || group.dayOfWeek || group.DayOfWeek || '';
      parsedHour = parsedHour || group.hour || group.Hour || '';

      // Resolve instructorId from instructorName
      let instructorId = group.instructorId || group.InstructorId || '';

      // If we have instructorName, find the ID from instructors array
      if (group.instructorName) {
        const foundInstructor = instructors.find(i =>
          i.instructorName === group.instructorName ||
          `${i.firstName || ''} ${i.lastName || ''}`.trim() === group.instructorName
        );
        if (foundInstructor) {
          instructorId = foundInstructor.instructorId || foundInstructor.id;
        }
      }

      console.log('📝 Edit Group - Parsed data:', { schedule: group.schedule, parsedDay, parsedHour });
      console.log('📋 Full group data:', group);
      console.log('👤 Instructor Name:', group.instructorName);
      console.log('👤 Instructor ID resolved:', instructorId);

      setEditingItem(group);
      setEditType('group');
      setFormData({
        groupName: group.groupName || '',
        groupId: group.groupId || group.GroupId || '',
        CourseId: group.CourseId || group.courseId || selectedCourse?.courseId || selectedCourse?.id || '',
        BranchId: group.BranchId || group.branchId || selectedBranch?.branchId || selectedBranch?.BranchId || selectedBranch?.id || '',
        instructorId: instructorId,
        dayOfWeek: parsedDay,
        hour: parsedHour,
        location: group.location || '',
        maxStudents: group.maxStudents || '',
        ageRange: group.ageRange || '',
        sector: group.sector || '',
        numOfLessons: group.numOfLessons || '',
        startDate: group.startDate || '',
        lessonsCompleted: group.lessonsCompleted || '',
        isActive: group.isActive !== undefined ? group.isActive : true
      });
    } else {
      setEditingItem(null);
      setEditType('group');
      setFormData({
        ...initialFormData,
        CourseId: selectedCourse?.courseId || selectedCourse?.id || '',
        BranchId: selectedBranch?.branchId || selectedBranch?.BranchId || selectedBranch?.id || '',
        isActive: true
      });
    }
    setOpenGroupDialog(true);
  }, [selectedCourse, selectedBranch]);

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetFormData = useCallback(() => setFormData(initialFormData), []);

  // Optimistic update - עדכן את displayedGroups מיד אחרי עדכון בהצלחה
  // עדכון Redux state ישירות לקבוצה שעודכנה (optimistic)
  const updateGroupsStateOptimistic = useCallback((updatedGroup) => {
    // עדכן displayedGroups
    setDisplayedGroups(prev =>
      prev.map(g => {
        const gId = g.id || g.groupId || g.GroupId;
        const updatedId = updatedGroup.GroupId || updatedGroup.groupId || updatedGroup.id;
        return gId === updatedId ? { ...g, ...updatedGroup } : g;
      })
    );

    // עדכן גם את Redux state groups array
    // (כך שזה לא יתעדכן בחזרה לערכים ישנים כשנטעין רענון)
    if (dispatch && dispatch.toString().includes('thunk')) {
      // פשוט עדכנו את displayedGroups - זה מספיק
    }
  }, []);

  const updateDisplayedGroupsOptimistic = useCallback((updatedGroup) => {
    // רשום שהפעלנו עדכון אופטימי בגרסת הנתונים הנוכחית
    optimisticVersionRef.current = groupsVersionRef.current;
    setOptimisticPending(true);

    setDisplayedGroups(prev => {
      // אם אין רשימה קיימת (מצב טבלה ללא סינון סניף), השתמש ב-groups כבסיס
      const base = (prev && prev.length > 0) ? prev : groups;
      return base.map(g => {
        const gId = g.id || g.groupId || g.GroupId;
        const updatedId = updatedGroup.GroupId || updatedGroup.groupId || updatedGroup.id;
        return gId === updatedId ? { ...g, ...updatedGroup } : g;
      });
    });
  }, [groups]);

  const handleSaveItem = async () => {
    try {
      let result;

      if (editType === 'course') {
        if (!formData.couresName) {
          setNotification({ open: true, message: 'אנא הזן שם חוג', severity: 'warning' });
          return;
        }
        const courseData = {
          CourseId: editingItem?.id || editingItem?.courseId,
          CouresName: formData.couresName,
          Description: formData.description || ''
        };
        if (editingItem) {
          result = await dispatch(updateCourse({ id: editingItem.id || editingItem.courseId, ...courseData }));
        } else {
          result = await dispatch(addCourse(courseData));
        }
        setOpenCourseDialog(false);
      } else if (editType === 'branch') {
        if (!formData.name) {
          setNotification({ open: true, message: 'אנא הזן שם סניף', severity: 'warning' });
          return;
        }
        const branchData = {
          BranchId: editingItem?.id || editingItem?.branchId,
          Name: formData.name,
          Address: formData.address || '',
          City: formData.city || '',
          CourseId: selectedCourse?.courseId || selectedCourse?.id,
          MaxGroupSize: 10
        };
        if (editingItem) {
          result = await dispatch(updateBranch({ id: editingItem.id || editingItem.branchId, ...branchData }));
        } else {
          result = await dispatch(addBranch(branchData));
        }
        setOpenBranchDialog(false);
      } else if (editType === 'group') {
        if (!formData.groupName || !formData.instructorId) {
          setNotification({ open: true, message: 'אנא מלא שם קבוצה ומדריך', severity: 'warning' });
          return;
        }
        const groupData = {
          GroupId: editingItem?.id || editingItem?.groupId || editingItem?.GroupId || 0,
          GroupName: formData.groupName,
          CourseId: formData.CourseId,
          BranchId: formData.BranchId,
          InstructorId: formData.instructorId,
          DayOfWeek: formData.dayOfWeek,
          Hour: formData.hour,
          MaxStudents: parseInt(formData.maxStudents) || 0,
          AgeRange: formData.ageRange || '',
          Sector: formData.sector || 'כללי',
          NumOfLessons: parseInt(formData.numOfLessons) || 0,
          StartDate: formData.startDate || '',
          LessonsCompleted: parseInt(formData.lessonsCompleted) || 0,
          IsActive: formData.isActive !== undefined ? formData.isActive : true
        };
        console.log('📤 Sending group data:', groupData);
        console.log('📋 Form data:', formData);
        console.log('📋 Editing item:', editingItem);
        if (editingItem) {
          // עדכון אופטימי - תיקיה את השורה מיד בטבלה ללא המתנה לרענון מלא
          const instructorName = instructors.find(i =>
            i.instructorId === formData.instructorId ||
            i.id === formData.instructorId
          )?.instructorName || formData.instructorId || '-';

          const updatedGroupData = {
            ...editingItem,
            groupName: formData.groupName,
            dayOfWeek: formData.dayOfWeek,
            hour: formData.hour,
            ageRange: formData.ageRange,
            maxStudents: formData.maxStudents,
            sector: formData.sector,
            numOfLessons: formData.numOfLessons,
            lessonsCompleted: formData.lessonsCompleted,
            location: formData.location,
            instructorId: formData.instructorId,
            instructorName: instructorName,
            CourseId: formData.CourseId,
            BranchId: formData.BranchId,
            isActive: formData.isActive !== undefined ? formData.isActive : true
          };
          console.log('✅ [Optimistic] Updating groups state immediately:', updatedGroupData);
          updateGroupsStateOptimistic(updatedGroupData);
          result = await dispatch(updateGroup(groupData));
        } else {
          result = await dispatch(addGroup(groupData));
        }
        setOpenGroupDialog(false);
      }

      // הצג הודעה רק אם זה באמת בהצלחה
      if (result?.type?.endsWith('fulfilled')) {
        setNotification({
          open: true,
          message: `✅ ${editingItem ? 'עודכן' : 'נוסף'} בהצלחה`,
          severity: 'success'
        });
        resetFormData();

        // רענון חכם - טען רק את הנתונים שהשתנו
        if (editType === 'course') {
          dispatch(fetchCourses());
          // אם יש חוג נבחר, רענן גם את הקבוצות שלו
          if (selectedCourse) {
            const courseId = selectedCourse.courseId || selectedCourse.id || selectedCourse.CourseId;
            if (courseId) {
              dispatch(getGroupsByCourseId(courseId));
            }
          }
        } else if (editType === 'branch') {
          dispatch(fetchBranches());
          // אם יש סניף נבחר, רענן את הקבוצות שלו
          if (selectedBranch) {
            const branchId = selectedBranch.branchId || selectedBranch.id || selectedBranch.BranchId;
            if (branchId) {
              dispatch(getGroupsByBranch(branchId));
            }
          }
        } else if (editType === 'group') {
          // רענן רק את קבוצות הסניף הנוכחי (הרבה יותר מהיר מ-fetchGroups)
          if (selectedBranch) {
            const branchId = selectedBranch.branchId || selectedBranch.id || selectedBranch.BranchId;
            if (branchId) {
              console.log('🔄 Refreshing branch groups only (much faster)');
              dispatch(getGroupsByBranch(branchId));
            }
          } else {
            // אם לא בתצוגת סניף, רענן הכל
            console.log('🔄 Refreshing all groups');
            dispatch(fetchGroups());
          }
        }
      } else if (result?.type?.endsWith('rejected')) {
        setNotification({
          open: true,
          message: `❌ שגיאה: ${result.payload}`,
          severity: 'error'
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: `❌ שגיאה: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleDelete = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !deleteType) return;

    try {
      let result;

      if (deleteType === 'group') {
        const groupId = itemToDelete.id || itemToDelete.groupId;
        result = await dispatch(deleteGroup(groupId));
      } else if (deleteType === 'course') {
        const courseId = itemToDelete.id || itemToDelete.courseId;
        result = await dispatch(deleteCourse(courseId));
      } else if (deleteType === 'branch') {
        const branchId = itemToDelete.id || itemToDelete.branchId;
        result = await dispatch(deleteBranch(branchId));
      }

      // הצג הודעה רק אם זה באמת בהצלחה
      if (result?.type?.endsWith('fulfilled')) {
        setNotification({
          open: true,
          message: '✅ נמחק בהצלחה',
          severity: 'success'
        });

        // רענון חכם אחרי מחיקה - טען רק את הנתונים שהשתנו
        if (deleteType === 'course') {
          dispatch(fetchCourses());
          dispatch(fetchBranches()); // רענן גם סניפים כי הם תלויים בחוג
          dispatch(fetchGroups()); // רענן גם קבוצות
        } else if (deleteType === 'branch') {
          dispatch(fetchBranches());
          // אם יש חוג נבחר, רענן את הקבוצות שלו
          if (selectedCourse) {
            const courseId = selectedCourse.courseId || selectedCourse.id || selectedCourse.CourseId;
            if (courseId) {
              dispatch(getGroupsByCourseId(courseId));
            }
          }
        } else if (deleteType === 'group') {
          // רענון הקבוצות לפי ההקשר
          const branchId = selectedBranch?.branchId || selectedBranch?.id || selectedBranch?.BranchId;
          const courseId = selectedCourse?.courseId || selectedCourse?.id || selectedCourse?.CourseId;
          if (branchId) {
            dispatch(getGroupsByBranch(branchId));
          } else if (courseId) {
            dispatch(getGroupsByCourseId(courseId));
          } else {
            dispatch(fetchGroups());
          }
        }
      } else if (result?.type?.endsWith('rejected')) {
        setNotification({
          open: true,
          message: `❌ שגיאה: ${result.payload}`,
          severity: 'error'
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: `❌ שגיאה: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setOpenDeleteDialog(false);
      setItemToDelete(null);
      setDeleteType(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // ============ RENDER HEADER & STATS ============
  const renderHeaderAndStats = () => (
    <>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: '#1E3A8A',
            mb: 1,
            fontFamily: 'Heebo, sans-serif',
            textAlign: 'center',
          }}
        >
          ניהול חוגים קבוצות וסניפים
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
          יצירה עדכון ומעקב בקלות וביעילות
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, minmax(0, 1fr))', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
        gap: 1.25,
        mt: 3,
        mb: 3.4,
        maxWidth: { xs: '100%', md: 900 },
        mx: 'auto'
      }}>
        <StatsCard
          label="חוגים"
          value={courses.length}
          note="במערכת כולה"
          bg="linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)"
          icon={SchoolIcon}
          iconBg="rgba(59, 130, 246, 0.12)"
          numberAlign="right"
        />
        <StatsCard
          label="סניפים"
          value={branches.length}
          note="פריסה ארצית"
          bg="linear-gradient(135deg, #ecfdf3 0%, #dcfce7 100%)"
          icon={LocationIcon}
          iconBg="rgba(34, 197, 94, 0.12)"
          numberAlign="center"
        />
        <StatsCard
          label="קבוצות"
          value={groups.length}
          note="קבוצות פעילות"
          bg="linear-gradient(135deg, #ffe8f9c4 0%, #ffd5f234 100%)"
          icon={GroupIcon}
          iconBg="rgba(242, 58, 227, 0.12)"
          numberAlign="left"
        />
      </Box>
    </>
  );

  // ============ RENDER TABLE VIEW ============
  // Memoized table rows - להימנע מ-recalculation שלא הכרחי
  const flatRows = useMemo(() => {
    // השתמש ב-displayedGroups שמתעדכן מיד עם Optimistic Update; אם ריק, fallback ל-groups
    const groupsToDisplay = (displayedGroups && displayedGroups.length > 0) ? displayedGroups : groups;

    return groupsToDisplay.map((g, idx) => ({
      id: g.id || g.groupId || g.GroupId || idx,
      group: g,
      courseName: getCourseName(g.CourseId || g.courseId),
      branchName: getBranchName(g.branchId || g.BranchId),
      day: g.dayOfWeek || g.day || '-',
      groupName: g.groupName,
      instructor: g.instructorName || '-',
      hour: g.hour,
      ageRange: g.ageRange,
      maxStudents: g.maxStudents,
      lessons: `${g.lessonsCompleted || 0}/${g.numOfLessons || '-'}`,
      sector: g.sector,
      isActive: g.isActive !== undefined ? g.isActive : true,
    })).filter(row =>
      row.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.branchName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groups, displayedGroups, searchTerm, getCourseName, getBranchName]);

  const renderTableView = () => {
    const tableHeaders = [
      { label: 'שם החוג' },
      { label: 'סניף' },
      { label: 'יום' },
      { label: 'שם הקבוצה' },
      { label: 'מדריך' },
      { label: 'שעות' },
      { label: 'טווח גילאים' },
      { label: 'מקומות פנויים' },
      { label: 'שיעורים' },
      { label: 'מגזר' },
      { label: 'סטטוס' },
      { label: 'פעולות', align: 'center' }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setViewMode('cards')}
            sx={{
              borderRadius: 2,
              borderWidth: 2,
              borderColor: '#3B82F6',
              color: '#3B82F6',
              fontWeight: 'bold',
              '&:hover': {
                borderWidth: 2,
                borderColor: '#2563EB',
                bgcolor: 'rgba(59, 130, 246, 0.08)'
              }
            }}
          >
            תצוגת כרטיסים
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="🔍 חיפוש לפי שם חוג, סניף או קבוצה..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputProps={{
            style: {
              direction: 'rtl',
              textAlign: 'right',
              fontSize: '1rem',
              padding: '12px 14px'
            }
          }}
          InputProps={{
            startAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                <SearchIcon sx={{ color: '#3B82F6', fontSize: 24 }} />
              </Box>
            ),
            endAdornment: searchTerm && (
              <IconButton
                size="small"
                onClick={() => setSearchTerm('')}
                sx={{
                  ml: 1,
                  color: '#ef4444',
                  '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
                borderColor: '#3B82F6',
              }
            }
          }}
        />

        <StyledTableShell headers={tableHeaders}>
          <TableBody>
            {flatRows.map((row) => (
              <TableRow
                key={row.id || row.groupId || row.group?.GroupId || row.group?.id || row.group?.groupId}
                hover
                onDoubleClick={() => handleOpenGroupDetails(row.group)}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: 'rgba(219,234,254,0.35)' },
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    transform: 'scale(1.001)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    cursor: 'pointer'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <TableCell align="right" sx={{ py: 2, fontSize: '0.9rem' }}>{row.courseName}</TableCell>
                <TableCell align="right" sx={{ py: 2, fontSize: '0.9rem' }}>{row.branchName}</TableCell>
                <TableCell align="right" sx={{ py: 2, fontSize: '0.9rem', fontWeight: 500 }}>{row.day}</TableCell>
                <TableCell align="right" sx={{ py: 2, fontSize: '0.9rem', fontWeight: 600, color: '#1e40af' }}>
                  <Tooltip
                    title="👈 לחץ פעמיים כדי להציג את פרטי הקבוצה"
                    placement="top"
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: '#5f6368',
                          color: 'white',
                          borderRadius: 1,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          px: 1.5,
                          py: 0.75,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.18)'
                        }
                      },
                      arrow: {
                        sx: {
                          color: '#5f6368'
                        }
                      }
                    }}
                  >
                    <Box component="span" sx={{ display: 'inline-block', cursor: 'pointer' }}>
                      {row.groupName}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell align="right" sx={{ py: 2, fontSize: '0.9rem' }}>{row.instructor || '-'}</TableCell>
                <TableCell align="right" sx={{ py: 2, fontSize: '0.9rem' }}>{row.hour}</TableCell>
                <TableCell align="right" sx={{ py: 2, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{row.ageRange || '-'}</TableCell>
                <TableCell align="right" sx={{ py: 2, fontSize: '0.9rem' }}>{row.maxStudents || '-'}</TableCell>
                <TableCell align="right" sx={{ py: 2, fontSize: '0.9rem' }}>{row.lessons}</TableCell>
                <TableCell align="right" sx={{ py: 2, fontSize: '0.9rem' }}>{row.sector || '-'}</TableCell>
                <TableCell align="right" sx={{ py: 2, fontSize: '0.9rem' }}>
                  <Chip
                    label={row.isActive ? '✅ פעיל' : '⏸️ לא פעיל'}
                    size="small"
                    sx={{
                      bgcolor: row.isActive
                        ? 'rgba(34, 197, 94, 0.15)'
                        : 'rgba(107, 114, 128, 0.15)',
                      color: row.isActive ? '#16a34a' : '#6b7280',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      border: `1px solid ${row.isActive ? '#86efac' : '#d1d5db'}`
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75 }}>
                    <Tooltip title="פרטי קבוצה">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleOpenGroupDetails(row.group); }}
                        sx={{ color: '#60A5FA' }}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="ערוך">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleOpenGroupDialog(row.group); }}
                        sx={{ color: '#F6D365' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="מחק">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleDelete(row.group, 'group'); }}
                        sx={{ color: '#FF6B6B' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {flatRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  אין נתונים להצגה
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </StyledTableShell>
      </motion.div>
    );
  };

  // ============ RENDER CARD VIEW ============
  const renderCardView = () => {
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

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        dir="rtl"
      >
        {/* כפתורים למעבר בין תצוגות */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setViewMode('table')}
            sx={{
              borderRadius: 2,
              borderWidth: 2,
              borderColor: '#3B82F6',
              color: '#3B82F6',
              fontWeight: 'bold',
              '&:hover': {
                borderWidth: 2,
                borderColor: '#2563EB',
                bgcolor: 'rgba(59, 130, 246, 0.08)'
              }
            }}>
            תצוגת טבלה
          </Button>
        </Box>

        {/* כפתורי הוספה */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenCourseDialog()}
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
          {courses.map((course, index) => {
            // Direct calculations - לא useMemo כי אנחנו בתוך map
            const courseBranches = getBranchesForCourse(course.courseId || course.id);
            const totalGroups = courseBranches.reduce((acc, b) => acc + getGroupsForBranch(b.branchId || b.id).length, 0);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`course-${course.courseId || course.id || index}`}>
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={3}
                    component={motion.div}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedCourse(course);
                      setView('branches');
                    }}
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
                  >
                    <SchoolIcon sx={{ fontSize: 60, color: '#3B82F6', mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" textAlign="center" color="#1E3A8A">
                      {course.couresName}
                    </Typography>
                    <Divider sx={{ width: '80%', my: 2 }} />
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {course.description || 'חוג מקצועי לכל הגילאים'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Chip
                        label={`${courseBranches.length} סניפים`}
                        size="small"
                        sx={{ background: 'rgba(59,130,246,0.15)', color: '#1D4ED8', fontWeight: 'bold' }}
                      />
                      <Chip
                        label={`${totalGroups} קבוצות`}
                        color="primary"
                        size="small"
                      />
                    </Box>

                    {/* כפתורי עריכה ומחיקה */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, width: '100%', justifyContent: 'center' }}>
                      <Tooltip title="ערוך חוג">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenCourseDialog(course);
                          }}
                          sx={{
                            color: '#3B82F6',
                            bgcolor: 'rgba(59, 130, 246, 0.1)',
                            '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' }
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחק חוג">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(course, 'course');
                          }}
                          sx={{
                            color: '#ef4444',
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </motion.div>
    );
  };

  // ============ RENDER BRANCHES VIEW ============
  const renderBranchesView = () => {
    if (!selectedCourse) return null;

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

    const courseBranches = getBranchesForCourse(selectedCourse.courseId || selectedCourse.id);

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        dir="rtl"
      >
        {/* כפתור חזרה */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            endIcon={<ArrowBack style={{ transform: 'scaleX(-1)' }} />}
            onClick={() => {
              setView('courses');
              setSelectedCourse(null);
            }}
            variant="contained"
            sx={{
              direction: 'ltr',
              bgcolor: '#3B82F6',
              color: 'white',
              borderRadius: '12px',
              px: 3,
              py: 1,
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
              '&:hover': {
                bgcolor: '#2563eb',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            חזרה לחוגים
          </Button>
          <Typography variant="h5" fontWeight="bold" color="#1E3A8A">
            סניפי {selectedCourse.couresName}
          </Typography>
        </Box>

        {/* כפתור הוספת סניף */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenBranchDialog()}
            sx={{
              bgcolor: '#10B981',
              color: 'white',
              borderRadius: '10px',
              px: 2,
              py: 0.5,
              fontSize: '1rem',
              minWidth: 120,
              height: 36,
              '&:hover': {
                bgcolor: '#10B981',
                boxShadow: '0 4px 12px #1c956c',
              },
              transition: 'all 0.3s ease'
            }}
          >
            הוסף סניף חדש
          </Button>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {courseBranches.map((branch, index) => {
            const branchGroups = getGroupsForBranch(branch.branchId || branch.id);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`branch-${branch.branchId || branch.id || index}`}>
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={3}
                    component={motion.div}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setView('groups');
                    }}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, #d1fae500 0%, #feffff 100%)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <LocationIcon sx={{ fontSize: 60, color: '#10B981', mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" textAlign="center" color="#065F46">
                      {branch.name}
                    </Typography>
                    <Divider sx={{ width: '80%', my: 2 }} />
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {branch.address ? `${branch.address}, ${branch.city || ''}` : 'כתובת לא צוינה'}
                    </Typography>
                    <Chip
                      label={`מספר קבוצות: ${branchGroups.length} `}
                      size="small"
                      sx={{ mt: 2, background: 'rgba(16,185,129,0.15)', color: '#047857', fontWeight: 'bold' }}
                    />
                    <Chip
                      label={`תלמידים פעילים: ${branch.ActiveStudentsCount ?? branch.activeStudentsCount ?? 0}`}
                      size="small"
                      sx={{ mt: 1, background: 'rgba(37,99,235,0.12)', color: '#1d4ed8', fontWeight: 'bold' }}
                    />

                    {/* כפתורי עריכה ומחיקה */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, width: '100%', justifyContent: 'center' }}>
                      <Tooltip title="ערוך סניף">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBranchDialog(branch);
                          }}
                          sx={{
                            color: '#10B981',
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.2)' }
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחק סניף">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(branch, 'branch');
                          }}
                          sx={{
                            color: '#ef4444',
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </motion.div>
    );
  };

  // ============ RENDER GROUPS VIEW ============
  const renderGroupsView = () => {
    if (!selectedBranch) {
      return null;
    }

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

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        dir="rtl"
      >
        {/* כפתור חזרה */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            endIcon={<ArrowBack style={{ transform: 'scaleX(-1)' }} />}
            onClick={() => {
              setView('branches');
              setSelectedBranch(null);
            }}
            variant="contained"
            sx={{
              direction: 'ltr',
              bgcolor: '#3B82F6',
              color: 'white',
              borderRadius: '12px',
              px: 3,
              py: 1,
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
              '&:hover': {
                bgcolor: '#2563eb',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            חזרה לסניפים
          </Button>
          <Typography variant="h5" fontWeight="bold" color="#1E3A8A">
            קבוצות {selectedBranch.name}
          </Typography>
        </Box>

        {/* כפתור הוספת קבוצה */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenGroupDialog()}
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

        {/* כרטיסי קבוצות */}
        <Grid container spacing={3} justifyContent="center">
          {displayedGroups.map((group, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`group-${group.id || index}`}>
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
                      background: 'linear-gradient(135deg, #ff9af700 0%, #feffff 100%)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      direction: 'rtl',
                      textAlign: 'right',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    {/* שם קבוצה עם אייקון */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'flex-start' }}>
                      <GroupIcon sx={{ fontSize: 32, color: '#6366F1', ml: 1 }} />
                      <Typography variant="h6" fontWeight="bold" color="#1E3A8A" component="span">
                        <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                          {group.groupName}
                        </span>
                      </Typography>
                    </Box>
                    {/* סטטוס פעיל/לא פעיל - מתחת לשם הקבוצה */}
                    {!group.isActive && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Chip
                          label="⏸️ לא פעיל"
                          size="medium"
                          sx={{
                            bgcolor: 'rgba(107, 114, 128, 0.2)',
                            color: '#6b7280',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            border: '1.5px solid #9ca3af',
                            animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.6 }
                            }
                          }}
                        />
                      </Box>
                    )}
                    <Divider sx={{ width: '100%', mb: 2 }} />

                    {/* פרטי הקבוצה */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                      <DayIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                      <Typography variant="body2" component="span">
                        {(() => {
                          let day = group.dayOfWeek || group.day;
                          let hour = group.hour;

                          // If day/hour not available, try to parse from schedule
                          if (!day && group.schedule) {
                            const parts = group.schedule.split(' ');
                            day = parts[0];
                            hour = parts[1];
                          }

                          return `${day || '-'} · ${hour || '-'}`;
                        })()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                      <StudentIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                      <Typography variant="body2" component="span">
                        גילאים: {group.ageRange || '-'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                      <SectorIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                      <Typography variant="body2" component="span">
                        מגזר: {group.sector || 'כללי'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
                      <PersonIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
                      <Typography variant="body2" component="span">
                        מדריך: {group.instructorName || '-'}
                      </Typography>
                    </Box>

                    {/* מקומות פנויים - Chip */}
                    <Box sx={{ mt: 'auto', pt: 2, width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, direction: 'ltr' }}>
                        <Chip
                          icon={group.maxStudents > 0 ? <AvailableIcon /> : <FullIcon />}
                          label={`${group.maxStudents} מקומות פנויים`}
                          color={group.maxStudents > 0 ? "success" : "error"}
                          variant="outlined"
                          size="small"
                          sx={{
                            '& .MuiChip-icon': {
                              bgcolor: group.maxStudents > 0 ? '#22c55e' : '#ef4444',
                              color: 'white',
                              borderRadius: '50%',
                              padding: '4px',
                              width: '24px',
                              height: '24px'
                            }
                          }}
                        />
                      </Box>

                      {/* כפתורי עריכה ומחיקה */}
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="ערוך קבוצה">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenGroupDialog(group);
                            }}
                            sx={{
                              color: '#6366F1',
                              bgcolor: 'rgba(99, 102, 241, 0.1)',
                              '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' }
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="מחק קבוצה">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(group, 'group');
                            }}
                            sx={{
                              color: '#ef4444',
                              bgcolor: 'rgba(239, 68, 68, 0.1)',
                              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}              </Grid>
      </motion.div>
    );
  };

  // ============ DIALOGS ============
  const renderDialogs = () => (
    <>
      <CourseDialog
        open={openCourseDialog}
        values={formData}
        onChange={handleFormChange}
        onSubmit={handleSaveItem}
        onClose={() => setOpenCourseDialog(false)}
        onReset={resetFormData}
        isEdit={!!editingItem && editType === 'course'}
      />

      <BranchDialog
        open={openBranchDialog}
        values={formData}
        onChange={handleFormChange}
        onSubmit={handleSaveItem}
        onClose={() => setOpenBranchDialog(false)}
        onReset={resetFormData}
        isEdit={!!editingItem && editType === 'branch'}
      />

      <GroupDialog
        open={openGroupDialog}
        values={formData}
        onChange={handleFormChange}
        onSubmit={handleSaveItem}
        onClose={() => setOpenGroupDialog(false)}
        onReset={resetFormData}
        isEdit={!!editingItem && editType === 'group'}
        instructors={instructors}
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        deleteType={deleteType}
        item={itemToDelete}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, direction: 'rtl' } }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          פרטי הקבוצה
        </DialogTitle>
        <DialogContent sx={{ pt: 3, direction: 'rtl' }}>
          {selectedItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ background: 'rgba(99, 102, 241, 0.1)', p: 2, borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  שם קבוצה
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                  {selectedItem.groupName}
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ background: 'rgba(99, 102, 241, 0.1)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    מדריך
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'right' }}>
                    {selectedItem.instructorId || '-'}
                  </Typography>
                </Box>
                <Box sx={{ background: 'rgba(99, 102, 241, 0.1)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    יום
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'right' }}>
                    {selectedItem.dayOfWeek || selectedItem.day || '-'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ background: 'rgba(99, 102, 241, 0.1)', p: 2, borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  שעה
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {selectedItem.hour}
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ background: 'rgba(67, 233, 123, 0.1)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    טווח גילאים
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'right' }}>
                    {selectedItem.ageRange || '-'}
                  </Typography>
                </Box>
                <Box sx={{ background: 'rgba(67, 233, 123, 0.1)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    מגזר
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'right' }}>
                    {selectedItem.sector || '-'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box sx={{ background: 'rgba(246, 211, 101, 0.1)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    מקומות
                  </Typography>
                  <Chip
                    label={selectedItem.maxStudents || '-'}
                    size="small"
                    sx={{
                      background: Number(selectedItem.maxStudents) > 0
                        ? 'rgba(67, 233, 123, 0.8)'
                        : 'rgba(255, 107, 107, 0.8)',
                      color: 'white',
                      fontWeight: 'bold',
                      mt: 0.5
                    }}
                  />
                </Box>
                <Box sx={{ background: 'rgba(246, 211, 101, 0.1)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    שיעורים
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'right' }}>
                    {selectedItem.lessonsCompleted || 0}/{selectedItem.numOfLessons || '-'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDetailsDialog(false)}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: 'white' }}
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box sx={{
      background: 'linear-gradient(to right, #e0f2fe, #f8fafc)',
      minHeight: '100vh',
      py: 4
    }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, direction: 'rtl' }}>
        {renderHeaderAndStats()}

        {viewMode === 'table' ? (
          renderTableView()
        ) : (
          <>
            {view === 'courses' && renderCardView()}
            {view === 'branches' && renderBranchesView()}
            {view === 'groups' && renderGroupsView()}
          </>
        )}
        {renderDialogs()}

        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            icon={false}
            sx={{
              borderRadius: 2,
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              '& .MuiAlert-message': {
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                direction: 'rtl'
              }
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default GroupsTable;
