// backend/routes/ai.routes.js

const express = require("express");
const router = express.Router();
const {
    generateTaskDescriptionController,
} = require("../controllers/ai.controller");


// The endpoint will be POST /api/ai/generate-task-description
// We protect it with authGuard to ensure only logged-in users can use it.
router.post(
    "/generate-task-description",
    generateTaskDescriptionController
);

module.exports = router;