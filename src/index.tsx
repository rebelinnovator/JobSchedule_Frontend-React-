import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { index } from './Stores/index';
import { getDeviceType } from './Utils/Common';

(window as any).deviceType = getDeviceType();

ReactDOM.render(
  <Provider {...index}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById('root'));

serviceWorker.unregister();
