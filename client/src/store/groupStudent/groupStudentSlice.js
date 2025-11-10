import { createSlice } from '@reduxjs/toolkit';
import { getgroupStudentByStudentId } from './groupStudentGetByStudentIdThunk';
import { getGroupStudentByStudentName } from './groupStudentGetByStudentNameThunk';
import { groupStudentAddThunk } from './groupStudentAddThunk';
import { deleteGroupStudent } from './groupStudentDeleteThunk';
import { updateGroupStudent } from './groupStudentUpdateThunk';

const groupStudentSlice = createSlice({
  name: 'groupStudent',
  initialState: {
    groupStudent: [],
    loading: false,
    error: null,
    groupStudentById: [],
    groupStudentByName: [],
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
      // עדכון סטטוס ותאריך התחלה
      .addCase(updateGroupStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroupStudent.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        // עדכון במערך groupStudentById
        state.groupStudentById = state.groupStudentById.map(gs =>
          gs.groupStudentId === updated.groupStudentId ? { ...gs, ...updated } : gs
        );
        // עדכון במערך groupStudent
        state.groupStudent = state.groupStudent.map(gs =>
          gs.groupStudentId === updated.groupStudentId ? { ...gs, ...updated } : gs
        );
      })
      .addCase(updateGroupStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update group student';
      })
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

      // getGroupStudentByStudentName
      .addCase(getGroupStudentByStudentName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroupStudentByStudentName.fulfilled, (state, action) => {
        state.loading = false;
        state.groupStudentByName = action.payload;
      })
      .addCase(getGroupStudentByStudentName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch student by name';
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
