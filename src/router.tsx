import React from 'react';
import PropTypes from 'prop-types';
import { router, routerRedux } from 'dva';
import dynamic from 'dva/dynamic';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import App from './routes/app';

const { Switch, Route, Redirect } = router;

const { ConnectedRouter } = routerRedux;

moment.locale('zh-cn');
interface IRoutersProps {
  history: any;
  app: any;
}

const Routers: React.FC<IRoutersProps> = ({ history, app }) => {
  const error = dynamic({
    app,
    component: () => import('./routes/index'),
  } as any);
  const routes = [
    {
      path: '/',
      component: () => import('./routes/index'),
    },
    {
      path: '/farm',
      component: () => import('./routes/farm'),
    },
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <App>
          <Switch>
            {/* <Route exact path="/" component={Home} /> */}
            <Route exact path="/app/index" render={() => <Redirect to="/" />} />
            {/* <Route exact path="/app/material" render={() => <Redirect to="/app" />} /> */}
            {routes.map(({ path, exact, ...dynamics }: any, key) => (
              <Route
                key={path}
                exact={exact !== false}
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                } as any) as any}
              />
            ))}
            <Route component={error as any} />
          </Switch>
        </App>
      </ConnectedRouter>
    </ConfigProvider>
  );
};

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
};

export default Routers;
