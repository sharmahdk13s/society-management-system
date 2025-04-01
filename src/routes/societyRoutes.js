import { Router as expressRouter } from "express";
import {
  addSociety,
  deleteAllSociety,
  deleteSociety,
  getSociety,
  updateSociety,
} from "../controller/SocietyController";
import { authenticate, authorize } from "../middleware/auth";
const societyRouter = expressRouter();

societyRouter.get("/:id?", authenticate, getSociety);

societyRouter.post(
  "/add",
  authenticate,
  authorize(["super_admin"]),
  addSociety
);

societyRouter.put(
  "/update/:id",
  authenticate,
  authorize(["super_admin"]),
  updateSociety
);

societyRouter.delete(
  "/delete/:id",
  authenticate,
  authorize(["super_admin"]),
  deleteSociety
);

societyRouter.delete(
  "/delete-all",
  authenticate,
  authorize(["super_admin"]),
  deleteAllSociety
);

export default societyRouter;
