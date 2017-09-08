import { h, patch } from '../../../lib';

const Card = (props) => {
  const { style, children } = props;
  return (
    <div style={style}>
      {children}
    </div>
  );
}

const app = () => (
  <h1>
    <Card style={{ transition: 'all .3s ease', width: `${200 + Math.random() * 400}px`, backgroundColor: 'purple' }}>
      hh: bian
    </Card>
    <Card style={{ transition: 'all .3s ease', width: `${200 + Math.random() * 400}px`, backgroundColor: 'purple' }}>
      hh: bian
    </Card>
    <Card style={{ transition: 'all .3s ease', width: `${200 + Math.random() * 400}px`, backgroundColor: 'purple' }}>
      hh: bian
    </Card>
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