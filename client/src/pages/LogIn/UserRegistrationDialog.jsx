import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Alert,
  Avatar,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
  MenuItem,
  Snackbar
} from '@mui/material';
import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { addUser } from '../../store/user/userAddThunk';
import { checkUserPermission, allowedUserIds } from '../../utils/permissions';

const UserRegistrationDialog = ({ open, onClose, onRegistrationSuccess }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentUser = useSelector(state => state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null);

  // ✅ הוסף את כל ה-state variables החסרים
  const [formData, setFormData] = useState({
    id:null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Student',
    adminCode: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationStep, setRegistrationStep] = useState('form'); // 'form', 'loading', 'success'
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // איפוס הטופס כשהדיאלוג נפתח
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  // ✅ פונקציה לאיפוס הטופס
  const resetForm = () => {
    setFormData({
        id:null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Student',
      adminCode: ''
    });
    setErrors({});
    setIsSubmitting(false);
    setRegistrationStep('form');
  };

  // ✅ טיפול בשינוי שדות
  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // נקה שגיאה של השדה הנוכחי
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // ✅ validation משופר
  const validateForm = () => {
    const newErrors = {};

    // בדיקת שם פרטי
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'שם פרטי הוא שדה חובה';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'שם פרטי חייב להכיל לפחות 2 תווים';
    } else if (!/^[א-תa-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'שם פרטי יכול להכיל רק אותיות';
    }

    // בדיקת שם משפחה
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'שם משפחה הוא שדה חובה';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'שם משפחה חייב להכיל לפחות 2 תווים';
    } else if (!/^[א-תa-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'שם משפחה יכול להכיל רק אותיות';
    }

    // בדיקת אימייל
    if (!formData.email.trim()) {
      newErrors.email = 'אימייל הוא שדה חובה';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'פורמט אימייל לא תקין';
      }
    }

    // בדיקת טלפון
    if (!formData.phone.trim()) {
      newErrors.phone = 'מספר טלפון הוא שדה חובה';
    } else {
      const phoneRegex = /^[0-9]{9,10}$/;
      const cleanPhone = formData.phone.replace(/[-\s]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'מספר טלפון חייב להכיל 9-10 ספרות';
      }
    }

    // בדיקת תפקיד
    if (!formData.role) {
      newErrors.role = 'יש לבחור תפקיד';
    }

    if (!formData.adminCode?.toString().trim()) {
      newErrors.adminCode = 'יש להזין קוד מנהל';
    } else if (!allowedUserIds.includes(Number(formData.adminCode))) {
      newErrors.adminCode = 'קוד מנהל אינו מורשה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
 
// ✅ תיקון מושלם - נטפל בכל סוג תגובה מהשרת
const handleSubmit = async () => {
  // הסר בדיקת הרשאות
  if (!validateForm()) return;

 
    setIsSubmitting(true);
    setRegistrationStep('loading');
    setErrors({});

    const userData = {
        id:formData.id,
      firstName: formData.firstName.trim(),
     lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      role: formData.role
    };

    console.log('🚀 Sending user data:', userData);

    await dispatch(addUser(userData));

   
      setRegistrationStep('success');

      // עדכן את הstore עם המשתמש החדש
      if (onRegistrationSuccess) {
        onRegistrationSuccess(userData);
      }
   
   }

  // ✅ טיפול בסגירת התראות
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // ✅ רינדור טופס ההרשמה
  const renderRegistrationForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
     
    >
      <Box sx={{ textAlign: 'center', mb: 3}}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <Avatar sx={{
            width: 64,
            height: 64,
            bgcolor: 'primary.main',
            mx: 'auto',
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
          }}>
            <PersonAddIcon sx={{ fontSize: 32 }} />
          </Avatar>
        </motion.div>
        
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}>
          הרשמה למערכת
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          מלא את הפרטים שלך כדי להצטרף למערכת
        </Typography>
      </Box>

      {errors.general && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errors.general}
          </Alert>
        </motion.div>
      )}

      <Grid container spacing={2} sx={{direction:'rtl'}}>
          <Grid item xs={12} sm={6} >
          <TextField
            fullWidth
            type="number"
            label="תעודת זהות"
            placeholder="הכנס תעודת זהות "
            value={formData.id || 0}
            onChange={handleInputChange('id')}
            error={!!errors.id}
            helperText={errors.id}
            InputProps={{
              startAdornment: <PersonIcon color={errors.id ? 'error' : 'primary'} sx={{ mr: 1 }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>


        {/* שם פרטי */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="שם פרטי"
            placeholder="הכנס שם פרטי"
            value={formData.firstName || ''}
            onChange={handleInputChange('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName}
            InputProps={{
              startAdornment: <PersonIcon color={errors.firstName ? 'error' : 'primary'} sx={{ mr: 1 }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        {/* שם משפחה */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="שם משפחה"
            placeholder="הכנס שם משפחה"
            value={formData.lastName || ''}
            onChange={handleInputChange('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName}
            InputProps={{
              startAdornment: <PersonIcon color={errors.lastName ? 'error' : 'primary'} sx={{ mr: 1 }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        {/* אימייל */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="email"
            label="כתובת אימייל"
            placeholder="example@email.com"
            value={formData.email || ''}
            onChange={handleInputChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: <EmailIcon color={errors.email ? 'error' : 'primary'} sx={{ mr: 1 }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        {/* טלפון */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="מספר טלפון"
            placeholder="050-1234567"
            value={formData.phone || ''}
            onChange={handleInputChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              startAdornment: <PhoneIcon color={errors.phone ? 'error' : 'primary'} sx={{ mr: 1 }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        {/* תפקיד */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="תפקיד"
            value={formData.role || ''}
            onChange={handleInputChange('role')}
            error={!!errors.role}
            helperText={errors.role}
            InputProps={{
              startAdornment: <WorkIcon color={errors.role ? 'error' : 'primary'} sx={{ mr: 1 }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          >
            <MenuItem value="תלמיד">תלמיד</MenuItem>
            <MenuItem value="מורה">מורה</MenuItem>
            <MenuItem value="מנהל">מנהל</MenuItem>
            <MenuItem value="מזכירה">מזכירה</MenuItem>
            <MenuItem value="משתמש">משתמש</MenuItem>
            <MenuItem value="מנהל מערכת">מנהל מערכת</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              label="קוד מנהל"
              placeholder="הכנס קוד מנהל"
              value={formData.adminCode || ''}
              onChange={handleInputChange('adminCode')}
              error={!!errors.adminCode}
              helperText={errors.adminCode || 'נדרש לאישור הרשמה'}
              InputProps={{
                startAdornment: <WorkIcon color={errors.adminCode ? 'error' : 'primary'} sx={{ mr: 1 }} />
              }}
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'rgba(102, 126, 234, 0.06)',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.35)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.6)'
                  }
                },
              }}
            />
          </Box>
        </Grid>
       
      </Grid>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={20} /> : <PersonAddIcon />}
        sx={{
          borderRadius: 2,
          py: 1.5,
          mt: 3,
          mb: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
            transform: 'translateY(-2px)',
          },
          '&:disabled': {
            background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
            transform: 'none',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {isSubmitting ? 'נרשם...' : 'הירשם למערכת'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Chip
          icon={<SchoolIcon />}
          label="הצטרפות חינמית"
          variant="outlined"
          size="small"
          sx={{ 
            borderColor: 'success.main',
            color: 'success.main',
            '& .MuiChip-icon': {
              color: 'success.main'
            }
          }}
        />
      </Box>
    </motion.div>
  );

  // ✅ רינדור מצב טעינה
  const renderLoadingState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ textAlign: 'center', padding: '40px 20px' }}
    >
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{ 
          color: 'primary.main',
          mb: 3
        }}
      />
      <Typography variant="h6" sx={{ mb: 2 }}>
       ... יוצר את החשבון שלך
      </Typography>
      <Typography variant="body2" color="text.secondary">
        אנא המתן בזמן שאנו מעבדים את הפרטים שלך
      </Typography>
    </motion.div>
  );

  // ✅ רינדור מצב הצלחה
  const renderSuccessState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{ textAlign: 'center', padding: '40px 20px' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <CheckCircleIcon 
          sx={{ 
            fontSize: 80, 
            color: 'success.main',
            mb: 3
          }} 
        />
      </motion.div>
      
      <Typography variant="h5" sx={{ mb: 2, color: 'success.main', fontWeight: 'bold' }}>
        ההרשמה הושלמה בהצלחה! 🎉
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        ברוך הבא {formData.firstName} {formData.lastName}!
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        החשבון שלך נוצר בהצלחה. אתה יכול כעת להתחיל להשתמש במערכת.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          icon={<EmailIcon />}
          label={formData.email}
          variant="outlined"
          size="small"
          color="primary"
        />
        <Chip
          icon={<WorkIcon />}
          label={formData.role === 'תלמיד' ? 'תלמיד' : 
                formData.role === 'מורה' ? 'מורה' : 
                formData.role === 'מנהל' ? 'מנהל' : 'מנהל מערכת'}
          variant="outlined"
          size="small"
          color="secondary"
        />
      </Box>
    </motion.div>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={registrationStep === 'loading' ? undefined : onClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            }
          }
        }}
      >
        {/* כפתור סגירה */}
        {registrationStep !== 'loading' && (
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                background: 'rgba(255,255,255,0.9)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <DialogContent sx={{ 
          p: 4,
          position: 'relative',
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <AnimatePresence mode="wait">
            {registrationStep === 'form' && renderRegistrationForm()}
            {registrationStep === 'loading' && renderLoadingState()}
            {registrationStep === 'success' && renderSuccessState()}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* התראות */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};
UserRegistrationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRegistrationSuccess: PropTypes.func
};

UserRegistrationDialog.defaultProps = {
  onRegistrationSuccess: () => {}
};
export default UserRegistrationDialog;
