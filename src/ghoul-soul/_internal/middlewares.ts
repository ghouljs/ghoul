import { MiddlewareAPI, Action, Dispatch, GetState } from '../types';

import { effects } from './effects';
import { getComputes } from './computes';

function warning() {
  throw new Error(
    'You are calling "dispatch" or "getState" without create middleware!'
  );
}

export let dispatch: Dispatch = warning;
export let getState: GetState = warning;

export const middlewareAPI: MiddlewareAPI = {
  dispatch: warning,
  getState: warning,
};

export function createMiddleware() {
  return (middlewareAPIs: MiddlewareAPI) => {
    dispatch = middlewareAPI.dispatch = middlewareAPIs.dispatch;
    getState = middlewareAPI.getState = middlewareAPIs.getState;

    return (next: Dispatch) => (action: Action) => {
      let result = next(action);

      if (typeof effects[action.type] === 'function') {
        result = effects[action.type](action, { dispatch, getState, getComputes });
      }
  
      return result;
    };
  };
}