import connectDB from "../../../../server/config/database";
import Question from "../../../../server/models/Question";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
    await connectDB();
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }
    if (req.method === "GET") {
        try {
            const { lessonId } = req.query;
            const query = lessonId ? { lessonId } : {};
            const questions = await Question.find(query);
            return res.status(200).json({ questions });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    if (req.method === "POST") {
        try {
            const { questionText, correctAnswer, options, steps, lessonId } = req.body;
            const question = await Question.create({
                questionText,
                correctAnswer,
                options,
                steps,
                lessonId,
            });
            return res.status(201).json({ question });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    if (req.method === "DELETE") {
        try {
            const { questionId } = req.body;
            await Question.findByIdAndDelete(questionId);
            return res.status(204).end();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    if (req.method === "PUT") {
        try {
            const { questionId, questionText, correctAnswer, options, steps } = req.body;
            const question = await Question.findByIdAndUpdate(
                questionId,
                { questionText, correctAnswer, options, steps },
                { new: true }
            );
            return res.status(200).json({ question });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}