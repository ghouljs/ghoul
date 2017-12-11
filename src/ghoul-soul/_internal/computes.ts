import { Compute, APIs } from '../types';
import { MODEL_SEPERATOR } from './utils';

export const computes: Compute = {};

function wrapComputes(namespace: string, computes: Compute, apis?: APIs): Compute {
  return Object
    .keys(computes)
    .reduce(
      (lastValue, nextKey) => ({
        ...lastValue,
        [`${namespace}${MODEL_SEPERATOR}${nextKey}`]: function () {
          return (computes[nextKey] as any).call(null, apis);
        },
      }),
      {},
    );
}

export function addComputes(namespace: string, _computes?: Compute, apis?: APIs) {
  if (undefined === _computes) return false;

  computes[namespace] = wrapComputes(namespace, _computes, apis);
}

export function getComputes() {
  return computes;
}