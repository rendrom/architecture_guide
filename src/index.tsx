import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './app';

const elem = document.getElementById('root');
if (!elem) {
  throw new Error('Target not founded');
}
const root = ReactDOM.createRoot(elem);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
