import { createStore, applyMiddleware, compose } from 'redux';
import { CreateStore } from './types';

declare var process: any;

export default function createNewStore({
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
      composeEnhancers = require('remote-redux-devtools').composeWithDevTools({ realtime: true, port: 8008 });
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