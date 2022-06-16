import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signIn } from "../../api/login/index";
import CryptoJS from "crypto-js";
// import validator from "validator";


const initialState = {
  token: "",
  expiry: "",
  userDetails: {},
  loading: false,
  error: "",
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    // console.log(username, password);
    if (username && password) {
      try { 
        const data = await signIn(username, password);
        // console.log(data);
        if(data.err){
         return rejectWithValue(data.err);
        }
        return data;
      } catch (err) {
        console.log(err); 
        return rejectWithValue("Error in Logging In.");
      }     
    } else {
      alert("Please fill all fields");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    setToken:(state,action)=>{
      state.token = action.payload;
    },
    setExpiry:(state,action)=>{
      state.expiry=action.payload;
    },
    setUserDetails:(state,action)=>{
      state.userDetails=action.payload;
    },
    
    setError:(state,action)=>{
      state.error=action.payload;
    },
    
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, { payload }) => {
      // console.log(payload);
      if(!payload){
        return;
      }
      let encryptedToken = CryptoJS.AES.encrypt(
        payload.token,
        process.env.REACT_APP_CRYPTO_SECRET
      ).toString();
      state.token = encryptedToken;
      state.userDetails = payload.user;
      state.expiry = payload.expiryTime;
    },
    [login.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  
  },
});

export const {setToken,setExpiry,setUserDetails,setError} = authSlice.actions;
export default authSlice.reducer;