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
    authStatus: boolean;
    userInfo: IUserInfo | null // Assuming userInfo is an object now
  }
  const initialState: IAuthState = {
    authStatus: false,
    userInfo : null
  }

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IUserInfo>) => {
  
      state.authStatus = true;
      state.userInfo = action.payload
    },
    logout : (state )=>{
        state.authStatus = false,
        state.userInfo = null
    }
  },
});

export const {login,logout} = authSlice.actions;
export const authReducer = authSlice.reducer;