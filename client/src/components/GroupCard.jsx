import React from 'react';
import { Box, Typography, Divider, Chip, Button, Tooltip, IconButton, Paper } from '@mui/material';
import GroupIcon from '@mui/icons-material/Groups';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DayIcon from '@mui/icons-material/CalendarToday';
import StudentIcon from '@mui/icons-material/ChildCare';
import SectorIcon from '@mui/icons-material/Apartment';
import AvailableIcon from '@mui/icons-material/CheckCircleOutline';
import FullIcon from '@mui/icons-material/Cancel';
import ViewIcon from '@mui/icons-material/Visibility';
import EnrollIcon from '@mui/icons-material/PersonAddAlt';
import { motion } from 'framer-motion';

const GroupCard = ({
  group,
  instructor,
  handleViewStudents,
  handleAddStudentAndEnroll,
  handleGroupSelect,
  exportGroupStudentsToExcel,
  dispatch,
  handleMenuOpen,
  itemVariants
}) => {
  // רקע קבוע ניטרלי-ורדרד לכל הכרטיסים
  const background = 'linear-gradient(135deg, #ff9af700 0%, #feffff 100%)';

  return (
    <Paper
      elevation={3}
      component={motion.div}
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      sx={{
        p: 3,
        borderRadius: 3,
        height: '100%',
        width: 320,
        minWidth: 320,
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        background,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        direction: 'rtl',
        textAlign: 'right',
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        }
      }}
      onClick={() => {
        if (handleGroupSelect && typeof handleGroupSelect === 'function') {
          handleGroupSelect(group);
        }
      }}
    >
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          exportGroupStudentsToExcel(group.groupId, group.groupName, dispatch);
        }}
        sx={{
          position: 'absolute',
          top: 8,
          left: 40,
          color: '#3B82F6',
          bgcolor: 'rgba(59, 130, 246, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(59, 130, 246, 0.2)',
          },
          zIndex: 10
        }}
        size="small"
      >
        <Tooltip title="ייצוא לאקסל">
          <FileDownloadIcon fontSize="small" />
        </Tooltip>
      </IconButton>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleMenuOpen(e, group, 'group');
        }}
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          color: '#6b7280',
          bgcolor: 'rgba(107, 114, 128, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(107, 114, 128, 0.2)',
          },
          zIndex: 10
        }}
        size="small"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'flex-start' }}>
        <GroupIcon sx={{ fontSize: 32, color: '#6366F1', ml: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="#1E3A8A" component="span">
          <span style={{wordBreak: 'break-word', whiteSpace: 'pre-line'}}>
            קבוצה {group.groupName}
          </span>
        </Typography>
      </Box>
      {/* סטטוס פעיל/לא פעיל - מתחת לשם הקבוצה */}
      {!group.isActive && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Chip
            label="⏸️ לא פעיל"
            size="medium"
            sx={{
              bgcolor: 'rgba(107, 114, 128, 0.2)',
              color: '#6b7280',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: '1.5px solid #9ca3af',
              animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.6 }
              }
            }}
          />
        </Box>
      )}
      <Divider sx={{ width: '100%', mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
        <DayIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
        <Typography variant="body2" component="span">
          {group.hour} {group.dayOfWeek}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
        <StudentIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
        <Typography variant="body2" component="span">
          גילאים: {group.ageRange}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
        <SectorIcon fontSize="small" sx={{ color: '#6366F1', ml: 1 }} />
        <Typography variant="body2" component="span">
          מגזר: {group.sector || 'כללי'}
        </Typography>
      </Box>
      <Box sx={{ mt: 'auto', pt: 2, width: '100%' }}>
        {/* שורה ראשונה: מקומות פנויים */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 ,direction:'ltr'}}>
          <Chip
            icon={group.maxStudents > 0 ? <AvailableIcon /> : <FullIcon />}
            label={`${group.maxStudents} מקומות פנויים`}
            color={group.maxStudents > 0 ? "success" : "error"}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiChip-icon': {
                bgcolor: group.maxStudents > 0 ? '#22c55e' : '#ef4444',
                color: 'white',
                borderRadius: '50%',
                padding: '4px',
                width: '24px',
                height: '24px'
              }
            }}
          />
        </Box>
        {/* שורה שנייה: צפה ברשימת התלמידים */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ViewIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewStudents(group);
            }}
            sx={{
              direction:'ltr',
              borderColor: '#6366F1',
              color: '#6366F1',
              borderRadius: '8px',
              px: 2,
              '&:hover': {
                borderColor: '#4f46e5',
                color: '#4f46e5',
                bgcolor: 'rgba(99, 102, 241, 0.1)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            צפה ברשימת התלמידים בקבוצה זו
          </Button>
        </Box>
        {/* שורה שלישית: כפתור שיבוץ תלמיד */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Tooltip title={group.maxStudents > 0 ? "לחץ לשיבוץ תלמיד" : "אין מקומות פנויים"}>
            <span>
              <Button
                variant="contained"
                size="small"
                disabled={group.maxStudents <= 0}
                startIcon={<EnrollIcon />}
                sx={{
                  direction:'ltr',
                  bgcolor: group.maxStudents > 0 ? '#10B981' : 'grey.400',
                  borderRadius: '8px',
                  boxShadow: group.maxStudents > 0 ? '0 4px 10px rgba(16, 185, 129, 0.2)' : 'none',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    bgcolor: group.maxStudents > 0 ? '#059669' : 'grey.400',
                    boxShadow: group.maxStudents > 0 ? '0 6px 15px rgba(16, 185, 129, 0.3)' : 'none',
                  },
                  transition: 'all 0.3s ease'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('🔘 Enroll button clicked, handleGroupSelect:', typeof handleGroupSelect, 'group:', group);
                  if (handleGroupSelect && typeof handleGroupSelect === 'function') {
                    handleGroupSelect(group);
                  } else {
                    console.error('❌ handleGroupSelect is not a function:', handleGroupSelect);
                  }
                }}
              >
                שבץ תלמיד חדש/קיים לקבוצה זו
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

export default GroupCard;
