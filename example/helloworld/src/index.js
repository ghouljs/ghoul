import { h, patch } from '../../../lib';

const app = () => (
  <h1>
    hello world: {new Date()}
    {Array.from('abcdefghijklmnopqrstuvwxyz0123456789').map((e, i) => (
      <div key={i + ''} style={{ transition: 'all .3s ease', width: `${200 + Math.random() * 400}px`, backgroundColor: 'yellow' }}>hh: bian</div>
    ))}
    <div style={{ transition: 'all .3s ease', width: `${200 + Math.random() * 400}px`, backgroundColor: 'purple' }}>hh: bian</div>
    <div style={{ transition: 'all .3s ease', width: `${200 + Math.random() * 400}px`, backgroundColor: 'green' }}>hh: bian</div>
    <div style={{ transition: 'all .3s ease', width: `${200 + Math.random() * 400}px`, backgroundColor: 'gray' }}>hh: bian</div>
    <div style={{ transition: 'all .3s ease', width: `${200 + Math.random() * 400}px`, backgroundColor: 'lightblue' }}>hh: bian</div>
  </h1>
);

console.log(app, app());

const parent = document.body;
let element;
let oldNode;
let node = app();

element = patch(parent, element, oldNode, node);

setInterval(() => { 
  oldNode = node;
  node = app();
  element = patch(parent, element, oldNode, node);
}, 1000);