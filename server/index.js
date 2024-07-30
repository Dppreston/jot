const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/jot-users-router.tsx");
const postsRouter = require("./routes/jot-post-router.tsx");
const commentsRouter = require("./routes/jot-comments-router.tsx");
const sensitiveRouter = require("./routes/jot-sensitive-router.tsx");
const preferencesRouter = require("./routes/jot-preferences-router.tsx");
const messagesRouter = require("./routes/jot-messages-router.tsx");
const reportsRouter = require("../server/routes/jot-reports-router.tsx");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv/config");

const app = express();

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.text({ limit: "200mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSucessStatus: 200,
};
app.use(cors(corsOptions));
app.use(
  "/",
  usersRouter,
  postsRouter,
  sensitiveRouter,
  commentsRouter,
  preferencesRouter,
  messagesRouter,
  reportsRouter
);

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  secure: true,
  api_key: process.env.CLOUD__API,
  api_secret: process.env.CLOUD__SECRET,
});

mongoose
  .connect(process.env.URI)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 1000;
const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
