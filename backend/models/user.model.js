"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const httpStatus = require("http-status");
const APIError = require("../utils/APIError");
const Schema = mongoose.Schema;

const roles = ["customer", "employee"];

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 128,
    },
    fname: {
      type: String,
      maxlength: 50,
    },
    lname: {
      type: String,
      maxlength: 50,
    },
    role: {
      type: String,
      default: "customer",
      enum: roles,
    },
    address: {
      type: String,
      default: "",
      maxlength: 200,
    },
    phoneNumber: {
      type: String,
      default: "",
      maxlength: 50,
    },
    mileagePoints:{
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    this.password = bcrypt.hashSync(this.password);

    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "fname",
      "lname",
      "email",
      "createdAt",
      "role",
      "address",
      "phoneNumber",
      "mileagePoints",
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },

  passwordMatches(password) {
    return bcrypt.compareSync(password, this.password);
  },

  updateTransform() {
    const transformed = {};
    const fields = [
      "id",
      "fname",
      "lname",
      "email",
      "role",
      "address",
      "phoneNumber",
      "mileagePoints",
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
});

userSchema.statics = {
  roles,

  async checkDuplicateEmailError(value) {
    const user = await this.findOne({ email: value });
    if (user) {
      return Promise.reject("Email already taken");
    }
  },

  async findAndGenerateToken(payload) {
    const { email, password } = payload;
    if (!email) throw new APIError("Email must be provided for login");

    const user = await this.findOne({ email });
    if (!user)
      throw new APIError(
        `No user associated with ${email}`,
        httpStatus.NOT_FOUND
      );

    const passwordOK = await user.passwordMatches(password);
    if (!passwordOK)
      throw new APIError(`Password mismatch`, httpStatus.UNAUTHORIZED);

    return user;
  },
};

module.exports = mongoose.model("User", userSchema);
