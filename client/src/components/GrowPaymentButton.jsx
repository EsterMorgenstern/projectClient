import React, { useState } from 'react';
import { 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    TextField,
    Grid,
    Box,
    Alert,
    CircularProgress,
    Typography
} from '@mui/material';
import { AccountBalanceWallet as WalletIcon } from '@mui/icons-material';
import useGrowPayment from '../hooks/useGrowPayment';

/**
 * כפתור תשלום GROW פשוט שניתן להטמיע בכל מקום
 * @param {Object} props
 * @param {Object} props.student - אובייקט התלמיד
 * @param {number} [props.amount] - סכום קבוע מראש
 * @param {string} [props.description] - תיאור קבוע מראש
 * @param {string} [props.buttonText] - טקסט הכפתור
 * @param {string} [props.variant] - סוג הכפתור (contained/outlined/text)
 * @param {string} [props.size] - גודל הכפתור
 * @param {Function} [props.onSuccess] - callback בהצלחה
 * @param {Function} [props.onError] - callback בשגיאה
 * @param {boolean} [props.disabled] - האם הכפתור מבוטל
 */
const GrowPaymentButton = ({
    student,
    amount: presetAmount,
    description: presetDescription,
    buttonText = 'תשלום דרך GROW',
    variant = 'contained',
    size = 'medium',
    onSuccess,
    onError,
    disabled = false,
    sx = {}
}) => {
    const { initiatePayment, isLoading, error, clearError } = useGrowPayment();
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        amount: presetAmount || '',
        description: presetDescription || '',
        fullName: '',
        phone: '',
        creditCardNumber: ''
    });

    // עדכון נתונים מהתלמיד כשהדיאלוג נפתח
    React.useEffect(() => {
        if (dialogOpen && student) {
            setFormData(prev => ({
                ...prev,
                fullName: student.firstName && student.lastName 
                    ? `${student.firstName} ${student.lastName}` 
                    : prev.fullName,
                phone: student.phone || prev.phone
            }));
        }
    }, [dialogOpen, student]);

    const handleClick = () => {
        if (!student?.id) {
            if (onError) onError('לא נבחר תלמיד');
            return;
        }
        
        clearError();
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
        clearError();
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
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

            const paymentData = {
                studentId: student.id,
                amount: parseFloat(formData.amount),
                description: formData.description,
                fullName: formData.fullName.trim(),
                phone: formData.phone.trim(),
                creditCardNumber: formData.creditCardNumber || null
            };

            const result = await initiatePayment(paymentData);
            
            if (result.success) {
                // פתח את דף התשלום בחלון חדש
                const width = 800;
                const height = 700;
                const left = window.screenX + (window.outerWidth - width) / 2;
                const top = window.screenY + (window.outerHeight - height) / 2;

                const paymentWindow = window.open(
                    result.redirectUrl,
                    'GrowPayment',
                    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
                );

                if (paymentWindow) {
                    setDialogOpen(false);
                    
                    // מאזין להשלמת התשלום
                    const handleMessage = (event) => {
                        if (event.data.type === 'GROW_PAYMENT_SUCCESS') {
                            window.removeEventListener('message', handleMessage);
                            if (onSuccess) onSuccess(paymentData);
                        } else if (event.data.type === 'GROW_PAYMENT_ERROR') {
                            window.removeEventListener('message', handleMessage);
                            if (onError) onError('התשלום נכשל');
                        }
                    };

                    window.addEventListener('message', handleMessage);

                    // ניקוי המאזין כשהחלון נסגר
                    const checkClosed = setInterval(() => {
                        if (paymentWindow.closed) {
                            clearInterval(checkClosed);
                            window.removeEventListener('message', handleMessage);
                        }
                    }, 1000);

                } else {
                    alert('לא ניתן לפתוח חלון תשלום. אנא וודא שחסימת חלונות קופצים מבוטלת.');
                }
            } else {
                if (onError) onError(result.error);
            }

        } catch (err) {
            console.error('Error in payment process:', err);
            if (onError) onError(err.message);
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                startIcon={<WalletIcon />}
                onClick={handleClick}
                disabled={disabled || !student?.id}
                sx={{
                    background: variant === 'contained' 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
                        : undefined,
                    '&:hover': variant === 'contained' ? {
                        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
                    } : undefined,
                    ...sx
                }}
            >
                {buttonText}
            </Button>

            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                sx={{ direction: 'rtl' }}
            >
                <DialogTitle>תשלום דרך GROW Wallet</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="סכום לתשלום"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange('amount', e.target.value)}
                                    inputProps={{ min: 0, step: 0.01 }}
                                    disabled={!!presetAmount}
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
                                    disabled={!!presetDescription}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isLoading}>
                        ביטול
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                            }
                        }}
                    >
                        {isLoading ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                מעבד...
                            </>
                        ) : (
                            'המשך לתשלום'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GrowPaymentButton;
