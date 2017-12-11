import { Subscription, APIs } from '../types';
import { MODEL_SEPERATOR } from './utils';

export const subscriptions: Subscription = {};

function wrapSubscriptions(namespace: string, subscriptions: Subscription, apis?: APIs): Subscription {
  return Object
    .keys(subscriptions)
    .reduce(
      (lastValue, nextKey) => ({
        ...lastValue,
        [`${namespace}${MODEL_SEPERATOR}${nextKey}`]: function () {
          return (subscriptions[nextKey] as any).call(null, apis);
        },
      }),
      {},
    );
}

export function addsubscriptions(namespace: string, _subscriptions?: Subscription, apis?: APIs) {
  if (undefined === _subscriptions) return false;

  subscriptions[namespace] = wrapSubscriptions(namespace, _subscriptions, apis);
}

export function getSubscriptions() {
  return subscriptions;
}