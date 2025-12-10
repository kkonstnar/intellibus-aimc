"use client";

import React, { useState } from 'react';

/**
 * QuizExample Component
 * 
 * This component serves as a reference for HTML quizzes to be embedded in an LMS.
 * It uses plain HTML-style markup with Tailwind classes matching the landing page aesthetic.
 * 
 * To use in LMS:
 * 1. Copy the HTML structure from the return statement
 * 2. Convert className to class
 * 3. Implement your own JavaScript for interactivity
 * 4. Add inline styles if the LMS doesn't support external CSS
 */

const QuizExample: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  // Quiz metadata
  const quizNumber = 1;
  const topic = "Machine Learning Fundamentals";
  const resources = [
    { title: "Lecture Slides: Introduction to ML", url: "/slides/intro-to-ml.pdf" },
    { title: "Reading: Supervised vs Unsupervised Learning", url: "/slides/supervised-unsupervised.pdf" },
    { title: "Additional Resource: Overfitting Explained", url: "/slides/overfitting.pdf" }
  ];

  const questions = [
    {
      id: 1,
      question: "What is the primary goal of machine learning?",
      options: [
        { id: 'a', text: 'To replace human intelligence entirely', correct: false },
        { id: 'b', text: 'To enable computers to learn from data without explicit programming', correct: true },
        { id: 'c', text: 'To create artificial consciousness', correct: false },
        { id: 'd', text: 'To automate all jobs', correct: false },
      ]
    },
    {
      id: 2,
      question: "Which of the following is an example of supervised learning?",
      options: [
        { id: 'a', text: 'Clustering similar customer profiles', correct: false },
        { id: 'b', text: 'Predicting house prices based on historical data', correct: true },
        { id: 'c', text: 'Discovering hidden patterns in data', correct: false },
        { id: 'd', text: 'Reducing dimensionality of datasets', correct: false },
      ]
    },
    {
      id: 3,
      question: "What does 'overfitting' mean in machine learning?",
      options: [
        { id: 'a', text: 'The model performs well on training data but poorly on new data', correct: true },
        { id: 'b', text: 'The model is too simple to capture patterns', correct: false },
        { id: 'c', text: 'The training process takes too long', correct: false },
        { id: 'd', text: 'The dataset is too large', correct: false },
      ]
    }
  ];

  const handleAnswerSelect = (questionId: number, answerId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      const selectedOption = q.options.find(opt => opt.id === selectedAnswers[q.id]);
      if (selectedOption?.correct) correct++;
    });
    return correct;
  };

  const score = showResults ? calculateScore() : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-nyu-light-violet-2 via-white to-purple-50 relative">
      {/* Textured Background Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Header */}
      <div className="bg-gradient-to-r from-nyu-purple to-purple-800 text-white py-8 px-4 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold mb-3">
            Quiz #{quizNumber}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">AI Masterclass Quiz</h1>
          <p className="text-purple-100 text-xl md:text-2xl font-light">{topic}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 relative z-10">
        
        {/* Resources Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-t-4 border-nyu-gold relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-nyu-gold/10 to-transparent rounded-bl-full"></div>
          <h2 className="text-2xl font-bold text-nyu-purple mb-4 flex items-center">
            <span className="mr-3 text-3xl">📚</span>
            Study Resources
          </h2>
          <p className="text-gray-600 mb-4">Review these materials before taking the quiz:</p>
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border border-purple-200 hover:border-nyu-purple hover:shadow-md transition-all group"
              >
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">📄</span>
                <span className="flex-1 font-medium text-gray-800 group-hover:text-nyu-purple transition-colors">
                  {resource.title}
                </span>
                <span className="text-nyu-purple text-xl group-hover:translate-x-1 transition-transform">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-nyu-purple">
          <h2 className="text-xl font-bold text-nyu-purple mb-3">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Read each question carefully</li>
            <li>Select the best answer for each question</li>
            <li>Click "Submit Quiz" when you're ready to see your results</li>
            <li>You need 2 out of 3 correct answers to pass</li>
          </ul>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {questions.map((question, index) => {
            const selectedAnswer = selectedAnswers[question.id];
            const selectedOption = question.options.find(opt => opt.id === selectedAnswer);
            const isCorrect = selectedOption?.correct;

            return (
              <div 
                key={question.id} 
                className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg"
              >
                {/* Question Header */}
                <div className="flex items-start mb-4">
                  <div className="bg-nyu-purple text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 pt-1">
                    {question.question}
                  </h3>
                </div>

                {/* Answer Options - 2x2 Grid */}
                <div className="pl-0 md:pl-14">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option) => {
                      const isSelected = selectedAnswer === option.id;
                      const showCorrectAnswer = showResults && option.correct;
                      const showIncorrectAnswer = showResults && isSelected && !option.correct;

                      return (
                        <label 
                          key={option.id}
                          className={`
                            relative flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all
                            ${!showResults && 'hover:border-nyu-purple hover:bg-purple-50 hover:shadow-md'}
                            ${isSelected && !showResults ? 'border-nyu-purple bg-purple-50 shadow-md' : 'border-gray-200'}
                            ${showCorrectAnswer ? 'border-green-500 bg-green-50 shadow-md' : ''}
                            ${showIncorrectAnswer ? 'border-red-500 bg-red-50 shadow-md' : ''}
                          `}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.id}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(question.id, option.id)}
                            disabled={showResults}
                            className="w-5 h-5 text-nyu-purple focus:ring-nyu-purple mt-0.5 mr-3 flex-shrink-0"
                          />
                          <div className="flex-1">
                            <span className={`
                              block text-gray-700 leading-relaxed
                              ${showCorrectAnswer ? 'font-semibold text-green-800' : ''}
                              ${showIncorrectAnswer ? 'text-red-800' : ''}
                            `}>
                              {option.text}
                            </span>
                            {showCorrectAnswer && (
                              <span className="inline-block mt-2 text-green-600 font-bold text-sm">✓ Correct Answer</span>
                            )}
                            {showIncorrectAnswer && (
                              <span className="inline-block mt-2 text-red-600 font-bold text-sm">✗ Incorrect</span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!showResults && (
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length !== questions.length}
              className={`
                px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105
                ${Object.keys(selectedAnswers).length === questions.length
                  ? 'bg-nyu-purple text-white hover:bg-purple-800 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Submit Quiz
            </button>
            {Object.keys(selectedAnswers).length !== questions.length && (
              <p className="mt-3 text-gray-600">
                Please answer all questions before submitting
              </p>
            )}
          </div>
        )}

        {/* Results Card */}
        {showResults && (
          <div className={`
            bg-white rounded-xl shadow-xl p-8 border-t-4
            ${score >= 2 ? 'border-green-500' : 'border-red-500'}
          `}>
            <div className="text-center">
              <div className={`
                text-6xl font-bold mb-4
                ${score >= 2 ? 'text-green-600' : 'text-red-600'}
              `}>
                {score} / {questions.length}
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {score >= 2 ? '🎉 Congratulations!' : 'Keep Learning!'}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {score >= 2 
                  ? 'You passed! Great understanding of machine learning fundamentals.'
                  : 'Review the material and try again. You\'re on your way to mastery!'}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setShowResults(false);
                  }}
                  className="px-6 py-3 bg-nyu-purple text-white rounded-lg font-semibold hover:bg-purple-800 transition-all"
                >
                  Retake Quiz
                </button>
                <a
                  href="/"
                  className="px-6 py-3 bg-white text-nyu-purple border-2 border-nyu-purple rounded-lg font-semibold hover:bg-purple-50 transition-all"
                >
                  Back to Landing Page
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 py-6 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          <p>© 2025 NYU AI Masterclass | <a href="/" className="text-nyu-purple hover:underline">Return to Course</a></p>
        </div>
      </div>
    </div>
  );
};

export default QuizExample;

