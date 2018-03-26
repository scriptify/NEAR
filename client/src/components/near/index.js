import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './index.css';

@inject(`uiStore`, `dataStore`)
@observer
class Near extends Component {

  render() {
    if (!this.props.dataStore.user || this.props.dataStore.nearUsers.length <= 1) {
      return <div className={`empty`}>Sorry, there are no people nearby</div>;
    }

    return (
      <div className={`near`}>
        {
          this.props.dataStore.nearUsers.map((user) => {

            if (user._id === this.props.dataStore.user._id)
              return ``;

            return (
              <div className={`user`} key={user._id} onClick={() => { this.props.uiStore.askUserById(user._id) }}>
                <div className={`user__pic`}>
                  <img src={user.profilePictureUrl} alt={`Profile`} />
                </div>
                <div className={`user__data`}>
                  <p className={`user__data__name`}><span>{ user.displayName }</span></p>
                  <p className={`user__data__message`}>„{ user.message }”</p>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Near;
