import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "24h" }, // TTL index for 24 hours
  },
});

const Story = mongoose.model("Story", storySchema);
export default Story;
