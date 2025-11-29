import express from "express";
import { generateText } from "../config/googleai.js";

const genAIRouter = express.Router();

// Generate text
genAIRouter.post("/generate-text", async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await generateText(prompt);
        res.json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate text" });
    }
});
export default genAIRouter;

