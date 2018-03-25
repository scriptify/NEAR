import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import './index.css';
import App from './components/app';
import registerServiceWorker from './registerServiceWorker';
import uiStore from './stores/ui-store';
import dataStore from './stores/data-store';

ReactDOM.render((
    <Provider uiStore={uiStore} dataStore={dataStore}>
        <App />
    </Provider>
), document.getElementById('root'));
registerServiceWorker();
