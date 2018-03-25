import React, { Component } from 'react';
import './index.css';

import Login from '../login';
import Near from '../near';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Login />
        <Near />
      </div>
    );
  }
}

export default App;
