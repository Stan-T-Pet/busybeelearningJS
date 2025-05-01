// server/services/courseService.js
import Course from "../models/Course.js";

export const createCourse = async (courseData) => {
  const course = new Course({
    ...courseData,
    lessons: courseData.lessons || [],
    quizzes: courseData.quizzes || [], // new field
  });
  return await course.save();
};

export const getCourseWithContent = async (courseId) => {
  return await Course.findById(courseId)
    .populate("lessons")
    .populate("quizzes"); // populate quizzes
};

export const updateCourse = async (courseId, updates) => {
  return await Course.findByIdAndUpdate(courseId, updates, { new: true })
    .populate("lessons")
    .populate("quizzes");
};

export const getAllCourses = async () => {
  return await Course.find().populate("lessons").populate("quizzes");
};
