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

const app = () => (
  <h1>
    <div>
      {count}<br/>
      <span>{text}</span>
    </div>
    <button onClick={(e) => { console.log(e); count += 1; render(); }}>+</button>
    <button onClick={() => { count -= 1; render(); }}>-</button>
    <input type="text" onInput={e => { console.log(e.target.value); text = e.target.value; render(); }} />
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