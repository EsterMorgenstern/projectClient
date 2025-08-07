import { createSlice } from '@reduxjs/toolkit';
import { saveAttendance } from './saveAttendance';
import { fetchAttendanceByDate } from './fetchAttendanceByDate';
import { fetchAttendanceRange } from './fetchAttendanceRange';
import { fetchAttendanceHistory } from './fetchAttendanceHistory';
import { fetchStudentAttendanceSummary } from './fetchStudentAttendanceSummary';
import { fetchAttendanceReportsMonthly } from './fetchAttendenceReportsMonthly';
import { fetchAttendanceReportsOverall } from './fetchAttendanceReportsOverall';
import { clearGroupsByDay } from '../group/groupSlice';
import { isMarkedForDate } from './attendanceGetIsMarkedForGroup';
import { isMarkedForDay } from './attendanceGetIsMarkedForDay';
import { getAttendanceByStudent } from './attensanceGetByStudent';
import { deleteAttendance } from './attendanceDeleteThunk';

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        records: {},
        loading: false,
        error: null,
        lastSaved: null,
        attendanceData: [],
        attendanceSummary: {},
        attendanceReportsMonthly: null,
        attendanceReportsOverall: null,
        isMarked: null,
        // הוספת state חדש לניהול סטטוס נוכחות
        attendanceMarkedStatus: {}, 
        attendanceCheckLoading: false,
        isMarkedForDay: {}, // ניהול סטטוס נוכחות לפי תאריך
    attendanceByStudent: []
    },
    reducers: {
        clearAttendanceError: (state) => {
            state.error = null;
        },
        
        updateLocalAttendance: (state, action) => {
            const { date, studentId, wasPresent } = action.payload;
            if (!state.records[date]) {
                state.records[date] = [];
            }
            const studentIndex = state.records[date].findIndex(r => r.studentId === studentId);
            if (studentIndex >= 0) {
                state.records[date][studentIndex].wasPresent = wasPresent;
            }
        },

        // הוספת reducer לניקוי סטטוס נוכחות
        clearAttendanceMarkedStatus: (state) => {
            state.attendanceMarkedStatus = {};
        },

        // הוספת reducer לעדכון סטטוס נוכחות מקומי
        setAttendanceMarkedStatus: (state, action) => {
            const { key, isMarked } = action.payload;
            state.attendanceMarkedStatus[key] = isMarked;
        }
    },
    extraReducers: (builder) => {
        builder
            // Save attendance
            .addCase(saveAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveAttendance.fulfilled, (state, action) => {
                state.loading = false;
                state.lastSaved = new Date().toISOString();
                
                // עדכן את הסטטוס שנוכחות נשמרה
                const { groupId, date } = action.meta.arg;
                const key = `${groupId}-${date}`;
                state.attendanceMarkedStatus[key] = true;
            })
            .addCase(saveAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch attendance by date
            .addCase(fetchAttendanceByDate.fulfilled, (state, action) => {
                const { date, attendance } = action.payload;
                state.records[date] = attendance;
            })
            
            // Fetch attendance range
            .addCase(fetchAttendanceRange.fulfilled, (state, action) => {
                state.records = { ...state.records, ...action.payload };
            })
            
            // Fetch student attendance summary
            .addCase(fetchStudentAttendanceSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentAttendanceSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.attendanceSummary = action.payload;
            })
            .addCase(fetchStudentAttendanceSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchAttendanceReportsMonthly
            .addCase(fetchAttendanceReportsMonthly.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.attendanceReportsMonthly = null;
            })
            .addCase(fetchAttendanceReportsMonthly.fulfilled, (state, action) => {
                state.loading = false;
                state.attendanceReportsMonthly = action.payload;
                state.error = null;
            })
            .addCase(fetchAttendanceReportsMonthly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.attendanceReportsMonthly = null;
            })

            // fetchAttendanceReportsOverall
            .addCase(fetchAttendanceReportsOverall.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.attendanceReportsOverall = null;
            })
            .addCase(fetchAttendanceReportsOverall.fulfilled, (state, action) => {
                state.loading = false;
                state.attendanceReportsOverall = action.payload;
                state.error = null;
            })
            .addCase(fetchAttendanceReportsOverall.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.attendanceReportsOverall = null;
            })

            // isMarkedForDate - בדיקת נוכחות
            .addCase(isMarkedForDate.pending, (state, action) => {
                state.attendanceCheckLoading = true;
                state.error = null;
            })
            .addCase(isMarkedForDate.fulfilled, (state, action) => {
                state.attendanceCheckLoading = false;
                const { key, isMarked } = action.payload;
                state.attendanceMarkedStatus[key] = isMarked;
                state.error = null;
            })
            .addCase(isMarkedForDate.rejected, (state, action) => {
                state.attendanceCheckLoading = false;
                state.error = action.payload;
                
                // במקרה של שגיאה, נניח שאין נוכחות
                if (action.meta?.arg) {
                    const { groupId, date } = action.meta.arg;
                    const key = `${groupId}-${date}`;
                    state.attendanceMarkedStatus[key] = false;
                }
            })
 // isMarkedForDay - בדיקת נוכחות
            .addCase(isMarkedForDay.pending, (state, action) => {
                state.attendanceCheckLoading = true;
                state.error = null;
            })
            .addCase(isMarkedForDay.fulfilled, (state, action) => {
                state.attendanceCheckLoading = false;
                const { key, isMarked } = action.payload;
                state.isMarkedForDay[key] = isMarked;
                state.error = null;
            })
            .addCase(isMarkedForDay.rejected, (state, action) => {
                state.attendanceCheckLoading = false;
                state.error = action.payload;
                
                // במקרה של שגיאה, נניח שאין נוכחות
                if (action.meta?.arg) {
                    const { date } = action.meta.arg;
                    const key = `${date}`;
                    state.isMarkedForDay[key] = false;
                }
            })
            // Fetch attendance history
            .addCase(fetchAttendanceHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.attendanceData = action.payload;
            })
            .addCase(fetchAttendanceHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             // getAttendanceByStudent
            .addCase(getAttendanceByStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAttendanceByStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.attendanceByStudent = action.payload;
            })
            .addCase(getAttendanceByStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // deleteAttendance
            .addCase(deleteAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAttendance.fulfilled, (state, action) => {
                state.loading = false;
                state.attendanceData = state.attendanceData.filter(item => item.id !== action.payload.id);
            })
            .addCase(deleteAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
           
    }
});

export const { 
    clearAttendanceError, 
    updateLocalAttendance, 
    clearAttendanceMarkedStatus,
    setAttendanceMarkedStatus
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
