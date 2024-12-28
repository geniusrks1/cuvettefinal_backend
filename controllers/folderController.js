const Folder = require("../models/folderModel");

exports.createFolder = async (req, res) => {
  const { name } = req.body;
  try {
    const folder = await Folder.create({ name, owner: req.user.id });
    res.status(201).json(folder);
  } catch (error) {
    res.status(400).json({ message: "Error creating folder" });
  }
};

exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user.id }).populate("forms");
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching folders" });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    await Folder.findByIdAndDelete(req.params.id);
    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting folder" });
  }
};
