import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/GridLegacy';
import { createGrowPayment } from '../../store/payments/createGrowPayment';
import { useGrowSDK, openGrowWallet } from '../../utils/growSDK';
import { usePaymentCallback, pollPaymentStatus } from '../../utils/paymentCallback';
import { checkUserPermission } from '../../utils/permissions';

const GrowPaymentDialog = ({ open, onClose, student, amount: initialAmount, description: initialDescription }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.payments);
    const currentUser = useSelector(state => state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null);
    
    // טעינת GROW SDK
    useGrowSDK();
    
    // מאזין לעדכוני callback
    usePaymentCallback();

    const [formData, setFormData] = useState({
        amount: initialAmount || '',
        description: initialDescription || '',
        fullName: '',
        phone: '',
        creditCardNumber: ''
    });

    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [paymentIframeUrl, setPaymentIframeUrl] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('form'); // 'form', 'processing', 'iframe', 'sdk', 'success', 'error'
    const [localError, setLocalError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    // טיפול באירועי GROW SDK
    useEffect(() => {
        const handleGrowStart = (event) => {
            console.log('🚀 GROW Payment Start Event:', event.detail);
            setPaymentStatus('processing');
        };

        const handleGrowSuccess = (event) => {
            console.log('🎉 GROW Payment Success Event:', event.detail);
            setPaymentStatus('success');
            // onClose(); // סגירת הדיאלוג אחרי הצלחה
        };

        const handleGrowFailure = (event) => {
            console.log('❌ GROW Payment Failure Event:', event.detail);
            setPaymentStatus('error');
        };

        const handleGrowError = (event) => {
            console.log('🚨 GROW Payment Error Event:', event.detail);
            setPaymentStatus('error');
            const errorDetail = event.detail;
            if (errorDetail.isNetFreeError) {
                setLocalError('התשלום נחסם על ידי NetFree או חומת אש אחרת. אנא פנה לתמיכה טכנית.');
            } else {
                setLocalError(errorDetail.userMessage || 'שגיאה בתהליך התשלום');
            }
        };

        const handleGrowCancel = (event) => {
            console.log('🚫 GROW Payment Cancel Event:', event.detail);
            setPaymentStatus('form'); // חזרה לטופס
        };

        const handleWalletChange = (event) => {
            console.log('👛 GROW Wallet Change:', event.detail);
            // אפשר להוסיף אינדיקטור טעינה כאן
        };

        const handleSDKLoadError = (event) => {
            console.log('🚨 GROW SDK Load Error:', event.detail);
            setPaymentStatus('error');
            setLocalError('שגיאה בטעינת מערכת התשלומים. ייתכן שהשירות חסום על ידי NetFree או חומת אש אחרת.');
            // אפשר להציג הודעה מיוחדת על NetFree
        };

        const handlePaymentCallback = (event) => {
            console.log('📨 Payment Callback Update:', event.detail);
            const { Status, TransactionId } = event.detail;
            
            if (Status === 'COMPLETED') {
                console.log('✅ Payment completed via callback!');
                setPaymentStatus('success');
            } else if (Status === 'FAILED') {
                console.log('❌ Payment failed via callback!');
                setPaymentStatus('error');
            }
        };

        // רישום לאירועים
        window.addEventListener('growPaymentStart', handleGrowStart);
        window.addEventListener('growPaymentSuccess', handleGrowSuccess);
        window.addEventListener('growPaymentFailure', handleGrowFailure);
        window.addEventListener('growPaymentError', handleGrowError);
        window.addEventListener('growPaymentCancel', handleGrowCancel);
        window.addEventListener('growWalletChange', handleWalletChange);
        window.addEventListener('growSDKLoadError', handleSDKLoadError);
        window.addEventListener('paymentCallbackUpdate', handlePaymentCallback);

        // ניקוי
        return () => {
            window.removeEventListener('growPaymentStart', handleGrowStart);
            window.removeEventListener('growPaymentSuccess', handleGrowSuccess);
            window.removeEventListener('growPaymentFailure', handleGrowFailure);
            window.removeEventListener('growPaymentError', handleGrowError);
            window.removeEventListener('growPaymentCancel', handleGrowCancel);
            window.removeEventListener('growWalletChange', handleWalletChange);
            window.removeEventListener('growSDKLoadError', handleSDKLoadError);
            window.removeEventListener('paymentCallbackUpdate', handlePaymentCallback);
        };
    }, []);

    // איפוס הטופס כשהדיאלוג נפתח
    useEffect(() => {
        if (open) {
            setFormData({
                amount: initialAmount || '',
                description: initialDescription || '',
                fullName: student?.firstName && student?.lastName ? `${student.firstName} ${student.lastName}` : '',
                phone: student?.phone || '',
                creditCardNumber: ''
            });
            setPaymentIframeUrl(null);
            setPaymentStatus('form');
            setIframeLoaded(false); // איפוס מצב הטעינה
        }
    }, [open, initialAmount, initialDescription, student]);

    // מאזין להודעות מה-iframe
    useEffect(() => {
        const handleMessage = (event) => {
            console.log('📨 Received message from iframe:', event.data);
            
            // בדוק אם ההודעה מגיעה מדומיין הנכון (GROW)
            if (event.origin !== window.location.origin && !event.origin.includes('grow')) {
                return;
            }

            if (event.data.type === 'GROW_PAYMENT_SUCCESS') {
                console.log('✅ Payment completed successfully');
                setPaymentStatus('success');
                setTimeout(() => {
                    onClose(true); // העבר true לציין שהתשלום הושלם
                }, 2000);
            } else if (event.data.type === 'GROW_PAYMENT_ERROR') {
                console.log('❌ Payment failed');
                setPaymentStatus('error');
            } else if (event.data.type === 'GROW_PAYMENT_CANCEL') {
                console.log('⚠️ Payment cancelled');
                setPaymentStatus('form');
                setPaymentIframeUrl(null);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onClose]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        // ולידציה
        if (!formData.amount || formData.amount <= 0) {
            alert('יש להזין סכום תקין');
            return;
        }

        if (!formData.fullName.trim()) {
            alert('יש להזין שם מלא');
            return;
        }

        if (!formData.phone.trim()) {
            alert('יש להזין מספר טלפון');
            return;
        }

        if (!checkUserPermission(currentUser?.id || currentUser?.userId, (message, severity) => setSnackbar({ open: true, message, severity: severity || 'error' }))) {
            return;
        }

    setPaymentStatus('processing');
    setSnackbar({ open: true, message: 'מעבד תשלום...', severity: 'info' });

        try {
            const paymentData = {
                studentId: student.id,
                amount: parseFloat(formData.amount),
                description: formData.description,
                fullName: formData.fullName.trim(),
                phone: formData.phone.trim(),
                creditCardNumber: formData.creditCardNumber || ''
            };

            // שליחה בפורמט FormData
            const form = new FormData();
            Object.entries(paymentData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) form.append(key, value);
            });

            console.log('🚀 Starting GROW payment process:', paymentData);
            const result = await dispatch(createGrowPayment(form));

            if (createGrowPayment.fulfilled.match(result)) {
                if (result.payload.authCode) {
                    setSnackbar({ open: true, message: 'הארנק נפתח, השלם את התשלום בחלון החדש', severity: 'success' });
                    console.log('✅ Received authCode - using modern SDK:', result.payload.authCode);
                    const success = openGrowWallet(result.payload.authCode);
                    if (success) {
                        setPaymentStatus('sdk');
                        if (result.payload.transactionId && !result.payload.transactionId.includes('MOCK')) {
                            pollPaymentStatus(result.payload.transactionId)
                                .then(pollResult => {
                                    if (pollResult.success === true) {
                                        setPaymentStatus('success');
                                        onClose(true);
                                    } else if (pollResult.success === false) {
                                        setPaymentStatus('error');
                                    }
                                })
                                .catch(err => {
                                    console.error('❌ Polling error:', err);
                                });
                        }
                    } else {
                        setSnackbar({ open: true, message: 'שגיאה בפתיחת ארנק GROW', severity: 'error' });
                        throw new Error('שגיאה בפתיחת ארנק GROW');
                    }
                } else if (result.payload.redirectUrl) {
                    console.log('✅ Received redirect URL (Legacy):', result.payload.redirectUrl);
                    window.open(result.payload.redirectUrl, '_blank', 'noopener,noreferrer');
                    setSnackbar({ open: true, message: 'דף התשלום נפתח, השלם את התשלום בחלון החדש', severity: 'success' });
                    setPaymentStatus('processing');
                    setTimeout(() => {
                        setPaymentStatus('success');
                        onClose(true);
                    }, 3000);
                } else {
                    throw new Error('לא התקבל authCode או redirectUrl מהשרת');
                }
            } else {
                throw new Error(result.payload || 'שגיאה ביצירת תשלום');
            }
        } catch (error) {
            console.error('❌ Error in payment process:', error);
            setPaymentStatus('error');
            setSnackbar({ open: true, message: 'שגיאה בתהליך התשלום', severity: 'error' });
        }
    };

    const handleClose = () => {
        if (paymentStatus === 'processing') {
            return; // לא לאפשר סגירה בזמן עיבוד
        }
        setPaymentIframeUrl(null);
        setPaymentStatus('form');
        onClose(false);
    };

    const renderContent = () => {
        switch (paymentStatus) {
            case 'form':
                return (
                    <Box sx={{ direction: 'rtl', background: '#fff', boxShadow: 0, p: 2, maxHeight: '60vh', overflowY: 'auto' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="סכום לתשלום"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange('amount', e.target.value)}
                                    inputProps={{ min: 0, step: 0.01 }}
                                    required
                                    InputProps={{ endAdornment: <Typography variant="body2">₪</Typography> }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="שם מלא"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="טלפון"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="מספר כרטיס אשראי (אופציונלי)"
                                    value={formData.creditCardNumber}
                                    onChange={(e) => handleInputChange('creditCardNumber', e.target.value)}
                                    placeholder="1234-5678-9012-3456"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="תיאור התשלום"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 'iframe':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, maxHeight: '60vh', overflowY: 'auto', width: '100%' }}>
                        <Alert severity="success" sx={{ mb: 2, borderRadius: '12px', width: '100%' }}>
                            <Typography variant="body2">
                                ✅ <strong>תהליך התשלום הופעל!</strong> דף התשלום נפתח בחלון חדש.
                            </Typography>
                        </Alert>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            אנא השלם את התשלום בחלון שנפתח. לאחר סיום, חזור לכאן.
                        </Typography>
                    </Box>
                );

            case 'sdk':
                return (
                    <Box sx={{ height: '350px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, p: 3, maxHeight: '60vh', overflowY: 'auto', background: '#f3f4f6', borderRadius: 2 }}>
                        <Box sx={{ textAlign: 'center', width: '100%' }}>
                            <CircularProgress size={50} sx={{ mb: 2 }} />
                            <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                                ✅ תהליך התשלום הופעל בהצלחה!
                            </Typography>
                            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 2 }}>
                                ארנק GROW נפתח בחלון נפרד או כ-overlay
                            </Typography>
                        </Box>
                        <Alert severity="success" sx={{ width: '100%' }}>
                            <Typography variant="body2">
                                🎯 <strong>הוראות:</strong>
                                <br />• השלם את התשלום בחלון של GROW
                                <br />• אל תסגור את החלון הזה עד סיום התהליך  
                                <br />• אם החלון לא נפתח, בדוק popup blocker
                            </Typography>
                        </Alert>
                    </Box>
                );

            case 'success':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, maxHeight: '60vh', overflowY: 'auto', width: '100%' }}>
                        <Typography variant="h5" color="success.main" sx={{ mb: 2 }}>
                            ✅ התשלום הושלם בהצלחה!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            התשלום עובד כעת במערכת
                        </Typography>
                    </Box>
                );

            case 'error':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, maxHeight: '60vh', overflowY: 'auto', width: '100%' }}>
                        <Typography variant="h5" color="error.main" sx={{ mb: 2 }}>
                            ❌ שגיאה בתשלום
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                            התרחשה שגיאה בתהליך התשלום
                        </Typography>
                        {localError && (
                            <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                                <Typography variant="body2">
                                    {localError}
                                </Typography>
                                {localError.includes('NetFree') && (
                                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                        💡 פתרונות אפשריים:
                                        <br />• פנה לנטפרי לפתיחת הדומיינים: cdn.meshulam.co.il, sandbox.meshulam.co.il
                                        <br />• נסה לגשת ממחשב אחר ללא NetFree
                                        <br />• צור קשר עם התמיכה הטכנית
                                    </Typography>
                                )}
                            </Alert>
                        )}
                        <Button 
                            variant="contained" 
                            onClick={() => {
                                setPaymentStatus('form');
                                setLocalError('');
                            }}
                            sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                        >
                            נסה שוב
                        </Button>
                    </Box>
                );

            default:
                return null;
        }
    };

    const getDialogTitle = () => {
        switch (paymentStatus) {
            case 'form':
                return 'תשלום דרך GROW Wallet';
            case 'processing':
                return 'מעבד תשלום...';
            case 'iframe':
                return 'השלם תשלום';
            case 'sdk':
                return 'ארנק GROW נפתח';
            case 'success':
                return 'תשלום הושלם';
            case 'error':
                return 'שגיאה בתשלום';
            default:
                return 'תשלום';
        }
    };

    const shouldShowActions = () => {
        return paymentStatus === 'form' || paymentStatus === 'error' || paymentStatus === 'sdk';
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={paymentStatus === 'iframe' ? 'lg' : 'sm'}
                fullWidth
                sx={{ 
                    direction: 'rtl',
                    zIndex: 9999,
                    '& .MuiDialog-paper': {
                        zIndex: 10000,
                        height: paymentStatus === 'iframe' ? '90vh' : 'auto',
                        maxHeight: paymentStatus === 'iframe' ? '90vh' : '80vh',
                        overflowY: 'auto',
                        background: paymentStatus === 'sdk' ? '#f3f4f6' : '#fff'
                    }
                }}
                disableEscapeKeyDown={paymentStatus === 'processing'}
            >
                <DialogTitle>{getDialogTitle()}</DialogTitle>
                <DialogContent sx={{ 
                    minHeight: paymentStatus === 'iframe' ? '700px' : 'auto',
                    padding: paymentStatus === 'iframe' ? 1 : 3,
                    overflow: paymentStatus === 'iframe' ? 'hidden' : 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}>
                    {renderContent()}
                </DialogContent>
                {shouldShowActions() && (
                    <DialogActions>
                        <Button onClick={handleClose} disabled={loading}>
                            {paymentStatus === 'sdk' ? 'סגור' : 'ביטול'}
                        </Button>
                        {paymentStatus === 'form' && (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                    }
                                }}
                            >
                                {loading ? 'מעבד...' : 'המשך לתשלום'}
                            </Button>
                        )}
                    </DialogActions>
                )}
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default GrowPaymentDialog;
