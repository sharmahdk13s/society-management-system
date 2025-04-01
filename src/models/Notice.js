import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
  {
    allotment: {
      type: mongoose.Schema.ObjectId,
      ref: "Allotment",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please add title"],
    },
    type: {
      type: String,
      enum: ["complaint", "maintenance", "other"],
      required: [true, "Please add notice type"],
    },
    description: {
      type: String,
      required: [true, "Please add description"],
    },
  },
  { timestamps: true, collection: "Notice" }
);

export default mongoose.model("Notice", NoticeSchema);
