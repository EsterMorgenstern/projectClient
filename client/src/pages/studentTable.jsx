// import React, { useEffect, useState, useCallback } from 'react';
// import { 
//   Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
//   Box, Typography, MenuItem, TableContainer, Paper, TableHead, TableRow, 
//   TableCell, TableBody, Chip, InputAdornment, Pagination, FormControl, 
//   InputLabel, Select, CircularProgress, Skeleton, Table
// } from '@mui/material';
// import {
//   Add, Edit, Delete, Info as InfoIcon, Check as CheckIcon,
//   Close as CloseIcon, School as CourseIcon, Search as SearchIcon
// } from '@mui/icons-material';
// import { History as HistoryIcon } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import { useDispatch, useSelector } from 'react-redux';
// import StudentAttendanceHistory from './studentAttendanceHistory'
// import { fetchStudents } from '../store/student/studentGetAllThunk';
// import { addStudent } from '../store/student/studentAddThunk';
// import { getgroupStudentByStudentId } from '../store/groupStudent/groupStudentGetByStudentIdThunk';
// import { deleteStudent } from '../store/student/studentDeleteThunk';
// import { editStudent } from '../store/student/studentEditThunk';
// import TermsDialog from './termDialog';
// import { useNavigate } from 'react-router-dom';

// // קומפוננטת Loading Skeleton
// const LoadingSkeleton = () => (
//   <TableContainer component={Paper} sx={{ boxShadow: 5, borderRadius: '10px' }}>
//     <Table>
//       <TableHead>
//         <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
//           <TableCell align="right" sx={{ fontWeight: 'bold' }}>פעולות</TableCell>
//           <TableCell align="right" sx={{ fontWeight: 'bold' }}>קוד תלמיד</TableCell>
//           <TableCell align="right" sx={{ fontWeight: 'bold' }}>שם פרטי</TableCell>
//           <TableCell align="right" sx={{ fontWeight: 'bold' }}>שם משפחה</TableCell>
//           <TableCell align="right" sx={{ fontWeight: 'bold' }}>טלפון</TableCell>
//           <TableCell align="right" sx={{ fontWeight: 'bold' }}>עיר</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {[...Array(5)].map((_, index) => (
//           <TableRow key={index}>
//             <TableCell><Skeleton variant="rectangular" width={200} height={30} /></TableCell>
//             <TableCell><Skeleton variant="text" /></TableCell>
//             <TableCell><Skeleton variant="text" /></TableCell>
//             <TableCell><Skeleton variant="text" /></TableCell>
//             <TableCell><Skeleton variant="text" /></TableCell>
//             <TableCell><Skeleton variant="text" /></TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
// );

// export default function StudentsTable() {
//   // Redux state
//   const students = useSelector((state) => state.students.students);
//   const loading = useSelector((state) => state.students.loading);
//   const error = useSelector((state) => state.students.error);
//   const studentCourses = useSelector((state) => state.groupStudents.groupStudentById);

//   // Local state
//   const [open, setOpen] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [openCoursesDialog, setOpenCoursesDialog] = useState(false);
//   const [currentStudent, setCurrentStudent] = useState({ 
//     id: null, firstName: '', lastName: '', phone: null, city: '', 
//     school: '', healthFund: '', gender: "", sector: "" 
//   });
//   const [newStudent, setnewStudent] = useState({ 
//     id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025', 
//     city: '', school: '', healthFund: '', gender: "", sector: "" 
//   });
//   const [termsOpen, setTermsOpen] = useState(false);
//   const [attendanceHistoryOpen, setAttendanceHistoryOpen] = useState(false);
//   const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalCount, setTotalCount] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   // Search state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [filteredStudents, setFilteredStudents] = useState([]);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const healthFundOptions = [
//     'מכבי',
//     'מאוחדת',
//     'לאומית',
//     'כללית'
//   ];

//   // פונקציה לחיפוש חכם (זמנית - עד שהשרת יתמוך בחיפוש)
//   const smartSearch = (students, searchTerm) => {
//     if (!searchTerm.trim()) return students;

//     const term = searchTerm.toLowerCase().trim();
//     return students.filter(student => {
//       const firstNameMatch = student.firstName?.toLowerCase().includes(term);
//       const lastNameMatch = student.lastName?.toLowerCase().includes(term);
//       const fullNameMatch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(term);
//       const idMatch = student.id?.toString().includes(term);
//       const phoneMatch = student.phone?.toString().includes(term);
//       const cityMatch = student.city?.toLowerCase().includes(term);

//       return firstNameMatch || lastNameMatch || fullNameMatch || idMatch || phoneMatch || cityMatch;
//     });
//   };

//   // טעינה ראשונית
//   useEffect(() => {
//     console.log('🚀 Loading initial data...');
//     dispatch(fetchStudents());
//   }, [dispatch]);

//   // עדכון הרשימה המסוננת כאשר משתנה החיפוש או רשימת התלמידים
//   useEffect(() => {
//     console.log('🔍 Updating filtered students...', { studentsCount: students.length, searchTerm });

//     if (searchTerm.trim()) {
//       setIsSearching(true);
//       const filtered = smartSearch(students, searchTerm);

//       // Pagination על התוצאות המסוננות
//       const startIndex = (currentPage - 1) * pageSize;
//       const endIndex = startIndex + pageSize;
//       const paginatedFiltered = filtered.slice(startIndex, endIndex);

//       setFilteredStudents(paginatedFiltered);
//       setTotalCount(filtered.length);
//       setTotalPages(Math.ceil(filtered.length / pageSize));
//       setIsSearching(false);
//     } else {
//       // אין חיפוש - הצג את כל התלמידים עם pagination
//       const startIndex = (currentPage - 1) * pageSize;
//       const endIndex = startIndex + pageSize;
//       const paginatedStudents = students.slice(startIndex, endIndex);

//       setFilteredStudents(paginatedStudents);
//       setTotalCount(students.length);
//       setTotalPages(Math.ceil(students.length / pageSize));
//     }
//   }, [students, searchTerm, currentPage, pageSize]);

//   // פונקציות עזר
//   const refreshTable = async () => {
//     console.log('🔄 Refreshing table...');
//     await dispatch(fetchStudents());
//   };

//   const handlePageChange = (event, newPage) => {
//     console.log('📄 Page changed to:', newPage);
//     setCurrentPage(newPage);
//   };

//   const handlePageSizeChange = (event) => {
//     const newPageSize = event.target.value;
//     console.log('📊 Page size changed to:', newPageSize);
//     setPageSize(newPageSize);
//     setCurrentPage(1); // חזרה לעמוד הראשון
//   };

//   // פונקציות CRUD
//   const handleAdd = async () => {
//     console.log('➕ Adding student:', newStudent);
//     const result = await dispatch(addStudent(newStudent));
//     if (result.type.endsWith('/fulfilled')) {
//       refreshTable();
//       setnewStudent({ 
//         id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025', 
//         city: '', school: '', healthFund: '', gender: "", sector: "" 
//       });
//       setOpen(false);
//     }
//   };

//   const handleEdit = async () => {
//     console.log('✏️ Editing student:', currentStudent);
//     const result = await dispatch(editStudent(currentStudent));
//     if (result.type.endsWith('/fulfilled')) {
//       setOpenEdit(false);
//       refreshTable();
//     }
//   };

//   const handleDelete = async (id) => {
//     console.log('🗑️ Deleting student:', id);
//     const result = await dispatch(deleteStudent(id));
//     if (result.type.endsWith('/fulfilled')) {
//       refreshTable();
//     }
//   };

//   // Debug logs
//   console.log('🐛 Debug Info:', {
//     studentsCount: students.length,
//     filteredCount: filteredStudents.length,
//     loading,
//     error,
//     currentPage,
//     pageSize,
//     totalCount,
//     totalPages,
//     searchTerm
//   });

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//       <div style={{ direction: 'rtl' }}>
//         <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
//           <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A' }}>
//             ניהול תלמידים
//           </Typography>

//           {/* שדה חיפוש */}
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="חפש תלמיד לפי שם, ת״ז, טלפון או עיר..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1); // חזרה לעמוד הראשון בחיפוש
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: '#1E3A8A' }} />
//                 </InputAdornment>
//               ),
//               endAdornment: isSearching && (
//                 <InputAdornment position="end">
//                   <CircularProgress size={20} />
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

//           {/* בקרות עמוד */}
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <FormControl size="small" sx={{ minWidth: 120 }}>
//                 <InputLabel>רשומות בעמוד</InputLabel>
//                 <Select
//                   value={pageSize}
//                   label="רשומות בעמוד"
//                   onChange={handlePageSizeChange}
//                 >
//                   <MenuItem value={5}>5</MenuItem>
//                   <MenuItem value={10}>10</MenuItem>
//                   <MenuItem value={25}>25</MenuItem>
//                   <MenuItem value={50}>50</MenuItem>
//                 </Select>
//               </FormControl>

//               {searchTerm && (
//                 <Button
//                   variant="outlined"
//                   onClick={() => {
//                     setSearchTerm('');
//                     setCurrentPage(1);
//                   }}
//                   size="small"
//                 >
//                   נקה חיפוש
//                 </Button>
//               )}
//             </Box>

//             <Typography variant="body2" sx={{ color: '#64748B' }}>
//               {searchTerm ? (
//                 `נמצאו ${totalCount} תוצאות עבור "${searchTerm}" | עמוד ${currentPage} מתוך ${totalPages}`
//               ) : (
//                 `סה"כ ${totalCount} תלמידים | עמוד ${currentPage} מתוך ${totalPages}`
//               )}
//             </Typography>
//           </Box>

//           {/* טבלת התלמידים */}
//           {loading ? (
//             <LoadingSkeleton />
//           ) : filteredStudents.length > 0 ? (
//             <>
//               <TableContainer 
//                 component={Paper} 
//                 sx={{ 
//                   boxShadow: 5, 
//                   borderRadius: '10px',
//                   direction: 'rtl'
//                 }}
//               >
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
//                       <TableCell align="right" sx={{ fontWeight: 'bold', width: 300 }}>פעולות</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold', width: 120 }}>קוד תלמיד</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold', width: 90, cursor: 'pointer' }}>שם פרטי</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold', width: 110, cursor: 'pointer' }}>שם משפחה</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold', width: 110 }}>טלפון</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold', width: 100 }}>עיר</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold', width: 90 }}>בית ספר</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold', width: 100 }}>קופת חולים</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold', width: 100 }}>מין</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold', width: 100 }}>מגזר</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredStudents
//                       .filter(row => row?.id != null && row?.id !== '')
//                       .map((student, index) => (
//                         <TableRow
//                           key={student.id}
//                           component={motion.tr}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: index * 0.05 }}
//                           sx={{
//                             '&:nth-of-type(odd)': { bgcolor: 'rgba(59, 130, 246, 0.03)' },
//                             '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' },
//                             transition: 'background-color 0.3s'
//                           }}
//                         >
//                           {/* עמודת פעולות */}
//                           <TableCell align="right">
//                             <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                               <Button
//                                 variant="outlined"
//                                 color="primary"
//                                 startIcon={<Edit />}
//                                 size="small"
//                                 onClick={() => {
//                                   setCurrentStudent({
//                                     id: student.id,
//                                     firstName: student.firstName,
//                                     lastName: student.lastName,
//                                     phone: student.phone,
//                                     city: student.city,
//                                     school: student.school,
//                                     healthFund: student.healthFund,
//                                     gender: student.gender,
//                                     sector: student.sector
//                                   });
//                                   setOpenEdit(true);
//                                 }}
//                               >
//                                 ערוך
//                               </Button>
//                               <Button
//                                 variant="outlined"
//                                 color="error"
//                                 startIcon={<Delete />}
//                                 size="small"
//                                 onClick={() => {
//                                   setCurrentStudent({
//                                     id: student.id,
//                                     firstName: student.firstName,
//                                     lastName: student.lastName,
//                                     phone: student.phone,
//                                     city: student.city,
//                                     school: student.school,
//                                     healthFund: student.healthFund,
//                                     gender: student.gender,
//                                     sector: student.sector
//                                   });
//                                   setDeleteOpen(true);
//                                 }}
//                               >
//                                 מחק
//                               </Button>
//                               <Button
//                                 variant="outlined"
//                                 color="info"
//                                 startIcon={<HistoryIcon />}
//                                 size="small"
//                                 onClick={() => {
//                                   setSelectedStudentForHistory(student);
//                                   setAttendanceHistoryOpen(true);
//                                 }}
//                               >
//                                 נוכחות
//                               </Button>
//                             </Box>
//                           </TableCell>

//                           {/* שאר העמודות */}
//                           <TableCell align="right">{student.id}</TableCell>
//                           <TableCell 
//                             align="right"
//                             sx={{ 
//                               cursor: 'pointer',
//                               '&:hover': { textDecoration: 'underline', color: '#3B82F6' }
//                             }}
//                             onClick={() => {
//                               setOpenCoursesDialog(true);
//                               setCurrentStudent({
//                                 id: student.id,
//                                 firstName: student.firstName,
//                                 lastName: student.lastName,
//                                 phone: student.phone,
//                                 city: student.city,
//                                 school: student.school,
//                                 healthFund: student.healthFund,
//                                 gender: student.gender,
//                                 sector: student.sector
//                               });
//                               dispatch(getgroupStudentByStudentId(student.id));
//                             }}
//                           >
//                             {student.firstName}
//                           </TableCell>
//                           <TableCell 
//                             align="right"
//                             sx={{ 
//                               cursor: 'pointer',
//                               '&:hover': { textDecoration: 'underline', color: '#3B82F6' }
//                             }}
//                             onClick={() => {
//                               setOpenCoursesDialog(true);
//                               setCurrentStudent({
//                                 id: student.id,
//                                 firstName: student.firstName,
//                                 lastName: student.lastName,
//                                 phone: student.phone,
//                                 city: student.city,
//                                 school: student.school,
//                                 healthFund: student.healthFund,
//                                 gender: student.gender,
//                                 sector: student.sector
//                               });
//                               dispatch(getgroupStudentByStudentId(student.id));
//                             }}
//                           >
//                             {student.lastName}
//                           </TableCell>
//                           <TableCell align="right">{student.phone}</TableCell>
//                           <TableCell align="right">{student.city}</TableCell>
//                           <TableCell align="right">{student.school}</TableCell>
//                           <TableCell align="right">{student.healthFund}</TableCell>
//                           <TableCell align="right">{student.gender}</TableCell>
//                           <TableCell align="right">{student.sector}</TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//                   <Pagination
//                     count={totalPages}
//                     page={currentPage}
//                     onChange={handlePageChange}
//                     color="primary"
//                     size="large"
//                     showFirstButton
//                     showLastButton
//                     sx={{
//                       '& .MuiPaginationItem-root': {
//                         fontSize: '1rem',
//                       },
//                     }}
//                   />
//                 </Box>
//               )}
//             </>
//           ) : (
//             <Box sx={{ textAlign: 'center', py: 4 }}>
//               <Typography variant="h6" color="text.secondary">
//                 {searchTerm ? `לא נמצאו תוצאות עבור "${searchTerm}"` : 'אין תלמידים להצגה'}
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                 {searchTerm ? 'נסה לחפש עם מילות מפתח אחרות' : 'הוסף תלמידים חדשים כדי להתחיל'}
//               </Typography>
//             </Box>
//           )}

//           {/* Error display */}
//           {error && (
//             <Box sx={{ textAlign: 'center', py: 2 }}>
//               <Typography variant="body1" color="error">
//                 שגיאה בטעינת הנתונים: {error}
//               </Typography>
//               <Button
//                 variant="outlined"
//                 onClick={refreshTable}
//                 sx={{ mt: 1 }}
//               >
//                 נסה שוב
//               </Button>
//             </Box>
//           )}

//           {/* StudentAttendanceHistory Dialog */}
//           <StudentAttendanceHistory
//             open={attendanceHistoryOpen}
//             onClose={() => setAttendanceHistoryOpen(false)}
//             student={selectedStudentForHistory}
//           />
//         </Box>

//         {/* דיאלוג חוגים */}
//         <Dialog
//           open={openCoursesDialog}
//           onClose={() => setOpenCoursesDialog(false)}
//           maxWidth="lg"
//           fullWidth
//           sx={{
//             direction: 'rtl',
//             textAlign: 'right',
//             '& .MuiDialog-paper': {
//               width: '900px',
//               minWidth: '800px',
//               borderRadius: 12,
//               padding: 0,
//               boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//             },
//           }}
//         >
//           <DialogTitle
//             sx={{
//               bgcolor: '#3B82F6',
//               color: 'white',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               py: 2
//             }}
//           >
//             <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
//               החוגים של {currentStudent.firstName} {currentStudent.lastName}
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<Add />}
//               onClick={() => navigate('/entrollStudent')}
//               sx={{
//                 bgcolor: 'rgba(255, 255, 255, 0.2)',
//                 '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
//               }}
//             >
//               הוסף חוג
//             </Button>
//           </DialogTitle>
//           <DialogContent sx={{ pt: 3, pb: 2 }}>
//             {studentCourses && studentCourses.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <TableContainer component={Paper} sx={{ direction: 'rtl', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: 2 }}>
//                   <Table>
//                     <TableHead>
//                       <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
//                         <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>שם החוג</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>קבוצה</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>סניף</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem', width: '90px', minWidth: '80px' }}>מדריך</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem', width: '130px', minWidth: '100px' }}>יום ושעה</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem', width: '150px', minWidth: '120px' }}>תאריך התחלה</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>סטטוס</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {studentCourses.map((course, index) => (
//                         <TableRow
//                           key={course.groupStudentId || index}
//                           component={motion.tr}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: index * 0.1 }}
//                           sx={{
//                             '&:nth-of-type(odd)': { bgcolor: 'rgba(59, 130, 246, 0.03)' },
//                             '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' },
//                             transition: 'background-color 0.3s'
//                           }}
//                         >
//                           <TableCell align="right" component="th" scope="row">
//                             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
//                               <CourseIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
//                               <Typography sx={{ fontWeight: 'medium' }}>{course.courseName}</Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell align="right">{course.groupName}</TableCell>
//                           <TableCell align="right">{course.branchName}</TableCell>
//                           <TableCell align="right">{course.instructorName}</TableCell>
//                           <TableCell align="right">{course.dayOfWeek} {course.hour}</TableCell>
//                           <TableCell align="right">{course.enrollmentDate}</TableCell>
//                           <TableCell align="right">
//                             <Chip
//                               icon={course.isActive === true ? <CheckIcon /> : <CloseIcon />}
//                               label={course.isActive ? 'פעיל' : 'לא פעיל'}
//                               color={course.isActive === true ? "success" : "error"}
//                               size="small"
//                               variant="outlined"
//                             />
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </motion.div>
//             ) : (
//               <Box
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   py: 5
//                 }}
//               >
//                 <InfoIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
//                 <Typography variant="h6" color="text.secondary" textAlign="center">
//                   אין חוגים רשומים לתלמיד זה
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
//                   ניתן לרשום את התלמיד לחוגים חדשים דרך כפתור הוסף חוג
//                 </Typography>
//               </Box>
//             )}
//           </DialogContent>
//           <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
//             <Button
//               onClick={() => setOpenCoursesDialog(false)}
//               variant="outlined"
//               color="primary"
//               sx={{
//                 borderRadius: '8px',
//                 px: 4,
//                 py: 1,
//                 borderWidth: '2px',
//                 '&:hover': {
//                   borderWidth: '2px',
//                   bgcolor: 'rgba(59, 130, 246, 0.05)'
//                 }
//               }}
//             >
//               סגור
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* כפתור הוספת תלמיד חדש */}
//         <Button
//           onClick={() => setTermsOpen(true)}
//           variant="contained"
//           color="primary"
//           size="large"
//           sx={{
//             borderRadius: '20px',
//             fontSize: '18px',
//             marginTop: '20px',
//             padding: '10px 20px',
//             width: '100%',
//           }}
//         >
//           הוסף תלמיד חדש
//         </Button>

//                 <TermsDialog
//           open={termsOpen}
//           onClose={() => setTermsOpen(false)}
//           onAccept={() => {
//             setTermsOpen(false);
//             setnewStudent({ 
//               id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025', 
//               city: '', school: '', healthFund: '', gender: "", sector: "" 
//             });
//             setOpen(true);
//           }}
//         />

//         {/* דיאלוג הוספת תלמיד */}
//         <Dialog
//           open={open}
//           onClose={() => setOpen(false)}
//           sx={{
//             '& .MuiDialog-paper': {
//               borderRadius: 12,
//               padding: 3,
//               backgroundColor: 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)',
//               boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//             },
//           }}
//         >
//           <DialogTitle sx={{ color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center' }}>
//             הוסף תלמיד
//           </DialogTitle>
//           <DialogContent>
//             <TextField
//               fullWidth
//               label="תעודת זהות"
//               value={newStudent.id || ''}
//               onChange={(e) => setnewStudent({ ...newStudent, id: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="שם פרטי"
//               value={newStudent.firstName}
//               onChange={(e) => setnewStudent({ ...newStudent, firstName: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="שם משפחה"
//               value={newStudent.lastName}
//               onChange={(e) => setnewStudent({ ...newStudent, lastName: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="טלפון"
//               value={newStudent.phone || ''}
//               onChange={(e) => setnewStudent({ ...newStudent, phone: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="תאריך לידה"
//               type="date"
//               value={newStudent.birthDate}
//               onChange={(e) => setnewStudent({ ...newStudent, birthDate: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//             <TextField
//               fullWidth
//               label="עיר"
//               value={newStudent.city}
//               onChange={(e) => setnewStudent({ ...newStudent, city: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="בית ספר"
//               value={newStudent.school}
//               onChange={(e) => setnewStudent({ ...newStudent, school: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               select
//               label="קופת חולים"
//               value={newStudent.healthFund}
//               onChange={(e) =>
//                 setnewStudent({ ...newStudent, healthFund: e.target.value })
//               }
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             >
//               {healthFundOptions.map((option) => (
//                 <MenuItem key={option} value={option}>
//                   {option}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               fullWidth
//               label="מין"
//               value={newStudent.gender}
//               onChange={(e) => setnewStudent({ ...newStudent, gender: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="מגזר"
//               value={newStudent.sector}
//               onChange={(e) => setnewStudent({ ...newStudent, sector: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpen(false)} color="error" variant="outlined">
//               ביטול
//             </Button>
//             <Button
//               onClick={handleAdd}
//               color="primary"
//               variant="contained"
//               sx={{
//                 backgroundColor: '#1E3A8A',
//                 '&:hover': { backgroundColor: '#3B82F6' },
//               }}
//             >
//               הוסף תלמיד
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* דיאלוג עריכה */}
//         <Dialog
//           open={openEdit}
//           onClose={() => setOpenEdit(false)}
//           sx={{
//             '& .MuiDialog-paper': {
//               borderRadius: 12,
//               padding: 3,
//               backgroundColor: 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)',
//               boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//             },
//           }}
//         >
//           <DialogTitle sx={{ color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center' }}>
//             ערוך תלמיד
//           </DialogTitle>
//           <DialogContent>
//             <br />
//             <TextField
//               fullWidth
//               label="תעודת זהות"
//               value={currentStudent.id || ''}
//               onChange={(e) => setCurrentStudent({ ...currentStudent, id: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="שם פרטי"
//               value={currentStudent.firstName}
//               onChange={(e) => setCurrentStudent({ ...currentStudent, firstName: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="שם משפחה"
//               value={currentStudent.lastName}
//               onChange={(e) => setCurrentStudent({ ...currentStudent, lastName: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="טלפון"
//               value={currentStudent.phone || ''}
//               onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="עיר"
//               value={currentStudent.city}
//               onChange={(e) => setCurrentStudent({ ...currentStudent, city: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="בית ספר"
//               value={currentStudent.school}
//               onChange={(e) => setCurrentStudent({ ...currentStudent, school: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               select
//               label="קופת חולים"
//               value={currentStudent.healthFund}
//               onChange={(e) =>
//                 setCurrentStudent({ ...currentStudent, healthFund: e.target.value })
//               }
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             >
//               {healthFundOptions.map((option) => (
//                 <MenuItem key={option} value={option}>
//                   {option}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               fullWidth
//               label="מין"
//               value={currentStudent.gender}
//               onChange={(e) => setCurrentStudent({ ...currentStudent, gender: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//             <TextField
//               fullWidth
//               label="מגזר"
//               value={currentStudent.sector}
//               onChange={(e) => setCurrentStudent({ ...currentStudent, sector: e.target.value })}
//               sx={{ mb: 2, backgroundColor: '#ffffff' }}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenEdit(false)} color="error" variant="outlined">
//               ביטול
//             </Button>
//             <Button
//               onClick={handleEdit}
//               color="primary"
//               variant="contained"
//               sx={{
//                 backgroundColor: '#1E3A8A',
//                 '&:hover': { backgroundColor: '#3B82F6' },
//               }}
//             >
//               שמור תלמיד
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* דיאלוג מחיקת תלמיד */}
//         <Dialog
//           open={deleteOpen}
//           onClose={() => setDeleteOpen(false)}
//           sx={{
//             '& .MuiDialog-paper': {
//               borderRadius: 12,
//               padding: 3,
//               backgroundColor: '#F0F4FF',
//               boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//             },
//           }}
//         >
//           <DialogTitle sx={{ color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center' }}>
//             מחיקת תלמיד
//           </DialogTitle>
//           <DialogContent>
//             <Typography variant="body1" sx={{ color: '#333' }}>
//               האם אתה בטוח שברצונך למחוק את התלמיד {currentStudent.firstName} {currentStudent.lastName}?
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDeleteOpen(false)} color="error" variant="outlined">
//               לא
//             </Button>
//             <Button
//               onClick={() => { 
//                 handleDelete(currentStudent.id); 
//                 setDeleteOpen(false); 
//               }}
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
//       </div>
//     </motion.div>
//   );
// }
import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Box, Typography, MenuItem, TableContainer, Paper, TableHead, TableRow,
  TableCell, TableBody, Chip, InputAdornment, Pagination, FormControl,
  InputLabel, Select, CircularProgress, Skeleton, Table
} from '@mui/material';
import {
  Add, Edit, Delete, Info as InfoIcon, Check as CheckIcon,
  Close as CloseIcon, School as CourseIcon, Search as SearchIcon,
  PersonAdd, Visibility, History as HistoryIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import StudentAttendanceHistory from './studentAttendanceHistory'
import { fetchStudents } from '../store/student/studentGetAllThunk';
import { addStudent } from '../store/student/studentAddThunk';
import { getgroupStudentByStudentId } from '../store/groupStudent/groupStudentGetByStudentIdThunk';
import { deleteStudent } from '../store/student/studentDeleteThunk';
import { editStudent } from '../store/student/studentEditThunk';
import TermsDialog from './termDialog';
import { useNavigate } from 'react-router-dom';
import './styles/tableStyles.css';
import StudentCoursesDialog from './studentCoursesDialog';

// קומפוננטת Loading Skeleton מתקדמת
const LoadingSkeleton = () => (
  <TableContainer component={Paper} className="advanced-table loading-skeleton">
    <Table>
      <TableHead className="table-head">
        <TableRow>
          <TableCell className="table-head-cell">פעולות</TableCell>
          <TableCell className="table-head-cell">קוד תלמיד</TableCell>
          <TableCell className="table-head-cell">שם פרטי</TableCell>
          <TableCell className="table-head-cell">שם משפחה</TableCell>
          <TableCell className="table-head-cell">טלפון</TableCell>
          <TableCell className="table-head-cell">עיר</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index} className="skeleton-row">
            <TableCell><Skeleton variant="rectangular" width={200} height={30} sx={{ borderRadius: '8px' }} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
            <TableCell><Skeleton variant="text" width={120} /></TableCell>
            <TableCell><Skeleton variant="text" width={90} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);


// קומפוננטת Empty State מתקדמת
const EmptyState = ({ searchTerm }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="empty-state"
  >
    <PersonAdd className="empty-state-icon" />
    <Typography className="empty-state-title">
      {searchTerm ? `לא נמצאו תוצאות עבור "${searchTerm}"` : 'אין תלמידים להצגה'}
    </Typography>
    <Typography className="empty-state-subtitle">
      {searchTerm ? 'נסה לחפש עם מילות מפתח אחרות' : 'הוסף תלמידים חדשים כדי להתחיל'}
    </Typography>
  </motion.div>
);

export default function StudentsTable() {
  const students = useSelector((state) => state.students.students);
  const studentCourses = useSelector((state) => state.groupStudents.groupStudentById);
  const loading = useSelector((state) => state.students.loading);
  const error = useSelector((state) => state.students.error);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openCoursesDialog, setOpenCoursesDialog] = useState(false);
  const [selectedStudentForCourses, setSelectedStudentForCourses] = useState(null);
  const [currentStudent, setCurrentStudent] = useState({
    id: null, firstName: '', lastName: '', phone: null, city: '',
    school: '', healthFund: '', gender: "", sector: ""
  });
  const [newStudent, setnewStudent] = useState({
    id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025',
    city: '', school: '', healthFund: '', gender: "", sector: ""
  });
  const [termsOpen, setTermsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [attendanceHistoryOpen, setAttendanceHistoryOpen] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedStudents, setPaginatedStudents] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const healthFundOptions = [
    'מכבי', 'מאוחדת', 'לאומית', 'כללית'
  ];

  // פונקציה לחיפוש חכם
  const smartSearch = (students, searchTerm) => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase().trim();
    return students.filter(student => {
      const firstNameMatch = student.firstName?.toLowerCase().includes(term);
      const lastNameMatch = student.lastName?.toLowerCase().includes(term);
      const fullNameMatch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(term);
      const idMatch = student.id?.toString().includes(term);
      const phoneMatch = student.phone?.toString().includes(term);
      const cityMatch = student.city?.toLowerCase().includes(term);
      return firstNameMatch || lastNameMatch || fullNameMatch || idMatch || phoneMatch || cityMatch;
    });
  };

  // טעינת נתונים ראשונית
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // עדכון הרשימה המסוננת
  useEffect(() => {
    const filtered = smartSearch(students, searchTerm);
    setFilteredStudents(filtered);
    setCurrentPage(1); // איפוס לעמוד הראשון בחיפוש חדש
  }, [students, searchTerm]);

  // עדכון pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filteredStudents.slice(startIndex, endIndex);
    setPaginatedStudents(paginated);
    setTotalPages(Math.ceil(filteredStudents.length / pageSize));
  }, [filteredStudents, currentPage, pageSize]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const refreshTable = async () => {
    await dispatch(fetchStudents());
  };

  const handleAdd = async () => {
    if (await dispatch(addStudent(newStudent))) {
      refreshTable();
      setnewStudent({
        id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025',
        city: '', school: '', healthFund: '', gender: "", sector: ""
      });
    }
    setOpen(false);
  };

  const handleEdit = async () => {
    if (await dispatch(editStudent(currentStudent))) {
      setOpenEdit(false);
      refreshTable();
    }
  };

  const handleDelete = async (id) => {
    if (await dispatch(deleteStudent(id))) {
      refreshTable();
    }
  };

  const handleViewCourses = async (student) => {
    setSelectedStudentForCourses(student);
    setOpenCoursesDialog(true);
    await dispatch(getgroupStudentByStudentId(student.id));
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
            ניהול תלמידים
          </Typography>
          <Typography className="table-subtitle">
            נהל את כל התלמידים במערכת בקלות ויעילות
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
            placeholder="🔍 חפש תלמיד לפי שם, ת״ז, טלפון או עיר..."
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
              📊 מציג {paginatedStudents.length} מתוך {filteredStudents.length} תלמידים
              {searchTerm && ` (מסונן מתוך ${students.length} סה"כ)`}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" className="page-size-selector">
                <InputLabel >תוצאות בעמוד</InputLabel>
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
              <LoadingSkeleton />
            </motion.div>
          ) : paginatedStudents.length > 0 ? (
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
                      <TableCell className="table-head-cell" style={{ width: 280 }}>🎯 פעולות</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 140 }}>🆔 קוד תלמיד</TableCell>
                      <TableCell className="table-head-cell clickable" style={{ width: 140 }}>👤 שם פרטי</TableCell>
                      <TableCell className="table-head-cell clickable" style={{ width: 120 }}>👥 שם משפחה</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 90 }}>📞 טלפון</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 100 }}>🏙️ עיר</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 150 }}>🏫 בית ספר</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 160 }}>🏥 קופת חולים</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 80 }}>⚥ מין</TableCell>
                      <TableCell className="table-head-cell" style={{ width: 100 }}>🌍 מגזר</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <AnimatePresence>
                      {paginatedStudents
                        .filter(row => row?.id != null && row?.id !== '')
                        .map((student, index) => (
                          <motion.tr
                            key={student.id}
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
                                    setCurrentStudent({
                                      id: student.id,
                                      firstName: student.firstName,
                                      lastName: student.lastName,
                                      phone: student.phone,
                                      city: student.city,
                                      school: student.school,
                                      healthFund: student.healthFund,
                                      gender: student.gender,
                                      sector: student.sector
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
                                    setCurrentStudent({
                                      id: student.id,
                                      firstName: student.firstName,
                                      lastName: student.lastName,
                                      phone: student.phone,
                                      city: student.city,
                                      school: student.school,
                                      healthFund: student.healthFund,
                                      gender: student.gender,
                                      sector: student.sector
                                    });
                                    setDeleteOpen(true);
                                  }}
                                >
                                  מחק
                                </Button>
                                <Button
                                  variant="contained"
                                  startIcon={<HistoryIcon />}
                                  size="small"
                                  className="action-button info"
                                  onClick={() => {
                                    setSelectedStudentForHistory(student);
                                    setAttendanceHistoryOpen(true);
                                  }}
                                >
                                  נוכחות
                                </Button>
                              </Box>
                            </TableCell>

                            {/* שאר העמודות */}
                            <TableCell className="table-cell">{student.id}</TableCell>
                            <TableCell
                              className="table-cell clickable"
                              onClick={() => handleViewCourses(student)}
                            >
                              {student.firstName}
                            </TableCell>
                            <TableCell
                              className="table-cell clickable"
                              onClick={() => handleViewCourses(student)}
                            >
                              {student.lastName}
                            </TableCell>
                            <TableCell className="table-cell">{student.phone}</TableCell>
                            <TableCell className="table-cell">{student.city}</TableCell>
                            <TableCell className="table-cell">{student.school}</TableCell>
                            <TableCell className="table-cell">{student.healthFund}</TableCell>
                            <TableCell className="table-cell">{student.gender}</TableCell>
                            <TableCell className="table-cell">{student.sector}</TableCell>
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
              <EmptyState searchTerm={searchTerm} />
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

        {/* כפתור הוספת תלמיד חדש */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            onClick={() => setTermsOpen(true)}
            variant="contained"
            startIcon={<PersonAdd />}
            size="large"
            className="main-add-button glow-effect"
            fullWidth
          >
            ➕ הוסף תלמיד חדש
          </Button>
        </motion.div>

        {/* דיאלוג חוגים */}
        <Dialog
          open={openCoursesDialog}
          onClose={() => setOpenCoursesDialog(false)}
          maxWidth="lg"
          fullWidth
          className="advanced-dialog"
        >
          <DialogTitle className="dialog-title">
            🎓 החוגים של {currentStudent.firstName} {currentStudent.lastName}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/entrollStudent')}
              sx={{
                position: 'absolute',
                left: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              הוסף חוג
            </Button>
          </DialogTitle>
          <DialogContent className="dialog-content">
            {studentCourses.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TableContainer component={Paper} className="advanced-table">
                  <Table>
                    <TableHead className="table-head">
                      <TableRow>
                        <TableCell className="table-head-cell">📚 שם החוג</TableCell>
                        <TableCell className="table-head-cell">👥 קבוצה</TableCell>
                        <TableCell className="table-head-cell">🏢 סניף</TableCell>
                        <TableCell className="table-head-cell">👨‍🏫 מדריך</TableCell>
                        <TableCell className="table-head-cell">📅 יום ושעה</TableCell>
                        <TableCell className="table-head-cell">📆 תאריך התחלה</TableCell>
                        <TableCell className="table-head-cell">✅ סטטוס</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentCourses.map((course, index) => (
                        <motion.tr
                          key={course.groupStudentId || index}
                          component={TableRow}
                          className="table-row"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <TableCell className="table-cell">

                            <CourseIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                            {course.courseName}

                          </TableCell>
                          <TableCell className="table-cell">{course.groupName}</TableCell>
                          <TableCell className="table-cell">{course.branchName}</TableCell>
                          <TableCell className="table-cell">{course.instructorName}</TableCell>
                          <TableCell className="table-cell">{course.dayOfWeek} {course.hour}</TableCell>
                          <TableCell className="table-cell">{course.enrollmentDate}</TableCell>
                          <TableCell className="table-cell">
                            <Chip
                              icon={course.isActive === true ? <CheckIcon /> : <CloseIcon />}
                              label={course.isActive ? 'פעיל' : 'לא פעיל'}
                              className={`status-chip ${course.isActive ? 'active' : 'inactive'}`}
                              size="small"
                            />
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </motion.div>
            ) : (
              <EmptyState searchTerm="" />
            )}
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button
              onClick={() => setOpenCoursesDialog(false)}
              className="dialog-button primary"
            >
              סגור
            </Button>
          </DialogActions>
        </Dialog>

        {/* דיאלוג תנאים */}
        <TermsDialog
          open={termsOpen}
          onClose={() => setTermsOpen(false)}
          onAccept={() => {
            setTermsOpen(false);
            setnewStudent({
              id: null, firstName: '', lastName: '', phone: null, birthDate: '02/03/2025',
              city: '', school: '', healthFund: '', gender: "", sector: ""
            });
            setOpen(true);
          }}
        />

        {/* דיאלוג הוספת תלמיד */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          className="advanced-dialog"
        >
          <DialogTitle className="dialog-title">
            ➕ הוסף תלמיד חדש
          </DialogTitle>
          <DialogContent className="dialog-content">
            <TextField
              fullWidth
              label="🆔 תעודת זהות"
              value={newStudent.id || ''}
              onChange={(e) => setnewStudent({ ...newStudent, id: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👤 שם פרטי"
              value={newStudent.firstName}
              onChange={(e) => setnewStudent({ ...newStudent, firstName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👥 שם משפחה"
              value={newStudent.lastName}
              onChange={(e) => setnewStudent({ ...newStudent, lastName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📞 טלפון"
              value={newStudent.phone || ''}
              onChange={(e) => setnewStudent({ ...newStudent, phone: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📅 תאריך לידה"
              type="date"
              value={newStudent.birthDate}
              onChange={(e) => setnewStudent({ ...newStudent, birthDate: e.target.value })}
              className="dialog-field"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="🏙️ עיר"
              value={newStudent.city}
              onChange={(e) => setnewStudent({ ...newStudent, city: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🏫 בית ספר"
              value={newStudent.school}
              onChange={(e) => setnewStudent({ ...newStudent, school: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              select
              label="🏥 קופת חולים"
              value={newStudent.healthFund}
              onChange={(e) => setnewStudent({ ...newStudent, healthFund: e.target.value })}
              className="dialog-field"
            >
              {healthFundOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="⚥ מין"
              value={newStudent.gender}
              onChange={(e) => setnewStudent({ ...newStudent, gender: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🌍 מגזר"
              value={newStudent.sector}
              onChange={(e) => setnewStudent({ ...newStudent, sector: e.target.value })}
              className="dialog-field"
            />
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => setOpen(false)} className="dialog-button secondary">
              ❌ ביטול
            </Button>
            <Button onClick={handleAdd} className="dialog-button primary">
              ✅ הוסף תלמיד
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
            ✏️ ערוך תלמיד
          </DialogTitle>
          <DialogContent className="dialog-content">
            <TextField
              fullWidth
              label="🆔 תעודת זהות"
              value={currentStudent.id || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, id: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👤 שם פרטי"
              value={currentStudent.firstName}
              onChange={(e) => setCurrentStudent({ ...currentStudent, firstName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👥 שם משפחה"
              value={currentStudent.lastName}
              onChange={(e) => setCurrentStudent({ ...currentStudent, lastName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📞 טלפון"
              value={currentStudent.phone || ''}
              onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🏙️ עיר"
              value={currentStudent.city}
              onChange={(e) => setCurrentStudent({ ...currentStudent, city: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🏫 בית ספר"
              value={currentStudent.school}
              onChange={(e) => setCurrentStudent({ ...currentStudent, school: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              select
              label="🏥 קופת חולים"
              value={currentStudent.healthFund}
              onChange={(e) => setCurrentStudent({ ...currentStudent, healthFund: e.target.value })}
              className="dialog-field"
            >
              {healthFundOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="⚥ מין"
              value={currentStudent.gender}
              onChange={(e) => setCurrentStudent({ ...currentStudent, gender: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🌍 מגזר"
              value={currentStudent.sector}
              onChange={(e) => setCurrentStudent({ ...currentStudent, sector: e.target.value })}
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
            🗑️ מחיקת תלמיד
          </DialogTitle>
          <DialogContent className="dialog-content">
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" sx={{ color: '#374151', mb: 2 }}>
                ? האם אתה בטוח שברצונך למחוק את התלמיד
              </Typography>
              <Typography variant="h5" sx={{ color: '#1E3A8A', fontWeight: 'bold' }}>
                {currentStudent.firstName} {currentStudent.lastName}
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
                handleDelete(currentStudent.id);
                setDeleteOpen(false);
              }}
              className="dialog-button secondary"
            >
              🗑️ כן, מחק
            </Button>
          </DialogActions>
        </Dialog>

        {/* דיאלוג היסטוריית נוכחות */}
        <StudentAttendanceHistory
          open={attendanceHistoryOpen}
          onClose={() => setAttendanceHistoryOpen(false)}
          student={selectedStudentForHistory}
        />
      </div>
    </motion.div>
  );
}