import Allotment from "../models/Allotment";
import Maintenance from "../models/Maintenance";
import tryCatch from "../utils/tryCatch";

// Get All Maintenance or by Id
export const getMaintenance = tryCatch(async (req, res) => {
  const maintenance = req.params.id
    ? await Maintenance.findById(req.params.id)
    : await Maintenance.find();
  res.status(200).json({ data: maintenance });
});

// Add new maintenance
export const addMaintenance = tryCatch(async (req, res, next) => {
  const {
    allotment,
    maintenance_type,
    transaction_amount,
    transaction_type,
    transaction_timestamp,
    is_paid,
  } = req.body;

  const allotmentExist = await Allotment.findById(allotment);
  if (!allotmentExist) {
    return next({
      message: "Allotment doesn't exist",
    });
  }

  const maintenanceExist = await Maintenance.findOne({
    allotment,
    maintenance_type,
  });
  if (maintenanceExist) {
    return next({
      message: "Maintenance already exist",
    });
  }

  let maintenance = await Maintenance.create({
    allotment,
    maintenance_type,
    transaction_amount,
    transaction_type,
    transaction_timestamp,
    is_paid,
  });

  maintenance = await Maintenance.findById(maintenance.id).populate({
    path: "allotment",
    select: "house member",
    populate: [
      {
        path: "house",
        model: "House",
        select: "wing house_number",
        populate: { path: "society", model: "Society", select: "name" },
      },
      { path: "member", model: "User", select: "name" },
    ],
  });

  return res.status(201).json({
    success: true,
    message: `Maintenance added successfully for ${maintenance.allotment.member.name} at ${maintenance.allotment.house.wing}-${maintenance.allotment.house.house_number} from ${maintenance.allotment.house.society.name} society.`,
  });
});

// Update Maintenance
export const updateMaintenance = tryCatch(async (req, res, next) => {
  const { allotment } = req.body;

  const allotmentExist = await Allotment.findById(allotment);
  if (!allotmentExist) {
    return next({
      message: "Allotment doesn't exist",
    });
  }

  const maintenance = await Maintenance.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate({
    path: "allotment",
    select: "house member",
    populate: [
      {
        path: "house",
        model: "House",
        select: "wing house_number",
        populate: { path: "society", model: "Society", select: "name" },
      },
      { path: "member", model: "User", select: "name" },
    ],
  });

  maintenance.save();

  return res.status(200).json({
    success: true,
    message: `Maintenance updated successfully for ${maintenance.allotment.member.name} at ${maintenance.allotment.house.wing}-${maintenance.allotment.house.house_number} from ${maintenance.allotment.house.society.name} society.`,
  });
});

// Delete Maintenance by Id
export const deleteMaintenance = tryCatch(async (req, res, next) => {
  const maintenance = await Maintenance.findById(req.params.id);
  if (!maintenance) {
    return next({
      message: "This maintenance not exist in the records",
    });
  }

  await Maintenance.deleteOne({ _id: maintenance._id });

  return res.status(200).json({
    success: true,
    message: "Maintenance deleted successfully",
  });
});

// Delete all maintenance
export const deleteAllMaintenance = tryCatch(async (req, res, next) => {
  await Maintenance.deleteMany();

  return res.status(200).json({
    success: true,
    message: "All maintenance deleted successfully",
  });
});
