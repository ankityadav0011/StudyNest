const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  courses: [  // Corrected from "course" to "courses" as an array
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);  // Correct model name
