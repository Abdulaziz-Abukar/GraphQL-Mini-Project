const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["Planned", "In Progress", "Completed"],
    default: "Planned",
  },
});

module.exports = mongoose.model("Skill", skillSchema);
