
import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './student/studentSlice';
import instructorsReducer from './instructor/instructorSlice';
import coursesReducer from './course/courseSlice';
import groupStudentReduser from './groupStudent/groupStudentSlice';

const store = configureStore({
  reducer: {
    students: studentsReducer,
    instructors: instructorsReducer,
    courses: coursesReducer,
    groupStudents:groupStudentReduser
  },
});

export default store;
