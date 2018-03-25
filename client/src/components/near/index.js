import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './index.css';

@inject(`uiStore`, `dataStore`)
@observer
class Near extends Component {

  onLogin(e) {
    e.preventDefault();
    this.props.dataStore.login({ displayName: e.target[0].value, gender: e.target[1].value })
  }

  render() {

    if (!this.props.dataStore.user || this.props.dataStore.nearUsers.length === 0)
      return ``;

    return (
      <div className={`near`}>
        NEAR
        {
          this.props.dataStore.nearUsers.map((user) => {
            return (
              <div className={`near__user`} key={user.displayName}>
                <img src={user.profilePictureUrl} alt={`Profile`} />
                <p>{ user.displayName }</p>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Near;
