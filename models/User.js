const mongoose = require("mongoose");
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true },
    bio: { type: String, default: "Welcome to my profile!" },
    dateJoined: { type: Date, default: Date.now },
    session: { type: String, default: "" },
    passwordHash: { type: String, default: "" },
    contacts: [{ type: Object, ref: "User" }],
    settings: {
      taskNotifications: { type: Boolean, default: true },
      contactNotifications: { type: Boolean, default: true },
      messageNotifications: { type: Boolean, default: true },
    },
    notifications: [
      {
        type: {
          notificationMessage: { type: String, required: true },
          date: { type: Date, default: Date.now },
          from: {
            type: {
              id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
              name: { type: String },
            },
          },
          goTo: { type: String, default: null },
        },
        default: [],
      },
    ],
  },
  { minimize: false }
);

// UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });
const User = mongoose.model("User", UserSchema);

module.exports = User;
