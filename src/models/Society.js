import mongoose from "mongoose";

const SocietySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name of society"],
    },
    secretary: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please add a name of secretary of society"],
    },
    description: {
      type: String,
    },
    is_building: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "Society" }
);

export default mongoose.model("Society", SocietySchema);
