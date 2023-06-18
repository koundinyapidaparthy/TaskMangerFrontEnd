const mongoose = require("mongoose");
const createUserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  tasks: {
    type: [
      {
        completed: Boolean,
        task: String,
      },
    ],
  },
});

const MF = new mongoose.model("MF", createUserSchema);

module.exports = MF;
