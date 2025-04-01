import Allotment from "../models/Allotment";
import Announcement from "../models/Announcement";
import Fund from "../models/Fund";
import Notice from "../models/Notice";
import tryCatch from "../utils/tryCatch";

// Announcement : Create or Add
export const addAnnouncement = tryCatch(async (req, res, next) => {
  const { title, description, reaction, comment } = req.body;

  const announcementExist = await Announcement.findOne({ title });

  if (announcementExist) {
    return next({
      message: "This announcement is already exist",
    });
  }

  await Announcement.create({
    title,
    description,
    reaction,
    comment,
  });

  return res.status(201).json({
    success: true,
    message: "Announcement created successfully",
  });
});

// Announcement : Update or Edit
export const updateAnnouncement = tryCatch(async (req, res, next) => {
  const announcement = await Announcement.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  announcement.save();

  return res.status(200).json({
    success: true,
    message: "Announcement updated successfully",
  });
});

// Announcement : Delete
export const deleteAnnouncement = tryCatch(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return next({
      message: "This announcement is not exist in the records",
    });
  }
  await Announcement.deleteOne({ _id: announcement._id });

  return res.status(200).json({
    success: true,
    message: "Announcement deleted successfully",
  });
});

// Announcement : Delete All
export const deleteAllAnnouncement = tryCatch(async (req, res, next) => {
  await Announcement.deleteMany();

  return res.status(200).json({
    success: true,
    message: "All announcement deleted successfully",
  });
});

//////////// ******************* ////////

// Notice : Create or Add
export const addNotice = tryCatch(async (req, res, next) => {
  const { allotment, title, type, description } = req.body;

  let allotmentExist = await Allotment.findById(allotment);
  if (!allotmentExist) {
    return next({
      message: "This allotment doesn't exist",
    });
  }

  const noticeExist = await Notice.findOne({ title, type });

  allotmentExist = await Allotment.findOne({ allotment })
    .populate("member", "name")
    .populate("house", "wing house_number");

  if (noticeExist) {
    return next({
      message: `Notice already sent to ${allotmentExist.member.name} who have ${allotmentExist.house.wing}-${allotmentExist.house.house_number} house alloted`,
    });
  }

  await Notice.create({
    allotment,
    title,
    type,
    description,
  });

  return res.status(201).json({
    success: true,
    message: `Notice sent to ${allotmentExist.member.name} who have ${allotmentExist.house.wing}-${allotmentExist.house.house_number} house alloted`,
  });
});

// Notice : Update or Edit
export const updateNotice = tryCatch(async (req, res, next) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!notice) {
    return next({
      message: "This notice is not exist in the records",
    });
  }

  let allotmentExist = await Allotment.findOne({
    allotment: req.body.allotment,
  })
    .populate("member", "name")
    .populate("house", "wing house_number");
  if (!allotmentExist) {
    return next({
      message: "This allotment doesn't exist",
    });
  }

  notice.save();

  return res.status(200).json({
    success: true,
    message: `Notice to ${allotmentExist.member.name} who have ${allotmentExist.house.wing}-${allotmentExist.house.house_number} house alloted is updated successfully`,
  });
});

// Notice : Delete
export const deleteNotice = tryCatch(async (req, res, next) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    return next({
      message: "This notice is not exist in the records",
    });
  }
  await Notice.deleteOne({ _id: notice._id });

  return res.status(200).json({
    success: true,
    message: "Notice deleted successfully",
  });
});

// Notice : Delete All
export const deleteAllNotice = tryCatch(async (req, res, next) => {
  await Notice.deleteMany();

  return res.status(200).json({
    success: true,
    message: "All notice deleted successfully",
  });
});

//////////// ******************* ////////

// Fund : Create or Add
export const addFund = tryCatch(async (req, res, next) => {
  const { title, type, description, amount } = req.body;

  await Fund.create({
    title,
    type,
    description,
    amount,
  });

  return res.status(201).json({
    success: true,
    message: "Fund added successfully",
  });
});

// Fund : Update or Edit
export const updateFund = tryCatch(async (req, res, next) => {
  const fund = await Fund.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!fund) {
    return next({
      message: "This fund is not exist in the records",
    });
  }

  fund.save();

  return res.status(200).json({
    success: true,
    message: "Fund updated successfully",
  });
});

// Fund : Delete
export const deleteFund = tryCatch(async (req, res, next) => {
  const fund = await Fund.findById(req.params.id);

  if (!fund) {
    return next({
      message: "This fund is not exist in the records",
    });
  }
  await Fund.deleteOne({ _id: fund._id });

  return res.status(200).json({
    success: true,
    message: "Fund deleted successfully",
  });
});

// Fund : Delete All
export const deleteAllFund = tryCatch(async (req, res, next) => {
  await Fund.deleteMany();

  return res.status(200).json({
    success: true,
    message: "All fund deleted successfully",
  });
});
