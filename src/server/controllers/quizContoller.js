const Quiz = require('../models/Quiz');

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ course: req.params.course });
    res.json(quiz);
  } catch (error) {
    res.status(500).send('Error fetching quiz');
  }
};
