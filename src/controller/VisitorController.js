import Allotment from "../models/Allotment";
import Visitor from "../models/Visitor";
import tryCatch from "../utils/tryCatch";
import APIFeatures from "../utils/ApiFeature";

// Get All Visitor or by Id
export const getVisitor = tryCatch(async (req, res) => {
  let visitor = null;
  if (req.params.id) {
    visitor = await Visitor.findById(req.params.id);
  } else {
    let query = Visitor.find();
    if (req.query.search) {
      query = Visitor.find({ $text: { $search: `${req.query.search}` } });
    }
    const advancedQuery = new APIFeatures(query, req.query)
      .sort()
      .paginate()
      .fields()
      .filter();
    visitor = await advancedQuery.query;
  }
  res.status(200).json({ data: visitor });
});

// Add new Visitor
export const addVisitor = tryCatch(async (req, res, next) => {
  const {
    name,
    visit_to,
    contact_number,
    gender,
    reason,
    in_time,
    out_time,
    remarks,
    is_vendor,
  } = req.body;

  let allotmentExist = await Allotment.findById(visit_to);
  if (!allotmentExist) {
    return next({
      message: "Allotment doesn't exist",
    });
  }

  const visitorExist = await Visitor.findOne({
    name,
    visit_to,
    contact_number,
    gender,
  });
  if (visitorExist) {
    return next({
      message: "Visitor already exist",
    });
  }

  await Visitor.create({
    name,
    visit_to,
    contact_number,
    gender,
    reason,
    in_time,
    out_time,
    remarks,
    is_vendor,
  });

  allotmentExist = await Allotment.findById(visit_to)
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

  return res.status(201).json({
    success: true,
    message: `Visitor added successfully who visit to ${allotmentExist.member.name} at ${allotmentExist.house.wing}-${allotmentExist.house.house_number} from ${allotmentExist.house.society.name} society.`,
  });
});

// Update Visitor
export const updateVisitor = tryCatch(async (req, res, next) => {
  const { visit_to } = req.body;

  const allotmentExist = await Allotment.findById(visit_to);
  if (!allotmentExist) {
    return next({
      message: "Allotment doesn't exist",
    });
  }

  const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate({
    path: "visit_to",
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

  visitor.save();

  return res.status(200).json({
    success: true,
    message: `Visitor updated successfully who visit to ${visitor.visit_to.member.name} at ${visitor.visit_to.house.wing}-${visitor.visit_to.house.house_number} from ${visitor.visit_to.house.society.name} society.`,
  });
});

// Delete Visitor by Id
export const deleteVisitor = tryCatch(async (req, res, next) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) {
    return next({
      message: "This visitor not exist in the records",
    });
  }

  await Visitor.deleteOne({ _id: visitor._id });

  return res.status(200).json({
    success: true,
    message: "Visitor deleted successfully",
  });
});

// Delete all visitor
export const deleteAllVisitor = tryCatch(async (req, res, next) => {
  await Visitor.deleteMany();

  return res.status(200).json({
    success: true,
    message: "All visitor deleted successfully",
  });
});
