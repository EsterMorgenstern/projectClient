import { createSlice } from '@reduxjs/toolkit';
import { fetchGroups } from './groupGellAllThunk';
import { addGroup } from './groupAddThunk';
import { getGroupsByCourseId } from './groupGetGroupsByCourseIdThunk';
import { getGroupsByDay } from './groupGetByDayThunk';
import { deleteGroup } from './groupDeleteThunk';
import { getGroupsByInstructorId } from './groupByInstructorId';
import { FindBestGroupForStudent, FindBestGroupsForStudent } from './groupFindBestGroupForStudent';

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
    loading: false,
    error: null,
    groupsByCourseId: [],
    groupsByDay: [],
    bestGroupForStudent: [],
    instructorGroups : [],
    groupsByDayLoading: false
  },
  reducers: {
    clearGroupsByDay: (state) => {
      state.groupsByDay = [];
      state.groupsByDayLoading = false;
    },
     clearBestGroup: (state) => {
      state.bestGroupForStudent = null;
    },
    clearBestGroups: (state) => {
      state.bestGroupsForStudent = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // getAllGroups
      .addCase(fetchGroups.pending, (state) => {
        console.log('Fetching groups...');
        state.loading = true;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        console.error('Error fetching groups:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })

      // getGroupsByCourseId   
      .addCase(getGroupsByCourseId.pending, (state) => {
        console.log('getGroupsByCourseId...')
        state.loading = true;
      })
      .addCase(getGroupsByCourseId.fulfilled, (state, action) => {
        console.log("groupsByCourseId", action.payload);
        state.loading = false;
        state.groupsByCourseId = action.payload;
      })
      .addCase(getGroupsByCourseId.rejected, (state, action) => {
        console.error('Error getting groups by course:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
 // getGroupsByInstructorId   
      .addCase(getGroupsByInstructorId.pending, (state) => {
        console.log('getGroupsByInstructorId...')
        state.loading = true;
      })
      .addCase(getGroupsByInstructorId.fulfilled, (state, action) => {
        console.log("groupsByInstructorId", action.payload);
        state.loading = false;
        state.instructorGroups = action.payload;
      })
      .addCase(getGroupsByInstructorId.rejected, (state, action) => {
        console.error('Error getting groups by instructor:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
        // FindBestGroupsForStudent (מספר קבוצות)
      .addCase(FindBestGroupsForStudent.pending, (state) => {
        console.log('🔄 Redux: מתחיל חיפוש קבוצות...');
        state.loading = true;
        state.error = null;
      })
      .addCase(FindBestGroupsForStudent.fulfilled, (state, action) => {
        console.log('✅ Redux: קיבל קבוצות מהשרת:', action.payload);
        state.loading = false;
        state.error = null;
        
        // וידוא שהנתונים הם מערך
        const groups = Array.isArray(action.payload) ? action.payload : [];
        state.bestGroupsForStudent = groups;
        
        console.log('💾 Redux: שמר', groups.length, 'קבוצות מומלצות');
      })
      .addCase(FindBestGroupsForStudent.rejected, (state, action) => {
        console.error('❌ Redux: שגיאה בחיפוש קבוצות:', action.payload);
        state.loading = false;
        state.error = action.payload || 'שגיאה בחיפוש קבוצות מתאימות';
        state.bestGroupsForStudent = [];
      })
      
      // FindBestGroupForStudent (קבוצה אחת - תאימות לאחור)
      .addCase(FindBestGroupForStudent.pending, (state) => {
        console.log('🔄 Redux: מתחיל חיפוש קבוצה...');
        state.loading = true;
        state.error = null;
      })
      .addCase(FindBestGroupForStudent.fulfilled, (state, action) => {
        console.log('✅ Redux: קיבל קבוצה מהשרת:', action.payload);
        state.loading = false;
        state.error = null;
        state.bestGroupForStudent = action.payload;
      })
      .addCase(FindBestGroupForStudent.rejected, (state, action) => {
        console.error('❌ Redux: שגיאה בחיפוש קבוצה:', action.payload);
        state.loading = false;
        state.error = action.payload || 'שגיאה בחיפוש קבוצה מתאימה';
        state.bestGroupForStudent = null;
      })
      // getGroupsByDay   
      .addCase(getGroupsByDay.pending, (state) => {
        console.log('getGroupsByDay...')
        state.groupsByDayLoading = true;
      })
      .addCase(getGroupsByDay.fulfilled, (state, action) => {
        console.log("getGroupsByDay", action.payload);
        state.groupsByDayLoading = false;
        state.groupsByDay = action.payload;
      })
      .addCase(getGroupsByDay.rejected, (state, action) => {
        console.error('Error getting groups by day:', action.error.message);
        state.groupsByDayLoading = false;
        state.error = action.error.message;
      })
      // deleteGroup   
      .addCase(deleteGroup.pending, (state) => {
        console.log('deleteGroup...')
        state.loading = true;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        console.log("deleteGroup", action.payload);
        state.loading = false;
        const groupIdToDelete = action.payload.groupId || action.payload;

      
        state.groups = state.groups.filter((group) => group.groupId !== groupIdToDelete);
        state.groupsByCourseId = state.groupsByCourseId.filter((group) => group.groupId !== groupIdToDelete);
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        console.error('Error deleteGroup:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })

      // addGroup
      .addCase(addGroup.pending, (state) => {
        console.log('Adding group...');
        state.loading = true;
      })
      .addCase(addGroup.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.groups.push(action.payload);
      })
      .addCase(addGroup.rejected, (state, action) => {
        console.error('Error adding group:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearGroupsByDay } = groupSlice.actions;
export default groupSlice.reducer;
