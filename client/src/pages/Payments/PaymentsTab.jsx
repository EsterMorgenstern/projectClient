// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Typography,
//     Card,
//     CardContent,
//     Button,
//     Grid,
//     Alert,
//     Chip,
//     IconButton,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Switch,
//     FormControlLabel,
//     CircularProgress,
//     Snackbar
// } from '@mui/material';

// import {
//     CreditCard as CreditCardIcon,
//     AccountBalance as BankIcon,
//     Add as AddIcon,
//     Edit as EditIcon,
//     Delete as DeleteIcon,
//     Star as StarIcon,
//     Payment as PaymentIcon
// } from '@mui/icons-material';

// import { motion, AnimatePresence } from 'framer-motion';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchPaymentMethods } from '../../store/payments/fetchPaymentMethods';
// import { updatePaymentMethod } from '../../store/payments/paymentMethodsUpdate';
// import { addPaymentMethod } from '../../store/payments/addPaymentMethod';
// import { deletePaymentMethod } from '../../store/payments/paymentMethodsDelete';

// const PaymentsTab = ({ student, embedded = false }) => {
//     const dispatch = useDispatch();
//     const { paymentMethods, loading, error } = useSelector((state) => state.payments);
    
//     const [addDialogOpen, setAddDialogOpen] = useState(false);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [selectedMethod, setSelectedMethod] = useState(null);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    
//     const [formData, setFormData] = useState({
//         methodType: '',
//         lastFourDigits: '',
//         cardType: '',
//         expiryMonth: '',
//         expiryYear: '',
//         bankName: '',
//         accountHolderName: '',
//         isDefault: false
//     });

//     useEffect(() => {
//         if (student?.id) {
//             dispatch(fetchPaymentMethods(student.id));
//         }
//     }, [student?.id, dispatch]);

//     const getMethodIcon = (methodType) => {
//         switch (methodType) {
//             case 'CREDIT_CARD': return <CreditCardIcon />;
//             case 'BANK_TRANSFER': return <BankIcon />;
//             default: return <PaymentIcon />;
//         }
//     };

//     const getMethodText = (methodType) => {
//         switch (methodType) {
//             case 'CREDIT_CARD': return 'כרטיס אשראי';
//             case 'BANK_TRANSFER': return 'העברה בנקאית';
//             case 'CASH': return 'מזומן';
//             case 'CHECK': return 'צ\'ק';
//             default: return methodType;
//         }
//     };

//     const handleAddMethod = () => {
//         setFormData({
//             methodType: '',
//             lastFourDigits: '',
//             cardType: '',
//             expiryMonth: '',
//             expiryYear: '',
//             bankName: '',
//             accountHolderName: '',
//             isDefault: false
//         });
//         setAddDialogOpen(true);
//     };

//     const handleEditMethod = (method) => {
//         setSelectedMethod(method);
//         setFormData({
//             methodType: method.methodType,
//             lastFourDigits: method.lastFourDigits || '',
//             cardType: method.cardType || '',
//             expiryMonth: method.expiryMonth || '',
//             expiryYear: method.expiryYear || '',
//             bankName: method.bankName || '',
//             accountHolderName: method.accountHolderName || '',
//             isDefault: method.isDefault
//         });
//         setEditDialogOpen(true);
//     };

//     const handleSaveMethod = async () => {
//         try {
//             // ולידציה בסיסית
//             if (!formData.methodType) {
//                 setSnackbarMessage('יש לבחור סוג אמצעי תשלום');
//                 setSnackbarSeverity('error');
//                 setSnackbarOpen(true);
//                 return;
//             }

//             if (!formData.accountHolderName.trim()) {
//                 setSnackbarMessage('יש להזין שם בעל החשבון');
//                 setSnackbarSeverity('error');
//                 setSnackbarOpen(true);
//                 return;
//             }

//             // בניית payload בהתאם לסוג אמצעי התשלום
//             const basePayload = {
//                 studentId: student.id,
//                 methodType: formData.methodType,
//                 accountHolderName: formData.accountHolderName.trim(),
//                 isDefault: formData.isDefault || false
//             };

//             // הוספת שדות ספציפיים לכרטיס אשראי בלבד
//             if (formData.methodType === 'CREDIT_CARD') {
//                 // ולידציה לכרטיס אשראי
//                 if (!formData.lastFourDigits || formData.lastFourDigits.length !== 4) {
//                     setSnackbarMessage('יש להזין 4 ספרות אחרונות של הכרטיס');
//                     setSnackbarSeverity('error');
//                     setSnackbarOpen(true);
//                     return;
//                 }

//                 if (!formData.cardType) {
//                     setSnackbarMessage('יש לבחור סוג כרטיס');
//                     setSnackbarSeverity('error');
//                     setSnackbarOpen(true);
//                     return;
//                 }

//                 basePayload.lastFourDigits = formData.lastFourDigits;
//                 basePayload.cardType = formData.cardType;
//                 basePayload.expiryMonth = formData.expiryMonth || null;
//                 basePayload.expiryYear = formData.expiryYear || null;
//             }

//             // הוספת שם בנק להעברה בנקאית בלבד
//             if (formData.methodType === 'BANK_TRANSFER') {
//                 basePayload.bankName = formData.bankName || null;
//             }

//             console.log('🚀 Sending payment method data:', basePayload);

//             if (editDialogOpen) {
//                 const result = await dispatch(updatePaymentMethod({
//                     paymentMethodId: selectedMethod.paymentMethodId,
//                     ...basePayload
//                 }));
                
//                 if (updatePaymentMethod.fulfilled.match(result)) {
//                     setSnackbarMessage('אמצעי התשלום עודכן בהצלחה');
//                     setSnackbarSeverity('success');
//                     setEditDialogOpen(false);
//                 }   console.log('Update failed, trying delete and re-add...');
        
//         try {
//             await dispatch(deletePaymentMethod(selectedMethod.paymentMethodId));
//             const addResult = await dispatch(addPaymentMethod(basePayload));
            
//             if (addPaymentMethod.fulfilled.match(addResult)) {
//                 setSnackbarMessage('אמצעי התשלום עודכן בהצלחה (דרך מחיקה והוספה מחדש)');
//                 setSnackbarSeverity('success');
//                 setEditDialogOpen(false);
//             } else {
//                 throw new Error('גם המחיקה וההוספה מחדש נכשלו');
//             }
//         } catch (fallbackError) {
//             throw new Error(result.payload?.message || result.payload || 'שגיאה בעדכון אמצעי התשלום');
//         }
  

//             } else {
//                 const result = await dispatch(addPaymentMethod(basePayload));
                
//                 if (addPaymentMethod.fulfilled.match(result)) {
//                     setSnackbarMessage('אמצעי התשלום נוסף בהצלחה');
//                     setSnackbarSeverity('success');
//                     setAddDialogOpen(false);
//                 } else {
//                     throw new Error(result.payload?.message || result.payload || 'שגיאה בהוספת אמצעי התשלום');
//                 }
//             }

//             // רענון הנתונים
//             dispatch(fetchPaymentMethods(student.id));
//             setSnackbarOpen(true);

//         } catch (error) {
//             console.error('Error saving payment method:', error);
            
//             // הצגת שגיאה ברורה למשתמש
//             let errorMessage = 'שגיאה בשמירת אמצעי התשלום';
            
//             if (typeof error === 'string') {
//                 errorMessage = error;
//             } else if (error.message) {
//                 errorMessage = error.message;
//             } else if (error.title) {
//                 errorMessage = error.title;
//             }
            
//             setSnackbarMessage(errorMessage);
//             setSnackbarSeverity('error');
//             setSnackbarOpen(true);
//         }
//     };

//     const handleDeleteMethod = async (methodId) => {
//         try {
//             const result = await dispatch(deletePaymentMethod(methodId));
            
//             if (deletePaymentMethod.fulfilled.match(result)) {
//                 setSnackbarMessage('אמצעי התשלום נמחק בהצלחה');
//                 setSnackbarSeverity('success');
//                 dispatch(fetchPaymentMethods(student.id));
//             } else {
//                 throw new Error(result.payload || 'שגיאה במחיקת אמצעי התשלום');
//             }
//         } catch (error) {
//             console.error('Error deleting payment method:', error);
//             setSnackbarMessage('שגיאה במחיקת אמצעי התשלום');
//             setSnackbarSeverity('error');
//         }
//         setSnackbarOpen(true);
//     };

//    const handleSetDefault = async (paymentMethodId) => {
//   try {
//     console.log('🔄 Setting default payment method:', paymentMethodId);
    
//     // מצא את אמצעי התשלום הנוכחי
//     const currentPaymentMethod = paymentMethods.find(pm => pm.paymentMethodId === paymentMethodId);
    
//     if (!currentPaymentMethod) {
//       throw new Error('אמצעי התשלום לא נמצא במערכת');
//     }

//     // צור אובייקט מעודכן עם isDefault = true
//     const updatedPaymentMethod = {
//       ...currentPaymentMethod,
//       isDefault: true
//     };

//     console.log('📤 Sending updated payment method:', updatedPaymentMethod);

//     // שלח עדכון לשרת
//     await dispatch(updatePaymentMethod(updatedPaymentMethod));

//     // עדכן את המצב המקומי - הסר ברירת מחדל מכל האמצעים האחרים
//     const updatedMethods = paymentMethods.map(pm => ({
//       ...pm,
//       isDefault: pm.paymentMethodId === paymentMethodId
//     }));

//     setPaymentMethods(updatedMethods);

//     // הצג הודעת הצלחה
//     setNotification({
//       open: true,
//       message: 'אמצעי התשלום הוגדר כברירת מחדל בהצלחה',
//       severity: 'success'
//     });

//   } catch (error) {
//     console.error('Error setting default payment method:', error);
//     setNotification({
//       open: true,
//       message: 'שגיאה בהגדרת ברירת מחדל: ' + (error.message || 'אנא נסה שנית'),
//       severity: 'error'
//     });
//   }
// };

// // פונקציה לעריכת אמצעי תשלום
// const handleEditPaymentMethod = async () => {
//   if (!editingPaymentMethod.cardNumber || !editingPaymentMethod.cardHolderName) {
//     setNotification({
//       open: true,
//       message: 'נא למלא את כל השדות הנדרשים',
//       severity: 'error'
//     });
//     return;
//   }

//   try {
//     console.log('🔄 Updating payment method:', editingPaymentMethod);

//     // וודא שיש לנו את כל הנתונים הנדרשים
//     const paymentMethodToUpdate = {
//       paymentMethodId: editingPaymentMethod.paymentMethodId,
//       studentId: editingPaymentMethod.studentId,
//       cardNumber: editingPaymentMethod.cardNumber,
//       cardHolderName: editingPaymentMethod.cardHolderName,
//       expiryDate: editingPaymentMethod.expiryDate,
//       cvv: editingPaymentMethod.cvv,
//       isDefault: editingPaymentMethod.isDefault || false,
//       createdAt: editingPaymentMethod.createdAt || new Date().toISOString()
//     };

//     console.log('📤 Sending payment method update:', paymentMethodToUpdate);

//     // שלח עדכון לשרת
//     await dispatch(updatePaymentMethod(paymentMethodToUpdate));

//     // עדכן את המצב המקומי
//     const updatedMethods = paymentMethods.map(pm => 
//       pm.paymentMethodId === paymentMethodToUpdate.paymentMethodId 
//         ? paymentMethodToUpdate 
//         : pm
//     );
//     setPaymentMethods(updatedMethods);

//     // סגור את הדיאלוג
//     setEditPaymentDialogOpen(false);
//     setEditingPaymentMethod(null);

//     // הצג הודעת הצלחה
//     setNotification({
//       open: true,
//       message: 'אמצעי התשלום עודכן בהצלחה',
//       severity: 'success'
//     });

//   } catch (error) {
//     console.error('Error updating payment method:', error);
//     setNotification({
//       open: true,
//       message: 'שגיאה בעדכון אמצעי התשלום: ' + (error.message || 'אנא נסה שנית'),
//       severity: 'error'
//     });
//   }
// };

//     const renderPaymentMethodForm = () => (
//         <Box sx={{ pt: 2 }}>
//             <Grid container spacing={2}>
//                 <Grid item xs={12} sx={{minWidth: 200}}>
//                     <FormControl fullWidth required>
//                         <InputLabel>סוג אמצעי תשלום</InputLabel>
//                         <Select
//                             value={formData.methodType}
//                             onChange={(e) => setFormData(prev => ({ ...prev, methodType: e.target.value }))}
//                             label="סוג אמצעי תשלום"
//                         >
//                             <MenuItem value="CREDIT_CARD">כרטיס אשראי</MenuItem>
//                             <MenuItem value="BANK_TRANSFER">העברה בנקאית</MenuItem>
//                             <MenuItem value="CASH">מזומן</MenuItem>
//                             <MenuItem value="CHECK">צ'ק</MenuItem>
//                         </Select>
//                     </FormControl>
//                 </Grid>

//                 <Grid item xs={12}>
//                     <TextField
//                         fullWidth
//                         label="שם בעל החשבון"
//                         value={formData.accountHolderName}
//                         onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
//                         required
//                     />
//                 </Grid>

//                 {/* שדות כרטיס אשראי - רק אם נבחר כרטיס אשראי */}
//                 {formData.methodType === 'CREDIT_CARD' && (
//                     <>
//                         <Grid item xs={6}>
//                             <TextField
//                                 fullWidth
//                                 label="4 ספרות אחרונות"
//                                 value={formData.lastFourDigits}
//                                 onChange={(e) => {
//                                     const value = e.target.value.replace(/\D/g, ''); // רק מספרים
//                                     if (value.length <= 4) {
//                                         setFormData(prev => ({ ...prev, lastFourDigits: value }));
//                                     }
//                                 }}
//                                 inputProps={{ maxLength: 4 }}
//                                 required
//                             />
//                         </Grid>
//                         <Grid item xs={6} sx={{ minWidth: 200 }}>
//                             <FormControl fullWidth required>
//                                 <InputLabel>סוג כרטיס</InputLabel>
//                                 <Select
//                                     value={formData.cardType}
//                                     onChange={(e) => setFormData(prev => ({ ...prev, cardType: e.target.value }))}
//                                     label="סוג כרטיס"
//                                 >
//                                     <MenuItem value="VISA">VISA</MenuItem>
//                                     <MenuItem value="MASTERCARD">MasterCard</MenuItem>
//                                     <MenuItem value="AMERICAN_EXPRESS">American Express</MenuItem>
//                                     <MenuItem value="ISRACARD">ישראכרט</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                         <Grid item xs={6} sx={{ minWidth: 200 }}> 
//                             <TextField
//                                 fullWidth
//                                 label="חודש תפוגה"
//                                 type="number"
//                                 value={formData.expiryMonth}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, expiryMonth: e.target.value }))}
//                                 inputProps={{ min: 1, max: 12 }}
//                             />
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField
//                                 fullWidth
//                                 label="שנת תפוגה"
//                                 type="number"
//                                 value={formData.expiryYear}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, expiryYear: e.target.value }))}
//                                 inputProps={{ min: new Date().getFullYear() }}
//                             />
//                         </Grid>
//                     </>
//                 )}

//                 {/* שדה בנק - רק אם נבחרה העברה בנקאית */}
//                 {formData.methodType === 'BANK_TRANSFER' && (
//                     <Grid item xs={12}>
//                         <TextField
//                             fullWidth
//                             label="שם הבנק"
//                             value={formData.bankName}
//                             onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
//                         />
//                     </Grid>
//                 )}

//                 <Grid item xs={12}>
//                     <FormControlLabel
//                         control={
//                             <Switch
//                                 checked={formData.isDefault}
//                                 onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
//                             />
//                         }
//                         label="הגדר כברירת מחדל"
//                     />
//                 </Grid>
//             </Grid>
//         </Box>
//     );

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
//                 <CircularProgress />
//                 <Typography sx={{ ml: 2 }}>טוען אמצעי תשלום...</Typography>
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{ direction: 'rtl' }}>
//             {/* כפתור הוספה */}
//             <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
//                 <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={handleAddMethod}
//                     sx={{
//                         background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                         borderRadius: '20px',
//                         px: 3
//                     }}
//                 >
//                     הוסף אמצעי תשלום
//                 </Button>
//             </Box>

//             {/* הצגת שגיאה */}
//             {error && (
//                 <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }}>
//                     {typeof error === 'string' ? error : error.message || 'שגיאה בטעינת אמצעי התשלום'}
//                 </Alert>
//             )}

//             {/* רשימת אמצעי תשלום */}
//             {paymentMethods && paymentMethods.length > 0 ? (
//                 <Grid container spacing={2}>
//                     <AnimatePresence>
//                         {paymentMethods.map((method, index) => (
//                             <Grid item xs={12} md={6} key={method.paymentMethodId}>
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     transition={{ delay: index * 0.1 }}
//                                 >
//                                     <Card sx={{
//                                         borderRadius: '16px',
//                                         border: method.isDefault ? '2px solid #10b981' : '1px solid #e2e8f0',
//                                         position: 'relative',
//                                         '&:hover': {
//                                             boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
//                                             transform: 'translateY(-2px)'
//                                         },
//                                         transition: 'all 0.3s ease'
//                                     }}>
//                                         {method.isDefault && (
//                                             <Chip
//                                                 icon={<StarIcon />}
//                                                 label="ברירת מחדל"
//                                                 color="success"
//                                                 size="small"
//                                                 sx={{
//                                                     position: 'absolute',
//                                                     top: 8,
//                                                     left: 8,
//                                                     zIndex: 1
//                                                 }}
//                                             />
//                                         )}

//                                         <CardContent sx={{ p: 3 }}>
//                                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                                                 <Box sx={{
//                                                     p: 1,
//                                                     borderRadius: '12px',
//                                                     background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
//                                                     color: 'white',
//                                                     mr: 2,
//                                                     marginLeft: 1
//                                                 }}>
//                                                     {getMethodIcon(method.methodType)}
//                                                 </Box>
//                                                 <Typography variant="h6" fontWeight="bold">
//                                                     {getMethodText(method.methodType)}
//                                                 </Typography>
//                                             </Box>

//                                             <Box sx={{ mb: 2 }}>
//                                                 {method.methodType === 'CREDIT_CARD' && (
//                                                     <>
//                                                         <Typography variant="body2" color="text.secondary">
//                                                             {method.cardType} •••• {method.lastFourDigits}
//                                                         </Typography>
//                                                         {method.expiryMonth && method.expiryYear && (
//                                                             <Typography variant="body2" color="text.secondary">
//                                                                 תפוגה: {method.expiryMonth}/{method.expiryYear}
//                                                             </Typography>
//                                                         )}
//                                                     </>
//                                                 )}
//                                                 {method.methodType === 'BANK_TRANSFER' && method.bankName && (
//                                                     <Typography variant="body2" color="text.secondary">
//                                                         {method.bankName}
//                                                     </Typography>
//                                                 )}
//                                                 <Typography variant="body2" color="text.secondary">
//                                                     {method.accountHolderName}
//                                                 </Typography>
//                                             </Box>

//                                             <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
//                                                 {!method.isDefault && (
//                                                     <Button
//                                                         size="small"
//                                                         startIcon={<StarIcon />}
//                                                         onClick={() => handleSetDefault(method.paymentMethodId)}
//                                                         sx={{ fontSize: '0.75rem' }}
//                                                     >
//                                                         הגדר כברירת מחדל
//                                                     </Button>
//                                                 )}
//                                                 <IconButton
//                                                     size="small"
//                                                     onClick={() => handleEditMethod(method)}
//                                                     sx={{ color: '#3b82f6' }}
//                                                 >
//                                                     <EditIcon fontSize="small" />
//                                                 </IconButton>
//                                                 <IconButton
//                                                     size="small"
//                                                     onClick={() => handleDeleteMethod(method.paymentMethodId)}
//                                                     sx={{ color: '#dc2626' }}
//                                                 >
//                                                     <DeleteIcon fontSize="small" />
//                                                 </IconButton>
//                                             </Box>
//                                         </CardContent>
//                                     </Card>
//                                 </motion.div>
//                             </Grid>
//                         ))}
//                     </AnimatePresence>
//                 </Grid>
//             ) : (
//                 <Alert severity="info" sx={{ borderRadius: '12px' }}>
//                     לא נמצאו אמצעי תשלום עבור תלמיד זה
//                 </Alert>
//             )}

//             {/* Dialog הוספת אמצעי תשלום */}
//             <Dialog
//                 open={addDialogOpen}
//                 onClose={() => setAddDialogOpen(false)}
//                 maxWidth="md"
//                 fullWidth
//                 sx={{ direction: 'rtl' }}
//             >
//                 <DialogTitle>הוסף אמצעי תשלום חדש</DialogTitle>
//                 <DialogContent>
//                     {renderPaymentMethodForm()}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setAddDialogOpen(false)}>
//                         ביטול
//                     </Button>
//                     <Button
//                         variant="contained"
//                         onClick={handleSaveMethod}
//                         sx={{
//                             background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
//                         }}
//                     >
//                         שמור
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Dialog עריכת אמצעי תשלום */}
//             <Dialog
//                 open={editDialogOpen}
//                 onClose={() => setEditDialogOpen(false)}
//                 maxWidth="md"
//                 fullWidth
//                 sx={{ direction: 'rtl' }}
//             >
//                 <DialogTitle>ערוך אמצעי תשלום</DialogTitle>
//                 <DialogContent>
//                     {renderPaymentMethodForm()}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setEditDialogOpen(false)}>
//                         ביטול
//                     </Button>
//                     <Button
//                         variant="contained"
//                         onClick={handleSaveMethod}
//                         sx={{
//                             background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
//                         }}
//                     >
//                         שמור שינויים
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Snackbar להודעות */}
//             <Snackbar
//                 open={snackbarOpen}
//                 autoHideDuration={6000}
//                 onClose={() => setSnackbarOpen(false)}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             >
//                 <Alert 
//                     onClose={() => setSnackbarOpen(false)} 
//                     severity={snackbarSeverity}
//                     sx={{ width: '100%' }}
//                 >
//                     {snackbarMessage}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default PaymentsTab;
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Alert,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    CircularProgress,
    Snackbar
} from '@mui/material';

import {
    CreditCard as CreditCardIcon,
    AccountBalance as BankIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Star as StarIcon,
    Payment as PaymentIcon
} from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentMethods } from '../../store/payments/fetchPaymentMethods';
import { updatePaymentMethod } from '../../store/payments/paymentMethodsUpdate';
import { addPaymentMethod } from '../../store/payments/addPaymentMethod';
import { deletePaymentMethod } from '../../store/payments/paymentMethodsDelete';

const PaymentsTab = ({ student, embedded = false }) => {
    const dispatch = useDispatch();
    const { paymentMethods, loading, error } = useSelector((state) => state.payments);
    
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    
    const [formData, setFormData] = useState({
        methodType: '',
        lastFourDigits: '',
        cardType: '',
        expiryMonth: '',
        expiryYear: '',
        bankName: '',
        accountHolderName: '',
        isDefault: false
    });

    useEffect(() => {
        if (student?.id) {
            dispatch(fetchPaymentMethods(student.id));
        }
    }, [student?.id, dispatch]);

    const getMethodIcon = (methodType) => {
        switch (methodType) {
            case 'CREDIT_CARD': return <CreditCardIcon />;
            case 'BANK_TRANSFER': return <BankIcon />;
            default: return <PaymentIcon />;
        }
    };

    const getMethodText = (methodType) => {
        switch (methodType) {
            case 'CREDIT_CARD': return 'כרטיס אשראי';
            case 'BANK_TRANSFER': return 'העברה בנקאית';
            case 'CASH': return 'מזומן';
            case 'CHECK': return 'צ\'ק';
            default: return methodType;
        }
    };

    const handleAddMethod = () => {
        setFormData({
            methodType: '',
            lastFourDigits: '',
            cardType: '',
            expiryMonth: '',
            expiryYear: '',
            bankName: '',
            accountHolderName: '',
            isDefault: false
        });
        setAddDialogOpen(true);
    };

    const handleEditMethod = (method) => {
        setSelectedMethod(method);
        setFormData({
            methodType: method.methodType,
            lastFourDigits: method.lastFourDigits || '',
            cardType: method.cardType || '',
            expiryMonth: method.expiryMonth || '',
            expiryYear: method.expiryYear || '',
            bankName: method.bankName || '',
            accountHolderName: method.accountHolderName || '',
            isDefault: method.isDefault
        });
        setEditDialogOpen(true);
    };

    const handleSaveMethod = async () => {
        try {
            // ולידציה בסיסית
            if (!formData.methodType) {
                setSnackbarMessage('יש לבחור סוג אמצעי תשלום');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            if (!formData.accountHolderName.trim()) {
                setSnackbarMessage('יש להזין שם בעל החשבון');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            // בניית payload בהתאם לסוג אמצעי התשלום
            const basePayload = {
                studentId: student.id,
                methodType: formData.methodType,
                accountHolderName: formData.accountHolderName.trim(),
                isDefault: formData.isDefault || false
            };

            // הוספת שדות ספציפיים לכרטיס אשראי בלבד
            if (formData.methodType === 'CREDIT_CARD') {
                // ולידציה לכרטיס אשראי
                if (!formData.lastFourDigits || formData.lastFourDigits.length !== 4) {
                    setSnackbarMessage('יש להזין 4 ספרות אחרונות של הכרטיס');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    return;
                }

                if (!formData.cardType) {
                    setSnackbarMessage('יש לבחור סוג כרטיס');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    return;
                }

                basePayload.lastFourDigits = formData.lastFourDigits;
                basePayload.cardType = formData.cardType;
                basePayload.expiryMonth = formData.expiryMonth || null;
                basePayload.expiryYear = formData.expiryYear || null;
            }

            // הוספת שם בנק להעברה בנקאית בלבד
            if (formData.methodType === 'BANK_TRANSFER') {
                basePayload.bankName = formData.bankName || null;
            }

            console.log('🚀 Sending payment method data:', basePayload);

            if (editDialogOpen) {
                const result = await dispatch(updatePaymentMethod({
                    paymentMethodId: selectedMethod.paymentMethodId,
                    ...basePayload
                }));
                
                if (updatePaymentMethod.fulfilled.match(result)) {
                    setSnackbarMessage('אמצעי התשלום עודכן בהצלחה');
                    setSnackbarSeverity('success');
                    setEditDialogOpen(false);
                } else {
                    console.log('Update failed, trying delete and re-add...');
            
                    try {
                        await dispatch(deletePaymentMethod(selectedMethod.paymentMethodId));
                        const addResult = await dispatch(addPaymentMethod(basePayload));
                        
                        if (addPaymentMethod.fulfilled.match(addResult)) {
                            setSnackbarMessage('אמצעי התשלום עודכן בהצלחה (דרך מחיקה והוספה מחדש)');
                            setSnackbarSeverity('success');
                            setEditDialogOpen(false);
                        } else {
                            throw new Error('גם המחיקה וההוספה מחדש נכשלו');
                        }
                    } catch (fallbackError) {
                        throw new Error(result.payload?.message || result.payload || 'שגיאה בעדכון אמצעי התשלום');
                    }
                }
            } else {
                const result = await dispatch(addPaymentMethod(basePayload));
                
                if (addPaymentMethod.fulfilled.match(result)) {
                    setSnackbarMessage('אמצעי התשלום נוסף בהצלחה');
                    setSnackbarSeverity('success');
                    setAddDialogOpen(false);
                } else {
                    throw new Error(result.payload?.message || result.payload || 'שגיאה בהוספת אמצעי התשלום');
                }
            }

            // רענון הנתונים
            dispatch(fetchPaymentMethods(student.id));
            setSnackbarOpen(true);

        } catch (error) {
            console.error('Error saving payment method:', error);
            
            // הצגת שגיאה ברורה למשתמש
            let errorMessage = 'שגיאה בשמירת אמצעי התשלום';
            
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error.message) {
                errorMessage = error.message;
            } else if (error.title) {
                errorMessage = error.title;
            }
            
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDeleteMethod = async (methodId) => {
        try {
            const result = await dispatch(deletePaymentMethod(methodId));
            
            if (deletePaymentMethod.fulfilled.match(result)) {
                setSnackbarMessage('אמצעי התשלום נמחק בהצלחה');
                setSnackbarSeverity('success');
                dispatch(fetchPaymentMethods(student.id));
            } else {
                throw new Error(result.payload || 'שגיאה במחיקת אמצעי התשלום');
            }
        } catch (error) {
            console.error('Error deleting payment method:', error);
            setSnackbarMessage('שגיאה במחיקת אמצעי התשלום');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
    };

    // 🔧 תיקון הפונקציה handleSetDefault
    const handleSetDefault = async (paymentMethodId) => {
        try {
            console.log('🔄 Setting default payment method:', paymentMethodId);
            
            // מצא את אמצעי התשלום הנוכחי
            const currentPaymentMethod = paymentMethods.find(pm => pm.paymentMethodId === paymentMethodId);
            
            if (!currentPaymentMethod) {
                throw new Error('אמצעי התשלום לא נמצא במערכת');
            }

            // צור אובייקט מעודכן עם isDefault = true
            const updatedPaymentMethod = {
                ...currentPaymentMethod,
                isDefault: true
            };

            console.log('📤 Sending updated payment method:', updatedPaymentMethod);

            // שלח עדכון לשרת
            const result = await dispatch(updatePaymentMethod(updatedPaymentMethod));

            if (updatePaymentMethod.fulfilled.match(result)) {
                // רענון הנתונים מהשרת
                dispatch(fetchPaymentMethods(student.id));

                // הצג הודעת הצלחה
                setSnackbarMessage('אמצעי התשלום הוגדר כברירת מחדל בהצלחה');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } else {
                throw new Error(result.payload?.message || result.payload || 'שגיאה בהגדרת ברירת מחדל');
            }

        } catch (error) {
            console.error('Error setting default payment method:', error);
            setSnackbarMessage('שגיאה בהגדרת ברירת מחדל: ' + (error.message || 'אנא נסה שנית'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    // 🗑️ הסרת הפונקציה handleEditPaymentMethod הכפולה
    // (כבר יש לנו handleEditMethod)

    const renderPaymentMethodForm = () => (
        <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{minWidth: 200}}>
                    <FormControl fullWidth required>
                        <InputLabel>סוג אמצעי תשלום</InputLabel>
                        <Select
                            value={formData.methodType}
                            onChange={(e) => setFormData(prev => ({ ...prev, methodType: e.target.value }))}
                            label="סוג אמצעי תשלום"
                        >
                            <MenuItem value="CREDIT_CARD">כרטיס אשראי</MenuItem>
                            <MenuItem value="BANK_TRANSFER">העברה בנקאית</MenuItem>
                            <MenuItem value="CASH">מזומן</MenuItem>
                            <MenuItem value="CHECK">צ'ק</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="שם בעל החשבון"
                        value={formData.accountHolderName}
                        onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                        required
                    />
                </Grid>

                {/* שדות כרטיס אשראי - רק אם נבחר כרטיס אשראי */}
                {formData.methodType === 'CREDIT_CARD' && (
                    <>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="4 ספרות אחרונות"
                                value={formData.lastFourDigits}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ''); // רק מספרים
                                    if (value.length <= 4) {
                                        setFormData(prev => ({ ...prev, lastFourDigits: value }));
                                    }
                                }}
                                inputProps={{ maxLength: 4 }}
                                required
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ minWidth: 200 }}>
                            <FormControl fullWidth required>
                                <InputLabel>סוג כרטיס</InputLabel>
                                <Select
                                    value={formData.cardType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, cardType: e.target.value }))}
                                    label="סוג כרטיס"
                                >
                                    <MenuItem value="VISA">VISA</MenuItem>
                                    <MenuItem value="MASTERCARD">MasterCard</MenuItem>
                                    <MenuItem value="AMERICAN_EXPRESS">American Express</MenuItem>
                                    <MenuItem value="ISRACARD">ישראכרט</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} sx={{ minWidth: 200 }}> 
                            <TextField
                                fullWidth
                                label="חודש תפוגה"
                                type="number"
                                value={formData.expiryMonth}
                                onChange={(e) => setFormData(prev => ({ ...prev, expiryMonth: e.target.value }))}
                                inputProps={{ min: 1, max: 12 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="שנת תפוגה"
                                type="number"
                                value={formData.expiryYear}
                                onChange={(e) => setFormData(prev => ({ ...prev, expiryYear: e.target.value }))}
                                inputProps={{ min: new Date().getFullYear() }}
                            />
                        </Grid>
                    </>
                )}

                {/* שדה בנק - רק אם נבחרה העברה בנקאית */}
                {formData.methodType === 'BANK_TRANSFER' && (
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="שם הבנק"
                            value={formData.bankName}
                            onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                        />
                    </Grid>
                )}

                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isDefault}
                                onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                            />
                        }
                        label="הגדר כברירת מחדל"
                    />
                </Grid>
            </Grid>
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>טוען אמצעי תשלום...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ direction: 'rtl' }}>
            {/* כפתור הוספה */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddMethod}
                    sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '20px',
                        px: 3
                    }}
                >
                    הוסף אמצעי תשלום
                </Button>
            </Box>

            {/* הצגת שגיאה */}
            {error && (
                <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }}>
                    {typeof error === 'string' ? error : error.message || 'שגיאה בטעינת אמצעי התשלום'}
                </Alert>
            )}

            {/* רשימת אמצעי תשלום */}
            {paymentMethods && paymentMethods.length > 0 ? (
                <Grid container spacing={2}>
                    <AnimatePresence>
                        {paymentMethods.map((method, index) => (
                            <Grid item xs={12} md={6} key={method.paymentMethodId}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card sx={{
                                        borderRadius: '16px',
                                        border: method.isDefault ? '2px solid #10b981' : '1px solid #e2e8f0',
                                        position: 'relative',
                                        '&:hover': {
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {method.isDefault && (
                                            <Chip
                                                icon={<StarIcon />}
                                                label="ברירת מחדל"
                                                color="success"
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    left: 8,
                                                    zIndex: 1
                                                }}
                                            />
                                        )}

                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Box sx={{
                                                    p: 1,
                                                    borderRadius: '12px',
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                                                    color: 'white',
                                                    mr: 2,
                                                    marginLeft: 1
                                                }}>
                                                    {getMethodIcon(method.methodType)}
                                                </Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {getMethodText(method.methodType)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 2 }}>
                                                {method.methodType === 'CREDIT_CARD' && (
                                                    <>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {method.cardType} •••• {method.lastFourDigits}
                                                        </Typography>
                                                        {method.expiryMonth && method.expiryYear && (
                                                            <Typography variant="body2" color="text.secondary">
                                                                תפוגה: {method.expiryMonth}/{method.expiryYear}
                                                            </Typography>
                                                        )}
                                                    </>
                                                )}
                                                {method.methodType === 'BANK_TRANSFER' && method.bankName && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        {method.bankName}
                                                    </Typography>
                                                )}
                                                <Typography variant="body2" color="text.secondary">
                                                    {method.accountHolderName}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                {!method.isDefault && (
                                                    <Button
                                                        size="small"
                                                        startIcon={<StarIcon />}
                                                        onClick={() => handleSetDefault(method.paymentMethodId)}
                                                        sx={{ fontSize: '0.75rem' }}
                                                    >
                                                        הגדר כברירת מחדל
                                                    </Button>
                                                )}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditMethod(method)}
                                                    sx={{ color: '#3b82f6' }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteMethod(method.paymentMethodId)}
                                                    sx={{ color: '#dc2626' }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            ) : (
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                    לא נמצאו אמצעי תשלום עבור תלמיד זה
                </Alert>
            )}

            {/* Dialog הוספת אמצעי תשלום */}
            <Dialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                maxWidth="md"
                fullWidth
                sx={{ direction: 'rtl' }}
            >
                <DialogTitle>הוסף אמצעי תשלום חדש</DialogTitle>
                <DialogContent>
                    {renderPaymentMethodForm()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>
                        ביטול
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveMethod}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        }}
                    >
                        שמור
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog עריכת אמצעי תשלום */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="md"
                fullWidth
                sx={{ direction: 'rtl' }}
            >
                <DialogTitle>ערוך אמצעי תשלום</DialogTitle>
                <DialogContent>
                    {renderPaymentMethodForm()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>
                        ביטול
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveMethod}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        }}
                    >
                        שמור שינויים
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar להודעות */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbarOpen(false)} 
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PaymentsTab;
