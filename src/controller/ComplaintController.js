import Complaint from "../models/Complaint";
import Allotment from "../models/Allotment";
import tryCatch from "../utils/tryCatch";

// Get all complaints or by Id
export const getComplaint = tryCatch(async (req, res) => {
  const complaint = req.params.id
    ? await Complaint.findById(req.params.id)
    : await Complaint.find();
  res.status(200).json({ data: complaint });
});

// Add Complaint
export const addComplaint = tryCatch(async (req, res, next) => {
  const { title, type, description, status, allotment } = req.body;

  const allotmentExist = await Allotment.findById(allotment)
    .populate("member", "name")
    .populate({
      path: "house",
      populate: {
        path: "society",
        model: "Society",
        select: "name",
      },
      select: "wing house_number",
    });
  if (!allotmentExist) {
    return next({
      message: "This allotment doesn't exist",
    });
  }

  const complaintExist = await Complaint.findOne({ title, type, allotment });
  if (complaintExist) {
    return next({
      message: "This complaint already exist",
    });
  }

  await Complaint.create({
    title,
    type,
    description,
    status,
    allotment,
  });

  return res.status(201).json({
    success: true,
    message: `Complaint registered successfully from ${allotmentExist.house.society.name} society and house number: ${allotmentExist.house.wing}-${allotmentExist.house.house_number}`,
  });
});

// Update Complaint by Id
export const updateComplaint = tryCatch(async (req, res, next) => {
  const allotmentExist = await Allotment.findOne({
    allotment: req.body.allotment,
  })
    .populate("member", "name")
    .populate({
      path: "house",
      populate: {
        path: "society",
        model: "Society",
        select: "name",
      },
      select: "wing house_number",
    });
  if (!allotmentExist) {
    return next({
      message: "This allotment doesn't exist",
    });
  }

  const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!complaint) {
    return next({
      message: "This complaint doesn't exist",
    });
  }
  complaint.save();

  return res.status(201).json({
    success: true,
    message: `Complaint updated successfully from ${allotmentExist.house.society.name} society and house number: ${allotmentExist.house.wing}-${allotmentExist.house.house_number}`,
  });
});

// Delete Complaint by Id
export const deleteComplaint = tryCatch(async (req, res, next) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return next({
      message: "This complaint is not exist in the records",
    });
  }

  await Complaint.deleteOne({ _id: complaint._id });

  return res.status(200).json({
    success: true,
    message: "Complaint deleted successfully",
  });
});

// Delete all complaints
export const deleteAllComplaint = tryCatch(async (req, res, next) => {
  await Complaint.deleteMany();

  return res.status(200).json({
    success: true,
    message: "All complaint deleted successfully",
  });
});
