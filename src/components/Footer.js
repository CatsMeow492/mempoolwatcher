import React from "react";

import { Layout } from 'antd';

const { Footer: AntdFooter } = Layout;

const Footer = () => {
  return (
    <AntdFooter style={{ textAlign: 'center' }}>MemPool Watcher ©2022 Created by Coinbase</AntdFooter>
  )
}

export default Footer;