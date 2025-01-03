const Form = require("../models/formModel");

exports.createForm = async (req, res) => {
  const { title } = req.body;
  try {
    const form = await Form.create({ title,  owner: req.user.id });
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: "Error creating form" });
  }
};

exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find({ owner: req.user.id });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching forms" });
  }
};

exports.deleteForm = async (req, res) => {
 
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting form" });
  }
};

exports.submitResponse = async (req, res) => {
  const { name, email, answers } = req.body;
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    form.responses.push({ name, email, answers });
    await form.save();
    res.status(201).json({ message: "Response submitted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error submitting response" });
  }
};

exports.getResponses = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).select("responses");
    res.json(form.responses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching responses" });
  }
};
