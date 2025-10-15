
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
import lessonCancellationsReducer from './lessonsCancelation/lessonsCancelationSlice';
import paymentsReducer from './payments/paymentsSlice';

import healthFundReducer from './healthFund/healthFundSlice';
import studentHealthFundReducer from './studentHealthFund/studentHealthFundSlice';

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
    lessonCancellations: lessonCancellationsReducer,
    payments: paymentsReducer,

    healthFunds: healthFundReducer,
    studentHealthFunds: studentHealthFundReducer,


  },
});

export default store;
