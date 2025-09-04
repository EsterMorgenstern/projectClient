// GROW SDK Integration - Modern approach
import { useEffect } from 'react';

/**
 * Hook להטמעת GROW SDK החדש
 */
export const useGrowSDK = () => {
    useEffect(() => {
        // טעינת GROW SDK
        const loadGrowSDK = () => {
            if (window.growPayment) {
                console.log('✅ GROW SDK already loaded');
                return;
            }

            console.log('📦 Loading GROW SDK...');
            console.log('⚠️ Note: If using NetFree, make sure GROW domains are whitelisted');

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'https://cdn.meshulam.co.il/sdk/gs.min.js';
            script.onload = configureGrowSdk;
            script.onerror = () => {
                console.error('❌ Failed to load GROW SDK');
                console.error('💡 This might be due to NetFree blocking. Try:');
                console.error('   1. Contact NetFree support to whitelist: cdn.meshulam.co.il');
                console.error('   2. Contact NetFree support to whitelist: sandbox.meshulam.co.il');
                console.error('   3. Use a different internet connection for testing');
                
                // שלח אירוע שגיאה עם הודעה ידידותית למשתמש
                window.dispatchEvent(new CustomEvent('growSDKLoadError', { 
                    detail: { 
                        message: 'שגיאה בטעינת מערכת התשלומים - ייתכן שהדומיין חסום על ידי NetFree',
                        isNetFreeIssue: true,
                        technicalDetails: 'Failed to load GROW SDK - possibly blocked by NetFree',
                        fallbackAvailable: true
                    }
                }));
            };
            
            const firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(script, firstScript);
        };

        // קונפיגורציה של GROW SDK
        window.configureGrowSdk = function() {
            console.log('🔧 Configuring GROW SDK...');
            
            const config = {
                environment: "DEV", // "PRODUCTION" לפרודקשן
                version: 1,
                // שימוש ב-Post Message במקום redirect URLs (מומלץ לפיתוח)
                usePostMessage: true, 
                events: {
                    onPaymentStart: (response) => {
                        console.log('🚀 Payment Started:', response);
                        // טיפול בתחילת תשלום
                        window.dispatchEvent(new CustomEvent('growPaymentStart', { 
                            detail: response 
                        }));
                    },
                    onSuccess: (response) => {
                        console.log('✅ Payment Success:', response);
                        // טיפול בהצלחת תשלום
                        window.dispatchEvent(new CustomEvent('growPaymentSuccess', { 
                            detail: response 
                        }));
                    },
                    onFailure: (response) => {
                        console.log('❌ Payment Failure:', response);
                        // טיפול בכישלון תשלום
                        window.dispatchEvent(new CustomEvent('growPaymentFailure', { 
                            detail: response 
                        }));
                    },
                    onError: (response) => {
                        console.log('🚨 Payment Error:', response);
                        // בדוק אם זו שגיאת NetFree
                        const isNetFreeError = response && (
                            response.error?.includes('418') || 
                            response.error?.includes('Blocked by NetFree') ||
                            response.message?.includes('NetFree')
                        );
                        
                        // טיפול בשגיאת תשלום
                        window.dispatchEvent(new CustomEvent('growPaymentError', { 
                            detail: { 
                                ...response, 
                                isNetFreeError,
                                userMessage: isNetFreeError ? 
                                    'התשלום נחסם על ידי NetFree. אנא פנה לתמיכה.' : 
                                    'שגיאה בתהליך התשלום'
                            }
                        }));
                    },
                    onTimeout: (response) => {
                        console.log('⏰ Payment Timeout:', response);
                        // טיפול בפג זמן
                        window.dispatchEvent(new CustomEvent('growPaymentTimeout', { 
                            detail: response 
                        }));
                    },
                    onPaymentCancel: (response) => {
                        console.log('🚫 Payment Cancelled:', response);
                        // טיפול בביטול תשלום
                        window.dispatchEvent(new CustomEvent('growPaymentCancel', { 
                            detail: response 
                        }));
                    },
                    onWalletChange: (state) => {
                        console.log('👛 Wallet State Changed:', state);
                        // טיפול בשינוי מצב הארנק (open/close)
                        window.dispatchEvent(new CustomEvent('growWalletChange', { 
                            detail: { state } 
                        }));
                    }
                }
            };
            
            if (window.growPayment) {
                window.growPayment.init(config);
                console.log('✅ GROW SDK configured successfully');
            }
        };

        loadGrowSDK();
        
        // Cleanup
        return () => {
            // ניקוי אם נדרש
        };
    }, []);
};

/**
 * פונקציה לפתיחת ארנק GROW עם authCode
 * @param {string} authCode - הקוד מהשרת
 */
export const openGrowWallet = (authCode) => {
    if (!authCode) {
        console.error('❌ No authCode provided to openGrowWallet');
        return false;
    }

    if (!window.growPayment) {
        console.error('❌ GROW SDK not loaded');
        return false;
    }

    try {
        console.log('🚀 Opening GROW wallet with authCode:', authCode);
        window.growPayment.renderPaymentOptions(authCode);
        return true;
    } catch (error) {
        console.error('❌ Error opening GROW wallet:', error);
        return false;
    }
};

/**
 * Component להטמעת GROW SDK באפליקציה
 */
export const GrowSDKProvider = ({ children }) => {
    useGrowSDK();
    return children;
};
