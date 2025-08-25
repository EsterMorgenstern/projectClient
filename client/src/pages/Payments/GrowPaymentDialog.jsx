import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    Box,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createGrowPayment } from '../../store/payments/createGrowPayment';
import { useGrowSDK, openGrowWallet } from '../../utils/growSDK';
import { usePaymentCallback, pollPaymentStatus } from '../../utils/paymentCallback';

const GrowPaymentDialog = ({ open, onClose, student, amount: initialAmount, description: initialDescription }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.payments);
    
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

    const [paymentIframeUrl, setPaymentIframeUrl] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('form'); // 'form', 'processing', 'iframe', 'sdk', 'success', 'error'

    // טיפול באירועי GROW SDK
    useEffect(() => {
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
        window.addEventListener('growPaymentSuccess', handleGrowSuccess);
        window.addEventListener('growPaymentFailure', handleGrowFailure);
        window.addEventListener('growPaymentError', handleGrowError);
        window.addEventListener('growPaymentCancel', handleGrowCancel);
        window.addEventListener('growWalletChange', handleWalletChange);
        window.addEventListener('growSDKLoadError', handleSDKLoadError);
        window.addEventListener('paymentCallbackUpdate', handlePaymentCallback);

        // ניקוי
        return () => {
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

        setPaymentStatus('processing');

        try {
            const paymentData = {
                studentId: student.id,
                amount: parseFloat(formData.amount),
                description: formData.description,
                fullName: formData.fullName.trim(),
                phone: formData.phone.trim(),
                creditCardNumber: formData.creditCardNumber || null
            };

            console.log('🚀 Starting GROW payment process:', paymentData);

            const result = await dispatch(createGrowPayment(paymentData));
            
            if (createGrowPayment.fulfilled.match(result)) {
                // בדיקה אם יש authCode (SDK החדש) או redirectUrl (ישן)
                if (result.payload.authCode) {
                    console.log('✅ Received authCode - using modern SDK:', result.payload.authCode);
                    
                    // שימוש ב-SDK החדש
                    const success = openGrowWallet(result.payload.authCode);
                    if (success) {
                        setPaymentStatus('sdk'); // מצב חדש לSDK
                        
                        // התחלת polling לבדיקת סטטוס (אם יש transactionId)
                        if (result.payload.transactionId) {
                            console.log('🔍 Starting payment polling...');
                            pollPaymentStatus(result.payload.transactionId)
                                .then(pollResult => {
                                    if (pollResult.success === true) {
                                        setPaymentStatus('success');
                                    } else if (pollResult.success === false) {
                                        setPaymentStatus('error');
                                    }
                                })
                                .catch(err => {
                                    console.error('❌ Polling error:', err);
                                });
                        }
                    } else {
                        throw new Error('שגיאה בפתיחת ארנק GROW');
                    }
                } else if (result.payload.redirectUrl) {
                    console.log('✅ Received redirect URL (Legacy):', result.payload.redirectUrl);
                    setPaymentIframeUrl(result.payload.redirectUrl);
                    setPaymentStatus('iframe');
                    
                    // התחלת polling גם עבור iframe (אם יש transactionId)
                    if (result.payload.transactionId) {
                        console.log('🔍 Starting payment polling for iframe...');
                        pollPaymentStatus(result.payload.transactionId)
                            .then(pollResult => {
                                if (pollResult.success === true) {
                                    setPaymentStatus('success');
                                } else if (pollResult.success === false) {
                                    setPaymentStatus('error');
                                }
                            })
                            .catch(err => {
                                console.error('❌ Polling error:', err);
                            });
                    }
                } else {
                    throw new Error('לא התקבל authCode או redirectUrl מהשרת');
                }
            } else {
                throw new Error(result.payload || 'שגיאה ביצירת תשלום');
            }

        } catch (error) {
            console.error('❌ Error in payment process:', error);
            setPaymentStatus('error');
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
                    <Box sx={{ direction: 'rtl' }}>
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
                                    InputProps={{
                                        endAdornment: <Typography variant="body2">₪</Typography>
                                    }}
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

                        {error && (
                            <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>
                                {error}
                            </Alert>
                        )}
                    </Box>
                );

            case 'processing':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                        <CircularProgress size={60} sx={{ mb: 2 }} />
                        <Typography variant="h6">יוצר תהליך תשלום...</Typography>
                        <Typography variant="body2" color="text.secondary">
                            אנא המתן, מכין את דף התשלום
                        </Typography>
                    </Box>
                );

            case 'iframe':
                return (
                    <Box sx={{ height: '600px', width: '100%', position: 'relative' }}>
                        <iframe
                            src={paymentIframeUrl}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                borderRadius: '8px'
                            }}
                            title="GROW Payment"
                            onLoad={() => {
                                console.log('📱 Payment iframe loaded successfully');
                            }}
                        />
                    </Box>
                );

            case 'sdk':
                return (
                    <Box sx={{ 
                        height: '400px', 
                        width: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                    }}>
                        <CircularProgress size={60} />
                        <Typography variant="h6" align="center">
                            ארנק GROW נפתח בחלון נפרד
                        </Typography>
                        <Typography variant="body2" align="center" color="text.secondary">
                            אנא בצע את התשלום בחלון שנפתח. אל תסגור חלון זה עד להשלמת התשלום.
                        </Typography>
                        <Alert severity="info" sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                💡 אם החלון לא נפתח, בדוק שלא חסום על ידי popup blocker
                            </Typography>
                        </Alert>
                    </Box>
                );

            case 'success':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                        <Typography variant="h5" color="error.main" sx={{ mb: 2 }}>
                            ❌ שגיאה בתשלום
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            התרחשה שגיאה בתהליך התשלום
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => setPaymentStatus('form')}
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
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={paymentStatus === 'iframe' ? 'md' : 'sm'}
            fullWidth
            sx={{ direction: 'rtl' }}
            disableEscapeKeyDown={paymentStatus === 'processing'}
        >
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogContent sx={{ minHeight: paymentStatus === 'iframe' ? '600px' : 'auto' }}>
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
    );
};

export default GrowPaymentDialog;
