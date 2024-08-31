import { mongoose } from "mongoose";

const { Schema } = mongoose;

const imagesSchema = new Schema({
  image: { type: Object, required: true },
  page: String,
});

const ImagesModel = mongoose.model("TourImages", imagesSchema);

export { ImagesModel as Images };
