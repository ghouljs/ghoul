export interface IObject {
  [key: string]: any;
}

export interface FunctionObject {
  [key: string]: Function;
}

export interface Node {
  tag: string;
  attributes: Attributes;
};

export interface Attributes {
  // children?: any[];
  [key: string]: any;
}

export interface Style {
  [key: string]: any;
}

export interface Props {
  [key: string]: any;
};

export interface Context {
  [key: string]: any;
};

export interface State {
  [key: string]: any;
};

export interface App {
  state: IObject;
  view: Function;
  actions: IObject;
  effects: FunctionObject;
  methods: FunctionObject;
  computed: FunctionObject;
  subscriptions: IObject;

  root?: HTMLElement;
}

export type DirectiveBinding = {
  name: string;
  handler?: DirectiveHandler;
  value?: string;
  expression?: string;
  argument?: string;
  modifiers?: object;
};
export type DirectiveHandlerFn = (el?: Element, binding?: DirectiveBinding, vnode?: object) => void;
export type DirectiveHandlerObject =  {
  // bind: (el?: Element, binding?: DirectiveBinding, vnode?: object) => void;
  oncreate: (el?: Element, binding?: DirectiveBinding, vnode?: object) => void;
  onupdate?: (el?: Element, binding?: DirectiveBinding, vnode?: object) => void;
  onremove?: (el?: Element, binding?: DirectiveBinding, vnode?: object) => void;
  // unbind?: (el?: Element, binding?: DirectiveBinding, vnode?: object) => void;
};
export type DirectiveHandler =  DirectiveHandlerFn | DirectiveHandlerObject;

export interface Directive {
  name: string;
  handler: DirectiveHandlerObject;
};

export interface Directives {
  [key: string]: DirectiveHandler;
};