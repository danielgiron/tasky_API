const User = require("./models/User");
const Task = require("./models/Task");
const Thread = require("./models/Thread");

// triggered on successful task send. Recipient data is updated to have notification
// data added to their user data.
async function sendNotification_task(req, res, next) {
  const { owner, recipients, notificationMessage } = req.body;
  recipients.map(async (recipient) => {
    const userR = await User.findById(recipient);
    const userO = await User.findById(owner);
    if (userR && userO && userR.settings.taskNotifications) {
      userR.notifications.push({
        notificationMessage,
        date: Date.now(),
        from: { name: userO.name, id: userO._id },
        goTo: "/profile/" + userO._id,
      });
      await userR.save();
    }
  });
  next();
}

// triggered on successful message send. Recipient data is updated to have notification
// data added to their user data.
async function sendNotification_message(req, res, next) {
  const { userID, threadID, notificationMessage } = req.body;
  const thread = await Thread.findById(threadID).populate("parties");
  const recipients = thread.parties.filter((party) => {
    return party._id != userID;
  });
  recipients.map(async (recipient) => {
    const userR = await User.findById(recipient._id);
    const userO = await User.findById(userID);
    if (userR && userO && userR.settings.messageNotifications) {
      userR.notifications.push({
        notificationMessage,
        date: Date.now(),
        from: { name: userO.name, id: userO._id },
        goTo: "/messages/" + threadID,
      });
      await userR.save();
    }
  });

  next();
}

// triggered when contact is added (i.e. from profile or search bar)
async function sendNotification_contact(req, res, next) {
  const { userID, contactID, notificationMessage } = req.body;
  const recipient = await User.findById(contactID);
  const user = await User.findById(userID);

  if (
    recipient.settings.contactNotifications &&
    user?.contacts &&
    user.contacts.length > 0
  ) {
    if (
      !user.contacts.find((contact) => {
        return contact.id === contactID;
      })
    ) {
      recipient.notifications.push({
        notificationMessage,
        date: Date.now(),
        from: { name: user.name, id: user._id },
        goTo: "/profile/" + user._id,
      });
      await recipient.save();
    }
  }

  next();
}

module.exports = {
  sendNotification_task,
  sendNotification_message,
  sendNotification_contact,
};
