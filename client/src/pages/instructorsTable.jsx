// import React, { useEffect, useState } from 'react';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography, InputAdornment } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import { Add, Edit, Delete, IntegrationInstructions, Search as SearchIcon } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchInstructors } from '../store/instructor/instructorGetAllThunk';
// import { deleteInstructor } from '../store/instructor/instuctorDeleteThunk';
// import { addInstructor } from '../store/instructor/instructorAddThunk';
// import { editInstructor } from '../store/instructor/instructorEditThunk';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import CloseIcon from '@mui/icons-material/Close';
// import './customDialog.css';
// import BadgeIcon from '@mui/icons-material/Badge';
// import PersonIcon from '@mui/icons-material/Person';
// import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
// import EmailIcon from '@mui/icons-material/Email';
// import LocationCityIcon from '@mui/icons-material/LocationCity';
// // פונקציות גישה לשרת


// const updateInstructor = async (instructor) => {
//   try {
//     const response = await axios.put(`https://localhost:5248/api/instructor/Update/${instructor.id}`, instructor);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating instructor:', error);
//   }
// };


// export default function InstructorsTable() {
//   const instructors = useSelector((state) => state.instructors.instructors);
//   const [open, setOpen] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [currentInstructor, setcurrentInstructor] = useState({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '',sector:'' });
//   const [newInstructor, setnewInstructor] = useState({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '',sector:'' });
//   const [loading, setLoading] = useState(true);
  
//   // הוספת state לחיפוש
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredInstructors, setFilteredInstructors] = useState([]);
  
//   const dispatch = useDispatch();

//   // פונקציה לחיפוש חכם למדריכים
//   const smartSearchInstructors = (instructors, searchTerm) => {
//     if (!searchTerm.trim()) return instructors;
    
//     const term = searchTerm.toLowerCase().trim();
    
//     return instructors.filter(instructor => {
//       // חיפוש לפי שם פרטי
//       const firstNameMatch = instructor.firstName?.toLowerCase().includes(term);
      
//       // חיפוש לפי שם משפחה
//       const lastNameMatch = instructor.lastName?.toLowerCase().includes(term);
      
//       // חיפוש לפי שם מלא (שם פרטי + משפחה)
//       const fullNameMatch = `${instructor.firstName} ${instructor.lastName}`.toLowerCase().includes(term);
      
//       // חיפוש לפי ת"ז (חלקי או מלא)
//       const idMatch = instructor.id?.toString().includes(term);
      
//       // חיפוש לפי טלפון (חלקי או מלא)
//       const phoneMatch = instructor.phone?.toString().includes(term);
      
//       // חיפוש לפי עיר
//       const cityMatch = instructor.city?.toLowerCase().includes(term);
      
//       // חיפוש לפי אימייל
//       const emailMatch = instructor.email?.toLowerCase().includes(term);
      
//       // חיפוש לפי מגזר
//       const sectorMatch = instructor.sector?.toLowerCase().includes(term);
      
//       return firstNameMatch || lastNameMatch || fullNameMatch || idMatch || phoneMatch || cityMatch || emailMatch || sectorMatch;
//     });
//   };

//   useEffect(() => {
//     const loadInstructors = async () => {
//       await dispatch(fetchInstructors());
//       setLoading(false);
//     };
//     loadInstructors();
//   }, [dispatch]);

//   // עדכון הרשימה המסוננת כאשר משתנה החיפוש או רשימת המדריכים
//   useEffect(() => {
//     const filtered = smartSearchInstructors(instructors, searchTerm);
//     setFilteredInstructors(filtered);
//   }, [instructors, searchTerm]);

//   const handleSave = async () => {
//     const newinstructor = { firstName: currentInstructor.firstName, lastName: currentInstructor.lastName, phone: currentInstructor.phone, email: currentInstructor.email, city: currentInstructor.city ,sector:currentInstructor.sector};
//     const addedinstructor = await addInstructor(newinstructor);
//     setInstructors([...instructors, addedinstructor]);
//     setOpen(false);
//     setcurrentInstructor({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '',sector:'' });
//   };

//   const handleEdit = async (instructor) => {
//     setcurrentInstructor(instructor);
//     await dispatch(editInstructor(instructor));
//     setOpenEdit(false);
//     refreshTable();
//   };

//   const handleAdd = async () => {
//     debugger
//     await dispatch(addInstructor(newInstructor));
//     refreshTable();
//     setOpen(false);
//     setnewInstructor({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' ,sector:''});
//   };

//   const refreshTable = async () => {
//     await dispatch(fetchInstructors());
//     setTimeout(() => {
//       const updated = instructors;
//       const invalidRows = updated.filter(row => !row.id);
//       console.log('שורות ללא מזהה:', invalidRows);
//     }, 100);
//   };

//   const handleDelete = async (id) => {
//    if( await dispatch(deleteInstructor(id)))
//     refreshTable();
//   };

//   const columns = [
//     {
//       field: 'actions',
//       headerName: 'פעולות',
//       width: 200,
//       renderCell: (params) => (
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Button
//             variant="outlined"
//             color="primary"
//             startIcon={<Edit />}
//             onClick={() => { setcurrentInstructor({ id: params.row.id, firstName: params.row.firstName, lastName: params.row.lastName, phone: params.row.phone, email: params.row.email, city: params.row.city,sector:params.row.sector }); setOpenEdit(true); }}
//           >
//             ערוך
//           </Button>
//           <Button
//             variant="outlined"
//             color="error"
//             startIcon={<Delete />}
//             onClick={() => { setcurrentInstructor({ id: params.row.id, firstName: params.row.firstName, lastName: params.row.lastName, phone: params.row.phone, email: params.row.email, city: params.row.city ,sector:params.row.sector}); setDeleteOpen(true); }}
//           >
//             מחק
//           </Button>
//         </Box>
//       ),
//     },
//     { field: 'id', headerName: 'קוד מדריך', width: 120 },
//     { field: 'firstName', headerName: 'שם פרטי', width: 120 },
//     { field: 'lastName', headerName: 'שם משפחה', width: 90 },
//     { field: 'phone', headerName: 'טלפון', width: 100 },
//     { field: 'email', headerName: 'כתובת מייל', width: 150 ,type: 'email' },
//     { field: 'city', headerName: 'עיר', width: 100 },
//     { field: 'sector', headerName: 'מגזר', width: 120 },

//   ];

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//       < div style={{ direction: 'rtl' }}>
//         <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }} >
//           <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A' }}>
//             ניהול מדריכים
//           </Typography>

//           {/* שדה חיפוש למדריכים */}
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="חפש מדריך לפי שם, ת״ז, טלפון, אימייל או עיר..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: '#1E3A8A' }} />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '12px',
//                 backgroundColor: '#F8FAFC',
//                 '&:hover fieldset': {
//                   borderColor: '#3B82F6',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#1E3A8A',
//                 },
//               },
//             }}
//           />

//           {/* הצגת מספר התוצאות */}
//           {searchTerm && (
//             <Typography variant="body2" sx={{ color: '#64748B' }}>
//               נמצאו {filteredInstructors.length} תוצאות עבור "{searchTerm}"
//             </Typography>
//           )}

//           {filteredInstructors.length > 0 && (
//             <DataGrid
//               rows={filteredInstructors.filter(row => row?.id != null && row?.id !== '')}
//               columns={columns}
//               getRowId={(row) => row.id}
//               pageSize={5}
//               rowsPerPageOptions={[10]}
//               sx={{
//                 boxShadow: 5,
//                 borderRadius: '10px',
//                 '& .MuiDataGrid-columnHeader': {
//                   // backgroundColor: '#93C5FD',
//                 },
//               }}
//             />
//           )}

//           {/* הודעה כאשר אין תוצאות */}
//           {searchTerm && filteredInstructors.length === 0 && (
//             <Box sx={{ textAlign: 'center', py: 4 }}>
//               <Typography variant="h6" color="text.secondary">
//                 לא נמצאו תוצאות עבור "{searchTerm}"
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                 נסה לחפש עם מילות מפתח אחרות
//               </Typography>
//             </Box>
//           )}
//         </Box>

//         {/* כפתור ודיאלוג הוספת מדריך חדש */}
//         <Button
//           onClick={() => { setnewInstructor({ id: null, firstName: '', lastName: '', phone: null, email: '', city: '' }); setOpen(true); }}
//           variant="contained"
//           color="primary"
//           size="large"
//         sx={{
//           borderRadius: '20px',
//           fontSize: '18px',
//           marginTop: '20px',
//           padding: '10px 20px',
//           width: '100%',
//         }}
//         >
//           הוסף מדריך חדש
//         </Button>
//         <Dialog
//           open={open}
//           onClose={() => setOpen(false)}
//           component={motion.div}
//           initial={{ scale: 0.8 }}
//           animate={{ scale: 1 }}
//           sx={{
//             '& .MuiDialog-paper': {
//               borderRadius: 12,
//               padding: 3,
//               boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//               textAlign: 'center',
//             },
//           }}
//         >
//           {/*  הוספת מדריך */}
//           <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: '#1E3A8A' }}>
//                      הוסף מדריך
//           </DialogTitle>
//           <DialogContent  >
//             <br />
//             <TextField 
//               fullWidth
//               label="תעודת זהות"
//               onChange={(e) => setnewInstructor({ ...newInstructor, id: e.target.value })}
//             sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               label="שם פרטי"
//               onChange={(e) => setnewInstructor({ ...newInstructor, firstName: e.target.value })}
//               sx={{ mb: 2 }}
//             />
             
//             <TextField
//               fullWidth
//               label="שם משפחה"
//               onChange={(e) => setnewInstructor({ ...newInstructor, lastName: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               label="טלפון"
//               onChange={(e) => setnewInstructor({ ...newInstructor, phone: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               label="עיר"
//               onChange={(e) => setnewInstructor({ ...newInstructor, city: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               type='email'
//               label="אימייל"
//               onChange={(e) => setnewInstructor({ ...newInstructor, email: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//              <TextField
//               fullWidth
//               label="מגזר"
//               onChange={(e) => setnewInstructor({ ...newInstructor, sector: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//           </DialogContent>
//           <DialogActions >
//             <Button onClick={() => setOpen(false)} color="error" variant="outlined">
//               ביטול
//             </Button>
//             <Button className='saveIcon' onClick={() => handleAdd()} color="primary" variant="contained">
//               הוסף מדריך
//             </Button>
//           </DialogActions>
//         </Dialog>
//         {/*דיאלוג מחיקת מדריך */}
//         <Dialog
//           open={deleteOpen}
//           onClose={() => setDeleteOpen(false)}
//           sx={{
//             '& .MuiDialog-paper': {
//               borderRadius: 12,
//               padding: 3,
//               backgroundColor: '#F0F4FF', // רקע כחול בהיר
//               boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//             },
//           }}
//         >
//           <DialogTitle sx={{ color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center' }}>
//             מחיקת מדריך
//           </DialogTitle>
//           <DialogContent>
//             <Typography variant="body1" sx={{ color: '#333' }}>
//               ?  האם אתה בטוח שברצונך למחוק את המדריך   {currentInstructor.firstName} {currentInstructor.lastName}
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDeleteOpen(false)} color="error" variant="outlined">
//               לא
//             </Button>
//             <Button
//               onClick={() => { handleDelete(currentInstructor.id); setDeleteOpen(false) }}
//               color="primary"
//               variant="contained"
//               sx={{
//                 backgroundColor: '#D32F2F',
//                 '&:hover': { backgroundColor: '#F44336' },
//               }}
//             >
//               כן, מחק
//             </Button>
//           </DialogActions>
//         </Dialog>
//         {/* עריכת מדריך*/}
//         <Dialog
//           open={openEdit}
//           onClose={() => setOpenEdit(false)}
//           component={motion.div}
//           initial={{ scale: 0.8 }}
//           animate={{ scale: 1 }}
//           sx={{
//             '& .MuiDialog-paper': {
//               borderRadius: 12,
//               padding: 3,
//               boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//             },
//           }}
//         >
//           {/*  עדכון מדריך */}
//           <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, color: '#1E3A8A' }}>
//             עדכן פרטי מדריך
//           </DialogTitle>
//           <DialogContent>
//             <br />
//             <TextField
//               fullWidth
//               label="תעודת זהות"
//               value={currentInstructor.id}
//               onChange={(e) => setcurrentInstructor({ ...currentInstructor, id: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               label="שם פרטי"
//               value={currentInstructor.firstName}
//               onChange={(e) => setcurrentInstructor({ ...currentInstructor, firstName: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               label="שם משפחה"
//               value={currentInstructor.lastName}
//               onChange={(e) => setcurrentInstructor({ ...currentInstructor, lastName: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               label="טלפון"
//               value={currentInstructor.phone}
//               onChange={(e) => setcurrentInstructor({ ...currentInstructor, phone: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               label="אימייל"
//               value={currentInstructor.email}
//               onChange={(e) => setcurrentInstructor({ ...currentInstructor, email: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               label="עיר"
//               value={currentInstructor.city}
//               onChange={(e) => setcurrentInstructor({ ...currentInstructor, city: e.target.value })}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//             fullWidth
//             label="מגזר"
//             value={currentInstructor.sector}
//             onChange={(e) => setcurrentInstructor({ ...currentInstructor, sector: e.target.value })}
//             sx={{ mb: 2 }}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenEdit(false)} color="error" variant="outlined">
//               ביטול
//             </Button>
//             <Button onClick={() => handleEdit(currentInstructor)} color="primary" variant="contained">
//               עדכן פרטי מדריך
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     </motion.div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { 
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
  Box, Typography, InputAdornment, Pagination, FormControl, InputLabel, 
  Select, MenuItem, CircularProgress, Skeleton, Table, TableContainer, 
  Paper, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import { 
  Add, Edit, Delete, Search as SearchIcon, PersonAdd, Email, 
  Phone, LocationCity, Badge, Person
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructors } from '../store/instructor/instructorGetAllThunk';
import { deleteInstructor } from '../store/instructor/instuctorDeleteThunk';
import { addInstructor } from '../store/instructor/instructorAddThunk';
import { editInstructor } from '../store/instructor/instructorEditThunk';
import './styles/tableStyles.css';

// קומפוננטת Loading Skeleton למדריכים
const InstructorLoadingSkeleton = () => (
  <TableContainer component={Paper} className="advanced-table loading-skeleton">
    <Table>
      <TableHead className="table-head">
        <TableRow>
          <TableCell className="table-head-cell">פעולות</TableCell>
          <TableCell className="table-head-cell">קוד מדריך</TableCell>
          <TableCell className="table-head-cell">שם פרטי</TableCell>
          <TableCell className="table-head-cell">שם משפחה</TableCell>
          <TableCell className="table-head-cell">טלפון</TableCell>
          <TableCell className="table-head-cell">אימייל</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index} className="skeleton-row">
            <TableCell><Skeleton variant="rectangular" width={180} height={30} sx={{ borderRadius: '8px' }} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
            <TableCell><Skeleton variant="text" width={120} /></TableCell>
            <TableCell><Skeleton variant="text" width={90} /></TableCell>
            <TableCell><Skeleton variant="text" width={150} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// קומפוננטת Empty State למדריכים
const InstructorEmptyState = ({ searchTerm }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="empty-state"
  >
    <Person className="empty-state-icon" />
    <Typography className="empty-state-title">
      {searchTerm ? `לא נמצאו מדריכים עבור "${searchTerm}"` : 'אין מדריכים להצגה'}
    </Typography>
    <Typography className="empty-state-subtitle">
      {searchTerm ? 'נסה לחפש עם מילות מפתח אחרות' : 'הוסף מדריכים חדשים כדי להתחיל'}
    </Typography>
  </motion.div>
);

export default function InstructorsTable() {
  const instructors = useSelector((state) => state.instructors.instructors);
  const loading = useSelector((state) => state.instructors.loading);
  const error = useSelector((state) => state.instructors.error);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState({ 
    id: null, firstName: '', lastName: '', phone: null, email: '', city: '', sector: '' 
  });
  const [newInstructor, setNewInstructor] = useState({ 
    id: null, firstName: '', lastName: '', phone: null, email: '', city: '', sector: '' 
  });
  
  // חיפוש ו-pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedInstructors, setPaginatedInstructors] = useState([]);
  
  const dispatch = useDispatch();

  // פונקציה לחיפוש חכם למדריכים
  const smartSearchInstructors = (instructors, searchTerm) => {
    if (!searchTerm.trim()) return instructors;
    const term = searchTerm.toLowerCase().trim();
    return instructors.filter(instructor => {
      const firstNameMatch = instructor.firstName?.toLowerCase().includes(term);
      const lastNameMatch = instructor.lastName?.toLowerCase().includes(term);
      const fullNameMatch = `${instructor.firstName} ${instructor.lastName}`.toLowerCase().includes(term);
      const idMatch = instructor.id?.toString().includes(term);
      const phoneMatch = instructor.phone?.toString().includes(term);
      const cityMatch = instructor.city?.toLowerCase().includes(term);
      const emailMatch = instructor.email?.toLowerCase().includes(term);
      const sectorMatch = instructor.sector?.toLowerCase().includes(term);
      return firstNameMatch || lastNameMatch || fullNameMatch || idMatch || phoneMatch || cityMatch || emailMatch || sectorMatch;
    });
  };

  // טעינת נתונים ראשונית
  useEffect(() => {
    dispatch(fetchInstructors());
  }, [dispatch]);

  // עדכון הרשימה המסוננת
  useEffect(() => {
    const filtered = smartSearchInstructors(instructors, searchTerm);
    setFilteredInstructors(filtered);
    setCurrentPage(1);
  }, [instructors, searchTerm]);

  // עדכון pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filteredInstructors.slice(startIndex, endIndex);
    setPaginatedInstructors(paginated);
    setTotalPages(Math.ceil(filteredInstructors.length / pageSize));
  }, [filteredInstructors, currentPage, pageSize]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const refreshTable = async () => {
    await dispatch(fetchInstructors());
  };

  const handleAdd = async () => {
    await dispatch(addInstructor(newInstructor));
    refreshTable();
    setOpen(false);
    setNewInstructor({ 
      id: null, firstName: '', lastName: '', phone: null, email: '', city: '', sector: '' 
    });
  };

  const handleEdit = async () => {
    await dispatch(editInstructor(currentInstructor));
    setOpenEdit(false);
    refreshTable();
  };

  const handleDelete = async (id) => {
    if (await dispatch(deleteInstructor(id))) {
      refreshTable();
    }
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
             ניהול מדריכים
          </Typography>
          <Typography className="table-subtitle">
            נהל את כל המדריכים במערכת בקלות ויעילות
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
            placeholder="🔍 חפש מדריך לפי שם, ת״ז, טלפון, אימייל או עיר..."
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
              📊 מציג {paginatedInstructors.length} מתוך {filteredInstructors.length} מדריכים
              {searchTerm && ` (מסונן מתוך ${instructors.length} סה"כ)`}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" className="page-size-selector">
                <InputLabel>תוצאות בעמוד</InputLabel>
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
              <InstructorLoadingSkeleton />
            </motion.div>
          ) : paginatedInstructors.length > 0 ? (
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
                      <TableCell className="table-head-cell" style={{ width: 200 }}>🎯 פעולות</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 120 }}>🆔 קוד מדריך</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 120 }}>👤 שם פרטי</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 160 }}>👥 שם משפחה</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 110 }}>📞 טלפון</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 180 }}>📧 אימייל</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 100 }}>🏙️ עיר</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 120 }}>🌍 מגזר</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <AnimatePresence>
                      {paginatedInstructors
                        .filter(row => row?.id != null && row?.id !== '')
                        .map((instructor, index) => (
                          <motion.tr
                            key={instructor.id}
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
                            {/* עמודת פעולות */}
                            <TableCell className="table-cell">
                              <Box className="action-buttons">
                                <Button
                                  variant="contained"
                                  startIcon={<Edit />}
                                  size="small"
                                  className="action-button edit"
                                  onClick={() => {
                                    setCurrentInstructor({
                                      id: instructor.id,
                                      firstName: instructor.firstName,
                                      lastName: instructor.lastName,
                                      phone: instructor.phone,
                                      email: instructor.email,
                                      city: instructor.city,
                                      sector: instructor.sector
                                    });
                                    setOpenEdit(true);
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
                                    setCurrentInstructor({
                                      id: instructor.id,
                                      firstName: instructor.firstName,
                                      lastName: instructor.lastName,
                                      phone: instructor.phone,
                                      email: instructor.email,
                                      city: instructor.city,
                                      sector: instructor.sector
                                    });
                                    setDeleteOpen(true);
                                  }}
                                >
                                  מחק
                                </Button>
                              </Box>
                            </TableCell>
                            
                            {/* שאר העמודות */}
                            <TableCell className="table-cell">{instructor.id}</TableCell>
                            <TableCell className="table-cell">{instructor.firstName}</TableCell>
                            <TableCell className="table-cell">{instructor.lastName}</TableCell>
                            <TableCell className="table-cell">{instructor.phone}</TableCell>
                            <TableCell className="table-cell">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ color: '#3B82F6', fontSize: 16 }} />
                                {instructor.email}
                              </Box>
                            </TableCell>
                            <TableCell className="table-cell">{instructor.city}</TableCell>
                            <TableCell className="table-cell">{instructor.sector}</TableCell>
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
              <InstructorEmptyState searchTerm={searchTerm} />
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

        {/* כפתור הוספת מדריך חדש */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            onClick={() => {
              setNewInstructor({ 
                id: null, firstName: '', lastName: '', phone: null, email: '', city: '', sector: '' 
              });
              setOpen(true);
            }}
            variant="contained"
            startIcon={<PersonAdd />}
            size="large"
            className="main-add-button glow-effect"
            fullWidth
          >
            ➕ הוסף מדריך חדש
          </Button>
        </motion.div>

        {/* דיאלוג הוספת מדריך */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          className="advanced-dialog"
        >
          <DialogTitle className="dialog-title">
            ➕ הוסף מדריך חדש
          </DialogTitle>
          <DialogContent className="dialog-content">
            <TextField
              fullWidth
              label="🆔 תעודת זהות"
              value={newInstructor.id || ''}
              onChange={(e) => setNewInstructor({ ...newInstructor, id: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👤 שם פרטי"
              value={newInstructor.firstName}
              onChange={(e) => setNewInstructor({ ...newInstructor, firstName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👥 שם משפחה"
              value={newInstructor.lastName}
              onChange={(e) => setNewInstructor({ ...newInstructor, lastName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📞 טלפון"
              value={newInstructor.phone || ''}
              onChange={(e) => setNewInstructor({ ...newInstructor, phone: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🏙️ עיר"
              value={newInstructor.city}
              onChange={(e) => setNewInstructor({ ...newInstructor, city: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              type="email"
              label="📧 אימייל"
              value={newInstructor.email}
              onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🌍 מגזר"
              value={newInstructor.sector}
              onChange={(e) => setNewInstructor({ ...newInstructor, sector: e.target.value })}
              className="dialog-field"
            />
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => setOpen(false)} className="dialog-button secondary">
              ❌ ביטול
            </Button>
            <Button onClick={handleAdd} className="dialog-button primary">
              ✅ הוסף מדריך
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
            ✏️ ערוך מדריך
          </DialogTitle>
          <DialogContent className="dialog-content">
            <TextField
              fullWidth
              label="🆔 תעודת זהות"
              value={currentInstructor.id || ''}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, id: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👤 שם פרטי"
              value={currentInstructor.firstName}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, firstName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👥 שם משפחה"
              value={currentInstructor.lastName}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, lastName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📞 טלפון"
              value={currentInstructor.phone || ''}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, phone: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📧 אימייל"
              value={currentInstructor.email}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, email: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🏙️ עיר"
              value={currentInstructor.city}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, city: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🌍 מגזר"
              value={currentInstructor.sector}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, sector: e.target.value })}
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
            🗑️ מחיקת מדריך
          </DialogTitle>
          <DialogContent className="dialog-content">
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" sx={{ color: '#374151', mb: 2 }}>
               ? האם אתה בטוח שברצונך למחוק את המדריך
              </Typography>
              <Typography variant="h5" sx={{ color: '#1E3A8A', fontWeight: 'bold' }}>
                {currentInstructor.firstName} {currentInstructor.lastName}
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
                handleDelete(currentInstructor.id); 
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
