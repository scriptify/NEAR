import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './index.css';

@inject(`uiStore`, `dataStore`)
@observer
class Login extends Component {

  onLogin(e) {
    e.preventDefault();
    this.props.dataStore.login({ displayName: e.target[0].value, gender: e.target[1].value })
  }

  render() {

    if (this.props.dataStore.user)
      return ``;

    if (this.props.dataStore.currentPosition.length === 0) {
      return (
        <div className={`login`}>
          <div className={`title`}>
            <h1>Trying to retrieve your current position...</h1>
          </div>
        </div>
      )
    }

    return (
      <div className={`login`}>
        <div className={`title`}>
          <h1>What's your name?</h1>
        </div>
        <form className={`login__input`} onSubmit={ (e) => this.onLogin(e) }>
          <input type={`text`} name={`name`} />
          <div>
            <select>
              <option value={`woman`}>Woman</option>
              <option value={`man`}>Man</option>
              <option value={`woman`}>Other</option>
            </select>
          </div>
          <input type={`submit`} value={`Find people!`} />
        </form>
      </div>
    );
  }
}

export default Login;
