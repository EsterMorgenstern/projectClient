import { createAsyncThunk } from '@reduxjs/toolkit';
import API_BASE_URL from '../../config/api';
import { createMockGrowPayment, isServerAvailable, quickServerCheck } from './mockPayment';

export const createGrowPayment = createAsyncThunk(
    'payments/createGrowPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            console.log('🚀 Creating GROW payment with data:', paymentData);

            // בדיקה אם השרת זמין
            console.log('🔍 Checking if server is available...');
            
            // ♻️ בדיקת זמינות שרת אמיתית
            let serverAvailable = await quickServerCheck();
            if (!serverAvailable) {
                console.log('🔍 Quick check failed, trying comprehensive check...');
                serverAvailable = await isServerAvailable();
            }
            if (!serverAvailable) {
                console.log('⚠️ Server not available, using MOCK mode');
                console.log('💡 Hint: Make sure the C# server is running on https://localhost:5249');
                console.log('💡 Test with: curl -X GET "https://localhost:5249/api/Instructor/GetAll" -H "accept: text/plain"');
                const mockResult = await createMockGrowPayment(paymentData);
                return mockResult;
            }
            
            console.log('✅ Server is available, proceeding with real payment...');

            // בדיקת חיבור לשרת לפני השליחה
            console.log('🌐 API Base URL:', API_BASE_URL);
            console.log('🔗 Full endpoint:', `${API_BASE_URL}/Payments/CreateGrowWalletPayment`);

            // יצירת FormData בהתאם לדוגמה מה-Swagger
            const formData = new FormData();
            
            // שדות חובה בהתאם ל-API - בדיקה מפורטת
            console.log('🔧 Building FormData with validation...');
            
            const requiredFields = {
                studentId: paymentData.studentId || 323234321,
                pageCode: '79fd16425870', // ערך אמיתי
                userId: 'b03a08c792436c6d', // ערך אמיתי
                chargeType: '1', // חייב להיות 1
                sum: paymentData.amount || 50.00
            };
            
            // בדיקת שדות חובה
            Object.entries(requiredFields).forEach(([key, value]) => {
                if (value === 'string' || value === undefined || value === null) {
                    console.warn(`⚠️ Field "${key}" has placeholder value: "${value}" - this might cause GROW API errors`);
                }
                formData.append(key, value);
                console.log(`📝 Added required field: ${key} = ${value}`);
            });
            
            // URLs להחזרה - חשוב: לא יכול להיות localhost!
            const baseUrl = window.location.origin;
            let successUrl, cancelUrl;
            
            // תמיד להשתמש בכתובת חיצונית אמיתית
            successUrl = 'https://coursenet.nethost.co.il/payment-success';
            cancelUrl = 'https://coursenet.nethost.co.il/payment-cancel';
            formData.append('successUrl', successUrl);
            formData.append('cancelUrl', cancelUrl);
            
            // תיאור התשלום
            formData.append('description', paymentData.description || 'בדיקה');
            
            // פרטי הלקוח
            formData.append('pageField_fullName', paymentData.fullName || 'ישראל ישראלי');
            formData.append('pageField_phone', paymentData.phone || '0527176567');
            formData.append('pageField_email', paymentData.email || 'test@example.com');
            
            // שדות נוספים
            formData.append('cField1', paymentData.cField1 || 'React Client');
            formData.append('cField2', paymentData.cField2 || `Student_${paymentData.studentId}`);
            
            // מספר כרטיס אשראי (אופציונלי)
            if (paymentData.creditCardNumber) {
                formData.append('creditCardNumber', paymentData.creditCardNumber);
            }
            
            // אזהרות על ערכי placeholder
            if (requiredFields.pageCode === 'string' || requiredFields.userId === 'string') {
                console.error('🚨 CRITICAL: pageCode and userId have placeholder values!');
                console.error('🚨 This will cause "מתודה לא קיימת" error from GROW API');
                console.error('🚨 Please update the server configuration with real GROW credentials');
            }

            // הדפסת כל הנתונים ב-FormData לדיבוג
            console.log('📋 FormData contents:');
            const formDataEntries = {};
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}: ${value}`);
                formDataEntries[key] = value;
            }
            console.log('📋 FormData as object:', formDataEntries);

            // שליחת הבקשה לשרת בהתאם ל-Swagger
            console.log('🚀 Sending request to server...');
            
            let response;
            try {
                response = await fetch(`${API_BASE_URL}/Payments/CreateGrowWalletPayment`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        // לא מוסיפים Content-Type כי הדפדפן יוסיף אוטומטית עם boundary ל-FormData
                    },
                });
            } catch (fetchError) {
                console.error('❌ Network error:', fetchError);
                throw new Error(`שגיאת רשת: ${fetchError.message}. וודא שהשרת פועל על https://localhost:5249`);
            }

            console.log('📡 Response status:', response.status);
            console.log('📡 Response status text:', response.statusText);
            console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

            // קריאת התגובה פעם אחת בלבד
            let responseData;
            let responseText;
            
            try {
                // נסה לפרסר כ-JSON
                responseText = await response.text();
                console.log('📄 Raw server response:', responseText);
                
                responseData = JSON.parse(responseText);
                console.log('✅ Parsed JSON successfully:', responseData);
            } catch (parseError) {
                console.error('❌ Failed to parse server response as JSON:', parseError);
                console.log('📄 Response was:', responseText);
                throw new Error('תגובת השרת אינה JSON תקין: ' + responseText);
            }

            // טיפול מיוחד בתגובה המוצלחת (200)
            if (response.status === 200) {
                console.log('✅ Payment created successfully:', responseData);
                
                // בדיקה שיש redirectUrl או authCode בתגובה
                if (responseData.redirectUrl) {
                    console.log('🔗 Redirect URL (Legacy):', responseData.redirectUrl);
                    
                    // בדיקה אם ה-redirectUrl מכיל שגיאות
                    if (responseData.redirectUrl.includes('sandbox.meshulam.co.il')) {
                        console.log('⚠️ GROW Wallet URL detected - checking for errors...');
                        
                        // אזהרה למשתמש על בעיות פוטנציאליות
                        console.warn('💡 Legacy redirect detected. Consider upgrading to GROW SDK for better UX');
                        console.warn('💡 If payment fails with "מתודה לא קיימת", update server to return authCode instead');
                    }
                    
                    return {
                        success: true,
                        message: responseData.message || 'Payment process created successfully',
                        redirectUrl: responseData.redirectUrl,
                        data: responseData,
                        // הוספת מידע לטיפול בשגיאות
                        troubleshooting: {
                            serverWorking: true,
                            redirectReceived: true,
                            potentialIssue: 'Should use authCode + SDK instead of redirect',
                            recommendation: 'Update server to return authCode for SDK integration'
                        }
                    };
                } else if (responseData.authCode) {
                    console.log('✅ AuthCode received (Modern SDK):', responseData.authCode);
                    
                    return {
                        success: true,
                        message: responseData.message || 'Payment process created successfully',
                        authCode: responseData.authCode,
                        useSDK: true, // סימון שצריך להשתמש ב-SDK
                        data: responseData
                    };
                } else {
                    console.warn('⚠️ No redirect URL or authCode in response');
                    return responseData;
                }
            }

            // בדיקה מיוחדת לשגיאת "מתודה לא קיימת"
            if (response.status === 0) {
                throw new Error('שגיאת רשת: לא ניתן להתחבר לשרת. בדוק את כתובת השרת ושהוא פועל.');
            }
            
            if (response.status === 405) {
                throw new Error('מתודת HTTP לא נתמכת. השרת לא מקבל בקשות POST לנתיב זה.');
            }

            // טיפול מיוחד בשגיאת 400 (שדות חסרים)
            if (response.status === 400) {
                try {
                    if (responseData.errors) {
                        const missingFields = Object.keys(responseData.errors).join(', ');
                        throw new Error(`שדות חסרים בבקשה: ${missingFields}. בדוק את הפרמטרים הנדרשים.`);
                    }
                    throw new Error(`שגיאה 400: ${responseText}`);
                } catch (parseError) {
                    throw new Error('שגיאה 400: פרמטרים שגויים או חסרים בבקשה');
                }
            }

            // טיפול מיוחד בשגיאת 404
            if (response.status === 404) {
                throw new Error('API endpoint לא נמצא. בדוק שהשרת מותקן נכון ושה-controller קיים.');
            }
            
            // טיפול בשגיאות נוספות
            if (response.status >= 500) {
                throw new Error('שגיאה פנימית בשרת. בדוק את לוגי השרת.');
            }

            if (!response.ok) {
                const errorMessage = responseData?.message || responseData?.error || `HTTP Error: ${response.status}`;
                console.error('❌ Server error:', errorMessage);
                throw new Error(errorMessage);
            }

            console.log('✅ GROW payment created successfully:', responseData);
            return responseData;

        } catch (error) {
            console.error('❌ Error creating GROW payment:', error);
            return rejectWithValue({
                message: error.message,
                status: error.status || 'unknown'
            });
        }
    }
);
