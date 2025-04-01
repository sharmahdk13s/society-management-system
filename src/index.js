import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import { errorHandler, notFound } from "./middleware/middlewares";
import adminRoutes from "./routes/adminRoutes";
import allotmentRoutes from "./routes/allotmentRoutes";
import commonRoutes from "./routes/commonRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import houseRoutes from "./routes/houseRoutes";
import maintenanceRoutes from "./routes/maintenanceRoutes";
import societyRoutes from "./routes/societyRoutes";
import userRoutes from "./routes/userRoutes";
import visitorRoutes from "./routes/visitorRoutes";

dotenv.config();
const port = process.env.PORT || 4000;

const startServer = async () => {
  const app = express();

  await mongoose.connect(process.env.MONGO_URI);

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get("/", (req, res) => {
    res.json({
      message: "Hello World",
    });
  });

  app.use("/", commonRoutes);
  app.use("/admin", adminRoutes);
  app.use("/allotment", allotmentRoutes);
  app.use("/house", houseRoutes);
  app.use("/society", societyRoutes);
  app.use("/maintenance", maintenanceRoutes);
  app.use("/member", userRoutes);
  app.use("/visitor", visitorRoutes);
  app.use("/complaint", complaintRoutes);

  app.listen({ port }, () =>
    console.log(`🚀 Server ready at http://localhost:${port}`)
  );

  app.use(notFound);
  app.use(errorHandler);
};

startServer();
