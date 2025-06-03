import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography, MenuItem, TableContainer, Paper, TableHead, TableRow, FormControl, InputLabel, Select, TableCell, TableBody, Chip, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add, Edit, Delete, Info as InfoIcon, Check as CheckIcon,
  Close as CloseIcon, School as CourseIcon, Search as SearchIcon
} from '@mui/icons-material';
import { History as HistoryIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import StudentAttendanceHistory from './studentAttendanceHistory'
import { fetchStudents } from '../store/student/studentGetAllThunk';
import { addStudent } from '../store/student/studentAddThunk';
import { getgroupStudentByStudentId } from '../store/groupStudent/groupStudentGetByStudentIdThunk';
import { fetchCourses } from '../store/course/CoursesGetAllThunk';
import { groupStudentAddThunk } from '../store/groupStudent/groupStudentAddThunk';
import TermsDialog from './termDialog';
import { deleteStudent } from '../store/student/studentDeleteThunk';
import { editStudent } from '../store/student/studentEditThunk';
import { Table, TableCellsMerge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function StudentsTable() {
  const students = useSelector((state) => state.students.students);
  const studentCourses = useSelector((state) => state.groupStudents.groupStudentById);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openCoursesDialog, setOpenCoursesDialog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ id: null, firstName: '', lastName: '', phone: null, city: '', school: '', healthFund: '', gender: "", sector: "" });
  const [newStudent, setnewStudent] = useState({ id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025', city: '', school: '', healthFund: '', gender: "", sector: "" });
  const [currentStudentCourse, setCurrentStudentCourse] = useState({ courseId: null, studentId: null, registrationDate: Date.now().toISOString });
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [termsOpen, setTermsOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [attendanceHistoryOpen, setAttendanceHistoryOpen] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const healthFundOptions = [
    'מכבי',
    'מאוחדת',
    'לאומית',
    'כללית'
  ];

  // פונקציה לחיפוש חכם
  const smartSearch = (students, searchTerm) => {
    if (!searchTerm.trim()) return students;

    const term = searchTerm.toLowerCase().trim();

    return students.filter(student => {
      // חיפוש לפי שם פרטי
      const firstNameMatch = student.firstName?.toLowerCase().includes(term);

      // חיפוש לפי שם משפחה
      const lastNameMatch = student.lastName?.toLowerCase().includes(term);

      // חיפוש לפי שם מלא (שם פרטי + משפחה)
      const fullNameMatch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(term);

      // חיפוש לפי ת"ז (חלקי או מלא)
      const idMatch = student.id?.toString().includes(term);

      // חיפוש לפי טלפון (חלקי או מלא)
      const phoneMatch = student.phone?.toString().includes(term);

      // חיפוש לפי עיר
      const cityMatch = student.city?.toLowerCase().includes(term);

      return firstNameMatch || lastNameMatch || fullNameMatch || idMatch || phoneMatch || cityMatch;
    });
  };

  useEffect(() => {
    dispatch(fetchStudents());
    setLoading(false);
  }, [dispatch]);

  // עדכון הרשימה המסוננת כאשר משתנה החיפוש או רשימת התלמידים
  useEffect(() => {
    const filtered = smartSearch(students, searchTerm);
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  useEffect(() => {
    setCurrentStudentCourse((prev) => ({
      ...prev,
      courseId: selectedCourse,
    }));
  }, [selectedCourse]);

  const refreshTable = async () => {
    await dispatch(fetchStudents());
  }
  const handleAdd = async () => {
    if (await dispatch(addStudent(newStudent))) {
      refreshTable();
      setnewStudent({ id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025', city: '', school: '', healthFund: '', gender: "", sector: "" });
    }
    setOpen(false);
    setOpenEdit(false);

  };

  const handleEdit = async () => {
    if (await dispatch(editStudent(currentStudent))) {
      setOpenEdit(false);
      refreshTable();
    }
  };

  const handleDelete = async (id) => {
    if (await dispatch(deleteStudent(id)))
      refreshTable();
  };

  const addStudentCorse = async () => {
    await dispatch(addStudentCourse(currentStudentCourse));
  }
  const columns = [
  {
    field: 'actions',
    headerName: 'פעולות',
    width: 300,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Edit />}
          size="small"
          onClick={(e) => {
            e.stopPropagation(); // מונע את הפעלת onRowClick
            setCurrentStudent({
              id: params.row.id,
              firstName: params.row.firstName,
              lastName: params.row.lastName,
              phone: params.row.phone,
              city: params.row.city,
              school: params.row.school,
              healthFund: params.row.healthFund,
              gender: params.row.gender,
              sector: params.row.sector
            });
            setOpenEdit(true);
          }}
        >
          ערוך
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          size="small"
          onClick={(e) => {
            e.stopPropagation(); // מונע את הפעלת onRowClick
            setCurrentStudent({
              id: params.row.id,
              firstName: params.row.firstName,
              lastName: params.row.lastName,
              phone: params.row.phone,
              city: params.row.city,
              school: params.row.school,
              healthFund: params.row.healthFund,
              gender: params.row.gender,
              sector: params.row.sector
            });
            setDeleteOpen(true);
          }}
        >
          מחק
        </Button>
        <Button
          variant="outlined"
          color="info"
          startIcon={<HistoryIcon />}
          size="small"
          onClick={(e) => {
            e.stopPropagation(); // מונע את הפעלת onRowClick
            setSelectedStudentForHistory(params.row);
            setAttendanceHistoryOpen(true);
          }}
        >
          נוכחות
        </Button>
      </Box>
    ),
  },
    { field: 'id', headerName: 'קוד תלמיד', width: 120 },
    { 
    field: 'firstName', 
    headerName: 'שם פרטי', 
    width: 90,
    renderCell: (params) => (
      <Box 
        sx={{ 
          cursor: 'pointer', 
          color: '#1976d2',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        {params.value}
      </Box>
    )
  },
  { 
    field: 'lastName', 
    headerName: 'שם משפחה', 
    width: 110,
    renderCell: (params) => (
      <Box 
        sx={{ 
          cursor: 'pointer', 
          color: '#1976d2',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        {params.value}
      </Box>
    )
  },
    { field: 'phone', headerName: 'טלפון', width: 110 },
    { field: 'city', headerName: 'עיר', width: 100 },
    { field: 'school', headerName: 'בית ספר', width: 90 },
    { field: 'healthFund', headerName: 'קופת חולים', width: 100 },
    { field: 'gender', headerName: 'מין', width: 100 },
    { field: 'sector', headerName: 'מגזר', width: 100 },

  ];
  const columnsStudentCorses = [

    { field: 'courseId', headerName: 'קוד קורס', width: 90 },
    { field: 'courseName', headerName: 'שם הקורס', width: 90 },
    { field: 'instructorId', headerName: 'קוד מדריך', width: 120 },
    { field: 'registrationDate', headerName: 'תאריך התחלה', width: 110 },


  ];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      < div style={{ direction: 'rtl' }}>

        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A' }}>
            ניהול תלמידים
          </Typography>

          {/* שדה חיפוש */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="חפש תלמיד לפי שם, ת״ז, טלפון או עיר..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#1E3A8A' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                '&:hover fieldset': {
                  borderColor: '#3B82F6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1E3A8A',
                },
              },
            }}
          />

          {/* הצגת מספר התוצאות */}
          {searchTerm && (
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              נמצאו {filteredStudents.length} תוצאות עבור "{searchTerm}"
            </Typography>
          )}

        {filteredStudents.length > 0 && <DataGrid
  rows={filteredStudents.filter(row => row?.id != null && row?.id !== '')}
  columns={columns}
  getRowId={(row) => row.id}
  pageSize={5}
  rowsPerPageOptions={[5]}
  onCellClick={(params, event) => {
    // רק אם לחצו על שם פרטי או שם משפחה
    if (params.field === 'firstName' || params.field === 'lastName') {
      setOpenCoursesDialog(true);
      setCurrentStudent({
        id: params.row.id,
        firstName: params.row.firstName,
        lastName: params.row.lastName,
        phone: params.row.phone,
        city: params.row.city,
        school: params.row.school,
        healthFund: params.row.healthFund,
        gender: params.row.gender,
        sector: params.row.sector
      });
      dispatch(getgroupStudentByStudentId(params.row.id));
    }
  }}
  sx={{
    boxShadow: 5,
    borderRadius: '10px',
    '& .MuiDataGrid-columnHeader': {
      // backgroundColor: '#93C5FD',
    },
  }}
/>}
         <StudentAttendanceHistory
  open={attendanceHistoryOpen}
  onClose={() => setAttendanceHistoryOpen(false)}
  student={selectedStudentForHistory}
/>
          {/* הודעה כאשר אין תוצאות */}
          {searchTerm && filteredStudents.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                לא נמצאו תוצאות עבור "{searchTerm}"
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                נסה לחפש עם מילות מפתח אחרות
              </Typography>
            </Box>
          )}
        </Box>
        {/* חוגים */}
        <Dialog
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          open={openCoursesDialog}
          onClose={() => setOpenCoursesDialog(false)}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 12,
              padding: 0,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            },
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
              החוגים של {currentStudent.firstName} {currentStudent.lastName}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate('/entrollStudent')}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              הוסף חוג
            </Button>
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            {studentCourses.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TableContainer component={Paper} sx={{ direction: 'rtl', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: 2 }}>

                  <TableHead >
                    <TableRow
                      component={motion.tr}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      sx={{
                        '&:nth-of-type(odd)': { bgcolor: 'rgba(59, 130, 246, 0.03)' },
                        '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' },
                        transition: 'background-color 0.3s'
                      }}>
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
                    {studentCourses.map((course, index) => (
                      <TableRow
                        key={course.groupStudentId || index}
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

                            <Typography sx={{ fontWeight: 'medium' }}>{course.courseName}</Typography>
                          </Box>
                        </TableCell>

                        <TableCell align="right">{course.groupName}</TableCell>
                        <TableCell align="right">{course.branchName}</TableCell>
                        <TableCell align="right">{course.instructorName}</TableCell>
                        <TableCell align="right">{course.dayOfWeek} {course.hour}</TableCell><TableCell align="right">{course.enrollmentDate}</TableCell>
                        <TableCell align="right">
                          <Chip
                            icon={course.isActive === true ? <CheckIcon /> : <CloseIcon />}
                            label={course.isActive}
                            color={course.isActive === true ? "success" : "error"}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
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
                  ניתן לרשום את התלמיד לחוגים חדשים דרך כפתור הוסף חוג
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
            <Button
              onClick={() => setOpenCoursesDialog(false)}
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

        {/* כפתור הוספת תלמיד חדש */}
        <Button
          onClick={() => setTermsOpen(true)}
          variant="contained"
          color="primary"
          size="large"
          sx={{
            borderRadius: '20px',
            fontSize: '18px',
            marginTop: '20px',
            padding: '10px 20px',
            width: '100%',
          }}
        >
          הוסף תלמיד חדש
        </Button>
        <TermsDialog
          open={termsOpen}
          onClose={() => setTermsOpen(false)}
          onAccept={() => {
            setTermsOpen(false);
            setnewStudent({ id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025', city: '', school: '', healthFund: '' });
            setOpen(true);
          }}
        />

        {/*דיאלוג הוספת תלמיד */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 12,
              padding: 3,
              backgroundColor: 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <DialogTitle sx={{ color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center' }}>
            הוסף תלמיד
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="תעודת זהות"
              value={newStudent.id}
              onChange={(e) => setnewStudent({ ...newStudent, id: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="שם פרטי"
              value={newStudent.firstName}
              onChange={(e) => setnewStudent({ ...newStudent, firstName: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="שם משפחה"
              value={newStudent.lastName}
              onChange={(e) => setnewStudent({ ...newStudent, lastName: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="טלפון"
              value={newStudent.phone}
              onChange={(e) => setnewStudent({ ...newStudent, phone: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="תאריך לידה"
              type="date"
              value={newStudent.birthDate}
              onChange={(e) => setnewStudent({ ...newStudent, birthDate: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="עיר"
              value={newStudent.city}
              onChange={(e) => setnewStudent({ ...newStudent, city: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="בית ספר"
              value={newStudent.school}
              onChange={(e) => setnewStudent({ ...newStudent, school: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              select
              label="קופת חולים"
              value={newStudent.healthFund}
              onChange={(e) =>
                setnewStudent({ ...newStudent, healthFund: e.target.value })
              }
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            >
              {healthFundOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label=" מין"
              value={newStudent.gender}
              onChange={(e) => setnewStudent({ ...newStudent, gender: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label=" מגזר"
              value={newStudent.sector}
              onChange={(e) => setnewStudent({ ...newStudent, sector: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="error" variant="outlined">
              ביטול
            </Button>
            <Button
              onClick={() => handleAdd()}
              color="primary"
              variant="contained"
              sx={{
                backgroundColor: '#1E3A8A',
                '&:hover': { backgroundColor: '#3B82F6' },
              }}
            >
              הוסף תלמיד
            </Button>
          </DialogActions>
        </Dialog>

        {/*דיאלוג עריכה */}
        <Dialog
          open={openEdit}
          onClose={() => setOpen(false)}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 12,
              padding: 3,
              backgroundColor: 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <DialogTitle sx={{ color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center' }}>
            ערוך תלמיד
          </DialogTitle>
          <DialogContent>
            <br />
            <TextField
              fullWidth
              label="תעודת זהות"
              value={currentStudent.id}
              onChange={(e) => setCurrentStudent({ ...currentStudent, id: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="שם פרטי"
              value={currentStudent.firstName}
              onChange={(e) => setCurrentStudent({ ...currentStudent, firstName: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="שם משפחה"
              value={currentStudent.lastName}
              onChange={(e) => setCurrentStudent({ ...currentStudent, lastName: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="טלפון"
              type="number"
              value={currentStudent.phone}
              onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="עיר"
              value={currentStudent.city}
              onChange={(e) => setCurrentStudent({ ...currentStudent, city: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="בית ספר"
              value={currentStudent.school}
              onChange={(e) => setCurrentStudent({ ...currentStudent, school: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              select
              label="קופת חולים"
              value={currentStudent.healthFund}
              onChange={(e) =>
                setCurrentStudent({ ...currentStudent, healthFund: e.target.value })
              }
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            >
              {healthFundOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label=" מין"
              value={currentStudent.gender}
              onChange={(e) => setCurrentStudent({ ...currentStudent, gender: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label=" מגזר"
              value={currentStudent.sector}
              onChange={(e) => setCurrentStudent({ ...currentStudent, sector: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)} color="error" variant="outlined">
              ביטול
            </Button>
            <Button
              onClick={() => { handleEdit(); }}
              color="primary"
              variant="contained"
              sx={{
                backgroundColor: '#1E3A8A',
                '&:hover': { backgroundColor: '#3B82F6' },
              }}
            >
              שמור תלמיד
            </Button>
          </DialogActions>
        </Dialog>
        {/*דיאלוג מחיקת תלמיד */}
        <Dialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 12,
              padding: 3,
              backgroundColor: '#F0F4FF',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <DialogTitle sx={{ color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center' }}>
            מחיקת תלמיד
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ color: '#333' }}>
              ?  {currentStudent.lastName} {currentStudent.firstName} האם אתה בטוח שברצונך למחוק את התלמיד
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)} color="error" variant="outlined">
              לא
            </Button>
            <Button
              onClick={() => { handleDelete(currentStudent.id); setDeleteOpen(false) }}
              color="primary"
              variant="contained"
              sx={{
                backgroundColor: '#D32F2F',
                '&:hover': { backgroundColor: '#F44336' },
              }}
            >
              כן, מחק
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </motion.div>
  );
}
