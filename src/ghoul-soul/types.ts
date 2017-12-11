export interface State {
  [key: string]: object | number | string | null | undefined;
};

export interface Handlers {
  [key: string]: Function;
};

// export interface Action {
//   type: string;
//   [key: string]: any;
// };

export type Dispatch = (action: Action) => Action | void;
export type GetState = () => State | void;

export interface Plugin {
  extraEnhancers?: Array<any>;
  extraMiddlewares?: Array<any>;
  [key: string]: any;
};

export interface CreateStore {
  reducers: Function;
  initialState: State;
  plugins?: Plugin;
};

export interface MiddlewareAPI {
  getState: GetState;
  dispatch: Dispatch;
}

export interface APIs {
  getState: GetState;
  [key: string]: Function;
}

export interface ObjectInterface {
  [key: string]: object | any;
};

export interface Action {
  type: string;
  payload?: object;
  [key: string]: any;
};

export type Type = 'state' | 'reducers' | 'effects' | 'computes' | 'subscriptions';

// export type State = ObjectInterface;
export type Reducer = ObjectInterface;
export type Effect = ObjectInterface;
export type Compute = State;
export type Subscription = ObjectInterface;
export type Utils = MiddlewareAPI;

export interface Model {
  namespace: string;
  state?: State;
  reducers?: Reducer;
  effects?: Effect;
  computes?: Compute;
  subscriptions?: Subscription;
};

export interface MODELSInterface {
  [key: string]: Model;
};

export interface Options {
  plugins: Plugin;
  [key: string]: any;
};