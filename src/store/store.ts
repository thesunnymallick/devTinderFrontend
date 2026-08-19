import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    connections: connectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;