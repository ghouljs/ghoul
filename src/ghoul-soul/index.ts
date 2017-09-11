import createGhoulStore from './createGhoulStore';

const createStore = (actions: any, initialState: any, plugins: any) => createGhoulStore({
  actions,
  initialState,
  plugins,
});

export default createStore;