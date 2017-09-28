import { App, FunctionObject } from './types';
import { patch, compose } from './vdom';

declare var Promise: any;

let globalPlugins: Array<any> = [() => (action: any) => action];

export function installPlugin(plugins = []) {
  for (const plugin of plugins) {
    globalPlugins.push(
      // (next: Function) => (state: any, action: any, effect: any) => (type: string, ...args: any[]) => plugin(state, action, effect, next)(type, ...args),
      plugin,
    );
  }
}


export function ghoul(props: App) {
  let state = props.state || {};
  const view = props.view;
  const actions: FunctionObject = {};
  const effects: FunctionObject = {};
  const subscriptions: FunctionObject = {};

  const methods: FunctionObject = {};
  const computed: FunctionObject = {};

  let enhancer: Function;

  let el = props.root || document.body;
  let element: any;
  let oldNode: any;

  // status
  let locked = false;

  init();

  return {
    getState,
    getActions,
    getEffects,
    action,
    effect,
  };

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
      .keys(props.methods || {})
      .reduce((o, r) => {
        o[r] = Method(props.methods[r]);
        return o;
      }, methods);

    Object
      .keys(props.subscriptions || {})
      .reduce((o, r) => {
        o[r] = Subscription(props.subscriptions[r]);
        return o;
      }, subscriptions);

    Object
      .keys(props.computed || {})
      .forEach((key) => {
        Computed(computed, key, props.computed[key]);
      });

    applyMiddleware();

    requestAnimationFrame(render as any);

    setImmediate(runSubscriptions);
  }

  function render() {
    if (locked === true) {
      // if locked, render on next animation frame.
      return requestAnimationFrame(render as any); 
    }

    locked = true;
    element = patch(el, element, oldNode, (oldNode = view(state, computed, methods)));
    locked = false;
  }

  function applyMiddleware() {
    enhancer = compose(...globalPlugins.map(e => e(getState, action, effect)));
  }

  function getState() {
    return state;
  }

  function getActions() {
    return actions;
  }

  function getEffects() {
    return effects;
  }

  function action(type: string, ...args: any[]) {
    const actionObject = enhancer({ type, payload: args }) || {};

    if (!Object.prototype.hasOwnProperty.call(actions, actionObject.type)) {
      // warning: actions have no type.
      return false;
    }

    return actions[actionObject.type].call(actions, ...actionObject.payload)
  }

  function effect(type: string, ...args: any[]) {
    if (!Object.prototype.hasOwnProperty.call(effects, type)) {
      // warning: effects have no type.
      return false;
    }

    return effects[type].call(effects, ...args);
  }

  function Action(actionFn: Function, next: Function) {
    return function (...args: any[]) {
      const updatedState = actionFn.call(actions, state, ...args);
      if (typeof updatedState === 'function') {
        updatedState();
      } else {
        const currentState = { ...state, ...updatedState };

        // shallow compare state (@TODO) on top root, to reduce render
        if (Object.keys(state).length === Object.keys(currentState).length
        && Object.keys(state).every(k => state[k] === currentState[k])) return ;
        
        state = currentState;
        requestAnimationFrame(() => {
          next();
        });
      }
    };
  }

  function Effect(effectFn: Function) {
    return (...args: any[]) => new Promise(
      (resolve: any) => effectFn.call(effects, { state, action, effect, next: resolve }, ...args)
    );
  }

  function Method(methodFn: Function) {
    return (...args: any[]) => new Promise(
      (resolve: any) => methodFn.call(methods, { state, action, effect, next: resolve }, ...args)
    );
  }

  function Computed(obj: object, name: string, computedFn: Function) {
    let value: any;
    let tmpState: any;
    Object.defineProperty(obj, name, {
      get: function () {
        const currentState = getState();
        if (tmpState === currentState) {
          return value;
        }

        tmpState = currentState;
        value = computedFn.call(null, currentState);
        return value;
      },
    });
  }

  function Subscription(subscriber: Function) {
    return (...args: any[]) => subscriber.call(subscriptions, { state, action, effect });
  }

  function runSubscriptions() {
    Object.keys(subscriptions).map(e => subscriptions[e]).forEach((e: any) => e.call(subscriptions));
  }
}
