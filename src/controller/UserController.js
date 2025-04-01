import jwt from "jsonwebtoken";
import User from "../models/User";
import tryCatch from "../utils/tryCatch";
import crypto from "crypto";

// Get user by id or all users
export const getUsers = tryCatch(async (req, res) => {
  const users = req.params.id
    ? await User.findById(req.params.id)
    : await User.find();
  res.status(200).json({ data: users });
});

// Refresh token for user
export const refreshToken = tryCatch((req, res) => {
  const currentRefreshToken = req?.body?.refreshToken;
  if (currentRefreshToken) {
    // Verifying refresh token
    jwt.verify(
      currentRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          // Wrong Refresh Token
          return res
            .status(401)
            .json({ message: "Unauthorized, Token expired" });
        } else {
          let userId = decoded.user;
          const user = await User.findById(userId);
          const token = user.getSignedJwt();
          const refreshToken = user.getRefreshToken();

          const decode = jwt.verify(token, process.env.JWT_SECRET);

          return res.status(201).json({
            success: true,
            token,
            refreshToken,
            expiredAt: decode.exp,
          });
        }
      }
    );
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

// Register new user
export const register = tryCatch(async (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    address,
    gender,
    is_house_owner,
    description,
    profession,
    age,
    total_members,
    total_tenants,
  } = req.body;

  const existUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { phone }],
  });

  if (existUser) {
    return next({
      message: "User already exist.",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    address,
    gender,
    is_house_owner,
    description,
    profession,
    age,
    total_members,
    total_tenants,
  });

  const token = user.getSignedJwt();
  const refreshToken = user.getRefreshToken();

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  res.status(201).json({
    success: true,
    token,
    refreshToken,
    userId: user.id,
    expiredAt: decode.exp,
  });
});

// Login registered user
export const login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next({
      message: "Please provide valid email and password.",
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    return next({
      message: "User not found.",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(200).json({
      success: false,
      message: "Invalid Credentials",
    });
  }

  const token = user.getSignedJwt();

  const refreshToken = user.getRefreshToken();

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  return res.status(200).json({
    success: true,
    token,
    refreshToken,
    userId: user._id,
    expiredAt: decode.exp,
  });
});

// Add bio-metrics to registered user
export const addBiometrics = tryCatch(async (req, res, next) => {
  const { publicKey, userId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: userId },
    { $set: { public_key: publicKey } }
  );
  if (!user) {
    return next({
      message: "User not found.",
    });
  }
  user.save();
  return res.status(200).json({
    success: true,
    message: "public key updated successfully",
  });
});

// Verify-Biometrics of registered user
export const verifyBiometrics = tryCatch(async (req, res, next) => {
  const { signature, payload } = req.body;
  const userId = payload.split("__")[0];

  const user = await User.findOne({ email: userId }).select("+public_key");
  console.log("user...", user);
  if (!user) {
    return next({
      message: "User not found.",
    });
  }

  // this is the public key that was saved earlier
  const { publicKey } = user;

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(payload);

  const isVerified = verifier.verify(
    `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
    signature,
    "base64"
  );

  if (!isVerified) {
    return res.status(400).json({
      status: "failed",
      message: "Unfortunately we could not verify your Face ID authentication",
    });
  }

  return res.status(200).json({
    status: true,
  });
});

// Delete user by Id
export const deleteUser = tryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next({
      message: "This member is not exist in the records",
    });
  }

  await User.deleteOne({ _id: user._id });

  return res.status(200).json({
    success: true,
    message: "Member deleted successfully",
  });
});

// Delete all users
export const deleteAllUsers = tryCatch(async (req, res, next) => {
  await User.deleteMany();

  return res.status(200).json({
    success: true,
    message: "All Users are deleted successfully",
  });
});
