import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ComponentRefState = {
  aboutRef: number;
  galleryRef: number;
  hotelRef: number;
  contactRef: number;
};

const initialState: ComponentRefState = {
  aboutRef: 0,
  galleryRef: 0,
  hotelRef: 0,
  contactRef: 0,
};

const refSlice = createSlice({
  name: "componentRef",
  initialState,
  reducers: {
    updateRefs: (state, action: PayloadAction<ComponentRefState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateRefs } = refSlice.actions;

export default refSlice.reducer;
