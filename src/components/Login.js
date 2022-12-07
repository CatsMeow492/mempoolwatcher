import React from 'react';
import { useState } from 'react';

const Login = (props) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const detectProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      window.alert('No Ethereum Browser Detected! Check Metamask');
    }
    return provider;
  };

  const onLoginHandler = async () => {
    const provider = detectProvider();
    if (provider) {
      if (provider !== window.ethereum) {
        window.alert('Please use MetaMask');
      }
      setIsConnecting(true);
      await provider.request({
        method: 'eth_requestAccounts',
      });
      props.onLogin(provider);
      setIsConnecting(false); // Set isConnecting to false after calling onLogin
    }
  };

  return (
    <div>
      <button onClick={() => onLoginHandler()}>
        {isConnecting ? 'Connecting...' : 'Connect'}
      </button>
    </div>
  );
};

export default Login;
