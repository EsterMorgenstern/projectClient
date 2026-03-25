import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  ContentCopy,
  Delete,
  Edit,
  Save,
  Close,
  Add,
  ExitToApp,
  Group,
  Person,
  School,
  Payments,
  Notes
} from '@mui/icons-material';
import { getStudentById } from '../../../store/student/studentGetByIdThunk';
import { editStudent } from '../../../store/student/studentEditThunk';
import { getgroupStudentByStudentId } from '../../../store/groupStudent/groupStudentGetByStudentIdThunk';
import { deleteGroupStudent } from '../../../store/groupStudent/groupStudentDeleteThunk';
import { getAttendanceByStudent } from '../../../store/attendance/attendanceGetByStudent';
import { deleteAttendance } from '../../../store/attendance/attendanceDeleteThunk';
import { fetchPaymentHistory } from '../../../store/payments/fetchPaymentHistory';
import { fetchPaymentMethods } from '../../../store/payments/fetchPaymentMethods';
import { getNotesByStudentId } from '../../../store/studentNotes/studentNotesGetById';
import { addStudentNote } from '../../../store/studentNotes/studentNoteAddThunk';
import { updateStudentNote } from '../../../store/studentNotes/studentNoteUpdateThunk';
import { deleteStudentNote } from '../../../store/studentNotes/studentNoteDeleteThunk';
import { fetchHealthFunds } from '../../../store/healthFund/fetchHealthFunds';
import StudentAttendanceHistory from './studentAttendanceHistory';
import AddStudentNoteDialog from './addStudentNoteDialog';
import PaymentsTab from '../../Payments/PaymentsTab';
import PaymentHistoryTab from '../../Payments/PaymentHistoryTab';

const isFutureDate = (rawDate) => {
  if (!rawDate) {
    return false;
  }
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date >= startToday;
};

const endIconButtonSx = {
  gap: 0.75,
  '& .MuiButton-endIcon': {
    margin: 0
  }
};

const normalizeDate = (value) => {
  if (!value) {
    return '---';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleDateString('he-IL');
};

const getAttendanceId = (record) => record?.attendanceId ?? record?.AttendanceId ?? record?.id ?? record?.Id;

const getAttendanceDate = (record) =>
  record?.dateReport ??
  record?.DateReport ??
  record?.lessonDate ??
  record?.LessonDate ??
  record?.date ??
  record?.Date;

const courseField = (entity, keys) => {
  for (const key of keys) {
    if (entity?.[key] !== undefined && entity?.[key] !== null && entity?.[key] !== '') {
      return entity[key];
    }
  }
  return null;
};

const isAttendanceRelatedToCourse = (attendance, course) => {
  const attendanceGroupStudentId = courseField(attendance, ['groupStudentId', 'GroupStudentId']);
  const attendanceGroupId = courseField(attendance, ['groupId', 'GroupId']);
  const attendanceCourseId = courseField(attendance, ['courseId', 'CourseId']);
  const attendanceCourseName = courseField(attendance, ['courseName', 'CourseName']);

  const courseGroupStudentId = courseField(course, ['groupStudentId']);
  const courseGroupId = courseField(course, ['groupId', 'GroupId']);
  const courseCourseId = courseField(course, ['courseId', 'CourseId']);
  const courseCourseName = courseField(course, ['courseName', 'course', 'groupName']);

  if (attendanceGroupStudentId && courseGroupStudentId) {
    return String(attendanceGroupStudentId) === String(courseGroupStudentId);
  }
  if (attendanceGroupId && courseGroupId) {
    return String(attendanceGroupId) === String(courseGroupId);
  }
  if (attendanceCourseId && courseCourseId) {
    return String(attendanceCourseId) === String(courseCourseId);
  }
  if (attendanceCourseName && courseCourseName) {
    return String(attendanceCourseName).trim() === String(courseCourseName).trim();
  }

  return false;
};

const pick = (obj, keys, fallback = '') => {
  if (!obj) {
    return fallback;
  }

  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return fallback;
};

const unpackStudentPayload = (payload) => {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload)) {
    return payload[0] || null;
  }

  if (Array.isArray(payload.result)) {
    return payload.result[0] || null;
  }

  if (payload.result && typeof payload.result === 'object') {
    return payload.result;
  }

  return payload;
};

const normalizeStudent = (apiStudent, fallbackStudent, routeStudentId) => {
  const source = apiStudent || fallbackStudent || {};
  const resolvedId = pick(source, ['id', 'studentId', 'Id', 'StudentId'], routeStudentId);
  const resolvedHealthFundId =
    source?.healthFundId ??
    source?.HealthFundId ??
    source?.healthFund?.healthFundId ??
    source?.HealthFund?.healthFundId ??
    null;

  return {
    id: resolvedId,
    identityCard: pick(source, ['identityCard', 'IdentityCard']),
    firstName: pick(source, ['firstName', 'FirstName']),
    lastName: pick(source, ['lastName', 'LastName']),
    phone: pick(source, ['phone', 'Phone', 'phoneNumber']),
    secondaryPhone: pick(source, ['secondaryPhone', 'SecondaryPhone']),
    email: pick(source, ['email', 'Email']),
    age: pick(source, ['age', 'Age']),
    city: pick(source, ['city', 'City']),
    school: pick(source, ['school', 'School']),
    class: pick(source, ['class', 'Class']),
    sector: pick(source, ['sector', 'Sector']),
    status: pick(source, ['status', 'Status'], 'פעיל'),
    createdBy: pick(source, ['createdBy', 'CreatedBy']),
    lastActivityDate: pick(source, ['lastActivityDate', 'LastActivityDate']),
    healthFundId: resolvedHealthFundId,
    healthFundName: pick(source, ['healthFundName', 'HealthFundName']),
    healthFundPlan: pick(source, ['healthFundPlan', 'HealthFundPlan'])
  };
};

const toIdString = (value) => (value === undefined || value === null ? '' : String(value));

const SectionTitle = ({ icon, title }) => (
  <Typography
    variant="h6"
    sx={{
      fontWeight: 'bold',
      mb: 2,
      color: '#1976d2',
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}
  >
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        bgcolor: '#1976d2',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.12)'
      }}
    >
      {icon}
    </Box>
    {title}
  </Typography>
);

const StudentDetailsPanel = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const routeStudent = location.state?.student || null;

  const studentPayload = useSelector((state) => state.students.studentById);
  const studentsLoading = useSelector((state) => state.students.loading);
  const studentsError = useSelector((state) => state.students.error);
  const courses = useSelector((state) => state.groupStudents.groupStudentById || []);
  const attendanceByStudent = useSelector((state) => state.attendances.attendanceByStudent || []);
  const studentNotes = useSelector((state) => state.studentNotes.studentNotes || []);
  const healthFundItems = useSelector((state) => state.healthFunds?.items || []);

  const [currentTab, setCurrentTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteTypeFilter, setNoteTypeFilter] = useState('הכל');
  const [copiedIdentityHint, setCopiedIdentityHint] = useState(false);
  const [confirmDeleteNote, setConfirmDeleteNote] = useState({ open: false, noteId: null });
  const [confirmExitCourse, setConfirmExitCourse] = useState({ open: false, course: null });

  const routeStudentId = useMemo(() => toIdString(studentId), [studentId]);
  const apiStudentRaw = useMemo(() => unpackStudentPayload(studentPayload), [studentPayload]);
  const apiStudent = useMemo(
    () => normalizeStudent(apiStudentRaw, null, routeStudentId),
    [apiStudentRaw, routeStudentId]
  );
  const routeStudentNormalized = useMemo(
    () => normalizeStudent(routeStudent, null, routeStudentId),
    [routeStudent, routeStudentId]
  );

  const isApiStudentForCurrentRoute = useMemo(
    () => toIdString(apiStudent?.id) === routeStudentId,
    [apiStudent?.id, routeStudentId]
  );

  const isRouteStateStudentForCurrentRoute = useMemo(
    () => toIdString(routeStudentNormalized?.id) === routeStudentId,
    [routeStudentNormalized?.id, routeStudentId]
  );

  const student = useMemo(() => {
    if (isApiStudentForCurrentRoute) {
      return apiStudent;
    }

    if (isRouteStateStudentForCurrentRoute) {
      return routeStudentNormalized;
    }

    return normalizeStudent(null, null, routeStudentId);
  }, [
    isApiStudentForCurrentRoute,
    isRouteStateStudentForCurrentRoute,
    apiStudent,
    routeStudentNormalized,
    routeStudentId
  ]);

  const effectiveStudentId = routeStudentId || null;

  const normalizedCourses = useMemo(
    () => (Array.isArray(courses) ? courses : []).map((course, index) => ({
      key: pick(course, ['groupStudentId', 'GroupStudentId'], `course-${index}`),
      groupStudentId: pick(course, ['groupStudentId', 'GroupStudentId']),
      groupId: pick(course, ['groupId', 'GroupId']),
      courseName: pick(course, ['courseName', 'CourseName']),
      groupName: pick(course, ['groupName', 'GroupName']),
      branchName: pick(course, ['branchName', 'BranchName']),
      instructorName: pick(course, ['instructorName', 'InstructorName']),
      dayOfWeek: pick(course, ['dayOfWeek', 'DayOfWeek']),
      hour: pick(course, ['hour', 'Hour']),
      enrollmentDate: pick(course, ['enrollmentDate', 'EnrollmentDate']),
      isActive: pick(course, ['isActive', 'IsActive'], false) === true
    })),
    [courses]
  );

  const studentFullName = useMemo(() => {
    const first = student?.firstName || '';
    const last = student?.lastName || '';
    return `${first} ${last}`.trim() || 'תלמיד';
  }, [student]);

  const activeCoursesCount = normalizedCourses.filter((item) => item.isActive).length;
  const attendanceLessonsCount = attendanceByStudent.length;

  const refreshAll = async () => {
    if (!effectiveStudentId) {
      return;
    }

    await Promise.all([
      dispatch(getStudentById(effectiveStudentId)),
      dispatch(getgroupStudentByStudentId(effectiveStudentId)),
      dispatch(getAttendanceByStudent(effectiveStudentId)),
      dispatch(fetchPaymentHistory(effectiveStudentId)),
      dispatch(fetchPaymentMethods(effectiveStudentId)),
      dispatch(getNotesByStudentId(effectiveStudentId)),
      dispatch(fetchHealthFunds())
    ]);
  };

  useEffect(() => {
    if (effectiveStudentId) {
      refreshAll();
    }
  }, [dispatch, effectiveStudentId]);

  useEffect(() => {
    setIsEditing(false);
    setNoteDialogOpen(false);
    setEditingNote(null);
    setNoteTypeFilter('הכל');
    setErrorMessage('');
  }, [routeStudentId]);

  useEffect(() => {
    if (student && typeof student === 'object') {
      const selectedHealthFund = (Array.isArray(healthFundItems) ? healthFundItems : []).find(
        (fund) => String(fund?.healthFundId) === String(student?.healthFundId)
      );

      const resolvedHealthFundName =
        student.healthFundName ||
        student.HealthFundName ||
        student.healthFund?.name ||
        student.HealthFund?.name ||
        selectedHealthFund?.name ||
        '';

      const resolvedHealthFundPlan =
        student.healthFundPlan ||
        student.HealthFundPlan ||
        student.healthFund?.fundType ||
        student.HealthFund?.fundType ||
        selectedHealthFund?.fundType ||
        '';

      setFormData({
        id: student.id,
        identityCard: student.identityCard || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        phone: student.phone || '',
        secondaryPhone: student.secondaryPhone || '',
        email: student.email || '',
        age: student.age || '',
        city: student.city || '',
        school: student.school || '',
        class: student.class || '',
        sector: student.sector || '',
        status: student.status || 'פעיל',
        createdBy: student.createdBy || '',
        lastActivityDate: student.lastActivityDate || null,
        healthFundId: student.healthFundId ?? null,
        healthFundName: resolvedHealthFundName,
        healthFundPlan: resolvedHealthFundPlan
      });
    }
  }, [student, healthFundItems]);

  const handleSaveStudent = async () => {
    if (!formData) {
      return;
    }
    setIsSaving(true);
    setErrorMessage('');

    const payload = {
      studentId: Number(formData.id),
      id: Number(formData.id),
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      phone: String(formData.phone || ''),
      secondaryPhone: formData.secondaryPhone || '',
      email: formData.email || '',
      age: Number(formData.age) || 0,
      city: formData.city || '',
      school: formData.school || '',
      class: formData.class || '',
      sector: formData.sector || '',
      status: formData.status || 'פעיל',
      createdBy: formData.createdBy || '',
      healthFundId: Number(formData.healthFundId) || null,
      IdentityCard: formData.identityCard || '',
      identityCard: formData.identityCard || ''
    };

    const result = await dispatch(editStudent(payload));
    setIsSaving(false);

    if (editStudent.fulfilled.match(result)) {
      setIsEditing(false);
      dispatch(getStudentById(effectiveStudentId));
      return;
    }

    setErrorMessage('שמירת פרטי תלמיד נכשלה. נסה שוב.');
  };

  const handleExitCourse = (course) => {
    setConfirmExitCourse({ open: true, course });
  };

  const handleExitCourseConfirmed = async () => {
    const course = confirmExitCourse.course;
    setConfirmExitCourse({ open: false, course: null });

    setOperationLoading(true);
    setErrorMessage('');

    try {
      const futureRelatedAttendances = attendanceByStudent.filter((record) => {
        const recordDate = getAttendanceDate(record);
        return isFutureDate(recordDate) && isAttendanceRelatedToCourse(record, course);
      });

      const deleteOperations = futureRelatedAttendances
        .map((record) => getAttendanceId(record))
        .filter(Boolean)
        .map((attendanceId) => dispatch(deleteAttendance(attendanceId)));

      await Promise.all(deleteOperations);
      if (course.groupStudentId) {
        await dispatch(deleteGroupStudent(course.groupStudentId));
      }
      await Promise.all([
        dispatch(getgroupStudentByStudentId(effectiveStudentId)),
        dispatch(getAttendanceByStudent(effectiveStudentId))
      ]);
    } catch (error) {
      setErrorMessage('אירעה שגיאה ביציאה מהקורס.');
    } finally {
      setOperationLoading(false);
    }
  };

  const openAddNoteDialog = () => {
    setEditingNote(null);
    setNoteDialogOpen(true);
  };

  const openEditNoteDialog = (note) => {
    setEditingNote(note);
    setNoteDialogOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    if (!noteData) {
      return;
    }

    setOperationLoading(true);
    setErrorMessage('');

    try {
      let result;

      if (editingNote?.noteId) {
        result = await dispatch(updateStudentNote({
          ...noteData,
          noteId: editingNote.noteId
        }));
      } else {
        result = await dispatch(addStudentNote(noteData));
      }

      if (result?.meta?.requestStatus !== 'fulfilled') {
        throw new Error('save_failed');
      }

      setEditingNote(null);
      setNoteDialogOpen(false);
      await dispatch(getNotesByStudentId(effectiveStudentId));
    } catch (error) {
      setErrorMessage('שמירת ההערה נכשלה.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteNote = (noteId) => {
    setConfirmDeleteNote({ open: true, noteId });
  };

  const handleDeleteNoteConfirmed = async () => {
    const noteId = confirmDeleteNote.noteId;
    setConfirmDeleteNote({ open: false, noteId: null });

    setOperationLoading(true);
    setErrorMessage('');

    try {
      await dispatch(deleteStudentNote(noteId));
      await dispatch(getNotesByStudentId(effectiveStudentId));
    } catch (error) {
      setErrorMessage('מחיקת ההערה נכשלה.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleCopyStudentIdentity = async () => {
    const identityToCopy = student?.identityCard || student?.id || studentId;
    if (!identityToCopy) {
      return;
    }

    try {
      await navigator.clipboard.writeText(String(identityToCopy));
      setCopiedIdentityHint(true);
      setTimeout(() => setCopiedIdentityHint(false), 1800);
    } catch {
      setErrorMessage('לא הצלחנו להעתיק תעודת זהות.');
    }
  };

  const cardStyle = {
    mb: 3,
    boxShadow: 2,
    borderRadius: 2
  };

  const stats = [
    { label: 'חוגים רשומים', value: normalizedCourses.length, icon: School, bg: '#e8f5e9', color: '#4caf50' },
    { label: 'חוגים פעילים', value: activeCoursesCount, icon: Group, bg: '#fff3e0', color: '#ff9800' },
    { label: 'רשומות נוכחות', value: attendanceLessonsCount, icon: CalendarToday, bg: '#ede7f6', color: '#673ab7' },
    { label: 'הערות', value: studentNotes.length, icon: Notes, bg: '#f3e5f5', color: '#9c27b0' }
  ];

  const noteTypeTabs = ['הכל', 'כללי', 'חיובי', 'אזהרה', 'שלילי', 'הערת גביה', 'מעקב רישום'];

  const noteTypeStyles = {
    הכל: { border: '#64748b', text: '#334155', bg: '#f8fafc' },
    כללי: { border: '#3b82f6', text: '#1d4ed8', bg: '#eff6ff' },
    חיובי: { border: '#16a34a', text: '#166534', bg: '#f0fdf4' },
    אזהרה: { border: '#d97706', text: '#92400e', bg: '#fff7ed' },
    שלילי: { border: '#dc2626', text: '#991b1b', bg: '#fef2f2' },
    'הערת גביה': { border: '#14b8a6', text: '#0f766e', bg: '#f0fdfa' },
    'מעקב רישום': { border: '#8b5cf6', text: '#6d28d9', bg: '#f5f3ff' }
  };

  const getNoteTypeStyle = (type) => noteTypeStyles[type] || noteTypeStyles.כללי;

  const filteredStudentNotes = useMemo(() => {
    if (noteTypeFilter === 'הכל') {
      return studentNotes;
    }

    return studentNotes.filter((note) => (note?.noteType || 'כללי') === noteTypeFilter);
  }, [studentNotes, noteTypeFilter]);

  const getNoteTypeCount = (type) => {
    if (type === 'הכל') {
      return studentNotes.length;
    }

    return studentNotes.filter((note) => (note?.noteType || 'כללי') === type).length;
  };

  const renderPersonalInfo = () => {
    if (!formData) {
      return null;
    }

    return (
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle icon={<Person fontSize="small" />} title="פרטים אישיים" />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!isEditing && (
                <Button variant="contained" sx={{ bgcolor: '#1976d2', ...endIconButtonSx }} endIcon={<Edit />} onClick={() => setIsEditing(true)}>
                  עריכה
                </Button>
              )}
              {isEditing && (
                <>
                  <Button
                    variant="contained"
                    endIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <Save />}
                    onClick={handleSaveStudent}
                    disabled={isSaving}
                    sx={{
                      ...endIconButtonSx,
                      bgcolor: '#16a34a',
                      '&:hover': { bgcolor: '#15803d' },
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(22,163,74,0.4)'
                    }}
                  >
                    שמירה
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    endIcon={<Close />}
                    onClick={() => {
                      setIsEditing(false);
                      dispatch(getStudentById(effectiveStudentId));
                    }}
                    sx={endIconButtonSx}
                  >
                    ביטול
                  </Button>
                </>
              )}
            </Box>
          </Box>

          <Grid container spacing={2}>
            {[
              { key: 'id', label: 'תעודת זהות' },
              { key: 'identityCard', label: 'מספר זיהוי' },
              { key: 'firstName', label: 'שם פרטי' },
              { key: 'lastName', label: 'שם משפחה' },
              { key: 'phone', label: 'טלפון' },
              { key: 'secondaryPhone', label: 'טלפון נוסף' },
              { key: 'email', label: 'מייל' },
              { key: 'age', label: 'גיל' },
              { key: 'city', label: 'עיר' },
              { key: 'school', label: 'בית ספר' },
              { key: 'class', label: 'כיתה' },
              { key: 'sector', label: 'מגזר' },
              { key: 'status', label: 'סטטוס' },
              { key: 'healthFundName', label: 'קופת חולים' },
              { key: 'healthFundPlan', label: 'מסלול קופה' }
            ].map((field) => (
              <Grid item xs={12} sm={6} md={4} key={field.key}>
                <TextField
                  fullWidth
                  size="small"
                  label={field.label}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8fbff',
                      boxShadow: '0 1px 6px rgba(15, 23, 42, 0.06)',
                      transition: 'all 0.2s ease',
                      '& fieldset': {
                        borderColor: '#bfdbfe'
                      },
                      '&:hover fieldset': {
                        borderColor: '#60a5fa'
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#ffffff',
                        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.12)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      color: '#475569'
                    }
                  }}
                  value={formData[field.key] ?? ''}
                  disabled={!isEditing || field.key === 'id' || field.key === 'healthFundName' || field.key === 'healthFundPlan'}
                  onChange={(event) => setFormData((prev) => ({ ...prev, [field.key]: event.target.value }))}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderCourses = () => (
    <Card sx={cardStyle}>
      <CardContent sx={{ p: 3 }}>
        <SectionTitle icon={<School fontSize="small" />} title="קורסים" />
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 55%, #ecfeff 100%)',
            border: '1px solid #bfdbfe',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}
            >
              ✨
            </Box>
            <Typography
              sx={{
                color: '#334155',
                fontWeight: 500,
                fontSize: '0.98rem',
                lineHeight: 0.8,
                letterSpacing: 0
              }}
            >
              טיפ מהיר לשיבוץ: העתיקו את ת.ז של התלמיד ועברו מיד להרשמה.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {copiedIdentityHint && (
              <Chip
                size="small"
                color="success"
                label="✓ הועתק! אפשר להדביק בשיבוץ"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  bgcolor: '#16a34a',
                  color: 'white',
                  border: '2px solid #15803d',
                  boxShadow: '0 2px 8px rgba(22,163,74,0.35)',
                  px: 0.5
                }}
              />
            )}
            <Button
              variant="contained"
              size="small"
              endIcon={<ContentCopy fontSize="small" />}
              onClick={handleCopyStudentIdentity}
              sx={{
                ...endIconButtonSx,
                bgcolor: '#2563eb',
                color: 'white',
                borderRadius: 999,
                fontWeight: 700,
                px: 1.5,
                '&:hover': {
                  bgcolor: '#1d4ed8'
                }
              }}
            >
              העתק ת.ז
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="contained"
            endIcon={<Add />}
            onClick={() => navigate('/enroll-student', { state: { studentId: Number(effectiveStudentId), student } })}
            sx={{ bgcolor: '#1976d2', ...endIconButtonSx }}
          >
            רישום לקורס נוסף
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 2,
            borderColor: '#e2e8f0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
            overflow: 'hidden'
          }}
        >
          <Table
            size="small"
            sx={{
              '& .MuiTableCell-root': {
                borderBottomColor: '#e8edf3',
                fontFamily: 'Heebo, Assistant, Arial, sans-serif'
              }
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>חוג</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>קבוצה</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>סניף</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>מדריך</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>יום ושעה</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>תאריך הרשמה</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>סטטוס</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {normalizedCourses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3, color: '#6b7280', fontWeight: 500 }}>
                    אין קורסים לתלמיד
                  </TableCell>
                </TableRow>
              )}
              {normalizedCourses.map((course, index) => (
                <TableRow
                  key={course.key}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfdff',
                    '&:hover': {
                      backgroundColor: '#f5f8fc'
                    }
                  }}
                >
                  <TableCell align="right" sx={{ color: '#334155', fontWeight: 500 }}>{course.courseName || '---'}</TableCell>
                  <TableCell align="right" sx={{ color: '#334155', fontWeight: 500 }}>{course.groupName || '---'}</TableCell>
                  <TableCell align="right" sx={{ color: '#334155', fontWeight: 500 }}>{course.branchName || '---'}</TableCell>
                  <TableCell align="right" sx={{ color: '#475569', fontWeight: 500 }}>{course.instructorName || '---'}</TableCell>
                  <TableCell align="right" sx={{ color: '#475569', fontWeight: 500 }}>{[course.dayOfWeek, course.hour].filter(Boolean).join(' • ') || '---'}</TableCell>
                  <TableCell align="right" sx={{ color: '#64748b', fontWeight: 500 }}>{normalizeDate(course.enrollmentDate)}</TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={course.isActive ? 'פעיל' : 'לא פעיל'}
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.78rem',
                        borderRadius: 999,
                        height: 26,
                        bgcolor: course.isActive ? '#f0fdf4' : '#f8fafc',
                        color: course.isActive ? '#166534' : '#475569',
                        border: `1px solid ${course.isActive ? '#86efac' : '#d1d5db'}`,
                        '& .MuiChip-label': {
                          px: 1.1,
                          py: 0
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      endIcon={<ExitToApp />}
                      onClick={() => handleExitCourse(course)}
                      disabled={operationLoading}
                      sx={{
                        ...endIconButtonSx,
                        borderRadius: 999,
                        px: 1.4,
                        py: 0.35,
                        fontSize: '0.78rem',
                        backgroundColor: '#fff1f2',
                        color: '#b91c1c',
                        border: '1px solid #fecdd3',
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#ffe4e6',
                          borderColor: '#fda4af',
                          boxShadow: 'none'
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#f8fafc',
                          color: '#94a3b8',
                          border: '1px solid #e2e8f0'
                        }
                      }}
                    >
                      יציאה מהקורס
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderAttendance = () => (
    <Card sx={cardStyle}>
      <CardContent sx={{ p: 3 }}>
        <SectionTitle icon={<CalendarToday fontSize="small" />} title="מעקב נוכחות" />
        <StudentAttendanceHistory
          student={student}
          embedded={true}
          open={true}
          onClose={() => {}}
        />
      </CardContent>
    </Card>
  );

  const renderPaymentHistory = () => (
    <Card sx={cardStyle}>
      <CardContent sx={{ p: 3 }}>
        <SectionTitle icon={<Payments fontSize="small" />} title="היסטוריית תשלומים" />
        <PaymentHistoryTab student={student} embedded={true} />
      </CardContent>
    </Card>
  );

  const renderPaymentMethods = () => (
    <Card sx={cardStyle}>
      <CardContent sx={{ p: 3 }}>
        <SectionTitle icon={<Payments fontSize="small" />} title="אמצעי תשלום" />
        <PaymentsTab student={student} embedded={true} />
      </CardContent>
    </Card>
  );

  const renderNotes = () => (
    <Card sx={cardStyle}>
      <CardContent sx={{ p: 3 }}>
        <SectionTitle icon={<Notes fontSize="small" />} title="הערות תלמיד" />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap'
            }}
          >
            <Typography sx={{ color: '#475569', fontWeight: 700 }}>סוגי הערות:</Typography>
            {noteTypeTabs.map((type) => {
              const isActive = noteTypeFilter === type;
              const style = getNoteTypeStyle(type);
              return (
                <Button
                  key={type}
                  onClick={() => setNoteTypeFilter(type)}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 999,
                    px: 1.2,
                    py: 0.2,
                    fontSize: '0.78rem',
                    lineHeight: 1.2,
                    minWidth: 'fit-content',
                    minHeight: 28,
                    borderWidth: isActive ? 2 : 1,
                    borderColor: style.border,
                    color: style.text,
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? style.bg : 'transparent',
                    '&:hover': {
                      borderColor: style.border,
                      backgroundColor: style.bg
                    }
                  }}
                >
                  {`${type} (${getNoteTypeCount(type)})`}
                </Button>
              );
            })}
          </Box>
          <Button variant="contained" endIcon={<Add />} onClick={openAddNoteDialog} sx={{ bgcolor: '#1976d2', ...endIconButtonSx }}>
            הוסף הערה
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 2,
            borderColor: '#e2e8f0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
            overflow: 'hidden'
          }}
        >
          <Table
            size="small"
            sx={{
              '& .MuiTableCell-root': {
                borderBottomColor: '#e8edf3',
                fontFamily: 'Heebo, Assistant, Arial, sans-serif'
              }
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>סוג</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>תוכן</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>תאריך</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>נכתב על ידי</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudentNotes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#6b7280', fontWeight: 500 }}>
                    אין הערות להצגה עבור הסוג שנבחר
                  </TableCell>
                </TableRow>
              )}
              {filteredStudentNotes.map((note, index) => (
                (() => {
                  const currentType = note?.noteType || 'כללי';
                  const style = getNoteTypeStyle(currentType);
                  return (
                <TableRow
                  key={note.noteId}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfdff',
                    borderRight: `3px solid ${style.border}`,
                    '&:hover': {
                      backgroundColor: '#f5f8fc'
                    }
                  }}
                >
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={currentType}
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.78rem',
                        bgcolor: style.bg,
                        color: style.text,
                        border: `1px solid ${style.border}`,
                        borderRadius: 999,
                        height: 26,
                        '& .MuiChip-label': {
                          px: 1.1,
                          py: 0
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#1f2937', maxWidth: 420 }}>
                    <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 400 }}>
                      {note.noteContent || note.noteText || '---'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {normalizeDate(note.createdDate || note.createdAt || note.updateDate)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#475569', fontWeight: 500 }}>
                    {note.authorName || note.authorRole || '---'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openEditNoteDialog(note)}
                      sx={{
                        mr: 0.75,
                        width: 34,
                        height: 34,
                        color: '#2563eb',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: 999,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#dbeafe',
                          borderColor: '#93c5fd',
                          color: '#1d4ed8'
                        }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={() => handleDeleteNote(note.noteId)}
                      sx={{
                        width: 34,
                        height: 34,
                        color: '#b91c1c',
                        backgroundColor: '#fff1f2',
                        border: '1px solid #fecdd3',
                        borderRadius: 999,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#ffe4e6',
                          borderColor: '#fda4af',
                          color: '#9f1239'
                        }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                  );
                })()
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const hasCurrentStudentData = isApiStudentForCurrentRoute || isRouteStateStudentForCurrentRoute;

  if (studentsLoading && !hasCurrentStudentData) {
    return (
      <Box sx={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (studentsError && !hasCurrentStudentData) {
    return <Alert severity="error">שגיאה בטעינת התלמיד</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', px: 2, direction: 'rtl', py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/students')} sx={{ color: '#075985', fontWeight: 700 }}>
          חזרה לרשימת תלמידים
        </Button>
        <Button variant="outlined" onClick={refreshAll} disabled={operationLoading || studentsLoading} sx={{ borderColor: '#1976d2', color: '#1976d2', borderWidth: 2 }}>
          רענון נתונים
        </Button>
      </Box>

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
        <Avatar sx={{ width: 62, height: 62, bgcolor: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.35)' }}>
          <Person sx={{ fontSize: 36 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{studentFullName}</Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.92 }}>
            תעודת זהות: {student?.id || '---'}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Grid item xs={6} sm={4} md={3} key={item.label}>
              <Box
                sx={{
                  background: item.bg,
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow: 1,
                  minHeight: 148,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Icon
                  sx={{
                    color: item.color,
                    fontSize: 34,
                    mb: 0.5,
                    display: 'block',
                    mx: 'auto',
                    alignSelf: 'center'
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', color: '#334155' }}>
                  {item.label}
                </Typography>
                <Typography variant="h4" sx={{ color: item.color, fontWeight: 'bold', lineHeight: 1.1 }}>
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      <Tabs
        value={currentTab}
        onChange={(_, value) => setCurrentTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          bgcolor: 'white',
          borderRadius: 2,
          px: 1,
          border: '1px solid #dbe5f0',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            minHeight: 54
          },
          '& .MuiTabs-indicator': {
            height: 4,
            borderRadius: 999,
            backgroundColor: '#1976d2'
          }
        }}
      >
        <Tab label="פרטים אישיים" />
        <Tab label="קורסים" />
        <Tab label="הערות" />
        <Tab label={`נוכחות (${attendanceLessonsCount})`} />
        <Tab label="אמצעי תשלום" />
        <Tab label="תשלומים" />
      </Tabs>

      <Box>
        {currentTab === 0 && renderPersonalInfo()}
        {currentTab === 1 && renderCourses()}
        {currentTab === 2 && renderNotes()}
        {currentTab === 3 && renderAttendance()}
        {currentTab === 4 && renderPaymentMethods()}
        {currentTab === 5 && renderPaymentHistory()}
      </Box>

      <AddStudentNoteDialog
        open={noteDialogOpen}
        onClose={() => {
          setNoteDialogOpen(false);
          setEditingNote(null);
        }}
        student={student}
        onSave={handleSaveNote}
        editMode={Boolean(editingNote)}
        noteData={editingNote}
        studentNotes={studentNotes}
      />

      {/* Confirm delete note dialog */}
      <Dialog
        open={confirmDeleteNote.open}
        onClose={() => setConfirmDeleteNote({ open: false, noteId: null })}
        dir="rtl"
        PaperProps={{ sx: { borderRadius: 3, minWidth: 340 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#dc2626', pb: 1 }}>מחיקת הערה</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#374151' }}>
            האם אתה בטוח שברצונך למחוק את ההערה? פעולה זו אינה ניתנת לביטול.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmDeleteNote({ open: false, noteId: null })}
            variant="outlined"
            sx={{ borderRadius: 99, px: 3 }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleDeleteNoteConfirmed}
            variant="contained"
            color="error"
            sx={{ borderRadius: 99, px: 3 }}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm exit course dialog */}
      <Dialog
        open={confirmExitCourse.open}
        onClose={() => setConfirmExitCourse({ open: false, course: null })}
        dir="rtl"
        PaperProps={{ sx: { borderRadius: 3, minWidth: 380 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#b45309', pb: 1 }}>יציאה מחוג</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#374151' }}>
            האם להסיר את התלמיד מהקורס{' '}
            <strong>
              {confirmExitCourse.course?.groupName ||
                confirmExitCourse.course?.courseName ||
                `קורס ${confirmExitCourse.course?.groupId || ''}`}
            </strong>{' '}
            ולמחוק נוכחויות עתידיות?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmExitCourse({ open: false, course: null })}
            variant="outlined"
            sx={{ borderRadius: 99, px: 3 }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleExitCourseConfirmed}
            variant="contained"
            sx={{ borderRadius: 99, px: 3, backgroundColor: '#b45309', '&:hover': { backgroundColor: '#92400e' } }}
          >
            הסר מהחוג
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentDetailsPanel;
