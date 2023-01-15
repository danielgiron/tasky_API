const express = require("express");
const router = express.Router({ mergeParams: true });

const Task = require("../models/Task");

const { sendNotification_task } = require("../Middleware");

// Get all tasks (for testing purposes), not to be accessed by the user
router.get("/", async (req, res) => {
  const tasks = await Task.find({});
  if (tasks) {
    res.status(200).send(tasks);
  } else {
    res.status(404).send("No tasks found");
  }
});

// Find tasks owned by user using stored userID in browser
router.post("/userTasks", async (req, res) => {
  const userID = req.body.userID;
  const ownedTasks = await Task.find({ owner: userID })
    .populate("owner")
    .populate("recipients");

  const recievedTasks = await Task.find({ recipients: userID })
    .populate("owner")
    .populate("recipients"); // find tasks where user is in recipients array

  const selfTasks = ownedTasks.filter((task) => {
    return task.recipients.length === 0; // if no recipients(=[]), it's a self task
  });
  const sentTasks = ownedTasks.filter((task) => {
    return task.recipients.length > 0; // if recipients(!=[]), it's a sent task
  });

  const tasks = { selfTasks, sentTasks, recievedTasks };

  res.send(tasks);
});

// finds and returns tasks by id
router.get("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).send("Error: Task not found.");
  } else res.send(task);
});

// post new task, returns newly created task
router.post("/", sendNotification_task, async (req, res) => {
  const { owner, recipients, dateDue, taskDescription, message } = req.body;
  const newTask = new Task({
    owner,
    recipients,
    dateDue,
    taskDescription,
    message,
  });

  await newTask.save();
  const resObj = await Task.findById(newTask._id)
    .populate("owner")
    .populate("recipients");
  res.send(resObj);
});

// delete task by id, returns deleted task
router.delete("/:id", async (req, res) => {
  const taskID = req.params.id;
  const task = await Task.findByIdAndDelete(taskID);
  res.send(task);
});

// update task by id, return updated task. Not currently used.
router.put("/:id", async (req, res) => {
  const taskID = req.params.id;
  const task = await Task.findByIdAndUpdate(taskID, req.body);
  res.send(task);
});

module.exports = router;
