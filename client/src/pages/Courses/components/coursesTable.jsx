import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, IntegrationInstructions } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addInstructor } from '../../../store/instructor/instructorAddThunk';
import { deleteCourse } from '../../../store/course/courseDeleteThunk';
import { addCourse } from '../../../store/course/courseAddThunk';
import { fetchCourses } from '../../../store/course/CoursesGetAllThunk';


export default function CoursesTable() {
  const courses = useSelector((state) => state.courses.courses);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentCourse, setcurrentCourse] = useState({ courseId: null, courseName: '', instructorId: '', numOfStudents: null, maxNumOfStudent: null, startDate: '' });
  const [newCourse, setnewCourse] = useState({ courseId: null, courseName: '', instructorId: '', numOfStudents: null, maxNumOfStudent: null, startDate: '' });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();


  useEffect(() => {
    const loadInstructors = async () => {
      dispatch(fetchCourses());
      setLoading(false);
    };
    loadInstructors();
  }, []);

  const refreshCourses = async () => {
    await dispatch(fetchCourses());
    setTimeout(() => {
      const updated = Courses;
      const invalidRows = updated.filter(row => !row.courseId);
      console.log('שורות ללא מזהה:', invalidRows);
    }, 100);
  };
  const handleSave = async () => {
    const newinstructor = { firstName: currentInstructor.firstName, lastName: currentInstructor.lastName, phone: currentInstructor.phone, email: currentInstructor.email, city: currentInstructor.city };
    const addedinstructor = await addInstructor(newinstructor);
    setInstructors([...instructors, addedinstructor]);
    setOpen(false);
    setcurrentInstructor({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' });
  };

  const handleEdit = (instructor) => {
    setcurrentInstructor(instructor);
    setOpen(true);
  };

  const handleAdd = async (newCourse) => {
    await dispatch(addCourse(newCourse));
    refreshCourses();
    setOpen(false);
    setnewCourse({ courseId: 0, courseName: '', instructorId: '', numOfStudents: null, maxNumOfStudent: null, startDate: '' });
  };

  const handleDelete = async (course) => {
    await dispatch(deleteCourse(course));
    refreshCourses();
  };

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
          // onClick={() => handleEdit(params.row)}
          >
            ערוך
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => { setcurrentCourse({ courseId: params.row.courseId, courseName: params.row.courseName, instructorId: params.row.instructorId, numOfStudents: params.row.numOfStudents, maxNumOfStudent: params.row.maxNumOfStudent, startDate: params.row.startDate }); setDeleteOpen(true); }}
          >
            מחק
          </Button>
        </Box>
      ),
    },
    { field: 'courseId', headerName: 'קוד קורס', width: 90 },
    { field: 'courseName', headerName: 'שם הקורס', width: 90 },
    { field: 'instructorId', headerName: 'שם מדריך', width: 120 },
    { field: 'numOfStudents', headerName: 'מספר תלמידים', width: 110 },
    { field: 'maxNumOfStudent', headerName: 'מספר תלמידים מקסימלי', width: 170 },
    { field: 'startDate', headerName: 'תאריך התחלה', width: 110 },

  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      < div style={{ direction: 'rtl' }}>

        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A' }}>
            ניהול חוגים
          </Typography>

          {courses.length > 0 && <DataGrid
            rows={courses.filter(row => row?.courseId != null && row?.courseId !== '')}
            columns={columns}
            getRowId={(row) => row.courseId}
            pageSize={5}
            rowsPerPageOptions={[10]}
            sx={{
              boxShadow: 5,
              borderRadius: '10px',

            }}
          />}
        </Box>

        {/* כפתור ודיאלוג הוספת חוג חדש */}
        <Button

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
          onClick={() => { setnewCourse({ courseId: 0, courseName: '', instructorId: '', numOfStudents: null, maxNumOfStudent: null, startDate: '' }); setOpen(true); }}
        >
          הוסף חוג חדש
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          component={motion.div}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 12,
              padding: 3,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {/*  הוספת חוג */}
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: '#1E3A8A' }}>
            הוסף חוג
          </DialogTitle>
          <DialogContent>
            <br />
            <TextField
              fullWidth
              label="שם חוג"
              onChange={(e) => setnewCourse({ ...newCourse, courseName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="קוד מדריך"
              onChange={(e) => setnewCourse({ ...newCourse, instructorId: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="מספר תלמידים"
              onChange={(e) => setnewCourse({ ...newCourse, numOfStudents: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="מספר תלמידים מקסימלי"
              onChange={(e) => setnewCourse({ ...newCourse, maxNumOfStudent: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="תאריך התחלה"
              type="date"
              onChange={(e) => setnewCourse({ ...newCourse, startDate: e.target.value })}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="error" variant="outlined">
              ביטול
            </Button>
            <Button onClick={() => handleAdd(newCourse)} color="primary" variant="contained">
              הוסף חוג
            </Button>
          </DialogActions>
        </Dialog>
        {/* דיאלוג מחיקת חוג */}
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
            מחיקת חוג
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ color: '#333' }} >
              ?   רשומים אליו {currentCourse.numOfStudents} תלמידים {currentCourse.courseName}האם אתה בטוח שברצונך למחוק את חוג
              {/* אם ברצונך למחוק את החוג, כל התלמידים יבוטלו משיבוץ לחוג זה         */}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)} color="error" variant="outlined">
              לא
            </Button>
            <Button
              onClick={() => { handleDelete(currentCourse); setDeleteOpen(false) }}
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
