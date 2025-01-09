// App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './components/LogIn.tsx'; // Create this component
import QuestionForm from './components/QuestionForm.tsx'; // Renamed from QuestionsPage
import PrivateRoute from './components/PrivateRoute.tsx'; // Create this for route protection
import './App.css';

const App: React.FC = () => {
  useEffect(() => {
    document.title = 'Redcar AI Business Question App'; // Set the title for the entire app
  }, []);

  return (
    <Router>
      <div className="App">
        <div>
          {/* Header section with spacing */}
          <h1>Aidan Lynott -- Redcar Project</h1>
          <h3>Ask a question about a business using that business's domain, and the AI will answer it for you!</h3>
        </div>
        
        {/* Routes container with spacing */}
        <div className="Route-container">
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route
              path="/questions"
              element={
                <PrivateRoute>
                  <QuestionForm />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect unmatched paths to login */}
          </Routes>
        </div>

        {/* Footer note with spacing */}
        <p>Note: AI used is Google Gemini.</p>
      </div>
    </Router>
  );
};

export default App;