// כלי לבדיקת זמינות השרת וה-endpoints
import API_BASE_URL from '../config/api';

export const checkServerAvailability = async () => {
    try {
        console.log('🌐 Checking server availability...');
        console.log('Server URL:', API_BASE_URL);
        
        // בדיקה בסיסית של השרת
        const healthCheck = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Server response status:', healthCheck.status);
        
        if (healthCheck.ok) {
            const text = await healthCheck.text();
            console.log('Server response:', text);
        }
        
        return healthCheck.ok;
    } catch (error) {
        console.error('Server not reachable:', error);
        return false;
    }
};

export const checkPaymentEndpoints = async () => {
    const endpoints = [
        '/Payments',
        '/Payment', 
        '/api/Payments',
        '/api/Payment',
        '/Payments/CreateGrowWalletPayment',
        '/Payment/CreateGrowWalletPayment',
        '/api/Payments/CreateGrowWalletPayment',
        '/api/Payment/CreateGrowWalletPayment'
    ];
    
    console.log('🔍 Checking payment endpoints...');
    
    for (const endpoint of endpoints) {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log(`${endpoint}: ${response.status} ${response.statusText}`);
            
            if (response.status !== 404) {
                console.log(`✅ Endpoint exists: ${endpoint}`);
                
                // אם זה endpoint של יצירת תשלום, ננסה POST
                if (endpoint.includes('CreateGrowWalletPayment')) {
                    try {
                        const postTest = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({})
                        });
                        console.log(`POST test for ${endpoint}: ${postTest.status}`);
                    } catch (postError) {
                        console.log(`POST test error: ${postError.message}`);
                    }
                }
            }
        } catch (error) {
            console.log(`${endpoint}: Error - ${error.message}`);
        }
    }
};
