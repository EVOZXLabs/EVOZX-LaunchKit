let provider;
let signer;
let currentAccount = null;

function shortenAddress(address) {

    if (!address) {

        return "";

    }

    return (

        address.substring(0, 6) +

        "..." +

        address.substring(
            address.length - 4
        )

    );

}

async function connectWallet() {

    if (!window.ethereum) {

        alert(

            "No EVM wallet detected.\n\nPlease use TokenPocket, MetaMask, OKX Wallet, Bitget Wallet, or Rabby Wallet."

        );

        return;

    }

    try {

        provider =
            new ethers.providers.Web3Provider(
                window.ethereum
            );

        await provider.send(
            "eth_requestAccounts",
            []
        );

        await switchToEvoz();

        await updateWalletInfo();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to connect wallet."
        );

    }

}

async function switchToEvoz() {

    const chainHex =

        "0x" +

        CONFIG.CHAIN_ID.toString(
            16
        );

    try {

        await window.ethereum.request({

            method:
                "wallet_switchEthereumChain",

            params: [

                {
                    chainId:
                        chainHex
                }

            ]

        });

    } catch (error) {

        if (
            error.code === 4902
        ) {

            try {

                await window.ethereum.request({

                    method:
                        "wallet_addEthereumChain",

                    params: [

                        {

                            chainId:
                                chainHex,

                            chainName:
                                CONFIG.CHAIN_NAME,

                            nativeCurrency: {

                                name:
                                    CONFIG.CURRENCY_SYMBOL,

                                symbol:
                                    CONFIG.CURRENCY_SYMBOL,

                                decimals:
                                    18

                            },

                            rpcUrls: [

                                CONFIG.RPC_URL

                            ],

                            blockExplorerUrls: [

                                CONFIG.EXPLORER_URL

                            ]

                        }

                    ]

                });

            } catch (addError) {

                console.error(addError);

            }

        }

    }

}

async function updateWalletInfo() {

    if (!window.ethereum) {

        return;

    }

    provider =
        new ethers.providers.Web3Provider(
            window.ethereum
        );

    const accounts =
        await provider.listAccounts();

    const connectBtn =
        document.getElementById(
            "connectBtn"
        );

    const networkDiv =
        document.getElementById(
            "networkStatus"
        );

    if (
        accounts.length === 0
    ) {

        currentAccount = null;

        window.currentAccount = null;

        if (connectBtn) {

            connectBtn.innerText =
                "Connect Wallet";

        }

        if (networkDiv) {

            networkDiv.innerText =
                "Wallet Not Connected";

        }

        return;

    }

    currentAccount =
        accounts[0];

    window.currentAccount =
        currentAccount;

    signer =
        provider.getSigner();

    if (connectBtn) {

        connectBtn.innerText =

            shortenAddress(
                currentAccount
            );

    }

    const chainId =
        await window.ethereum.request({

            method:
                "eth_chainId"

        });

    if (

        parseInt(
            chainId,
            16
        ) ===

        CONFIG.CHAIN_ID

    ) {

        if (networkDiv) {

            networkDiv.innerText =

                "Connected to EVOZ Mainnet";

        }

    } else {

        if (networkDiv) {

            networkDiv.innerText =

                "Unsupported Network";

        }

    }

    /* LOAD FACTORY DATA */

    if (

        typeof loadMyTokens ===
        "function"

    ) {

        await loadMyTokens();

    }

    if (

        typeof loadFactoryStats ===
        "function"

    ) {

        await loadFactoryStats();

    }

    /* LOAD EXCHANGE DATA */

    if (

        typeof loadExchangeInfo ===
        "function"

    ) {

        await loadExchangeInfo();

    }

    if (

        typeof loadExchangeStock ===
        "function"

    ) {

        await loadExchangeStock();

    }

}

async function checkConnection() {

    try {

        await updateWalletInfo();

    } catch (error) {

        console.error(error);

    }

}

window.addEventListener(

    "load",

    checkConnection

);

if (window.ethereum) {

    window.ethereum.on(

        "accountsChanged",

        async () => {

            await updateWalletInfo();

        }

    );

    window.ethereum.on(

        "chainChanged",

        async () => {

            await updateWalletInfo();

        }

    );

}
