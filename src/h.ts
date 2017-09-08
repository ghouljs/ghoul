import { Node, Attributes } from './types';

const stack: any[] = [];

export function h(tag: string | Function, attributes: Attributes = {}, ...args: any[]): Node {
  let node;
  let simple, lastSimple;
  const children = [];

  for (let i = arguments.length; i >= 2; i -= 1) {
    stack.push(arguments[i]);
  }

  while (stack.length) {
    if (Array.isArray(node = stack.pop())) {
      for (let i = node.length; i >= 0; i--) {
        stack.push(node[i]);
      }
    } else if (node != null && node !== true && node !== false) {
      if ((simple = typeof tag !== 'function')) {
        if (typeof node === 'number' || node.tag == null) {
          node = node + '';
        } else if (typeof node !== 'string') {
          simple = false;
        }
      }

      if (simple && lastSimple) {
        children[children.length - 1] += node;
      } else {
        children.push(node);
      }

      lastSimple = simple;
    }
  }

  return typeof tag === 'string'
    ? { tag, attributes: { ...attributes, children } }
    : tag({ ...attributes, children });
}