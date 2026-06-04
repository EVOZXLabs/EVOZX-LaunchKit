let provider;
let signer;
let currentAccount;

async function connectWallet() {

    if (!window.ethereum) {

        alert("MetaMask tidak ditemukan");
        return;

    }

    try {

        await switchToEvoz();

        provider =
            new ethers.providers.Web3Provider(
                window.ethereum
            );

        await provider.send(
            "eth_requestAccounts",
            []
        );

        signer = provider.getSigner();

        currentAccount =
            await signer.getAddress();

        document.getElementById(
            "walletAddress"
        ).innerText =
            currentAccount;

    } catch (error) {

        console.error(error);

        document.getElementById(
            "walletAddress"
        ).innerText =
            "Connection Failed";

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

        } else {

            throw error;

        }

    }

}

async function checkConnection() {

    if (!window.ethereum) {
        return;
    }

    provider =
        new ethers.providers.Web3Provider(
            window.ethereum
        );

    const accounts =
        await provider.listAccounts();

    if (accounts.length > 0) {

        currentAccount =
            accounts[0];

        document.getElementById(
            "walletAddress"
        ).innerText =
            currentAccount;

    }

}

window.addEventListener(
    "load",
    checkConnection
);

if (window.ethereum) {

    window.ethereum.on(
        "accountsChanged",
        function(accounts) {

            if (accounts.length > 0) {

                currentAccount =
                    accounts[0];

                document.getElementById(
                    "walletAddress"
                ).innerText =
                    currentAccount;

            } else {

                document.getElementById(
                    "walletAddress"
                ).innerText =
                    "Wallet not connected";

            }

        }
    );

    window.ethereum.on(
        "chainChanged",
        function() {

            window.location.reload();

        }
    );

}
