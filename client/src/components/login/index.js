import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './index.css';

@inject(`uiStore`)
@observer
class Login extends Component {
  render() {
    return (
      <div className={`login`}>
        <div className={`title`}>
          <h1>What's your name?</h1>
        </div>
        <form className={`login__input`}>
          <input type={`text`} />
          <input type={`submit`} value={`Find people!`} />
        </form>
      </div>
    );
  }
}

export default Login;
