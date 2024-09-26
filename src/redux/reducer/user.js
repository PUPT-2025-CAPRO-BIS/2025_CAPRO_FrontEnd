import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  user: null,
  signedIn: false,
  status: 'idle',  // Start with 'idle' instead of 'false'
  token: '',
  list:''
};

// Create axios instance
export const apiClient = axios.create({
  baseURL: 'https://000040122.xyz/api',
  // baseURL: 'https://bis-nine.vercel.app/api/api'
});

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
export const loginUser = createAsyncThunk('user/loginUser', async (params) => {
  console.log('before:', params)
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

export const viewAdminLogsApi = createAsyncThunk('user/viewAdminLogs', async (data) => {
  
  
  const res = await apiClient.get('/viewAdminLogs', {
    headers:{
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }, params:{
      search_value: data.searchItemList,
      page_number: data.currentPage,
      item_per_page: 10,
    }
  });
  return res.data;
});


export const generateOTPForgotapi = createAsyncThunk('user/generateOTPForgotapi', async (data) => {


  const res = await apiClient.post('/generateOTP', {
    email: data.email,
    change_password: data.change_pass

  }, {
    headers: {
      // 'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});


export const otpChangePasswordForgotApi = createAsyncThunk('user/otpChangePasswordForgotApi', async (data) => {


  const res = await apiClient.post('/otpChangePassword', {
    email: data.email,
    new_pass:data.newPass,
    otp: data.otp

  }, {
    headers: {
      // 'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
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
        state.user = action.payload
        state.signedIn = true;  // Update signedIn status
      })
      .addCase(loginUser.rejected, (state) => {
        
        state.status = 'failed';
        state.signedIn = false;  // Update signedIn status
      });   

      builder
      .addCase(viewAdminLogsApi.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(viewAdminLogsApi.fulfilled, (state, action) => {
        
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(viewAdminLogsApi.rejected, (state) => {
        
        state.status = 'failed';
      });   
  },

});

// Export actions and reducer
export const { SignOn, LogOut } = userSlice.actions;
export default userSlice.reducer;
