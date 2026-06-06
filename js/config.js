const CONFIG = {

/* FACTORY */

FACTORY_ADDRESS:
    "0x3F810a44D29a4f0fF7880641E69EBCBc076dA220",

/* EVOZX TOKEN */

EVOZX_ADDRESS:
    "0x032a962F62Fc1cbc15B19767Aa138deA3B454B74",

/* EVOZX EXCHANGE */

EXCHANGE_ADDRESS:
    "0x24cCb720F7F8b9247FB50A88F6A6a5A5DD7d9ab8",

TREASURY_ADDRESS:
    "0x50Cd30Ff7f0fbBD9d0FDe1F60DE8c52D6F390c5C",

EXCHANGE_RATE:
    5,

/* NETWORK */

CHAIN_ID:
    805,

CHAIN_NAME:
    "EVOZ Mainnet",

RPC_URL:
    "https://rpc.evozscan.com",

EXPLORER_URL:
    "https://evozscan.com",

CURRENCY_SYMBOL:
    "EVOZ"

};

/* FACTORY ABI */

const FACTORY_ABI = [

{
    "anonymous": false,
    "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "creator",
            "type": "address"
        },
        {
            "indexed": true,
            "internalType": "address",
            "name": "token",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "name",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "symbol",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "supply",
            "type": "uint256"
        }
    ],
    "name": "TokenCreated",
    "type": "event"
},

{
    "inputs": [
        {
            "internalType": "string",
            "name": "name_",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "symbol_",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "supply_",
            "type": "uint256"
        }
    ],
    "name": "createToken",
    "outputs": [
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
},

{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
        }
    ],
    "name": "getToken",
    "outputs": [
        {
            "internalType": "address",
            "name": "token",
            "type": "address"
        },
        {
            "internalType": "address",
            "name": "creator",
            "type": "address"
        },
        {
            "internalType": "string",
            "name": "name",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "supply",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},

{
    "inputs": [],
    "name": "totalTokens",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}

];

/* EVOZX EXCHANGE ABI */

const EXCHANGE_ABI = [

{
    "inputs": [],
    "name": "buyEVOZX",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
},

{
    "inputs": [],
    "name": "getAvailableStock",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},

{
    "inputs": [],
    "name": "rate",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}

];

/* ERC20 ABI */

const ERC20_ABI = [

{
    "inputs": [
        {
            "internalType": "address",
            "name": "account",
            "type": "address"
        }
    ],
    "name": "balanceOf",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},

{
    "inputs": [],
    "name": "decimals",
    "outputs": [
        {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}

];
