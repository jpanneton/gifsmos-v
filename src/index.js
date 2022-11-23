import React from 'react';
import { createRoot } from 'react-dom/client'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import AppContainer from './containers/AppContainer';
import panes from './constants/pane-types';
import { togglePane } from './actions';
import greet from './lib/dev-greeting';
import './index.css';
import 'overlayscrollbars/overlayscrollbars.css';

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

const closePane = () => store.dispatch(togglePane(panes.NONE));

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppContainer onEscape={closePane} />
  </Provider>
);

// Say hello to the nice people with their consoles open.
greet();
