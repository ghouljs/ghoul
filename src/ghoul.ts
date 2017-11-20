import { App, FunctionObject } from './types';
import { patch, compose } from './vdom';

declare var Promise: any;
declare var process: any;

let globalPlugins: Array<Function> = [() => (action: any) => action];

const WATCH = {
  props: {},
  register(variable: string, callback: Function) {
    if (!Object.prototype.hasOwnProperty.call(this.props, variable)) {
      this.props[variable] = {
        lastState: null,
        callbacks: [callback],
      };
    } else {
      this.props[variable].callbacks.push(callback);
    }
  },
  diff(lastState: any, currentState: any, callback: Function) {
    if (currentState !== lastState) {
      return true;
    } else {
      return false;
    }
  },
  run({ getState, action, effect }: { getState: Function, action: Function, effect: Function }) {
    const state = getState();

    for (const key in this.props) {
      const { lastState, callbacks } = this.props[key];
      const currentState = state[key];
      if (this.diff(lastState, currentState)) {
        callbacks.forEach((fn: Function) => {
          fn.call(callbacks, { getState, action, effect });
        });
      }
    }
  }
};

function dispatch(action: object): object {
  return action;
}

export function installPlugin(plugins: Function | Array<Function> = []) {
  if (!Array.isArray(plugins)) plugins = [plugins];

  for (const plugin of plugins) {
    if (typeof plugin === 'function') {
      globalPlugins.push(
        // (next: Function) => (state: any, action: any, effect: any) => (type: string, ...args: any[]) => plugin(state, action, effect, next)(type, ...args),
        plugin,
      );
    }
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
  let locked: boolean = false;
  let lastState: object;

  init();

  return {
    getState,
    getActions,
    getEffects,
    action,
    effect,
    watch,
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
    if (lastState === state) {
      // avoid render, when state equal
      return false;
    }

    if (locked === true) {
      // if locked, render on next animation frame.
      return requestAnimationFrame(render as any); 
    }

    locked = true;
    element = patch(el, element, oldNode, (oldNode = view(lastState = state, computed, methods)));
    locked = false;
  }

  function applyMiddleware() {
    enhancer = compose(...globalPlugins.map(e => e({ getState, action, effect })));
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

  async function action(type: string, ...args: any[]) {
    if (!Object.prototype.hasOwnProperty.call(actions, type)) {
      // warning: actions have no type.
      if (process.env.NODE_ENV === 'production') {
        return false;
      }
      
      throw new Error(`(action) Error: actions have no type of ${type}`);
    }

    enhancer(next)({ type, payload: args });

    return {
      getState,
      action,
      effect,
    };

    function next(action: any) {
      // change state;
      actions[type].call(actions, ...args)

      // run watch
      WATCH.run({ getState, action, effect });

      return dispatch(action);
    };
  }

  function effect(type: string, ...args: any[]) {
    if (!Object.prototype.hasOwnProperty.call(effects, type)) {
      // warning: effects have no type.
      if (process.env.NODE_ENV === 'production') {
        return false;
      }
      
      throw new Error(`(effect) Error: effects have no type of ${type}`);
    }

    return effects[type].call(effects, ...args);
  }

  function watch(variable: string, callback: Function) {
    WATCH.register(variable, callback);
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
      (resolve: any) => effectFn.call(effects, { state, getState, action, effect, next: resolve }, ...args)
    );
  }

  function Method(methodFn: Function) {
    return (...args: any[]) => new Promise(
      (resolve: any) => methodFn.call(methods, { state, getState, action, effect, next: resolve }, ...args)
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
    return (...args: any[]) => subscriber.call(subscriptions, { state, getState, action, effect, watch });
  }

  function runSubscriptions() {
    Object.keys(subscriptions).map(e => subscriptions[e]).forEach((e: any) => e.call(subscriptions));
  }
}
