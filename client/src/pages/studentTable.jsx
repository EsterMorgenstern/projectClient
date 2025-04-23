import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../store/studentGetAllThunk';
import { addStudent } from '../store/studentAddThunk';

// פונקציות גישה לשרת



const updateStudent = async (student) => {
  try {
    const response = await axios.put(`https://localhost:5000/api/Student/Update/${student.id}`, student);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
  }
};

const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(`https://localhost:5000/api/Student/Delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
  }
};

export default function StudentsTable() {
  const students = useSelector((state) => state.students.students);
  // const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ id: null, firstName: '', lastName: '', phone: null, city: '', school: '' });
  const [newStudent, setnewStudent] = useState({ id: null, firstName: '', lastName: '', phone: null,birthDate:'02/03/2025' ,city: '', school: '' });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
 
useEffect(() => {
  dispatch(fetchStudents()) ;
  setLoading(false);
},[dispatch]);


  const handleAdd = async () => {
    // await dispatch(addStudent(newStudent));
    setOpen(false);
    setOpenEdit(false);

    setnewStudent({ id: null, firstName: '', lastName: '', phone: null,birthDate:'02/03/2025' , city: '', school: '' });
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
     await dispatch(addStudent(currentStudent));
    }
    setOpen(false);
    setCurrentStudent({ id: null, firstName: '', lastName: '', phone: null, city: '', school: '' });
  };

  const handleDelete = async (id) => {
    await dispatch(deleteStudent(id));
    // await dispatch(fetchStudents());
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
            onClick={() => handleEdit(params.row)}
          >
            ערוך
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => { setCurrentStudent({ id: params.row.id, firstName: params.row.firstName, lastName: params.row.lastName, phone: params.row.phone, city: params.row.city,school: params.row.school }); setDeleteOpen(true); }}
           
          >
            מחק
          </Button>
        </Box>
      ),
    },
    { field: 'id', headerName: 'קוד תלמיד', width: 120 },
    { field: 'firstName', headerName: 'שם פרטי', width: 150 },
    { field: 'lastName', headerName: 'שם משפחה', width: 110 },
    { field: 'phone', headerName: 'טלפון', width: 110 },
    { field: 'city', headerName: 'עיר', width: 150 },
    { field: 'school', headerName: 'בית ספר', width: 100 },
   
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        < div  style={{ direction: 'rtl' }}>
    
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
          sx={{
            boxShadow: 5,
            borderRadius: '10px',
            '& .MuiDataGrid-columnHeader': {
              // backgroundColor: '#93C5FD',
            },
          }}
        />
      </Box>

      {/* כפתור הוספת תלמיד חדש */}
           <Button
             onClick={() => { setnewStudent({id: null, firstName: '', lastName: '', phone: null,birthDate:'02/03/2025' , city: '', school: '' }); setOpen(true); }}
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
      {/*דיאלוג הוספת תלמיד/עריכה */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 12,
            padding: 3,
            backgroundColor:'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)', // צבע רקע כחול בהיר
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center' }}>
        הוסף תלמיד
        </DialogTitle>
        <DialogContent>
          <br />
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
            type="number"
            value={newStudent.phone}
            onChange={(e) => setnewStudent({ ...newStudent, phone: e.target.value })}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error" variant="outlined">
            ביטול
          </Button>
          <Button
            onClick={() => { handleAdd();}}
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
        {/* כפתור הוספת תלמיד חדש */}
        <Button
             onClick={() => { setnewStudent({id: null, firstName: '', lastName: '', phone: null,birthDate:'02/03/2025' , city: '', school: '' }); setOpen(true); }}
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
      {/*דיאלוג הוספת תלמיד/עריכה */}
      <Dialog
        open={openEdit}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 12,
            padding: 3,
            backgroundColor:'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)', // צבע רקע כחול בהיר
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="error" variant="outlined">
            ביטול
          </Button>
          <Button
            onClick={() => { handleAdd();}}
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
