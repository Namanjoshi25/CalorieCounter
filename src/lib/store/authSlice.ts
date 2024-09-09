import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface IUserInfo {
    _id: string;
    name: string;
    email: string;
    // Add more user-specific fields as needed
  }
  
  // Define the interface for the auth state
  export interface IAuthState {
    authState: boolean;
    userInfo: IUserInfo; // Assuming userInfo is an object now
  }
  const initialState = {
    authStatus: false,
    userInfo : {}
  }

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IAuthState>) => {
      console.log(action.payload);
      state.authStatus = true;
      state.userInfo = action.payload
    },
    logout : (state )=>{
        state.authStatus = false,
        state.userInfo = {}
    }
  },
});

export const {login,logout} = authSlice.actions;
export const authReducer = authSlice.reducer;