import { mongoose } from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  lastname: String,
  email: { type: String, uniqe: true },
  password: String,
  image: { type: Object },
  gender: String,
  birthday: String,
  role: String,
});

const UserModel = mongoose.model("User", userSchema);

export { UserModel as User };
