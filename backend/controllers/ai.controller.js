// backend/controllers/ai.controller.js

const asyncHandler = require("../middlewares/asyncHandler.middleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { BadRequestException } = require("../utils/appError");

// Initialize the AI model from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * @desc    Generate a task description using AI
 * @route   POST /api/ai/generate-task-description
 * @access  Private (Authenticated users)
 */
const generateTaskDescriptionController = asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title) {
        throw new BadRequestException("Task title is required.");
    }

    const prompt = `
      You are an expert project manager. Based on the task title: "${title}", generate a detailed and actionable task description in markdown format.
      The description should include:
      1. A brief, one-sentence overview of the task's goal.
      2. A "Key Objectives" or "Sub-Tasks" section with a checklist of 3-5 specific, actionable items.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const description = response.text();

    res.status(200).json({
        message: "Description generated successfully",
        description,
    });
});

module.exports = {
    generateTaskDescriptionController,
};