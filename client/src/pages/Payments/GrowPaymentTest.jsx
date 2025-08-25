import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import GrowPaymentButton from '../../components/GrowPaymentButton';
import GrowPaymentDialog from './GrowPaymentDialog';
import { validateGrowRequirements } from '../../utils/growValidation';
import ServerConnectionTest from '../../components/ServerConnectionTest';
import EndpointChecker from '../../components/EndpointChecker';

/**
 * דף בדיקה לפונקציונליות GROW Payment
 * זה דף זמני לבדיקת התממשקות
 */
const GrowPaymentTest = () => {
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [validationResults, setValidationResults] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    // תלמידים דמה לבדיקה
    const mockStudents = [
        { id: 1, firstName: 'יוסי', lastName: 'כהן', phone: '050-1234567' },
        { id: 2, firstName: 'רחל', lastName: 'לוי', phone: '052-7654321' },
        { id: 3, firstName: 'דוד', lastName: 'ישראלי', phone: '054-9876543' }
    ];

    const selectedStudent = mockStudents.find(s => s.id === selectedStudentId);

    // פונקציה לבדיקת המערכת
    const handleSystemValidation = async () => {
        setIsValidating(true);
        try {
            const results = await validateGrowRequirements();
            setValidationResults(results);
        } catch (error) {
            console.error('Error during validation:', error);
            setValidationResults({
                serverHealth: false,
                growEndpoint: false,
                apiUrl: false,
                errors: [`שגיאה בבדיקה: ${error.message}`]
            });
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <Box sx={{ p: 3, direction: 'rtl', maxWidth: 1200, mx: 'auto' }}>
            {/* כותרת */}
            <Typography variant="h4" component="h1" gutterBottom align="center">
                בדיקת מערכת GROW Payment
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                דף בדיקה לפונקציונליות תשלומי GROW Wallet
            </Typography>

            {/* בדיקת חיבור פשוטה */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <ServerConnectionTest />
                </Grid>
                <Grid item xs={12} md={6}>
                    <EndpointChecker />
                </Grid>
            </Grid>

            {/* התראה */}
            <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
                זהו דף בדיקה זמני. בחר תלמיד ונסה את הפונקציונליות השונות.
            </Alert>

            {/* בדיקת מערכת */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        0. בדיקת מערכת ותקשורת עם השרת
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        לחץ כאן כדי לבדוק שהשרת זמין ו-GROW endpoint פועל
                    </Typography>
                    
                    <Button
                        variant="outlined"
                        onClick={handleSystemValidation}
                        disabled={isValidating}
                        sx={{ mb: 2 }}
                    >
                        {isValidating ? 'בודק...' : 'בדוק מערכת'}
                    </Button>

                    {validationResults && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                תוצאות בדיקה:
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        {validationResults.apiUrl ? <CheckIcon color="success" /> : <ErrorIcon color="error" />}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="הגדרת API URL" 
                                        secondary={validationResults.apiUrl ? "מוגדר נכון" : "לא מוגדר"}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        {validationResults.serverHealth ? <CheckIcon color="success" /> : <ErrorIcon color="error" />}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="בריאות השרת" 
                                        secondary={validationResults.serverHealth ? "השרת זמין" : "השרת לא זמין"}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        {validationResults.growEndpoint ? <CheckIcon color="success" /> : <ErrorIcon color="error" />}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="GROW Endpoint" 
                                        secondary={validationResults.growEndpoint ? "זמין" : "לא זמין"}
                                    />
                                </ListItem>
                            </List>
                            
                            {validationResults.errors.length > 0 && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2">שגיאות ואזהרות:</Typography>
                                    <ul style={{ margin: '8px 0', paddingInlineStart: '20px' }}>
                                        {validationResults.errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </Alert>
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        1. בחר תלמיד לבדיקה
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>בחר תלמיד</InputLabel>
                        <Select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            label="בחר תלמיד"
                        >
                            {mockStudents.map(student => (
                                <MenuItem key={student.id} value={student.id}>
                                    {student.firstName} {student.lastName} - {student.phone}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {/* כפתורי בדיקה */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                2. כפתור תשלום פשוט
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                כפתור עם דיאלוג מובנה - הדרך הפשוטה ביותר
                            </Typography>
                            <GrowPaymentButton
                                student={selectedStudent}
                                buttonText="תשלום דרך GROW (פשוט)"
                                size="large"
                                disabled={!selectedStudent}
                                onSuccess={(paymentData) => {
                                    console.log('✅ Payment completed:', paymentData);
                                    alert(`תשלום הושלם בהצלחה!\nסכום: ${paymentData.amount}₪\nתלמיד: ${paymentData.fullName}`);
                                }}
                                onError={(error) => {
                                    console.error('❌ Payment failed:', error);
                                    alert(`שגיאה בתשלום: ${error}`);
                                }}
                                sx={{ width: '100%' }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                3. תשלום עם סכום קבוע
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                כפתור עם סכום ותיאור מוגדרים מראש
                            </Typography>
                            <GrowPaymentButton
                                student={selectedStudent}
                                amount={350}
                                description="שכר לימוד חודשי"
                                buttonText="שלם שכר לימוד (350₪)"
                                size="large"
                                disabled={!selectedStudent}
                                variant="outlined"
                                onSuccess={(paymentData) => {
                                    alert(`תשלום שכר לימוד הושלם!\nסכום: 350₪`);
                                }}
                                onError={(error) => {
                                    alert(`שגיאה בתשלום שכר לימוד: ${error}`);
                                }}
                                sx={{ width: '100%' }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                4. דיאלוג תשלום מותאם אישית
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                שימוש בדיאלוג נפרד לשליטה מלאה על התהליך
                            </Typography>
                            <button
                                onClick={() => setDialogOpen(true)}
                                disabled={!selectedStudent}
                                style={{
                                    padding: '12px 24px',
                                    background: selectedStudent 
                                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                        : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: selectedStudent ? 'pointer' : 'not-allowed',
                                    fontSize: '16px',
                                    width: '100%'
                                }}
                            >
                                פתח דיאלוג תשלום מותאם אישית
                            </button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* הוראות */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        הוראות בדיקה
                    </Typography>
                    <Typography component="div" variant="body2">
                        <ol style={{ paddingInlineStart: '20px' }}>
                            <li>בחר תלמיד מהרשימה למעלה</li>
                            <li>לחץ על אחד מכפתורי התשלום</li>
                            <li>מלא את הפרטים בטופס</li>
                            <li>לחץ "המשך לתשלום"</li>
                            <li>דף התשלום יפתח בחלון חדש</li>
                            <li>השלם את התהליך בדף GROW</li>
                            <li>חזור לחלון הראשי לראות התוצאה</li>
                        </ol>
                    </Typography>
                </CardContent>
            </Card>

            {/* דיאלוג מותאם אישית */}
            <GrowPaymentDialog
                open={dialogOpen}
                onClose={(wasSuccessful) => {
                    setDialogOpen(false);
                    if (wasSuccessful) {
                        alert('תשלום דרך הדיאלוג המותאם אישית הושלם בהצלחה!');
                    }
                }}
                student={selectedStudent}
                amount={200}
                description="תשלום דרך דיאלוג מותאם אישית"
            />
        </Box>
    );
};

export default GrowPaymentTest;
