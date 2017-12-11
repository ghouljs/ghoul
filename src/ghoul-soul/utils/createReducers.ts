// import { combineReducers } from 'redux';
import { Reducer, State } from '../types';
import { Action, combineReducers } from 'redux';

// const NAMESPACE_SEP = '@';

// function namespacedHandlers(namespace: string, handlers: Handlers): Handlers {
//   return Object.keys(handlers).reduce((v, k) => ({ ...v, [`${namespace}${NAMESPACE_SEP}${k}`]: handlers[k] }), {});
// }

function createReducer(reducers: Reducer, initialState: State) {
  return (state: State = initialState, action: Action) => reducers[action.type] ? reducers[action.type].call(null, state, action) : state;
}

/**
 * 
 * @param initialState 
 * @param handlers 
 * 
 * 
 * initialState = { only: 0, app: { count: 0 } };
 * handlers = { only: state => state + 2, app: { '+': state => state + 1, '-': state => state - 1 } };
 */
// export default function createReducers(initialState: State, handlers: Handlers) {
//   const reducers = Object
//     .keys(initialState)
//     .map(key => {
//       return {
//       key,
//       fn: Object.prototype.toString.call(initialState[key]) === '[object Object]'
//         ? createReducer((initialState[key] as State), (namespacedHandlers(key, handlers[key] as any)))
//         : (state: State | any = initialState[key], action: Action) => action.type === key ? handlers[key].call(null, state, action) : state,
//       };
//     },
//     ).reduce((v, k) => ({ ...v, [k.key]: k.fn }), {});;

//   return combineReducers(reducers);
// }

/**
 * {
 *  app: {
 *    'app@+': Function;
 *  },
 *  user: {
 *    'user@create': Function
 *  },
 * }
 */
export default function createReducers(reducers: { [key: string]: Reducer }, initialState: State) {
  const _reducers = Object.keys(reducers)
    .reduce(
      (a: object, namespace: string) => ({
        ...a,
        [namespace]: createReducer(reducers[namespace], initialState[namespace] as any),
      }),
      {},
    );

  return combineReducers(_reducers);
}
