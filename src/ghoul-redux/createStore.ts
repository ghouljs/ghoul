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
  const devtools = process.env.NODE_ENV !== 'production' && window && (window as any).__REDUX_DEVTOOLS_EXTENSION__
    ? [(window as any).__REDUX_DEVTOOLS_EXTENSION__] : [];

  const enhancers = [
    applyMiddleware(...middlewares),
    ...devtools,
    ...extraEnhancers,
  ];

  return createStore(reducers as any, initialState, compose(...enhancers));
}