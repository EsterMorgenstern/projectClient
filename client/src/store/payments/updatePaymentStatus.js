import { createAsyncThunk } from '@reduxjs/toolkit';

export const updatePaymentStatus = createAsyncThunk(
    'payments/updatePaymentStatus',
    async ({ transactionId }, { rejectWithValue }) => {
        try {
            console.log(`🔄 Updating payment status for transaction: ${transactionId}`);
            
            const response = await fetch(
                `https://localhost:5249/api/Payments/GetByTransactionId/${transactionId}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const paymentData = await response.json();
            console.log('💳 Payment status updated:', paymentData);
            
            return paymentData;
        } catch (error) {
            console.error('❌ Error updating payment status:', error);
            return rejectWithValue({
                message: error.message,
                status: error.status || 'UNKNOWN'
            });
        }
    }
);
