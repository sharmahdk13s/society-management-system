import { Router as expressRouter } from "express";
import {
  addComplaint,
  deleteAllComplaint,
  deleteComplaint,
  getComplaint,
  updateComplaint,
} from "../controller/ComplaintController";
import { authenticate } from "../middleware/auth";
const complaintRouter = expressRouter();

complaintRouter.get("/:id?", authenticate, getComplaint);

complaintRouter.post("/add", authenticate, addComplaint);

complaintRouter.put("/update/:id", authenticate, updateComplaint);

complaintRouter.delete("/delete/:id", authenticate, deleteComplaint);

complaintRouter.delete("/delete/:id", authenticate, deleteAllComplaint);

export default complaintRouter;
