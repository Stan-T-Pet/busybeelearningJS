// server/services/lessonService.js
import Lesson from "../models/Lesson.js";

export async function createLesson(data) {
  const lesson = new Lesson(data);
  return await lesson.save();
}

export async function updateLesson(id, data) {
  return await Lesson.findByIdAndUpdate(id, data, { new: true });
}

export async function getLessonById(id) {
  return await Lesson.findById(id);
}

export async function getLessonsByCourse(courseId) {
  return await Lesson.find({ courseId });
}

export async function deleteLesson(id) {
  return await Lesson.findByIdAndDelete(id);
}