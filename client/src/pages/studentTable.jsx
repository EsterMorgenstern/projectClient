import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography, MenuItem, TableContainer, Paper, TableHead, TableRow, FormControl, InputLabel, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../store/student/studentGetAllThunk';
import { addStudent } from '../store/student/studentAddThunk';
import { Table } from 'lucide-react';
import { getgroupStudentByStudentId } from '../store/groupStudent/groupStudentGetByStudentIdThunk';
import { fetchCourses } from '../store/course/CoursesGetAllThunk';
import { groupStudentAddThunk } from '../store/groupStudent/groupStudentAddThunk';
import TermsDialog from './termDialog';
const updateStudent = async (student) => {
  try {
    const response = await axios.put(`https://localhost:5248/api/Student/Update/${student.id}`, student);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
  }
};


export default function StudentsTable() {
  const students = useSelector((state) => state.students.students);
  const studentCourses = useSelector((state) => state.groupStudents.groupStudentById);
  const courses = useSelector((state) => state.courses.courses);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openCoursesDialog, setOpenCoursesDialog] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ id: null, firstName: '', lastName: '', phone: null, city: '', school: '', healthFund: '', gender: "", sector: "" });
  const [newStudent, setnewStudent] = useState({ id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025', city: '', school: '', healthFund: '', gender: "", sector: "" });
  const [currentStudentCourse, setCurrentStudentCourse] = useState({ courseId: null, studentId: null, registrationDate: Date.now().toISOString });
  const [showAddStudentCorse, setShowAddStudentCorse] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [termsOpen, setTermsOpen] = useState(false);

  const dispatch = useDispatch();


  const healthFundOptions = [
    'מכבי',
    'מאוחדת',
    'לאומית',
    'כללית'
  ];
  useEffect(() => {
    dispatch(fetchStudents());
    setLoading(false);
  }, [dispatch]);
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
    refreshTable();
    setOpen(false);
    setOpenEdit(false);

   //setnewStudent({ id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025', city: '', school: '', healthFund: '', gender: "", sector: "" });
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setOpenEdit(true);
  };

  const handleSave = async () => {

    if (currentStudent.id) {
      const updatedStudent = await updateStudent(currentStudent);
      setStudents(students.map((student) => (student.id === updatedStudent.id ? updatedStudent : student)));
    } else {
      await dispatch(groupStudentAddThunk(currentStudent));
    }
    setOpen(false);
    setCurrentStudent({ id: null, firstName: '', lastName: '', phone: null, city: '', school: '', healthFund: '', gender: "", sector: "" });
  };

  const handleDelete = async (id) => {
    await dispatch(deleteStudent(id));
    refreshTable();
  };
  const fetchCoursesFunc = async () => {
    await dispatch(fetchCourses());
    setCurrentStudentCourse({ ...currentStudentCourse, courseId: selectedCourse, studentId: currentStudent.id });
  }
  const addStudentCorse = async () => {
    await dispatch(addStudentCourse(currentStudentCourse));
  }
  const columns = [
    {
      field: 'actions',
      headerName: 'פעולות',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Edit />}
            onClick={() => { setCurrentStudent({ id: params.row.id, firstName: params.row.firstName, lastName: params.row.lastName, phone: params.row.phone, city: params.row.city, school: params.row.school, healthFund: params.row.healthFund, gender: params.row.gender, sector: params.row.sector }); setOpenEdit(true); }}
          >
            ערוך
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => { setCurrentStudent({ id: params.row.id, firstName: params.row.firstName, lastName: params.row.lastName, phone: params.row.phone, city: params.row.city, school: params.row.school, healthFund: params.row.healthFund, gender: params.row.gender, sector: params.row.sector }); setDeleteOpen(true); }}

          >
            מחק
          </Button>
        </Box>
      ),
    },
    { field: 'id', headerName: 'קוד תלמיד', width: 120 },
    { field: 'firstName', headerName: 'שם פרטי', width: 90 },
    { field: 'lastName', headerName: 'שם משפחה', width: 110 },
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


          <DataGrid
            rows={students}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={5}
            rowsPerPageOptions={[5]}
            onRowClick={async (params) => {
              // פתח את הדיאלוג עם רשימת החוגים
              setOpenCoursesDialog(true);
              setCurrentStudent({ id: params.row.id, firstName: params.row.firstName, lastName: params.row.lastName, phone: params.row.phone, city: params.row.city, school: params.row.school, healthFund: params.row.healthFund, community: params.row.community, active: params.row.active });
              await dispatch(getgroupStudentByStudentId(params.row.id)); // קח את החוגים של התלמיד  
            }}
            sx={{
              boxShadow: 5,
              borderRadius: '10px',
              '& .MuiDataGrid-columnHeader': {
                // backgroundColor: '#93C5FD',
              },
            }}
          />
        </Box>
        {/* חוגים */}
        <Dialog
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          open={openCoursesDialog}
          onClose={() => setOpenCoursesDialog(false)}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 12,
              padding: 3,
              backgroundColor: 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)', // צבע רקע כחול בהיר
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <DialogTitle variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A', textAlign: 'center' }}>
            החוגים של {currentStudent.firstName} {currentStudent.lastName}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
              {studentCourses.length > 0 && <DataGrid
                rows={studentCourses.filter(row => row?.courseId != null && row?.courseId !== '')}
                columns={columnsStudentCorses}
                getRowId={(row) => row.courseId}
                pageSize={5}
                rowsPerPageOptions={[10]}
                sx={{
                  boxShadow: 5,
                  borderRadius: '10px',

                }}
              />}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCoursesDialog(false)} color="error" variant="outlined">
              ביטול
            </Button>
            <Button onClick={() => { setShowAddStudentCorse(true), fetchCoursesFunc() }} color="error" variant="outlined">
              הוסף חוג
            </Button>
          </DialogActions>
        </Dialog>
        {/* דיאלוג הוספת חוג */}
        <Dialog
          open={showAddStudentCorse}
          onClose={() => setShowAddStudentCorse(false)}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 12,
              padding: 3,
              backgroundColor: 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)', // צבע רקע כחול בהיר
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            },
          }}
        >

          <DialogTitle sx={{ color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center' }}>
            הוסף חוג לתלמיד
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel>בחר חוג</InputLabel>
              <Select
                value={selectedCourse}
                label="בחר חוג"
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((course) => (
                  <MenuItem key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                backgroundColor: '#1E40AF',
                color: '#fff',
                borderRadius: 2,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#3B82F6'
                }
              }}
              onClick={() => { addStudentCorse(), setShowAddStudentCorse(false); }}
            >
              שבץ תלמיד לחוג
            </Button>
          </DialogContent>
        </Dialog>
        {/* כפתור הוספת תלמיד חדש */}
        {/* אישור תקנון */}
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
              backgroundColor: 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)', // צבע רקע כחול בהיר
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
              sx={{ mb: 2, backgroundColor: '#ffffff' }} // רקע לבן בשדות
            />
            <TextField
              fullWidth
              label="שם פרטי"
              value={newStudent.firstName}
              onChange={(e) => setnewStudent({ ...newStudent, firstName: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }} // רקע לבן בשדות
            />
            <TextField
              fullWidth
              label="שם משפחה"
              value={newStudent.lastName}
              onChange={(e) => setnewStudent({ ...newStudent, lastName: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }} // רקע לבן בשדות
            />
            <TextField
              fullWidth
              label="טלפון"
              value={newStudent.phone}
              onChange={(e) => setnewStudent({ ...newStudent, phone: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }} // רקע לבן בשדות
            />
            <TextField
              fullWidth
              label="תאריך לידה"
              type="date"
              value={newStudent.birthDate}
              onChange={(e) => setnewStudent({ ...newStudent, birthDate: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }} // רקע לבן בשדות
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
              onClick={() => { handleAdd(); }}
              color="primary"
              variant="contained"
              sx={{
                backgroundColor: '#1E3A8A', // כחול כהה
                '&:hover': { backgroundColor: '#3B82F6' }, // כחול בהיר בהעברה
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
              backgroundColor: 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)', // צבע רקע כחול בהיר
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
              onChange={(e) => setcurrentStudent({ ...currentStudent, id: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }} // רקע לבן בשדות
            />
            <TextField
              fullWidth
              label="שם פרטי"
              value={currentStudent.firstName}
              onChange={(e) => setcurrentStudent({ ...currentStudent, firstName: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }} // רקע לבן בשדות
            />
            <TextField
              fullWidth
              label="שם משפחה"
              value={currentStudent.lastName}
              onChange={(e) => setcurrentStudent({ ...currentStudent, lastName: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }} // רקע לבן בשדות
            />
            <TextField
              fullWidth
              label="טלפון"
              type="number"
              value={currentStudent.phone}
              onChange={(e) => setcurrentStudent({ ...currentStudent, phone: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }} // רקע לבן בשדות
            />
            <TextField
              fullWidth
              label="עיר"
              value={currentStudent.city}
              onChange={(e) => setcurrentStudent({ ...currentStudent, city: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label="בית ספר"
              value={currentStudent.school}
              onChange={(e) => setcurrentStudent({ ...currentStudent, school: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              select
              label="קופת חולים"
              value={currentStudent.healthFund}
              onChange={(e) =>
                setcurrentStudent({ ...currentStudent, healthFund: e.target.value })
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
              onChange={(e) => setcurrentStudent({ ...currentStudent, gender: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
            <TextField
              fullWidth
              label=" מגזר"
              value={currentStudent.sector}
              onChange={(e) => setcurrentStudent({ ...currentStudent, sector: e.target.value })}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)} color="error" variant="outlined">
              ביטול
            </Button>
            <Button
              onClick={() => { handleAdd(); }}
              color="primary"
              variant="contained"
              sx={{
                backgroundColor: '#1E3A8A', // כחול כהה
                '&:hover': { backgroundColor: '#3B82F6' }, // כחול בהיר בהעברה
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
              backgroundColor: '#F0F4FF', // רקע כחול בהיר
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
                backgroundColor: '#D32F2F', // אדום למחיקה
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
