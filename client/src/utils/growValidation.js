import API_BASE_URL from '../config/api';

/**
 * בדיקת זמינות השרת
 * @returns {Promise<boolean>} - האם השרת זמין
 */
export const checkServerHealth = async () => {
    try {
        console.log('🏥 Checking server health at:', API_BASE_URL);
        
        // שימוש ב-endpoint הנכון מה-Swagger
        const response = await fetch(`${API_BASE_URL}/Instructor/GetAll`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        console.log('🏥 Health check response status:', response.status);
        return response.ok;
    } catch (error) {
        console.error('❌ Server health check failed:', error);
        return false;
    }
};

/**
 * בדיקת נגישות endpoint של GROW Payment
 * @returns {Promise<object>} - תוצאת הבדיקה
 */
export const checkGrowEndpoint = async () => {
    try {
        console.log('🔍 Checking GROW endpoint...');
        
        // שימוש בנתיב הנכון מה-Swagger
        const response = await fetch(`${API_BASE_URL}/Payments/CreateGrowWalletPayment`, {
            method: 'OPTIONS', // בדיקת CORS ונגישות
        });

        console.log('🔍 GROW endpoint check status:', response.status);
        console.log('🔍 GROW endpoint headers:', response.headers);

        return {
            available: response.status < 500, // אם זה לא 500+ זה אומר שהendpoint קיים
            status: response.status,
            cors: response.headers.get('access-control-allow-origin') !== null
        };
    } catch (error) {
        console.error('❌ GROW endpoint check failed:', error);
        return {
            available: false,
            error: error.message
        };
    }
};

/**
 * פונקציה מקיפה לבדיקת כל הדרישות לפני תשלום
 * @returns {Promise<object>} - תוצאת הבדיקות
 */
export const validateGrowRequirements = async () => {
    console.log('🔧 Running GROW requirements validation...');
    
    const results = {
        serverHealth: false,
        growEndpoint: false,
        apiUrl: !!API_BASE_URL,
        errors: []
    };

    // בדיקת API URL
    if (!API_BASE_URL) {
        results.errors.push('API_BASE_URL לא מוגדר');
    } else {
        console.log('✅ API_BASE_URL configured:', API_BASE_URL);
    }

    // בדיקת בריאות השרת
    try {
        results.serverHealth = await checkServerHealth();
        if (results.serverHealth) {
            console.log('✅ Server is healthy');
        } else {
            results.errors.push('השרת לא זמין');
        }
    } catch (error) {
        results.errors.push(`שגיאה בבדיקת השרת: ${error.message}`);
    }

    // בדיקת GROW endpoint
    try {
        const endpointCheck = await checkGrowEndpoint();
        results.growEndpoint = endpointCheck.available;
        
        if (endpointCheck.available) {
            console.log('✅ GROW endpoint is available');
        } else {
            results.errors.push(`GROW endpoint לא זמין: ${endpointCheck.error || 'סטטוס ' + endpointCheck.status}`);
        }
    } catch (error) {
        results.errors.push(`שגיאה בבדיקת GROW endpoint: ${error.message}`);
    }

    // סיכום
    const allGood = results.serverHealth && results.growEndpoint && results.apiUrl;
    console.log(allGood ? '🎉 All GROW requirements validated successfully!' : '⚠️ Some GROW requirements failed validation');
    console.log('📋 Validation results:', results);

    return results;
};
