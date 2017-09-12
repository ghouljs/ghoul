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
    outline: 'none',
    display: 'block',
    textDecoration: 'none',
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
    display: 'flex',
    flexDirection: 'column',
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
    position: 'relative',
    flex: 1,
    marginBottom: '.3rem',
    height: '1.5rem',
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
  btns: {
    fontSize: '.85rem',
    position: 'fixed',
    right: '1rem',
    bottom: '1rem',
    color: 'rgba(0, 0, 0, .78)',
  },
  btn: {
    marginTop: '.5rem',
    height: '40px',
    width: '40px',
    borderRadius: '50%',
    // border: '1px solid rgba(224, 224, 224, 1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef1f5',
    boxShadow: '0 6px 10px 0 rgba(0,0,0,0.3)',
    padding: 6,
    overflow: 'hidden',
  },
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
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
  <div className={cardClasses.title}>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  </div>
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

const Card = ({ key, style, className, link, avatar, repo, star, fork, desciption }) => (
  <a key={key} className={cardClasses.outer} href={link}>
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
  </a>
);

const SyncButton = ({ active, menus = [], onOpen, onSelect, ...others }) => (
  <div
    className={commonClasses.btns}
    {...others}
  >
    <div className={!active ? commonClasses.hidden : ''}>
      {menus.map((e, i) => (
        <div
          key={e.key}
          className={[commonClasses.btn, 'animated', active ? 'slideInRight' : ''].join(' ')}
          style={{ animationDelay: `${(menus.length - i - 1) * 100}ms` }}
          onClick={() => onSelect(e.key, e)}
        >
          {e.label}
        </div>
      ))}
    </div>
    <div
      className={commonClasses.btn} style={{ fontSize: '1.5rem' }}
      onClick={onOpen}
    >+</div>
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


// const logger = getState => action => {
//   console.log('[logger before]: ', getState(), action);
//   return action;
// };

// ghoul.installPlugin([logger]);

ghoul({
  state: {
    count: 0,
    loading: false,
    menusActive: false,
    menus: [{
      key: 'javascript',
      label: 'JS',
    }, {
      key: 'css',
      label: 'CSS',
    }, {
      key: 'go',
      label: 'GO',
    }, {
      key: 'python',
      label: 'python',
    }],
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
      <SyncButton
        active={state.menusActive}
        menus={state.menus}
        onOpen={() => action('switch/menu/status')}
        onSelect={lang => effect('sync', lang)}
      />
      <Loading active={state.loading}/>
    </Page>
  ),
  actions: {
    save: (state, data) => ({ data /* Object.assign({}, state.data, data) */ }),
    'sync/start': () => ({ loading: true }),
    'sync/end': () => ({ loading: false }),
    'switch/menu/status': state => ({ menusActive: !state.menusActive }),
  },
  effects: {
    sync: ({ action }, lang) => {
      action('sync/start');

      fetch(`https://trending-api-github.herokuapp.com/api/repo/${lang}/?since=daily`)
        .then(res => res.json())
        .then(r => r.data)
        .then(e => e.reduce(
          (a, b) => Object.assign(
            a, {
              [b.repo]: Object.assign({}, b, {
                key: b.repo,
                repo: b.repo.slice(1),
                link: b.repo_link,
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