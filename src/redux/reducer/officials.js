import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from './user';

// Initial state
const initialState = {
  list: [],
  status: 'idle',  // Start with 'idle' instead of 'false'
  token: '',
  dashboardData:  {
    "count_of_residents": 0,
    "males": "0",
    "females": "0",
    "count_of_seniors": "0",
    "schedules": 0,
    "unresolved": 0,
    "ongoing": 0,
    "settled": 0,
    "dismissed": 0
}
};

// Create axios instance
// const apiClient = axios.create({
//   baseURL: 'http://3.0.89.216/api',
// });

// Add a response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {

      // Handle unauthorized access, e.g., redirect to login
    }
    return Promise.reject(error);
  }
);

// Define async thunks
export const loadOfficials = createAsyncThunk('user/getofficial', async (data) => {
  console.log(data, "--> DAMN")
  const res = await apiClient.get('/viewBarangayOfficials', {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }, params: {
      search_value: data.searchItemList,
      page_number: data.currentPage,
      item_per_page: 10
    }
  });
  return res.data;
});

export const addOfficials = createAsyncThunk('user/addofficial', async (data) => {

  const res = await apiClient.post('/assignBarangayOfficial', {
    chairmanship: data.selectedSearchItem.chairmanship,
    user_id: data.selectedSearchItem.id,
    position: data.selectedSearchItem.position,
    // status: data.selectedSearchItem.status
  }, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});


export const updateOfficials = createAsyncThunk('user/updateofficial', async (data) => {

  const res = await apiClient.post('/changeBarangayOfficialDetails', {
    chairmanship: data.selectedItem.chairmanship,
    user_id: data.selectedItem.user_id,
    position: data.selectedItem.position,
    status: data.selectedItem.status
  }, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});

export const deleteOffialsApi = createAsyncThunk('user/deleteofficial', async (data) => {

  
  const res = await apiClient.post('/deleteBarangayOfficial', {
    user_id: data.selectedItem.user_id
  }, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});


export const dashboardViewApi = createAsyncThunk('user/dashboardView', async (token) => {

  const res = await apiClient.get('/dashboardView',  {
    headers: {
      'Authorization': `Bearer ${token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});

// Create slice
const officialsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    LoadOfficials: (state, action) => {
      state.user = action.payload;
      state.signedIn = true;  // Use a boolean value here
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadOfficials.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadOfficials.fulfilled, (state, action) => {

        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(loadOfficials.rejected, (state) => {

        state.status = 'failed';
      });

    builder
      .addCase(addOfficials.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addOfficials.fulfilled, (state, action) => {


        state.status = 'succeeded';
        // state.list = action.payload;
      })
      .addCase(addOfficials.rejected, (state) => {

        state.status = 'failed';
      });

    builder
      .addCase(deleteOffialsApi.pending, (state) => {

        state.status = 'loading';
      })
      .addCase(deleteOffialsApi.fulfilled, (state, action) => {


        state.status = 'succeeded';
        // state.list = action.payload;
      })
      .addCase(deleteOffialsApi.rejected, (state) => {

        state.status = 'failed';
      });

    builder
      .addCase(updateOfficials.pending, (state) => {

        state.status = 'loading';
      })
      .addCase(updateOfficials.fulfilled, (state, action) => {


        state.status = 'succeeded';
        // state.list = action.payload;
      })
      .addCase(updateOfficials.rejected, (state) => {

        state.status = 'failed';
      });

      // dashboardViewApi

      builder
      .addCase(dashboardViewApi.pending, (state) => {

        state.status = 'loading';
      })
      .addCase(dashboardViewApi.fulfilled, (state, action) => {

        
        state.status = 'succeeded';
        state.dashboardData = action.payload[0];
      })
      .addCase(dashboardViewApi.rejected, (state) => {

        state.status = 'failed';
      });
  },
});

// Export actions and reducer
export const { LoadOfficials } = officialsSlice.actions;
export default officialsSlice.reducer;