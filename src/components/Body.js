import React from "react";
import styled from "styled-components/macro";

import { Layout } from 'antd';

const { Content } = Layout;

const Body = ({ children }) => {
  return (
    <Content className="site-layout" style={{ padding: '0 50px' }}>
      <Wrapper>
        {children}
      </Wrapper>
    </Content>
  )
}

const Wrapper = styled.div`
  padding: 24;
  min-height: calc(100vh - 160px);
  margin-top: 32px;
`;

export default Body;