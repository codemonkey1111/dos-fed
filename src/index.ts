import '@babel/polyfill';
import 'url-polyfill';
import dva, { DvaInstance } from 'dva';
import { createHashHistory } from 'history';
import { message } from 'antd';
import createLoading from 'dva-loading';

import './index.less';

export interface IDvaInstance extends DvaInstance {
  _store?: any;
}

export interface versionInfoProps {
  VERSION: string;
  ENV: 'DEV' | 'TEST' | 'PRE' | 'PROD';
  INIT: boolean;
}
declare global {
  interface Window {
    __app?: IDvaInstance;
    versionInfo: versionInfoProps;
    spm: any;
  }
}

// 1. Initialize
const app: IDvaInstance = dva({
  ...createLoading({
    effects: true,
  }),
  history: createHashHistory(),
  onError(error) {
    message.error(error.message);
  },
});

// 3. Router
app.router(require('./router').default);

// 4. Start
app.start('#root');

export default app._store;

window.__app = app;
