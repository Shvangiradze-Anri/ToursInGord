import { configureStore } from "@reduxjs/toolkit";
import themeMode from "./theme";
import componentsRef from "./componentRef";
import userReducer from "./getUser";
import fetchImages from "./getImages";
import csrfToken from "./csrf";

const store = configureStore({
  reducer: {
    theme: themeMode,
    getComponentsRef: componentsRef,
    user: userReducer,
    images: fetchImages,
    csrfToken: csrfToken,
  },
});

export default store;
