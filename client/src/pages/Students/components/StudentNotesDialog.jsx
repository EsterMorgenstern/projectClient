import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, IconButton, Dialog as MuiDialog
} from '@mui/material';
import { Info as InfoIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon, Warning as WarningIcon, Assignment as AssignmentIcon, AttachMoney as AttachMoneyIcon, Notes as NotesIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const noteTypeIcons = {
  'כללי': <InfoIcon sx={{ color: '#3b82f6' }} />,
  'חיובי': <CheckCircleIcon sx={{ color: '#059669' }} />,
  'שלילי': <ErrorIcon sx={{ color: '#dc2626' }} />,
  'אזהרה': <WarningIcon sx={{ color: '#d97706' }} />,
  'הערת גביה': <AttachMoneyIcon sx={{ color: '#22c55e' }} />,
  'מעקב רישום': <AssignmentIcon sx={{ color: '#0ea5e9' }} />,
};

const StudentNotesDialog = ({ open, onClose, notes = [], student, onAddNote, onEditNote, onDeleteNote }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDeleteNote && noteToDelete) {
      onDeleteNote(noteToDelete);
    }
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        direction: 'rtl',
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxHeight: '90vh',
          bgcolor: '#f8fafc',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #22c55e 0%, #059669 100%)',
          color: 'white',
          p: 2,
          position: 'relative',
          overflow: 'hidden',
          direction: 'rtl',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 40, height: 40 }}>
            <NotesIcon sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {`הערות לתלמיד`}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {student?.studentName || student?.name || ''} • ת"ז: {student?.studentId || student?.id || ''}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 2,
          bgcolor: '#f8fafc',
          maxHeight: '60vh',
          overflowY: 'auto',
          direction: 'rtl',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
            '&:hover': {
              background: '#a8a8a8',
            },
          },
        }}
      >
        {notes.length === 0 ? (
          <Typography color="textSecondary">אין הערות להצגה</Typography>
        ) : (
          <List sx={{ direction: 'rtl' }}>
            {notes.map((note, idx) => (
              <ListItem key={idx} alignItems="flex-start" sx={{ bgcolor: '#fff', borderRadius: 2, mb: 2, boxShadow: '0 2px 8px rgba(34,197,94,0.08)', position: 'relative' }}>
                <ListItemAvatar>
                  <Avatar>
                    {noteTypeIcons[note.noteType] || <NotesIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={note.noteType} size="small" sx={{ bgcolor: '#e0f2fe', color: '#059669', fontWeight: 'bold' }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#059669' }}>{note.authorName}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', ml: 1 }}>{note.authorRole}</Typography>
                      {/* מלל ההערה ותאריך בצד ימין */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 'auto', minWidth: 120 }}>
                       <br/> <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, textAlign: 'right' }}>{note.noteContent}</Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'right' }}>{new Date(note.createdDate).toLocaleDateString('he-IL')}</Typography>
                      </Box>
                    </Box>
                  }
                />
                {/* פעולות עריכה ומחיקה */}
                <Box sx={{ position: 'absolute', left: 16, top: 16, display: 'flex', gap: 1 }}>
                  <IconButton color="info" size="small" onClick={() => onEditNote(note)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDeleteClick(note)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 2, flexDirection: 'row', justifyContent: 'flex-end', bgcolor: '#f8fafc', direction: 'rtl' }}>
        <Button variant="contained" color="success" onClick={() => onAddNote(student)} sx={{ borderRadius: '8px', px: 3, py: 1, fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 2px 8px rgba(34,197,94,0.18)' }}>
          הוסף הערת גביה
        </Button>
        <Button variant="outlined" color="primary" onClick={onClose} sx={{ borderRadius: '8px', px: 3, py: 1, fontWeight: 'bold' }}>
          סגור
        </Button>
      </DialogActions>
      {/* דיאלוג אישור מחיקה */}
      <MuiDialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ direction: 'rtl', fontWeight: 'bold' }}>אישור מחיקת הערה</DialogTitle>
        <DialogContent sx={{ direction: 'rtl' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            האם אתה בטוח שברצונך למחוק את ההערה הזו? פעולה זו אינה ניתנת לשחזור.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {noteToDelete?.noteContent}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ direction: 'rtl', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={handleDeleteCancel} variant="outlined" color="primary">ביטול</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">מחק</Button>
        </DialogActions>
      </MuiDialog>
    </Dialog>
  );
}

export default StudentNotesDialog;
