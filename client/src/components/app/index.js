import React, { Component } from 'react';
import './index.css';

import Login from '../login';
import Near from '../near';
import Header from '../header';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <Login />
        <Near />
      </div>
    );
  }
}

export default App;
