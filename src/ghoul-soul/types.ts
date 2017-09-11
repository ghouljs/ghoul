export interface State {
  [key: string]: any;
};

export interface Handlers {
  [key: string]: Function;
};

export interface Action {
  type: string;
  [key: string]: any;
};

export interface Plugin {
  extraEnhancers?: Array<any>;
  [key: string]: any;
};

export interface CreateStore {
  reducers: Function;
  initialState: State;
  plugins?: Plugin;
};