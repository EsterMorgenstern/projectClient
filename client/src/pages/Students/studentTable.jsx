
import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Box, Typography, MenuItem, TableContainer, Paper, TableHead, TableRow,
  TableCell, TableBody, Chip, InputAdornment, Pagination, FormControl,
  InputLabel, Select, CircularProgress, Skeleton, Table
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
          <TableCell className="table-head-cell">פעולות</TableCell>
          <TableCell className="table-head-cell">קוד תלמיד</TableCell>
          <TableCell className="table-head-cell">שם פרטי</TableCell>
          <TableCell className="table-head-cell">שם משפחה</TableCell>
          <TableCell className="table-head-cell">טלפון</TableCell>
          <TableCell className="table-head-cell">עיר</TableCell>
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

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openCoursesDialog, setOpenCoursesDialog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: null, firstName: '', lastName: '', phone: null, city: '',
    school: '', healthFund: '', gender: "", sector: ""
  });
  const [newStudent, setnewStudent] = useState({
    id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025',
    city: '', school: '', healthFund: '', gender: "", sector: ""
  });
  const [termsOpen, setTermsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

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
    'מכבי', 'מאוחדת', 'לאומית', 'כללית'
  ];

  // פונקציה לחיפוש חכם
  const smartSearch = (students, searchTerm) => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase().trim();
    return students.filter(student => {
      const firstNameMatch = student.firstName?.toLowerCase().includes(term);
      const lastNameMatch = student.lastName?.toLowerCase().includes(term);
      const fullNameMatch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(term);
      const idMatch = student.id?.toString().includes(term);
      const phoneMatch = student.phone?.toString().includes(term);
      const cityMatch = student.city?.toLowerCase().includes(term);
      return firstNameMatch || lastNameMatch || fullNameMatch || idMatch || phoneMatch || cityMatch;
    });
  };

  // טעינת נתונים ראשונית
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // עדכון הרשימה המסוננת
  useEffect(() => {
    const filtered = smartSearch(students, searchTerm);
    setFilteredStudents(filtered);
    setCurrentPage(1); // איפוס לעמוד הראשון בחיפוש חדש
  }, [students, searchTerm]);

  // עדכון pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filteredStudents.slice(startIndex, endIndex);
    setPaginatedStudents(paginated);
    setTotalPages(Math.ceil(filteredStudents.length / pageSize));
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

  const handleAdd = async () => {
    if (await dispatch(addStudent(newStudent))) {
      refreshTable();
      setnewStudent({
        id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025',
        city: '', school: '', healthFund: '', gender: "", sector: ""
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
          transition={{ duration: 0.5, delay: 0.2 }}
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
                      <TableCell className="table-head-cell" style={{ width: 190 }}>🎯 פעולות</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 130 }}>🆔 קוד תלמיד</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 130 }}>👤 שם פרטי</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 110 }}>👥 שם משפחה</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 70 }}>📞 טלפון</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 100 }}>🏙️ עיר</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 150 }}>🏫 בית ספר</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 160 }}>🏥 קופת חולים</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 80 }}>⚥ מין</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 100 }}>🌍 מגזר</TableCell>
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
        setCurrentStudent({
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          phone: student.phone,
          city: student.city,
          school: student.school,
          healthFund: student.healthFund,
          gender: student.gender,
          sector: student.sector
        });
        setOpenEdit(true);
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
          city: student.city,
          school: student.school,
          healthFund: student.healthFund,
          gender: student.gender,
          sector: student.sector
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
        fontSize: '0.65rem',
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
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.city}</TableCell>
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.school}</TableCell>
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.healthFund}</TableCell>
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.gender}</TableCell>
<TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{student.sector}</TableCell>
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

        {/* כפתור הוספת תלמיד חדש */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
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
              id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025',
              city: '', school: '', healthFund: '', gender: "", sector: ""
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
              label="📅 תאריך לידה"
              type="date"
              value={newStudent.birthDate}
              onChange={(e) => setnewStudent({ ...newStudent, birthDate: e.target.value })}
              className="dialog-field"
              InputLabelProps={{ shrink: true }}
            />
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
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="⚥ מין"
              value={newStudent.gender}
              onChange={(e) => setnewStudent({ ...newStudent, gender: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🌍 מגזר"
              value={newStudent.sector}
              onChange={(e) => setnewStudent({ ...newStudent, sector: e.target.value })}
              className="dialog-field"
            />
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
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="⚥ מין"
              value={currentStudent.gender}
              onChange={(e) => setCurrentStudent({ ...currentStudent, gender: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🌍 מגזר"
              value={currentStudent.sector}
              onChange={(e) => setCurrentStudent({ ...currentStudent, sector: e.target.value })}
              className="dialog-field"
            />
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


      </div>
    </motion.div>
  );
}