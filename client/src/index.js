import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './store';

class Index extends React.Component {
  render() {
    return (
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    )
  }
}

const root = createRoot(document.getElementById('root'))
root.render(<Index />)