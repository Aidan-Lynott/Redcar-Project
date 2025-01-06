import React, { useState } from 'react';

const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(''); // Clear previous results
    setIsStreaming(true);

    const eventSource = new EventSource(`http://localhost:3001/questions/stream?question=${question}&domain=${domain}`);

    eventSource.onmessage = (event) => {
      console.log('Event received:', event.data); // Debug: log each chunk received
      setResult((prevResult) => prevResult + event.data);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setIsStreaming(false);
      eventSource.close();
    };

    eventSource.addEventListener('end', () => {
      console.log('Streaming complete');
      setIsStreaming(false);
      eventSource.close();
    });
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
        <button type="submit" disabled={isStreaming}>
          Submit
        </button>
      </form>
      <div>
        <h3>Result:</h3>
        <p>{result}</p>
      </div>
      {isStreaming && <p>Streaming in progress...</p>}
    </div>
  );
};

export default QuestionForm;