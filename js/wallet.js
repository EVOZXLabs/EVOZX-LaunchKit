let provider;
let signer;
let currentAccount = null;

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

        // refresh dashboard
        if (typeof loadFactoryStats === "function") {
            loadFactoryStats();
        }

    } catch (error) {

        console.error(error);

        alert(
            "Gagal menghubungkan wallet"
        );

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

    if (accounts.length === 0) {

        currentAccount = null;

        connectBtn.innerText =
            "Connect Wallet";

        networkDiv.innerText =
            "⚪ Wallet Not Connected";

        const myTokens =
            document.getElementById(
                "myTokens"
            );

        if (myTokens) {

            myTokens.innerHTML =
                "Connect wallet first";

        }

        return;

    }

    currentAccount =
        accounts[0];

    signer =
        provider.getSigner();

    connectBtn.innerText =
        shortenAddress(
            currentAccount
        );

    const chainId =
        await window.ethereum.request({

            method:
                "eth_chainId"

        });

    if (
        parseInt(chainId, 16) ===
        CONFIG.CHAIN_ID
    ) {

        networkDiv.innerText =
            "🟢 EVOZ Mainnet";

    } else {

        networkDiv.innerText =
            "🔴 Wrong Network";

    }

    // refresh data setelah wallet connect
    if (typeof loadFactoryStats === "function") {
        loadFactoryStats();
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
