import { createSlice } from '@reduxjs/toolkit';
import { saveAttendance } from './saveAttendance';
import { fetchAttendanceByDate } from './fetchAttendanceByDate';
import { fetchAttendanceRange } from './fetchAttendanceRange';
import { fetchAttendanceHistory } from './fetchAttendanceHistory';
import { fetchStudentAttendanceSummary } from './fetchStudentAttendanceSummary';
import { fetchAttendanceReportsMonthly } from './fetchAttendenceReportsMonthly';
import { fetchAttendanceReportsOverall } from './fetchAttendanceReportsOverall';
import { clearGroupsByDay } from '../group/groupSlice';

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
        attendanceReportsOverall: null
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
            });
    }
});

export const { clearAttendanceError, updateLocalAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
