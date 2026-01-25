import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Autocomplete,
  FormControlLabel
} from '@mui/material';
import {
  Info as InfoIcon,
  School as CourseIcon,
  LocationOn as BranchIcon,
  Group as GroupIcon,
  CalendarMonth as DayIcon,
  Diversity3 as SectorIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

const allowedDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'];
const allowedSectors = ['כללי', 'חסידי', 'גור', 'ליטאי'];

export const CourseDialog = ({ open, values, onChange, onSubmit, onClose, onReset, isEdit }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        borderRadius: 2,
        minWidth: { xs: '90%', sm: '400px' },
        overflow: 'hidden'
      }
    }}
  >
    <DialogTitle
      sx={{
        bgcolor: '#3B82F6',
        color: 'white',
        textAlign: 'center',
        py: 2
      }}
    >
      {isEdit ? 'עריכת חוג' : 'הוספת חוג חדש'}
    </DialogTitle>
    <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
      <Box sx={{ mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(59, 130, 246, 0.1)'
          }}
        >
          <CourseIcon sx={{ fontSize: 35, color: '#3B82F6' }} />
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          bgcolor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 2,
          p: 2,
          mb: 3,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#059669',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <InfoIcon sx={{ fontSize: 18 }} />
          הנתונים נשמרים אוטומטית - תוכל לעבור ללשוניות אחרות ולחזור
        </Typography>
      </Paper>

      <TextField
        autoFocus
        margin="dense"
        label="שם החוג"
        type="text"
        fullWidth
        variant="outlined"
        sx={{ 
          mb: 2,
          '& .MuiOutlinedInput-notchedOutline legend': {
            textAlign: 'right'
          }
        }}
        inputProps={{ dir: 'rtl' }}
        InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
        value={values.couresName}
        onChange={(e) => onChange('couresName', e.target.value)}
      />
      <TextField
        margin="dense"
        label="תיאור החוג"
        type="text"
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        sx={{ 
          mb: 2,
          '& .MuiOutlinedInput-notchedOutline legend': {
            textAlign: 'right'
          }
        }}
        inputProps={{ dir: 'rtl' }}
        InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
        value={values.description}
        onChange={(e) => onChange('description', e.target.value)}
      />
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'ltr' }}>
      <Button
        onClick={onClose}
        variant="outlined"
        color="error"
        sx={{
          borderRadius: '8px',
          px: 3,
          py: 1,
          borderWidth: '2px'
        }}
      >
        ביטול
      </Button>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          onClick={onReset}
          variant="outlined"
          color="warning"
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            borderWidth: '2px',
            color: '#f59e0b',
            borderColor: '#f59e0b'
          }}
        >
          איפוס טופס
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            bgcolor: '#3B82F6',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
          }}
          onClick={onSubmit}
        >
          {isEdit ? 'עדכן חוג' : 'הוסף חוג'}
        </Button>
      </Box>
    </DialogActions>
  </Dialog>
);

export const BranchDialog = ({ open, values, onChange, onSubmit, onClose, onReset, isEdit }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        direction: 'rtl',
        borderRadius: 2,
        minWidth: { xs: '90%', sm: '400px' },
        overflow: 'hidden'
      }
    }}
  >
    <DialogTitle
      sx={{
        bgcolor: '#10B981',
        color: 'white',
        textAlign: 'center',
        py: 2
      }}
    >
      {isEdit ? 'עריכת סניף' : 'הוספת סניף חדש'}
    </DialogTitle>
    <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
      <Box sx={{ mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(16, 185, 129, 0.1)'
          }}
        >
          <BranchIcon sx={{ fontSize: 35, color: '#10B981' }} />
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          bgcolor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 2,
          p: 2,
          mb: 3,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#059669',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <InfoIcon sx={{ fontSize: 18 }} />
          הנתונים נשמרים אוטומטית - תוכל לעבור ללשוניות אחרות ולחזור
        </Typography>
      </Paper>

      <TextField
        autoFocus
        margin="dense"
        label="שם הסניף"
        type="text"
        fullWidth
        variant="outlined"
        sx={{ 
          mb: 2,
          '& .MuiOutlinedInput-notchedOutline legend': {
            textAlign: 'right'
          }
        }}
        inputProps={{ dir: 'rtl' }}
        InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
        value={values.name}
        onChange={(e) => onChange('name', e.target.value)}
      />
      <TextField
        margin="dense"
        label="כתובת"
        type="text"
        fullWidth
        variant="outlined"
        sx={{ 
          mb: 2,
          '& .MuiOutlinedInput-notchedOutline legend': {
            textAlign: 'right'
          }
        }}
        inputProps={{ dir: 'rtl' }}
        InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
        value={values.address}
        onChange={(e) => onChange('address', e.target.value)}
      />
      <TextField
        margin="dense"
        label="עיר"
        type="text"
        fullWidth
        variant="outlined"
        sx={{ 
          mb: 2,
          '& .MuiOutlinedInput-notchedOutline legend': {
            textAlign: 'right'
          }
        }}
        inputProps={{ dir: 'rtl' }}
        InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
        value={values.city}
        onChange={(e) => onChange('city', e.target.value)}
      />
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'ltr' }}>
      <Button
        onClick={onClose}
        variant="outlined"
        color="error"
        sx={{
          borderRadius: '8px',
          px: 3,
          py: 1,
          borderWidth: '2px'
        }}
      >
        ביטול
      </Button>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          onClick={onReset}
          variant="outlined"
          color="warning"
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            borderWidth: '2px',
            color: '#f59e0b',
            borderColor: '#f59e0b'
          }}
        >
          איפוס טופס
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            bgcolor: '#10B981',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}
          onClick={onSubmit}
        >
          {isEdit ? 'עדכן סניף' : 'הוסף סניף'}
        </Button>
      </Box>
    </DialogActions>
  </Dialog>
);

export const GroupDialog = ({ open, values, onChange, onSubmit, onClose, onReset, isEdit, instructors = [] }) => {
  const resolvedInstructorId = React.useMemo(() => {
    const current = values?.instructorId;
    console.log('🔍 GroupDialog - Resolving instructor:', { current, instructors });
    
    if (current === undefined || current === null || current === '') return '';

    // Prefer match by id
    const byId = instructors.find(i => {
      const idVal = i.instructorId ?? i.id;
      return String(idVal) === String(current);
    });
    if (byId) {
      console.log('✅ Found instructor by ID:', byId);
      return byId.instructorId ?? byId.id;
    }

    // Fallback: match by full name string if value holds a name
    const byName = instructors.find(i => {
      const fullName = `${i.firstName || ''} ${i.lastName || ''}`.trim();
      return i.instructorName === current || fullName === String(current).trim();
    });
    if (byName) {
      console.log('✅ Found instructor by name:', byName);
      return byName.instructorId ?? byName.id;
    }

    console.log('⚠️ No instructor match found, returning current:', current);
    return current;
  }, [instructors, values?.instructorId]);

  const handleInstructorChange = (rawValue) => {
    if (rawValue === '') {
      onChange('instructorId', '');
      return;
    }
    const numeric = Number(rawValue);
    onChange('instructorId', Number.isFinite(numeric) ? numeric : '');
  };

  return (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        direction: 'rtl',
        borderRadius: 2,
        minWidth: { xs: '90%', sm: '500px' },
        overflow: 'hidden'
      }
    }}
  >
    <DialogTitle
      sx={{
        bgcolor: '#6366F1',
        color: 'white',
        textAlign: 'center',
        py: 2
      }}
    >
      {isEdit ? 'עריכת קבוצה' : 'הוספת קבוצה חדשה'}
    </DialogTitle>
    <DialogContent sx={{ pt: 3, pb: 2, direction: 'rtl' }}>
      <Box sx={{ mb: 3, mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(99, 102, 241, 0.1)'
          }}
        >
          <GroupIcon sx={{ fontSize: 35, color: '#6366F1' }} />
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          bgcolor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 2,
          p: 2,
          mb: 3,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#059669',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <InfoIcon sx={{ fontSize: 18 }} />
          הנתונים נשמרים אוטומטית - תוכל לעבור ללשוניות אחרות ולחזור
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            autoFocus
            margin="dense"
            label="שם הקבוצה"
            type="text"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
            inputProps={{ dir: 'rtl' }}
            InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            value={values.groupName}
            onChange={(e) => onChange('groupName', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl 
            fullWidth 
            margin="dense" 
            variant="outlined" 
            sx={{ 
              minWidth: '100%',
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
          >
            <InputLabel id="day-select-label" sx={{ right: 24, left: 'auto', transformOrigin: 'top right' }}>יום בשבוע</InputLabel>
            <Select
              labelId="day-select-label"
              value={values.dayOfWeek}
              onChange={(e) => onChange('dayOfWeek', e.target.value)}
              label="יום בשבוע"
              inputProps={{ dir: 'rtl' }}
              startAdornment={<DayIcon sx={{ color: '#6366F1', mr: 1 }} />}
            >
              {allowedDays.map((dayOfWeek) => (
                <MenuItem key={dayOfWeek} value={dayOfWeek}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {dayOfWeek}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
            label="שעה"
            type="text"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
            inputProps={{ dir: 'rtl' }}
            InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            value={values.hour}
            onChange={(e) => onChange('hour', e.target.value)}
            placeholder="דוגמא: 16:00-17:00"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
            label="טווח גילאים"
            type="text"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
            inputProps={{ dir: 'rtl' }}
            InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            value={values.ageRange}
            onChange={(e) => onChange('ageRange', e.target.value)}
            placeholder="דוגמא: 2-8"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
            label="מספר מקומות פנויים"
            type="number"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
            inputProps={{ min: 0 }}
            InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            value={values.maxStudents}
            onChange={(e) => onChange('maxStudents', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl 
            fullWidth 
            margin="dense" 
            variant="outlined" 
            sx={{ 
              minWidth: '100%',
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
          >
            <InputLabel id="sector-select-label" sx={{ right: 24, left: 'auto', transformOrigin: 'top right' }}>מגזר</InputLabel>
            <Select
              labelId="sector-select-label"
              value={values.sector}
              onChange={(e) => onChange('sector', e.target.value)}
              label="מגזר"
              inputProps={{ dir: 'rtl' }}
              startAdornment={<SectorIcon sx={{ color: '#6366F1', mr: 1 }} />}
            >
              {allowedSectors.map((sector) => (
                <MenuItem key={sector} value={sector}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {sector}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
            label="תאריך התחלה"
            type="date"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
            InputLabelProps={{ shrink: true, sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            inputProps={{ dir: 'rtl' }}
            value={values.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
            label="מספר שיעורים"
            type="number"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
            inputProps={{ dir: 'rtl' }}
            InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            value={values.numOfLessons}
            onChange={(e) => onChange('numOfLessons', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 2, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: 1.5, border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e3a8a', mb: 2 }}>
              סטטוס קבוצה
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant={values.isActive ? "contained" : "outlined"}
                onClick={() => onChange('isActive', true)}
                sx={{ 
                  flex: 1,
                  py: 0.75,
                  fontWeight: 700,
                  borderRadius: 1.5,
                  fontSize: '0.85rem',
                  boxShadow: values.isActive ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none',
                  transition: 'all 0.3s ease',
                  color: values.isActive ? '#ffffff' : '#10b981',
                  backgroundColor: values.isActive ? '#10b981' : 'transparent',
                  borderColor: '#10b981',
                  borderWidth: '2px',
                  '&:hover': {
                    backgroundColor: values.isActive ? '#059669' : 'rgba(16, 185, 129, 0.1)',
                    boxShadow: values.isActive ? '0 6px 16px rgba(16, 185, 129, 0.4)' : 'none'
                  }
                }}
              >
                פעיל
              </Button>
              <Button
                variant={!values.isActive ? "contained" : "outlined"}
                onClick={() => onChange('isActive', false)}
                sx={{ 
                  flex: 1,
                  py: 0.75,
                  fontWeight: 700,
                  borderRadius: 1.5,
                  fontSize: '0.85rem',
                  boxShadow: !values.isActive ? '0 4px 12px rgba(239, 68, 68, 0.4)' : 'none',
                  transition: 'all 0.3s ease',
                  color: !values.isActive ? '#ffffff' : '#ef4444',
                  backgroundColor: !values.isActive ? '#ef4444' : 'transparent',
                  borderColor: '#ef4444',
                  borderWidth: '2px',
                  '&:hover': {
                    backgroundColor: !values.isActive ? '#dc2626' : 'rgba(239, 68, 68, 0.1)',
                    boxShadow: !values.isActive ? '0 6px 16px rgba(239, 68, 68, 0.4)' : 'none'
                  }
                }}
              >
                לא פעיל
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            margin="dense"
            variant="outlined"
            sx={{
              minWidth: '100%',
              '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right'
              }
            }}
          >
            <InputLabel id="instructor-select-label" sx={{ right: 24, left: 'auto', transformOrigin: 'top right' }}>
              מדריך
            </InputLabel>
            <Select
              labelId="instructor-select-label"
              value={resolvedInstructorId === '' ? '' : String(resolvedInstructorId)}
              onChange={(e) => handleInstructorChange(e.target.value)}
              label="מדריך"
              inputProps={{ dir: 'rtl' }}
            >
              {instructors?.map((instructor) => {
                const optionId = instructor.instructorId ?? instructor.id;
                const optionName = instructor.firstName && instructor.lastName
                  ? `${instructor.firstName} ${instructor.lastName}`
                  : instructor.instructorName || 'מדריך';
                return (
                  <MenuItem key={optionId} value={String(optionId)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {optionName}
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'ltr' }}>
      <Button
        onClick={onClose}
        variant="outlined"
        color="error"
        sx={{
          borderRadius: '8px',
          px: 3,
          py: 1,
          borderWidth: '2px'
        }}
      >
        ביטול
      </Button>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          onClick={onReset}
          variant="outlined"
          color="warning"
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            borderWidth: '2px',
            color: '#f59e0b',
            borderColor: '#f59e0b'
          }}
        >
          איפוס טופס
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            bgcolor: '#6366F1',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
          }}
          onClick={onSubmit}
        >
          {isEdit ? 'עדכן קבוצה' : 'הוסף קבוצה'}
        </Button>
      </Box>
    </DialogActions>
  </Dialog>
  );
};

export const DeleteConfirmDialog = ({ open, deleteType, item, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        direction: 'rtl',
        borderRadius: 2,
        minWidth: { xs: '90%', sm: '400px' },
        overflow: 'hidden'
      }
    }}
  >
    <DialogTitle
      sx={{
        bgcolor: '#ef4444',
        color: 'white',
        textAlign: 'center',
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1
      }}
    >
      <DeleteIcon />
      אישור מחיקה
    </DialogTitle>
    <DialogContent sx={{ pt: 3, pb: 2, textAlign: 'center', mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        האם אתה בטוח שברצונך למחוק את {
          deleteType === 'course' ? 'החוג' :
          deleteType === 'branch' ? 'הסניף' :
          deleteType === 'group' ? 'הקבוצה' : 'הפריט'
        }?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {item && (
          deleteType === 'course' ? item.couresName :
          deleteType === 'branch' ? `${item.name} - ${item.city || ''}` :
          deleteType === 'group' ? `קבוצה ${item.groupName}` : ''
        )}
      </Typography>
      <Typography variant="body2" color="error.main" sx={{ mt: 2, fontWeight: 'bold' }}>
        פעולה זו לא ניתנת לביטול!
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', direction: 'ltr' }}>
      <Button
        onClick={onClose}
        variant="outlined"
        color="primary"
        sx={{
          borderRadius: '8px',
          px: 3,
          py: 1,
          borderWidth: '2px'
        }}
      >
        ביטול
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        sx={{
          borderRadius: '8px',
          px: 3,
          py: 1,
          bgcolor: '#ef4444',
          boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
        }}
      >
        מחק
      </Button>
    </DialogActions>
  </Dialog>
);
