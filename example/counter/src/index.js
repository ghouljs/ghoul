import app, { h } from '../../../lib';


app({
  state: {
    count: 0,
  },
  view: (state, actions, effects) => (
    <div>
      <div>{state.count}</div>
      <button onClick={actions['+']}>+</button>
      <button onClick={actions['-']}>-</button>
      <button onClick={effects['+1s']}>+1s</button>
    </div>
  ),
  actions: {
    '+': state => ({ count: state.count + 1 }),
    '-': state => ({ count: state.count - 1 }),
  },
  effects: {
    '+1s': (state, actions, effetcs, next) =>  {
      actions['-']();
      setTimeout(() => next(actions['+'](state)), 5000);
    },
  },
});