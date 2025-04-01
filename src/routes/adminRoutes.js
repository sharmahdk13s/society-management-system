import { Router as expressRouter } from "express";
import {
  // Announcements Apis
  addAnnouncement,
  updateAnnouncement,
  deleteAllAnnouncement,
  deleteAnnouncement,

  // Notice Apis
  addNotice,
  updateNotice,
  deleteNotice,
  deleteAllNotice,
  addFund,
  updateFund,
  deleteFund,
  deleteAllFund,
} from "../controller/AdminController";
import { authenticate, authorize } from "../middleware/auth";
import { clearCollections, deleteDatabase } from "../utils/ClearDatabase";
const adminRouter = expressRouter();

// Announcement : Add, Update, Delete
adminRouter.post(
  "/announcement/add",
  authenticate,
  authorize(["super_admin", "admin"]),
  addAnnouncement
);

adminRouter.put(
  "/announcement/update/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  updateAnnouncement
);

adminRouter.delete(
  "/announcement/delete/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  deleteAnnouncement
);

adminRouter.delete(
  "/announcement/delete-all",
  authenticate,
  authorize(["super_admin", "admin"]),
  deleteAllAnnouncement
);

//////// ************ //////////

// Notice: Add, Update, Delete
adminRouter.post(
  "/notice/add",
  authenticate,
  authorize(["super_admin", "admin"]),
  addNotice
);

adminRouter.put(
  "/notice/update/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  updateNotice
);

adminRouter.delete(
  "/notice/delete/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  deleteNotice
);

adminRouter.delete(
  "/notice/delete-all",
  authenticate,
  authorize(["super_admin", "admin"]),
  deleteAllNotice
);

//////// ************ //////////

// Fund: Add, Update, Delete
adminRouter.post(
  "/fund/add",
  authenticate,
  authorize(["super_admin", "admin"]),
  addFund
);

adminRouter.put(
  "/fund/update/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  updateFund
);

adminRouter.delete(
  "/fund/delete/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  deleteFund
);

adminRouter.delete(
  "/fund/delete-all",
  authenticate,
  authorize(["super_admin", "admin"]),
  deleteAllFund
);

//////// ************ //////////

// Clear all database table records
adminRouter.delete(
  "/clear",
  authenticate,
  authorize(["super_admin", "admin"]),
  clearCollections
);

// Delete or Drop database
adminRouter.delete(
  "/delete-all",
  authenticate,
  authorize(["super_admin"]),
  deleteDatabase
);

export default adminRouter;
