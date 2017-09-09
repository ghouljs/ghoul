import { h, patch } from '../../../lib';

const Card = (props) => {
  const { style, children } = props;
  return (
    <div style={style}>
      {children}
    </div>
  );
}

let aref;

const parent = document.body;
let element;
let oldNode;
let node;
let count = 0;
let text = '';
let close = false;

const app = () => (
  <h1>
    {close ? <div key="o">closed</div> : (
      <div
        key="o"
        oncreate={(e) => console.log('create: ', e)}
        onupdate={(e) => console.log('update: ', e)}
        onremove={(e) => console.log('remove: ', e)}
      >
        {count}<br/>
        <span>{text}</span>
      </div>
    )}
    <button onClick={(e) => { count += 1; render(); }}>+</button>
    <button onClick={() => { count -= 1; render(); }}>-</button>
    <input type="text" onInput={e => { console.log(e.target.value); text = e.target.value; render(); }} />
    <button onClick={(e) => { close = !close; render(); }}>{close ? '开' : '关'}</button>
  </h1>
);

function render() {
  oldNode = node;
  node = app();
  element = patch(parent, element, oldNode, node);
}

render();
// console.log(aref);

// setInterval(() => { 
//   oldNode = node;
//   node = app();
//   element = patch(parent, element, oldNode, node);
// }, 1000);