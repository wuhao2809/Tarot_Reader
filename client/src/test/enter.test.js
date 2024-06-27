import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../components/Home'; 
import { Auth0Context } from '@auth0/auth0-react';
import { GuestProvider } from '../components/GuestContext';

test('renders Enter App button when authenticated', () => {
  render(
    <Auth0Context.Provider value={{ isAuthenticated: true }}>
      <GuestProvider>
        <Router>
          <Home />
        </Router>
      </GuestProvider>
    </Auth0Context.Provider>
  );

  const enterAppButton = screen.getByText('Enter App');
  expect(enterAppButton).toBeInTheDocument();
});