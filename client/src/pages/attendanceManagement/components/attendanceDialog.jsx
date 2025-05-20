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
      className={styles.dialog}
      PaperProps={{ className: styles.dialogPaper }}
    >
      <DialogTitle className={styles.attendanceDialogTitle}>
        <Box className={styles.dialogTitleContent}>
          <Typography variant="h6" className={styles.dialogTitleText}>
            רישום נוכחות: {selectedCourse.couresName} - קבוצה {selectedGroup.groupName}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            className={styles.closeButton}
          >
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" className={styles.dialogSubtitle}>
          {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: he })} | {selectedGroup.hour ? selectedGroup.hour.toString() : ''}
        </Typography>
      </DialogTitle>
      
      <DialogContent className={styles.dialogContent}>
        <Paper className={styles.courseInfoPaper}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box className={styles.courseInfoItem}>
                <School fontSize="small" className={styles.infoIcon} />
                <Typography variant="body2" className={styles.infoLabel}>
                  <strong>חוג:</strong> {selectedCourse.couresName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className={styles.courseInfoItem}>
                <Group fontSize="small" className={styles.infoIcon} />
                <Typography variant="body2" className={styles.infoLabel}>
                  <strong>קבוצה:</strong> {selectedGroup.groupName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className={styles.courseInfoItem}>
                <LocationOn fontSize="small" className={styles.infoIcon} />
                <Typography variant="body2" className={styles.infoLabel}>
                  <strong>סניף:</strong> {selectedBranch.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className={styles.courseInfoItem}>
                <AccessTime fontSize="small" className={styles.infoIcon} />
                <Typography variant="body2" className={styles.infoLabel}>
                  <strong>שעה:</strong> {selectedGroup.hour ? selectedGroup.hour.toString() : ''}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Box className={styles.attendanceHeader}>
          <Typography variant="subtitle1" className={styles.studentsListTitle}>
            <Person className={styles.titleIcon} />
            רשימת תלמידים
          </Typography>
          
          <Box className={styles.attendanceActions}>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<CheckCircle />}
              onClick={markAllPresent}
              className={styles.markAllButton}
            >
              סמן הכל כנוכחים
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<Cancel />}
              onClick={markAllAbsent}
              className={styles.markAllButton}
            >
              סמן הכל כנעדרים
            </Button>
          </Box>
        </Box>
                <Paper className={styles.studentsListPaper}>
          <List className={styles.studentsList}>
            {students.map((student, index) => (
              <React.Fragment key={student.id}>
                <ListItem
                  className={`${styles.studentListItem} ${index % 2 === 0 ? styles.evenRow : ''}`}
                >
                  <ListItemIcon className={styles.studentAvatar}>
                    <Avatar 
                      src={student.imageUrl} 
                      className={`${styles.avatar} ${attendanceData[student.id] ? styles.presentAvatar : styles.absentAvatar}`}
                    >
                      {student.name.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={student.name}
                    secondary={
                      <Box className={styles.studentDetails}>
                        <Typography variant="body2" component="span" className={styles.studentAge}>
                          גיל: {student.age}
                        </Typography>
                        <Divider orientation="vertical" flexItem className={styles.detailDivider} />
                        <Chip
                          label={`נוכחות: ${student.attendanceRate}%`}
                          size="small"
                          color={
                            student.attendanceRate > 90 ? 'success' :
                            student.attendanceRate > 75 ? 'primary' :
                            student.attendanceRate > 60 ? 'warning' : 'error'
                          }
                          className={styles.attendanceRateChip}
                        />
                      </Box>
                    }
                    className={styles.studentText}
                  />
                  <Checkbox
                    edge="end"
                    checked={attendanceData[student.id] || false}
                    onChange={() => onAttendanceChange(student.id)}
                    icon={<Cancel color="error" />}
                    checkedIcon={<CheckCircle color="success" />}
                    className={styles.attendanceCheckbox}
                  />
                </ListItem>
                {index < students.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
        
        <Box className={styles.noteSection}>
          <Typography variant="subtitle2" className={styles.noteSectionTitle}>
            <Comment className={styles.titleIcon} />
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
            className={styles.noteTextField}
          />
        </Box>
        
        <Box className={styles.attendanceStats}>
          <Typography variant="body2" className={styles.statsText}>
            סה"כ נוכחים: {presentCount} מתוך {totalStudents} ({attendancePercentage}%)
          </Typography>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${attendancePercentage}%` }}
            transition={{ duration: 0.5 }}
            className={`${styles.progressBar} ${
              attendancePercentage > 80 ? styles.highAttendance :
              attendancePercentage > 60 ? styles.mediumAttendance :
              styles.lowAttendance
            }`}
          />
        </Box>
      </DialogContent>
      
      <DialogActions className={styles.dialogActions}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          className={styles.cancelButton}
        >
          ביטול
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          className={styles.saveButton}
          onClick={handleSave}
        >
          שמור נוכחות
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceDialog;

