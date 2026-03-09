import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, ArrowRight, Play, Trophy, ChevronRight } from 'lucide-react';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizzes/${id}`);
        setQuiz(res.data);
      } catch (error) {
        setError('Failed to load quiz. ' + (error.response?.data?.message || ''));
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (questionId, option) => {
    if (isSubmitted) return;
    setAnswers({
      ...answers,
      [questionId]: option
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/quizzes/${id}/submit`, { answers });
      setResult(res.data);
      setIsSubmitted(true);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Failed to submit quiz.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center w-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 w-full py-12">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center shadow-sm">
          <p className="font-bold text-lg mb-2">Oops! Something went wrong.</p>
          <p>{error || 'Quiz not found'}</p>
        </div>
      </div>
    );
  }

  if (isSubmitted && result) {
    const percentage = Math.round((result.score / result.total) * 100);
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-12 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-inner">
              <Trophy className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Quiz Completed!</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl">You've successfully finished <span className="font-bold text-gray-800">{quiz.title}</span>.</p>
            
            <div className="bg-gray-50 px-8 py-6 rounded-2xl border border-gray-100 mb-8 inline-block shadow-sm">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Final Score</div>
              <div className="text-5xl font-black text-primary-600">
                {result.score} <span className="text-3xl text-gray-400">/ {result.total}</span>
              </div>
              <div className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-bold ${
                percentage >= 80 ? 'bg-green-100 text-green-800' :
                percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {percentage}% Correct
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2">Detailed Feedback</h2>
        <div className="space-y-6">
          {result.feedback.map((item, index) => (
            <div key={item.questionId} className={`p-6 sm:p-8 rounded-2xl border-2 transition-colors ${
              item.isCorrect ? 'bg-green-50/30 border-green-200' : 'bg-red-50/30 border-red-200'
            }`}>
              <div className="flex gap-4">
                <div className={`shrink-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {item.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-sm px-2 py-1 bg-white border border-gray-200 rounded min-w-[28px] text-center">{index + 1}</span>
                    {item.questionText}
                  </h3>
                  
                  <div className="grid gap-3 max-w-2xl">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-bold text-gray-500 w-24 shrink-0 uppercase tracking-wide">Your Answer</span>
                      <span className={`font-medium ${item.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {item.userAnswer || <span className="italic text-gray-400">None selected</span>}
                      </span>
                    </div>
                    {!item.isCorrect && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-bold text-gray-500 w-24 shrink-0 uppercase tracking-wide flex items-center gap-1">
                          Correct <CheckCircle2 className="w-3 h-3 text-green-500" />
                        </span>
                        <span className="font-bold text-green-700">{item.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-1"
          >
            Return to Dashboard <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = Math.round(((currentQuestionIndex) / quiz.questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full flex flex-col flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{quiz.title}</h1>
        <p className="text-gray-500 text-lg">{quiz.description}</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col flex-1">
        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-2">
          <div 
            className="bg-primary-500 h-2 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="p-8 sm:p-10 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-bold h-7 flex items-center border border-primary-100">
              {progress}%
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 leading-snug">
            {currentQuestion.questionText}
          </h2>

          <div className="grid gap-4 flex-1">
            {currentQuestion.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = answers[currentQuestion._id] === option;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(currentQuestion._id, option)}
                  className={`flex items-center w-full px-6 py-4 rounded-2xl border-2 text-left transition-all duration-200 group ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50 shadow-md transform scale-[1.01]' 
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0 transition-colors ${
                    isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600'
                  }`}>
                    {letter}
                  </span>
                  <span className={`font-medium sm:text-lg ${isSelected ? 'text-primary-900' : 'text-gray-700'}`}>
                    {option}
                  </span>
                  
                  {isSelected && (
                    <div className="ml-auto">
                      <CheckCircle2 className="w-6 h-6 text-primary-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 flex justify-between items-center bg-white z-10 sticky bottom-0">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="text-gray-500 hover:text-primary-600 font-bold px-4 py-2 disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            
            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion._id]}
                className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Next Question <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!answers[currentQuestion._id]}
                className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz <Play className="w-5 h-5 fill-current" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTake;
