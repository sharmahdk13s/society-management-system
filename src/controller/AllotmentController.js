import Allotment from "../models/Allotment";
import House from "../models/House";
import User from "../models/User";
import tryCatch from "../utils/tryCatch";

// Get All allotment or by Id
export const getAllotment = tryCatch(async (req, res) => {
  const allotment = req.params.id
    ? await Allotment.findById(req.params.id)
    : await Allotment.find();
  res.status(200).json({ data: allotment });
});

// Add allotment
export const addAllotment = tryCatch(async (req, res, next) => {
  const { member, house, allotment_date, is_active } = req.body;

  const memberExist = await User.findById(member);
  if (!memberExist) {
    return next({
      message: "This member doesn't exist",
    });
  }
  const houseExist = await House.findById(house);
  if (!houseExist) {
    return next({
      message: "This house or flat doesn't exist",
    });
  }

  const allotmentExist = await Allotment.findOne({ house })
    .populate("member", "name")
    .populate("house", "wing house_number");

  if (allotmentExist) {
    return next({
      message: `${allotmentExist.house.wing}-${allotmentExist.house.house_number} already alloted to ${allotmentExist.member.name}`,
    });
  }

  await Allotment.create({
    member,
    house,
    allotment_date,
    is_active,
  });

  let allotment = await Allotment.findOne({ house })
    .populate("member", "name")
    .populate("house", "wing house_number");

  return res.status(201).json({
    success: true,
    message: `${allotment.house.wing}-${allotment.house.house_number} now alloted to ${allotment.member.name} successfully`,
  });
});

// Update allotment
export const updateAllotment = tryCatch(async (req, res, next) => {
  const allotment = await Allotment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("member", "name")
    .populate("house", "wing house_number");

  allotment.save();

  return res.status(200).json({
    success: true,
    message: `${allotment.house.wing}-${allotment.house.house_number} now updated and alloted to ${allotment.member.name} successfully`,
  });
});

// Delete allotment by id
export const deleteAllotment = tryCatch(async (req, res, next) => {
  const allotment = await Allotment.findById(req.params.id);
  if (!allotment) {
    return next({
      message: "This allotment is not exist in the records",
    });
  }

  await Allotment.deleteOne({ _id: allotment._id });

  return res.status(200).json({
    success: true,
    message: "Allotment deleted successfully",
  });
});

// Delete all Allotments
export const deleteAllAllotment = tryCatch(async (req, res, next) => {
  await Allotment.deleteMany();

  return res.status(200).json({
    success: true,
    message: "All Allotment deleted successfully",
  });
});
