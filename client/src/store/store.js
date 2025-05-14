
import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './student/studentSlice';
import instructorsReducer from './instructor/instructorSlice';
import coursesReducer from './course/courseSlice';
import groupStudentReduser from './groupStudent/groupStudentSlice';
import branchReducer from './branch/branchSlice';
import groupReduser from './group/groupSlice';

const store = configureStore({
  reducer: {
    students: studentsReducer,
    instructors: instructorsReducer,
    courses: coursesReducer,
    groupStudents:groupStudentReduser,
    branches: branchReducer,
    groups:groupReduser
  },
});

export default store;
