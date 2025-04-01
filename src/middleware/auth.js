import jwt from "jsonwebtoken";
import tryCatch from "../utils/tryCatch";
import User from "../models/User";

const authenticate = tryCatch(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Token not available." });
    // return next({
    //   message: "Unauthorized. Token not available.",
    // });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode.user;
    const user = await User.findById(req.user._id);
    if (user) {
      next();
    } else {
      throw "Unauthorized";
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Error while verifying the token" });
    // return next({
    //   message: "Unauthorized. Error while verifying the token",
    // });
  }
});

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(401)
      .json({ message: "Unauthorized to access this route" });
    // return next({
    //   message: "Unauthorized to access this route",
    // });
  }
  next();
};

export { authenticate, authorize };
