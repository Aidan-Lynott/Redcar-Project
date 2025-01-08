import React, { useState, useEffect } from 'react';
import { saveQuestionToDatabase, getAllQuestionsFromDatabase } from '../api.ts';
import PreviousQuestions from './PreviousQuestions.tsx';

const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(''); // This stores and displays the live streamed result
  const [isStreaming, setIsStreaming] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]); // Store questions from the database

  // Fetch all questions from the database when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await getAllQuestionsFromDatabase();
      setQuestions(data);
    };

    fetchQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(''); // Clear previous results
    setIsStreaming(true);

    let streamingResult = ''; // Local variable to track the result in real-time

    const eventSource = new EventSource(
      `http://localhost:3001/questions/stream?question=${encodeURIComponent(question)}&domain=${encodeURIComponent(domain)}`
    );

    eventSource.onmessage = (event) => {
      console.log('Event received:', event.data); // Debug: log each chunk received

      // Update the local variable
      streamingResult += event.data;

      // Update the state to trigger a rerender
      setResult(streamingResult); // Display the accumulated result so far
    };

    eventSource.onerror = () => {
      console.error('Error with SSE connection');
      setIsStreaming(false);
      eventSource.close();
    };

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSource.addEventListener('end', async () => {
      console.log('Streaming complete');
      setIsStreaming(false);
      eventSource.close();

      console.log('Final question:', question);
      console.log('Final domain:', domain);
      console.log('Final result (local variable):', streamingResult);

      // Add the new question to the local state
      const newQuestion = { question, domain, result: streamingResult };
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

      // Save to database
      await saveQuestionToDatabase(question, domain, streamingResult);

      setQuestion('');
      setDomain('');
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="question">Question:</label>
        <input
          id="question"
          type="text"
          placeholder="Type your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <label htmlFor="domain">Domain (Optional):</label>
        <input
          id="domain"
          type="text"
          placeholder="e.g., redcar.io"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <button type="submit" disabled={isStreaming}>
          Submit
        </button>
      </form>

      {isStreaming && <p>Streaming in progress...</p>}

      <div>
        <h3>Result:</h3>
        <p>{result}</p>
      </div>

      {/* Pass the questions state to the new component */}
      <PreviousQuestions questions={questions} />
    </div>
  );
};

export default QuestionForm;
