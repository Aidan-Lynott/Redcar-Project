import React from 'react';

interface Question {
  id?: number;
  question: string;
  domain: string;
  result: string;
}

interface PreviousQuestionsProps {
  questions: Question[];
}

const PreviousQuestions: React.FC<PreviousQuestionsProps> = ({ questions }) => {
  return (
    <div>
      <h3>Previous Questions and Results:</h3>
      <ul>
        {[...questions].reverse().map((q, index) => (
          <li key={q.id || index}>
            <strong>{q.question}</strong> ({q.domain}): {q.result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreviousQuestions;