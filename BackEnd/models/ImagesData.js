import { mongoose } from "mongoose";

const { Schema } = mongoose;

// Tour images
const tourimages = new Schema(
  {
    image: { public_id: String, url: String },
    page: String,
  },
  { timestamps: true }
);
const Tourimage = mongoose.model("TourImage", tourimages);

//Gallery images
const galleryimages = new Schema(
  {
    image: { public_id: String, url: String },
    page: String,
  },
  { timestamps: true }
);
const Galleryimage = mongoose.model("galleryImage", galleryimages);

//Hotel images
const hotelimages = new Schema(
  {
    image: { public_id: String, url: String },
    page: String,
  },
  { timestamps: true }
);
const Hotelimage = mongoose.model("hotelimage", hotelimages);

export { Tourimage, Galleryimage, Hotelimage };
