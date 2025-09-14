const { mongodb } = require("./config/mongodb");

require("dotenv").config();
mongodb();
require("./config/cron");
const express = require("express");
const cors = require("cors");
const auth = require("./middlewares/auth");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", auth, require("./router"));

app.listen(8080, () => {
  console.log(`Server http://localhost:8080/api/v1 da ishga tushdi`);
});
