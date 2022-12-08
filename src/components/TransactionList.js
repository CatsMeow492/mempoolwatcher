import React from "react";
import axios from "axios";
import { useState } from "react";

const TransactionList = ({ setTxns, txns}) => {

    const fetchData = () => {
      try {
        axios.get("http://localhost:3001/transactions-data").then((res) => {
          setTxns((prevState) => {
            return [...prevState, res.data];
          });
        });
      } catch (e) {
        console.log(e);
      }
    };
  
    return (
      <div>
        TransactionList
        {setInterval(() => {
          fetchData();
        }, 1000)}
      </div>
    );
  };
  

export default TransactionList;
