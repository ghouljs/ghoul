import { App, FunctionObject } from './types';
import { patch } from './vdom';

declare var Promise: any;

export function ghoul(props: App) {
  let state = props.state || {};
  const view = props.view;
  const actions: FunctionObject = {};
  const effects: FunctionObject = {};
  const subscriptions: FunctionObject = {};

  let el = props.root || document.body;
  let element: any;
  let oldNode: any;

  init();

  function init() {
    Object
      .keys(props.actions || {})
      .reduce((o, r) => {
        o[r] = Action(props.actions[r], render);
        return o;
      }, actions);

    Object
      .keys(props.effects || {})
      .reduce((o, r) => {
        o[r] = Effect(props.effects[r]);
        return o;
      }, effects);

    Object
      .keys(props.subscriptions || {})
      .reduce((o, r) => {
        o[r] = Subscription(props.subscriptions[r]);
        return o;
      }, subscriptions);

    requestAnimationFrame(render as any);

    setImmediate(runSubscriptions);
  }

  function render() {
    element = patch(el, element, oldNode, (oldNode = view(state, action, effect)));
  }

  function action(type: string, ...args: any[]) {
    return actions[type](...args);
  }

  function effect(type: string, ...args: any[]) {
    return effects[type](...args);
  }

  function Action(actionFn: Function, next: Function) {
    return function (...args: any[]) {
      const updatedState = actionFn(state, ...args);
      if (typeof updatedState === 'function') {
        updatedState();
      } else {
        const currentState = { ...state, ...updatedState };

        // shallow compare state (@TODO) on top root, to reduce render
        if (Object.keys(state).length === Object.keys(currentState).length
        && Object.keys(state).every(k => state[k] === currentState[k])) return ;
        
        state = currentState;
        requestAnimationFrame(next as any);
      }
    };
  }

  function Effect(effectFn: Function) {
    return (...args: any[]) => new Promise(
      (resolve: any) => effectFn({ state, action, effect, next: resolve }, ...args)
    );
  }

  function Subscription(subscriber: Function) {
    return (...args: any[]) => subscriber({ state, action, effect });
  }

  function runSubscriptions() {
    Object.keys(subscriptions).map(e => subscriptions[e]).forEach((e: any) => e());
  }
}