import React from "react";
import { Layout } from 'antd';
import styled from "styled-components/macro";
import truncateEthAddress from 'truncate-eth-address'
import Login from "./Login"; // Import the Login component
import { MdOutlineAccountBalanceWallet } from 'react-icons/md'

const { Header: AntHeader } = Layout;

const Header = (props) => {

  return (
    <AntHeader style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
      <HeaderContent>
        <LogoWrapper>
          <Logo src="/images/coinbase-icon.png" alt="coinbase" />
          <Title>MemPool Watcher</Title>
        </LogoWrapper>
        <div>
          {props.currentAccount ? (
            <LoginVerif>
              <MdOutlineAccountBalanceWallet size={30} margin={10} />
              <span>{truncateEthAddress(props.currentAccount)}</span>
            </LoginVerif>
          ) : (
            <Login onLogin={props.onLogin} onLogout={props.onLogout} />
          )}
        </div>
      </HeaderContent>
    </AntHeader>
  )
}

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 32px;
  height:32px;
`;

const Title = styled.span`
  font-size: 24px;
  color: white;
  margin-left: 16px;
`;

const LoginVerif = styled.div`
  font-size: .75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  letter-spacing: .2rem;

  span {
    margin-left: 8px;
    font-size: 14px;
  }
`;

export default Header;
