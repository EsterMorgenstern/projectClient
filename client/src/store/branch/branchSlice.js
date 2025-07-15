import { createSlice } from '@reduxjs/toolkit';
import { fetchBranches } from './branchGetAllThunk';
import { addBranch } from './branchAddThunk';
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
        state.branches = state.branches.filter((branch) => branch.branchId !== action.payload.branchId);
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
      });
  },
});

export default branchSlice.reducer;
