      import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  Avatar,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Login as LoginIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { getUserById } from '../../store/user/userGetByIdThunk';

const LoginDialog = ({ open, onClose, onLoginSuccess }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { loading } = useSelector(state => state.users);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginStep, setLoginStep] = useState('input'); // 'input', 'loading', 'success'
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // איפוס הטופס כשהדיאלוג נפתח
  useEffect(() => {
    if (open) {
      setPassword('');
      setShowPassword(false);
      setErrors({});
      setLoginStep('input');
      setAuthenticatedUser(null);
    }
  }, [open]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!password.trim()) {
      newErrors.password = 'סיסמה היא שדה חובה';
    } else if (password.length < 4) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 4 תווים';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoginStep('loading');
      setErrors({});

      const result = await dispatch(getUserById(password.trim())).unwrap();
      const validUser = Array.isArray(result) ? result[0] : result;

      if (!validUser || typeof validUser !== 'object') {
        throw new Error('לא נמצאו נתוני משתמש תקינים');
      }

      setAuthenticatedUser(validUser);
      setLoginStep('success');

      setTimeout(() => {
        onLoginSuccess(validUser);
        onClose();
        setLoginStep('input');
        setAuthenticatedUser(null);
      }, 400);
    } catch (error) {
      let errorMessage = 'סיסמה שגויה. אנא נסה שוב.';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setErrors({ password: errorMessage });
      setLoginStep('input');
    }
  };

  // ✅ פונקציה לקבלת שם המשתמש
  const getUserDisplayName = () => {
    const user = authenticatedUser;
    if (!user) return 'משתמש';
    
    if (user.FirstName || user.LastName) {
      return `${user.FirstName || ''} ${user.LastName || ''}`.trim();
    }
    
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    
    if (user.Email || user.email) {
      return user.Email || user.email;
    }
    
    return 'משתמש';
  };

  const renderLoginForm = () => (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (loginStep === 'input' && !loading) {
          handleLogin();
        }
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
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
            <SchoolIcon sx={{ fontSize: 32 }} />
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
          התחברות למערכת
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          הכנס את הסיסמה שלך כדי להיכנס למערכת
        </Typography>
      </Box>

      {errors.password && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errors.password}
          </Alert>
        </motion.div>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          name="password"
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          placeholder="הכנס סיסמה"
          value={password}
          onChange={handlePasswordChange}
          error={!!errors.password}
          helperText={errors.password}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color={errors.password ? 'error' : 'primary'} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading} // ✅ השבת כפתור בזמן טעינה
        startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
        sx={{
          borderRadius: 2,
          py: 1.5,
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
        {loading ? 'מתחבר...' : 'התחבר למערכת'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Chip
          icon={<SecurityIcon />}
          label="חיבור מאובטח"
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
    </motion.form>
  );

  const renderLoadingState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ textAlign: 'center', padding: '20px' }}
    >
      <CircularProgress 
        size={50} 
        thickness={4}
        sx={{ 
          color:
 'primary.main',
          mb: 2
        }}
      />
      <Typography variant="h6" sx={{ mb: 1 }}>
        ...מתחבר למערכת
      </Typography>
      <Typography variant="body2" color="text.secondary">
        אנא המתן בזמן שאנו מאמתים את הפרטים שלך
      </Typography>
    </motion.div>
  );

  const renderSuccessState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{ textAlign: 'center', padding: '20px'}}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <CheckCircleIcon 
          sx={{ 
            fontSize: 60, 
            color: 'success.main',
            mb: 2
          }} 
        />
      </motion.div>
      
      <Typography variant="h6" sx={{ mb: 1, color: 'success.main' }}>
       🎉 ! התחברות הושלמה בהצלחה
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        ! שלום {getUserDisplayName()}
      </Typography>
      
      <Typography variant="body2" color="text.secondary">
       ... מעביר אותך למערכת
      </Typography>
    </motion.div>
  );

  return (
    <Dialog
      open={open}
      onClose={loginStep === 'loading' ? undefined : onClose} // ✅ מנע סגירה בזמן טעינה
      disableRestoreFocus
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
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
      {loginStep !== 'loading' && (
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

      <DialogContent
        sx={{ 
        p: 4,
        position: 'relative',
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <AnimatePresence mode="wait">
          {loginStep === 'input' && renderLoginForm()}
          {loginStep === 'loading' && renderLoadingState()}
          {loginStep === 'success' && renderSuccessState()}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
