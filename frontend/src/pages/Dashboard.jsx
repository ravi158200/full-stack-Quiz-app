import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Trophy, Clock, Medal, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const totalQuizzes = user.scores?.length || 0;
  const avgScore = totalQuizzes > 0 
    ? Math.round(user.scores.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / totalQuizzes)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, {user.username}! 👋</h1>
          <p className="text-gray-500 text-lg">Here's a summary of your quiz journey so far.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Quizzes Taken</p>
            <p className="text-3xl font-bold text-gray-900">{totalQuizzes}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Medal className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Average Score</p>
            <p className="text-3xl font-bold text-gray-900">{avgScore}%</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-primary-500" /> Recent Activity
      </h2>
      
      {user.scores && user.scores.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {[...user.scores].reverse().map((score, index) => {
              const quizName = score.quizId ? score.quizId.title : 'Deleted Quiz';
              const date = new Date(score.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              });
              const percentage = Math.round((score.score / score.total) * 100);
              
              let badgeColor = 'bg-gray-100 text-gray-800';
              if (percentage >= 80) badgeColor = 'bg-green-100 text-green-800';
              else if (percentage >= 50) badgeColor = 'bg-yellow-100 text-yellow-800';
              else badgeColor = 'bg-red-100 text-red-800';

              return (
                <li key={index} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">{quizName}</h3>
                      <p className="text-sm text-gray-500">{date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 font-medium">Score</p>
                      <p className="text-lg font-bold text-gray-900">{score.score} / {score.total}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${badgeColor}`}>
                      {percentage}%
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Quizzes Taken Yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven't completed any quizzes. Explore our library and test your knowledge!</p>
          <Link to="/quizzes" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors">
            Browse Quizzes
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
