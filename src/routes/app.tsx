import React, { ReactNode } from 'react';
import { Layout } from 'antd';
import styles from './app.less';
// require('dotenv').config()

interface IAppProps {
  children: ReactNode;
}

const { Content } = Layout;


const App: React.FC<IAppProps> = ({ children }) => {
  return (
    <div>
      <Layout className={styles.layout}>
        {/* <Header className={styles.header} /> */}
        <Content className={styles.content} id="content">
          {children}
        </Content>
      </Layout>
    </div>
  );
};

export default App;
