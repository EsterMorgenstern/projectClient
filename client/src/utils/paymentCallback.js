// פונקציות לטיפול ב-callback של GROW
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

/**
 * Hook לטיפול בעדכוני תשלום מ-callback
 */
export const usePaymentCallback = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // מאזין להודעות מ-GROW דרך PostMessage
        const handlePostMessage = (event) => {
            // בדיקת origin (אבטחה)
            if (!event.origin.includes('meshulam.co.il')) {
                return;
            }

            console.log('📨 Received PostMessage from GROW:', event.data);

            try {
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                
                if (data.type === 'payment_update') {
                    handlePaymentUpdate(data);
                }
            } catch (error) {
                console.error('❌ Error parsing PostMessage:', error);
            }
        };

        const handlePaymentUpdate = (data) => {
            console.log('🔄 Payment update received:', data);
            
            // שלח אירוע מותאם אישית
            window.dispatchEvent(new CustomEvent('paymentCallbackUpdate', {
                detail: data
            }));
        };

        // רישום למאזין
        window.addEventListener('message', handlePostMessage);

        // ניקוי
        return () => {
            window.removeEventListener('message', handlePostMessage);
        };
    }, [dispatch]);
};

/**
 * פונקציה לבדיקת סטטוס תשלום מהשרת
 * @param {string} transactionId - מזהה העסקה
 */
export const checkPaymentStatus = async (transactionId) => {
    try {
        const response = await fetch(`https://localhost:5249/api/Payments/GetByTransactionId/${transactionId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const paymentData = await response.json();
        console.log('💳 Payment status check:', paymentData);
        
        return paymentData;
    } catch (error) {
        console.error('❌ Error checking payment status:', error);
        return null;
    }
};

/**
 * פונקציה לחקירת תשלום (polling) עד שהוא מתעדכן
 * @param {string} transactionId - מזהה העסקה
 * @param {number} maxAttempts - מספר ניסיונות מקסימלי
 * @param {number} interval - זמן המתנה בין ניסיונות (ms)
 */
export const pollPaymentStatus = async (transactionId, maxAttempts = 30, interval = 2000) => {
    console.log(`🔍 Starting payment polling for transaction: ${transactionId}`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`🔄 Polling attempt ${attempt}/${maxAttempts}`);
        
        const paymentData = await checkPaymentStatus(transactionId);
        
        if (paymentData && paymentData.Status) {
            if (paymentData.Status === 'COMPLETED') {
                console.log('✅ Payment completed successfully!');
                return { success: true, data: paymentData };
            } else if (paymentData.Status === 'FAILED') {
                console.log('❌ Payment failed!');
                return { success: false, data: paymentData };
            }
        }
        
        // המתנה לפני הניסיון הבא
        if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }
    
    console.log('⏰ Polling timeout - payment status unknown');
    return { success: null, data: null, timeout: true };
};
