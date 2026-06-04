const CONFIG = {

FACTORY_ADDRESS:
"0x3F810a44D29a4f0fF7880641E69EBCBc076dA220",

CHAIN_ID:
7332,

CHAIN_NAME:
"EVOZ Mainnet",

RPC_URL:
"https://rpc.evozscan.com",

EXPLORER_URL:
"https://evozscan.com"

};

const FACTORY_ABI = [

"function createToken(string name_, string symbol_, uint256 supply_) external returns(address)",

"function allTokens(uint256) view returns(address,address,string,string,uint256,uint256)",

"function getToken(uint256) view returns(address,address,string memory,string memory,uint256,uint256)",

"function allTokensLength() view returns(uint256)",

"event TokenCreated(address indexed creator,address indexed token,string name,string symbol,uint256 supply)"

];
