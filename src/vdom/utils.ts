import { Node, Attributes } from '../types';

const noop = () => {};

function compose(...funcs: Function[]) {
  if (funcs.length === 0) return noop;

  if (funcs.length === 1) return funcs[0];

  return  funcs.reduce((a, b) => (...args: Function[]) => a(b(...args)));
}

function setProps(element: HTMLElement | SVGElement | Text, key: string, value: any = {}, oldValue: any = {}) {
  if (key === 'key' || key === 'children') {
    return true;
  } else if (key == 'style') {
    for (const i in Object.assign({}, oldValue, value)) {
      if (typeof i === 'string') {
        (element as any).style[i] = value[i] || '';
      }
    }
  } else {
    try {
      (element as any)[key] = value;
    } catch (e) {}
  
    if (typeof value !== 'function') {
      if (value) {
        (element as any).setAttribute(key, value);
      } else {
        (element as any).removeAttribute(key);
      }
    }
  }
}

export function createElement(node: Node): HTMLElement | SVGElement | Text {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  } else if (node.tag == null) {
    return document.createTextNode(node.toString());
  } else {
    const element: HTMLElement | SVGElement = node.tag === 'svg'
      ? document.createElementNS('http://www.w3.org/2000/svg', node.tag)
      : document.createElement(node.tag);

    // 1 self
    for (const k in node.attributes) {
      setProps(element, k, node.attributes[k]);
    }

    // 2 children
    for (const childNode of node.attributes.children) {
      element.appendChild(createElement(childNode));
    }

    return element;
  }
}


export function updateElement(element: HTMLElement | SVGElement | Text, props: Attributes, nextProps: Attributes) {
  for (const key in Object.assign({}, props, nextProps)) {
    const nextValue = nextProps[key];
    const value = ['value', 'checked'].indexOf(key) !== -1 ? (element as any)[key] : props[key];

    if (key !== 'children' && nextValue !== value) {
      setProps(element, key, nextValue, value);
    }
  }
}

export function removeElement(parent: HTMLElement | SVGElement | Text, element: HTMLElement | SVGElement | Text, attributes: Attributes) {
  const remove = () => {
    parent.removeChild(element);
  };
  
  if (attributes && attributes.onremove) {
    compose(remove, attributes.onremove)(element);
  } else {
    remove();
  }
}

export function getKey(node: Node) {
  return node && node.attributes && node.attributes.key;
}