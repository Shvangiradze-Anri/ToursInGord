import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
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

type Image = {
  _id: string;
  image: {
    public_id: string;
    url: string;
  };
  page: string;
};

let tourChachedImages: Image[] | null = null;
let galleryChachedImages: Image[] | null = null;
let hotelChachedImages: Image[] | null = null;

export const fetchImages = createAsyncThunk(
  "tourImages/fetchImages",
  async (page: string) => {
    let cachedImages: Image[] | null = null;

    // Use specific cache based on the page
    switch (page) {
      case "tour":
        cachedImages = tourChachedImages;
        break;
      case "gallery":
        cachedImages = galleryChachedImages;
        break;
      case "hotel":
        cachedImages = hotelChachedImages;
        break;
      default:
        cachedImages = null;
    }

    if (cachedImages) {
      console.log(`Returning cached images for ${page}`);
      return cachedImages;
    }

    // If no cache, fetch images from the server
    try {
      console.log(`Fetching images for ${page}`);
      const response = await axiosAdmin.get(`/${page}images`);
      const imagesData = response.data;

      // Update the cache based on the page
      switch (page) {
        case "tour":
          tourChachedImages = imagesData;
          break;
        case "gallery":
          galleryChachedImages = imagesData;
          break;
        case "hotel":
          hotelChachedImages = imagesData;
          break;
      }

      return imagesData;
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error;
    }
  }
);

export const deleteImage = createAsyncThunk(
  "tourImages/deleteImage",
  async (image: Image) => {
    try {
      const response = await axiosAdmin.delete(
        `/images/delete/${image._id}?page=${image.page}`
      );

      if (response.status === 200) {
        toast.success("Image deleted");
        return { _id: image._id, page: image.page }; // Include page in the return object
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
      console.log(image);

      const res = await axiosAdmin.post("/uploadImages", image);
      console.log(res.data);
      if (res.status === 200) {
        toast.success("Successfully uploaded");
      }

      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage =
            axiosError.response.data?.error || "An error occurred";
          console.error("Error uploading image:", errorMessage);
          toast.error(errorMessage);
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

const imageSlice = createSlice({
  name: "tourImages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Images
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
      // Upload Image
      .addCase(uploadImage.pending, (state) => {
        state.uploadImageState = "pending";
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploadImageState = null;
        state.images.push(action.payload);

        // Update the appropriate cache based on the page of the uploaded image
        const page = action.payload.page;
        switch (page) {
          case "tour":
            tourChachedImages = tourChachedImages
              ? [...tourChachedImages, action.payload]
              : [action.payload];
            break;
          case "gallery":
            galleryChachedImages = galleryChachedImages
              ? [...galleryChachedImages, action.payload]
              : [action.payload];
            break;
          case "hotel":
            hotelChachedImages = hotelChachedImages
              ? [...hotelChachedImages, action.payload]
              : [action.payload];
            break;
        }
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploadImageState = "rejected";
        state.error = action.error.message || "Failed to upload image";
      })
      // Delete Image
      .addCase(deleteImage.pending, (state) => {
        state.deleteImageState = "pending";
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        const deletedId = action.payload._id;
        const page = action.payload.page;

        // Clear cache for the specific page to refetch fresh data on the next load
        switch (page) {
          case "tour":
            tourChachedImages = null;
            break;
          case "gallery":
            galleryChachedImages = null;
            break;
          case "hotel":
            hotelChachedImages = null;
            break;
        }

        // Remove deleted image from the state
        state.images = state.images.filter((image) => image._id !== deletedId);
      })
      .addCase(deleteImage.rejected, (state) => {
        state.deleteImageState = "rejected";
      });
  },
});

export default imageSlice.reducer;
