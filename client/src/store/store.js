
import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './studentSlice';


const store = configureStore({
  reducer: {
    students: studentsReducer,
    // נוסיף כאן בהמשך את instructors, courses וכו'
  },
});

export default store;
