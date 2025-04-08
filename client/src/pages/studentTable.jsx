import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

// פונקציות גישה לשרת
const fetchStudents = async () => {
  try {
    const response = await axios.get('https://localhost:5000/api/Student/GetAll');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

const addStudent = async (student) => {
  try {
    const response = await axios.post('https://localhost:5000/api/Student/Addstudent', student);
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
  }
};

const updateStudent = async (student) => {
  try {
    const response = await axios.put(`https://localhost:5000/api/Student/UpdateStudent/${student.id}`, student);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
  }
};

const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(`https://localhost:5000/api/Student/DeleteStudent/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
  }
};

export default function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ id: null, name: '', phone: null, city: '', school: '' });
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
    const newStudent = { firstName: currentStudent.firstName, lastName: currentStudent.lastName,phone: currentStudent.phone, city: currentStudent.city, school: currentStudent.school };
    const addedStudent = await addStudent(newStudent);
    setStudents([...students, addedStudent]);
    setOpen(false);
    setCurrentStudent({ id: null, firstName: '', lastName: '', phone:null, city: '' ,school:''});
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
    setCurrentStudent({ id: null, firstName: '',lastName:'' ,phone:null, city: '' ,school:''}); 
  };

  const handleDelete = async (id) => {
    await deleteStudent(id);
    setStudents(students.filter((student) => student.id !== id));
  };

  const columns = [
    { field: 'id', headerName: 'קוד תלמיד', width: 120 },
    { field: 'firstName', headerName: 'שם פרטי', width: 150 },
    { field: 'lastName', headerName: 'שם משפחה', width: 200 },
    { field: 'phone', headerName: 'טלפון', width: 200 },
    { field: 'city', headerName: 'עיר', width: 150 },
    { field: 'school', headerName: 'בית ספר', width: 150 },
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
            onClick={() => handleDelete(params.row.id)}
          >
            מחק
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ height: 500, width: '80%', margin: 'auto', marginTop: 5, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: '600', color: '#3f3f3f' }}>
          רשימת תלמידים
        </Typography>

        <DataGrid
          rows={students}
          columns={columns}
          pageSize={5}
          loading={loading}
          sx={{
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow: 3,
            padding: 2,
          }}
        />
      </Box>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          startIcon={<Add />}
          variant="contained"
          color="primary"
          onClick={() => { setCurrentStudent({ id: null, firstName: '', lastName: '',phone:null, city: '' ,school:'' }); setOpen(true); }}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            borderRadius: '50%',
            width: 56,
            height: 56,
            boxShadow: 3,
            transition: 'all 0.3s ease',
          }}
        />
      </motion.div>

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
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: '#333' }}>
          {currentStudent.id ? "ערוך תלמיד" : "הוסף תלמיד"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="שם מלא"
            value={currentStudent.firstName}
            onChange={(e) => setCurrentStudent({ ...currentStudent, firstName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="גיל"
            value={currentStudent.age}
            onChange={(e) => setCurrentStudent({ ...currentStudent, age: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="אימייל"
            value={currentStudent.email}
            onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error" variant="outlined">
            ביטול
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {currentStudent.id ? "שמור שינויים" : "הוסף תלמיד"}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
