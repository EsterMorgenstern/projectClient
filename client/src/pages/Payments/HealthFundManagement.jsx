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
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import DraggablePaper, { DragHandle } from '../../components/DraggablePaper';
import { checkUserPermission } from '../../utils/permissions';
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
  const [activeTable, setActiveTable] = useState(0);

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
      if (!checkUserPermission(currentUser?.id || currentUser?.userId, (message) => alert(message))) {
        setSaving(false);
        return;
      }
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
      if (!checkUserPermission(currentUser?.id || currentUser?.userId, (message) => alert(message))) {
        setEditSaving(false);
        return;
      }
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
      if (!checkUserPermission(currentUser?.id || currentUser?.userId, (message) => alert(message))) {
        setDeleteSaving(false);
        return;
      }
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
  const currentUser = useSelector(state => state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null);

  useEffect(() => {
    dispatch(fetchHealthFunds());
  }, [dispatch]);

  return (
  <Box sx={{ 
        background: 'linear-gradient(180deg, #f6fbff 0%, #eef5fb 100%)',
        minHeight: '100vh',
        borderRadius: 8,
        py: 4
      }}>
      <Box sx={{ p: { xs: 2, md: 4 }, direction: 'rtl', borderRadius: 8, minHeight: '80vh', maxWidth: '1500px', mx: 'auto' }}>
      {/* <Paper elevation={0} sx={{ mb: 4, p: { xs: 2, md: 3 }, borderRadius: 4, border: '1px solid #dbeafe', background: 'linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%)', boxShadow: '0 10px 26px rgba(37,99,235,0.07)' }}> */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#1E3A8A',
              mb: 1,
              fontFamily: 'inherit',
              textAlign: 'center'
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
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontFamily: 'inherit'
            }}
          >
          ניהול גביה על פי קופות חולים
      </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            direction: 'rtl',
            mb: 3
          }}
        >
          <Tabs
            value={activeTable}
            onChange={(_, value) => setActiveTable(value)}
            sx={{
              minHeight: 42,
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: 999,
                backgroundColor: '#1d4ed8'
              },
              '& .MuiTab-root': {
                minHeight: 42,
                fontWeight: 700,
                fontFamily: 'inherit',
                color: '#475569',
                px: { xs: 1.5, sm: 2, md: 2.25 },
                py: 0.35,
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.84rem', sm: '0.9rem', md: '0.94rem' }
              },
              '& .Mui-selected': {
                color: '#1e3a8a !important'
              }
            }}
          >
            <Tab label="טבלת קופות תלמידים" />
            <Tab label="טבלת קופות חולים" />
          </Tabs>
        </Box>
      {/* </Paper> */}

        {activeTable === 0 && <StudentHealthFundTable />}
      {activeTable === 1 && (
      <>
      {/* טבלת קופות חולים */}
      <Paper
        elevation={0}
        sx={{
          mb: 2.5,
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          border: '1px solid #d1fae5',
          background: 'linear-gradient(135deg, #f7fffb 0%, #ecfdf5 100%)',
          boxShadow: '0 8px 24px rgba(16,185,129,0.10)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0f766e', textAlign: 'right', ml: 2, fontSize: { xs: '1.35rem', md: '1.6rem' }, fontFamily: 'inherit' }}>
              פרטי קופות החולים
            </Typography>
            <Typography variant="body2" sx={{ color: '#4b5563', mt: 0.75, fontFamily: 'inherit' }}>
              ניהול מרוכז של קופות החולים, תנאי הזכאות והגדרות הגביה.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            color="success"
            sx={{
              borderRadius: '999px',
              direction: 'ltr',
              fontWeight: 700,
              px: 3.25,
              py: 1.1,
              boxShadow: '0 8px 18px rgba(68, 209, 162, 0.18)',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              bgcolor: '#59b395',
              '&:hover': { bgcolor: '#059669' }
            }}
            onClick={handleOpenAddDialog}
          >
            הוספה
          </Button>
        </Box>
      </Paper>
  {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress color="success" />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: 'right' }}>שגיאה: {error}</Typography>
      ) : (
       
          <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 10px 24px rgba(71, 85, 105, 0.10)', overflow: 'hidden', mb: 2, border: '1px solid #d9e5ee' }}>
            <Table sx={{ direction: 'rtl', fontFamily: 'inherit' }}>

            <TableHead>
              <TableRow
                sx={{
                  background: 'linear-gradient(135deg, #0f8b8d 0%, #14b8a6 48%, #3b82f6 100%)',
                  direction: 'rtl'
                }}
              >
                <TableCell sx={{ fontWeight: 700, color: 'white', textAlign: 'center', py: 1.5, borderBottom: 'none', bgcolor: 'transparent' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <LocalHospital sx={{ color: 'rgba(255,255,255,0.96)' }} />
                    <span>שם קופה</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white', textAlign: 'center', py: 1.5, borderBottom: 'none', bgcolor: 'transparent' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AssignmentTurnedIn sx={{ color: 'rgba(255,255,255,0.96)' }} />
                    <span>סוג</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white', textAlign: 'center', py: 1.5, borderBottom: 'none', bgcolor: 'transparent' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Healing sx={{ color: 'rgba(255,255,255,0.96)' }} />
                    <span>מקסימום טיפולים בשנה</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white', textAlign: 'center', py: 1.5, borderBottom: 'none', bgcolor: 'transparent' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Description sx={{ color: 'rgba(255,255,255,0.96)' }} />
                    <span>מחיר לשיעור</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white', textAlign: 'center', py: 1.5, borderBottom: 'none', bgcolor: 'transparent' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Description sx={{ color: 'rgba(255,255,255,0.96)' }} />
                    <span>מחיר חודשי</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white', textAlign: 'center', py: 1.5, borderBottom: 'none', bgcolor: 'transparent' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Description sx={{ color: 'rgba(255,255,255,0.96)' }} />
                    <span>גיל זכאות</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white', textAlign: 'center', py: 1.5, borderBottom: 'none', bgcolor: 'transparent' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Description sx={{ color: 'rgba(255,255,255,0.96)' }} />
                    <span>פרטי זכאות</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white', textAlign: 'center', py: 1.5, borderBottom: 'none', bgcolor: 'transparent' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Note sx={{ color: 'rgba(255,255,255,0.96)' }} />
                    <span>הפניה</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white', textAlign: 'center', py: 1.5, borderBottom: 'none', bgcolor: 'transparent' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Note sx={{ color: 'rgba(255,255,255,0.96)' }} />
                    <span>התחייבות</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white', textAlign: 'center', py: 1.5, borderBottom: 'none', bgcolor: 'transparent' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Person sx={{ color: 'rgba(255,255,255,0.96)' }} />
                    <span>פעילה</span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white', textAlign: 'center', py: 1.5, borderBottom: 'none', bgcolor: 'transparent' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <EditIcon sx={{ color: 'rgba(255,255,255,0.96)' }} />
                    <span>פעולות</span>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((fund, idx) => (
                <TableRow key={fund.healthFundId} sx={{ background: idx % 2 === 0 ? '#f8fafc' : '#e2e8f0', direction: 'rtl', '& td': { py: 0.95, px: 1, fontSize: '0.9rem' } }}>
                  <TableCell align="center">{fund.name}</TableCell>
                  <TableCell align="center">{fund.fundType}</TableCell>
                  <TableCell align="center">{fund.maxTreatmentsPerYear}</TableCell>
                  <TableCell align="center">{fund.pricePerLesson}</TableCell>
                  <TableCell align="center">{fund.monthlyPrice}</TableCell>
                  <TableCell align="center">{fund.validUntilAge}</TableCell>
                  <TableCell align="center">{fund.eligibilityDetails}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={fund.requiresReferral ? 'נדרש' : 'לא נדרש'}
                      size="small"
                      sx={{
                        bgcolor: fund.requiresReferral ? '#fff4e5' : '#eefbf3',
                        color: fund.requiresReferral ? '#b45309' : '#2f855a',
                        fontWeight: 700,
                        borderRadius: '999px',
                        border: fund.requiresReferral ? '1px solid #f6d7a7' : '1px solid #cfe9d9'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={fund.requiresCommitment ? 'נדרש' : 'לא נדרש'}
                      size="small"
                      sx={{
                        bgcolor: fund.requiresCommitment ? '#fff4e5' : '#eefbf3',
                        color: fund.requiresCommitment ? '#b45309' : '#2f855a',
                        fontWeight: 700,
                        borderRadius: '999px',
                        border: fund.requiresCommitment ? '1px solid #f6d7a7' : '1px solid #cfe9d9'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={fund.isActive ? 'פעילה' : 'לא פעילה'}
                      size="small"
                      sx={{
                        bgcolor: fund.isActive ? '#eefbf3' : '#f3f4f6',
                        color: fund.isActive ? '#2f855a' : '#6b7280',
                        fontWeight: 700,
                        borderRadius: '999px',
                        border: fund.isActive ? '1px solid #cfe9d9' : '1px solid #e5e7eb'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="info" onClick={() => handleOpenEditDialog(fund)} size="small"><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleOpenDeleteDialog(fund.healthFundId)} size="small"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      </>
      )}
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
