const express = require("express");
const Web3 = require("web3");
require('dotenv').config()
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

const url = process.env.WSSURL

app.use(cors());
app.use(express.json());

var options = {
  timeout: 30000,
  clientConfig: {
    maxReceivedFrameSize: 100000000,
    maxReceivedMessageSize: 100000000,
  },
  reconnect: {
    auto: true,
    delay: 5000,
    maxAttempts: 15,
    onTimeout: false,
  },
};

var web3 = new Web3(new Web3.providers.WebsocketProvider(url, options));
const subscription = web3.eth.subscribe("pendingTransactions", (err, res) => {
  if (err) console.error(err);
});

let response;

subscription.on("data", (txHash) => {
  setTimeout(async () => {
    try {
      let tx = await web3.eth.getTransaction(txHash);
      response = tx
    } catch (err) {
      console.error(err);
    }
  });
});

app.get("/transactions-data", async (req, res) => {
 
  res.json(response);
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});