import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const addPaymentMethod = createAsyncThunk(
    'payments/addPaymentMethod',
    async (paymentMethodData, { rejectWithValue }) => {
        try {
            console.log('🚀 Adding payment method:', paymentMethodData);
            
            // בניית payload בסיסי
            const payload = {
                studentId: parseInt(paymentMethodData.studentId),
                methodType: paymentMethodData.methodType,
                accountHolderName: paymentMethodData.accountHolderName,
                isDefault: paymentMethodData.isDefault || false
            };

            // הוספת שדות רק אם הם רלוונטיים ולא ריקים
            if (paymentMethodData.methodType === 'CREDIT_CARD') {
                if (paymentMethodData.lastFourDigits) {
                    payload.lastFourDigits = paymentMethodData.lastFourDigits;
                }
                if (paymentMethodData.cardType) {
                    payload.cardType = paymentMethodData.cardType;
                }
                if (paymentMethodData.expiryMonth) {
                    payload.expiryMonth = parseInt(paymentMethodData.expiryMonth);
                }
                if (paymentMethodData.expiryYear) {
                    payload.expiryYear = parseInt(paymentMethodData.expiryYear);
                }
            }

            if (paymentMethodData.methodType === 'BANK_TRANSFER' && paymentMethodData.bankName) {
                payload.bankName = paymentMethodData.bankName;
            }

            console.log('📤 Final payload:', payload);
            
            const response = await axios.post(
                `${API_BASE_URL}/PaymentMethods/Add`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            console.log('✅ Payment method added successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error adding payment method:', error);
            
            // טיפול משופר בשגיאות
            let errorMessage = 'שגיאה בהוספת אמצעי התשלום';
            
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.title) {
                    errorMessage = error.response.data.title;
                } else if (error.response.data.errors) {
                    // טיפול בשגיאות ולידציה
                    const validationErrors = Object.values(error.response.data.errors).flat();
                    errorMessage = validationErrors.join(', ');
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            return rejectWithValue(errorMessage);
        }
    }
);
