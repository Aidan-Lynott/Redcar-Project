import React, { useState, useEffect } from 'react';
import { saveQuestionToDatabase, getUserQuestionsFromDatabase } from '../api.ts';
import PreviousQuestions from './PreviousQuestions.tsx';
import { useAuth } from './AuthContext.tsx'; // Import AuthContext hook
import { jwtDecode } from 'jwt-decode';

const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(''); // This stores and displays the live streamed result
  const [isStreaming, setIsStreaming] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]); // Store questions from the database

  const { logout } = useAuth(); // Get the logout function from AuthContext

  // Fetch all questions from the database when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      // Get userId from token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const decodedToken: any = jwtDecode(token); // Decode the token  
      const username = decodedToken?.username;
      const data = await getUserQuestionsFromDatabase(username);
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

      // Get userId from token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const decodedToken: any = jwtDecode(token); // Decode the token  
      const username = decodedToken?.username;

      // Add the new question to the local state
      const newQuestion = { username, question, domain, result: streamingResult };
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

      // Save to database
      await saveQuestionToDatabase(username, question, domain, streamingResult);

      setQuestion('');
      setDomain('');
    });
  };

  return (
    <div
      style={{
        maxWidth: '75%', // Boxes are constrained to 75% of the width
        minWidth: '75%',
        margin: '0 auto', // Center the boxes horizontally
      }}
    >

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <button className="button-style"
          onClick={logout} 
        >
        Logout
      </button>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="question">Enter Question:</label>
        <p className="subheader">
          Ask the AI a question about a business. Your question should contain a domain for the AI
          to get its information from.
        </p>
        <input
          id="question"
          type="text"
          placeholder="Type your question here, e.g., “Is the company redcar.io a B2B company?”"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <label htmlFor="domain">Enter Domain (Optional):</label>
        <p className="subheader">
          To confirm the AI properly parses your domain, you can enter it here. This is not
          necessary though!
        </p>
        <input
          id="domain"
          type="text"
          placeholder="Type your domain here, e.g., “redcar.io”"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <button type="submit" disabled={isStreaming}>
          Submit
        </button>
      </form>

      <div
        style={{
          maxWidth: '75%', // Boxes are constrained to 75% of the width
          minWidth: '75%',
          margin: '0 auto', // Center the boxes horizontally
        }}
      >
        <h2>Answer:</h2>
        <p>{result}</p>
      </div>

      {/* Pass the questions state to the new component */}
      <PreviousQuestions questions={questions} />
    </div>
  );
};

export default QuestionForm;
