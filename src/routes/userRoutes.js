import { Router as expressRouter } from "express";
import {
  addBiometrics,
  deleteAllUsers,
  deleteUser,
  getUsers,
  login,
  refreshToken,
  register,
  verifyBiometrics,
} from "../controller/UserController";
import { authenticate, authorize } from "../middleware/auth";
const userRouter = expressRouter();

userRouter.post("/register", register);
userRouter.post("/login", login);

userRouter.post("/verify-biometrics", authenticate, verifyBiometrics);
userRouter.post("/send-biometrics", authenticate, addBiometrics);

userRouter.post("/refreshToken", refreshToken);

userRouter.get("/:id?", authenticate, getUsers);

userRouter.delete(
  "/delete/:id",
  authenticate,
  authorize(["super_admin"]),
  deleteUser
);

userRouter.delete(
  "/delete-all",
  authenticate,
  authorize(["super_admin"]),
  deleteAllUsers
);

export default userRouter;
