import createReducer from './createReducer';
import combineReducers from './combineReducers';
import createStore from './createStore';

export default function createGhoulStore({
  initialState = {},
  reducers = {},
  plugins = {},
}) {
  const reducers = Object.keys(reducers).every(e => typeof (reducers as any)[e] === 'function')
    ? createReducer(initialState, reducers)
    : combineReducers(Object.keys(reducers).reduce((a, namespace) => ({ ...a, [namespace]: createReducer((initialState as any)[namespace], (reducers as any)[namespace], namespace) }), {}));
  return createStore({ reducers, initialState, plugins });
}
