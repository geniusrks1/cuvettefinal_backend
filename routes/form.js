const express = require("express");
const protectedMiddleware = require("../middleware/auth");
const router = express.Router();


router.post('/', protectedMiddleware, async (req, res) => {
    const { title, folderId, background } = req.body;
    try {
      const form = new Form({ title, folderId, userId: req.user.id, background });
      await form.save();
      res.status(201).json(form);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
  router.put('/:id', protectedMiddleware, async (req, res) => {
    const { title, background } = req.body;
    try {
      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { title, background },
        { new: true }
      );
      if (!form) return res.status(404).json({ message: 'Form not found' });
      res.status(200).json(form);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
  router.delete('/:id', protectedMiddleware, async (req, res) => {
    try {
      await Form.deleteOne({ _id: req.params.id, userId: req.user.id });
      res.status(200).json({ message: 'Form deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
  router.get('/:id/submissions', protectedMiddleware, async (req, res) => {
    try {
      const form = await Form.findOne({ _id: req.params.id, userId: req.user.id });
      if (!form) return res.status(404).json({ message: 'Form not found' });
      res.status(200).json(form.submissions);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  module.exports = router;