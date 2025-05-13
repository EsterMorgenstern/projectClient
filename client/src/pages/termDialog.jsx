import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    Box
} from '@mui/material';

const TermsDialog = ({ open, onClose, onAccept }) => {
    const [accepted, setAccepted] = useState(false);

    const handleAccept = () => {
        if (accepted) {
            onAccept();
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 3,
                    padding: 3,
                    background: 'linear-gradient(180deg, #F0F4FF 0%, #FFFFFF 100%)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                },
            }}
        >
            <DialogTitle sx={{ color: '#1E3A8A', fontWeight: 'bold', textAlign: 'center' }}>
                תקנון חוגים
            </DialogTitle>
            <DialogContent>
                <Box sx={{ maxHeight: 400, overflowY: 'auto', padding: 1, direction: 'rtl' }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        ברוכים הבאים למרכז החוגים שלנו! אנא קראו בעיון את התקנון לפני ההרשמה:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        1. פתיחת חוג מותנית במספר נרשמים מינימלי.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        2. ההשתתפות בחוגים מותנית בתשלום מראש לכל תקופת הפעילות.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        3. ביטול השתתפות יתאפשר בהתאם למדיניות הביטולים של המרכז.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        4. המרכז שומר לעצמו את הזכות לשנות את מיקום או מועד החוגים בהתאם לצרכים.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        5. על המשתתפים להקפיד על התנהגות נאותה במהלך הפעילות.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        6. המרכז אינו אחראי על אובדן או נזק לרכוש אישי של המשתתפים.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        7. בכל שאלה או הבהרה ניתן לפנות לצוות המרכז.
                    </Typography>
                </Box>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="אני מאשר/ת שקראתי והבנתי את התקנון"
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error" variant="outlined">
                    ביטול
                </Button>
                <Button
                    onClick={handleAccept}
                    color="primary"
                    variant="contained"
                    disabled={!accepted}
                    sx={{
                        backgroundColor: '#1E3A8A',
                        '&:hover': { backgroundColor: '#3B82F6' },
                    }}
                >
                    אישור והמשך
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TermsDialog;
