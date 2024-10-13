import { mongoose } from "mongoose";

const { Schema } = mongoose;

const imagesSchema = new Schema({
  image: { public_id: String, url: String },
  page: String,
});

const ImagesModel = mongoose.model("TourImages", imagesSchema);

export { ImagesModel as Images };
