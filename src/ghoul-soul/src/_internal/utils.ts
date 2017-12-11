import { MODELSInterface, Type, Utils } from '../types';

export const MODEL_SEPERATOR = '@';

export function collect(store: MODELSInterface, type: Type, wrap: Function, inject?: Utils) {
  return Object
    .keys(store)
    .reduce((lastValue, nextNamespace) => ({
      ...lastValue,
      ...wrap(nextNamespace, (store[nextNamespace] as any)[type], inject),
    }), {});
}