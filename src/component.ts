import { Props, Context, State } from './types';

// const FORCE_RENDER = 'FORCE_RENDER';

export class Component {
  props: Props;
  context: Context;
  state: State;

  constructor(props: Props, context: Context) {
    this.props = props;
    this.context = context;
    this.state = this.state || {};
  }
}

Object.assign(Component.prototype, {
  setState(state: State | Function, callback: any) {
    let s = this.state;
    if (!this.prevState) this.prevState = Object.assign({}, s);
    Object.assign(s, typeof state === 'function' ? state(s, this.props) : state);
    if (callback) (this._renderCallbacks = (this._renderCallbacks || []).push(callback));
    // enqueueRender(this);
  },
  
  forceUpdate(callback: any) {
    if (callback) (this._renderCallbacks = (this._renderCallbacks || [])).push(callback);
    // renderComponent(this, FORCE_RENDER);
  },

  render() {},
});