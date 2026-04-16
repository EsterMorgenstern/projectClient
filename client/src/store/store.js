
import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './student/studentSlice';
import instructorsReducer from './instructor/instructorSlice';
import coursesReducer from './course/courseSlice';
import groupStudentReduser from './groupStudent/groupStudentSlice';
import branchReducer from './branch/branchSlice';
import groupReduser from './group/groupSlice';
import attendanceReduser from './attendance/attendanceSlice';
import studentNotesReduser from './studentNotes/studentNoteSlice';
import usersReducer from './user/userSlice';
import lessonsReducer from './lessons/lessonsSlice';
import paymentsReducer from './payments/paymentsSlice';

import healthFundReducer from './healthFund/healthFundSlice';
import studentHealthFundReducer from './studentHealthFund/studentHealthFundSlice';
import healthFundCommitmentReducer from './healthFundCommitment/healthFundCommitmentSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
    students: studentsReducer,
    instructors: instructorsReducer,
    courses: coursesReducer,
    groupStudents:groupStudentReduser,
    branches: branchReducer,
    groups:groupReduser,
    attendances:attendanceReduser,
    studentNotes:studentNotesReduser,
    lessons: lessonsReducer,
    payments: paymentsReducer,

    healthFunds: healthFundReducer,
    studentHealthFunds: studentHealthFundReducer,
    healthFundCommitments: healthFundCommitmentReducer,


  },
});

export default store;
