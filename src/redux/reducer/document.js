import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from './user';

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

export const addDocumentTypeApi = createAsyncThunk('user/addDocumentType', async (data) => {
      console.log('hala', data)
  const res = await apiClient.post('/addDocumentType', {
    service: data.data.service,
    description: data.data.description,
    isCertificate: data.data.isCertificate
    // status: data.selectedSearchItem.status
  }, {
    headers:{
      'Authorization': `Bearer ${data.token}`, // Replace with your actual token
      'Content-Type': 'application/json',
  }
  });
  return res.data;
});



export const getDocumentTypeApi = createAsyncThunk('user/getDocumentTypes', async (data) => {
  
const res = await apiClient.get('/getDocumentTypes',  {
headers:{
  'Authorization': `Bearer ${data}`, // Replace with your actual token
  'Content-Type': 'application/json',
}
});
return res.data;
});


export const deleteDocumentTypeApi = createAsyncThunk('user/deleteDocumentType', async (data) => {

  console.log(data, "--> AWIT SYO")
  const res = await apiClient.post('/deleteDocumentType',  
    {
      document_type_id: data.data.id
    },{
  headers:{
    'Authorization': `Bearer ${data.token}`, // Replace with your actual token
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
      .addCase(getDocumentTypeApi.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDocumentTypeApi.fulfilled, (state, action) => {
        
        state.status = 'succeeded';
        state.list = action.payload

      })
      .addCase(getDocumentTypeApi.rejected, (state) => {
        
        state.status = 'failed';
      });

  },
});

// Export actions and reducer
export const { LoadOfficials } = officialsSlice.actions;
export default officialsSlice.reducer;