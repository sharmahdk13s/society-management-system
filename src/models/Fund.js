import mongoose from "mongoose";
import { Fund_Type } from "../constant/enum";

const FundSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add society fund title"],
    },
    type: {
      type: String,
      enum: Fund_Type,
      default: Fund_Type.CREDIT,
      required: [true, "Please add fund type"],
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, "Please add fund amount"],
    },
  },
  { timestamps: true, collection: "Fund" }
);

export default mongoose.model("Fund", FundSchema);
