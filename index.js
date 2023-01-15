const express = require("express");
const app = express();
const session = require("cookie-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const UserRoutes = require("./routes/UserRoutes");
const TaskRoutes = require("./routes/TaskRoutes");
const ThreadRoutes = require("./routes/ThreadRoutes");

const PORT = process.env.PORT || 3001;

dotenv.config();
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database (test) connected successfully");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    domain: "taskysocialnetwork.netlify.app",
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  },
};
app.use(session(sessionConfig));
app.set("trust proxy", 1);

app.use(
  cors({
    httpsOnly: false,
    origin: "https://taskysocialnetwork.netlify.app",
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}.`);
});

app.use("/users", UserRoutes);
app.use("/tasks", TaskRoutes);
app.use("/threads", ThreadRoutes);

app.get("/", (req, res) => {
  res.send("Tasky Backend Running");
});

module.exports = app;
