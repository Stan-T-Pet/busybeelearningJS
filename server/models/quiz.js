const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  course: { type: String, required: true },
  questions: [
    {
      text: String,
      options: [
        { text: String, isCorrect: Boolean },
      ],
    },
  ],
});

module.exports = mongoose.model('Quiz', QuizSchema);
