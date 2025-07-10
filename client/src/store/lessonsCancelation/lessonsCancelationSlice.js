import { createSlice } from '@reduxjs/toolkit';
import { fetchLessonCancellations } from './lessonsCancelationGetAll';
import { fetchLessonCancellationById } from './lessonsCancelationById';
import { addLessonCancellation } from './lessonsCancelationAdd';
import { updateLessonCancellation } from './lessonsCancelationUpdate';
import { deleteLessonCancellation } from './lessonsCancelationDelete';
import { cancelAllGroupsForDay } from './cancelAllGroupsForDay';
import { getCancellationsByDate } from './getCancellationsByDate';
import { getCancellationDetailsByDate } from './getCancellationDetailsByDate';
import { removeAllCancellationsForDay } from './removeAllCancellationsForDay';
import { checkCancellationsForDay } from './checkCancellationsForDay';

const lessonCancellationSlice = createSlice({
  name: 'lessonCancellations',
  initialState: {
    cancellations: [],
    loading: false,
    error: null,
    cancellationById: null,
    // הוספת state חדש לפונקציות החדשות
    cancellationsByDate: {},
    cancellationDetailsByDate: {},
    daysCancellationStatus: {}, // לשמירת סטטוס ביטולים לפי יום
    bulkOperationLoading: false, // loading נפרד לפעולות מרובות
    lastBulkOperation: null
  },
  reducers: {
    clearCancellationError: (state) => {
      state.error = null;
    },
    updateCancellationLocally: (state, action) => {
      const index = state.cancellations.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.cancellations[index] = { ...state.cancellations[index], ...action.payload };
      }
    },
    // הוספת reducers חדשים
    clearBulkOperationStatus: (state) => {
      state.lastBulkOperation = null;
      state.bulkOperationLoading = false;
    },
    setCancellationStatusForDay: (state, action) => {
      const { date, dayOfWeek, hasCancellations, count } = action.payload;
      const key = `${dayOfWeek}-${date}`;
      state.daysCancellationStatus[key] = {
        hasCancellations,
        count,
        lastChecked: new Date().toISOString()
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(fetchLessonCancellations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonCancellations.fulfilled, (state, action) => {
        state.loading = false;
        state.cancellations = action.payload;
      })
      .addCase(fetchLessonCancellations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get By Id
      .addCase(fetchLessonCancellationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonCancellationById.fulfilled, (state, action) => {
        state.loading = false;
        state.cancellationById = action.payload;
      })
      .addCase(fetchLessonCancellationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addLessonCancellation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLessonCancellation.fulfilled, (state, action) => {
        state.loading = false;
        state.cancellations.push(action.payload);
      })
      .addCase(addLessonCancellation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateLessonCancellation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLessonCancellation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cancellations.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.cancellations[index] = action.payload;
        }
      })
      .addCase(updateLessonCancellation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteLessonCancellation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLessonCancellation.fulfilled, (state, action) => {
        state.loading = false;
        state.cancellations = state.cancellations.filter(c => c.id !== action.payload);
      })
      .addCase(deleteLessonCancellation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // **פונקציות חדשות:**

      // Cancel All Groups For Day
      .addCase(cancelAllGroupsForDay.pending, (state) => {
        state.bulkOperationLoading = true;
        state.error = null;
      })
      .addCase(cancelAllGroupsForDay.fulfilled, (state, action) => {
        state.bulkOperationLoading = false;
        state.lastBulkOperation = {
          type: 'cancelAll',
          dayOfWeek: action.payload.dayOfWeek,
          date: action.payload.date,
          success: true,
          message: action.payload.message
        };
        // עדכון סטטוס היום
        const key = `${action.payload.dayOfWeek}-${action.payload.date}`;
        state.daysCancellationStatus[key] = {
          hasCancellations: true,
          count: 0, // נעדכן בבדיקה הבאה
          lastChecked: new Date().toISOString()
        };
      })
      .addCase(cancelAllGroupsForDay.rejected, (state, action) => {
        state.bulkOperationLoading = false;
        state.error = action.payload;
        state.lastBulkOperation = {
          type: 'cancelAll',
          success: false,
          error: action.payload
        };
      })

      // Get Cancellations By Date
      .addCase(getCancellationsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCancellationsByDate.fulfilled, (state, action) => {
        state.loading = false;
        const { date, cancellations } = action.payload;
        state.cancellationsByDate[date] = cancellations;
      })
      .addCase(getCancellationsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Cancellation Details By Date
      .addCase(getCancellationDetailsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCancellationDetailsByDate.fulfilled, (state, action) => {
        state.loading = false;
        const { date, cancellationDetails } = action.payload;
        state.cancellationDetailsByDate[date] = cancellationDetails;
      })
      .addCase(getCancellationDetailsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove All Cancellations For Day
      .addCase(removeAllCancellationsForDay.pending, (state) => {
        state.bulkOperationLoading = true;
        state.error = null;
      })
      .addCase(removeAllCancellationsForDay.fulfilled, (state, action) => {
        state.bulkOperationLoading = false;
        state.lastBulkOperation = {
          type: 'removeAll',
          dayOfWeek: action.payload.dayOfWeek,
          date: action.payload.date,
          success: true,
          message: action.payload.message
        };
        // עדכון סטטוס היום
        const key = `${action.payload.dayOfWeek}-${action.payload.date}`;
        state.daysCancellationStatus[key] = {
          hasCancellations: false,
          count: 0,
          lastChecked: new Date().toISOString()
        };
        // הסרת הביטולים מהמטמון
        delete state.cancellationsByDate[action.payload.date];
        delete state.cancellationDetailsByDate[action.payload.date];
      })
      .addCase(removeAllCancellationsForDay.rejected, (state, action) => {
        state.bulkOperationLoading = false;
        state.error = action.payload;
        state.lastBulkOperation = {
          type: 'removeAll',
          success: false,
          error: action.payload
        };
      })

      // Check Cancellations For Day
      .addCase(checkCancellationsForDay.pending, (state) => {
        // לא נציג loading לבדיקה זו כי היא רצה ברקע
        state.error = null;
      })
      .addCase(checkCancellationsForDay.fulfilled, (state, action) => {
        const { dayOfWeek, date, hasCancellations, cancellationsCount } = action.payload;
        const key = `${dayOfWeek}-${date}`;
        state.daysCancellationStatus[key] = {
          hasCancellations,
          count: cancellationsCount,
          lastChecked: new Date().toISOString()
        };
      })
      .addCase(checkCancellationsForDay.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { 
  clearCancellationError, 
  updateCancellationLocally,
  clearBulkOperationStatus,
  setCancellationStatusForDay
} = lessonCancellationSlice.actions;

export default lessonCancellationSlice.reducer;
