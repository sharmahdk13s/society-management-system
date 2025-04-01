import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Gender, Role } from "../constant/enum";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: [
        {
          validator: function (value) {
            // Email regex pattern
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            // Username regex pattern (only letters, numbers, and underscores)
            const usernameRegex = /^[a-zA-Z0-9]+$/;

            // The value must be either a valid email or a valid username
            return emailRegex.test(value) || usernameRegex.test(value);
          },
          message: "Please enter a valid email or username",
        },
      ],
      required: [true, "Email or Username required"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 10,
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
      unique: true,
    },
    role: {
      type: String,
      enum: Role,
      default: "user",
    },
    gender: {
      type: String,
      enum: Gender,
      required: [true, "Please add gender"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    is_house_owner: {
      type: Boolean,
      required: true,
    },
    description: {
      type: String,
    },
    profession: {
      type: String,
    },
    age: {
      type: Number,
    },
    total_members: {
      type: Number,
      default: 1,
    },
    total_tenants: {
      type: Number,
      default: 0,
    },
    public_key: {
      type: String,
    },
  },
  { timestamps: true, collection: "User" }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwt = function () {
  return jwt.sign({ user: this }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getRefreshToken = function () {
  return jwt.sign({ user: this.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });
};

export default mongoose.model("User", UserSchema);
