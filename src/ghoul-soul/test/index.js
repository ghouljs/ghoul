import expect from 'expect';
import soul from '../src';

const model = {
  namespace: 'app',
  state: 0,
  reducers: {
    '+'(state) {
      return state + 1;
    },
  },
  effects: {
    async '*+'(action, { dispatch }) {
      dispatch({ type: 'app@+' });
    },
  },
};

describe('soul', () => {
  it('normal', () => {
    const app = soul();

    app.model(model);

    app.start();
  });
});