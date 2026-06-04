const CONFIG = {

    FACTORY_ADDRESS:
        "0x3F810a44D29a4f0fF7880641E69EBCBc076dA220",

    CHAIN_ID: 805,

    CHAIN_NAME: "Evoz Mainnet",

    RPC_URL:
        "https://rpc.evozscan.com",

    EXPLORER_URL:
        "https://evozscan.com",

    CURRENCY_SYMBOL:
        "EVOZ"

};

const FACTORY_ABI = [

    "function createToken(string name_, string symbol_, uint256 supply_) external returns(address)",

    "function allTokens(uint256) view returns(address,address,string,string,uint256,uint256)",

    "function getToken(uint256) view returns(address,address,string,string,uint256,uint256)",

    "function totalTokens() view returns(uint256)",

    "event TokenCreated(address indexed creator,address indexed token,string name,string symbol,uint256 supply)"

];
