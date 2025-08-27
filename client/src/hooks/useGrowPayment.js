import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGrowPayment } from '../store/payments/createGrowPayment';
import { validateGrowRequirements } from '../utils/growValidation';

/**
 * Hook מותאם אישית לטיפול בתשלומי GROW
 * @returns {Object} - אובייקט עם פונקציות ומצבים לניהול תשלומי GROW
 */
export const useGrowPayment = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState(null);

    /**
     * יוצר תשלום GROW חדש
     * @param {Object} paymentData - נתוני התשלום
     * @param {number} paymentData.studentId - ID של התלמיד
     * @param {number} paymentData.amount - סכום התשלום
     * @param {string} paymentData.description - תיאור התשלום
     * @param {string} paymentData.fullName - שם מלא
     * @param {string} paymentData.phone - מספר טלפון
     * @param {string} [paymentData.creditCardNumber] - מספר כרטיס אשראי (אופציונלי)
     * @returns {Promise<Object|null>} - URL להפניה או null במקרה של שגיאה
     */
    const initiatePayment = async (paymentData) => {
        try {
            setIsLoading(true);
            setError(null);

            // ולידציה בסיסית
            if (!paymentData.studentId) {
                throw new Error('חסר ID תלמיד');
            }
            if (!paymentData.amount || paymentData.amount <= 0) {
                throw new Error('סכום התשלום חייב להיות גדול מ-0');
            }
            if (!paymentData.fullName?.trim()) {
                throw new Error('חסר שם מלא');
            }
            if (!paymentData.phone?.trim()) {
                throw new Error('חסר מספר טלפון');
            }

            console.log('🚀 Initiating GROW payment:', paymentData);

            // בדיקת דרישות מערכת לפני שליחת הבקשה
            console.log('🔧 Validating system requirements...');
            const validationResults = await validateGrowRequirements();
            
            if (validationResults.errors.length > 0) {
                console.warn('⚠️ Validation warnings:', validationResults.errors);
                // נמשיך למרות האזהרות, אבל נרשום אותן
            }

            const result = await dispatch(createGrowPayment(paymentData));

            if (createGrowPayment.fulfilled.match(result)) {
                const redirectUrl = result.payload.redirectUrl;
                setPaymentUrl(redirectUrl);
                console.log('✅ Payment URL created:', redirectUrl);
                return { success: true, redirectUrl };
            } else {
                throw new Error(result.payload || 'שגיאה ביצירת תשלום');
            }

        } catch (err) {
            console.error('❌ Error initiating GROW payment:', err);
            setError(err.message || 'שגיאה ביצירת תשלום GROW');
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * מנקה את המצב לטפסים/דיאלוגים חדשים
     */
    const resetState = () => {
        setError(null);
        setPaymentUrl(null);
    };

    /**
     * פותח את דף התשלום בחלון חדש
     * @param {string} url - URL של דף התשלום
     */
    const openPaymentWindow = (url) => {
        if (!url) {
            console.error('❌ No payment URL provided');
            return;
        }

        const width = 800;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const paymentWindow = window.open(
            url,
            'GrowPayment',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );

        if (!paymentWindow) {
            console.error('❌ Failed to open payment window - popup blocked?');
            setError('לא ניתן לפתוח חלון תשלום. אנא וודא שחסימת חלונות קופצים מבוטלת.');
            return null;
        }

        // מאזין לסגירת החלון
        const checkClosed = setInterval(() => {
            if (paymentWindow.closed) {
                clearInterval(checkClosed);
                console.log('🔄 Payment window closed');
            }
        }, 1000);

        return paymentWindow;
    };

    return {
        // מצבים
        isLoading,
        error,
        paymentUrl,

        // פונקציות
        initiatePayment,
        resetState,
        openPaymentWindow,

        // פונקציות עזר
        clearError: () => setError(null)
    };
};

export default useGrowPayment;
