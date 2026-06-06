/* =========================================
   EVOZX EXCHANGE
========================================= */

let CURRENT_RATE = CONFIG.EXCHANGE_RATE;

/* =========================================
   LOAD STOCK + RATE
========================================= */

async function loadExchangeStock() {

    try {

        const provider =
            new ethers.providers.JsonRpcProvider(
                CONFIG.RPC_URL
            );

        const exchange =
            new ethers.Contract(
                CONFIG.EXCHANGE_ADDRESS,
                EXCHANGE_ABI,
                provider
            );

        /* LOAD RATE */

        try {

            const rate =
                await exchange.rate();

            CURRENT_RATE =
                Number(rate);

        } catch {

            CURRENT_RATE =
                CONFIG.EXCHANGE_RATE;

        }

        const rateElement =
            document.getElementById(
                "exchangeRate"
            );

        if (rateElement) {

            rateElement.innerHTML =

                `
                <strong>
                    Current Rate
                </strong>

                <br><br>

                ${CURRENT_RATE} EVOZ = 1 EVOZX
                `;
        }

        /* LOAD STOCK */

        const stock =
            await exchange.getAvailableStock();

        const formattedStock =
            Number(
                ethers.utils.formatUnits(
                    stock,
                    18
                )
            ).toLocaleString();

        const stockElement =
            document.getElementById(
                "exchangeStock"
            );

        if (stockElement) {

            stockElement.innerHTML =

                `
                ${formattedStock}
                EVOZX Available
                `;
        }

    } catch (error) {

        console.error(error);

        document.getElementById(
            "exchangeStock"
        ).innerHTML =

            "Stock Unavailable";

    }

}

/* =========================================
   CALCULATE RECEIVE
========================================= */

function calculateEVOZX() {

    const amount =
        parseFloat(
            document.getElementById(
                "buyAmount"
            ).value
        ) || 0;

    const receive =
        amount / CURRENT_RATE;

    document.getElementById(
        "receiveAmount"
    ).innerHTML =

        `
        Receive:
        ${receive.toLocaleString()}
        EVOZX
        `;

}

/* =========================================
   ADD TOKEN TO WALLET
========================================= */

async function addEVOZXToWallet() {

    try {

        if (!window.ethereum) {

            alert(
                "Wallet not detected."
            );

            return;
        }

        await window.ethereum.request({

            method:
                "wallet_watchAsset",

            params: {

                type:
                    "ERC20",

                options: {

                    address:
                        CONFIG.EVOZX_ADDRESS,

                    symbol:
                        "EVOZX",

                    decimals:
                        18

                }

            }

        });

    } catch (error) {

        console.error(error);

    }

}

/* =========================================
   BUY EVOZX
========================================= */

async function buyEVOZX() {

    try {

        if (!window.ethereum) {

            alert(
                "Wallet not detected."
            );

            return;

        }

        const amount =
            document.getElementById(
                "buyAmount"
            ).value;

        if (
            !amount ||
            Number(amount) <= 0
        ) {

            alert(
                "Enter EVOZ amount."
            );

            return;

        }

        document.getElementById(
            "exchangeStatus"
        ).innerHTML =

            `
            <div class="loading"></div>
            Waiting for wallet confirmation...
            `;

        const provider =
            new ethers.providers.Web3Provider(
                window.ethereum
            );

        const signer =
            provider.getSigner();

        const exchange =
            new ethers.Contract(
                CONFIG.EXCHANGE_ADDRESS,
                EXCHANGE_ABI,
                signer
            );

        const tx =
            await exchange.buyEVOZX({

                value:
                    ethers.utils.parseEther(
                        amount
                    )

            });

        document.getElementById(
            "exchangeStatus"
        ).innerHTML =

            `
            <div class="loading"></div>
            Processing transaction...
            `;

        await tx.wait();

        const received =
            Number(amount) /
            CURRENT_RATE;

        document.getElementById(
            "exchangeStatus"
        ).innerHTML =

            `
            <div class="exchange-success">

                <strong>
                    ✅ Purchase Successful
                </strong>

                <br><br>

                Received

                <br>

                <strong>
                    ${received.toLocaleString()}
                    EVOZX
                </strong>

                <br><br>

                <button
                class="add-wallet-btn"
                onclick="addEVOZXToWallet()">

                    Add EVOZX To Wallet

                </button>

                <br><br>

                <a
                class="explorer-btn"
                href="${CONFIG.EXPLORER_URL}/tx/${tx.hash}"
                target="_blank">

                    View Transaction

                </a>

            </div>
            `;

        document.getElementById(
            "buyAmount"
        ).value = "";

        document.getElementById(
            "receiveAmount"
        ).innerHTML =

            "Receive: 0 EVOZX";

        await loadExchangeStock();

    } catch (error) {

        console.error(error);

        document.getElementById(
            "exchangeStatus"
        ).innerHTML =

            `
            ❌ Transaction Failed
            <br><br>
            ${error.message}
            `;

    }

}

/* =========================================
   AUTO LOAD
========================================= */

window.addEventListener(

    "load",

    async () => {

        await loadExchangeStock();

    }

);
