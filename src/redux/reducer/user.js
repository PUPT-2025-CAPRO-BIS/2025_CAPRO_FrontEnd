import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  user: null,
  signedIn: false,
  status: 'idle',  // Start with 'idle' instead of 'false'
  token: '',
};

// Create axios instance
export const apiClient = axios.create({
  baseURL: 'http://18.141.22.83/api',
});

// Add a response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized - 401');
      // Handle unauthorized access, e.g., redirect to login
    }
    return Promise.reject(error);
  }
);

// Define async thunks
export const loginUser = createAsyncThunk('user/loginUser', async (params) => {
  const res = await apiClient.post('/adminLogin', {
    email: params.email,
    pass: params.pass,
  });
  return res.data;
});

export const validateUser = createAsyncThunk('user/validateUser', async () => {
  const res = await apiClient.get('/getUserDetails', {
    headers: {
      'Authorization': 'Bearer your-token-here', // Replace with your actual token
      'Content-Type': 'application/json',
    },
  });
  return res.data;
});

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SignOn: (state, action) => {
      state.user = action.payload;
      state.signedIn = true;  // Use a boolean value here
    },
    LogOut: (state, action) => {
      state.user = ''
      state.status = 'logout'
      state.token = ''
      state.signedIn = false

    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.access_token;
        state.signedIn = true;  // Update signedIn status
      })
      .addCase(loginUser.rejected, (state) => {
        console.log('pumasok ka sa fail')
        state.status = 'failed';
        state.signedIn = false;  // Update signedIn status
      });
  },
});

// Export actions and reducer
export const { SignOn, LogOut } = userSlice.actions;
export default userSlice.reducer;
