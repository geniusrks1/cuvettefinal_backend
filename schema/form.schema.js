const mongoose = require("mongoose");


const FormSchema = new mongoose.Schema({
    title: { type: String, required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    background: { type: String },
    submissions: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        data: { type: Object, required: true },
      },
    ],
  });


const Form = mongoose.model("Form", FormSchema);

module.exports = { Form };