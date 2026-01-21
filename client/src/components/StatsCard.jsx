import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const StatsCard = ({ 
  label, 
  value, 
  note, 
  bg, 
  icon: IconComp, 
  iconBg,
  numberAlign = 'center' 
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.75,
        borderRadius: 1.75,
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.6,
        minHeight: 110,
        width: '100%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        transform: 'translateZ(0)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 32px rgba(0,0,0,0.08)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Box sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: iconBg,
          display: 'grid',
          placeItems: 'center'
        }}>
          <IconComp sx={{ fontSize: 18, color: '#0f172a' }} />
        </Box>
      </Box>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 800, 
          color: '#0f172a', 
          lineHeight: 1,
          textAlign: numberAlign
        }}
      >
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {note}
      </Typography>
    </Paper>
  );
};

export default StatsCard;
