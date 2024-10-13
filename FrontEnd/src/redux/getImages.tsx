import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { axiosAdmin } from "../api/axios";
import { AxiosError } from "axios";

// Define the initial state type
interface ImageState {
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[]; // Adjust this type according to your image structure
  error: string;
  deleteImageState: null | string;
  uploadImageState: null | string;
}

// Load state from local storage if available
const initialState: ImageState = {
  loading: false,
  images: [],
  error: "",
  deleteImageState: null,
  uploadImageState: null,
};

// Define the async thunk to fetch images
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedImages: any[] | null = null;

export const fetchImages = createAsyncThunk(
  "tourImages/fetchImages",
  async () => {
    try {
      console.log("get images");

      if (cachedImages !== null) {
        return cachedImages;
      } else {
        const response = await axiosAdmin.get("/images", {
          headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
          },
        });
        const imagesData = response.data;

        cachedImages = imagesData;

        return imagesData;
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
  }
);
type Image = {
  _id: string;
  image: {
    public_id: string;
    url: string;
  };
  page: string;
};

export const deleteImage = createAsyncThunk(
  "tourImages/deleteImage",
  async (image: Image) => {
    try {
      const accessT = Cookies.get("accessT") as string;
      const csrfToken = Cookies.get("csrfT");

      const response = await axiosAdmin.delete(`/images/delete/${image._id}`, {
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
          Authorization: `Bearer ${accessT}`,
        },
      });
      if (response.status === 200) {
        toast.success("Image deleted");

        return { _id: image._id }; // Return only the deleted image ID
      } else {
        toast.error("Failed to delete image");
        return Promise.reject("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      return Promise.reject(error);
    }
  }
);
// Define the expected structure of the error response
interface ErrorResponse {
  error: string;
}

type ImageFile = {
  image: string | ArrayBuffer | null;
  page: string;
};

type uploadImagePayload = {
  image: ImageFile;
};

export const uploadImage = createAsyncThunk(
  "tourImages/uploadImage",
  async ({ image }: uploadImagePayload, { rejectWithValue }) => {
    try {
      const accessT = Cookies.get("accessT") as string;
      const csrfToken = Cookies.get("csrfT");

      console.log(image);

      const res = await axiosAdmin.post("/uploadImages", image, {
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
          Authorization: `Bearer ${accessT}`,
        },
      });
      console.log(res.data);
      if (res.status === 200) {
        toast.success("Successfully uploaded");
      }
      cachedImages = null;

      return res.data;
    } catch (error) {
      // Check if the error is an instance of AxiosError
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ErrorResponse>; // Type assertion
        if (axiosError.response) {
          const errorMessage =
            axiosError.response.data?.error || "An error occurred";
          console.error("Error uploading image:", errorMessage); // Logs error from backend
          toast.error(errorMessage); // Display error message to the user
          return rejectWithValue(errorMessage);
        }
      } else {
        console.error("Unexpected error:", (error as Error).message);
        toast.error("An unexpected error occurred. Please try again.");
        return rejectWithValue((error as Error).message);
      }
    }
  }
);

// Create the user slice
const imageSlice = createSlice({
  name: "tourImages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
        state.error = "";
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.images = [];
        state.error = action.error.message || "An error occurred";
      })
      .addCase(uploadImage.pending, (state) => {
        state.uploadImageState = "pending";
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.images.push(action.payload);
        state.uploadImageState = null;
      })
      .addCase(uploadImage.rejected, (state) => {
        state.uploadImageState = "rejected";
      })
      .addCase(deleteImage.pending, (state) => {
        state.deleteImageState = "pending";
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        const deletedId = action.payload._id;
        console.log(state.images);

        state.images = state.images.filter((image) => image._id !== deletedId);
      })
      .addCase(deleteImage.rejected, (state) => {
        state.deleteImageState = "rejected";
      })
      .addMatcher(
        (action) =>
          [uploadImage.fulfilled, deleteImage.fulfilled].includes(action.type),
        () => {
          fetchImages(); // Re-fetch images after upload or delete
        }
      );
  },
});

// Export the async thunk and the slice reducer

export default imageSlice.reducer;
