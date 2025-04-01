import { Router as expressRouter } from "express";
import {
  addVisitor,
  deleteAllVisitor,
  deleteVisitor,
  getVisitor,
  updateVisitor,
} from "../controller/VisitorController";
import { authenticate } from "../middleware/auth";
const visitorRouter = expressRouter();

visitorRouter.get("/:id?", authenticate, getVisitor);

visitorRouter.post("/add", authenticate, addVisitor);

visitorRouter.put("/update/:id", authenticate, updateVisitor);

visitorRouter.delete("/delete/:id", authenticate, deleteVisitor);

visitorRouter.delete("/delete-all", authenticate, deleteAllVisitor);

export default visitorRouter;
