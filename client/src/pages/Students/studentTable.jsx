
import React, { useEffect, useState } from 'react';
import EditStudentDialog from './components/EditStudentDialog';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Box, Typography, MenuItem, TableContainer, Paper, TableHead, TableRow,
  TableCell, TableBody, Chip, InputAdornment, Pagination, FormControl,
  InputLabel, Select, CircularProgress, Skeleton, Table, Tooltip, Snackbar,
  Alert
} from '@mui/material';
import {
  Add, Edit, Delete, Info as InfoIcon, Check as CheckIcon,
  Close as CloseIcon, School as CourseIcon, Search as SearchIcon,
  PersonAdd, Visibility, History as HistoryIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import StudentAttendanceHistory from './components/studentAttendanceHistory'
import { fetchStudents } from '../../store/student/studentGetAllThunk';
import { addStudent } from '../../store/student/studentAddThunk';
import { addStudentNote } from '../../store/studentNotes/studentNoteAddThunk';
import { getgroupStudentByStudentId } from '../../store/groupStudent/groupStudentGetByStudentIdThunk';
import { deleteStudent } from '../../store/student/studentDeleteThunk';
import { editStudent } from '../../store/student/studentEditThunk';
import TermsDialog from '../Enrollment/components/termDialog';
import { useNavigate } from 'react-router-dom';
import '../styles/tableStyles.css';
import { PersonStandingIcon } from 'lucide-react';
import StudentCoursesDialog from './components/studentCoursesDialog';

// קומפוננטת Loading Skeleton מתקדמת
const LoadingSkeleton = () => (
  <TableContainer component={Paper} className="advanced-table loading-skeleton">
    <Table>
      <TableHead className="table-head">
        <TableRow>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🎯</span>
              <span style={{ fontSize: '0.9em' }}>פעולות</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🆔</span>
              <span style={{ fontSize: '0.9em' }}>קוד תלמיד</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>👤</span>
              <span style={{ fontSize: '0.9em' }}>שם פרטי</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>👥</span>
              <span style={{ fontSize: '0.9em' }}>שם משפחה</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>📞</span>
              <span style={{ fontSize: '0.9em' }}>טלפון</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>📱</span>
              <span style={{ fontSize: '0.9em' }}>טלפון נוסף</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>📧</span>
              <span style={{ fontSize: '0.9em' }}>מייל</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🎂</span>
              <span style={{ fontSize: '0.9em' }}>גיל</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🏙️</span>
              <span style={{ fontSize: '0.9em' }}>עיר</span>
            </div>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index} className="skeleton-row">
            <TableCell><Skeleton variant="rectangular" width={200} height={30} sx={{ borderRadius: '8px' }} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
            <TableCell><Skeleton variant="text" width={120} /></TableCell>
            <TableCell><Skeleton variant="text" width={90} /></TableCell>
            <TableCell><Skeleton variant="text" width={150} /></TableCell>
            <TableCell><Skeleton variant="text" width={60} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="text" width={60} /></TableCell>
            <TableCell><Skeleton variant="text" width={60} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
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
  
  // קבלת המשתמש הנוכחי
  const currentUser = useSelector(state => {
    return state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null;
  });

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editStudentDialogOpen, setEditStudentDialogOpen] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openCoursesDialog, setOpenCoursesDialog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: null, firstName: '', lastName: '', phone: null, secondaryPhone: '', age: 0, city: '',
    school: '', healthFund: '', class: "", sector: "", status: 'פעיל'
  });
  const [newStudent, setnewStudent] = useState({
    id: null, firstName: '', lastName: '', phone: null, secondaryPhone: '', email: '', age: 0,
    city: '', school: '', healthFund: '', class: "", sector: "", status: 'פעיל'
  });
  const [termsOpen, setTermsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

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
    { value: 'כללית', label: '🏥 כללית', icon: '🏥' }
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
    { value: 'ליד', label: '🟡 ליד', icon: '🟡' },
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
      const phoneMatch = student.phone?.toString().includes(term);
      const secondaryPhoneMatch = student.secondaryPhone?.toString().includes(term);
      const cityMatch = student.city?.toLowerCase().includes(term);
      return firstNameMatch || lastNameMatch || fullNameMatch || idMatch || phoneMatch || secondaryPhoneMatch || cityMatch;
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

  // פונקציה ליצירת הערה אוטומטית לתלמיד חדש
  const createAutomaticRegistrationNote = async (studentId) => {
    try {
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
        noteContent: `נרשם בפעם הראשונה למערכת בתאריך ${currentDate} באמצעות "ניהול תלמידים"`,
        noteType: 'כללי',
        priority: 'בינוני',
        isPrivate: false,
        authorName: userDetails.fullName,
        authorRole: userDetails.role
      };

      console.log('📝 Creating automatic registration note for student table:', noteData);
      
      const result = await dispatch(addStudentNote(noteData));
      
      if (addStudentNote.fulfilled.match(result)) {
        console.log('✅ Automatic registration note created successfully in student table');
      } else {
        console.warn('⚠️ Failed to create automatic registration note in student table:', result.payload);
      }
    } catch (error) {
      console.error('❌ Error creating automatic registration note in student table:', error);
      // לא נציג שגיאה למשתמש כי זו פונקציה רקעית
    }
  };

  const handleAdd = async () => {
    const addResult = await dispatch(addStudent(newStudent));
    if (addResult.type === 'students/addStudent/fulfilled') {
      // יצירת הערה אוטומטית לתלמיד החדש
      await createAutomaticRegistrationNote(newStudent.id);
      
      refreshTable();
      setnewStudent({
        id: null, firstName: '', lastName: '', phone: null, secondaryPhone: '', email: '', age: 0,
        city: '', school: '', healthFund: '', class: "", sector: "", status: 'פעיל'
      });
    }
    setOpen(false);
  };

  const handleEdit = async () => {
    if (await dispatch(editStudent(currentStudent))) {
      setOpenEdit(false);
      refreshTable();
    }
  };

  const handleDelete = async (id) => {
    if (await dispatch(deleteStudent(id))) {
      refreshTable();
    }
  };

  const handleViewCourses = async (student) => {
    setSelectedStudentForCourses(student);
    setCoursesDialogOpen(true);
    await dispatch(getgroupStudentByStudentId(student.id));
  };

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

 {/* כפתור הוספת תלמיד חדש מעל הטבלה */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Button
            onClick={() => setTermsOpen(true)}
            variant="contained"
            startIcon={<PersonAdd />}
            size="large"
            className="main-add-button glow-effect"
            fullWidth
          >
            ➕ הוסף תלמיד חדש
          </Button>
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
              <LoadingSkeleton />
            </motion.div>
          ) : paginatedStudents.length > 0 ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <TableContainer component={Paper} className="advanced-table custom-scrollbar">
                <Table>
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell className="table-head-cell" style={{ width: 180, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🎯</span>
                          <span style={{ fontSize: '0.9em' }}>פעולות</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 110, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🆔</span>
                          <span style={{ fontSize: '0.9em' }}>קוד תלמיד</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 130, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>👤</span>
                          <span style={{ fontSize: '0.9em' }}>שם פרטי</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 110, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>👥</span>
                          <span style={{ fontSize: '0.9em' }}>שם משפחה</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 70, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>📞</span>
                          <span style={{ fontSize: '0.9em' }}>טלפון</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 80, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span className="emoji-support" style={{ fontSize: '1.1em', marginBottom: '2px' }}>📱</span>
                          <span style={{ fontSize: '0.9em' }}>טלפון נוסף</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 120, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span className="emoji-support" style={{ fontSize: '1.1em', marginBottom: '2px' }}>📧</span>
                          <span style={{ fontSize: '0.9em' }}>מייל</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 60, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🎂</span>
                          <span style={{ fontSize: '0.9em' }}>גיל</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 100, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🏙️</span>
                          <span style={{ fontSize: '0.9em' }}>עיר</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 150, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🏫</span>
                          <span style={{ fontSize: '0.9em' }}>בית ספר</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 160, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🏥</span>
                          <span style={{ fontSize: '0.9em' }}>קופת חולים</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 80, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>📚</span>
                          <span style={{ fontSize: '0.9em' }}>כיתה</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 100, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🌍</span>
                          <span style={{ fontSize: '0.9em' }}>מגזר</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 120, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>📊</span>
                          <span style={{ fontSize: '0.9em' }}>סטטוס</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
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
                           <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}> {/* ✅ הקטנתי padding */}
  <Box className="action-buttons" sx={{ 
    display: 'flex', 
    gap: 0.3, // ✅ הקטנתי gap
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '30px' // ✅ הקטנתי גובה מינימלי
  }}>
    <Button
      variant="contained"
      startIcon={<Edit />}
      size="small"
      className="action-button edit"
      onClick={() => {
        setSelectedStudentForEdit(student);
        setEditStudentDialogOpen(true);
      }}
      sx={{
        minWidth: '55px', // ✅ הקטנתי רוחב
        height: '22px', // ✅ הקטנתי גובה
        fontSize: '0.65rem', // ✅ הקטנתי טקסט
        px: 0.5, // ✅ הקטנתי padding
        py: 0.2,
        '& .MuiButton-startIcon': {
          marginLeft: 0.3,
          marginRight: 0,
        }
      }}
    >
      ערוך
    </Button>
    <Button
      variant="contained"
      startIcon={<Delete />}
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
          healthFund: student.healthFund,
          class: student.class,
          sector: student.sector,
          status: student.status || 'פעיל'
        });
        setDeleteOpen(true);
      }}
      sx={{
        minWidth: '55px',
        height: '22px',
        fontSize: '0.65rem',
        px: 0.5,
        py: 0.2,
        '& .MuiButton-startIcon': {
          marginLeft: 0.3,
          marginRight: 0,
        }
      }}
    >
      מחק
    </Button>
    <Button
      variant="contained"
      startIcon={<InfoIcon />}
      size="small"
      className="action-button info"
      onClick={() => handleViewCourses(student)}
      sx={{
        minWidth: '60px',
        height: '22px',
        fontSize: '0.55rem',
        px: 0.5,
        py: 0.2,
        '& .MuiButton-startIcon': {
          marginLeft: 0.3,
          marginRight: 0,
        }
      }}
    >
      פרטים
    </Button>
  </Box>
</TableCell>

<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.id}</TableCell>
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
        {student.secondaryPhone}
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
        {student.email}
      </Box>
    </Tooltip>
  ) : (
    <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
      אין מייל
    </Typography>
  )}
</TableCell>
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.age}</TableCell>
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.city}</TableCell>
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.school}</TableCell>
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.healthFund}</TableCell>
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.class}</TableCell>
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.sector}</TableCell>
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>
  <Chip
    label={student.status || 'פעיל'}
    size="small"
    sx={{
      backgroundColor: 
        student.status === 'פעיל' ? '#10b981' :
        student.status === 'ליד' ? '#f59e0b' :
        student.status === 'לא רלוונטי' ? '#ef4444' : '#6b7280',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.75rem'
    }}
  />
</TableCell>
                          </motion.tr>
                        ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </TableContainer>
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

        {/* דיאלוג תנאים */}
        <TermsDialog
          open={termsOpen}
          onClose={() => setTermsOpen(false)}
          onAccept={() => {
            setTermsOpen(false);
            setnewStudent({
              id: null, firstName: '', lastName: '', phone: null, secondaryPhone: '', age: 0,
              city: '', school: '', healthFund: '', class: "", sector: ""
            });
            setOpen(true);
          }}
        />

        {/* דיאלוג הוספת תלמיד */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          className="advanced-dialog"
        >
          <DialogTitle className="dialog-title">
            ➕ הוסף תלמיד חדש
          </DialogTitle>
          <DialogContent className="dialog-content">
            <TextField
              fullWidth
              label={<span><span role="img" aria-label="person">👤</span> נרשם ע"י</span>}
              value={newStudent.createdBy || ''}
              onChange={(e) => setnewStudent({ ...newStudent, createdBy: e.target.value })}
              className="dialog-field"
              placeholder="שם משתמש או מלל חופשי"
              helperText="ניתן לשנות את שם היוצר או להכניס מלל חופשי"
            />
            <TextField
              fullWidth
              label="🆔 תעודת זהות"
              value={newStudent.id || ''}
              onChange={(e) => setnewStudent({ ...newStudent, id: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👤 שם פרטי"
              value={newStudent.firstName}
              onChange={(e) => setnewStudent({ ...newStudent, firstName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👥 שם משפחה"
              value={newStudent.lastName}
              onChange={(e) => setnewStudent({ ...newStudent, lastName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📞 טלפון"
              value={newStudent.phone || ''}
              onChange={(e) => setnewStudent({ ...newStudent, phone: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📱 טלפון נוסף"
              value={newStudent.secondaryPhone || ''}
              onChange={(e) => setnewStudent({ ...newStudent, secondaryPhone: e.target.value })}
              className="dialog-field"
              placeholder="טלפון נוסף (אופציונלי)"
            />
            <TextField
              fullWidth
              label="📧 מייל"
              type="email"
              value={newStudent.email || ''}
              onChange={(e) => setnewStudent({ ...newStudent, email: e.target.value })}
              className="dialog-field"
              placeholder="example@email.com"
            />
            <TextField
              fullWidth
              select
              label="🎂 גיל"
              value={newStudent.age}
              onChange={(e) => setnewStudent({ ...newStudent, age: parseInt(e.target.value) })}
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
              value={newStudent.city}
              onChange={(e) => setnewStudent({ ...newStudent, city: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🏫 בית ספר"
              value={newStudent.school}
              onChange={(e) => setnewStudent({ ...newStudent, school: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              select
              label="🏥 קופת חולים"
              value={newStudent.healthFund}
              onChange={(e) => setnewStudent({ ...newStudent, healthFund: e.target.value })}
              className="dialog-field"
            >
              {healthFundOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="📚 כיתה"
              value={newStudent.class}
              onChange={(e) => setnewStudent({ ...newStudent, class: e.target.value })}
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
              value={newStudent.sector}
              onChange={(e) => setnewStudent({ ...newStudent, sector: e.target.value })}
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
              value={newStudent.status || 'פעיל'}
              onChange={(e) => setnewStudent({ ...newStudent, status: e.target.value })}
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
            <Button onClick={() => setOpen(false)} className="dialog-button secondary">
              ❌ ביטול
            </Button>
            <Button onClick={handleAdd} className="dialog-button primary">
              ✅ הוסף תלמיד
            </Button>
          </DialogActions>
        </Dialog>

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
              label="🏥 קופת חולים"
              value={currentStudent.healthFund}
              onChange={(e) => setCurrentStudent({ ...currentStudent, healthFund: e.target.value })}
              className="dialog-field"
            >
              {healthFundOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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
          maxWidth="sm"
          className="advanced-dialog"
        >
          <DialogTitle className="dialog-title" sx={{ background: 'linear-gradient(45deg, #EF4444, #DC2626) !important' }}>
            🗑️ מחיקת תלמיד
          </DialogTitle>
          <DialogContent className="dialog-content">
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" sx={{ color: '#374151', mb: 2 }}>
                ? האם אתה בטוח שברצונך למחוק את התלמיד
              </Typography>
              <Typography variant="h5" sx={{ color: '#1E3A8A', fontWeight: 'bold' }}>
                {currentStudent.firstName} {currentStudent.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 1 }}>
                פעולה זו לא ניתנת לביטול
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => setDeleteOpen(false)} className="dialog-button primary">
              ❌ ביטול
            </Button>
            <Button
              onClick={() => {
                handleDelete(currentStudent.id);
                setDeleteOpen(false);
              }}
              className="dialog-button secondary"
            >
              🗑️ כן, מחק
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

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%', direction: 'rtl' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}

