import { Router as expressRouter } from "express";
import {
  getAnnouncement,
  getFund,
  getNotice,
} from "../controller/CommonController";
import { authenticate } from "../middleware/auth";
const commonRouter = expressRouter();

commonRouter.get("/announcement/:id?", authenticate, getAnnouncement);
commonRouter.get("/notice/:id?", authenticate, getNotice);
commonRouter.get("/fund/:id?", authenticate, getFund);

export default commonRouter;
