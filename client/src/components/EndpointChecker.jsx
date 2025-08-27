import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Alert,
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
import API_BASE_URL from '../config/api';

/**
 * כלי בדיקת endpoints זמינים בשרת
 */
const EndpointChecker = () => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // רשימת endpoints לבדיקה
    const endpointsToCheck = [
        { path: '/health', method: 'GET', description: 'בדיקת בריאות השרת' },
        { path: '/Payments', method: 'GET', description: 'Payments Controller (ברבים)' },
        { path: '/Payments/CreateGrowWalletPayment', method: 'POST', description: 'GROW Payment Endpoint' },
        { path: '/Payments/CreateGrowWalletPayment', method: 'OPTIONS', description: 'CORS עבור GROW' },
        { path: '/Payment', method: 'GET', description: 'Payment Controller (יחיד)' },
        { path: '/api', method: 'GET', description: 'API Root' },
    ];

    const checkEndpoint = async (endpoint) => {
        try {
            const url = `${API_BASE_URL}${endpoint.path}`;
            console.log(`🔍 Checking: ${endpoint.method} ${url}`);

            const response = await fetch(url, {
                method: endpoint.method,
                mode: 'cors',
                headers: endpoint.method === 'POST' ? {
                    'Accept': 'application/json'
                } : {}
            });

            console.log(`📡 Response: ${response.status} ${response.statusText}`);

            return {
                ...endpoint,
                status: response.status,
                statusText: response.statusText,
                success: response.status < 500, // כל דבר שלא 500+ נחשב כהצלחה
                available: response.status !== 404
            };

        } catch (error) {
            console.error(`❌ Error checking ${endpoint.path}:`, error);
            return {
                ...endpoint,
                status: 'ERROR',
                statusText: error.message,
                success: false,
                available: false,
                error: error.message
            };
        }
    };

    const checkAllEndpoints = async () => {
        setIsLoading(true);
        setResults([]);

        console.log('🚀 Starting endpoint checks...');
        
        const checkResults = [];
        for (const endpoint of endpointsToCheck) {
            const result = await checkEndpoint(endpoint);
            checkResults.push(result);
            setResults([...checkResults]); // עדכון מיידי
        }

        console.log('✅ All endpoint checks completed');
        setIsLoading(false);
    };

    const getStatusColor = (result) => {
        if (result.error) return 'error';
        if (result.status === 404) return 'warning';
        if (result.status >= 400 && result.status < 500) return 'info';
        if (result.status >= 200 && result.status < 300) return 'success';
        return 'default';
    };

    const getStatusIcon = (result) => {
        if (result.error || result.status >= 500) return <ErrorIcon color="error" />;
        if (result.status === 404) return <InfoIcon color="warning" />;
        if (result.available) return <CheckIcon color="success" />;
        return <ErrorIcon color="error" />;
    };

    const getStatusMessage = (result) => {
        if (result.error) return `שגיאה: ${result.error}`;
        if (result.status === 404) return 'לא נמצא (404)';
        if (result.status === 405) return 'Method לא מותר (405)';
        if (result.status >= 200 && result.status < 300) return 'זמין';
        return `סטטוס: ${result.status}`;
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    בדיקת Endpoints זמינים
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                    בודק את כל ה-endpoints הרלוונטיים בשרת כדי לזהות איפה הבעיה
                </Typography>

                <Button
                    variant="contained"
                    onClick={checkAllEndpoints}
                    disabled={isLoading}
                    sx={{ mb: 2 }}
                >
                    {isLoading ? 'בודק endpoints...' : 'בדוק כל ה-endpoints'}
                </Button>

                {results.length > 0 && (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            תוצאות בדיקה:
                        </Typography>
                        
                        <List dense>
                            {results.map((result, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        {getStatusIcon(result)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" component="span">
                                                    {result.method} {result.path}
                                                </Typography>
                                                <Chip 
                                                    label={getStatusMessage(result)}
                                                    size="small"
                                                    color={getStatusColor(result)}
                                                />
                                            </Box>
                                        }
                                        secondary={result.description}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        {/* סיכום וייעוץ */}
                        <Box sx={{ mt: 2 }}>
                            {results.some(r => r.path.includes('CreateGrowWalletPayment') && r.available) ? (
                                <Alert severity="success">
                                    ✅ GROW Endpoint נמצא! הבעיה כנראה בפורמט הנתונים או בלוגיקה.
                                </Alert>
                            ) : results.some(r => r.path.includes('Payment') && r.available) ? (
                                <Alert severity="warning">
                                    ⚠️ Payment Controller קיים, אבל CreateGrowWalletPayment חסר. 
                                    בדוק שהפונקציה מוגדרת בשרת.
                                </Alert>
                            ) : (
                                <Alert severity="error">
                                    ❌ Payment Controller לא נמצא. בדוק שהשרת רץ ושה-Controller מוגדר.
                                </Alert>
                            )}
                        </Box>
                    </Box>
                )}

                {isLoading && (
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="info">
                            🔄 בודק endpoints... ({results.length}/{endpointsToCheck.length})
                        </Alert>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default EndpointChecker;
