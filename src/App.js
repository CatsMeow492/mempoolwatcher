import React, { useState } from "react";
import { Layout } from 'antd';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";
import Tracking from "./components/Tracking";
import Web3 from "web3";

import 'antd/dist/reset.css';
import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [balance, setBalance] = useState(0);

  const onLogin = async (provider) => {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask!");
    } else if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0]);
      const accBalanceEth = web3.utils.fromWei(
        await web3.eth.getBalance(accounts[0]),
        "ether"
      );

      setBalance(Number(accBalanceEth).toFixed(6));
      setIsConnected(true);
    }
  };

  const onLogout = () => {
    setIsConnected(false);
  };

  return (
    <Layout>
      <Header currentAccount={currentAccount} onLogin={onLogin} onLogout={onLogout} />
      <Body>
        <Tracking />
      </Body>
      <Footer />
    </Layout>
  );
}

export default App;
