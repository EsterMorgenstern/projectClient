import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHealthFunds } from '../../store/healthFund/fetchHealthFunds';
import { addHealthFund } from '../../store/healthFund/addHealthFund';
import StudentHealthFundTable from './StudentHealthFundTable';
import { updateHealthFund } from '../../store/healthFund/updateHealthFund';
import { deleteHealthFund } from '../../store/healthFund/deleteHealthFund';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddCircle, LocalHospital, AssignmentTurnedIn, Healing, Description, Note, Person, Save, Close } from '@mui/icons-material';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton } from '@mui/material';
import DraggablePaper, { DragHandle } from '../../components/DraggablePaper';
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';

const HealthFundManagement = () => {
  // דיאלוג עדכון
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  // דיאלוג מחיקה
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  // Dialog state for add HealthFund
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    fundType: '',
    maxTreatmentsPerYear: '',
    pricePerLesson: '',
    monthlyPrice: '',
    validUntilAge: '',
    eligibilityDetails: '',
    requiresReferral: false,
    requiresCommitment: false,
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setFormData({
      name: '',
      fundType: '',
      maxTreatmentsPerYear: '',
      pricePerLesson: '',
      monthlyPrice: '',
      validUntilAge: '',
      eligibilityDetails: '',
      requiresReferral: false,
      requiresCommitment: false,
      isActive: true
    });
    setSaving(false);
  };
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(addHealthFund(formData)).unwrap();
      handleCloseAddDialog();
      dispatch(fetchHealthFunds());
    } catch (err) {
      // Optionally show error to user
      console.error('Failed to add health fund:', err);
    }
    setSaving(false);
  };

  // עדכון
  const handleOpenEditDialog = (row) => {
    setEditFormData({ ...row });
    setEditDialogOpen(true);
    setEditSaving(false);
  };
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditFormData(null);
    setEditSaving(false);
  };
  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleEditSave = async () => {
    setEditSaving(true);
    try {
      await dispatch(updateHealthFund(editFormData)).unwrap();
      handleCloseEditDialog();
      dispatch(fetchHealthFunds());
    } catch (err) {
      console.error('Failed to update health fund:', err);
    }
    setEditSaving(false);
  };

  // מחיקה
  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
    setDeleteSaving(false);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
    setDeleteSaving(false);
  };
  const handleDeleteConfirm = async () => {
    setDeleteSaving(true);
    try {
      await dispatch(deleteHealthFund(deleteId)).unwrap();
      handleCloseDeleteDialog();
      dispatch(fetchHealthFunds());
    } catch (err) {
      console.error('Failed to delete health fund:', err);
    }
    setDeleteSaving(false);
  };
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.healthFunds);

  useEffect(() => {
    dispatch(fetchHealthFunds());
  }, [dispatch]);

  return (
  <Box sx={{ 
        background: 'linear-gradient(to right, #e0f2fe, #f8fafc)',
          minHeight: '100vh',
          borderRadius: 8,
        py: 4
      }}> <Box sx={{ p: 4, direction: 'rtl', bgcolor:  'linear-gradient(to right, #e0f2fe, #f8fafc)', borderRadius: 8, boxShadow: '0 8px 32px rgba(67,233,123,0.10)', minHeight: '80vh' }}>
      {/* טבלת סטודנט-קופה מוצגת מיד */}
      <Box sx={{ mb: 6 }}>
        
          <Typography
            variant={"h3"}
            sx={{
              fontWeight: 'bold',
              color: '#1E3A8A',
              mb: 1,
              fontFamily: 'Heebo, sans-serif',
              textAlign: 'center',
            }}
          >
          ניהול גביה
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#334155',
              textAlign: 'center',
              mb: 3,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
          ניהול גביה על פי קופות חולים     
      </Typography>
          
        <StudentHealthFundTable />
      </Box>
      {/* טבלת קופות חולים */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#43E97B', textAlign: 'right', ml: 2 }}>
          פרטי קופות החולים
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          color="success"
          sx={{ borderRadius: '24px', direction: 'ltr', fontWeight: 'bold', px: 4, py: 1.5, boxShadow: '0 4px 14px rgba(67,233,123,0.18)', fontSize: '1rem', transition: 'all 0.2s', bgcolor: '#43E97B', '&:hover': { bgcolor: '#38F9D7' } }}
          onClick={handleOpenAddDialog}
        >
          הוספה
        </Button>
      </Box>
  {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress color="success" />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: 'right' }}>שגיאה: {error}</Typography>
      ) : (
       
          <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 12px 30px rgba(37,99,235,0.10)', overflow: 'hidden', mb: 2 }}>
            <Table sx={{ direction: 'rtl' }}>

            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)', direction: 'rtl' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <LocalHospital sx={{ color: '#43E97B' }} />
                    <span>שם קופה</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AssignmentTurnedIn sx={{ color: '#764ba2' }} />
                    <span>סוג</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Healing sx={{ color: '#38F9D7' }} />
                    <span>מקסימום טיפולים בשנה</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Description sx={{ color: '#2563EB' }} />
                    <span>מחיר לשיעור</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Description sx={{ color: '#667eea' }} />
                    <span>מחיר חודשי</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Description sx={{ color: '#f59e42' }} />
                    <span>גיל זכאות</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Description sx={{ color: '#a3e635' }} />
                    <span>פרטי זכאות</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Note sx={{ color: '#F59E42' }} />
                    <span>הפניה</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Note sx={{ color: '#F59E42' }} />
                    <span>התחייבות</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Person sx={{ color: '#43E97B' }} />
                    <span>פעילה</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <EditIcon sx={{ color: 'white' }} />
                    <span>פעולות</span>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((fund, idx) => (
                <TableRow key={fund.healthFundId} sx={{ background: idx % 2 === 0 ? '#f8fafc' : '#e2e8f0', direction: 'rtl' }}>
                  <TableCell align="center">{fund.name}</TableCell>
                  <TableCell align="center">{fund.fundType}</TableCell>
                  <TableCell align="center">{fund.maxTreatmentsPerYear}</TableCell>
                  <TableCell align="center">{fund.pricePerLesson}</TableCell>
                  <TableCell align="center">{fund.monthlyPrice}</TableCell>
                  <TableCell align="center">{fund.validUntilAge}</TableCell>
                  <TableCell align="center">{fund.eligibilityDetails}</TableCell>
                  <TableCell align="center"><Chip label={fund.requiresReferral ? 'נדרש' : 'לא נדרש'} color={fund.requiresReferral ? 'warning' : 'success'} /></TableCell>
                  <TableCell align="center"><Chip label={fund.requiresCommitment ? 'נדרש' : 'לא נדרש'} color={fund.requiresCommitment ? 'warning' : 'success'} /></TableCell>
                  <TableCell align="center"><Chip label={fund.isActive ? 'פעילה' : 'לא פעילה'} color={fund.isActive ? 'success' : 'default'} /></TableCell>
                  <TableCell align="center">
                    <IconButton color="info" onClick={() => handleOpenEditDialog(fund)} size="small"><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleOpenDeleteDialog(fund.healthFundId)} size="small"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
      {/* דיאלוג עדכון */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperComponent={DraggablePaper}
        PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', direction: 'rtl' } }}
      >
        <DialogTitle 
          className="drag-handle"
          sx={{ 
            bgcolor: '#43E97B', 
            color: 'white', 
            fontWeight: 'bold', 
            borderRadius: '16px 16px 0 0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            direction: 'rtl',
            cursor: 'move',
            '&:hover': {
              bgcolor: '#38F9D7'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragHandle />
            <EditIcon />
            <Typography variant="h6" component="span">עדכון קופה</Typography>
          </Box>
          <IconButton onClick={handleCloseEditDialog} sx={{ color: 'white' }} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, direction: 'rtl' }}>
                 <br />

          {editFormData && (
            <Grid container spacing={2} sx={{ direction: 'rtl' }}>
              <Grid item xs={12} sm={6}>
                <TextField label="שם קופה" fullWidth variant="outlined" value={editFormData.name} onChange={e => handleEditInputChange('name', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="סוג" fullWidth variant="outlined" value={editFormData.fundType} onChange={e => handleEditInputChange('fundType', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="מקסימום טיפולים בשנה" type="number" fullWidth variant="outlined" value={editFormData.maxTreatmentsPerYear} onChange={e => handleEditInputChange('maxTreatmentsPerYear', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="מחיר לשיעור" type="number" fullWidth variant="outlined" value={editFormData.pricePerLesson} onChange={e => handleEditInputChange('pricePerLesson', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="מחיר חודשי" type="number" fullWidth variant="outlined" value={editFormData.monthlyPrice} onChange={e => handleEditInputChange('monthlyPrice', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="גיל זכאות" type="number" fullWidth variant="outlined" value={editFormData.validUntilAge || ''} onChange={e => handleEditInputChange('validUntilAge', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField label="פרטי זכאות" fullWidth variant="outlined" value={editFormData.eligibilityDetails || ''} onChange={e => handleEditInputChange('eligibilityDetails', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Note sx={{ color: '#F59E42' }} />
                  <Typography>הפניה נדרשת?</Typography>
                  <Button variant={editFormData.requiresReferral ? 'contained' : 'outlined'} color="warning" size="small" onClick={() => handleEditInputChange('requiresReferral', !editFormData.requiresReferral)}>{editFormData.requiresReferral ? 'כן' : 'לא'}</Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Note sx={{ color: '#764ba2' }} />
                  <Typography>התחייבות נדרשת?</Typography>
                  <Button variant={editFormData.requiresCommitment ? 'contained' : 'outlined'} color="warning" size="small" onClick={() => handleEditInputChange('requiresCommitment', !editFormData.requiresCommitment)}>{editFormData.requiresCommitment ? 'כן' : 'לא'}</Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ color: '#43E97B' }} />
                  <Typography>פעילה?</Typography>
                  <Button variant={editFormData.isActive ? 'contained' : 'outlined'} color="success" size="small" onClick={() => handleEditInputChange('isActive', !editFormData.isActive)}>{editFormData.isActive ? 'כן' : 'לא'}</Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, direction: 'rtl' }}>
          <Button variant="outlined" color="error" onClick={handleCloseEditDialog} sx={{ borderRadius: '8px', px: 3, py: 1 }}>ביטול</Button>
          <Button variant="contained" startIcon={<Save />} onClick={handleEditSave} disabled={editSaving} sx={{ borderRadius: '8px', px: 3, py: 1,direction:'ltr', bgcolor: '#43E97B', boxShadow: '0 4px 14px rgba(67,233,123,0.3)', '&:hover': { bgcolor: '#38F9D7' }, '&:disabled': { bgcolor: '#94A3B8', boxShadow: 'none' }, transition: 'all 0.3s ease' }}>{editSaving ? '...שומר' : 'שמור'}</Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג מחיקה */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperComponent={DraggablePaper}
        PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', direction: 'rtl' } }}
      >
        <DialogTitle 
          className="drag-handle"
          sx={{ 
            bgcolor: '#d32f2f', 
            color: 'white', 
            fontWeight: 'bold', 
            borderRadius: '16px 16px 0 0', 
            direction: 'rtl',
            cursor: 'move',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:hover': {
              bgcolor: '#c62828'
            }
          }}
        >
          <DragHandle />
          האם אתה בטוח שברצונך למחוק?
        </DialogTitle>
        <DialogActions sx={{ p: 2, gap: 1, direction: 'rtl' }}>
          <Button variant="outlined" color="primary" onClick={handleCloseDeleteDialog} sx={{ borderRadius: '8px', px: 3, py: 1 }}>ביטול</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} disabled={deleteSaving} sx={{ borderRadius: '8px', px: 3, py: 1 }}>{deleteSaving ? 'מוחק...' : 'מחק'}</Button>
        </DialogActions>
      </Dialog>
            </TableBody>
          </Table>
          </TableContainer>
      )}
      {/* דיאלוג הוספה */}
      <Dialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
        PaperComponent={DraggablePaper}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            direction: 'rtl'
          }
        }}
      >
        <DialogTitle 
          className="drag-handle"
          sx={{ 
            bgcolor: '#43E97B', 
            color: 'white', 
            fontWeight: 'bold', 
            borderRadius: '16px 16px 0 0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            direction: 'rtl',
            cursor: 'move',
            '&:hover': {
              bgcolor: '#38F9D7'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragHandle />
            <AddCircle />
            <Typography variant="h6" component="span">הוספת קופה</Typography>
          </Box>
          <IconButton onClick={handleCloseAddDialog} sx={{ color: 'white' }} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, direction: 'rtl' }}>
                        <br />

          <Grid container spacing={2} sx={{ direction: 'rtl' }}>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><LocalHospital sx={{ color: '#43E97B' }} /> <span>שם קופה</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                fullWidth 
                variant="outlined" 
                value={formData.name} 
                onChange={e => handleInputChange('name', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><AssignmentTurnedIn sx={{ color: '#764ba2' }} /> <span>סוג</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                fullWidth 
                variant="outlined" 
                value={formData.fundType} 
                onChange={e => handleInputChange('fundType', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Healing sx={{ color: '#38F9D7' }} /> <span>מקסימום טיפולים בשנה</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.maxTreatmentsPerYear} 
                onChange={e => handleInputChange('maxTreatmentsPerYear', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Description sx={{ color: '#2563EB' }} /> <span>מחיר לשיעור</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.pricePerLesson} 
                onChange={e => handleInputChange('pricePerLesson', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Description sx={{ color: '#667eea' }} /> <span>מחיר חודשי</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.monthlyPrice} 
                onChange={e => handleInputChange('monthlyPrice', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Description sx={{ color: '#f59e42' }} /> <span>גיל זכאות</span></Box>} 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.validUntilAge} 
                onChange={e => handleInputChange('validUntilAge', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Description sx={{ color: '#a3e635' }} /> <span>פרטי זכאות</span></Box>} 
                fullWidth 
                variant="outlined" 
                value={formData.eligibilityDetails} 
                onChange={e => handleInputChange('eligibilityDetails', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Note sx={{ color: '#F59E42' }} />
                  <Typography>הפניה נדרשת?</Typography>
                  <Button variant={formData.requiresReferral ? 'contained' : 'outlined'} color="warning" size="small" onClick={() => handleInputChange('requiresReferral', !formData.requiresReferral)}>{formData.requiresReferral ? 'כן' : 'לא'}</Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Note sx={{ color: '#764ba2' }} />
                  <Typography>התחייבות נדרשת?</Typography>
                  <Button variant={formData.requiresCommitment ? 'contained' : 'outlined'} color="warning" size="small" onClick={() => handleInputChange('requiresCommitment', !formData.requiresCommitment)}>{formData.requiresCommitment ? 'כן' : 'לא'}</Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ color: '#43E97B' }} />
                <Typography>פעילה?</Typography>
                <Button variant={formData.isActive ? 'contained' : 'outlined'} color="success" size="small" onClick={() => handleInputChange('isActive', !formData.isActive)}>{formData.isActive ? 'כן' : 'לא'}</Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, direction: 'rtl' }}>
          <Button variant="outlined" color="error" onClick={handleCloseAddDialog} sx={{ borderRadius: '8px', px: 3, py: 1 }}>ביטול</Button>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving} sx={{ borderRadius: '8px', px: 3, py: 1,direction:'ltr' ,bgcolor: '#43E97B', boxShadow: '0 4px 14px rgba(67,233,123,0.3)', '&:hover': { bgcolor: '#38F9D7' }, '&:disabled': { bgcolor: '#94A3B8', boxShadow: 'none' }, transition: 'all 0.3s ease' }}>{saving ? '...שומר' : 'שמור'}</Button>
        </DialogActions>
      </Dialog>
    </Box></Box>
  );
};

export default HealthFundManagement;
