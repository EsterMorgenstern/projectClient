
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Alert,
    CircularProgress,
    Pagination,
    IconButton
} from '@mui/material';

import {
    Receipt as ReceiptIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    GetApp as DownloadIcon
} from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';
import GrowPaymentButton from '../../components/GrowPaymentButton';
import { useDispatch, useSelector } from 'react-redux';

import { fetchPaymentHistory } from '../../store/payments/fetchPaymentHistory';
import { updatePayment } from '../../store/payments/paymentsUpdate';
import { deletePaymentMethod } from '../../store/payments/paymentMethodsDelete';
import { addPayment } from '../../store/payments/paymentsAdd';

const PaymentHistoryTab = ({ student, embedded = false }) => {
    const dispatch = useDispatch();
    const { paymentHistory, loading, error } = useSelector((state) => state.payments);
    
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    const [formData, setFormData] = useState({
        amount: '',
        paymentDate: '',
        paymentMethod: '',
        status: 'COMPLETED',
        notes: '',
        transactionId: ''
    });

    useEffect(() => {
        if (student?.id) {
            dispatch(fetchPaymentHistory(student.id));
        }
    }, [student?.id, dispatch]);

    // ✅ פונקציה בטוחה לעיצוב מספרים
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || amount === '') {
            return '0.00 ₪';
        }
        
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        
        if (isNaN(numAmount)) {
            return '0.00 ₪';
        }
        
        return `${numAmount.toFixed(2)} ₪`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'PENDING': return 'warning';
            case 'FAILED': return 'error';
            case 'CANCELLED': return 'default';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'COMPLETED': return 'הושלם';
            case 'PENDING': return 'ממתין';
            case 'FAILED': return 'נכשל';
            case 'CANCELLED': return 'בוטל';
            default: return status;
        }
    };

    const getPaymentMethodText = (method) => {
        switch (method) {
            case 'CREDIT_CARD': return 'כרטיס אשראי';
            case 'BANK_TRANSFER': return 'העברה בנקאית';
            case 'CASH': return 'מזומן';
            case 'CHECK': return 'צ\'ק';
            default: return method;
        }
    };

    const handleAddPayment = () => {
        setFormData({
            amount: '',
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: '',
            status: 'COMPLETED',
           notes: '',
            transactionId: ''
        });
        setAddDialogOpen(true);
    };

    const handleEditPayment = (payment) => {
        setSelectedPayment(payment);
        setFormData({
            amount: payment.amount?.toString() || '',
            paymentDate: payment.paymentDate ? payment.paymentDate.split('T')[0] : '',
            paymentMethod: payment.paymentMethod || '',
            status: payment.status || 'COMPLETED',
            notes: payment.notes || '',
            transactionId: payment.transactionId || ''
        });
        setEditDialogOpen(true);
    };

    const handleSavePayment = async () => {
        try {
            const paymentData = {
                ...formData,
                studentId: student.id,
                amount: parseFloat(formData.amount) || 0,
                paymentDate: formData.paymentDate,
                createdAt: new Date().toISOString().split('T')[0],
                createdBy: 'system'
            };

            if (editDialogOpen) {
                console.log('Updating payment:', selectedPayment.paymentId, paymentData);
                await dispatch(updatePayment({
                    paymentId: selectedPayment.paymentId,
                    ...paymentData
                }));
                setEditDialogOpen(false);
            } else {
                await dispatch(addPayment(paymentData));
                setAddDialogOpen(false);
            }

            // רענון הנתונים
            dispatch(fetchPaymentHistory(student.id));
        } catch (error) {
            console.error('Error saving payment:', error);
        }
    };

    const handleDeletePayment = async (paymentId) => {
        try {
            await dispatch(deletePaymentMethod(paymentId));
            dispatch(fetchPaymentHistory(student.id));
        } catch (error) {
            console.error('Error deleting payment:', error);
        }
    };

    const renderPaymentForm = () => (
        <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="סכום"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        required
                        inputProps={{ min: 0, step: 0.01 }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="תאריך תשלום"
                        type="date"
                        value={formData.paymentDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} md={6} sx={{ minWidth: 170 }}>
                    <FormControl fullWidth required>
                        <InputLabel>אמצעי תשלום</InputLabel>
                        <Select
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                            label="אמצעי תשלום"
                        >
                            <MenuItem value="CREDIT_CARD">כרטיס אשראי</MenuItem>
                            <MenuItem value="BANK_TRANSFER">העברה בנקאית</MenuItem>
                            <MenuItem value="CASH">מזומן</MenuItem>
                            <MenuItem value="CHECK">צ'ק</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>סטטוס</InputLabel>
                        <Select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            label="סטטוס"
                        >
                            <MenuItem value="COMPLETED">הושלם</MenuItem>
                            <MenuItem value="PENDING">ממתין</MenuItem>
                            <MenuItem value="FAILED">נכשל</MenuItem>
                            <MenuItem value="CANCELLED">בוטל</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="מספר חשבונית"
                        value={formData.transactionId}
                        onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="תיאור"
                        multiline
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                </Grid>
            </Grid>
        </Box>
    );

    // ✅ חישוב בטוח של הסטטיסטיקות
    const calculateStats = () => {
        if (!paymentHistory || paymentHistory.length === 0) {
            return {
                totalPaid: 0,
                totalPending: 0,
                totalPayments: 0,
                averagePayment: 0
            };
        }

        const completedPayments = paymentHistory.filter(p => p.status === 'COMPLETED');
        const pendingPayments = paymentHistory.filter(p => p.status === 'PENDING');
        
        const totalPaid = completedPayments.reduce((sum, payment) => {
            const amount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount;
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        const totalPending = pendingPayments.reduce((sum, payment) => {
            const amount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount;
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        const averagePayment = completedPayments.length > 0 ? totalPaid / completedPayments.length : 0;

        return {
            totalPaid,
            totalPending,
            totalPayments: paymentHistory.length,
            averagePayment
        };
    };

    const stats = calculateStats();

    // ✅ פגינציה בטוחה
    const paginatedPayments = paymentHistory ? paymentHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ) : [];

    const totalPages = paymentHistory ? Math.ceil(paymentHistory.length / itemsPerPage) : 0;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>טוען היסטוריית תשלומים...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ direction: 'rtl' }}>
            {/* סטטיסטיקות */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        borderRadius: '16px'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" fontWeight="bold">
                                {formatCurrency(stats.totalPaid)}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                סה"כ שולם
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        borderRadius: '16px'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" fontWeight="bold">
                                {formatCurrency(stats.totalPending)}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                ממתין לתשלום
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                        color: 'white',
                        borderRadius: '16px'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" fontWeight="bold">
                                {stats.totalPayments}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                סה"כ תשלומים
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: 'white',
                        borderRadius: '16px'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" fontWeight="bold">
                                {formatCurrency(stats.averagePayment)}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                ממוצע תשלום
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* כפתורי פעולה */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3, gap: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddPayment}
                    sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '20px',
                        px: 3
                    }}
                >
                    הוסף תשלום
                </Button>
                
                {/* כפתור GROW Payment */}
                <GrowPaymentButton
                    student={student}
                    buttonText="תשלום דרך GROW"
                    size="medium"
                    sx={{ borderRadius: '20px', px: 3 }}
                    onSuccess={(paymentData) => {
                        console.log('✅ GROW payment completed:', paymentData);
                        // רענון היסטוריית התשלומים
                        if (student?.id) {
                            dispatch(fetchPaymentHistory(student.id));
                        }
                    }}
                    onError={(error) => {
                        console.error('❌ GROW payment failed:', error);
                        alert(`שגיאה בתשלום GROW: ${error}`);
                    }}
                />
            </Box>

            {/* הצגת שגיאה */}
            {error && (
                <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }}>
                    {typeof error === 'string' ? error : error.message || 'שגיאה בטעינת היסטוריית התשלומים'}
                </Alert>
            )}

            {/* טבלת תשלומים */}
            {paymentHistory && paymentHistory.length > 0 ? (
                <Card sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
                }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>תאריך</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>סכום</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>אמצעי תשלום</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>סטטוס</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>חשבונית</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>תיאור</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>פעולות</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <AnimatePresence>
                                    {paginatedPayments.map((payment, index) => (
                                        <TableRow
                                            key={payment.paymentId || index}
                                            sx={{
                                                '&:nth-of-type(even)': { backgroundColor: 'rgba(16, 185, 129, 0.03)' },
                                                '&:hover': {
                                                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <TableCell align="right">
                                                {payment.paymentDate ? 
                                                    new Date(payment.paymentDate).toLocaleDateString('he-IL') : 
                                                    'לא זמין'
                                                }
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography sx={{ fontWeight: 'bold', color: '#059669' }}>
                                                    {formatCurrency(payment.amount)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                {getPaymentMethodText(payment.paymentMethod)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={getStatusText(payment.status)}
                                                    color={getStatusColor(payment.status)}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {payment.transactionId || '-'}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        maxWidth: 200, 
                                                        overflow: 'hidden', 
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {payment.notes || '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditPayment(payment)}
                                                        sx={{ color: '#3b82f6' }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeletePayment(payment.paymentId)}
                                                        sx={{ color: '#dc2626' }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>



                                                    {payment.invoiceNumber && (
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: '#059669' }}
                                                            title="הורד חשבונית"
                                                        >
                                                            <DownloadIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* פגינציה */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(event, value) => setCurrentPage(value)}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </Card>
            ) : (
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                    לא נמצאו תשלומים עבור תלמיד זה
                </Alert>
            )}

            {/* Dialog הוספת תשלום */}
            <Dialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                maxWidth="md"
                fullWidth
                sx={{ direction: 'rtl' }}
            >
                <DialogTitle>הוסף תשלום חדש</DialogTitle>
                <DialogContent>
                    {renderPaymentForm()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>
                        ביטול
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSavePayment}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        }}
                    >
                        שמור
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog עריכת תשלום */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="md"
                fullWidth
                sx={{ direction: 'rtl' }}
            >
                <DialogTitle>ערוך תשלום</DialogTitle>
                <DialogContent>
                    {renderPaymentForm()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>
                        ביטול
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSavePayment}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        }}
                    >
                        שמור שינויים
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaymentHistoryTab;