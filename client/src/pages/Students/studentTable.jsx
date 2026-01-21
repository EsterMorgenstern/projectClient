
import React, { useEffect, useState } from 'react';
import { checkUserPermission } from '../../utils/permissions';
import EditStudentDialog from './components/EditStudentDialog';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Box, Typography, MenuItem, TableRow,
  TableCell, TableBody, Chip, InputAdornment, Pagination, FormControl,
  InputLabel, Select, CircularProgress, Skeleton, Tooltip, Snackbar,
  Alert, IconButton
} from '@mui/material';
import {
  Add, Edit, Delete, Info as InfoIcon, Check as CheckIcon,
  Close as CloseIcon, School as CourseIcon, Search as SearchIcon,
  PersonAdd, Visibility, History as HistoryIcon,
  PeopleAltRounded, CheckCircleRounded, LocationCityRounded, SchoolRounded
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import StudentAttendanceHistory from './components/studentAttendanceHistory'
import { fetchStudents } from '../../store/student/studentGetAllThunk';
import { editStudent } from '../../store/student/studentEditThunk';
import { deleteStudent } from '../../store/student/studentDeleteThunk';
import { useNavigate } from 'react-router-dom';
import { PersonStandingIcon } from 'lucide-react';
import StudentCoursesDialog from './components/studentCoursesDialog';
import StyledTableShell from '../../components/StyledTableShell';
import StatsCard from '../../components/StatsCard';
import '../styles/tableStyles.css';

// קומפוננטת Loading Skeleton מתקדמת
const LoadingSkeleton = ({ headers }) => (
  <StyledTableShell headers={headers}>
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          {headers.map((_, cellIdx) => (
            <TableCell key={cellIdx}>
              <Skeleton
                variant="rectangular"
                width={cellIdx === 0 ? 200 : 100}
                height={24}
                sx={{ borderRadius: '8px' }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </StyledTableShell>
);


// קומפוננטת Empty State מתקדמת
const EmptyState = ({ searchTerm }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="empty-state"
  >
    <PersonAdd className="empty-state-icon" />
    <Typography className="empty-state-title">
      {searchTerm ? `לא נמצאו תוצאות עבור "${searchTerm}"` : 'אין תלמידים להצגה'}
    </Typography>
    <Typography className="empty-state-subtitle">
      {searchTerm ? 'נסה לחפש עם מילות מפתח אחרות' : 'הוסף תלמידים חדשים כדי להתחיל'}
    </Typography>
  </motion.div>
);

export default function StudentsTable() {
  const students = useSelector((state) => state.students.students);
  const studentCourses = useSelector((state) => state.groupStudents.groupStudentById);
  const loading = useSelector((state) => state.students.loading);
  const error = useSelector((state) => state.students.error);

  const tableHeaders = [
    { label: 'קוד תלמיד', align: 'center' },
    { label: 'מספר זיהוי', align: 'center' },
    { label: 'שם פרטי', align: 'center' },
    { label: 'שם משפחה', align: 'center' },
    { label: 'טלפון', align: 'center' },
    { label: 'טלפון נוסף', align: 'center' },
    { label: 'מייל', align: 'center' },
    { label: 'גיל', align: 'center' },
    { label: 'עיר', align: 'center' },
    { label: 'בית ספר', align: 'center' },
    { label: 'קופת חולים', align: 'center' },
    { label: 'כיתה', align: 'center' },
    { label: 'מגזר', align: 'center' },
    { label: 'סטטוס', align: 'center' },
    { label: 'פעולות', align: 'center' }
  ];

  // קבלת המשתמש הנוכחי
  const currentUser = useSelector(state => {
    return state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null;
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [editStudentDialogOpen, setEditStudentDialogOpen] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: null, firstName: '', lastName: '', phone: null, secondaryPhone: '', age: 0, city: '',
    school: '', class: "", sector: "", status: 'פעיל', identityCard: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success', action: null });
  // Notification Snackbar close handler
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedStudents, setPaginatedStudents] = useState([]);

  const [coursesDialogOpen, setCoursesDialogOpen] = useState(false);
  const [selectedStudentForCourses, setSelectedStudentForCourses] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const healthFundOptions = [
    { value: 'מכבי', label: '🏥 מכבי', icon: '🏥' },
    { value: 'מאוחדת', label: '🏥 מאוחדת', icon: '🏥' },
    { value: 'לאומית', label: '🏥 לאומית', icon: '🏥' },
    { value: 'כללית', label: '🏥 כללית', icon: '🏥' },
    { value: 'הסדר אחר', label: '🏥 הסדר אחר', icon: '🏥' }
  ];

  const ageOptions = [
    { value: 5, label: '🎂 בן 5', icon: '🎂' },
    { value: 6, label: '🎂 בן 6', icon: '🎂' },
    { value: 7, label: '🎂 בן 7', icon: '🎂' },
    { value: 8, label: '🎂 בן 8', icon: '🎂' },
    { value: 9, label: '🎂 בן 9', icon: '🎂' },
    { value: 10, label: '🎂 בן 10', icon: '🎂' },
    { value: 11, label: '🎂 בן 11', icon: '🎂' },
    { value: 12, label: '🎂 בן 12', icon: '🎂' },
    { value: 13, label: '🎂 בן 13', icon: '🎂' }
  ];

  const classOptions = [
    { value: 'מכינה', label: '👶 מכינה', icon: '👶' },
    { value: 'כיתה א׳', label: '📚 כיתה א׳', icon: '📚' },
    { value: 'כיתה ב׳', label: '📖 כיתה ב׳', icon: '📖' },
    { value: 'כיתה ג׳', label: '📝 כיתה ג׳', icon: '📝' },
    { value: 'כיתה ד׳', label: '📋 כיתה ד׳', icon: '📋' },
    { value: 'כיתה ה׳', label: '📊 כיתה ה׳', icon: '📊' },
    { value: 'כיתה ו׳', label: '📈 כיתה ו׳', icon: '📈' },
    { value: 'כיתה ז׳', label: '🎓 כיתה ז׳', icon: '🎓' }
  ];

  const sectorOptions = [
    { value: 'כללי', label: '🌍 כללי', icon: '🌍' },
    { value: 'חסידי', label: '🌍 חסידי', icon: '🌍' },
    { value: 'גור', label: '🌍 גור', icon: '🌍' },
    { value: 'ליטאי', label: '🌍 ליטאי', icon: '🌍' }
  ];

  const statusOptions = [
    { value: 'פעיל', label: '✅ פעיל', icon: '✅' },
    { value: 'ליד', label: '🤝 ליד', icon: '🤝' },
    { value: 'לא רלוונטי', label: '❌ לא רלוונטי', icon: '❌' }
  ];

  // פונקציה לחיפוש חכם
  const smartSearch = (students, searchTerm) => {
    // בדיקת בטיחות
    if (!Array.isArray(students)) return [];
    if (!searchTerm?.trim()) return students;

    const term = searchTerm.toLowerCase().trim();
    return students.filter(student => {
      if (!student) return false;
      const firstNameMatch = student.firstName?.toLowerCase().includes(term);
      const lastNameMatch = student.lastName?.toLowerCase().includes(term);
      const fullNameMatch = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase().includes(term);
      const idMatch = student.id?.toString().includes(term);
      const identityCardMatch = student.identityCard?.toString().includes(term);
      const phoneMatch = student.phone?.toString().includes(term);
      const secondaryPhoneMatch = student.secondaryPhone?.toString().includes(term);
      const cityMatch = student.city?.toLowerCase().includes(term);
      const statusMatch = student.status?.toLowerCase().includes(term);
      return firstNameMatch || lastNameMatch || fullNameMatch || idMatch || identityCardMatch || phoneMatch || secondaryPhoneMatch || cityMatch || statusMatch;
    });
  };

  // טעינת נתונים ראשונית
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // עדכון הרשימה המסוננת
  useEffect(() => {
    // בדיקת בטיחות שהסטודנטים הם מערך
    const studentsArray = Array.isArray(students) ? students : [];
    const filtered = smartSearch(studentsArray, searchTerm);
    setFilteredStudents(Array.isArray(filtered) ? filtered : []);
    setCurrentPage(1); // איפוס לעמוד הראשון בחיפוש חדש
  }, [students, searchTerm]);

  // עדכון pagination
  useEffect(() => {
    // בדיקת בטיחות שהסטודנטים המסוננים הם מערך
    const filteredArray = Array.isArray(filteredStudents) ? filteredStudents : [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filteredArray.slice(startIndex, endIndex);
    setPaginatedStudents(paginated);
    setTotalPages(Math.ceil(filteredArray.length / pageSize));
  }, [filteredStudents, currentPage, pageSize]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const refreshTable = async () => {
    await dispatch(fetchStudents());
  };

  const handleEdit = async () => {
    if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
    if (await dispatch(editStudent(currentStudent))) {
      setOpenEdit(false);
      refreshTable();
    }
  };

  const handleDelete = async (id) => {
    if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setNotification({ open: true, message: msg, severity }))) return;
    if (await dispatch(deleteStudent(id))) {
      refreshTable();
    }
  };

  const handleViewCourses = async (student) => {
    setSelectedStudentForCourses(student);
    setCoursesDialogOpen(true);
    await dispatch(getgroupStudentByStudentId(student.id));
  };

  const totalStudents = Array.isArray(students) ? students.length : 0;
  const activeStudents = Array.isArray(students)
    ? students.filter((s) => (s?.status || '').trim() === 'פעיל').length
    : 0;
  const uniqueClasses = Array.isArray(students)
    ? new Set(students.map((s) => s?.class).filter(Boolean)).size
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="table-container"
    >
      <div style={{ direction: 'rtl' }}>
        {/* כותרת הטבלה */}
        <motion.div
          className="table-header fade-in-up"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography className="table-title">
            ניהול תלמידים
          </Typography>
          <Typography className="table-subtitle">
            נהל את כל התלמידים במערכת בקלות ויעילות
          </Typography>
        </motion.div>


        {/* קלפי סטטיסטיקה עדינים */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Box
            sx={{
              mt: 3,
              mb: 2.7,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, minmax(0, 1fr))', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 1.25,
              maxWidth: { xs: '100%', md: 900 },
              mx: 'auto'
            }}
          >
            <StatsCard
              label="סה&quot;כ תלמידים"
              value={totalStudents}
              note="במערכת כולה"
              bg="linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)"
              icon={PeopleAltRounded}
              iconBg="rgba(59, 130, 246, 0.12)"
              numberAlign="center"
            />
            <StatsCard
              label="תלמידים פעילים"
              value={activeStudents}
              note="סטטוס פעיל"
              bg="linear-gradient(135deg, #ecfdf3 0%, #dcfce7 100%)"
              icon={CheckCircleRounded}
              iconBg="rgba(34, 197, 94, 0.12)"
              numberAlign="center"
            />
            <StatsCard
              label="כיתות פעילות"
              value={uniqueClasses}
              note="התפלגות כיתות"
              bg="linear-gradient(135deg, #ffe8f9c4 0%, #ffd5f256 100%)"
              icon={SchoolRounded}
              iconBg="rgba(242, 58, 227, 0.12)"
              numberAlign="center"
            />
          </Box>
        </motion.div>

<br/>
        {/* שדה חיפוש */}
        <motion.div
          className="search-container slide-in-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="🔍 חפש תלמיד לפי שם, ת״ז, טלפון או עיר..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </motion.div>



        {/* בקרות עמוד */}
        <motion.div
          className="pagination-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography className="results-info">
              📊 מציג {paginatedStudents.length} מתוך {filteredStudents.length} תלמידים
              {searchTerm && ` (מסונן מתוך ${students.length} סה"כ)`}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" className="page-size-selector">
                <InputLabel >תוצאות בעמוד</InputLabel>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  label="תוצאות בעמוד"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </motion.div>

        {/* טבלה */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton headers={tableHeaders} />
            </motion.div>
          ) : paginatedStudents.length > 0 ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <StyledTableShell headers={tableHeaders} enableHorizontalScroll={true}>
                <TableBody>
                  <AnimatePresence>
                    {paginatedStudents
                      .filter(row => row?.id != null && row?.id !== '')
                      .map((student, index) => (
                        <motion.tr
                          key={student.id}
                          component={TableRow}
                          className="table-row"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                            type: "spring",
                            stiffness: 100
                          }}
                          whileHover={{ scale: 1.001 }}
                        >
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.id}</TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.identityCard || <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>}</TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.firstName}</TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.lastName}</TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.phone}</TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>
                            {student.secondaryPhone && student.secondaryPhone.trim() ? (
                              <Tooltip title={`טלפון נוסף: ${student.secondaryPhone}`}>
                                <Box
                                  component="span"
                                  sx={{
                                    color: 'inherit'
                                  }}
                                >
                                  {student.secondaryPhone || <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>}
                                </Box>
                              </Tooltip>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                                אין טלפון נוסף
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>
                            {student.email && student.email.trim() ? (
                              <Tooltip title={`שלח מייל ל-${student.email}`}>
                                <Box
                                  component="span"
                                  sx={{
                                    cursor: 'pointer',
                                    color: '#1976d2',
                                    textDecoration: 'underline',
                                    '&:hover': { color: '#1565c0' }
                                  }}
                                  onClick={() => window.open(`mailto:${student.email}`, '_self')}
                                >
                                  {student.email || <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>}
                                </Box>
                              </Tooltip>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                                אין מייל
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.age || <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>}</TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.city || <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>}</TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.school || <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>}</TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>
                            {student.healthFundName || student.healthFundPlan ? (
                              <Typography variant="body2" sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                <span style={{ fontWeight: 600 }}>
                                  {student.healthFundName || '—'}
                                </span>
                                {student.healthFundPlan && (
                                  <span style={{ color: '#64748b', marginRight: '6px' }}>
                                    {' • '}{student.healthFundPlan}
                                  </span>
                                )}
                              </Typography>
                            ) : (
                              <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>
                            )}
                          </TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.class || <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>}</TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.sector || <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>}</TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>
                            <Chip
                              label={student.status || 'פעיל'}
                              size="small"
                              sx={{
                                backgroundColor:
                                  student.status === 'פעיל' ? 'rgba(16, 185, 129, 0.15)' :
                                    student.status === 'ליד' ? 'rgba(245, 158, 11, 0.15)' :
                                      student.status === 'לא רלוונטי' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                                color:
                                  student.status === 'פעיל' ? '#10b981' :
                                    student.status === 'ליד' ? '#f59e0b' :
                                      student.status === 'לא רלוונטי' ? '#ef4444' : '#6b7280',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                border:
                                  student.status === 'פעיל' ? '1px solid rgba(16, 185, 129, 0.3)' :
                                    student.status === 'ליד' ? '1px solid rgba(245, 158, 11, 0.3)' :
                                      student.status === 'לא רלוונטי' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)'
                              }}
                            />
                          </TableCell>
                          <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5, minWidth: '180px' }}>
                            <Box className="action-buttons" sx={{
                              display: 'flex',
                              gap: 0.3,
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: '30px'
                            }}>
                              <Tooltip title="פרטים">
                                <IconButton
                                  size="small"
                                  className="action-button info"
                                  onClick={() => handleViewCourses(student)}
                                  sx={{
                                    color: '#60A5FA',
                                    '&:hover': {
                                      color: '#3B82F6',
                                      backgroundColor: 'rgba(96, 165, 250, 0.08)'
                                    }
                                  }}
                                >
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="ערוך">
                                <IconButton
                                  size="small"
                                  className="action-button edit"
                                  onClick={() => {
                                    setSelectedStudentForEdit(student);
                                    setEditStudentDialogOpen(true);
                                  }}
                                  sx={{
                                    color: '#F6D365',
                                    '&:hover': {
                                      color: '#FCD34D',
                                      backgroundColor: 'rgba(246, 211, 101, 0.08)'
                                    }
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="מחק">
                                <IconButton
                                  size="small"
                                  className="action-button delete"
                                  onClick={() => {
                                    setCurrentStudent({
                                      id: student.id,
                                      firstName: student.firstName,
                                      lastName: student.lastName,
                                      phone: student.phone,
                                      secondaryPhone: student.secondaryPhone,
                                      age: student.age,
                                      city: student.city,
                                      school: student.school,
                                      class: student.class,
                                      sector: student.sector,
                                      status: student.status || 'פעיל'
                                    });
                                    setDeleteOpen(true);
                                  }}
                                  sx={{
                                    color: '#FF6B6B',
                                    '&:hover': {
                                      color: '#EF4444',
                                      backgroundColor: 'rgba(255, 107, 107, 0.08)'
                                    }
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </motion.tr>
                      ))}
                  </AnimatePresence>
                </TableBody>
              </StyledTableShell>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <EmptyState searchTerm={searchTerm} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="advanced-pagination"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1rem',
                    fontWeight: 600,
                  }
                }}
              />
            </Box>
          </motion.div>
        )}


        {/* דיאלוג חוגים */}
        <StudentCoursesDialog
          open={coursesDialogOpen}
          onClose={() => setCoursesDialogOpen(false)}
          student={selectedStudentForCourses}
          studentCourses={studentCourses}
          showAddButton={true}
        />

        {/* דיאלוג עריכה */}
        <Dialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          maxWidth="sm"
          fullWidth
          className="advanced-dialog"
        >
          <DialogTitle className="dialog-title">
            ✏️ ערוך תלמיד
          </DialogTitle>
          <DialogContent className="dialog-content">
            <TextField
              fullWidth
              label="🆔 תעודת זהות"
              value={currentStudent.id || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, id: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👤 שם פרטי"
              value={currentStudent.firstName}
              onChange={(e) => setCurrentStudent({ ...currentStudent, firstName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👥 שם משפחה"
              value={currentStudent.lastName}
              onChange={(e) => setCurrentStudent({ ...currentStudent, lastName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📞 טלפון"
              value={currentStudent.phone || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📱 טלפון נוסף"
              value={currentStudent.secondaryPhone || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, secondaryPhone: e.target.value })}
              className="dialog-field"
              placeholder="טלפון נוסף (אופציונלי)"
            />
            <TextField
              fullWidth
              label="📧 מייל"
              type="email"
              value={currentStudent.email || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
              className="dialog-field"
              placeholder="example@email.com"
            />
            <TextField
              fullWidth
              select
              label="🎂 גיל"
              value={currentStudent.age}
              onChange={(e) => setCurrentStudent({ ...currentStudent, age: parseInt(e.target.value) })}
              className="dialog-field"
            >
              {ageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="🏙️ עיר"
              value={currentStudent.city}
              onChange={(e) => setCurrentStudent({ ...currentStudent, city: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🏫 בית ספר"
              value={currentStudent.school}
              onChange={(e) => setCurrentStudent({ ...currentStudent, school: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              select
              label="📚 כיתה"
              value={currentStudent.class}
              onChange={(e) => setCurrentStudent({ ...currentStudent, class: e.target.value })}
              className="dialog-field"
            >
              {classOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="🌍 מגזר"
              value={currentStudent.sector}
              onChange={(e) => setCurrentStudent({ ...currentStudent, sector: e.target.value })}
              className="dialog-field"
            >
              {sectorOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="📊 סטטוס"
              value={currentStudent.status || 'פעיל'}
              onChange={(e) => setCurrentStudent({ ...currentStudent, status: e.target.value })}
              className="dialog-field"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => setOpenEdit(false)} className="dialog-button secondary">
              ❌ ביטול
            </Button>
            <Button onClick={handleEdit} className="dialog-button primary">
              💾 שמור שינויים
            </Button>
          </DialogActions>
        </Dialog>

        {/* דיאלוג מחיקה */}
        <Dialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
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
            <Delete />
            אישור מחיקה
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2, textAlign: 'center', mt: 1 }}>
            <Typography variant="h6" gutterBottom>
              האם אתה בטוח שברצונך למחוק את התלמיד?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {currentStudent.firstName} {currentStudent.lastName}
            </Typography>
            <Typography variant="body2" color="error.main" sx={{ mt: 2, fontWeight: 'bold' }}>
              פעולה זו לא ניתנת לביטול!
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'ltr' }}>
            <Button
              onClick={() => setDeleteOpen(false)}
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                borderWidth: '2px'
              }}
            >
              ביטול
            </Button>
            <Button
              onClick={() => {
                handleDelete(currentStudent.id);
                setDeleteOpen(false);
              }}
              variant="contained"
              color="error"
              startIcon={<Delete />}
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                bgcolor: '#ef4444',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
              }}
            >
              מחק
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
          onStudentUpdated={(updatedStudent) => {
            // Close dialog immediately
            setEditStudentDialogOpen(false);
            setSelectedStudentForEdit(null);
            // Refresh the students list only if update was successful
            try {
              dispatch(fetchStudents());
              setNotification({
                open: true,
                message: 'פרטי התלמיד עודכנו בהצלחה',
                severity: 'success'
              });
            } catch (error) {
              console.error('Error refreshing students:', error);
              setNotification({
                open: true,
                message: 'שגיאה בטעינת הנתונים לאחר העדכון',
                severity: 'error'
              });
            }
          }}
        />

      </div>

      {/* Notification Snackbar - updated design */}
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
          xs={2}
          sx={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            direction: 'ltr',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
          action={notification.action}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}

