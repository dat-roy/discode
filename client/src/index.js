import React from 'react';
import ReactDOM from 'react-dom';
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

 ReactDOM.render(<Index />, document.getElementById('root'))