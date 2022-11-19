import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './store';
import { SocketProvider } from './store';

class Index extends React.Component {
  render() {
    return (
      <UserProvider>
        <SocketProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SocketProvider>
      </UserProvider>
    )
  }
}

const root = createRoot(document.getElementById('root'))
root.render(<Index />)