import mongoose from "mongoose";
import { Maintenance_Type, Transaction_Type } from "../constant/enum";

const MaintenanceSchema = new mongoose.Schema(
  {
    allotment: {
      type: mongoose.Schema.ObjectId,
      ref: "Allotment",
      required: true,
    },
    maintenance_type: {
      type: String,
      enum: Maintenance_Type,
      default: Maintenance_Type.COMMON_UTILITIES,
      required: [true, "Please add maintenance type"],
    },
    transaction_amount: {
      type: Number,
      required: [true, "Please add transaction amount"],
    },
    transaction_type: {
      type: String,
      enum: Transaction_Type,
      default: Transaction_Type.MONTHLY,
      required: [true, "Please add transaction amount"],
    },
    transaction_timestamp: {
      type: Number,
      required: [true, "Please add transaction timestamp"],
    },
    is_paid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "Maintenance" }
);

export default mongoose.model("Maintenance", MaintenanceSchema);
