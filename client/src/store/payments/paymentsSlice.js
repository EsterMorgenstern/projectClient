// import { createSlice } from '@reduxjs/toolkit';
// import { fetchPaymentMethods } from './fetchPaymentMethods';
// import { addPaymentMethod } from './addPaymentMethod';
// import { updatePayment } from './paymentsUpdate';
// import { deletePaymentMethod } from './paymentsDelete';
// import { updatePaymentMethod } from './paymentMethodsUpdate';

// const initialState = {
//     payments: [],
//     paymentMethods: [],
//     loading: false,
//     error: null,
//     selectedPayment: null,
//     selectedPaymentMethod: null
// };

// const paymentsSlice = createSlice({
//     name: 'payments',
//     initialState,
//     reducers: {
//         clearError: (state) => {
//             state.error = null;
//         },
//         setSelectedPayment: (state, action) => {
//             state.selectedPayment = action.payload;
//         },
//         setSelectedPaymentMethod: (state, action) => {
//             state.selectedPaymentMethod = action.payload;
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             // Fetch Payments
//             // .addCase(fetchPaymentsByStudentId.pending, (state) => {
//             //     state.loading = true;
//             //     state.error = null;
//             // })
//             // .addCase(fetchPaymentsByStudentId.fulfilled, (state, action) => {
//             //     state.loading = false;
//             //     state.payments = action.payload;
//             // })
//             // .addCase(fetchPaymentsByStudentId.rejected, (state, action) => {
//             //     state.loading = false;
//             //     state.error = action.payload;
//             // })

//             // Fetch Payment Methods
//             .addCase(fetchPaymentMethods.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.paymentMethods = action.payload;
//             })
//             .addCase(fetchPaymentMethods.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })

//             // Add Payment
//             .addCase(addPaymentMethod.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(addPaymentMethod.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.payments.push(action.payload);
//             })
//             .addCase(addPaymentMethod.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })

//             // Update Payment
//             .addCase(updatePayment.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(updatePayment.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const index = state.payments.findIndex(p => p.paymentId === action.payload.paymentId);
//                 if (index !== -1) {
//                     state.payments[index] = action.payload;
//                 }
//             })
//             .addCase(updatePayment.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })

    

//             // Update Payment Method
//             .addCase(updatePaymentMethod.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(updatePaymentMethod.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const index = state.paymentMethods.findIndex(pm => pm.paymentMethodId === action.payload.paymentMethodId);
//                 if (index !== -1) {
//                     state.paymentMethods[index] = action.payload;
//                 }
//             })
//             .addCase(updatePaymentMethod.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })

//             // Delete Payment Method
//             .addCase(deletePaymentMethod.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(deletePaymentMethod.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.paymentMethods = state.paymentMethods.filter(pm => pm.paymentMethodId !== action.payload);
//             })
//             .addCase(deletePaymentMethod.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             });
//     }
// });

// export const { clearError, setSelectedPayment, setSelectedPaymentMethod } = paymentsSlice.actions;
// export default paymentsSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
import { fetchPaymentMethods } from './fetchPaymentMethods';
import { addPaymentMethod } from './addPaymentMethod';
import { updatePaymentMethod } from './paymentMethodsUpdate';
import { deletePaymentMethod } from './paymentMethodsDelete';
import { fetchPaymentHistory } from './fetchPaymentHistory';
import { addPayment } from './paymentsAdd';
import { updatePayment } from './paymentsUpdate';
import { deletePayment } from './paymentsDelete';
import { createGrowPayment } from './createGrowPayment';
import { updatePaymentStatus } from './updatePaymentStatus';


const initialState = {
    paymentMethods: [],
    paymentHistory: [],
    loading: false,
    error: null,
    growPayment: {
        loading: false,
        error: null,
        redirectUrl: null
    },
    lastPaymentStatus: null
};

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearPayments: (state) => {
            state.paymentMethods = [];
            state.paymentHistory = [];
        },
        clearGrowPaymentError: (state) => {
            state.growPayment.error = null;
        }
    },
    extraReducers: (builder) => {
        // Payment Methods
        builder
            .addCase(fetchPaymentMethods.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentMethods = action.payload;
            })
            .addCase(fetchPaymentMethods.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addPaymentMethod.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPaymentMethod.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentMethods.push(action.payload);
            })
            .addCase(addPaymentMethod.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePaymentMethod.fulfilled, (state, action) => {
                const index = state.paymentMethods.findIndex(
                    method => method.paymentMethodId === action.payload.paymentMethodId
                );
                if (index !== -1) {
                    state.paymentMethods[index] = action.payload;
                }
            })
            .addCase(deletePaymentMethod.fulfilled, (state, action) => {
                state.paymentMethods = state.paymentMethods.filter(
                    method => method.paymentMethodId !== action.payload
                );
            })
            // Payment History
            .addCase(fetchPaymentHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentHistory = action.payload;
            })
            .addCase(fetchPaymentHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(addPayment.fulfilled, (state, action) => {
                state.paymentHistory.unshift(action.payload);
            })
           
            .addCase(updatePayment.fulfilled, (state, action) => {
                const index = state.paymentHistory.findIndex(
                    payment => payment.paymentId === action.payload.paymentId
                );
                if (index !== -1) {
                    state.paymentHistory[index] = action.payload;
                }
            })
            .addCase(deletePayment.fulfilled, (state, action) => {
                state.paymentHistory = state.paymentHistory.filter(
                    payment => payment.paymentId !== action.payload
                );
            })
            // GROW Payment
            .addCase(createGrowPayment.pending, (state) => {
                state.growPayment.loading = true;
                state.growPayment.error = null;
            })
            .addCase(createGrowPayment.fulfilled, (state, action) => {
                state.growPayment.loading = false;
                state.growPayment.redirectUrl = action.payload.redirectUrl;
            })
            .addCase(createGrowPayment.rejected, (state, action) => {
                state.growPayment.loading = false;
                state.growPayment.error = action.payload;
            })
            // Update Payment Status
            .addCase(updatePaymentStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePaymentStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.lastPaymentStatus = action.payload;
                
                // עדכון רשימת התשלומים אם קיימת
                if (state.paymentHistory && Array.isArray(state.paymentHistory)) {
                    const index = state.paymentHistory.findIndex(
                        payment => payment.TransactionId === action.payload.TransactionId
                    );
                    if (index !== -1) {
                        state.paymentHistory[index] = { ...state.paymentHistory[index], ...action.payload };
                    }
                }
            })
            .addCase(updatePaymentStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'שגיאה בעדכון סטטוס התשלום';
            });
    }
});

export const { clearError, clearPayments, clearGrowPaymentError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
