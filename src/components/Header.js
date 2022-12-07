import React from "react";
import styled from "styled-components/macro";
import Login from "./Login"; // Import the Login component
import {MdOutlineAccountBalanceWallet} from 'react-icons/md'

function Header(props) {
  return (
    <Nav>
      <NavMenu>
        <a href="/home">
          <img src="/images/coinbase.svg" alt="HOME" />
          <span>MemPool Watcher</span>
        </a>
        {/* Display the currentAccount prop here /}
{/ If logged in display the current address if not display the Login components */}
        {props.currentAccount ? (
          <LoginVerif>
            <MdOutlineAccountBalanceWallet size={100} padding={50} />
            Connected with Address: {props.currentAccount}
          </LoginVerif>
        ) : (
          <Login onLogin={props.onLogin} onLogout={props.onLogout} />
        )}
      </NavMenu>
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #090b13;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  transform: translateZ(0);
  transition: opacity 0.5s ease-out;
  letter-spacing: 16px;
  z-index: 3;
`;

const NavMenu = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  justify-content: flex-end;
  padding: 0px;
  position: relative;
  margin-right: auto;
  margin-left: 25px;
  a {
    display: flex;
    align-items: center;
    padding: 0 12px;

    img {
      height: 10%;
      min-width: 20px;
      width: 10%;
      z-index: auto;
      padding: 3%;
    }
    span {
      color: rgb(249, 249, 249);
      font-size: 16px;
      letter-spacing: 1.42px;
      line-height: 1.08;
      padding: 2px 0px;
      white-space: nowrap;
      position: relative;
      margin-top: 0.5%;
      &:before {
        content: "";
        display: block;
        background-color: rgb(249, 249, 249);
        border-radius: 0px 0px 4px 4px;
        bottom: -6px;
        height: 2px;
        left: 0;
        opacity: 0;
        position: absolute;
        right: 0px;
        transform-origin: left center;
        transform: scaleX(0);
        transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
        visibility: hidden;
        width: auto;
      }
    }
    &:hover {
      span:before {
        transform: scaleX(1);
        visibility: visible;
        opacity: 1 !important;
      }
    }
  }
  // @media (max-width: 768px) {
  //     display: none;
  // }
`;

const UserImg = styled.img`
  height: 100%;
`;

const DropDown = styled.div`
  position: absolute;
  top: 48px;
  right: 0px;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size: 12px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
`;

const SignOut = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  ${UserImg} {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
  &:hover {
    ${DropDown} {
      opacity: 1;
      transitition-duration: 1s;
    }
  }
`;

const LoginVerif = styled.div`
  width: 100%;
height: 100%;
  font-size: .75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #090b13;
  color: #fff;
  letter-spacing: .2rem;
`;

export default Header;
