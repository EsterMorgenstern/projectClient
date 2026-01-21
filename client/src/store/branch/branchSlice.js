import { createSlice } from '@reduxjs/toolkit';
import { fetchBranches } from './branchGetAllThunk';
import { addBranch } from './branchAddThunk';
import { updateBranch } from './branchUpdateThunk';
import { deleteBranch } from './branchDelete';

const branchSlice = createSlice({
  name: 'branches',
  initialState: {
    branches: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
// getAllBranches
      .addCase(fetchBranches.pending, (state) => {
        console.log('Fetching branches...');
        state.loading = true;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        console.error('Error fetching branches:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
// deleteBranch
      .addCase(deleteBranch.pending, (state) => {
        console.log('Deleting branch...');
        state.loading = true;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        const branchIdToDelete = action.payload.branchId || action.payload;
        state.branches = state.branches.filter((branch) => branch.branchId !== branchIdToDelete);
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        console.error('Error deleteBranch:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
      

// addBranch
      .addCase(addBranch.pending, (state) => {
        console.log('Adding branch...');
        state.loading = true;
      })
      .addCase(addBranch.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.branches.push(action.payload); // Add the new branch to the state
      })
      .addCase(addBranch.rejected, (state, action) => {
        console.error('Error adding branch:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
      
// updateBranch
      .addCase(updateBranch.pending, (state) => {
        console.log('Updating branch...');
        state.loading = true;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        const index = state.branches.findIndex((branch) => branch.branchId === action.payload.branchId);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        console.error('Error updating branch:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default branchSlice.reducer;
