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