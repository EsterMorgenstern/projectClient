import { createSlice } from '@reduxjs/toolkit';
import { getUserById } from './userGetByIdThunk';
import { addUser } from './userAddThunk';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    userById: null,
    currentUser: null, 
    loading: false,
    error: null,
    registrationSuccess: false, // ✅ הוסף דגל הצלחה
  },
  
  reducers: {
    setCurrentUser: (state, action) => {
      console.log('🔄 Setting current user:', action.payload);
      state.currentUser = action.payload;
      state.userById = action.payload;
      state.error = null; // ✅ נקה שגיאות
    },
    
    clearCurrentUser: (state) => {
      console.log('🚪 Clearing current user');
      state.currentUser = null;
      state.userById = null;
      state.error = null;
    },
    
    // ✅ הוסף action להרשמה מוצלחת
    setRegistrationSuccess: (state, action) => {
      console.log('🎉 Registration successful:', action.payload);
      state.registrationSuccess = true;
      state.error = null;
      
      // אם יש נתוני משתמש, עדכן אותם
      if (action.payload && action.payload.user) {
        state.currentUser = action.payload.user;
        state.userById = action.payload.user;
        state.users.push(action.payload.user);
      }
    },
    
    // ✅ איפוס דגל ההרשמה
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    }
  },
 
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        console.log('⏳ getUserById pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        console.log('✅ getUserById fulfilled:', action.payload);
        state.loading = false;
        
        if (action.payload && typeof action.payload === 'object') {
          state.userById = action.payload;
          state.currentUser = action.payload;
          state.error = null;
        } else {
          console.warn('⚠️ Invalid user data received:', action.payload);
          state.error = 'נתוני משתמש לא תקינים';
        }
      })
      .addCase(getUserById.rejected, (state, action) => {
        console.error('❌ getUserById rejected:', action.payload);
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user';
        state.userById = null;
        state.currentUser = null;
      })
      
      .addCase(addUser.pending, (state) => {
        console.log('⏳ addUser pending');
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        console.log('✅ addUser fulfilled:', action.payload);
        state.loading = false;
        state.registrationSuccess = true;
        state.error = null;
        
        if (action.payload) {
          state.users.push(action.payload);
          state.currentUser = action.payload;
          state.userById = action.payload;
        }
      })
      .addCase(addUser.rejected, (state, action) => {
        console.error('❌ addUser rejected:', action.payload);
        state.loading = false;
        state.error = action.payload || 'Failed to add user';
        state.registrationSuccess = false;
      });
  },
});

export const { 
  setCurrentUser, 
  clearCurrentUser, 
  setRegistrationSuccess, 
  clearRegistrationSuccess 
} = usersSlice.actions;

export default usersSlice.reducer;
