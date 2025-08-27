import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Alert,
    TextField,
    Grid
} from '@mui/material';
import API_BASE_URL from '../config/api';

/**
 * כלי בדיקה מינימלי לחיבור לשרת
 */
const ServerConnectionTest = () => {
    const [testResult, setTestResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [customUrl, setCustomUrl] = useState(API_BASE_URL || '');

    const testServerConnection = async () => {
        setIsLoading(true);
        setTestResult(null);

        const results = {
            apiUrl: customUrl,
            tests: []
        };

        try {
            // בדיקה 1: ping לשרת
            console.log('🌐 Testing server connection...');
            
            const testUrl = customUrl || API_BASE_URL;
            results.tests.push({ name: 'בדיקת URL', status: 'running', url: testUrl });

            // בדיקה פשוטה של חיבור
            try {
                const response = await fetch(testUrl, {
                    method: 'HEAD',
                    mode: 'cors'
                });
                
                results.tests[0].status = 'success';
                results.tests[0].details = `סטטוס: ${response.status}`;
                
            } catch (error) {
                results.tests[0].status = 'error';
                results.tests[0].details = error.message;
            }

            // בדיקה 2: בדיקת GROW endpoint
            try {
                const growUrl = `${testUrl}/Payment/CreateGrowWalletPayment`;
                const response = await fetch(growUrl, {
                    method: 'OPTIONS',
                    mode: 'cors'
                });
                
                results.tests.push({
                    name: 'GROW Endpoint',
                    status: response.status < 500 ? 'success' : 'warning',
                    details: `סטטוס: ${response.status}`,
                    url: growUrl
                });
                
            } catch (error) {
                results.tests.push({
                    name: 'GROW Endpoint',
                    status: 'error',
                    details: error.message
                });
            }

            // בדיקה 3: בדיקת CORS
            try {
                const response = await fetch(`${testUrl}/health`, {
                    method: 'GET',
                    mode: 'cors'
                });
                
                results.tests.push({
                    name: 'CORS Policy',
                    status: 'success',
                    details: 'CORS מוגדר נכון'
                });
                
            } catch (error) {
                if (error.message.includes('CORS')) {
                    results.tests.push({
                        name: 'CORS Policy',
                        status: 'error',
                        details: 'CORS חסום - צריך להגדיר בשרת'
                    });
                } else {
                    results.tests.push({
                        name: 'CORS Policy',
                        status: 'warning',
                        details: error.message
                    });
                }
            }

        } catch (error) {
            console.error('Error in server test:', error);
            results.error = error.message;
        }

        setTestResult(results);
        setIsLoading(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'success';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'info';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'success': return '✅ עובד';
            case 'warning': return '⚠️ אזהרה';
            case 'error': return '❌ שגיאה';
            case 'running': return '🔄 בודק...';
            default: return '❓ לא ידוע';
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    בדיקת חיבור לשרת
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            label="כתובת השרת"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="http://localhost:5248/api"
                            helperText="הכנס את כתובת הAPI של השרת"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={testServerConnection}
                            disabled={isLoading}
                            sx={{ height: '56px' }}
                        >
                            {isLoading ? 'בודק...' : 'בדוק חיבור'}
                        </Button>
                    </Grid>
                </Grid>

                {testResult && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            תוצאות בדיקה:
                        </Typography>
                        
                        {testResult.error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                שגיאה כללית: {testResult.error}
                            </Alert>
                        )}

                        {testResult.tests.map((test, index) => (
                            <Alert 
                                key={index}
                                severity={getStatusColor(test.status)}
                                sx={{ mb: 1 }}
                            >
                                <Typography variant="subtitle2">
                                    {test.name}: {getStatusText(test.status)}
                                </Typography>
                                {test.details && (
                                    <Typography variant="body2">
                                        {test.details}
                                    </Typography>
                                )}
                                {test.url && (
                                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                        URL: {test.url}
                                    </Typography>
                                )}
                            </Alert>
                        ))}

                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="caption">
                                <strong>עצות לפתרון בעיות:</strong><br/>
                                • אם יש שגיאת CORS - הוסף את הדומיין בשרת<br/>
                                • אם השרת לא זמין - בדוק שהוא רץ על הפורט הנכון<br/>
                                • אם GROW endpoint לא עובד - בדוק את הנתיב בקוד השרת
                            </Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ServerConnectionTest;
