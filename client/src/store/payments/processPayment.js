import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const processPayment = createAsyncThunk(
    'payments/processPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            console.log('🚀 Processing payment:', paymentData);
            
            const payload = {
                studentId: parseInt(paymentData.studentId),
                amount: parseFloat(paymentData.amount),
                paymentMethodId: parseInt(paymentData.paymentMethodId),
                courseId: paymentData.courseId ? parseInt(paymentData.courseId) : null,
                notes: paymentData.notes?.trim() || '',
                paymentDate: new Date().toISOString().split('T')[0],
                status: 'COMPLETED' // או 'PENDING' בהתאם לאמצעי התשלום
            };
            
            const response = await axios.post(
                `${API_BASE_URL}/Payments/Add`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            console.log('✅ Payment processed successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error processing payment:', error);
            return rejectWithValue(error.response?.data || 'שגיאה בעיבוד התשלום');
        }
    }
);
