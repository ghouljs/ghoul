import { directive, patch } from './vdom';
import { h } from './h';

import { ghoul, installPlugin } from './ghoul';


export {
  patch, h,
  directive,
};
export default ghoul;

Object.assign(ghoul, {
  use: installPlugin,
  directive: directive,
});
