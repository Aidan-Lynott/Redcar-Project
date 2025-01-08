import React from 'react';
import QuestionForm from './components/QuestionForm.tsx';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <div>
        <h1>Aidan Lynott -- Redcar Project</h1>
        <h3>Ask a question about a business using that business's domain, and the AI will answer it for you!</h3>
        <QuestionForm />
        <p>Note: AI used is Google Gemini.</p>
      </div>
    </div>
  );
};

export default App;