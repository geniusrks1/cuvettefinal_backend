const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      question: { type: String},
      type: { type: String },
      options: [{ type: String }],
    },
  ],
  responses: [
    {
      name: { type: String },
      email: { type: String},
      answers: [{ type: String }], 
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Form", formSchema);
