const mongoose = require("mongoose");

const ThreadSchema = new mongoose.Schema(
  {
    parties: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [
      {
        type: {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          content: { type: String, required: true },
          date: { type: Date, default: Date.now },
          status: { type: String },
        },
      },
    ],
  },
  { minimize: false }
);

const Thread = mongoose.model("Thread", ThreadSchema);

module.exports = Thread;
