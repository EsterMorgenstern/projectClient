import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { sendEmail } from '../../../store/email/emailSendThunk';
import { getStudentById } from '../../../store/student/studentGetByIdThunk';
import {
  buildTrialFollowUpEmail,
  getStudentEmailFromRow,
  getStudentFullNameFromRow
} from '../../../utils/trialFollowUpEmail';

const TrialFollowUpEmailDialog = ({
  open,
  onClose,
  trialRows = [],
  selectedRows = [],
  onComplete
}) => {
  const dispatch = useDispatch();
  const [sendMode, setSendMode] = useState('selected');
  const [contactPhone, setContactPhone] = useState('035525757');
  const [contactEmail, setContactEmail] = useState('035525757b@gmail.com');
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [resultSummary, setResultSummary] = useState(null);

  const selectedTrialRows = useMemo(
    () => (Array.isArray(selectedRows) ? selectedRows : []).filter((row) => Number(row.isActive ?? row.IsActive) === 4),
    [selectedRows]
  );

  const targetRows = useMemo(() => {
    if (sendMode === 'all') {
      return (Array.isArray(trialRows) ? trialRows : []).filter((row) => Number(row.isActive ?? row.IsActive) === 4);
    }
    return selectedTrialRows;
  }, [sendMode, trialRows, selectedTrialRows]);

  const recipientsPreview = useMemo(() => targetRows.map((row) => {
    const directEmail = getStudentEmailFromRow(row);
    const hasDirectEmail = Boolean(directEmail?.includes('@'));
    const hasStudentId = Boolean(row.studentId || row.StudentId);
    return {
      id: row.groupStudentId || row.studentId,
      name: getStudentFullNameFromRow(row),
      email: directEmail,
      hasEmail: hasDirectEmail,
      // אם אין מייל ישיר אבל יש studentId — המייל ייאסף אוטומטית בעת השליחה
      willResolve: !hasDirectEmail && hasStudentId
    };
  }), [targetRows]);

  const withEmailCount = recipientsPreview.filter((item) => item.hasEmail || item.willResolve).length;
  const withoutEmailCount = recipientsPreview.filter((item) => !item.hasEmail && !item.willResolve).length;

  useEffect(() => {
    if (!open) return;
    setSendMode(selectedTrialRows.length > 0 ? 'selected' : 'all');
    setContactPhone('035525757');
    setContactEmail('035525757b@gmail.com');
    setSending(false);
    setProgress({ current: 0, total: 0 });
    setResultSummary(null);
  }, [open, selectedTrialRows.length]);

  const resolveRecipientEmail = async (row) => {
    const directEmail = getStudentEmailFromRow(row);
    if (directEmail.includes('@')) {
      return directEmail;
    }

    const studentId = row.studentId || row.StudentId;
    if (!studentId) return '';

    const result = await dispatch(getStudentById(studentId));
    if (result.type === 'students/GetStudentById/fulfilled' && result.payload) {
      return String(result.payload.email || result.payload.Email || '').trim();
    }

    return '';
  };

  const handleSend = async () => {
    if (!targetRows.length) {
      setResultSummary({ sent: 0, failed: 0, skipped: 0, message: 'לא נבחרו תלמידים לשליחה' });
      return;
    }

    setSending(true);
    setResultSummary(null);

    let sent = 0;
    let failed = 0;
    let skipped = 0;
    const failedNames = [];

    setProgress({ current: 0, total: targetRows.length });

    for (let index = 0; index < targetRows.length; index += 1) {
      const row = targetRows[index];
      const studentName = getStudentFullNameFromRow(row);

      try {
        const email = await resolveRecipientEmail(row);
        if (!email || !email.includes('@')) {
          skipped += 1;
        } else {
          const { subject, body } = buildTrialFollowUpEmail({
            row,
            contactPhone: contactPhone.trim(),
            contactEmail: contactEmail.trim()
          }); const result = await dispatch(sendEmail({ to: email, subject, body }));

          if (sendEmail.fulfilled.match(result)) {
            sent += 1;
          } else {
            failed += 1;
            failedNames.push(studentName);
          }
        }
      } catch {
        failed += 1;
        failedNames.push(studentName);
      }

      setProgress({ current: index + 1, total: targetRows.length });
    }

    const summary = {
      sent,
      failed,
      skipped,
      message: `נשלחו ${sent} מיילים${failed ? `, ${failed} נכשלו` : ''}${skipped ? `, ${skipped} ללא כתובת מייל` : ''}`
    };

    setResultSummary({ ...summary, failedNames });
    setSending(false);
    onComplete?.(summary);
  };

  return (
    <Dialog
      open={open}
      onClose={sending ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, direction: 'rtl' } }}
    >
      <DialogTitle sx={{
        bgcolor: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
        color: 'white',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <EmailIcon />
        שליחת מייל לתלמידי ניסיון
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <br />
        <Typography sx={{ mb: 2, color: '#334155', lineHeight: 1.7 }}>
          המייל יכלול את פרטי שיעור הניסיון ויבקש מההורים לעדכן האם הילד מעוניין להמשיך בחוג.
        </Typography>

        <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
          <RadioGroup
            value={sendMode}
            onChange={(e) => setSendMode(e.target.value)}
          >
            <FormControlLabel
              value="selected"
              control={<Radio />}
              disabled={selectedTrialRows.length === 0}
              label={`רק תלמידים שנבחרו (${selectedTrialRows.length})`}
              sx={{ direction: 'rtl', mr: 0 }}
            />
            <FormControlLabel
              value="all"
              control={<Radio />}
              label={`כל תלמידי הניסיון בסינון הנוכחי (${(trialRows || []).length})`}
              sx={{ direction: 'rtl', mr: 0 }}
            />
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          size="small"
          label="טלפון ליצירת קשר (אופציונלי)"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          placeholder="יופיע במייל להורים"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <TextField
          fullWidth
          size="small"
          label="מייל ליצירת קשר (אופציונלי)"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="יופיע במייל להורים"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <Box sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: '#f8fafc',
          border: '1px solid #e2e8f0',
          mb: 2
        }}>
          <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            סיכום נמענים
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
            <Chip label={`סה״כ: ${recipientsPreview.length}`} size="small" />
            <Chip label={`יישלח: ${withEmailCount}`} size="small" color="success" variant="outlined" />
            {withoutEmailCount > 0 && (
              <Chip label={`ללא מייל: ${withoutEmailCount}`} size="small" color="error" variant="outlined" />
            )}
          </Box>

          {recipientsPreview.slice(0, 6).map((item) => (
            <Typography
              key={item.id}
              sx={{
                fontSize: '0.85rem',
                color: item.hasEmail ? '#334155' : item.willResolve ? '#334155' : '#b45309',
                mb: 0.5
              }}
            >
              {item.hasEmail ? '✉️' : item.willResolve ? '🔍' : '⚠️'}{' '}
              {item.name}
              {item.willResolve ? ' — מייל יבדק בשליחה' : !item.hasEmail ? ' — ללא מייל' : ''}
            </Typography>
          ))}
          {recipientsPreview.length > 6 && (
            <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8', mt: 0.5 }}>
              ועוד {recipientsPreview.length - 6} תלמידים...
            </Typography>
          )}
        </Box>

        {sending && (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#64748b', mb: 1 }}>
              שולח... {progress.current} מתוך {progress.total}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress.total ? (progress.current / progress.total) * 100 : 0}
              sx={{ borderRadius: 999, height: 8 }}
            />
          </Box>
        )}

        {resultSummary && (
          <Alert severity={resultSummary.failed ? 'warning' : 'success'} sx={{ borderRadius: 2 }}>
            {resultSummary.message}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<CloseIcon />}
          disabled={sending}
          sx={{ borderRadius: 2 }}
        >
          סגור
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          disabled={sending || !targetRows.length}
          startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
          sx={{
            borderRadius: 2,
            bgcolor: '#0ea5e9',
            '&:hover': { bgcolor: '#0284c7' }
          }}
        >
          {sending ? 'שולח...' : 'שלח מיילים'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrialFollowUpEmailDialog;
