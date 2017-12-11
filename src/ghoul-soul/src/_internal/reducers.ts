import { MODELSInterface, State, Action, Reducer } from '../types';
import { MODEL_SEPERATOR, collect } from './utils';

export const reducers: Reducer = {};

function wrapReducer(namespace: string, reducers: Reducer): Reducer {
  return Object
    .keys(reducers)
    .reduce(
      (lastValue, nextKey) => ({
        ...lastValue,
        [`${namespace}${MODEL_SEPERATOR}${nextKey}`]: function (state: State, action: Action) {
          return reducers[nextKey].call(null, state, action);
        }
      }),
      {},
    );
}

export function collectReducers(store: MODELSInterface) {
  return collect(store, 'reducers', wrapReducer);
}

export function addReducers(namespace: string, _reducers?: Reducer) {
  if (undefined === _reducers) return false;

  reducers[namespace] = wrapReducer(namespace, _reducers as Reducer);
}

export function getReducers() {
  return reducers;
}