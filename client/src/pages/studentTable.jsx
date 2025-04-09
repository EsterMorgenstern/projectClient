import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

// פונקציות גישה לשרת
const fetchStudents = async () => {
  try {
    const response = await axios.get('https://localhost:5000/api/Student/GetAll');
    //   const response = await axios.get('https://localhost:5000/api/Student/GetAll');

    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

const addStudent = async (student) => {
  try {
    const response = await axios.post('https://localhost:5000/api/Student/Add', student);
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
  }
};

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
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ id: null, firstName: '', lastName: '', phone: null, city: '', school: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      const fetchedStudents = await fetchStudents();
      setStudents(fetchedStudents);
      setLoading(false);
    };
    loadStudents();
  }, []);

  const handleAdd = async () => {
    const newStudent = { firstName: currentStudent.firstName, lastName: currentStudent.lastName, phone: currentStudent.phone, city: currentStudent.city, school: currentStudent.school };
    const addedStudent = await addStudent(newStudent);
    setStudents([...students, addedStudent]);
    setOpen(false);
    setCurrentStudent({ id: null, firstName: '', lastName: '', phone: null, city: '', school: '' });
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setOpen(true);
  };

  const handleSave = async () => {
    if (currentStudent.id) {
      const updatedStudent = await updateStudent(currentStudent);
      setStudents(students.map((student) => (student.id === updatedStudent.id ? updatedStudent : student)));
    } else {
      const addedStudent = await addStudent(currentStudent);
      setStudents([...students, addedStudent]);
    }
    setOpen(false);
    setCurrentStudent({ id: null, firstName: '', lastName: '', phone: null, city: '', school: '' });
  };

  const handleDelete = async (id) => {
    setDeleteOpen(true)
    await deleteStudent(id);
    setStudents(students.filter((student) => student.id !== id));
  };

  const columns = [
    { field: 'id', headerName: 'קוד תלמיד', width: 120 },
    { field: 'firstName', headerName: 'שם פרטי', width: 150 },
    { field: 'lastName', headerName: 'שם משפחה', width: 110 },
    { field: 'phone', headerName: 'טלפון', width: 110 },
    { field: 'city', headerName: 'עיר', width: 150 },
    { field: 'school', headerName: 'בית ספר', width: 100 },
    {
      field: 'actions',
      headerName: 'פעולות',
      width: 500,
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
            onClick={() => handleDelete(params.row.id)
            }
          >
            מחק
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A' }}>
          רשימת תלמידים
        </Typography>

        <DataGrid
          rows={students}
          columns={columns}
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

      <Button
        component={Link}
        startIcon={<Add />}
        // to="/courses/new"
        variant="contained"
        color="primary"
        onClick={() => { setCurrentStudent({ id: null, firstName: '', lastName: '', phone: null, city: '', school: '' }); setOpen(true); }}
        size="large"
        sx={{
          borderRadius: '20px',
          fontSize: '18px',
          marginTop: '20px',
          padding: '10px 20px',
          transition: 'all 0.3s ease',
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
            backgroundColor: '#F0F4FF', // צבע רקע כחול בהיר
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center' }}>
          {currentStudent.id ? 'ערוך תלמיד' : 'הוסף תלמיד'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="שם מלא"
            value={currentStudent.firstName}
            onChange={(e) => setCurrentStudent({ ...currentStudent, firstName: e.target.value })}
            sx={{ mb: 2, backgroundColor: '#ffffff' }} // רקע לבן בשדות
          />
          <TextField
            fullWidth
            label="גיל"
            value={currentStudent.age}
            onChange={(e) => setCurrentStudent({ ...currentStudent, age: e.target.value })}
            sx={{ mb: 2, backgroundColor: '#ffffff' }}
          />
          <TextField
            fullWidth
            label="אימייל"
            value={currentStudent.email}
            onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
            sx={{ mb: 2, backgroundColor: '#ffffff' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error" variant="outlined">
            ביטול
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: '#1E3A8A', // כחול כהה
              '&:hover': { backgroundColor: '#3B82F6' }, // כחול בהיר בהעברה
            }}
          >
            {currentStudent.id ? 'שמור שינויים' : 'הוסף תלמיד'}
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
            onClick={handleDelete}
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

    </motion.div>
  );
}
