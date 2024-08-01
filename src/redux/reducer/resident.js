import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from './user';
import moment from 'moment';

// Initial state
const initialState = {
  list: [],
  status: 'idle',  // Start with 'idle' instead of 'false'
  token: '',
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
export const addResidentApi = createAsyncThunk('user/noVerificationRegistration', async (data) => {
    let params = data
    console.log(params, "--> PASOK?")
  const res = await apiClient.post('/noVerificationRegistration', {
        ...params.resident, ...{
        birthday: moment(params.birthday).format("YYYY-MM-DD")
        }
  },{
    headers:{
        'Authorization': `Bearer ${data.token}`, // Replace with your actual token
        'Content-Type': 'application/json',
    }
  });
  return res.data;
});


export const loadAllUsers = createAsyncThunk('user/viewAllUsers', async (bearer) => {
    
    const res = await apiClient.get('/viewAllUsers', {
      headers:{
          'Authorization': `Bearer ${bearer}`, // Replace with your actual token
          'Content-Type': 'application/json',
      }
    });
    return res.data;
  });


// Create slice
const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    LoaddAllUsers: (state, action) => {
      state.user = action.payload;
      state.signedIn = true;  // Use a boolean value here
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAllUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadAllUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(loadAllUsers.rejected, (state) => {
        
        state.status = 'failed';
      });

      builder
      .addCase(addResidentApi.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addResidentApi.fulfilled, (state, action) => {
        console.log(action, "--> RECEIVE REDUCER")
        state.status = 'succeeded';
      })
      .addCase(addResidentApi.rejected, (state) => {
        
        state.status = 'failed';
      });
  },
});

// Export actions and reducer
export const { LoaddAllUsers } = usersSlice.actions;
export default usersSlice.reducer;
