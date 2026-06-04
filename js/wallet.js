let provider;
let signer;
let currentAccount;

function shortenAddress(address) {

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
            "Wallet EVM tidak terdeteksi.\n\nGunakan TokenPocket, OKX Wallet, Bitget Wallet, Rabby atau MetaMask."
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

    }

}

async function switchToEvoz() {

    const chainHex =
        "0x" +
        CONFIG.CHAIN_ID.toString(16);

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

        if (error.code === 4902) {

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

    if (accounts.length === 0) {

        document.getElementById(
            "connectBtn"
        ).innerText =
            "Connect Wallet";

        document.getElementById(
            "walletAddress"
        ).innerText =
            "Supported by EVOZX";

        return;

    }

    currentAccount =
        accounts[0];

    signer =
        provider.getSigner();

    document.getElementById(
        "connectBtn"
    ).innerText =
        shortenAddress(
            currentAccount
        );

    document.getElementById(
        "walletAddress"
    ).innerText =
        "Supported by EVOZX";

    const chainId =
        await window.ethereum.request({

            method:
                "eth_chainId"

        });

    const networkDiv =
        document.getElementById(
            "networkStatus"
        );

    if (
        parseInt(chainId, 16) ===
        CONFIG.CHAIN_ID
    ) {

        networkDiv.innerText =
            "Network: EVOZ Mainnet";

    } else {

        networkDiv.innerText =
            "Network: Wrong Network";

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
        updateWalletInfo
    );

    window.ethereum.on(
        "chainChanged",
        updateWalletInfo
    );

}
