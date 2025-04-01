import { Router as expressRouter } from "express";
import {
  addHouse,
  deleteAllHouse,
  deleteHouse,
  getHouse,
  updateHouse,
} from "../controller/HouseController";
import { authenticate, authorize } from "../middleware/auth";
const houseRouter = expressRouter();

houseRouter.get("/:id?", authenticate, getHouse);

houseRouter.post(
  "/add",
  authenticate,
  authorize(["super_admin", "admin"]),
  addHouse
);

houseRouter.put(
  "/update/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  updateHouse
);

houseRouter.delete(
  "/delete/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  deleteHouse
);

houseRouter.delete(
  "/delete-all",
  authenticate,
  authorize(["super_admin"]),
  deleteAllHouse
);

export default houseRouter;
