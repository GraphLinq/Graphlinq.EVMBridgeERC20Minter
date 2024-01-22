/** @type import('hardhat/config').HardhatUserConfig */
var secret = require("./secret");
require("@nomiclabs/hardhat-ethers");
require('@nomiclabs/hardhat-etherscan');
require('hardhat-deploy');

module.exports = {
  etherscan: {
    apiKey: {
      polygon: secret.POLYGON_SCAN_KEY,
      avalanche: secret.SNOWTRACE_KEY,
      opera: secret.FTM_SCAN_KEY,
      optimisticEthereum: secret.OP_SCAN_KEY
    }
  },
  networks: {
    glq: {
      // truffle deploy --network fantom
      url: `https://glq-dataseed.graphlinq.io`,
      accounts: [secret.MMENOMIC],
      gasPrice: 100000000000000,
      gasLimit: 100000000000000000000
    },
    localglq: {
      // truffle deploy --network fantom
      url: `http://localhost:8545`,
      accounts: [secret.MMENOMIC],
      gasPrice: 100000000000000,
      gasLimit: 100000000000000000000
    }
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};