// Folder Routes
const express = require("express");
const protectedMiddleware = require("../middleware/auth");
const router = express.Router();


router.post('/', protectedMiddleware, async (req, res) => {
    const { name } = req.body;
    try {
      const folder = new Folder({ name, userId: req.user.id });
      await folder.save();
      res.status(201).json(folder);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
  router.delete('/:id', protectedMiddleware, async (req, res) => {
    try {
      await Folder.deleteOne({ _id: req.params.id, userId: req.user.id });
      res.status(200).json({ message: 'Folder deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  module.exports = router;