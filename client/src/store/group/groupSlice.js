import { createSlice } from '@reduxjs/toolkit';
import { getGroupWithStudentsById } from './groupGetGroupWithStudentsByIdThunk';
import { fetchGroups } from './groupGellAllThunk';
import { addGroup } from './groupAddThunk';
import { updateGroup } from './groupUpdateThunk';
import { getGroupsByCourseId } from './groupGetGroupsByCourseIdThunk';
import { getGroupsByDay } from './groupGetByDayThunk';
import { deleteGroup } from './groupDeleteThunk';
import { getGroupsByInstructorId } from './groupByInstructorId';
import { getStudentsByGroupId } from './groupGetStudentsByGroupId';
import { FindBestGroupForStudent, FindBestGroupsForStudent } from './groupFindBestGroupForStudent';
import { getAllGroupsWithStudents } from './groupGetAllGroupsWithStudentsThunk';
import { getGroupsByBranch } from './groupGetGroupsByBranchThunk';
import { getGroupDetails } from './groupGetDetailsThunk';

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
    groupsByDayLoading: false,
    studentsInGroup: [],
    studentsInGroupLoading: false,
    allGroupsWithStudents: [],
    allGroupsWithStudentsLoading: false,
    allGroupsWithStudentsError: null,
    groupWithStudents: null,
    groupWithStudentsLoading: false,
    groupWithStudentsError: null,
    groupsByBranch: [],
    // Track which branch ID the current groupsByBranch belongs to
    groupsByBranchId: null,
    groupsByBranchLoading: false,
    groupsByBranchError: null,
    groupDetails: null,
    groupDetailsLoading: false,
    groupDetailsError: null
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
    },
    clearStudentsInGroup: (state) => {
      state.studentsInGroup = [];
      state.studentsInGroupLoading = false;
    },
    clearGroupsByBranch: (state) => {
      state.groupsByBranch = [];
      state.groupsByBranchLoading = false;
      state.groupsByBranchError = null;
    },
    clearGroupDetails: (state) => {
      state.groupDetails = null;
      state.groupDetailsLoading = false;
      state.groupDetailsError = null;
    }
  },
  extraReducers: (builder) => {
    // getGroupWithStudentsById
    builder
      .addCase(getGroupWithStudentsById.pending, (state) => {
        state.groupWithStudentsLoading = true;
        state.groupWithStudentsError = null;
      })
      .addCase(getGroupWithStudentsById.fulfilled, (state, action) => {
        state.groupWithStudentsLoading = false;
        state.groupWithStudents = action.payload;
      })
      .addCase(getGroupWithStudentsById.rejected, (state, action) => {
        state.groupWithStudentsLoading = false;
        state.groupWithStudentsError = action.payload;
      });
    builder
      // getAllGroups
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // getGroupsByCourseId   
      .addCase(getGroupsByCourseId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroupsByCourseId.fulfilled, (state, action) => {
        state.loading = false;
        state.groupsByCourseId = action.payload;
        // Do NOT merge into state.groups - causes infinite re-renders
        // Component will use groupsByCourseId directly when needed
      })
      .addCase(getGroupsByCourseId.rejected, (state, action) => {
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
      })
      
      // updateGroup
      .addCase(updateGroup.pending, (state) => {
        console.log('Updating group...');
        state.loading = true;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        console.log('Group updated:', action.payload);
        state.loading = false;
        const groupId = action.payload.groupId || action.payload.GroupId || action.payload.id;
        
        // עדכן במערך הקבוצות הכללי
        const generalIndex = state.groups.findIndex((group) => (group.groupId === groupId || group.GroupId === groupId || group.id === groupId));
        if (generalIndex !== -1) {
          state.groups[generalIndex] = action.payload;
        }
        
        // עדכן במערך הקבוצות לפי חוג
        const courseIndex = state.groupsByCourseId.findIndex((group) => (group.groupId === groupId || group.GroupId === groupId || group.id === groupId));
        if (courseIndex !== -1) {
          state.groupsByCourseId[courseIndex] = action.payload;
        }

        // עדכן גם במערך הקבוצות לפי סניף (אם נשמר)
        if (state.groupsByBranch && Array.isArray(state.groupsByBranch)) {
          const branchIndex = state.groupsByBranch.findIndex((group) => (group.groupId === groupId || group.GroupId === groupId || group.id === groupId));
          if (branchIndex !== -1) {
            state.groupsByBranch[branchIndex] = action.payload;
          }
        }
      })
      .addCase(updateGroup.rejected, (state, action) => {
        console.error('Error updating group:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
      
      // getStudentsByGroupId
      .addCase(getStudentsByGroupId.pending, (state) => {
        console.log('Getting students by group ID...');
        state.studentsInGroupLoading = true;
      })
      .addCase(getStudentsByGroupId.fulfilled, (state, action) => {
        console.log('Students in group:', action.payload);
        state.studentsInGroupLoading = false;
        state.studentsInGroup = action.payload;
      })
      .addCase(getStudentsByGroupId.rejected, (state, action) => {
        console.error('Error getting students by group:', action.error.message);
        state.studentsInGroupLoading = false;
        state.error = action.error.message;
      })

      // getAllGroupsWithStudents
      .addCase(getAllGroupsWithStudents.pending, (state) => {
        state.allGroupsWithStudentsLoading = true;
        state.allGroupsWithStudentsError = null;
      })
      .addCase(getAllGroupsWithStudents.fulfilled, (state, action) => {
        state.allGroupsWithStudentsLoading = false;
        state.allGroupsWithStudents = action.payload;
      })
      .addCase(getAllGroupsWithStudents.rejected, (state, action) => {
        state.allGroupsWithStudentsLoading = false;
        state.allGroupsWithStudentsError = action.payload;
      })

      // getGroupsByBranch
      .addCase(getGroupsByBranch.pending, (state, action) => {
        state.groupsByBranchLoading = true;
        state.groupsByBranchError = null;
        // Keep existing data, but note which branch is being requested
        state.groupsByBranchId = action.meta?.arg || null;
      })
      .addCase(getGroupsByBranch.fulfilled, (state, action) => {
        state.groupsByBranchLoading = false;
        state.groupsByBranch = action.payload;
        state.groupsByBranchId = action.meta?.arg || null;
        // Do NOT merge into state.groups - causes infinite re-renders
        // Component will use groupsByBranch directly when needed
      })
      .addCase(getGroupsByBranch.rejected, (state, action) => {
        state.groupsByBranchLoading = false;
        state.groupsByBranchError = action.payload;
        state.groupsByBranchId = null;
      })

      // getGroupDetails
      .addCase(getGroupDetails.pending, (state) => {
        state.groupDetailsLoading = true;
        state.groupDetailsError = null;
      })
      .addCase(getGroupDetails.fulfilled, (state, action) => {
        state.groupDetailsLoading = false;
        state.groupDetails = action.payload;
      })
      .addCase(getGroupDetails.rejected, (state, action) => {
        state.groupDetailsLoading = false;
        state.groupDetailsError = action.payload;
      });
  },
});

export const { clearGroupsByDay, clearBestGroup, clearBestGroups, clearStudentsInGroup, clearGroupsByBranch, clearGroupDetails } = groupSlice.actions;
export default groupSlice.reducer;
