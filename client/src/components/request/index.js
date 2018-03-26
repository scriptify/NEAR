import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './index.css';

@inject(`uiStore`, `dataStore`)
@observer
class Request extends Component {
  render() {
    let mode = `ask`;
    let user = this.props.dataStore.findUserById(this.props.uiStore.askUser);
    if (!user) {
      user = this.props.dataStore.findUserById(this.props.dataStore.userRequest);
      if (!user)
        return ``;
      
      mode = `request`;
    }

    return (
      <div className="request">
        <div className={`request__picture`}>
          <img src={user.profilePictureUrl} alt={`Person`} />
        </div>
        <div className={`request__text`}>
          {
            mode === `ask` && <p>Do you want to ask <span>{ user.displayName }</span> for a chat?</p>
          }
          {
            mode === `request` && <p><span>{ user.displayName }</span> wants to have a chat with you!</p>
          }
        </div>
        {
          mode === `ask` && (
            <div className={`request__buttons`}>
              <button className={`request__buttons__button`} onClick={() => this.props.uiStore.goBack()}>Go back...</button>
              <button className={`request__buttons__button request__buttons__button--dark`} onClick={() => this.props.dataStore.askUser(user._id)}>Yes!</button>
            </div>
          )
        }
        {
          mode === `request` && (
            <div className={`request__buttons`}>
              <button className={`request__buttons__button`} onClick={() => this.props.dataStore.decline()}>No, thanks</button>
              <button className={`request__buttons__button request__buttons__button--dark`} onClick={() => this.props.dataStore.accept()}>Ok!</button>
            </div>
          )
        }
      </div>
    );
  }
}

export default Request;
