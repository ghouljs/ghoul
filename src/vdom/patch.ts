import {
  Node,
} from '../types';

import {
  createElement,
  updateElement,
  removeElement,
  getKey,
} from './utils';

export default function patch(parent: HTMLElement | SVGElement | Text, element: HTMLElement | SVGElement | Text, oldNode: Node | null, node: Node) {
  if (oldNode === node) {
    return element;
  } else if (oldNode == null) {
    element = parent.insertBefore(createElement(node), element);
  } else if (node.tag != null && node.tag === oldNode.tag) {
    updateElement(element, oldNode.attributes, node.attributes);

    const oldElements: any[] = [];
    const reusableChildren: { [key: string]: any } = {};
    for (const i in oldNode.attributes.children) {
      const oldChildNode = oldNode.attributes.children[i];
      const oldElement = (element as any).childNodes[i];
      (oldElements as any)[i] = oldElement;

      const key = getKey(oldChildNode);
      if (null != key) {
        reusableChildren[key] = {
          oldElement,
          oldNode: oldChildNode,
        };
      }
    }

    const usedKeys: { [key: string]: any } = {};
    let i = 0;
    let j = 0;
    while (j < node.attributes.children.length) {
      const oldChildNode = oldNode.attributes.children[i];
      const oldKey = getKey(oldChildNode);

      if (usedKeys[oldKey]) {
        i++;
        continue;
      }

      const oldElement = oldElements[i];
      const newChildNode = node.attributes.children[j];
      const newKey = getKey(newChildNode);

      if (null == newKey) {
        if (null == oldKey) {
          patch(element as any, oldElement, oldChildNode, newChildNode);
          j++;
        }
        i++;
      } else {
        const {
          oldElement: reusableElement = null,
          oldNode: reusableNode = null,
        } = reusableChildren[newKey] || {};

        // remove usedChildren;
        delete reusableChildren[newKey];

        if (oldKey === newKey) {
          patch(element as any, reusableElement as any, reusableNode, newChildNode);
        } else if (reusableElement) {
          element.insertBefore(reusableElement, oldElement);
          patch(element as any, reusableElement, reusableNode, newChildNode);
        } else {
          patch(element as any, oldElement, null, newChildNode);
        }

        usedKeys[newKey] = true;
        j++;
      }
    }

    while (i < oldNode.attributes.children.length) {
      const key = getKey(oldNode.attributes.children[i]);

      if (null == key || (key && !usedKeys[key])) {
        const oldChildNode = oldNode.attributes.children[i];
        removeElement(element, oldElements[i], oldChildNode.attributes);
      }

      i++;
    }

    for (const k in reusableChildren) {
      if (!usedKeys[k]) {
        removeElement(element, reusableChildren[k].oldElement, reusableChildren[k].oldNode.attributes);
      }
    }

  } else if (element && (element as any).nodeValue !== node) {
    if (typeof oldNode === 'string' && typeof node === 'string') {
      element.nodeValue = node;
    } else {
      const newElment = parent.insertBefore(createElement(node), element);
      removeElement(parent, element, oldNode.attributes);
      element = newElment;
    }
  }

  return element;
}