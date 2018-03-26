import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './index.css';
import send from './send.svg';

@inject(`uiStore`, `dataStore`)
@observer
class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currMsg: ``
    };
  }

  onMsgChange(msg) {
    this.setState({
      ...this.state,
      currMsg: msg
    });
  }

  onMsgSend() {
    this.props.dataStore.sendChatMessage(this.state.currMsg);
    this.setState({
      ...this.state,
      currMsg: ``
    });
  }

  render() {
    const { dataStore } = this.props;
    const { user: meUser, chatMessages } = dataStore;
    const otherUser = dataStore.findUserById(dataStore.chatUser);

    if (!otherUser)
      return ``;

    return (
      <div className={`chat`}>
        <button className={`chat__go-back-btn`} onClick={ () => dataStore.closeChat() }>Go back...</button>
        <h1 className={`chat__title`}>Where do you want to meet <span>{otherUser.displayName}</span>?</h1>
        
        <div className={`chat__messages`}>
          {
            chatMessages.map(({ userId, message }) => {
              let mod = `chat__messages__message--left`;
              let first = (
                <div className={`chat__messages__message__picture`}>
                  <img src={otherUser.profilePictureUrl} alt={`Profile`} />
                </div>
              );
              let second = (
                <div className={`chat__messages__message__text`}>{ message }</div>
              );
              if (userId === meUser._id) {
                mod = `chat__messages__message--right`;
                first = (
                  <div className={`chat__messages__message__text`}>{ message }</div>
                );
                second = (
                  <div className={`chat__messages__message__picture`}>
                    <img src={meUser.profilePictureUrl} alt={`Profile`} />
                  </div>
                );
              }

              return (
                <div className={`chat__messages__message ${mod}`} key={message + userId}>
                  { first }
                  { second }
                </div>
              );
            })
          }
        </div>

        <div className={`chat__bottom`}>
          <div className={`chat__bottom__input`}>
            <input type={`text`} value={this.state.currMsg} onChange={ e => this.onMsgChange(e.target.value) } minLength={1} maxLength={50} />
            <button onClick={ () => this.onMsgSend() }><img src={send} alt={`send message`} /></button>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
