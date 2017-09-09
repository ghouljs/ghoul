import { App, IObject, FunctionObject } from './types';
import { patch } from './vdom';

declare var Promise: any;

export function app(props: App) {
  let state = props.state || {};
  const view = props.view;
  const actions: IObject = {};
  const effects: FunctionObject = {};
  // const subscriptions = props.subscriptions || {};

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
  
    render();
  }

  function render() {
    element = patch(el, element, oldNode, (oldNode = view(state, actions, effects)));
  }

  function Action(action: Function, next: Function) {
    return function () {
      const updatedState = action(state, actions);
      if (typeof updatedState === 'function') {
        updatedState();
      } else {
        state = { ...state, ...updatedState };
        next();
      }
    };
  }

  function Effect(effect: Function) {
    return () => new Promise((resolve: any) => effect(state, actions, effects, resolve));
  }
}