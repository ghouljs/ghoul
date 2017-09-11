import { State, Handlers, Action } from './types';

const createReducer = (initialState: State, handlers: Handlers, namespace?: any) => (state: State = initialState, action: Action) =>
  namespace !== undefined && action.type.indexOf(`${namespace}@`) !== -1
    ? (handlers[action.type.split('@')[1]] ? handlers[action.type.split('@')[1]](state, action) : state)
    : namespace === undefined ? (handlers[action.type] ? handlers[action.type](state, action) : state) : state;
export default createReducer;