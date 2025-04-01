import Announcement from "../models/Announcement";
import Fund from "../models/Fund";
import Notice from "../models/Notice";
import tryCatch from "../utils/tryCatch";

// Announcement : GET
export const getAnnouncement = tryCatch(async (req, res) => {
  const announcement = req.params.id
    ? await Announcement.findById(req.params.id)
    : await Announcement.find();
  res.status(200).json({ data: announcement });
});

// Notice : GET
export const getNotice = tryCatch(async (req, res) => {
  const notice = req.params.id
    ? await Notice.findOne({ _id: req.params.id })
    : await Notice.find();
  res.status(200).json({ data: notice });
});

// Fund : GET
export const getFund = tryCatch(async (req, res) => {
  const fund = req.params.id
    ? await Fund.findOne({ _id: req.params.id })
    : await Fund.find();
  res.status(200).json({ data: fund });
});
