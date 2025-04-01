import mongoose from "mongoose";
import { Complaint_Type } from "../constant/enum";

const ComplaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add complaint title"],
    },
    type: {
      type: String,
      required: [true, "Please add complaint type"],
    },
    description: {
      type: String,
      required: [true, "Please add complaint description"],
    },
    status: {
      type: String,
      enum: Complaint_Type,
      default: Complaint_Type.PENDING,
      required: true,
    },
    allotment: {
      type: mongoose.Schema.ObjectId,
      ref: "Allotment",
      required: false,
    },
  },
  { timestamps: true, collection: "Complaint" }
);

export default mongoose.model("Complaint", ComplaintSchema);
