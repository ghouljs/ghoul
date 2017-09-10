import Ghoul, { h } from '../../../lib';

Ghoul({
  state: {
    count: 0,
  },
  view: (state, action) => (
    <h1>
      <div>
        {state.count}<br/>
      </div>
      <button onClick={() => action('+1')}>+</button>
      <button onClick={() => action('-1')}>-</button>
    </h1>
  ),
  actions: {
    '+1': state => ({ count: state.count + 1 }),
    '-1': state => ({ count: state.count - 1}),
  },
});