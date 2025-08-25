import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Card,
    CardContent
} from '@mui/material';
import {
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const GrowPaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error', 'cancelled'

    useEffect(() => {
        // קבלת פרמטרים מה-URL
        const response = searchParams.get('response');
        const cField = searchParams.get('cField'); // שדות לקוח נוספים אם יש

        console.log('🔄 GROW Payment Callback - Response:', response);
        console.log('📋 Customer Fields:', cField);

        // עיבוד התגובה
        if (response === 'success') {
            setStatus('success');
            
            // שלח הודעה לחלון האב (אם זה נפתח ב-iframe או popup)
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    type: 'GROW_PAYMENT_SUCCESS',
                    data: { response, cField }
                }, '*');
            }

            // הפניה אוטומטית לדף הרלוונטי אחרי 3 שניות
            setTimeout(() => {
                navigate('/payments', { 
                    state: { 
                        message: 'התשלום הושלם בהצלחה!',
                        severity: 'success'
                    }
                });
            }, 3000);

        } else if (response === 'error') {
            setStatus('error');
            
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    type: 'GROW_PAYMENT_ERROR',
                    data: { response, cField }
                }, '*');
            }

        } else if (response === 'cancel') {
            setStatus('cancelled');
            
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    type: 'GROW_PAYMENT_CANCEL',
                    data: { response, cField }
                }, '*');
            }

        } else {
            // אם אין פרמטר response או שהוא לא מוכר
            setStatus('error');
        }

    }, [searchParams, navigate]);

    const handleReturnToPayments = () => {
        navigate('/payments');
    };

    const handleTryAgain = () => {
        navigate('/payments', { 
            state: { 
                message: 'ניתן לנסות שוב לבצע תשלום',
                severity: 'info',
                showGrowDialog: true
            }
        });
    };

    const renderContent = () => {
        switch (status) {
            case 'processing':
                return (
                    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4, textAlign: 'center' }}>
                        <CardContent sx={{ py: 4 }}>
                            <CircularProgress size={60} sx={{ mb: 3 }} />
                            <Typography variant="h5" gutterBottom>
                                מעבד תגובה...
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                אנא המתן בזמן שאנו מעבדים את תגובת התשלום
                            </Typography>
                        </CardContent>
                    </Card>
                );

            case 'success':
                return (
                    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4, textAlign: 'center' }}>
                        <CardContent sx={{ py: 4 }}>
                            <SuccessIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                            <Typography variant="h4" color="success.main" gutterBottom>
                                תשלום הושלם בהצלחה!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                התשלום שלך עובד כעת במערכת. אתה תועבר אוטומטית לדף התשלומים.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleReturnToPayments}
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    px: 4
                                }}
                            >
                                חזור לדף התשלומים
                            </Button>
                        </CardContent>
                    </Card>
                );

            case 'error':
                return (
                    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4, textAlign: 'center' }}>
                        <CardContent sx={{ py: 4 }}>
                            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                            <Typography variant="h4" color="error.main" gutterBottom>
                                שגיאה בתשלום
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                התרחשה שגיאה בתהליך התשלום. ייתכן שהתשלום לא הושלם.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleTryAgain}
                                    sx={{
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
                                    }}
                                >
                                    נסה שוב
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleReturnToPayments}
                                >
                                    חזור לדף התשלומים
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                );

            case 'cancelled':
                return (
                    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4, textAlign: 'center' }}>
                        <CardContent sx={{ py: 4 }}>
                            <InfoIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
                            <Typography variant="h4" color="warning.main" gutterBottom>
                                תשלום בוטל
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                ביטלת את תהליך התשלום. ניתן לנסות שוב בכל עת.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleTryAgain}
                                    sx={{
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
                                    }}
                                >
                                    נסה שוב
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleReturnToPayments}
                                >
                                    חזור לדף התשלומים
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: '#f8fafc',
            direction: 'rtl',
            py: 4
        }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
                <Typography variant="h3" textAlign="center" sx={{ mb: 2 }}>
                    GROW Payment
                </Typography>
                <Typography variant="subtitle1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
                    תוצאות תשלום
                </Typography>
                
                {renderContent()}
            </Box>
        </Box>
    );
};

export default GrowPaymentCallback;
