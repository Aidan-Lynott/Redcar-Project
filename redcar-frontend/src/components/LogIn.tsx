import React, { useState } from 'react';
import { useAuth } from './AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const { saveToken } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login button clicked');  // Debugging line
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        saveToken(data.token);
        navigate('/questions');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register button clicked');  // Debugging line
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <button type="button" onClick={handleRegister}>Register</button>
      </form>
    </div>
  );
};

export default LogIn
