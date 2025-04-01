import { Router as expressRouter } from "express";
import {
  addAllotment,
  deleteAllotment,
  deleteAllAllotment,
  getAllotment,
  updateAllotment,
} from "../controller/AllotmentController";
import { authenticate, authorize } from "../middleware/auth";
const allotmentRouter = expressRouter();

allotmentRouter.get("/:id?", authenticate, getAllotment);

allotmentRouter.post(
  "/add",
  authenticate,
  authorize(["super_admin", "admin"]),
  addAllotment
);

allotmentRouter.put(
  "/update/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  updateAllotment
);

allotmentRouter.delete(
  "/delete/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  deleteAllotment
);

allotmentRouter.delete(
  "/delete-all",
  authenticate,
  authorize(["super_admin"]),
  deleteAllAllotment
);

export default allotmentRouter;
