import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const processCreditCardPayment = createAsyncThunk(
    'payments/processCreditCardPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            console.log('🔄 Processing credit card payment...', paymentData);
            
            const response = await axios.post(
                `${API_BASE_URL}/ChargeAndRecord/ProcessPayment`,
                {
                    studentId: paymentData.studentId,
                    amount: paymentData.amount,
                    stripeToken: paymentData.stripeToken,
                    paymentMethodId: paymentData.paymentMethodId,
                    groupId: paymentData.groupId,
                    notes: paymentData.notes
                }
            );

            console.log('✅ Payment processed successfully:', response.data);
            return response.data;
            
        } catch (error) {
            console.error('❌ Payment processing failed:', error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || 
                'שגיאה בעיבוד התשלום'
            );
        }
    }
);
