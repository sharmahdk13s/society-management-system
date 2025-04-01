import mongoose from "mongoose";
import { Gender } from "../constant/enum";

const VisitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add visitor name"],
    },
    visit_to: {
      type: mongoose.Schema.ObjectId,
      ref: "Allotment",
      required: true,
    },
    contact_number: {
      type: String,
      required: [true, "Please add visitor contact number"],
    },
    gender: {
      type: String,
      enum: Gender,
      required: [true, "Please add gender"],
    },
    reason: {
      type: String,
      required: [true, "Please add reason for visit"],
    },
    in_time: {
      type: Date,
      default: new Date(),
      required: [true, "Please add in time"],
    },
    out_time: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
    },
    is_vendor: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "Visitor", autoIndex: false }
).index({
  name: "text",
  gender: "text",
  visit_to: "text",
  contact_number: "text",
  in_time: "text",
  out_time: "text",
  is_vendor: "text",
});

const VisitorModel = mongoose.model("Visitor", VisitorSchema);
VisitorModel.createIndexes();

export default VisitorModel;
