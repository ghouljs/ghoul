import ghoul, { h } from '../../../lib';
import jss from 'jss';
import preset from 'jss-preset-default';
import 'whatwg-fetch';

const meta = document.createElement('meta');
meta.setAttribute('name', 'viewport');
meta.setAttribute('content', 'width=device-width, initial-scale=1, user-scalable=no');
document.head.appendChild(meta);
let link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', '//at.alicdn.com/t/font_411159_s8tqvcgzx426gvi.css');
document.head.appendChild(link);
link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css');
document.head.appendChild(link);

jss.setup(preset());

const PageStyle = jss.createStyleSheet({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    '-webkit-overflow-scrolling': 'touch',
    backgroundImage: 'linear-gradient(to top, #37ecba 0%, #72afd3 100%);',
  },
}).attach();

const { classes: cardClasses } = jss.createStyleSheet({
  outer: {
    padding: 16,
    position: 'relative',
  },
  container: {
    color: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    boxSizing: 'border-box',
    fontFamily: 'Robot, sans-serif',
    '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, .12) 0px 1px 4px',
    borderRadius: 2,
    zIndex: 1,
  },
  top: {
    padding: 16,
    fontWeight: 500,
    boxSizing: 'border-box',
    position: 'relative',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  },
  simple: {
    flex: 1,
  },
  counter: {
    flex: 1,
    display: 'flex',
    fontSize: '.75rem',
  },
  divide: {
    margin: '-1px 8px 0px',
    height: 1,
    border: 'none',
    backgroundColor: 'rgba(224, 224, 224, 1)',
  },
  avatar: {
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(188, 188, 188)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    borderRadius: '50%',
    height: 40,
    width: 40,
    marginRight: 16,
    userSelect: 'none',
  },
  title: {
    flex: 1,
    marginBottom: '.3rem',
  },
  star: {
    flex: 1,
  },
  fork: {
    flex: 1,
  },
  desciption: {
    padding: 16,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.87)',
  },
}).attach();

const { classes: commonClasses } = jss.createStyleSheet({
  fixed: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mask: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    transition: 'all .3s ease-in-out',
    backgroundColor: 'rgba(0, 0, 0, .18)',
    opacity: 1,
    pointerEvents: 'auto',
    zIndex: 999,
    '-webkit-tap-highlight-color': 'rgba(0, 0, 0)',
  },
  noMask: {
    opacity: 0,
    pointerEvents: 'none',
  },
  ['@keyframes rotates']: {
    to: {
      transform: 'rotate(1turn)',
    },
  },
  ['@keyframes dash']: {
    '0%': {
      strokeDasharray: '1, 200',
      strokeDashoffset: 0,
    },
    '50%': {
      strokeDasharray: '90, 150',
      strokeDashoffset: '-40px',
    },
    '100%': {
      strokeDasharray: '90, 150',
      strokeDashoffset: '-120px',
    },
  },
  loading: {
    width: '3rem',
    height: '3rem',
    animation: 'rotates 2s linear infinite',
  },
  circle: {
    stroke: 'rgba(224, 224, 224, 1)',
    animation: 'dash 1.5s ease-in-out infinite',
  },
  ['@keyframes fadeAndSlideInUp']: {
    '0%': {
      opacity: 0,
      transform: 'translate3d(0, 100%, 0)',
      visibility: 'visible',
    },
    '100%': {
      opacity: 1,
      transform: 'translateZ(0)',
    },
  },
}).attach();

const Page = ({ children }) => {
  return (
    <div className={PageStyle.classes.root}>
      {children}
    </div>
  );
};

const Avatar = ({ src }) => (
  <img src={src} className={cardClasses.avatar} />
);

const Title = ({ text }) => (
  <div className={cardClasses.title}>{text}</div>
);

const Star = ({ count }) => (
  <span className={cardClasses.star}>{count}</span>
);

const Fork = ({ count }) => (
  <span className={cardClasses.fork}>{count}</span>
);

const Divide = () => (
  <div className={cardClasses.divide} />
);

const Desciption = ({ children }) => (
  <div className={cardClasses.desciption}>{children}</div>
);

const Icon = ({ name }) => (
  <i
    className={`elfen elfen-${name}`}
    style={{ fontSize: '.85rem', marginRight: '.25rem' }}
  />
);

const Card = ({ style, className, avatar, repo, star, fork, desciption }) => (
  <div className={cardClasses.outer}>
    <div style={style} className={[cardClasses.container, className].join(' ')}>
      <div className={cardClasses.top}>
        <Avatar src={avatar} />
        <div className={cardClasses.simple}>
          <Title text={repo} />
          <div className={cardClasses.counter}>
            <div style={{ flex: 1 }}>
              <Icon name="star" />
              <Star count={star} />
            </div>
            <div style={{ flex: 1 }}>
              <Icon name="fork" />
              <Fork count={fork} />
            </div>
          </div>
        </div>
      </div>
      <Divide />
      <Desciption>
        {desciption}
      </Desciption>
    </div>
  </div>
);

const SyncButton = (props) => (
  <div
    style={{
      fontSize: '1.5rem',
      height: '40px',
      width: '40px',
      borderRadius: '50%',
      border: '1px solid rgba(224, 224, 224, 1)',
      position: 'fixed',
      right: '1rem',
      bottom: '1rem',
      color: 'rgba(0, 0, 0, .78)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#eef1f5',
      boxShadow: '0 6px 10px 0 rgba(0,0,0,0.3)',
    }}
    {...props}
  >
    +
  </div>
);

const Mask = ({ active }) => (
  <div
    className={[commonClasses.mask, active ? '' : commonClasses.noMask].join(' ')}
    style={{
      opacity: active ? 1 : 0, /* @TODO opacity have been eatten*/
      pointerEvents: active ? 'auto' : 'none',
    }}
  />
);

const Loader = () => (
  <svg
    className={commonClasses.loading}
    viewBox="25 25 50 50"
  >
    <circle
      cx="50"
      cy="50"
      r="20"
      fill="none"
      stroke="#20a0ff"
      stroke-dasharray="90 150"
      stroke-width="5"
      stroke-linecap="round"
      className={commonClasses.circle}
    />
  </svg>
);

const Loading = ({ active }) => (
  <div>
    <Mask active={active} />
    <div className={[commonClasses.fixed, commonClasses.center, active ? '' : commonClasses.noMask].join(' ')}>
      <Loader />
    </div>
  </div>
);

ghoul({
  state: {
    count: 0,
    loading: false,
    data: {},
  },
  view: (state, action, effect) => (
    <Page>
      {
        Object.values(state.data).map((e, i) => (
          <Card
            {...e}
            className={`animated`}
            style={{ animationName: 'fadeAndSlideInUp', animationDelay: `${i * 100}ms` }}
          />
        ))
      }
      <SyncButton onClick={() => effect('sync')} />
      <Loading active={state.loading}/>
    </Page>
  ),
  actions: {
    '+': (state, n = 1) => ({ count: state.count + n }),
    '-': (state, n = 1) => ({ count: state.count - n }),
    save: (state, data) => ({ data: Object.assign({}, state.data, data) }),
    'sync/start': () => ({ loading: true }),
    'sync/end': () => ({ loading: false }),
  },
  effects: {
    '+1s': ({ state, action, effect, next }, n = 1) =>  {
      action('-', n);
      setTimeout(() => next(action('+', 3)), 5000);
    },
    sync: ({ action }) => {
      action('sync/start');

      fetch('https://trending-api-github.herokuapp.com/api/repo/javascript/?since=daily')
        .then(res => res.json())
        .then(r => r.data)
        .then(e => e.reduce(
          (a, b) => Object.assign(
            a, {
              [b.repo]: Object.assign({}, b, {
                key: b.repo,
                repo: b.repo.slice(1),
                avatar: b.avatars[0],
                desciption: b.desc,
                star: b.stars,
                fork: b.forks,
              })
            }), {}
          )
        )
        .then(data => action('save', data))
        .then(e => action('sync/end'));
    },
  },
  subscriptions: {
    setup({ effect }) {
      effect('sync');
    },
  },
});