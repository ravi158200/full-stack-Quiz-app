import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2, Save, Send } from 'lucide-react';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validations
    if (!title) return setError('Title is required');
    for (let q of questions) {
      if (!q.questionText) return setError('All questions must have text');
      if (q.options.some((opt) => !opt)) return setError('All options must be filled');
      if (!q.correctAnswer) return setError('All questions must have a correct answer');
      if (!q.options.includes(q.correctAnswer)) return setError('Correct answer must match one of the options');
    }

    try {
      await axios.post('http://localhost:5000/api/quizzes', {
        title,
        description,
        questions
      });
      setMessage('Quiz created successfully!');
      setTitle('');
      setDescription('');
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shadow-inner">
            <PlusCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-none mb-2">Create New Quiz</h1>
            <p className="text-gray-500 font-medium">Design an engaging assessment for your users.</p>
          </div>
        </div>

        {message && <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6 text-green-700 font-medium relative z-10">{message}</div>}
        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6 text-red-700 font-medium relative z-10">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-500" /> Quiz Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow sm:text-sm bg-white"
                  placeholder="e.g. JavaScript Fundamentals"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow sm:text-sm bg-white min-h-[100px]"
                  placeholder="Briefly describe what this quiz is about..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="flex items-center justify-between text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
              Questions
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{questions.length} Total</span>
            </h2>
            
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white border-2 border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm hover:border-primary-100 transition-colors relative group">
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIndex)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                  title="Remove Question"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm">
                    {qIndex + 1}
                  </span>
                  Question Text
                </h3>
                
                <input
                  type="text"
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow sm:text-sm bg-gray-50 mb-6"
                  placeholder="What is the output of..."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex}>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Option {String.fromCharCode(65 + oIndex)}
                      </label>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
                        placeholder={`Option ${oIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <Save className="w-4 h-4 text-green-500" /> Correct Answer
                  </label>
                  <select
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow sm:text-sm bg-green-50 text-green-800 font-medium"
                  >
                    <option value="">Select the correct option</option>
                    {q.options.map((opt, oIndex) => (
                      opt && <option key={oIndex} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full sm:w-auto px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-bold rounded-xl hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" /> Add Question
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-md shadow-primary-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <Send className="w-5 h-5" /> Publish Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper icon
const BookOpen = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
)

export default Admin;
