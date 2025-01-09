import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { act } from 'react-dom/test-utils';
import React from 'react';

const TestComponent = () => {
  const { token, saveToken, logout } = useAuth();
  
  return (
    <div>
      <button onClick={() => saveToken('mockToken')}>Save Token</button>
      <button onClick={logout}>Logout</button>
      {token && <p>{`Token: ${token}`}</p>}
    </div>
  );
};

describe('AuthContext', () => {
  it('should save and retrieve token correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Save Token'));
    expect(localStorage.getItem('token')).toBe('mockToken');
    expect(screen.getByText('Token: mockToken')).toBeInTheDocument();
  });

  it('should remove token on logout', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      localStorage.setItem('token', 'mockToken');
    });

    fireEvent.click(screen.getByText('Logout'));
    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.queryByText('Token: mockToken')).not.toBeInTheDocument();
  });
});
