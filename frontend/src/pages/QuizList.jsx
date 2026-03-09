import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, Calendar, ArrowRight, PlayCircle } from 'lucide-react';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/quizzes');
        setQuizzes(res.data);
      } catch (err) {
        setError('Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center w-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 w-full py-12">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center shadow-sm">
          <p className="font-bold text-lg mb-2">Oops! Something went wrong.</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Explore <span className="text-primary-600">Quizzes</span></h1>
          <p className="text-lg text-gray-500 max-w-2xl">Discover and challenge yourself with our growing collection of diverse topics. Are you ready?</p>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border-2 border-dashed border-gray-200 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Quizzes Found</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">It looks like the administrators haven't created any quizzes yet. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz, index) => (
            <div key={quiz._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-1">
              <div className={`h-40 p-6 flex items-end relative overflow-hidden bg-gradient-to-br ${
                index % 3 === 0 ? 'from-primary-500 to-indigo-600' : 
                index % 3 === 1 ? 'from-emerald-400 to-teal-600' : 
                'from-violet-500 to-purple-700'
              }`}>
                {/* Abstract shape */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute left-0 bottom-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-5 -mb-5"></div>
                
                <h2 className="text-2xl font-bold text-white relative z-10 leading-tight line-clamp-2">
                  {quiz.title}
                </h2>
              </div>
              
              <div className="p-6 flex-1 flex flex-col relative">
                <div className="absolute top-0 right-6 -mt-8 bg-white text-gray-900 w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center border border-gray-100 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <PlayCircle className="w-8 h-8 text-primary-500" />
                </div>

                <p className="text-gray-600 flex-1 mb-6 mt-4 line-clamp-3 leading-relaxed">
                  {quiz.description || "Test your knowledge on this topic and see how well you score!"}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <Link 
                    to={`/quizzes/${quiz._id}`}
                    className="inline-flex items-center gap-1 font-bold text-primary-600 hover:text-primary-700 hover:gap-2 transition-all p-2 rounded-lg hover:bg-primary-50"
                  >
                    Start Quiz <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
