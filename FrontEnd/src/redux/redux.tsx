import { configureStore } from "@reduxjs/toolkit";
import themeMode from "./theme";
import componentsRef from "./componentRef";
import userSlice from "./getUser";
import fetchImages from "./getImages";
import csrfToken from "./csrf";
import adminUserSlice from "./getAdminUsers";

const store = configureStore({
  reducer: {
    theme: themeMode,
    getComponentsRef: componentsRef,
    user: userSlice,
    images: fetchImages,
    csrfToken: csrfToken,
    adminUsers: adminUserSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
