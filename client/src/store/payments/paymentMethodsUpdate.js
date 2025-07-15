import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const updatePaymentMethod = createAsyncThunk(
    'payments/updatePaymentMethod',
    async (paymentMethodData, { rejectWithValue }) => {
        try {
            console.log('🔄 Updating payment method:', paymentMethodData);
            
            // וודא שה-endpoint נכון - בדוק עם השרת שלך
            const response = await axios.put(
                `${API_BASE_URL}/PaymentMethods/Update`, // או PUT במקום Update
                paymentMethodData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            console.log('✅ Payment method updated successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating payment method:', error);
            console.error('❌ Response:', error.response?.data);
            console.error('❌ Status:', error.response?.status);
            
            return rejectWithValue(
                error.response?.data?.message || 
                error.response?.data || 
                'Failed to update payment method'
            );
        }
    }
);
