import { State } from '../types';

// import { collect } from './utils';

// function wrapState(namespace: string, state: State): State {
//   return { [namespace]: state };
// }

// export function collectState(store: MODELSInterface) {
//   return collect(store, 'state', wrapState);
// }


export const states: State = {};

export function addState(namespace: string, _state?: State) {
  if (undefined === _state) return false;

  states[namespace] = _state;
}

export function getStates() {
  return states;
}