import * as invariant from 'invariant';
import { DirectiveHandler, Directives, Directive } from '../types';

const DIRECTIVE = 'v-';
const directives: Directives = {};

export function createDirective(name: string, handler: DirectiveHandler): void {
  invariant(handler, '[directive:error] handler should be defined.');

  if (typeof handler === 'function') {
    directives[name] = {
      oncreate: handler,
    };
  } else {
    directives[name] = handler;
  }
}

export const directive = createDirective;

export function removeDirective(name: string): void {
  delete directives[name];
}

export function isDirective(attribute: string): boolean {
  return attribute.indexOf(DIRECTIVE) === 0;
}

export function getDirective(name: string): Directive {
  const dn = name.indexOf(DIRECTIVE) === 0
  ? name.slice(DIRECTIVE.length)
  : name;
  const handler = directives[dn];
  invariant(directives, `Unknown directive named '${dn}(${name})', please registrer it first.`);

  return {
    name: dn,
    handler: handler as any,
  };
}

export function scanNodePropsAndCall(props: object = {}, call: (key: string, value?: any) => void) {
  for (const key in props) {
    if (isDirective(key)) {
      call.call(null, key, (props as any)[key]);
    }
  }
}

export function getDirectives() {
  return directives;
}

export default {
  getDirective,
  getDirectives,
  createDirective,
  removeDirective,
};