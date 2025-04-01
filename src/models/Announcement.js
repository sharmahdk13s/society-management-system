import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    reaction: {
      type: String,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true, collection: "Announcement" }
);

export default mongoose.model("Announcement", AnnouncementSchema);
