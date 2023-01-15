const express = require("express");
const router = express.Router({ mergeParams: true });
const Thread = require("../models/Thread");

const { sendNotification_message } = require("../Middleware");

// find thread by threadID and return if userID is in "parties"
// used from Messages.js to open a thread already known to exist.
router.post("/findByThreadID", async (req, res) => {
  const { userID, threadID } = req.body;
  const thread = await Thread.findOne({
    _id: threadID,
    parties: userID,
  }).populate("parties");
  if (thread) {
    res.send(thread);
  } else {
    console.log("thread not found (from findByThreadID)");
    res.status(404);
  }
});

// used in Profile.js to find thread by userID and profileID.
// if none is found, a new thread is created and sent back
router.post("/findByProfileID", async (req, res) => {
  const { userID, profileID } = req.body;
  let thread = await Thread.findOne({
    parties: [userID, profileID],
  });

  if (!thread) {
    thread = new Thread({ parties: [userID, profileID], messages: [] });
    await thread.save();
  }

  res.send(thread);
});

// used in MessageConsole.js to find thread by userID and threadID
// if userID is in parties, append message to thread.messages and return thread
router.post("/newMessage", sendNotification_message, async (req, res) => {
  const { userID, threadID, messageObj } = req.body;
  const thread = await Thread.findOne({
    _id: threadID,
    parties: userID,
  }).populate("parties");
  if (thread) {
    thread.messages.push(messageObj);
    await thread.save();
    res.status(200).send(thread);
  } else {
    res.status(404);
  }
});

// used in Messages.js to return all threads user is part of
// i.e. all threads where userID is in "parties"
router.post("/", async (req, res) => {
  const threads = await Thread.find({ parties: req.body.userID }).populate(
    "parties"
  );
  res.send(threads);
});

router.post("/delete", async (req, res) => {
  const { userID, threadID } = req.body;
  const thread = await Thread.findOneAndDelete({
    _id: threadID,
    parties: userID,
  }).populate("parties");
  if (thread) {
    res.send(thread);
  } else {
    res.status(404);
  }
});

module.exports = router;
