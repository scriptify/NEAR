import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './index.css';

@inject(`uiStore`, `dataStore`)
@observer
class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayName: ``,
      gender: `woman`,
      message: ``
    };
  }

  onLogin(e) {
    e.preventDefault();
    this.props.dataStore.login(this.state);
  }

  onValueChange({ field, value }) {
    this.setState({
      ...this.state,
      [field]: value
    });
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
          <h1>Who are you?</h1>
        </div>
        <form className={`login__input`} onSubmit={ (e) => this.onLogin(e) }>
          <p>Your name:</p>
          <input type={`text`} name={`name`} onChange={e => this.onValueChange({ field: `displayName`, value: e.target.value })} required />
          <p>What do do you want to talk about (your interests, hobbies...)?</p>
          <input type={`text`} name={`message`} onChange={e => this.onValueChange({ field: `message`, value: e.target.value })} required />
          <div>
            <select onChange={e => this.onValueChange({ field: `gender`, value: e.target.value })}>
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
