import mongoose from "mongoose";

const AllotmentSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    house: {
      type: mongoose.Schema.ObjectId,
      ref: "House",
      required: true,
    },
    allotment_date: {
      type: Date,
      required: [true, "Please add allotment date"],
      default: new Date(),
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: "Allotment" }
);

export default mongoose.model("Allotment", AllotmentSchema);
