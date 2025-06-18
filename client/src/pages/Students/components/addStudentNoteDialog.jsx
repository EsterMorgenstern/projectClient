// import React, { useState } from 'react';
// import {
//     Dialog, DialogTitle, DialogContent, DialogActions,
//     TextField, Button, Box, Typography, MenuItem,
//     FormControlLabel, Switch, Grid, Card, CardContent,
//     Avatar, Chip, Alert
// } from '@mui/material';
// import {
//     Notes as NotesIcon, Person as PersonIcon,
//     Save as SaveIcon, Close as CloseIcon,
//     Warning as WarningIcon, Error as ErrorIcon,
//     CheckCircle as CheckCircleIcon, Info as InfoIcon
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';

// const AddStudentNoteDialog = ({
//     open,
//     onClose,
//     student,
//     onSave,
//     currentUser = { id: '11111111', name: 'מנהל המערכת', role: 'Admin' }
// }) => {
//     const [noteData, setNoteData] = useState({
//         studentId: student?.id || '',
//         authorId: currentUser.id,
//         authorName: currentUser.name,
//         authorRole: currentUser.role,
//         noteContent: '',
//         noteType: 'כללי',
//         priority: 'נמוך',
//         isPrivate: false,
//         isActive: true
//     });

//     const [errors, setErrors] = useState({});

//     const noteTypes = [
//         { value: 'כללי', label: 'כללי', color: '#3b82f6', icon: InfoIcon },
//         { value: 'חיובי', label: 'חיובי', color: '#059669', icon: CheckCircleIcon },
//         { value: 'שלילי', label: 'שלילי', color: '#dc2626', icon: ErrorIcon },
//         { value: 'אזהרה', label: 'אזהרה', color: '#d97706', icon: WarningIcon }
//     ];

//     const priorities = [
//         { value: 'נמוך', label: 'נמוך', color: '#6b7280' },
//         { value: 'בינוני', label: 'בינוני', color: '#d97706' },
//         { value: 'גבוה', label: 'גבוה', color: '#dc2626' }
//     ];

//     const handleInputChange = (field, value) => {
//         setNoteData(prev => ({
//             ...prev,
//             [field]: value
//         }));

//         if (errors[field]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [field]: null
//             }));
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         if (!noteData.noteContent.trim()) {
//             newErrors.noteContent = 'תוכן ההערה הוא שדה חובה';
//         }

//         if (noteData.noteContent.length > 1000) {
//             newErrors.noteContent = 'תוכן ההערה לא יכול להיות ארוך מ-1000 תווים';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSave = () => {
//         if (validateForm()) {
//             const noteToSave = {
//                 ...noteData,
//                 createdDate: new Date().toISOString(),
//                 updatedDate: new Date().toISOString()
//             };

//             onSave(noteToSave);
//             handleClose();
//         }
//     };

//     const handleClose = () => {
//         setNoteData({
//             studentId: student?.id || '',
//             authorId: currentUser.id,
//             authorName: currentUser.name,
//             authorRole: currentUser.role,
//             noteContent: '',
//             noteType: 'כללי',
//             priority: 'נמוך',
//             isPrivate: false,
//             isActive: true
//         });
//         setErrors({});
//         onClose();
//     };

//     const selectedNoteType = noteTypes.find(type => type.value === noteData.noteType);
//     const selectedPriority = priorities.find(priority => priority.value === noteData.priority);

//     return (
//         <Dialog
//             open={open}
//             onClose={handleClose}
//             maxWidth="md"
//             fullWidth
//             sx={{
//                 direction: 'rtl',
//                 '& .MuiDialog-paper': {
//                     borderRadius: '20px',
//                     overflow: 'hidden',
//                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//                     maxHeight: '90vh', // ✅ הגבלת גובה מקסימלי
//                 },
//             }}
//         >
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3 }}
//             >
//                 {/* Header - קומפקטי יותר */}
//                 <DialogTitle
//                     sx={{
//                         background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                         color: 'white',
//                         p: 2, // ✅ פחות padding
//                         position: 'relative',
//                         overflow: 'hidden'
//                     }}
//                 >
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Avatar sx={{
//                             bgcolor: 'rgba(255, 255, 255, 0.2)',
//                             width: 40, // ✅ קטן יותר
//                             height: 40
//                         }}>
//                             <NotesIcon sx={{ fontSize: 24 }} />
//                         </Avatar>
//                         <Box>
//                             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}> {/* ✅ h6 במקום h5 */}
//                                 הוספת הערה חדשה
//                             </Typography>
//                             <Typography variant="body2" sx={{ opacity: 0.9 }}> {/* ✅ קטן יותר */}
//                                 {student?.firstName} {student?.lastName} • ת"ז: {student?.id}
//                             </Typography>
//                         </Box>
//                     </Box>
//                 </DialogTitle>
//                 <br />

//                 {/* Content עם גלילה */}
//                 <DialogContent
//                     sx={{
//                         p: 2, // ✅ פחות padding
//                         bgcolor: '#f8fafc',
//                         maxHeight: '60vh', // ✅ הגבלת גובה
//                         overflow: 'auto' // ✅ גלילה
//                     }}
//                 >
//                     <Grid container spacing={2}> {/* ✅ פחות רווח */}
//                         {/* פרטי המחבר - קומפקטי */}
//                         <Grid item xs={12}>
//                             <Card sx={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
//                                 <CardContent sx={{ p: 1.5 }}> {/* ✅ פחות padding */}
//                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                                         <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32 }}> {/* ✅ קטן יותר */}
//                                             <PersonIcon sx={{ fontSize: 18 }} />
//                                         </Avatar>
//                                         <Box>
//                                             <Typography variant="caption" color="text.secondary">
//                                                 נכתב על ידי
//                                             </Typography>
//                                             <Typography variant="body2" fontWeight="bold"> {/* ✅ קטן יותר */}
//                                                 {noteData.authorName} ({noteData.authorRole})
//                                             </Typography>
//                                         </Box>
//                                     </Box>
//                                 </CardContent>
//                             </Card>
//                         </Grid>

//                         {/* סוג הערה ועדיפות - בשורה אחת */}
//                         <Grid item xs={6}>
//                             <TextField
//                                 select
//                                 fullWidth
//                                 label="סוג הערה"
//                                 value={noteData.noteType}
//                                 onChange={(e) => handleInputChange('noteType', e.target.value)}
//                                 size="small" // ✅ קטן יותר
//                                 sx={{
//                                     '& .MuiOutlinedInput-root': {
//                                         borderRadius: '8px',
//                                         bgcolor: 'white'
//                                     }
//                                 }}
//                             >
//                                 {noteTypes.map((type) => {
//                                     const IconComponent = type.icon;
//                                     return (
//                                         <MenuItem key={type.value} value={type.value}>
//                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                                 <IconComponent sx={{ color: type.color, fontSize: 18 }} />
//                                                 {type.label}
//                                             </Box>
//                                         </MenuItem>
//                                     );
//                                 })}
//                             </TextField>
//                         </Grid>

//                         <Grid item xs={6}>
//                             <TextField
//                                 select
//                                 fullWidth
//                                 label="עדיפות"
//                                 value={noteData.priority}
//                                 onChange={(e) => handleInputChange('priority', e.target.value)}
//                                 size="small" // ✅ קטן יותר
//                                 sx={{
//                                     '& .MuiOutlinedInput-root': {
//                                         borderRadius: '8px',
//                                         bgcolor: 'white'
//                                     }
//                                 }}
//                             >
//                                 {priorities.map((priority) => (
//                                     <MenuItem key={priority.value} value={priority.value}>
//                                         <Chip
//                                             label={priority.label}
//                                             size="small"
//                                             sx={{
//                                                 bgcolor: `${priority.color}20`,
//                                                 color: priority.color,
//                                                 fontWeight: 'bold'
//                                             }}
//                                         />
//                                     </MenuItem>
//                                 ))}
//                             </TextField>
//                         </Grid>

//                         {/* תוכן ההערה */}
//                         <Grid item xs={12}>
//                             <TextField
//                                 fullWidth
//                                 multiline
//                                 rows={4} // ✅ פחות שורות
//                                 label="תוכן ההערה"
//                                 placeholder="כתוב כאן את ההערה..."
//                                 value={noteData.noteContent}
//                                 onChange={(e) => handleInputChange('noteContent', e.target.value)}
//                                 error={!!errors.noteContent}
//                                 helperText={errors.noteContent || `${noteData.noteContent.length}/1000 תווים`}
//                                 sx={{
//                                     '& .MuiOutlinedInput-root': {
//                                         borderRadius: '8px',
//                                         bgcolor: 'white'
//                                     }
//                                 }}
//                             />
//                         </Grid>

//                         {/* הגדרות נוספות - קומפקטי */}
//                         <Grid item xs={12}>
//                             <Card sx={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
//                                 <CardContent sx={{ p: 1.5 }}>
//                                     <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}> {/* ✅ קטן יותר */}
//                                         הגדרות נוספות
//                                     </Typography>

//                                     <Box sx={{ display: 'flex', gap: 2 }}> {/* ✅ בשורה אחת */}
//                                         <FormControlLabel
//                                             control={
//                                                 <Switch
//                                                     checked={noteData.isPrivate}
//                                                     onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
//                                                     color="warning"
//                                                     size="small" // ✅ קטן יותר
//                                                 />
//                                             }
//                                             label={
//                                                 <Typography variant="body2">הערה פרטית</Typography>
//                                             }
//                                         />

//                                         <FormControlLabel
//                                             control={
//                                                 <Switch
//                                                     checked={noteData.isActive}
//                                                     onChange={(e) => handleInputChange('isActive', e.target.checked)}
//                                                     color="success"
//                                                     size="small" // ✅ קטן יותר
//                                                 />
//                                             }
//                                             label={<Typography variant="body2">הערה פעילה</Typography>}
//                                         />
//                                     </Box>
//                                 </CardContent>
//                             </Card>
//                         </Grid>

//                         {/* תצוגה מקדימה - קומפקטית */}
//                         <Grid item xs={12}>
//                             <Card sx={{
//                                 borderRadius: '8px',
//                                 border: `2px solid ${selectedNoteType?.color}20`,
//                                 bgcolor: `${selectedNoteType?.color}05`
//                             }}>
//                                 <CardContent sx={{ p: 1.5 }}>
//                                     <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
//                                         תצוגה מקדימה
//                                     </Typography>

//                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
//                                         <Avatar sx={{ bgcolor: selectedNoteType?.color, width: 28, height: 28 }}>
//                                             {selectedNoteType && <selectedNoteType.icon sx={{ fontSize: 16 }} />}
//                                         </Avatar>
//                                         <Box sx={{ flex: 1 }}>
//                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//                                                 <Typography variant="body2" fontWeight="bold">
//                                                     {noteData.noteType}
//                                                 </Typography>
//                                                 <Chip
//                                                     label={noteData.priority}
//                                                     size="small"
//                                                     sx={{
//                                                         bgcolor: `${selectedPriority?.color}20`,
//                                                         color: selectedPriority?.color,
//                                                         fontWeight: 'bold',
//                                                         fontSize: '0.7rem'
//                                                     }}
//                                                 />
//                                                 {noteData.isPrivate && (
//                                                     <Chip label="פרטי" size="small" color="warning" variant="outlined" />
//                                                 )}
//                                             </Box>
//                                             <Typography variant="caption" color="text.secondary">
//                                                 {new Date().toLocaleDateString('he-IL')} • {noteData.authorName}
//                                             </Typography>
//                                         </Box>
//                                     </Box>

//                                     <Typography variant="body2" sx={{
//                                         p: 1.5,
//                                         bgcolor: 'white',
//                                         borderRadius: '6px',
//                                         border: '1px solid #e2e8f0',
//                                         minHeight: '40px',
//                                         fontStyle: noteData.noteContent ? 'normal' : 'italic',
//                                         color: noteData.noteContent ? 'text.primary' : 'text.secondary'
//                                     }}>
//                                         {noteData.noteContent || 'תוכן ההערה יופיע כאן...'}
//                                     </Typography>
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     </Grid>
//                 </DialogContent>

//                 {/* Actions - קומפקטי */}
//                 <DialogActions sx={{ p: 2, bgcolor: 'white', gap: 1.5 }}>
//                     <Button
//                         onClick={handleClose}
//                         variant="outlined"
//                         startIcon={<CloseIcon />}
//                         size="small" // ✅ קטן יותר
//                         sx={{
//                             borderRadius: '8px',
//                             px: 2,
//                             py: 0.5,
//                             borderColor: '#e2e8f0',
//                             color: '#64748b',
//                             '&:hover': {
//                                 borderColor: '#cbd5e1',
//                                 bgcolor: '#f8fafc'
//                             }
//                         }}
//                     >
//                         ביטול
//                     </Button>

//                     <Button
//                         onClick={handleSave}
//                         variant="contained"
//                         startIcon={<SaveIcon />}
//                         disabled={!noteData.noteContent.trim()}
//                         size="small" // ✅ קטן יותר
//                         sx={{
//                             background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                             borderRadius: '8px',
//                             px: 3,
//                             py: 0.5,
//                             fontWeight: 'bold',
//                             '&:hover': {
//                                 background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
//                             },
//                             '&:disabled': {
//                                 background: '#e2e8f0',
//                                 color: '#94a3b8'
//                             }
//                         }}
//                     >
//                         שמור הערה
//                     </Button>
//                 </DialogActions>
//             </motion.div>
//         </Dialog>
//     );
// };

// export default AddStudentNoteDialog;

// import React, { useState, useEffect ,useMemo} from 'react';
// import {
//     Dialog, DialogTitle, DialogContent, DialogActions,
//     TextField, Button, Box, Typography, MenuItem,
//     FormControlLabel, Switch, Grid, Card, CardContent,
//     Avatar, Chip, Alert
// } from '@mui/material';
// import {
//     Notes as NotesIcon, Person as PersonIcon,
//     Save as SaveIcon, Close as CloseIcon,
//     Warning as WarningIcon, Error as ErrorIcon,
//     CheckCircle as CheckCircleIcon, Info as InfoIcon
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import { useSelector } from 'react-redux';


// const AddStudentNoteDialog = ({
//     open,
//     onClose,
//     student,
//     onSave,
//     editMode = false,
//     noteData = null,
//     currentUser = useSelector(state => state.users.currentUser || {
//   id: 1,
//   name: 'משתמש אורח',
//   role: 'מורה'
// })
// }) => {
//     console.log('AddStudentNoteDialog props:', { student, editMode, noteData, open });

//     const [formData, setFormData] = useState({
//         studentId: student?.id || '',
//         authorId: currentUser.id,
//         authorName: currentUser.name,
//         authorRole: currentUser.role,
//         noteContent: '',
//         noteType: 'כללי',
//         priority: 'נמוך',
//         isPrivate: false,
//         isActive: true
//     });

//     const [errors, setErrors] = useState({});

//     // עדכון הנתונים כאשר נפתח במצב עריכה
// const initialFormData = useMemo(() => {
//     if (editMode && noteData) {
//         return {
//             studentId: noteData.studentId || student?.id || '',
//             authorId: noteData.authorId || currentUser.id,
//             authorName:currentUser.name,
//             authorRole: noteData.authorRole || currentUser.role,
//             noteContent: noteData.noteContent || '',
//             noteType: noteData.noteType || 'כללי',
//             priority: noteData.priority || 'נמוך',
//             isPrivate: noteData.isPrivate || false,
//             isActive: noteData.isActive !== undefined ? noteData.isActive : true
//         };
//     }
//     return {
//         studentId: student?.id || '',
//         authorId: currentUser.id,
//         authorName: currentUser.name,
//         authorRole: currentUser.role,
//         noteContent: '',
//         noteType: 'כללי',
//         priority: 'נמוך',
//         isPrivate: false,
//         isActive: true
//     };
// }, [editMode, noteData, student?.id]);

// useEffect(() => {
//     if (open) {
//         setFormData(initialFormData);
//         setErrors({});
//     }
// }, [open, initialFormData]);

// useEffect(() => {
//   if (currentUser && !existingNote) {
//     setNoteData(prev => ({
//       ...prev,
//       authorName: `${currentUser.FirstName} ${currentUser.LastName}`,
//       authorRole: currentUser.Role || 'משתמש'
//     }));
//   }
// }, [currentUser, existingNote]);


//     const noteTypes = [
//         { value: 'כללי', label: 'כללי', color: '#3b82f6', icon: InfoIcon },
//         { value: 'חיובי', label: 'חיובי', color: '#059669', icon: CheckCircleIcon },
//         { value: 'שלילי', label: 'שלילי', color: '#dc2626', icon: ErrorIcon },
//         { value: 'אזהרה', label: 'אזהרה', color: '#d97706', icon: WarningIcon }
//     ];

//     const priorities = [
//         { value: 'נמוך', label: 'נמוך', color: '#6b7280' },
//         { value: 'בינוני', label: 'בינוני', color: '#d97706' },
//         { value: 'גבוה', label: 'גבוה', color: '#dc2626' }
//     ];

//     const handleInputChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));

//         if (errors[field]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [field]: null
//             }));
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.noteContent.trim()) {
//             newErrors.noteContent = 'תוכן ההערה הוא שדה חובה';
//         }

//         if (formData.noteContent.length > 1000) {
//             newErrors.noteContent = 'תוכן ההערה לא יכול להיות ארוך מ-1000 תווים';
//         }

//         if (!formData.authorName.trim()) {
//             newErrors.authorName = 'שם כותב ההערה הוא שדה חובה';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSave = () => {
//         if (validateForm()) {
//             const noteToSave = {
//                 ...formData,
//                 createdDate: editMode ? noteData.createdDate : new Date().toISOString(),
//                 updatedDate: new Date().toISOString()
//             };

//             onSave(noteToSave);
//             handleClose();
//         }
//     };

//     const handleClose = () => {
//         setFormData({
//             studentId: student?.id || '',
//             authorId: currentUser.id,
//             authorName: currentUser.name,
//             authorRole: currentUser.role,
//             noteContent: '',
//             noteType: 'כללי',
//             priority: 'נמוך',
//             isPrivate: false,
//             isActive: true
//         });
//         setErrors({});
//         onClose();
//     };

//     const selectedNoteType = noteTypes.find(type => type.value === formData.noteType);
//     const selectedPriority = priorities.find(priority => priority.value === formData.priority);

//     return (
//         <Dialog
//             open={open}
//             onClose={handleClose}
//             maxWidth="md"
//             fullWidth
//             sx={{
//                 direction: 'rtl',
//                 '& .MuiDialog-paper': {
//                     borderRadius: '20px',
//                     overflow: 'hidden',
//                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//                     maxHeight: '90vh',
//                 },
//             }}
//         >
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3 }}
//             >
//                 {/* Header */}
//                 <DialogTitle
//                     sx={{
//                         background: editMode 
//                             ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
//                             : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                         color: 'white',
//                         p: 2,
//                         position: 'relative',
//                         overflow: 'hidden'
//                     }}
//                 >
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Avatar sx={{
//                             bgcolor: 'rgba(255, 255, 255, 0.2)',
//                             width: 40,
//                             height: 40
//                         }}>
//                             <NotesIcon sx={{ fontSize: 24 }} />
//                         </Avatar>
//                         <Box>
//                             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
//                                 {editMode ? 'עריכת הערה' : 'הוספת הערה חדשה'}
//                             </Typography>
//                             <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                                 {student?.firstName} {student?.lastName} • ת"ז: {student?.id}
//                             </Typography>
//                         </Box>
//                     </Box>
//                 </DialogTitle>

//                 {/* Content */}
//                <DialogContent sx={{ 
//   p: 4,
//   maxHeight: '70vh', // הגבל גובה
//   overflowY: 'auto', // הוסף גלילה
//   '&::-webkit-scrollbar': {
//     width: '8px'
//   },
//   '&::-webkit-scrollbar-track': {
//     background: '#f1f1f1',
//     borderRadius: '4px'
//   },
//   '&::-webkit-scrollbar-thumb': {
//     background: '#c1c1c1',
//     borderRadius: '4px',
//     '&:hover': {
//       background: '#a8a8a8'
//     }
//   }
// }}>

//                     <Grid container spacing={2}>
//                         {/* פרטי המחבר */}
//                         <Grid item xs={12}>
//                             <Card sx={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
//                                 <CardContent sx={{ p: 1.5 }}>
//                                     <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
//                                         פרטי כותב ההערה
//                                     </Typography>
//                                     <Grid container spacing={2}>
//                                         <Grid item xs={8}>
//                                             <TextField
//                                                 fullWidth
//                                                 label="שם כותב ההערה"
//                                                 value={formData.authorName}
//                                                 onChange={(e) => handleInputChange('authorName', e.target.value)}
//                                                 error={!!errors.authorName}
//                                                 helperText={errors.authorName}
//                                                 size="small"
//                                                 sx={{
//                                                     '& .MuiOutlinedInput-root': {
//                                                         borderRadius: '8px',
//                                                         bgcolor: 'white'
//                                                     }
//                                                 }}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={4}>
//                                             <TextField
//                                                 fullWidth
//                                                 label="תפקיד"
//                                                 value={formData.authorRole}
//                                                 onChange={(e) => handleInputChange('authorRole', e.target.value)}
//                                                 size="small"
//                                                 sx={{
//                                                     '& .MuiOutlinedInput-root': {
//                                                         borderRadius: '8px',
//                                                         bgcolor: 'white'
//                                                     }
//                                                 }}
//                                             />
//                                         </Grid>
//                                     </Grid>
//                                 </CardContent>
//                             </Card>
//                         </Grid>

//                         {/* סוג הערה ועדיפות */}
//                         <Grid item xs={6}>
//                             <TextField
//                                 select
//                                 fullWidth
//                                 label="סוג הערה"
//                                 value={formData.noteType}
//                                 onChange={(e) => handleInputChange('noteType', e.target.value)}
//                                 size="small"
//                                 sx={{
//                                     '& .MuiOutlinedInput-root': {
//                                         borderRadius: '8px',
//                                         bgcolor: 'white'
//                                     }
//                                 }}
//                             >
//                                 {noteTypes.map((type) => {
//                                     const IconComponent = type.icon;
//                                     return (
//                                         <MenuItem key={type.value} value={type.value}>
//                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                                 <IconComponent sx={{ color: type.color, fontSize: 18 }} />
//                                                 {type.label}
//                                             </Box>
//                                         </MenuItem>
//                                     );
//                                 })}
//                             </TextField>
//                         </Grid>

//                         <Grid item xs={6}>
//                             <TextField
//                                 select
//                                 fullWidth
//                                 label="עדיפות"
//                                 value={formData.priority}
//                                 onChange={(e) => handleInputChange('priority', e.target.value)}
//                                 size="small"
//                                 sx={{
//                                     '& .MuiOutlinedInput-root': {
//                                         borderRadius: '8px',
//                                         bgcolor: 'white'
//                                     }
//                                 }}
//                             >
//                                 {priorities.map((priority) => (
//                                     <MenuItem key={priority.value} value={priority.value}>
//                                         <Chip
//                                             label={priority.label}
//                                             size="small"
//                                             sx={{
//                                                 bgcolor: `${priority.color}20`,
//                                                 color: priority.color,
//                                                 fontWeight: 'bold'
//                                             }}
//                                         />
//                                     </MenuItem>
//                                 ))}
//                             </TextField>
//                         </Grid>

//                         {/* תוכן ההערה */}
//                         <Grid item xs={12}>
//                             <TextField
//                                 fullWidth
//                                 multiline
//                                 rows={4}
//                                 label="תוכן ההערה"
//                                 placeholder="כתוב כאן את ההערה..."
//                                 value={formData.noteContent}
//                                 onChange={(e) => handleInputChange('noteContent', e.target.value)}
//                                 error={!!errors.noteContent}
//                                 helperText={errors.noteContent || `${formData.noteContent.length}/1000 תווים`}
//                                 sx={{
//                                     '& .MuiOutlinedInput-root': {
//                                         borderRadius: '8px',
//                                         bgcolor: 'white'
//                                     }
//                                 }}
//                             />
//                         </Grid>

//                         {/* הגדרות נוספות */}
//                         <Grid item xs={12}>
//                             <Card sx={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
//                                 <CardContent sx={{ p: 1.5 }}>
//                                     <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
//                                         הגדרות נוספות
//                                     </Typography>

//                                     <Box sx={{ display: 'flex', gap: 2 }}>
//                                         <FormControlLabel
//                                             control={
//                                                 <Switch
//                                                     checked={formData.isPrivate}
//                                                     onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
//                                                     color="warning"
//                                                     size="small"
//                                                 />
//                                             }
//                                             label={
//                                                 <Typography variant="body2">הערה פרטית</Typography>
//                                             }
//                                         />

//                                         <FormControlLabel
//                                             control={
//                                                 <Switch
//                                                     checked={formData.isActive}
//                                                     onChange={(e) => handleInputChange('isActive', e.target.checked)}
//                                                     color="success"
//                                                     size="small"
//                                                 />
//                                             }
//                                             label={<Typography variant="body2">הערה פעילה</Typography>}
//                                         />
//                                     </Box>
//                                 </CardContent>
//                             </Card>
//                         </Grid>

//                         {/* תצוגה מקדימה */}
//                         <Grid item xs={12}>
//                             <Card sx={{
//                                 borderRadius: '8px',
//                                 border: `2px solid ${selectedNoteType?.color}20`,
//                                 bgcolor: `${selectedNoteType?.color}05`
//                             }}>
//                                 <CardContent sx={{ p: 1.5 }}>
//                                     <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
//                                         תצוגה מקדימה
//                                     </Typography>

//                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
//                                         <Avatar sx={{
//                                             bgcolor: selectedNoteType?.color,
//                                             width: 32,
//                                             height: 32
//                                         }}>
//                                             {selectedNoteType?.icon && (
//                                                 <selectedNoteType.icon sx={{ fontSize: 16 }} />
//                                             )}
//                                         </Avatar>

//                                         <Box sx={{ flex: 1 }}>
//                                             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                                                 {formData.noteType || 'סוג הערה'}
//                                             </Typography>
//                                             <Typography variant="caption" color="text.secondary">
//                                                 {new Date().toLocaleDateString('he-IL')} • {formData.authorName || 'כותב ההערה'}
//                                             </Typography>
//                                         </Box>

//                                         {formData.priority && (
//                                             <Chip
//                                                 label={formData.priority}
//                                                 size="small"
//                                                 sx={{
//                                                     bgcolor: `${selectedPriority?.color}20`,
//                                                     color: selectedPriority?.color,
//                                                     fontWeight: 'bold'
//                                                 }}
//                                             />
//                                         )}
//                                     </Box>

//                                     <Typography variant="body2" sx={{
//                                         p: 1,
//                                         bgcolor: 'white',
//                                         borderRadius: '4px',
//                                         border: '1px solid #e2e8f0',
//                                         minHeight: '40px',
//                                         fontStyle: formData.noteContent ? 'normal' : 'italic',
//                                         color: formData.noteContent ? 'text.primary' : 'text.secondary'
//                                     }}>
//                                         {formData.noteContent || 'תוכן ההערה יופיע כאן...'}
//                                     </Typography>

//                                     {(formData.isPrivate || !formData.isActive) && (
//                                         <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
//                                             {formData.isPrivate && (
//                                                 <Chip
//                                                     label="הערה פרטית"
//                                                     size="small"
//                                                     color="warning"
//                                                     variant="outlined"
//                                                 />
//                                             )}
//                                             {!formData.isActive && (
//                                                 <Chip
//                                                     label="לא פעילה"
//                                                     size="small"
//                                                     color="error"
//                                                     variant="outlined"
//                                                 />
//                                             )}
//                                         </Box>
//                                     )}
//                                 </CardContent>
//                             </Card>
//                         </Grid>

//                         {/* הודעת אזהרה לעריכה */}
//                         {editMode && (
//                             <Grid item xs={12}>
//                                 <Alert severity="info" sx={{ borderRadius: '8px' }}>
//                                     <Typography variant="body2">
//                                         אתה עורך הערה קיימת. השינויים יישמרו עם תאריך העדכון הנוכחי.
//                                     </Typography>
//                                 </Alert>
//                             </Grid>
//                         )}
//                     </Grid>
//                 </DialogContent>

//                 {/* Actions */}
//                 <DialogActions
//                     sx={{
//                         p: 2,
//                         bgcolor: '#f8fafc',
//                         borderTop: '1px solid #e2e8f0',
//                         gap: 1
//                     }}
//                 >
//                     <Button
//                         onClick={handleClose}
//                         variant="outlined"
//                         startIcon={<CloseIcon />}
//                         sx={{
//                             borderRadius: '8px',
//                             borderColor: '#d1d5db',
//                             color: '#6b7280',
//                             '&:hover': {
//                                 borderColor: '#9ca3af',
//                                 bgcolor: '#f9fafb'
//                             }
//                         }}
//                     >
//                         ביטול
//                     </Button>

//                     <Button
//                         onClick={handleSave}
//                         variant="contained"
//                         startIcon={<SaveIcon />}
//                         disabled={!formData.noteContent.trim() || !formData.authorName.trim()}
//                         sx={{
//                             borderRadius: '8px',
//                             background: editMode 
//                                 ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
//                                 : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                             boxShadow: editMode
//                                 ? '0 4px 12px rgba(59, 130, 246, 0.3)'
//                                 : '0 4px 12px rgba(16, 185, 129, 0.3)',
//                             '&:hover': {
//                                 background: editMode
//                                     ? 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)'
//                                     : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
//                             },
//                             '&:disabled': {
//                                 background: '#e5e7eb',
//                                 color: '#9ca3af'
//                             }
//                         }}
//                     >
//                         {editMode ? 'עדכן הערה' : 'שמור הערה'}
//                     </Button>
//                 </DialogActions>
//             </motion.div>
//         </Dialog>
//     );
// };

// export default AddStudentNoteDialog;
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Typography, MenuItem,
    FormControlLabel, Switch, Grid, Card, CardContent,
    Avatar, Chip, Alert
} from '@mui/material';
import {
    Notes as NotesIcon, Person as PersonIcon,
    Save as SaveIcon, Close as CloseIcon,
    Warning as WarningIcon, Error as ErrorIcon,
    CheckCircle as CheckCircleIcon, Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AddStudentNoteDialog = ({
    open,
    onClose,
    student,
    onSave,
    editMode = false,
    noteData = null
}) => {
    console.log('AddStudentNoteDialog props:', { student, editMode, noteData, open });

    // קבל את המשתמש הנוכחי מה-Redux
    const currentUser = useSelector(state => state.users.currentUser);

    const [formData, setFormData] = useState({
        studentId: student?.id || '',
        authorId: '',
        authorName: '',
        authorRole: '',
        noteContent: '',
        noteType: 'כללי',
        priority: 'נמוך',
        isPrivate: false,
        isActive: true
    });

    const [errors, setErrors] = useState({});

    // עדכון הנתונים כאשר נפתח במצב עריכה או כשהמשתמש משתנה
    const initialFormData = useMemo(() => {
        if (editMode && noteData) {
            return {
                studentId: noteData.studentId || student?.id || '',
                authorId: noteData.authorId || (currentUser?.id || ''),
                authorName: noteData.authorName || (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''),
                authorRole: noteData.authorRole || (currentUser?.role || 'משתמש'),
                noteContent: noteData.noteContent || '',
                noteType: noteData.noteType || 'כללי',
                priority: noteData.priority || 'נמוך',
                isPrivate: noteData.isPrivate || false,
                isActive: noteData.isActive !== undefined ? noteData.isActive : true
            };
        }
        return {
            studentId: student?.id || '',
            authorId: currentUser?.id || '',
            authorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
            authorRole: currentUser?.role || 'משתמש',
            noteContent: '',
            noteType: 'כללי',
            priority: 'נמוך',
            isPrivate: false,
            isActive: true
        };
    }, [editMode, noteData, student?.id, currentUser]);

    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
            setErrors({});
        }
    }, [open, initialFormData]);

    // עדכון אוטומטי כשהמשתמש משתנה
    useEffect(() => {
        if (currentUser && !editMode) {
            setFormData(prev => ({
                ...prev,
                authorId: currentUser.id || '',
                authorName: `${currentUser.firstName} ${currentUser.lastName}`,
                authorRole: currentUser.role || 'משתמש'
            }));
        }
    }, [currentUser, editMode]);

    const noteTypes = [
        { value: 'כללי', label: 'כללי', color: '#3b82f6', icon: InfoIcon },
        { value: 'חיובי', label: 'חיובי', color: '#059669', icon: CheckCircleIcon },
        { value: 'שלילי', label: 'שלילי', color: '#dc2626', icon: ErrorIcon },
        { value: 'אזהרה', label: 'אזהרה', color: '#d97706', icon: WarningIcon }
    ];

    const priorities = [
        { value: 'נמוך', label: 'נמוך', color: '#6b7280' },
        { value: 'בינוני', label: 'בינוני', color: '#d97706' },
        { value: 'גבוה', label: 'גבוה', color: '#dc2626' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.noteContent.trim()) {
            newErrors.noteContent = 'תוכן ההערה הוא שדה חובה';
        }

        if (formData.noteContent.length > 1000) {
            newErrors.noteContent = 'תוכן ההערה לא יכול להיות ארוך מ-1000 תווים';
        }

        if (!formData.authorName.trim()) {
            newErrors.authorName = 'שם כותב ההערה הוא שדה חובה';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            const noteToSave = {
                ...formData,
                createdDate: editMode ? noteData.createdDate : new Date().toISOString(),
                updatedDate: new Date().toISOString()
            };

            onSave(noteToSave);
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            studentId: student?.id || '',
            authorId: currentUser?.id || '',
            authorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
            authorRole: currentUser?.role || 'משתמש',
            noteContent: '',
            noteType: 'כללי',
            priority: 'נמוך',
            isPrivate: false,
            isActive: true
        });
        setErrors({});
        onClose();
    };

    const selectedNoteType = noteTypes.find(type => type.value === formData.noteType);
    const selectedPriority = priorities.find(priority => priority.value === formData.priority);

    return (
        <Dialog
        
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            sx={{
                direction: 'rtl',
                '& .MuiDialog-paper': {
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    maxHeight: '90vh',
                },
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header */}
                <DialogTitle
                    sx={{
                        background: editMode 
                            ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        p: 2,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            width: 40,
                            height: 40
                        }}>
                            <NotesIcon sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                {editMode ? 'עריכת הערה' : 'הוספת הערה חדשה'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {student?.firstName} {student?.lastName} • ת"ז: {student?.id}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                 <><br /></> 
                {/* Content עם גלילה */}
                <DialogContent sx={{ 
                    p: 2,
                    bgcolor: '#f8fafc',
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '8px'
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '4px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#c1c1c1',
                        borderRadius: '4px',
                        '&:hover': {
                            background: '#a8a8a8'
                        }
                    }
                }}>
                    <Grid container spacing={2}>
                        {/* פרטי המחבר */}
                        <Grid item xs={12}>
                            <Card sx={{ 
                                borderRadius: '8px', 
                                border: '1px solid #e2e8f0',
                                background: currentUser 
                                    ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' 
                                    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                            }}>
                                <CardContent sx={{ p: 1.5 }}>
                                    <Box sx={{ 
  display: 'flex', 
  alignItems: 'center', 
  varient:'body2',
  gap: 1,
  mb: 1
}}>
                                        <PersonIcon sx={{ fontSize: 18 }} />
                                        פרטי כותב ההערה
                                        {currentUser && (
                                            <Chip 
                                                label="מחובר" 
                                                size="small" 
                                                sx={{ 
                                                    background: '#10b981', 
                                                    color: 'white',
                                                    fontSize: '0.7rem'
                                                }} 
                                            />
                                        )}
                                    </Box>

                                    {!currentUser && (
                                        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                                            💡 התחבר למערכת כדי שהפרטים שלך יוזנו אוטומטית
                                        </Alert>
                                    )}

                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <TextField
                                             id="name-input"
                                                fullWidth
                                                label="שם כותב ההערה"
                                                value={formData.authorName}
                                                onChange={(e) => handleInputChange('authorName', e.target.value)}
                                                error={!!errors.authorName}
                                                helperText={errors.authorName}
                                                size="small"
                                                disabled={!!currentUser}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        bgcolor: currentUser ? '#f0f9ff' : 'white'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                             id="role-input"
                                                fullWidth
                                                label="תפקיד"
                                                value={formData.authorRole}
                                                onChange={(e) => handleInputChange('authorRole', e.target.value)}
                                                size="small"
                                                disabled={!!currentUser}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        bgcolor: currentUser ? '#f0f9ff' : 'white'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* סוג הערה ועדיפות */}
                        <Grid item xs={6}>
                            <TextField
                                id="type-input"
                                select
                                fullWidth
                                label="סוג הערה"
                                value={formData.noteType}
                                onChange={(e) => handleInputChange('noteType', e.target.value)}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white'
                                    }
                                }}
                            >
                                {noteTypes.map((type) => {
                                    const IconComponent = type.icon;
                                    return (
                                        <MenuItem key={type.value} value={type.value}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <IconComponent sx={{ color: type.color, fontSize: 18 }} />
                                                {type.label}
                                            </Box>
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                             id="prioriry-input"
                                select
                                fullWidth
                                label="עדיפות"
                                value={formData.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white'
                                    }
                                }}
                            >
                                {priorities.map((priority) => (
                                    <MenuItem key={priority.value} value={priority.value}>
                                        <Chip
                                            label={priority.label}
                                            size="small"
                                            sx={{
                                                bgcolor: `${priority.color}20`,
                                                color: priority.color,
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* תוכן ההערה */}
                        <Grid item xs={12}>
                            <TextField
                             id="context-input"
                                fullWidth
                                multiline
                                rows={4}
                                label="תוכן ההערה"
                                value={formData.noteContent}
                                onChange={(e) => handleInputChange('noteContent', e.target.value)}
                                error={!!errors.noteContent}
                                helperText={errors.noteContent || `${formData.noteContent.length}/1000 תווים`}
                                placeholder="כתוב כאן את ההערה..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white'
                                    }
                                }}
                            />
                        </Grid>

                        {/* הגדרות נוספות */}
                        <Grid item xs={12}>
                            <Card sx={{ 
                                borderRadius: '8px', 
                                border: '1px solid #e2e8f0',
                                bgcolor: 'white'
                            }}>
                                <CardContent sx={{ p: 1.5 }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#475569' }}>
                                        הגדרות נוספות
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 3,width:'330px' }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.isPrivate}
                                                    onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="הערה פרטית"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.isActive}
                                                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="הערה פעילה"
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* Actions */}
                <DialogActions sx={{ p: 3, gap: 2, flexDirection: 'column' }}>
                    {!currentUser && (
                        <Typography variant="caption" sx={{ 
                            color: '#64748b',
                            textAlign: 'center',
                            fontStyle: 'italic'
                        }}>
                            💡 טיפ: התחבר למערכת כדי שהפרטים שלך יוזנו אוטומטית בהערות עתידיות
                        </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            sx={{
                                borderRadius: '8px',
                                px: 3,
                                py: 1,
                                borderColor: '#d1d5db',
                                color: '#6b7280',
                                '&:hover': {
                                    borderColor: '#9ca3af',
                                    bgcolor: '#f9fafb'
                                }
                            }}
                        >
                            ביטול
                        </Button>

                        <Button
                            onClick={handleSave}
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={!formData.noteContent.trim() || (!currentUser && (!formData.authorName.trim() || !formData.authorRole.trim()))}
                            sx={{
                                borderRadius: '8px',
                                px: 3,
                                py: 1,
                                background: editMode 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                '&:hover': {
                                    background: editMode 
                                        ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
                                        : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                                },
                                '&:disabled': {
                                    background: '#d1d5db',
                                    color: '#9ca3af'
                                }
                            }}
                        >
                            {editMode ? 'עדכן הערה' : 'שמור הערה'}
                        </Button>
                    </Box>
                </DialogActions>
            </motion.div>
        </Dialog>
    );
};

export default AddStudentNoteDialog;
