const express = require("express");
const secure = require("dotenv");
const bodyParser = require("body-parser");
secure.config({ path: "./.env" });
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
// ? DataBase

require("./db/conn");
app.use(cors());
app.use(bodyParser.json());
// ? Schema

const MF = require("./models/Schema");

app.get("/", (req, res) => {
  res.send("hello");
});
app.post("/findUserTasks", async (req, res) => {
  try {
    const { email } = req.body;
    if (req.body.email == "") {
      throw Error("Email is mandatory");
    } else {
      const data = await MF.find({ email });
      if (data.length) {
        const result = data[0];
        res.send({
          tasks: result.tasks,
          status: true,
        });
      } else {
        throw Error("User Not Found");
      }
    }
  } catch (e) {
    res.send({
      message: e.message,
      status: false,
    });
  }
});
app.post("/storeData", async (req, res) => {
  try {
    if (req.body.email == "") {
      throw Error("Email is mandatory");
    } else {
      const { email, tasks } = req.body;
      const data = await MF.find({ email });
      if (data.length) {
        const updateData = await MF.updateOne({ email }, { tasks });
        console.log(updateData);
        res.send({
          message: "Tasks are Updated",
          status: true,
        });
      } else {
        throw Error("User Not Found");
      }
    }
  } catch (e) {
    res.send({
      message: e.message,
      status: false,
    });
  }
});
app.post("/login", async (req, res) => {
  try {
    if (req.body.email == "" || req.body.password === "") {
      throw Error("Email and Password are mandatory, and @ for Email");
    } else {
      const { email, password } = req.body;
      const data = await MF.find({ email, password });
      if (data.length) {
        const result = data[0];
        res.send({
          email: result.email,
          loggedIn: true,
          tasks: result.tasks,
        });
      } else {
        throw Error("User DoesNot Exist");
      }
    }
  } catch (e) {
    res.send({
      loggedIn: false,
      message: e.message,
    });
  }
});
app.post("/sigin", async (req, res) => {
  try {
    if (
      req.body.email === "" ||
      req.body.password === "" ||
      !(req.body.email || "").includes("@")
    ) {
      throw Error("Email and Password are mandatory");
    } else {
      const { email, password } = req.body;
      const data = await MF.find({ email });
      if (data.length) {
        throw Error("User Already Exist");
      }
      const Schema = new MF({
        email,
        password,
        tasks: [],
      });
      const result = await Schema.save();
      if (result) {
        res.send({
          email: result.email,
          loggedIn: true,
        });
      } else {
        throw Error("Internal Error");
      }
    }
  } catch (e) {
    res.send({
      loggedIn: false,
      message: e.message,
    });
  }
});

app.listen(port, () => {
  console.log(`app listing on ${port}`);
});
