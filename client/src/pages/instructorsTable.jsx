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


// פונקציות גישה לשרת


const updateInstructor = async (instructor) => {
  try {
    const response = await axios.put(`https://localhost:5000/api/instructor/Update/${instructor.id}`, instructor);
    return response.data;
  } catch (error) {
    console.error('Error updating instructor:', error);
  }
};


export default function InstructorsTable() {
  const instructors = useSelector((state) => state.instructors.instructors);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentInstructor, setcurrentInstructor] = useState({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();


  useEffect(() => {
    const loadInstructors = async () => {
      dispatch(fetchInstructors());
      setLoading(false);
    };
    loadInstructors();
  }, [instructors]);

  const handleAdd = async () => {
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

  const handleSave = async () => {
    if (currentInstructor.id) {
      const updatedInstructor = await updateInstructor(currentInstructor);
      setInstructors(instructors.map((instructor) => (instructor.id === updatedInstructor.id ? updatedInstructor : instructor)));
    } else {
      dispatch(addInstructor(currentInstructor));
    }
    setOpen(false);
    setcurrentInstructor({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' });
  };

  const handleDelete = async (id) => {
    dispatch(deleteInstructor(id));
  };

  const columns = [
    { field: 'id', headerName: 'קוד מדריך', width: 120 },
    { field: 'firstName', headerName: 'שם פרטי', width: 120 },
    { field: 'lastName', headerName: 'שם משפחה', width: 120 },
    { field: 'phone', headerName: 'טלפון', width: 100 },
    { field: 'email', headerName: 'כתובת מייל', width: 150 },
    { field: 'city', headerName: 'עיר', width: 120 },
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
            onClick={() => setDeleteOpen(true)}
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
          רשימת מדריכים
        </Typography>

        <DataGrid
          rows={instructors}
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

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          startIcon={<Add />}
          variant="contained"
          color="primary"
          onClick={() => { setcurrentInstructor({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' }); setOpen(true); }}
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
          {currentInstructor.id ? "ערוך מדריך" : "הוסף מדריך"}
        </DialogTitle>
        <DialogContent>
          <br />
          <TextField
            fullWidth
            label="תעודת זהות"
            value={currentInstructor.id}
            onChange={(e) => setcurrentInstructor({ ...currentInstructor, id: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="שם פרטי"
            value={currentInstructor.firstName}
            onChange={(e) => setcurrentInstructor({ ...currentInstructor, firstName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="שם משפחה"
            value={currentInstructor.lastName}
            onChange={(e) => setcurrentInstructor({ ...currentInstructor, lastName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="טלפון"
            value={currentInstructor.phone}
            onChange={(e) => setcurrentInstructor({ ...currentInstructor, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="עיר"
            value={currentInstructor.city}
            onChange={(e) => setcurrentInstructor({ ...currentInstructor, city: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="אימייל"
            value={currentInstructor.email}
            onChange={(e) => setcurrentInstructor({ ...currentInstructor, email: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error" variant="outlined">
            ביטול
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {currentInstructor.id ? "שמור שינויים" : "הוסף מדריך"}
          </Button>
        </DialogActions>
      </Dialog>
      {/*דיאלוג מחיקת מדריך */}
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
      </Dialog>
    </motion.div>
  );
}
