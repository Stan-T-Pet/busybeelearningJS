// server/services/lessonService.js
import Lesson from "../models/Lesson.js";

export const createLesson = async (lessonData) => {
  const lesson = new Lesson({
    ...lessonData,
    courseId: lessonData.courseId || null, // ✅ link to course
  });
  return await lesson.save();
};

export const getLessonById = async (lessonId) => {
  return await Lesson.findById(lessonId).populate("courseId");
};

export const getLessonsByCourse = async (courseId) => {
  return await Lesson.find({ courseId });
};

export const getAllLessons = async () => {
  return await Lesson.find();
};
