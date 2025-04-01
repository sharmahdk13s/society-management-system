import { Router as expressRouter } from "express";
import {
  getMaintenance,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
  deleteAllMaintenance,
} from "../controller/MaintenanceController";
import { authenticate, authorize } from "../middleware/auth";
const maintenanceRouter = expressRouter();

maintenanceRouter.get("/:id?", authenticate, getMaintenance);

maintenanceRouter.post(
  "/add",
  authenticate,
  authorize(["super_admin", "admin"]),
  addMaintenance
);

maintenanceRouter.put(
  "/update/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  updateMaintenance
);

maintenanceRouter.delete(
  "/delete/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  deleteMaintenance
);

maintenanceRouter.delete(
  "/delete-all",
  authenticate,
  authorize(["super_admin"]),
  deleteAllMaintenance
);

export default maintenanceRouter;
