export { patch } from './vdom';
export { h } from './h';

import { ghoul, installPlugin } from './ghoul';

export default ghoul;

Object.assign(ghoul, {
  installPlugin,
});