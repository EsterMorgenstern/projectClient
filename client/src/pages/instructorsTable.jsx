import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, IntegrationInstructions, Search as SearchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructors } from '../store/instructor/instructorGetAllThunk';
import { deleteInstructor } from '../store/instructor/instuctorDeleteThunk';
import { addInstructor } from '../store/instructor/instructorAddThunk';
import { editInstructor } from '../store/instructor/instructorEditThunk';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import './customDialog.css';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationCityIcon from '@mui/icons-material/LocationCity';
// פונקציות גישה לשרת


const updateInstructor = async (instructor) => {
  try {
    const response = await axios.put(`https://localhost:5248/api/instructor/Update/${instructor.id}`, instructor);
    return response.data;
  } catch (error) {
    console.error('Error updating instructor:', error);
  }
};


export default function InstructorsTable() {
  const instructors = useSelector((state) => state.instructors.instructors);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentInstructor, setcurrentInstructor] = useState({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '',sector:'' });
  const [newInstructor, setnewInstructor] = useState({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '',sector:'' });
  const [loading, setLoading] = useState(true);
  
  // הוספת state לחיפוש
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  
  const dispatch = useDispatch();

  // פונקציה לחיפוש חכם למדריכים
  const smartSearchInstructors = (instructors, searchTerm) => {
    if (!searchTerm.trim()) return instructors;
    
    const term = searchTerm.toLowerCase().trim();
    
    return instructors.filter(instructor => {
      // חיפוש לפי שם פרטי
      const firstNameMatch = instructor.firstName?.toLowerCase().includes(term);
      
      // חיפוש לפי שם משפחה
      const lastNameMatch = instructor.lastName?.toLowerCase().includes(term);
      
      // חיפוש לפי שם מלא (שם פרטי + משפחה)
      const fullNameMatch = `${instructor.firstName} ${instructor.lastName}`.toLowerCase().includes(term);
      
      // חיפוש לפי ת"ז (חלקי או מלא)
      const idMatch = instructor.id?.toString().includes(term);
      
      // חיפוש לפי טלפון (חלקי או מלא)
      const phoneMatch = instructor.phone?.toString().includes(term);
      
      // חיפוש לפי עיר
      const cityMatch = instructor.city?.toLowerCase().includes(term);
      
      // חיפוש לפי אימייל
      const emailMatch = instructor.email?.toLowerCase().includes(term);
      
      // חיפוש לפי מגזר
      const sectorMatch = instructor.sector?.toLowerCase().includes(term);
      
      return firstNameMatch || lastNameMatch || fullNameMatch || idMatch || phoneMatch || cityMatch || emailMatch || sectorMatch;
    });
  };

  useEffect(() => {
    const loadInstructors = async () => {
      await dispatch(fetchInstructors());
      setLoading(false);
    };
    loadInstructors();
  }, [dispatch]);

  // עדכון הרשימה המסוננת כאשר משתנה החיפוש או רשימת המדריכים
  useEffect(() => {
    const filtered = smartSearchInstructors(instructors, searchTerm);
    setFilteredInstructors(filtered);
  }, [instructors, searchTerm]);

  const handleSave = async () => {
    const newinstructor = { firstName: currentInstructor.firstName, lastName: currentInstructor.lastName, phone: currentInstructor.phone, email: currentInstructor.email, city: currentInstructor.city ,sector:currentInstructor.sector};
    const addedinstructor = await addInstructor(newinstructor);
    setInstructors([...instructors, addedinstructor]);
    setOpen(false);
    setcurrentInstructor({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '',sector:'' });
  };

  const handleEdit = async (instructor) => {
    setcurrentInstructor(instructor);
    await dispatch(editInstructor(instructor));
    setOpenEdit(false);
    refreshTable();
  };

  const handleAdd = async () => {
    debugger
    await dispatch(addInstructor(newInstructor));
    refreshTable();
    setOpen(false);
    setnewInstructor({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' ,sector:''});
  };

  const refreshTable = async () => {
    await dispatch(fetchInstructors());
    setTimeout(() => {
      const updated = instructors;
      const invalidRows = updated.filter(row => !row.id);
      console.log('שורות ללא מזהה:', invalidRows);
    }, 100);
  };

  const handleDelete = async (id) => {
   if( await dispatch(deleteInstructor(id)))
    refreshTable();
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
            onClick={() => { setcurrentInstructor({ id: params.row.id, firstName: params.row.firstName, lastName: params.row.lastName, phone: params.row.phone, email: params.row.email, city: params.row.city,sector:params.row.sector }); setOpenEdit(true); }}
          >
            ערוך
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => { setcurrentInstructor({ id: params.row.id, firstName: params.row.firstName, lastName: params.row.lastName, phone: params.row.phone, email: params.row.email, city: params.row.city ,sector:params.row.sector}); setDeleteOpen(true); }}
          >
            מחק
          </Button>
        </Box>
      ),
    },
    { field: 'id', headerName: 'קוד מדריך', width: 120 },
    { field: 'firstName', headerName: 'שם פרטי', width: 120 },
    { field: 'lastName', headerName: 'שם משפחה', width: 90 },
    { field: 'phone', headerName: 'טלפון', width: 100 },
    { field: 'email', headerName: 'כתובת מייל', width: 150 ,type: 'email' },
    { field: 'city', headerName: 'עיר', width: 100 },
    { field: 'sector', headerName: 'מגזר', width: 120 },

  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      < div style={{ direction: 'rtl' }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }} >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A' }}>
            ניהול מדריכים
          </Typography>

          {/* שדה חיפוש למדריכים */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="חפש מדריך לפי שם, ת״ז, טלפון, אימייל או עיר..."
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
              נמצאו {filteredInstructors.length} תוצאות עבור "{searchTerm}"
            </Typography>
          )}

          {filteredInstructors.length > 0 && (
            <DataGrid
              rows={filteredInstructors.filter(row => row?.id != null && row?.id !== '')}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={5}
              rowsPerPageOptions={[10]}
              sx={{
                boxShadow: 5,
                borderRadius: '10px',
                '& .MuiDataGrid-columnHeader': {
                  // backgroundColor: '#93C5FD',
                },
              }}
            />
          )}

          {/* הודעה כאשר אין תוצאות */}
          {searchTerm && filteredInstructors.length === 0 && (
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

        {/* כפתור ודיאלוג הוספת מדריך חדש */}
        <Button
          onClick={() => { setnewInstructor({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' }); setOpen(true); }}
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
          הוסף מדריך חדש
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
              textAlign: 'center',
            },
          }}
        >
          {/*  הוספת מדריך */}
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: '#1E3A8A' }}>
                     הוסף מדריך
          </DialogTitle>
          <DialogContent  >
            <br />
            <TextField 
              fullWidth
              label="תעודת זהות"
              onChange={(e) => setnewInstructor({ ...newInstructor, id: e.target.value })}
            sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="שם פרטי"
              onChange={(e) => setnewInstructor({ ...newInstructor, firstName: e.target.value })}
              sx={{ mb: 2 }}
            />
             
            <TextField
              fullWidth
              label="שם משפחה"
              onChange={(e) => setnewInstructor({ ...newInstructor, lastName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="טלפון"
              onChange={(e) => setnewInstructor({ ...newInstructor, phone: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="עיר"
              onChange={(e) => setnewInstructor({ ...newInstructor, city: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type='email'
              label="אימייל"
              onChange={(e) => setnewInstructor({ ...newInstructor, email: e.target.value })}
              sx={{ mb: 2 }}
            />
             <TextField
              fullWidth
              label="מגזר"
              onChange={(e) => setnewInstructor({ ...newInstructor, sector: e.target.value })}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions >
            <Button onClick={() => setOpen(false)} color="error" variant="outlined">
              ביטול
            </Button>
            <Button className='saveIcon' onClick={() => handleAdd()} color="primary" variant="contained">
              הוסף מדריך
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
              ?  האם אתה בטוח שברצונך למחוק את המדריך   {currentInstructor.firstName} {currentInstructor.lastName}
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
                backgroundColor: '#D32F2F',
                '&:hover': { backgroundColor: '#F44336' },
              }}
            >
              כן, מחק
            </Button>
          </DialogActions>
        </Dialog>
        {/* עריכת מדריך*/}
        <Dialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
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
          {/*  עדכון מדריך */}
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: '#1E3A8A' }}>
            עדכן פרטי מדריך
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
              label="אימייל"
              value={currentInstructor.email}
              onChange={(e) => setcurrentInstructor({ ...currentInstructor, email: e.target.value })}
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
            label="מגזר"
            value={currentInstructor.sector}
            onChange={(e) => setcurrentInstructor({ ...currentInstructor, sector: e.target.value })}
            sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)} color="error" variant="outlined">
              ביטול
            </Button>
            <Button onClick={() => handleEdit(currentInstructor)} color="primary" variant="contained">
              עדכן פרטי מדריך
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </motion.div>
  );
}
