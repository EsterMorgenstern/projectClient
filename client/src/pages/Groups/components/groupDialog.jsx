import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, Box, Typography, Chip, Button, IconButton, Divider
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

  const GroupDialog = ({ open, onClose, group }) => {
  try {
    console.log('GroupDialog props:', { open, onClose, group });
  } catch (e) {
    console.warn('Failed to log dialog props:', e);
  }
    const [showStudents, setShowStudents] = React.useState(false);
    if (!group) return null;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            border: '3px solid #6366f1',
            boxShadow: '0 8px 32px rgba(59,130,246,0.18)',
            transition: 'transform 0.3s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.3s',
            transform: open ? 'scale(1)' : 'scale(0.95)',
            opacity: open ? 1 : 0.7,
            background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)',
            position: 'relative',
            minWidth: 600,
            maxWidth: 900,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#3b82f6', fontWeight: 'bold', fontSize: '1.5rem', position: 'relative', pb: 2 }}>
          <IconButton
            aria-label="סגור"
            onClick={onClose}
            sx={{ position: 'absolute', left: 16, top: 16, color: '#6366f1', background: '#f0f4ff', boxShadow: 1 }}
          >
            <span style={{ fontSize: 22, fontWeight: 'bold' }}>&times;</span>
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <GroupIcon sx={{ fontSize: 32, color: '#6366f1' }} />
            {group.groupName}
          </Box>
        </DialogTitle>
        <Box sx={{ px: 3, pt: 1 }}>
          <Typography variant="subtitle1" sx={{ color: '#6366f1', mt: 1, textAlign: 'center' }}>
            חוג: {group.courseName} • סניף: {group.branchName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6366f1', mt: 1, textAlign: 'center' }}>
            מדריך: {group.instructorName}
          </Typography>
        </Box>
        <DialogContent>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
              יום ושעה: {group.schedule}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
              טווח גילאים: {group.ageRange || '---'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
              מגזר: {group.sector || '---'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
              מספר שיעורים: {group.numOfLessons}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
              שיעורים שהושלמו: {group.lessonsCompleted}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
              תאריך התחלה: {group.startDate ? new Date(group.startDate).toLocaleDateString('he-IL') : '---'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Chip
              label={` מקומות פנויים ${group.maxStudents || 0}`}
              color="success"
              icon={<CheckIcon />}
              sx={{ fontWeight: 'bold', fontSize: '1rem', px: 2 }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              fullWidth
              onClick={() => setShowStudents((prev) => !prev)}
              sx={{
                color: '#6366f1',
                borderColor: '#6366f1',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              {showStudents ? 'הסתר רשימת תלמידים' : 'צפה ברשימת התלמידים בקבוצה זו'}
            </Button>
          </Box>
          {showStudents && group.students && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mb: 2 }}>
              {group.students.map((student, idx) => (
                <Box key={student.studentId || idx} sx={{
                  background: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 8px 24px rgba(59,130,246,0.08)',
                  border: '2px solid #e0e7ff',
                  minWidth: 280,
                  maxWidth: 320,
                  p: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  direction: 'rtl'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>{student.studentName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    🆔 ת"ז: {student.studentId}
                  </Typography>
                  {student.phone && (
                    <Typography variant="body2" color="text.secondary">
                      📞 טלפון: {student.phone}
                    </Typography>
                  )}
                  {student.city && (
                    <Typography variant="body2" color="text.secondary">
                      🏙️ עיר: {student.city}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    );
}

export default GroupDialog;