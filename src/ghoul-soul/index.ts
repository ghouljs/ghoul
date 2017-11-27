import createGhoulStore from './createGhoulStore';

const createStore = (reducers: any, initialState: any, plugins: any) => createGhoulStore({
  reducers,
  initialState,
  plugins,
});

export default createStore;
