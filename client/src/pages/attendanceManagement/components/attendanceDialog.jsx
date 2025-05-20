import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Button, IconButton, Grid, Divider,
  List, ListItem, ListItemText, ListItemIcon, Avatar,
  Checkbox, TextField, Chip, Paper, useMediaQuery, useTheme
} from '@mui/material';
import { 
  Close, Group, CheckCircle, Cancel, Save, Comment,
  Person, Check, AccessTime, LocationOn, School
} from '@mui/icons-material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { styles } from '../styles/dialogStyles';

const AttendanceDialog = ({ 
  open, 
  onClose, 
  selectedDate, 
  selectedCourse, 
  selectedBranch, 
  selectedGroup, 
  students, 
  attendanceData, 
  onAttendanceChange, 
  onSave 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [note, setNote] = useState('');
  
  // Calculate attendance stats
  const presentCount = students ? Object.values(attendanceData).filter(present => present).length : 0;
  const totalStudents = students ? students.length : 0;
  const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
  
  // Mark all students as present
  const markAllPresent = () => {
    const allPresent = {};
    students.forEach(student => {
      allPresent[student.id] = true;
    });
    
    // Update all students at once
    Object.keys(allPresent).forEach(studentId => {
      onAttendanceChange(parseInt(studentId));
    });
  };
  
  // Mark all students as absent
  const markAllAbsent = () => {
    const allAbsent = {};
    students.forEach(student => {
      allAbsent[student.id] = false;
    });
    
    // Update all students at once
    Object.keys(allAbsent).forEach(studentId => {
      if (attendanceData[studentId]) { // Only change if currently present
        onAttendanceChange(parseInt(studentId));
      }
    });
  };
  
  // Handle save with note
  const handleSave = () => {
    onSave(note);
    setNote('');
  };
  
  if (!selectedCourse || !selectedBranch || !selectedGroup || !selectedDate) {
    return null;
  }
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={styles.dialog}
      PaperProps={{ sx: styles.dialogPaper }}
    >
      <DialogTitle sx={styles.attendanceDialogTitle}>
        <Box sx={styles.dialogTitleContent}>
          <Typography variant="h6" sx={styles.dialogTitleText}>
            רישום נוכחות: {selectedCourse.couresName} - קבוצה {selectedGroup.groupName}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            sx={styles.closeButton}
          >
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={styles.dialogSubtitle}>
          {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: he })} | {selectedGroup.hour ? selectedGroup.hour.toString() : ''}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={styles.dialogContent}>
        <Paper sx={styles.courseInfoPaper}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={styles.courseInfoItem}>
                <School fontSize="small" sx={styles.infoIcon} />
                <Typography variant="body2" sx={styles.infoLabel}>
                  <strong>חוג:</strong> {selectedCourse.couresName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={styles.courseInfoItem}>
                <Group fontSize="small" sx={styles.infoIcon} />
                <Typography variant="body2" sx={styles.infoLabel}>
                  <strong>קבוצה:</strong> {selectedGroup.groupName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={styles.courseInfoItem}>
                <LocationOn fontSize="small" sx={styles.infoIcon} />
                <Typography variant="body2" sx={styles.infoLabel}>
                  <strong>סניף:</strong> {selectedBranch.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={styles.courseInfoItem}>
                <AccessTime fontSize="small" sx={styles.infoIcon} />
                <Typography variant="body2" sx={styles.infoLabel}>
                  <strong>שעה:</strong> {selectedGroup.hour ? selectedGroup.hour.toString() : ''}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Box sx={styles.attendanceHeader}>
          <Typography variant="subtitle1" sx={styles.studentsListTitle}>
            <Person sx={styles.titleIcon} />
            רשימת תלמידים
          </Typography>
          
          <Box sx={styles.attendanceActions}>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<CheckCircle />}
              onClick={markAllPresent}
              sx={styles.markAllButton}
            >
              סמן הכל כנוכחים
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<Cancel />}
              onClick={markAllAbsent}
              sx={styles.markAllButton}
            >
              סמן הכל כנעדרים
            </Button>
          </Box>
        </Box>
                <Paper sx={styles.studentsListPaper}>
          <List sx={styles.studentsList}>
            {students.map((student, index) => (
              <React.Fragment key={student.id}>
                <ListItem
                  sx={`${styles.studentListItem} ${index % 2 === 0 ? styles.evenRow : ''}`}
                >
                  <ListItemIcon sx={styles.studentAvatar}>
                    <Avatar 
                      src={student.imageUrl} 
                      sx={`${styles.avatar} ${attendanceData[student.id] ? styles.presentAvatar : styles.absentAvatar}`}
                    >
                      {student.name.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={student.name}
                    secondary={
                      <Box sx={styles.studentDetails}>
                        <Typography variant="body2" component="span" sx={styles.studentAge}>
                          גיל: {student.age}
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={styles.detailDivider} />
                        <Chip
                          label={`נוכחות: ${student.attendanceRate}%`}
                          size="small"
                          color={
                            student.attendanceRate > 90 ? 'success' :
                            student.attendanceRate > 75 ? 'primary' :
                            student.attendanceRate > 60 ? 'warning' : 'error'
                          }
                          sx={styles.attendanceRateChip}
                        />
                      </Box>
                    }
                    sx={styles.studentText}
                  />
                  <Checkbox
                    edge="end"
                    checked={attendanceData[student.id] || false}
                    onChange={() => onAttendanceChange(student.id)}
                    icon={<Cancel color="error" />}
                    checkedIcon={<CheckCircle color="success" />}
                    sx={styles.attendanceCheckbox}
                  />
                </ListItem>
                {index < students.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
        
        <Box sx={styles.noteSection}>
          <Typography variant="subtitle2" sx={styles.noteSectionTitle}>
            <Comment sx={styles.titleIcon} />
            הערות לשיעור
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="הוסף הערות לגבי השיעור, התקדמות התלמידים, או כל מידע רלוונטי אחר..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            variant="outlined"
            sx={styles.noteTextField}
          />
        </Box>
        
        <Box sx={styles.attendanceStats}>
          <Typography variant="body2" sx={styles.statsText}>
            סה"כ נוכחים: {presentCount} מתוך {totalStudents} ({attendancePercentage}%)
          </Typography>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${attendancePercentage}%` }}
            transition={{ duration: 0.5 }}
            sx={`${styles.progressBar} ${
              attendancePercentage > 80 ? styles.highAttendance :
              attendancePercentage > 60 ? styles.mediumAttendance :
              styles.lowAttendance
            }`}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={styles.dialogActions}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          sx={styles.cancelButton}
        >
          ביטול
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          sx={styles.saveButton}
          onClick={handleSave}
        >
          שמור נוכחות
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceDialog;

