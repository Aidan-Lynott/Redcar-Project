import React, { useState } from 'react';
import { askQuestion } from '../api.ts';

const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await askQuestion(question, domain);
    setResult(response.data.result);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Domain (e.g., redcar.io)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {result && <p>Result: {result}</p>}
    </div>
  );
};

export default QuestionForm;