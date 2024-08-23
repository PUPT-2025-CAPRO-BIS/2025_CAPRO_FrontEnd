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
export const applyNewResidentApi = createAsyncThunk('user/applyNewResident', async (data) => {
  let params = data
  console.log(params, "-->")
  const res = await apiClient.post('/applyNewResident', {
    ...params.resident, ...{
      birthday: moment(params.birthday).format("YYYY-MM-DD"),
      file_upload: params.file_upload
    }
  }, {
    headers: {
      // 'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});

export const addResidentApi = createAsyncThunk('user/noVerificationRegistration', async (data) => {
  let params = data

  const res = await apiClient.post('/noVerificationRegistration', {
    ...params.resident, ...{
      birthday: moment(params.birthday).format("YYYY-MM-DD")
    }
  }, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});

export const editResidentApi = createAsyncThunk('user/changeResidentInformation', async (data) => {
  let params = data

  const res = await apiClient.post('/changeResidentInformation', {
    ...params.resident, ...{
      birthday: moment(params.birthday).format("YYYY-MM-DD")
    }
  }, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});

// deleteResidentInformation

export const deleteResidentInformationApi = createAsyncThunk('user/deleteResidentInformation', async (data) => {
  

  const res = await apiClient.post('/deleteResidentInformation', {
      user_id: data.id
  }, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});



export const loadAllUsers = createAsyncThunk('user/viewAllUsers', async (data) => {

  const res = await apiClient.get('/viewAllUsers', {
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


export const viewNewResidentRequestsApi = createAsyncThunk('user/viewNewResidentRequests', async (data) => {

  const res = await apiClient.get('/viewNewResidentRequests', {
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



export const approveNewResidentApi = createAsyncThunk('user/approveNewResident', async (data) => {


  const res = await apiClient.post('/approveNewResident', {
      user_id: data.id
  }, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});


export const generateOTPapi = createAsyncThunk('user/generateOTP', async (data) => {


  const res = await apiClient.post('/generateOTP', {
    email: data.email,
    birthday: data.birthday

  }, {
    headers: {
      // 'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});

export const otpLoginApi = createAsyncThunk('user/otpLogin', async (data) => {


  const res = await apiClient.post('/otpLogin', {
    email: data.email,
    otp: data.otp

  }, {
    headers: {
      // 'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});

export const createAppointmentApi = createAsyncThunk('user/createAppointment', async (data) => {

  

  const res = await apiClient.post('/createAppointment', {
    document_type_id: data.id,
    schedule_date: data.selectedDate,
    file_upload : data.file_upload

  }, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
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

        state.status = 'succeeded';
      })
      .addCase(addResidentApi.rejected, (state) => {

        state.status = 'failed';
      });

    builder
      .addCase(editResidentApi.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editResidentApi.fulfilled, (state, action) => {

        state.status = 'succeeded';
      })
      .addCase(editResidentApi.rejected, (state) => {

        state.status = 'failed';
      });
  },
});

// Export actions and reducer
export const { LoaddAllUsers } = usersSlice.actions;
export default usersSlice.reducer;