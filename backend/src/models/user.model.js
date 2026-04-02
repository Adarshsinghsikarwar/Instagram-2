import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Password is required if googleId is not present
    },
  },
  googleId: {
    type: String,
    unique: true,
    //sparse: true, // Allows multiple documents to have null googleId
  },
  prfilePicture: {
    type: String,
    default:
      "https://ik.imagekit.io/zdc2bt86h/profileImage?updatedAt=1774290662832",
  },
});

userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

const userModel = mongoose.model("user", userSchema);

export default userModel;
