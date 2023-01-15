const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipients: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    dateCreated: { type: Date, required: true, default: Date.now },
    dateDue: { type: Date, default: null },
    completed: { type: Boolean, default: false },
    message: {
      type: String,
      maxLength: 100,
      default: null,
    },
    taskDescription: {
      type: String,
      maxLength: 80,
      required: true,
      default: `New Task (created ${new Date().toDateString()})`,
    },
    subTasks: [
      {
        description: { type: String },
        completed: { type: Boolean, default: false },
        index: { type: Number, min: 0 },
      },
    ],
  },
  { minimize: false }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
