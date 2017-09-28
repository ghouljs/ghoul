declare var process: any;

function noop() {
  return;
}

function dispatch(action: any): any {
  return action;
}

function log(...args: any[]) {
  if (process || process.env || process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
}

export default function createLogger(): Function {
  return ({ getState = noop }) => (next = dispatch) => (action = {}) => {
    log('before: ', (action as any).type, getState());
    next(action);
    log('after: ', (action as any).type, getState());
  };
}
