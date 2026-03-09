import express from 'express';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all quizzes (only title and description, not answers)
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, 'title description createdAt');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
  }
});

// Get a specific quiz to take (without correct answers)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Remove correct answers before sending to user
    const sanitizedQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options
      }))
    };
    
    res.json(sanitizedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz', error: error.message });
  }
});

// Create a new quiz (Admin only)
router.post('/', [verifyToken, isAdmin], async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    
    const newQuiz = new Quiz({
      title,
      description,
      questions,
      createdBy: req.userId
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz', error: error.message });
  }
});

// Submit quiz answers and calculate score
router.post('/:id/submit', verifyToken, async (req, res) => {
  try {
    const { answers } = req.body; // { questionId: 'option' }
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    const total = quiz.questions.length;
    const feedback = [];

    quiz.questions.forEach(question => {
      const userAnswer = answers[question._id.toString()];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score++;
      
      feedback.push({
        questionId: question._id,
        questionText: question.questionText,
        userAnswer: userAnswer || null,
        correctAnswer: question.correctAnswer,
        isCorrect
      });
    });

    // Save score to user profile
    await User.findByIdAndUpdate(req.userId, {
      $push: {
        scores: {
          quizId: quiz._id,
          score,
          total
        }
      }
    });

    res.json({ score, total, feedback });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz', error: error.message });
  }
});

export default router;
