import { Node, Attributes } from '../types';

const noop = () => {};

export function compose(...funcs: Function[]) {
  if (funcs.length === 0) return noop;

  if (funcs.length === 1) return funcs[0];

  return  funcs.reduce((a, b) => (...args: Function[]) => a(b(...args)));
}

function setProps(element: HTMLElement | SVGElement | Text, key: string, value: any = {}, oldValue: any = {}, isSVG?: boolean) {
  if (key === 'key' || key === 'children') {
    return true;
  } else if (key === 'ref') {
    if ((element as any).ref == null) {
      (element as any).ref = value;
      value(element);
    }
  } else if (key === 'class' || key === 'className') {
    if (isSVG) {
      (element as any).setAttribute('class', value);
    } else {
      (element as any).className = value || '';
    }
  } else if (key === 'style') {
    for (const i in Object.assign({}, oldValue, value)) {
      if (typeof i === 'string') {
        (element as any).style[i] = value[i] || '';
      }
    }
  } else if (key === 'dangerouslySetInnerHTML') {
    if (value) (element as any).innerHTML = value.__html || '';
  } else if (key.indexOf('on') !== -1) {
    // event listener
    // if (value && (element as any)[key.toLowerCase()] == null) {
    if (value) {
      (element as any)[key.toLowerCase()] = typeof value === 'function' ? value : noop;
    } else {
      (element as any)[key.toLowerCase()] = null;
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

export function createElement(node: Node, isSVG?: boolean | undefined): HTMLElement | SVGElement | Text {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  } else if (node.tag == null) {
    return document.createTextNode(node.toString());
  } else {
    const element: HTMLElement | SVGElement = (isSVG = (node.tag === 'svg' || isSVG))
      ? document.createElementNS('http://www.w3.org/2000/svg', node.tag)
      : document.createElement(node.tag);

    // 1 self
    for (const k in node.attributes) {
      setProps(element, k, node.attributes[k], null, isSVG);
    }

    // 2 children
    for (const childNode of node.attributes.children) {
      element.appendChild(createElement(childNode, isSVG));
    }

    // lifecycle: 1 oncreate
    if (node.attributes && node.attributes.onCreate) {
      node.attributes.onCreate(element);
    }

    return element;
  }
}


export function updateElement(element: HTMLElement | SVGElement | Text, props: Attributes, nextProps: Attributes) {
  let needBeUpdated = false;
  for (const key in Object.assign({}, props, nextProps)) {
    const nextValue = nextProps[key];
    const value = ['value', 'checked'].indexOf(key) !== -1 ? (element as any)[key] : props[key];

    if (key !== 'children' && nextValue !== value) {
      needBeUpdated = true;
      setProps(element, key, nextValue, value, false);
    } else if (key === 'children' && nextValue.length !== value.length) {
      needBeUpdated = true;
    }
  }

  if (needBeUpdated && props && props.onUpdate) {
    props.onUpdate(element);
  }
}

export function removeElement(parent: HTMLElement | SVGElement | Text, element: HTMLElement | SVGElement | Text, props: Attributes) {
  const remove = () => {
    parent.removeChild(element);
  };
  

  // lifecycle: onremove
  if (props && props.onRemove) {
    compose(remove, props.onRemove)(element);
  } else {
    remove();
  }
}

export function getKey(node: Node) {
  return node && node.attributes && node.attributes.key || undefined;
}
