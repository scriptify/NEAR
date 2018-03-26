import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './index.css';

import Login from '../login';
import Near from '../near';
import Header from '../header';
import Footer from '../footer';
import Request from '../request';
import Loading from '../loading';
import Chat from '../chat';

@inject(`uiStore`, `dataStore`)
@observer
class App extends Component {
  render() {
    const { step, loading, notification } = this.props.uiStore;
    const showStep = !loading;
    const showFooter = (step !== `ask-user`) && (step !== `request`) && (step !== `chat`);
    
    return (
      <div className="app">
        <Header />
        {
          loading && <Loading text={loading} />
        }
        {
          showStep && step === `login` && <Login />
        }
        {
          showStep && step === `near` && <Near />
        }
        {
          showStep && step === `ask-user` && <Request />
        }
        {
          showStep && step === `request` && <Request />
        }
        {
          showStep && step === `chat` && <Chat />
        }
        {
          showFooter && <Footer text={notification} />
        }
      </div>
    );
  }
}

export default App;
