import React, { useState, useEffect } from 'react';

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
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());

  // Synchronize openQuestions with questions prop when it changes
  useEffect(() => {
    const allQuestionIndices = new Set(questions.map((_, index) => index));
    setOpenQuestions(allQuestionIndices);
  }, [questions]);

  const toggleAnswer = (id: number) => {
    setOpenQuestions((prevOpenQuestions) => {
      const updated = new Set(prevOpenQuestions);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  return (
    <div
      style={{
        backgroundColor: '#f8d7da', // Red background outside the boxes
        minHeight: '100vh', // Full viewport height
        padding: '20px', // Padding around the content
      }}
    >
      <div
        style={{
          maxWidth: '80%', // Boxes are constrained to 75% of the width
          minWidth: '80%',
          margin: '0 auto', // Center the boxes horizontally
        }}
      >
        <h2 style={{ color: '#000', textAlign: 'center' }}>Previous Questions and Results:</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[...questions].reverse().map((q, index) => (
            <li key={q.id || index} style={{ marginBottom: '10px' }}>
              <div
                onClick={() => toggleAnswer(index)}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: openQuestions.has(index) ? '#f0f0f0' : '#fff',
                }}
              >
                <strong>{q.question}</strong>
                {openQuestions.has(index) && (
                  <div className="answer-container">
                    <p><strong>Entered Domain:</strong> {q.domain}</p>
                    <p><strong>Answer Received:</strong> {q.result}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PreviousQuestions;