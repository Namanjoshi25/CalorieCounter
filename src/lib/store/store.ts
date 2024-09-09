import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer, authSlice } from './authSlice'
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";



const authPersistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["userInfo" , "authStatus"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});


export const store = 
   configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
  })


// Infer the type of makeStore

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
