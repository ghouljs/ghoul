import { MODELSInterface, Action, Effect, APIs, MiddlewareAPI } from '../types';
import { MODEL_SEPERATOR, collect } from './utils';

export const effects: Effect = {};

export function collectEffects(store: MODELSInterface) {
  return collect(store, 'effects', wrapEffect);
}

function wrapEffect(namespace: string, effects: Effect, apis?: APIs): Effect {
  return Object
    .keys(effects)
    .reduce(
      (lastValue, nextKey) => ({
        ...lastValue,
        [`${namespace}${MODEL_SEPERATOR}${nextKey}`]: function (action: Action, middlewareAPI: MiddlewareAPI) {
          return effects[nextKey].call(null, action, { ...apis, ...middlewareAPI });
        },
      }),
      {},
    );
}

export function addEffects(namespace: string, _effects?: Effect, apis?: APIs) {
  if (undefined === _effects) return false;

  const __effects = wrapEffect(namespace, _effects as Effect, apis);
  Object.assign(effects, __effects);
}

export function getEffects() {
  return effects;
}