import React, { Component } from 'react';

import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
class Page extends Component{
  render(){
    return(<Layout>
       <Sider>侧边栏</Sider>
      <Layout>
        <Header>头部</Header>
        <Content>内容</Content>
      </Layout>
    </Layout>);
  }
}
export default Page;
