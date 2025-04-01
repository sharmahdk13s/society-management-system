import mongoose from "mongoose";
import tryCatch from "./tryCatch";

const clearCollections = tryCatch(async (req, res, next) => {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map(
      (collection) => collection.deleteMany({}) // an empty mongodb selector object ({}) must be passed as the filter argument
    )
  );
  return res.status(200).json({
    success: true,
    message: "All Tables records wiped out successfully",
  });
});

const deleteDatabase = tryCatch(async (req, res, next) => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  return res.status(200).json({
    success: true,
    message: "All Tables deleted successfully",
  });
});

export { clearCollections, deleteDatabase };
