const express = require("express");
const { createForm, getForms, deleteForm, submitResponse, getResponses } = require("../controllers/formController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createForm);
router.get("/", authMiddleware, getForms);
router.delete("/:id", authMiddleware, deleteForm);
router.post("/:id/response", submitResponse);
router.get("/:id/responses", authMiddleware, getResponses);

module.exports = router;
