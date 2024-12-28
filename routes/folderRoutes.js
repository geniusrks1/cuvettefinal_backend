const express = require("express");
const { createFolder, getFolders, deleteFolder } = require("../controllers/folderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getFolders);
router.delete("/:id", authMiddleware, deleteFolder);

module.exports = router;
