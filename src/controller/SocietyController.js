import Society from "../models/Society";
import tryCatch from "../utils/tryCatch";

// Get All Society or By Id
export const getSociety = tryCatch(async (req, res) => {
  const society = req.params.id
    ? await Society.findById(req.params.id)
    : await Society.find();
  res.status(200).json({ data: society });
});

// Add Society
export const addSociety = tryCatch(async (req, res, next) => {
  const { name, secretary, description, is_building } = req.body;

  let buildingOrSociety = is_building ? "Building" : "Society";

  const societyExist = await Society.findOne({ name, secretary, is_building });
  if (societyExist) {
    return next({
      message: `${buildingOrSociety} already exists`,
    });
  }

  await Society.create({
    name,
    secretary,
    description,
    is_building,
  });

  return res.status(201).json({
    success: true,
    message: `${name} ${buildingOrSociety.toLowerCase()} added successfully`,
  });
});

// Update Society
export const updateSociety = tryCatch(async (req, res, next) => {
  const { name, secretary, is_building } = req.body;
  let buildingOrSociety = is_building ? "building" : "society";

  let societyExist = await Society.findById(req.params.id);
  if (!societyExist) {
    return next({
      message: `${name} ${buildingOrSociety} doesn't exist`,
    });
  }

  societyExist = await Society.findOne({ name, secretary, is_building });
  if (societyExist && societyExist.id !== req.params.id) {
    return next({
      message: `${name} ${buildingOrSociety} already exists`,
    });
  }

  const society = await Society.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  society.save();

  return res.status(200).json({
    success: true,
    message: `${name} ${buildingOrSociety} updated successfully`,
  });
});

// Delete society by id
export const deleteSociety = tryCatch(async (req, res, next) => {
  const society = await Society.findById(req.params.id);
  if (!society) {
    return next({
      message: "This society or building is not exist in the records",
    });
  }

  const { name, is_building } = society;
  let buildingOrSociety = is_building ? "building" : "society";

  await Society.deleteOne({ _id: society._id });

  return res.status(200).json({
    success: true,
    message: `${name} ${buildingOrSociety} deleted successfully`,
  });
});

// Delete all society
export const deleteAllSociety = tryCatch(async (req, res, next) => {
  await Society.deleteMany();

  return res.status(200).json({
    success: true,
    message: "All society deleted successfully",
  });
});
