import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App.jsx';
// import './app/styles/style.css';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
