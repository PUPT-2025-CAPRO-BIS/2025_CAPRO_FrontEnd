import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from './user';
import moment from 'moment';

// Initial state
const initialState = {
  list: {
    data: []
  },
  blotterlist:{
    data: []
  },
  user: {
    data: []
  },
  status: 'idle',  // Start with 'idle' instead of 'false'
  token: '',
  isPending: 0,
  asahdgasdgsad: "asdasdahsdgajs"
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
      item_per_page: data.per_page,
      isPendingResident: data.isPending,
      dashboard_filter: data.dashboard_filter
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



export const approveNewResidentApi = createAsyncThunk('user/editNewResidentStatus', async (data) => {


  const res = await apiClient.post('/editNewResidentStatus', {
    user_id: data.id,
    approve_reject: data.status
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

export const checkDateAvailabilityApi = createAsyncThunk('user/checkDateAvailability', async (data) => {
  const res = await apiClient.post('/checkDateAvailability', {
    schedule_date: data.selectedDate
  }, {
    headers: {
      'Authorization': `Bearer ${data.token}`,
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});


export const createAppointmentApi = createAsyncThunk('user/createAppointment', async (data) => {



  const res = await apiClient.post('/createAppointment', {
    document_type_id: data.id,
    schedule_date: data.selectedDate,
    file_upload: data.file_upload,
    purpose: data.purpose


  }, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});

export const viewAppointmentListApi = createAsyncThunk('user/viewAppointmentListApi', async (data) => {
  const res = await apiClient.get('/viewAppointmentList', {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }, params: {
      search_value: data.searchItemList,
      page_number: data.currentPage,
      item_per_page: 10,
      from_date: data.from_date,
      to_date: data.to_date,
    }
  });
  return res.data;
});


export const viewAllBlottersApi = createAsyncThunk('user/viewAllBlotters', async (data) => {

  const res = await apiClient.get('/viewAllBlotters', {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }, params: {
      search_value: data.searchItemList,
      page_number: data.currentPage,
      item_per_page: 10,
      from_date: data.from_date,
      to_date: data.to_date,
      category: data.category,
      dashboard_filter: data.dashboard_filter,
    }
  });
  return res.data;
});

export const fileBlotterReportApi = createAsyncThunk('user/fileBlotterReport', async (data) => {

  const res = await apiClient.post('/fileBlotterReport', {
    complainee_name: data.complainee_id == "" ? data.complainee_name : '',
    complainant_name: data.complainant_id == "" ? data.complainant_name : '',
    status_resolved: data.status_resolved,
    complaint_remarks: data.complaint_remarks,
    complainee_id: data.complainee_id,
    complainant_id: data.complainant_id,
    officer_on_duty: data.officer_on_duty,
    category: data.category,
    complainant_phone_number: data.complainant_phone_number,
    complainee_phone_number: data.complainee_phone_number,
    non_resident_address: data.non_resident_address,
    remarks: data.remarks

  }, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});

export const editBlotterReportApi = createAsyncThunk('user/editBlotterReport', async (data) => {

  let bodystuff = {
    status_resolved: data.status_resolved,
    complaint_remarks: data.complaint_remarks,
    id: data.id,
    officer_on_duty: data.officer_on_duty,
    category: data.category,
    complainant_phone_number: data.complainant_phone_number,
    complainee_phone_number: data.complainee_phone_number,
    non_resident_address: data.non_resident_address,
    remarks: data.remarks  };
  if(data.complainee_id == null)
  {
    bodystuff.complainee_name = data.complainee_name
  }
  else
  {
    bodystuff.complainee_id = data.complainee_id
  }
  if(data.complainant_id == null)
  {
    bodystuff.complainant_name = data.complainant_name
  }
  else
  {
    bodystuff.complainant_id = data.complainant_id
  }
  const res = await apiClient.post('/editBlotterReport', bodystuff, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
    }
  });
  return res.data;
});

export const importExcelResidentsApi = createAsyncThunk('user/importExcelResidents', async (data) => {


  const formData = new FormData();


  data.files.map((i, k) => {

    formData.append('file_upload', i);
  })

  const formDataObj = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });


  const res = await apiClient.post('/importExcelResidents', formData, {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      //'Content-Type': 'application/json',
    }
  });
  return res.data;
});

export const approveOrRejectAppointmentApi = createAsyncThunk('user/approveOrRejectAppointment', async (data) => {



  const res = await apiClient.post('/approveOrRejectAppointment', {
    appointment_id: data.id,
    approve_reject: data.status,

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
    settingPeding: (state, action) => {
      state.isPending = action.payload
    },
    logOutResident: (state, action) => {
      state.list ={
        data: []
      }
      state.blotterlist ={
        data: []
      }
      state.user ={
        data: []
      } 
      state.statu = 'idle',  // Start with 'idle' instead of 'false'
      state.token = '',
      state.isPending = 0,
      state.asahdgasdgsad = "asdasdahsdgajs"
    }
    
  },
  extraReducers: builder => {
    builder
      .addCase(loadAllUsers.pending, (state) => {
        
        state.status = 'loading';
        state.user.data = []
      })
      .addCase(loadAllUsers.fulfilled, (state, action) => {
        
        state.status = 'succeeded';
        state.list = action.payload;
        // state.user = action.payload
      })
      .addCase(loadAllUsers.rejected, (state) => {
        
        state.user.data = []
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

    builder
      .addCase(viewAppointmentListApi.pending, (state) => {
        state.status = 'loading';
        state.list.data = []
      })
      .addCase(viewAppointmentListApi.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(viewAppointmentListApi.rejected, (state) => {
        state.list.data = []
        state.status = 'failed';
      });

    builder
      .addCase(viewAllBlottersApi.pending, (state) => {
        state.status = 'loading';
        state.blotterlist.data = []
      })
      .addCase(viewAllBlottersApi.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blotterlist = action.payload;
      })
      .addCase(viewAllBlottersApi.rejected, (state) => {
        state.blotterlist.data = []
        state.status = 'failed';
      });

  },
});

// Export actions and reducer
export const { LoaddAllUsers, settingPeding,logOutResident } = usersSlice.actions;
export default usersSlice.reducer;