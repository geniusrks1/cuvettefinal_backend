const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      question: { type: String, required: true },
      type: { type: String, required: true },
      options: [{ type: String }],
    },
  ],
  responses: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      answers: [{ type: String }], 
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Form", formSchema);
