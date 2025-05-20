import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Button, IconButton, Grid, Card,
  CardContent, CardHeader, Avatar, List, ListItem,
  ListItemText, ListItemIcon, Collapse, Divider,
  Paper, useMediaQuery, useTheme
} from '@mui/material';
import { 
  Close, School, LocationOn, Group, ExpandMore, 
  ExpandLess, NavigateNext, AccessTime, Person
} from '@mui/icons-material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { styles } from '../styles/dialogStyles';

const CourseSelectionDialog = ({ 
  open, 
  onClose, 
  selectedDate, 
  courses, 
  branches, 
  groups, 
  onCourseSelect, 
  onBranchSelect, 
  onGroupSelect 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [step, setStep] = useState(1); // 1: Courses, 2: Branches, 3: Groups
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedCourse(null);
      setSelectedBranch(null);
      setExpandedBranch(null);
    }
  }, [open]);
  
  // Filter groups when course or branch is selected
  useEffect(() => {
    if (step === 3 && selectedCourse && selectedBranch) {
      // Filter groups by course and branch
      const filtered = groups.filter(group => 
        group.courseId === selectedCourse.courseId && 
        group.branchId === selectedBranch.branchId &&
        // Filter by day of week matching the selected date
        group.dayOfWeek === getDayOfWeekHebrew(selectedDate)
      );
      setFilteredGroups(filtered);
    }
  }, [step, selectedCourse, selectedBranch, groups, selectedDate]);
  
    // Helper to get Hebrew day of week
  const getDayOfWeekHebrew = (date) => {
    const dayIndex = date.getDay();
    const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    return hebrewDays[dayIndex];
  };
  
  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    onCourseSelect(course);
    setStep(2);
  };
  
  // Handle branch selection
  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    onBranchSelect(branch);
    setStep(3);
  };
  
  // Handle group selection
  const handleGroupSelect = (group) => {
    onGroupSelect(group);
    onClose();
  };
  
  // Handle branch expansion toggle
  const handleToggleBranch = (branchName) => {
    setExpandedBranch(expandedBranch === branchName ? null : branchName);
  };
  
  // Handle back button
  const handleBack = () => {
    if (step === 3) {
      setStep(2);
      setSelectedBranch(null);
    } else if (step === 2) {
      setStep(1);
      setSelectedCourse(null);
    }
  };
  
  // Render dialog title
  const renderDialogTitle = () => {
    let title = '';
    
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'EEEE, d MMMM yyyy', { locale: he });
      
      if (step === 1) {
        title = `בחירת חוג ליום ${formattedDate}`;
      } else if (step === 2) {
        title = `בחירת סניף: ${selectedCourse.couresName}`;
      } else if (step === 3) {
        title = `בחירת קבוצה: ${selectedCourse.couresName} - ${selectedBranch.name}`;
      }
    }
    
    return (
      <DialogTitle sx={styles.dialogTitle}>
        <Box sx={styles.dialogTitleContent}>
          <Typography variant="h6" sx={styles.dialogTitleText}>
            {title}
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
        {step > 1 && (
          <Button
            startIcon={<NavigateNext sx={styles.backButtonIcon} />}
            onClick={handleBack}
            sx={styles.backButton}
          >
            חזור
          </Button>
        )}
      </DialogTitle>
    );
  };
  
  // Render courses selection
  const renderCoursesSelection = () => {
    return (
      <Grid container spacing={2} sx={styles.selectionGrid}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.courseId}>
            <Card 
              component={motion.div}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              sx={styles.courseCard}
              onClick={() => handleCourseSelect(course)}
            >
              <CardContent sx={styles.courseCardContent}>
                <Avatar sx={styles.courseAvatar}>
                  <School />
                </Avatar>
                <Typography variant="h6" sx={styles.courseName}>
                  {course.couresName}
                </Typography>
                <Typography variant="body2" sx={styles.courseDescription}>
                  {course.description || 'אין תיאור'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  // Render branches selection
  const renderBranchesSelection = () => {
    // Filter branches that have groups for the selected course
    const branchesWithCourse = branches.filter(branch => 
      groups.some(group => 
        group.courseId === selectedCourse.courseId && 
        group.branchId === branch.branchId
      )
    );
    
    return (
      <List sx={styles.branchesList}>
        {branchesWithCourse.map((branch) => (
          <Paper 
            key={branch.branchId} 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            sx={styles.branchItem}
          >
            <ListItem 
              button 
              onClick={() => handleBranchSelect(branch)}
              sx={styles.branchListItem}
            >
              <ListItemIcon sx={styles.branchIcon}>
                <LocationOn color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={branch.name} 
                secondary={branch.city}
                sx={styles.branchText}
              />
              <NavigateNext sx={styles.nextIcon} />
            </ListItem>
          </Paper>
        ))}
      </List>
    );
  };
  
  // Render groups selection
  const renderGroupsSelection = () => {
    return (
      <List sx={styles.groupsList}>
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <Paper 
              key={group.groupId} 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              sx={styles.groupItem}
            >
              <ListItem 
                button 
                onClick={() => handleGroupSelect(group)}
                sx={styles.groupListItem}
              >
                <ListItemIcon sx={styles.groupIcon}>
                  <Group color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={`קבוצה ${group.groupName}`}
                  secondary={
                    <Box sx={styles.groupDetails}>
                      <Box sx={styles.groupDetail}>
                        <AccessTime fontSize="small" sx={styles.detailIcon} />
                        <Typography variant="body2" component="span">
                          {group.hour ? group.hour.toString() : 'שעה לא צוינה'}
                        </Typography>
                      </Box>
                      <Box sx={styles.groupDetail}>
                        <Person fontSize="small" sx={styles.detailIcon} />
                        <Typography variant="body2" component="span">
                          {group.maxStudents || '?'} תלמידים
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={styles.groupText}
                />
                <NavigateNext sx={styles.nextIcon} />
              </ListItem>
            </Paper>
          ))
        ) : (
          <Box sx={styles.noGroupsContainer}>
            <Typography variant="body1" sx={styles.noGroupsText}>
              אין קבוצות זמינות ביום זה עבור החוג והסניף שנבחרו
            </Typography>
          </Box>
        )}
      </List>
    );
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={styles.dialog}
      PaperProps={{ sx: styles.dialogPaper }}
    >
      {renderDialogTitle()}
      
      <DialogContent sx={styles.dialogContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && renderCoursesSelection()}
            {step === 2 && renderBranchesSelection()}
            {step === 3 && renderGroupsSelection()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
      
      <DialogActions sx={styles.dialogActions}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="primary"
          sx={styles.cancelButton}
        >
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseSelectionDialog;
