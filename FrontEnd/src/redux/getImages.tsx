import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { axiosAdmin } from "../api/axios";

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

export const deleteImage = createAsyncThunk(
  "tourImages/deleteImage",
  async (id: number) => {
    try {
      const accessT = Cookies.get("accessT") as string;
      const csrfToken = Cookies.get("csrfT");
      const response = await axiosAdmin.delete(`/images/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
          Authorization: `Bearer ${accessT}`,
        },
      });

      if (response.status === 200) {
        toast.success("Image deleted");
        return { id }; // Return deleted image ID
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

type ImageFile = {
  image: string | ArrayBuffer | null; // Assuming this is the data URL of the image
  page: string; // Assuming this is the page number associated with the image
};

type uploadImagePayload = {
  image: ImageFile;
  setLoadingUpload: React.Dispatch<React.SetStateAction<boolean>>;
};

export const uploadImage = createAsyncThunk(
  "tourImages/uploadImage",
  async ({ image, setLoadingUpload }: uploadImagePayload) => {
    try {
      const accessT = Cookies.get("accessT") as string;
      const csrfToken = Cookies.get("csrfT");

      console.log(`Authorization header: Bearer ${accessT}`);

      const res = await axiosAdmin.post("/uploadImages", image, {
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
          Authorization: `Bearer ${accessT}`,
        },
      });
      console.log(res.data);
      if (res.data.error) {
        console.log(res.data.error);
      } else {
        toast.success("Image is uploaded");
        setLoadingUpload(false);
      }
      cachedImages = null;

      return res.data;
    } catch (error) {
      console.log(error);
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
        const deletedId = action.payload.id;
        state.images = state.images.filter((image) => image._id !== deletedId);
      })
      .addCase(deleteImage.rejected, (state) => {
        state.deleteImageState = "rejected";
      })
      .addMatcher(
        (action) => [uploadImage.fulfilled].includes(action.type),
        () => {
          fetchImages();
        }
      );
  },
});

// Export the async thunk and the slice reducer

export default imageSlice.reducer;
