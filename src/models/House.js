import mongoose from "mongoose";

const HouseSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.ObjectId,
      ref: "Society",
      required: [true, "Please add your society"],
    },
    house_number: {
      type: String,
      required: [true, "Please add a house number"],
    },
    wing: {
      type: String,
      required: [true, "Please add wing for the house"],
    },
    maintenance: {
      type: Number,
      required: [true, "Please add maintenance amount"],
    },
    is_flat: {
      type: Boolean,
      default: false,
    },
    flat_type: {
      type: String,
      required: function () {
        return [this.isFlat, "Please add flat type"];
      },
      default: "1BHK",
    },
    is_half_tenant: {
      type: Boolean,
      default: false,
    },
    is_full_tenant: {
      type: Boolean,
      default: false,
    },
    tenant_amount: {
      type: Number,
      required: function () {
        return [
          this.is_half_tenant || this.is_full_tenant,
          "Please add tenant amount",
        ];
      },
      default: 0,
    },
    is_sell: {
      type: Boolean,
      default: false,
    },
    sell_amount: {
      type: Number,
      required: function () {
        return [this.is_sell, "Please add sell amount"];
      },
      default: 0,
    },
  },
  { timestamps: true, collection: "House" }
);

export default mongoose.model("House", HouseSchema);
