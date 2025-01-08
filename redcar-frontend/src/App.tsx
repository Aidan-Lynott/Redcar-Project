import React from 'react';
import QuestionForm from './components/QuestionForm.tsx';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <div>
        <h1>Redcar Question App</h1>
        <QuestionForm />
      </div>
    </div>
  );
};

export default App;