import { generateText } from "../config/googleai.js";
import fs from "fs";
import path from "path";
import AssignmentRecords from "../models/AssignmentRecords.js";

export const generateAssignment = async (req, res) => {
    try {
        console.log('AI Generation Request - Params:', req.params);
        console.log('AI Generation Request - Body:', req.body);
        console.log('AI Generation Request - User:', req.user);
        
        const { assignmentId } = req.params;
        const { portions, count = 5 } = req.body;

        // Get the assignment details
        const assignment = await AssignmentRecords.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }

        console.log('Found assignment:', assignment);

        // Read the uploaded file if it exists
        let fileContent = '';
        if (assignment.fileUrl) {
            try {
                // Handle different path formats
                let filePath = assignment.fileUrl;
                
                // If path starts with /uploads/, it's a relative path from the uploads directory
                if (filePath.startsWith('/uploads/')) {
                    filePath = path.join(process.cwd(), filePath);
                } else if (!path.isAbsolute(filePath)) {
                    // If it's a relative path without leading slash
                    filePath = path.join(process.cwd(), filePath);
                }
                
                console.log('📁 Attempting to read file from:', filePath);
                console.log('📁 File exists check:', fs.existsSync(filePath));
                
                if (fs.existsSync(filePath)) {
                    fileContent = fs.readFileSync(filePath, 'utf-8');
                    console.log('✅ File content length:', fileContent.length);
                    console.log('📄 File preview:', fileContent.substring(0, 200) + '...');
                } else {
                    console.warn('⚠️ File does not exist at path:', filePath);
                    
                    // Try alternative path formats
                    const altPaths = [
                        path.join(process.cwd(), 'uploads', 'teachers', path.basename(filePath)),
                        path.join(process.cwd(), filePath.replace('/uploads/', 'uploads/')),
                        path.join(process.cwd(), filePath.replace(/^\//, ''))
                    ];
                    
                    for (const altPath of altPaths) {
                        console.log('🔍 Trying alternative path:', altPath);
                        if (fs.existsSync(altPath)) {
                            fileContent = fs.readFileSync(altPath, 'utf-8');
                            console.log('✅ File found at alternative path:', altPath);
                            console.log('✅ File content length:', fileContent.length);
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error("❌ Error reading file:", error);
                console.error("❌ File path attempted:", assignment.fileUrl);
                // Don't fail completely if file can't be read, just continue without it
                fileContent = '';
            }
        } else {
            console.log('📄 No file URL found in assignment');
        }

        const numberOfQuestions = count || 5;
        // Prepare the prompt
        const prompt = `
        Create ${numberOfQuestions} assignments based on the following details:
        
        Topic/Portions: ${portions || "Not specified"}
        Instructions: ${assignment.instructions || "No additional instructions provided"}
        Syllabus: ${assignment.syllabus || "No syllabus provided"}
        ${fileContent ? `\nDocument Content:\n${fileContent.substring(0, 10000)}` : ''}
        
        Generate the assignments in JSON format with the following structure:
        {
            "assignments": [
                {
                    "question": "Question text",
                    "type": "short_answer/multiple_choice/essay/etc",
                    "points": 5,
                    "difficulty": "easy/medium/hard",
                    "hint": "Optional hint"
                }
            ]
        }
        
        Only provide the JSON output, no additional text.
        `;

        // Generate the assignments using Gemini
        const generatedContent = await generateText(prompt);

        // Try to parse the JSON response
        try {
            const assignments = JSON.parse(generatedContent);
            return res.status(200).json({
                success: true,
                data: assignments
            });
        } catch (error) {
            console.error("Error parsing AI response:", error);
            return res.status(500).json({
                success: false,
                message: "Error parsing AI response",
                rawResponse: generatedContent
            });
        }
    } catch (error) {
        console.error("Error generating assignment:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to generate assignment"
        });
    }
};
