import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import createReducer from './createReducer';
import { CreateStore } from './types';

declare var process: any;

function createNewStore({
  reducers,
  initialState = {},
  plugins = {},
}: CreateStore) {
  const extraEnhancers = plugins['extraEnhancers'] || [];
  const extraMiddlewares = plugins['extraMiddlewares'] || [];
  
  const middlewares = [
    ...extraMiddlewares,
  ];

  let devtools = [];
  let composeEnhancers = compose;
  if (process.env.NODE_ENV !== 'production')  {
    if (process.env.MODE === 'node') {
      // devtools = [require('remote-redux-devtools')()];
      composeEnhancers = require('remote-redux-devtools').composeWithDevTools({
        name: 'Node Redux App',
        realtime: true,
        hostname: process.env.REDUX_HOST || 'localhost',
        port: process.env.REDUX_PORT || 8000,
      });
    } else {
      devtools = typeof(window) !== 'undefined' && window && (window as any).__REDUX_DEVTOOLS_EXTENSION__
      ? [(window as any).__REDUX_DEVTOOLS_EXTENSION__] : [];
    }
  }

  const enhancers = [
    applyMiddleware(...middlewares),
    ...devtools,
    ...extraEnhancers,
  ];

  return createStore(reducers as any, initialState, composeEnhancers(...enhancers));
}

export default (reducers: any, initialState: any, plugins: any) => {
  if (initialState === undefined && plugins === undefined) {
    // reducersAndInitialStateAndPlugins Object
    const ris = reducers;
    
    const reducersArray = Object.keys(ris.reducers).every(e => typeof (ris.reducers as any)[e] === 'function')
      ? createReducer(ris.initialState, ris.reducers)
      : combineReducers(Object.keys(ris.reducers).reduce((a, namespace) => ({ ...a, [namespace]: createReducer((ris.initialState as any)[namespace], (reducers as any)[namespace], namespace) }), {}));
    return createNewStore({ reducers: reducersArray, initialState: ris.initialState, plugins: ris.plugins });
  }

  const reducersArray = Object.keys(reducers).every(e => typeof (reducers as any)[e] === 'function')
    ? createReducer(initialState, reducers)
    : combineReducers(Object.keys(reducers).reduce((a, namespace) => ({ ...a, [namespace]: createReducer((initialState as any)[namespace], (reducers as any)[namespace], namespace) }), {}));
  return createNewStore({ reducers: reducersArray, initialState, plugins });
}