import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)({
  borderRadius: '15px',
  padding: '40px',
  background: 'linear-gradient(135deg, #4B6CB7, #182848)', // כחול כהה עם גווני אפור
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  animation: 'fadeIn 1.5s ease-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
});

const StyledButton = styled(Button)({
  marginTop: '20px',
  padding: '12px 20px',
  borderRadius: '25px',
  backgroundColor: '#6DBF8A', // ירוק כהה
  color: '#fff',
  '&:hover': {
    backgroundColor: '#5a9f77', // ירוק כהה יותר
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
  },
  transition: 'all 0.3s ease',
});

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease',
  },
  '&:focus-within .MuiInputBase-root': {
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // צל חזק יותר כשיש פוקוס
  },
  marginBottom: '20px',
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      //  background: '#f0f0f0', // רקע בהיר ומרגיע
      }}
    >
      <Container maxWidth="xs">
        <StyledPaper>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
            Sign In
          </Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: '30px', color: '#ddd' }}>
            Manage your activities with ease
          </Typography>

          <form onSubmit={handleSubmit}>
            <StyledTextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <StyledTextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <StyledButton type="submit" fullWidth>
              Log In
            </StyledButton>
          </form>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default Login;
