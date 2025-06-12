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
    Box,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Chip,
    TextField,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Gavel as GavelIcon,
    CheckCircle as CheckCircleIcon,
    School as SchoolIcon,
    Payment as PaymentIcon,
    Cancel as CancelIcon,
    Schedule as ScheduleIcon,
    Group as GroupIcon,
    Security as SecurityIcon,
    Help as HelpIcon,
    Warning as WarningIcon,
    Email as EmailIcon,
    Send as SendIcon,
    Language as WebIcon,
    Print as PrintIcon,
    Share as ShareIcon,
    Download as DownloadIcon,
    Fullscreen as FullscreenIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const TermsDialog = ({ open, onClose, onAccept }) => {
    const [accepted, setAccepted] = useState(false);
    const [email, setEmail] = useState('');
    const [emailSending, setEmailSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [currentTab, setCurrentTab] = useState(0); // 0 = דיאלוג, 1 = צפיה באתר
    const [webViewOpen, setWebViewOpen] = useState(false);

    const handleAccept = () => {
        if (accepted) {
            onAccept();
            onClose();
        }
    };

    const handleClose = () => {
        setAccepted(false);
        setEmail('');
        setEmailSent(false);
        setEmailError('');
        setCurrentTab(0);
        setWebViewOpen(false);
        onClose();
    };

    const handleSendEmail = async () => {
        if (!email || !email.includes('@')) {
            setEmailError('אנא הזינו כתובת אימייל תקינה');
            return;
        }

        setEmailSending(true);
        setEmailError('');

        try {
            const response = await axios.post('http://localhost:5248/api/Email/SendTerms', {
                email: email,
                subject: 'תקנון חוגים - מרכז החוגים',
                termsContent: getTermsAsText()
            });

            if (response.status === 200) {
                setEmailSent(true);
                setTimeout(() => setEmailSent(false), 3000);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setEmailError('שגיאה בשליחת המייל. אנא נסו שוב מאוחר יותר.');
        } finally {
            setEmailSending(false);
        }
    };

    const handlePrint = () => {
        const printContent = document.getElementById('terms-content');
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl" lang="he">
            <head>
                <meta charset="UTF-8">
                <title>תקנון חוגים - מרכז החוגים</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        direction: rtl;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #3b82f6;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .term-item {
                        margin-bottom: 20px;
                        padding: 15px;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        background: #f9fafb;
                    }
                    .term-title {
                        font-weight: bold;
                        color: #1e40af;
                        margin-bottom: 8px;
                        font-size: 18px;
                    }
                    .term-content {
                        color: #374151;
                        line-height: 1.5;
                    }
                    @media print {
                        body { print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏫 תקנון חוגים</h1>
                    <h2>מרכז החוגים שלנו</h2>
                    <p>תאריך הדפסה: ${new Date().toLocaleDateString('he-IL')}</p>
                </div>
                ${printContent.innerHTML}
                <div style="margin-top: 40px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                    <p><strong>לשאלות נוספות:</strong></p>
                    <p>📞 טלפון: 03-1234567 | ✉️ אימייל: info@center.co.il</p>
                    <p>🌐 אתר: www.center.co.il</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'תקנון חוגים - מרכז החוגים',
                    text: 'תקנון חוגים של מרכז החוגים שלנו',
                    url: window.location.origin + '/terms'
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(getTermsAsText());
            alert('התקנון הועתק ללוח');
        }
    };

    const getTermsAsText = () => {
        return `
תקנון חוגים - מרכז החוגים

1. פתיחת חוגים
פתיחת חוג מותנית במספר נרשמים מינימלי של 8 תלמידים לפחות.

2. תשלומים
ההשתתפות בחוגים מותנית בתשלום מראש לכל תקופת הפעילות.

3. מדיניות ביטולים
ביטול השתתפות יתאפשר עד 48 שעות לפני תחילת החוג עם החזר מלא.

4. שינויי מועדים
המרכז שומר לעצמו את הזכות לשנות מיקום או מועד החוגים בהודעה מוקדמת.

5. התנהגות נאותה
על המשתתפים להקפיד על התנהגות נאותה ולכבד את המדריכים והמשתתפים האחרים.

6. אחריות על רכוש
המרכז אינו אחראי על אובדן או נזק לרכוש אישי של המשתתפים.

7. פניות ושאלות
בכל שאלה או הבהרה ניתן לפנות לצוות המרכז בטלפון או באימייל.

לשאלות נוספות: 03-1234567 או info@center.co.il
        `;
    };

    const termsData = [
        {
            id: 1,
            icon: GroupIcon,
            title: 'פתיחת חוגים',
            content: 'פתיחת חוג מותנית במספר נרשמים מינימלי של 8 תלמידים לפחות.',
            color: '#3b82f6'
        },
        {
            id: 2,
            icon: PaymentIcon,
            title: 'תשלומים',
            content: 'ההשתתפות בחוגים מותנית בתשלום מראש לכל תקופת הפעילות.',
            color: '#059669'
        },
        {
            id: 3,
            icon: CancelIcon,
            title: 'מדיניות ביטולים',
            content: 'ביטול השתתפות יתאפשר עד 48 שעות לפני תחילת החוג עם החזר מלא.',
            color: '#dc2626'
        },
        {
            id: 4,
            icon: ScheduleIcon,
            title: 'שינויי מועדים',
            content: 'המרכז שומר לעצמו את הזכות לשנות מיקום או מועד החוגים בהודעה מוקדמת.',
            color: '#d97706'
        },
        {
            id: 5,
            icon: SchoolIcon,
            title: 'התנהגות נאותה',
            content: 'על המשתתפים להקפיד על התנהגות נאותה ולכבד את המדריכים והמשתתפים האחרים.',
            color: '#7c3aed'
        },
        {
            id: 6,
            icon: SecurityIcon,
            title: 'אחריות על רכוש',
            content: 'המרכז אינו אחראי על אובדן או נזק לרכוש אישי של המשתתפים.',
            color: '#ef4444'
        },
        {
            id: 7,
            icon: HelpIcon,
            title: 'פניות ושאלות',
            content: 'בכל שאלה או הבהרה ניתן לפנות לצוות המרכז בטלפון או באימייל.',
            color: '#06b6d4'
        }
    ];

    // קומפוננט צפיה באתר
    const WebViewContent = () => (
        <Box sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f8fafc'
        }}>
            {/* כלי עזר */}
            <Box sx={{ 
                p: 2, 
                bgcolor: 'white',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="הדפס תקנון">
                        <IconButton onClick={handlePrint} size="small">
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="שתף תקנון">
                        <IconButton onClick={handleShare} size="small">
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="הורד כקובץ">
                        <IconButton 
                            onClick={() => {
                                const element = document.createElement('a');
                                const file = new Blob([getTermsAsText()], {type: 'text/plain'});
                                element.href = URL.createObjectURL(file);
                                element.download = 'תקנון-חוגים.txt';
                                document.body.appendChild(element);
                                element.click();
                                document.body.removeChild(element);
                            }} 
                            size="small"
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e40af' }}>
                    תקנון חוגים - צפיה באתר
                </Typography>
            </Box>

            {/* תוכן התקנון בפורמט אתר */}
            <Box sx={{ 
                flex: 1,
                overflow: 'auto',
                p: 3
            }}>
                <div id="terms-content">
                    {/* כותרת ראשית */}
                    <Card sx={{ 
                        mb: 3,
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: 'white',
                        borderRadius: '15px'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                                🏫 תקנון חוגים
                            </Typography>
                            <Typography variant="h5" sx={{ opacity: 0.9 }}>
                                מרכז החוגים שלנו
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
                                עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* הודעת פתיחה */}
                    <Card sx={{ 
                        mb: 3,
                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        border: '2px solid #93c5fd',
                        borderRadius: '12px'
                    }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e40af', mb: 2 }}>
                                ברוכים הבאים למרכז החוגים שלנו! 🎉
                            </Typography>
                                                       <Typography variant="body1" sx={{ color: '#1e40af', lineHeight: 1.6 }}>
                                אנו שמחים שבחרתם להצטרף אלינו. התקנון הבא נועד להבטיח חוויה מיטבית לכל המשתתפים.
                                אנא קראו בעיון את כל הסעיפים לפני ההרשמה לחוגים.
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* סעיפי התקנון */}
                    {termsData.map((term, index) => {
                        const IconComponent = term.icon;
                        return (
                            <motion.div
                                key={term.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <Card className="term-item" sx={{ 
                                    mb: 2,
                                    borderRadius: '12px',
                                    border: `2px solid ${term.color}20`,
                                    background: `linear-gradient(135deg, ${term.color}05 0%, white 100%)`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 8px 25px ${term.color}20`
                                    }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Avatar sx={{ 
                                                bgcolor: term.color, 
                                                width: 50,
                                                height: 50,
                                                boxShadow: `0 4px 12px ${term.color}30`
                                            }}>
                                                <IconComponent sx={{ fontSize: 24 }} />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                    <Typography 
                                                        className="term-title"
                                                        variant="h6"
                                                        sx={{ 
                                                            fontWeight: 'bold',
                                                            color: term.color
                                                        }}
                                                    >
                                                        {term.title}
                                                    </Typography>
                                                    <Chip 
                                                        label={`סעיף ${term.id}`} 
                                                        size="small"
                                                        sx={{ 
                                                            bgcolor: `${term.color}20`,
                                                            color: term.color,
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                </Box>
                                                <Typography 
                                                    className="term-content"
                                                    variant="body1" 
                                                    sx={{ 
                                                        color: '#374151',
                                                        lineHeight: 1.6,
                                                        fontSize: '1.1rem'
                                                    }}
                                                >
                                                    {term.content}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}

                    {/* מידע ליצירת קשר */}
                    <Card sx={{ 
                        mt: 4,
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        border: '2px solid #22c55e',
                        borderRadius: '15px'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#15803d', mb: 2 }}>
                                📞 יצירת קשר ושאלות
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#166534', mb: 2 }}>
                                לכל שאלה, הבהרה או בקשה מיוחדת - אנחנו כאן בשבילכם!
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#15803d' }}>
                                        📞 טלפון
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#166534' }}>
                                        .......
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#15803d' }}>
                                        ✉️ אימייל
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#166534' }}>
                                       easyoffice100@gmail.com
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#15803d' }}>
                                        🌐 אתר
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#166534' }}>
                                        ........co.il
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* הערת כתב ויתור */}
                    <Card sx={{ 
                        mt: 3,
                        bgcolor: '#f9fafb',
                        border: '1px solid #e5e7eb'
                    }}>
                        <CardContent sx={{ py: 2 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center', lineHeight: 1.4 }}>
                                ⚖️ המרכז שומר לעצמו את הזכות לעדכן את התקנון מעת לעת • 
                                עדכונים יפורסמו באתר ויישלחו למשתתפים הרשומים • 
                                המשך השימוש במרכז מהווה הסכמה לתקנון המעודכן
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            </Box>
        </Box>
    );

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            sx={{
                direction: 'rtl',
                '& .MuiDialog-paper': {
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    height: '95vh',
                    maxHeight: '95vh',
                    display: 'flex',
                    flexDirection: 'column'
                },
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                {/* Header עם טאבים */}
                <DialogTitle
                    sx={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: 'white',
                        p: 0,
                        position: 'relative',
                        overflow: 'hidden',
                        flexShrink: 0
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            opacity: 0.3
                        }}
                    />
                    
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {/* כותרת */}
                        <Box sx={{ 
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <GavelIcon sx={{ fontSize: 22 }} />
                                </Avatar>
                                <Box>
                                    <Typography 
                                        variant="h5"
                                        sx={{ 
                                            fontWeight: 'bold',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                        }}
                                    >
                                        תקנון חוגים
                                    </Typography>
                                    <Typography 
                                        variant="body2"
                                        sx={{ opacity: 0.9 }}
                                    >
                                        אנא קראו בעיון לפני ההרשמה
                                    </Typography>
                                </Box>
                            </Box>

                            <IconButton
                                onClick={handleClose}
                                sx={{
                                    color: 'white',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.3)',
                                        transform: 'rotate(90deg)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {/* טאבים */}
                        <Tabs
                            value={currentTab}
                            onChange={(e, newValue) => setCurrentTab(newValue)}
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#fbbf24',
                                    height: '3px'
                                },
                                '& .MuiTab-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    '&.Mui-selected': {
                                        color: '#fbbf24'
                                    }
                                }
                            }}
                        >
                            <Tab 
                                icon={<GavelIcon />} 
                                label="תקנון מקוצר" 
                                iconPosition="start"
                                sx={{ minHeight: '60px' }}
                            />
                            <Tab 
                                icon={<WebIcon />} 
                                label="צפיה באתר" 
                                iconPosition="start"
                                sx={{ minHeight: '60px' }}
                            />
                        </Tabs>
                    </Box>
                </DialogTitle>

                {/* תוכן לפי טאב */}
                <DialogContent sx={{ 
                    p: 0, 
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {currentTab === 0 ? (
                        // תוכן התקנון המקורי
                        <Box sx={{ 
                            flex: 1,
                            overflow: 'auto',
                            bgcolor: '#f8fafc'
                        }}>
                            {/* הודעת פתיחה */}
                            <Box sx={{ p: 2, bgcolor: 'white', flexShrink: 0 }}>
                                <Card sx={{ 
                                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                    border: '1px solid #93c5fd',
                                    borderRadius: '12px'
                                }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <Avatar sx={{ bgcolor: '#3b82f6', width: 35, height: 35 }}>
                                                <SchoolIcon sx={{ fontSize: 18 }} />
                                            </Avatar>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e40af' }}>
                                                ברוכים הבאים למרכז החוגים שלנו!
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#1e40af', lineHeight: 1.5 }}>
                                            אנו שמחים שבחרתם להצטרף אלינו. התקנון הבא נועד להבטיח חוויה מיטבית לכל המשתתפים.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>

                            {/* רשימת התקנות */}
                            <Box sx={{ px: 2, flex: 1, minHeight: 0 }}>
                                <Box sx={{ maxHeight: '100%', overflow: 'auto', pr: 1 }}>
                                    <List sx={{ p: 0 }}>
                                        {termsData.map((term, index) => {
                                            const IconComponent = term.icon;
                                            return (
                                                <motion.div
                                                    key={term.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                                >
                                                    <Card sx={{ 
                                                        mb: 2,
                                                        borderRadius: '12px',
                                                        border: `2px solid ${term.color}20`,
                                                        background: `linear-gradient(135deg, ${term.color}05 0%, white 100%)`,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: `0 8px 25px ${term.color}20`
                                                        }
                                                    }}>
                                                        <CardContent sx={{ p: 2 }}>
                                                            <ListItem sx={{ p: 0 }}>
                                                                <ListItemIcon sx={{ minWidth: 50 }}>
                                                                    <Avatar sx={{ 
                                                                        bgcolor: term.color, 
                                                                        width: 40,
                                                                        height: 40,
                                                                        boxShadow: `0 4px 12px ${term.color}30`
                                                                    }}>
                                                                        <IconComponent sx={{ fontSize: 20 }} />
                                                                    </Avatar>
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={
                                                                        <Box sx={{ 
                                                                            display: 'flex', 
                                                                            alignItems: 'center', 
                                                                            gap: 2, 
                                                                            mb: 1,
                                                                            justifyContent: 'space-between'
                                                                        }}>
                                                                            <Typography 
                                                                                variant="subtitle1"
                                                                                sx={{ 
                                                                                    fontWeight: 'bold',
                                                                                    color: term.color
                                                                                }}
                                                                            >
                                                                                {term.title}
                                                                            </Typography>
                                                                            <Chip 
                                                                                label={`סעיף ${term.id}`} 
                                                                                size="small"
                                                                                sx={{ 
                                                                                    bgcolor: `${term.color}20`,
                                                                                    color: term.color,
                                                                                    fontWeight: 'bold',
                                                                                    fontSize: '0.7rem'
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                    }
                                                                    secondary={
                                                                        <Typography 
                                                                            variant="body2" 
                                                                            sx={{ 
                                                                                color: '#374151',
                                                                                lineHeight: 1.5
                                                                            }}
                                                                        >
                                                                            {term.content}
                                                                        </Typography>
                                                                    }
                                                                />
                                                            </ListItem>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            );
                                        })}
                                    </List>
                                </Box>
                            </Box>

                            <Divider sx={{ mx: 2, background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)' }} />

                            {/* שליחה במייל */}
                            <Box sx={{ p: 2, bgcolor: 'white', flexShrink: 0 }}>
                                <Card sx={{ 
                                    background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
                                    border: '2px solid #0284c7',
                                    borderRadius: '12px'
                                }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Avatar sx={{ bgcolor: '#0284c7', width: 35, height: 35 }}>
                                                <EmailIcon sx={{ fontSize: 18 }} />
                                            </Avatar>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                                                קבלת התקנון במייל
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="כתובת אימייל"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setEmailError('');
                                                }}
                                                error={!!emailError}
                                                helperText={emailError}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: 'white',
                                                        borderRadius: '8px'
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={handleSendEmail}
                                                disabled={emailSending || !email}
                                                startIcon={emailSending ? <CircularProgress size={16} /> : <SendIcon />}
                                                sx={{
                                                    bgcolor: '#0284c7',
                                                    minWidth: '100px',
                                                    height: '40px',
                                                    '&:hover': { bgcolor: '#0369a1' }
                                                }}
                                            >
                                                {emailSending ? 'שולח...' : 'שלח'}
                                            </Button>
                                        </Box>

                                        {emailSent && (
                                            <Alert severity="success" sx={{ mt: 1, fontSize: '0.85rem' }}>
                                                התקנון נשלח בהצלחה לכתובת המייל!
                                            </Alert>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>

                            {/* אישור קריאת התקנון */}
                            <Box sx={{ p: 2, bgcolor: 'white', flexShrink: 0 }}>
                                <Card sx={{ 
                                    background: accepted 
                                        ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
                                        : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                    border: accepted 
                                        ? '2px solid #10b981' 
                                        : '2px solid #f59e0b',
                                    borderRadius: '12px',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ 
                                                bgcolor: accepted ? '#10b981' : '#f59e0b',
                                                width: 40,
                                                height: 40,
                                                transition: 'all 0.3s ease'
                                            }}>
                                                {accepted ? <CheckCircleIcon sx={{ fontSize: 20 }} /> : <WarningIcon sx={{ fontSize: 20 }} />}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={accepted}
                                                            onChange={(e) => setAccepted(e.target.checked)}
                                                            sx={{
                                                                color: accepted ? '#10b981' : '#f59e0b',
                                                                '&.Mui-checked': {
                                                                    color: '#10b981',
                                                                },
                                                                transform: 'scale(1.1)',
                                                                mr: 1
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography 
                                                            variant="body1" 
                                                            sx={{ 
                                                                fontWeight: 'bold',
                                                                color: accepted ? '#065f46' : '#92400e',
                                                                lineHeight: 1.4
                                                            }}
                                                        >
                                                            קראתי ואני מסכים/ה לכל תנאי התקנון המפורטים לעיל
                                                        </Typography>
                                                    }
                                                    sx={{ m: 0 }}
                                                />
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: accepted ? '#047857' : '#b45309',
                                                        mt: 0.5,
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    {accepted 
                                                        ? 'תודה! כעת תוכלו להמשיך בתהליך ההרשמה' 
                                                        : 'יש לאשר את התקנון כדי להמשיך'
                                                    }
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                    ) : (
                        // תוכן צפיה באתר
                        <WebViewContent />
                    )}
                </DialogContent>

                {/* כפתורי פעולה - קבועים */}
                <DialogActions sx={{ 
                    p: 2,
                    background: 'white',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexShrink: 0,
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        size="medium"
                        sx={{
                            borderRadius: '20px',
                            px: 3,
                            py: 1,
                            fontSize: '0.95rem',
                            fontWeight: 'bold',
                            borderWidth: '2px',
                            borderColor: '#ef4444',
                            color: '#ef4444',
                            '&:hover': {
                                borderWidth: '2px',
                                borderColor: '#dc2626',
                                background: 'rgba(239, 68, 68, 0.05)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        ביטול
                    </Button>

                    <motion.div
                        whileHover={accepted ? { scale: 1.05 } : {}}
                        whileTap={accepted ? { scale: 0.95 } : {}}
                    >
                        <Button
                            onClick={handleAccept}
                            variant="contained"
                            size="medium"
                            disabled={!accepted}
                            startIcon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
                            sx={{
                                borderRadius: '20px',
                                px: 4,
                                py: 1,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                background: accepted 
                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    : '#e5e7eb',
                                color: accepted ? 'white' : '#9ca3af',
                                boxShadow: accepted 
                                    ? '0 8px 16px rgba(16, 185, 129, 0.4)'
                                    : 'none',
                                '&:hover': {
                                    background: accepted 
                                        ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                        : '#e5e7eb',
                                    transform: accepted ? 'translateY(-2px)' : 'none',
                                    boxShadow: accepted 
                                        ? '0 12px 20px rgba(16, 185, 129, 0.5)'
                                        : 'none',
                                },
                                '&:disabled': {
                                    background: '#e5e7eb',
                                    color: '#9ca3af',
                                    cursor: 'not-allowed'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {accepted ? 'המשך להרשמה' : 'יש לאשר את התקנון'}
                        </Button>
                    </motion.div>
                </DialogActions>

                {/* הודעת כתב ויתור - קבועה */}
                <Box sx={{ 
                    bgcolor: '#f3f4f6', 
                    p: 1.5,
                    borderTop: '1px solid #e5e7eb',
                    textAlign: 'center',
                    flexShrink: 0
                }}>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: '#6b7280',
                            fontSize: '0.8rem',
                            lineHeight: 1.3
                        }}
                    >
                        המרכז שומר לעצמו את הזכות לעדכן את התקנון מעת לעת • 
                        עדכונים יפורסמו באתר ויישלחו למשתתפים הרשומים • 
                        לשאלות: ..... או easyoffice100@gmail.com
                    </Typography>
                </Box>
            </motion.div>
        </Dialog>
    );
};

export default TermsDialog;

