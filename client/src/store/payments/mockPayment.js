// מצב פיתוח - סימולציה של תגובת השרת
export const createMockGrowPayment = async (paymentData) => {
    console.log('🧪 MOCK MODE: Creating GROW payment with data:', paymentData);
    
    // סימולציה של זמן המתנה לשרת
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // תגובה מדומה כמו מהשרת
    const mockResponse = {
        message: "Payment process created successfully (MOCK)",
        
        // שני מצבים: SDK (authCode) ו-Legacy (redirectUrl)
        // בפיתוח נשתמש ב-redirectUrl כי זה עובד בטוח
        redirectUrl: "https://sandbox.meshulam.co.il/api/light/server/1.0/redirect?processToken=MOCK_TOKEN_12345",
        
        // לעתיד: authCode למצב SDK החדש
        // authCode: "MOCK_AUTH_CODE_12345",
        
        success: true,
        transactionId: `MOCK_TXN_${Date.now()}`,
        data: {
            studentId: paymentData.studentId,
            amount: paymentData.amount,
            description: paymentData.description,
            timestamp: new Date().toISOString()
        }
    };
    
    console.log('✅ MOCK: Payment created successfully:', mockResponse);
    return mockResponse;
};

// בדיקה מהירה עם הנתיב המדויק מהSwagger
export const quickServerCheck = async () => {
    try {
        console.log('⚡ Quick server check using exact Swagger endpoint...');
        const response = await fetch('https://localhost:5249/api/Instructor/GetAll', {
            method: 'GET',
            headers: { 'accept': 'text/plain' } // בדיוק כמו בSwagger
        });
        
        console.log(`⚡ Quick check result: ${response.status} - ${response.ok ? 'SUCCESS' : 'FAILED'}`);
        return response.ok;
    } catch (error) {
        console.log('⚡ Quick check failed:', error.message);
        return false;
    }
};

// בדיקה אם השרת זמין
export const isServerAvailable = async () => {
    // רשימת endpoints לבדיקה (לפי סדר עדיפות)
    const endpointsToCheck = [
        '/api/Instructor/GetAll',  // הנתיב הנכון מה-Swagger
        '/api/Student/GetAll',     // אלטרנטיבה
        '/api/Instructors',        // ניסוי ישן
        '/api/Students',           // ניסוי ישן
        '/api'                     // בדיקה בסיסית
    ];
    
    const baseUrl = 'https://localhost:5249';
    
    for (const endpoint of endpointsToCheck) {
        try {
            console.log(`🔍 Checking endpoint: ${baseUrl}${endpoint}`);
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            
            console.log(`🏥 ${endpoint} status: ${response.status}`);
            
            if (response.ok) {
                console.log(`✅ Server is available via ${endpoint}`);
                return true;
            }
            
            // אפילו 404 זה סימן טוב - השרת פועל אבל הנתיב לא קיים
            if (response.status === 404) {
                console.log(`⚠️ ${endpoint} returns 404 but server is running`);
                continue; // ננסה את הבא
            }
            
        } catch (error) {
            console.log(`❌ ${endpoint} failed:`, error.message);
            continue; // ננסה את הבא
        }
    }
    
    console.log('❌ Server not available on any checked endpoint');
    return false;
};
