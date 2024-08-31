import { mongoose } from "mongoose";

const { Schema } = mongoose;

const subsSchema = new Schema({
  email: String,
});

const SubsModel = mongoose.model("Subscribers", subsSchema);

export { SubsModel as Subscriber };
