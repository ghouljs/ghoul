import {
  createStore as _createStore, applyMiddleware, compose, Store,
} from 'redux';
// import createReducers from './createReducers';
import { createMiddleware } from '../_internal/middlewares';
import { CreateStore } from '../types';
import createReducers from './createReducers';

declare var process: any;

export function createStore({ reducers = {}, initialState = {}, plugins = {} }: CreateStore): Store<any> {
  const extraEnhancers = plugins['extraEnhancers'] || [];
  const extraMiddlewares = plugins['extraMiddlewares'] || [];
  
  const middlewares = [
    ...extraMiddlewares,
    createMiddleware(),
  ];

  let devtools = [];
  let composeEnhancers = compose;
  if (process.env.NODE_ENV !== 'production')  {
    if (process.env.MODE === 'node') {
      // devtools = [require('remote-redux-devtools')()];
      composeEnhancers = require('remote-redux-devtools').composeWithDevTools({
        name: 'Node Redux App',
        realtime: true,
        hostname: process.env.HOST || 'localhost',
        port: process.env.PORT || 8000,
      });
    } else {
      devtools = typeof window !== 'undefined' && window && (window as any).__REDUX_DEVTOOLS_EXTENSION__
        ? [(window as any).__REDUX_DEVTOOLS_EXTENSION__] : [];
    }
  }

  const enhancers = [
    applyMiddleware(...middlewares),
    ...devtools,
    ...extraEnhancers,
  ];

  // return _createStore(createReducers(initialState, reducers), initialState, composeEnhancers(...enhancers));
  return _createStore(createReducers(reducers, initialState), initialState, composeEnhancers(...enhancers));
}


export default (reducers: any, initialState: any, plugins?: any) => {
  return createStore({ reducers, initialState, plugins });
}