import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Trophy, ShieldCheck } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-primary-900/20 transition-all duration-300 group">
    <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium text-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>The ultimate trivia experience</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight">
            Challenge your mind, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-600">master every topic.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Test your knowledge across a growing collection of quizzes created by experts. Compete, learn, and track your progress in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/quizzes" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-1">
              Start Exploring
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              Create an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-24 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why choose QuizMaster?</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Designed for both casual learners and trivia enthusiasts.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Brain}
              title="Vast Question Bank"
              description="Access hundreds of carefully curated questions across dozens of categories."
            />
            <FeatureCard 
              icon={Trophy}
              title="Track Your Progress"
              description="Monitor your scores over time and earn achievements as you master new subjects."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Verified Content"
              description="All quizzes are created and verified by our dedicated community of administrators."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
