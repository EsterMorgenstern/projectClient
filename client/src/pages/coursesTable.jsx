import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, IntegrationInstructions } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructors } from '../store/instructorGetAllThunk';
import { deleteInstructor } from '../store/instuctorDeleteThunk';
import { addInstructor } from '../store/instructorAddThunk';
import { fetchCourses } from '../store/CoursesGetAllThunk';


// פונקציות גישה לשרת


const updateInstructor = async (instructor) => {
  try {
    const response = await axios.put(`https://localhost:5000/api/instructor/Update/${instructor.id}`, instructor);
    return response.data;
  } catch (error) {
    console.error('Error updating instructor:', error);
  }
};


export default function CoursesTable() {
  const courses = useSelector((state) => state.courses.courses);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // const [currentInstructor, setcurrentInstructor] = useState({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' });
  // const [newInstructor, setnewInstructor] = useState({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();


  useEffect(() => {
    const loadInstructors = async () => {
      dispatch(fetchCourses());
      setLoading(false);
    };
    loadInstructors();
  }, [dispatch]);

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

  const handleAdd = async () => {
    await dispatch(addInstructor(newInstructor));
    setOpen(false);
    setnewInstructor({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' });
  };

  const handleDelete = async (id) => {
    await dispatch(deleteInstructor(id));
    //  await dispatch(fetchInstructors());
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
            // onClick={() => { setcurrentInstructor({ id: params.row.id, firstName: params.row.firstName, lastName: params.row.lastName, phone: params.row.phone, email: params.row.email, city: params.row.city }); setDeleteOpen(true); }}
          >
            מחק
          </Button>
        </Box>
      ),
    },
    { field: 'courseId', headerName: 'קוד קורס', width: 90 },
    { field: 'courseName', headerName: 'שם הקורס', width: 120 },
    { field: 'instructorId', headerName: 'שם מדריך', width: 120 },
    { field: 'numOfStudents', headerName: 'מספר תלמידים', width: 110 },
    { field: 'maxNumOfStudent', headerName: 'מספר תלמידים מקסימלי', width: 170 },
    { field: 'startDate', headerName: 'תאריך התחלה', width: 110 },
   
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
         < div  style={{ direction: 'rtl' }}>
     
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A' }}>
          ניהול חוגים
        </Typography>

        <DataGrid
          rows={courses}
          columns={columns}
          getRowId={(row) => row.courseId}
          pageSize={5}
          rowsPerPageOptions={[10]}
          sx={{
            boxShadow: 5,
            borderRadius: '10px',
            
          }}
        />
      </Box>

      {/* כפתור ודיאלוג הוספת מדריך חדש */}
      <Button
        // onClick={() => { setnewInstructor({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' }); setOpen(true); }}
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
        {/*  הוספת מדריך */}
        {/* <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: '#333' }}>
          הוסף מדריך
        </DialogTitle> */}
        {/* <DialogContent>
          <br />
          <TextField
            fullWidth
            label="תעודת זהות"
            // onChange={(e) => setnewInstructor({ ...newInstructor, id: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="שם פרטי"
            // onChange={(e) => setnewInstructor({ ...newInstructor, firstName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="שם משפחה"
            // onChange={(e) => setnewInstructor({ ...newInstructor, lastName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="טלפון"
            // onChange={(e) => setnewInstructor({ ...newInstructor, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="עיר"
            // onChange={(e) => setnewInstructor({ ...newInstructor, city: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="אימייל"
            // onChange={(e) => setnewInstructor({ ...newInstructor, email: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent> */}
        {/* <DialogActions>
          <Button onClick={() => setOpen(false)} color="error" variant="outlined">
            ביטול
          </Button>
          <Button onClick={() => handleAdd(newInstructor)} color="primary" variant="contained">
            הוסף מדריך
          </Button>
        </DialogActions> */}
      </Dialog>
      {/* דיאלוג מחיקת מדריך
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
          מחיקת מדריך
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: '#333' }}>
            ?  {currentInstructor.lastName} {currentInstructor.firstName} האם אתה בטוח שברצונך למחוק את המדריך

          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color="error" variant="outlined">
            לא
          </Button>
          <Button
            onClick={() => { handleDelete(currentInstructor.id); setDeleteOpen(false) }}
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
      </Dialog> */}
      </div>
    </motion.div>
  );
}
