import createReducer from './createReducer';
import combineReducers from './combineReducers';
import createStore from './createStore';

export default function createGhoulStore({
  initialState = {},
  actions = {},
  plugins = {},
}) {
  const reducers = Object.keys(actions).every(e => typeof (actions as any)[e] === 'function')
    ? createReducer(initialState, actions)
    : combineReducers(Object.keys(actions).reduce((a, namespace) => ({ ...a, [namespace]: createReducer((initialState as any)[namespace], (actions as any)[namespace], namespace) }), {}));
  return createStore({ reducers, initialState, plugins });
}