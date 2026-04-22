import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { selectCurrentUser, setCurrentUser } from '../../store/user/userSlice';
import LoginDialog from './LogInDialog';
import UserRegistrationDialog from './UserRegistrationDialog';

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [showRegistration, setShowRegistration] = useState(false);

  // שחזור משתמש מ-localStorage בטעינה ראשונית
  useEffect(() => {
    if (!currentUser) {
      try {
        const saved = localStorage.getItem('currentUser');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            dispatch(setCurrentUser(parsed));
          }
        }
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    dispatch(setCurrentUser(userData));
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setShowRegistration(false);
  };

  if (currentUser) {
    return children;
  }

  return (
    <>
      {/* האפליקציה האמיתית ברקע — מטושטשת ולא ניתנת ללחיצה */}
      <Box sx={{
        filter: 'blur(3px)',
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        maxHeight: '100vh',
        opacity: 0.7,
      }}>
        {children}
      </Box>

      {/* Overlay כהה מעל הרקע */}
      <Box sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(15, 23, 42, 0.45)',
        zIndex: 1200,
      }} />

      {/* דיאלוג התחברות — נסגר כשרישום פתוח */}
      <LoginDialog
        open={!showRegistration}
        onClose={() => {}}
        onLoginSuccess={handleLoginSuccess}
        onLoginError={() => setShowRegistration(true)}
        disableClose
      />

      {/* דיאלוג רישום — ללא backdrop משלו, הרקע המטושטש מ-AuthGuard נשאר גלוי */}
      <UserRegistrationDialog
        open={showRegistration}
        onClose={() => setShowRegistration(false)}
        hideBackdrop
        onRegistrationSuccess={(userData) => {
          if (userData) handleLoginSuccess(userData);
          setShowRegistration(false);
        }}
      />
    </>
  );
};

export default AuthGuard;

