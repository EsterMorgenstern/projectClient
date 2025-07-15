import { createSlice } from '@reduxjs/toolkit';
import { getgroupStudentByStudentId } from './groupStudentGetByStudentIdThunk';
import { groupStudentAddThunk } from './groupStudentAddThunk';
import { deleteGroupStudent } from './groupStudentDeleteThunk';

const groupStudentSlice = createSlice({
  name: 'groupStudent',
  initialState: {
    groupStudent: [],
    loading: false,
    error: null,
    groupStudentById: [],
  },
  reducers: {
    // הוספת reducer לעדכון מקומי
    removeGroupStudentFromState: (state, action) => {
      const gsId = action.payload;
      state.groupStudent = state.groupStudent.filter(
        groupStudent => groupStudent.groupStudentId !== gsId
      );
      state.groupStudentById = state.groupStudentById.filter(
        groupStudent => groupStudent.groupStudentId !== gsId
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getgroupStudentByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getgroupStudentByStudentId.fulfilled, (state, action) => {
        state.loading = false;
        state.groupStudentById = action.payload;
      })  
      .addCase(getgroupStudentByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch student courses';
      }) 

      // deleteGroupStudent
      .addCase(deleteGroupStudent.pending, (state) => {    
        console.log('🗑️ deleteGroupStudent pending...');
        state.loading = true;
        state.error = null;
      }) 
      .addCase(deleteGroupStudent.fulfilled, (state, action) => {
        state.loading = false;
        const gsId = action.payload.gsId;
        
        // עדכון שני המערכים
        state.groupStudent = state.groupStudent.filter(
          groupStudent => groupStudent.groupStudentId !== gsId
        );
        state.groupStudentById = state.groupStudentById.filter(
          groupStudent => groupStudent.groupStudentId !== gsId
        );
        
        console.log('✅ Group student deleted from state:', gsId);
      })  
      .addCase(deleteGroupStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete group student';
        console.error('❌ Delete group student failed:', action.payload);
      }) 
      
      // groupStudentAddThunk
      .addCase(groupStudentAddThunk.pending, (state) => {    
        console.log('➕ groupStudentAddThunk pending...');
        state.loading = true;
        state.error = null;
      }) 
      .addCase(groupStudentAddThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.groupStudent.push(action.payload);
        state.groupStudentById.push(action.payload);
        console.log('✅ Group student added:', action.payload);
      })  
      .addCase(groupStudentAddThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add group student';
        console.error('❌ Add group student failed:', action.payload);
      });   
  }
}); 

export const { removeGroupStudentFromState } = groupStudentSlice.actions;
export default groupStudentSlice.reducer;
