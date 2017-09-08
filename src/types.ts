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