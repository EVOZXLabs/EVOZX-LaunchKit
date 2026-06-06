async function calculateEVOZX() {

    try {

        const amount =
            parseFloat(
                document
                    .getElementById(
                        "buyAmount"
                    )
                    .value || 0
            );

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

        const rate =
            await exchange.rate();

        const receive =
            amount /
            Number(rate);

        document.getElementById(
            "receiveAmount"
        ).innerHTML =

        `
        Receive:
        ${receive.toLocaleString(
            undefined,
            {
                maximumFractionDigits: 18
            }
        )}
        EVOZX
        `;

    } catch (error) {

        console.error(error);

    }

}

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

        const stock =
            await exchange.getAvailableStock();

        const formatted =
            ethers.utils.formatEther(
                stock
            );

        document.getElementById(
            "exchangeStock"
        ).innerHTML =

        `
        Available Stock:
        ${Number(
            formatted
        ).toLocaleString()}
        EVOZX
        `;

    } catch (error) {

        console.error(error);

        document.getElementById(
            "exchangeStock"
        ).innerHTML =

        `
        Unable to load stock.
        `;

    }

}

async function loadExchangeInfo() {

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

        const rate =
            await exchange.rate();

        const rateBox =
            document.querySelector(
                ".exchange-rate"
            );

        if (rateBox) {

            rateBox.innerHTML =

            `
            <strong>
            Current Rate
            </strong>
            <br><br>
            ${rate} EVOZ = 1 EVOZX
            `;

        }

    } catch (error) {

        console.error(error);

    }

}

async function buyEVOZX() {

    try {

        if (!window.ethereum) {

            alert(
                "Wallet not detected."
            );

            return;

        }

        const amount =
            document
                .getElementById(
                    "buyAmount"
                )
                .value
                .trim();

        if (
            !amount ||
            Number(amount) <= 0
        ) {

            alert(
                "Enter EVOZ amount."
            );

            return;

        }

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

        const paused =
            await exchange.paused();

        if (paused) {

            document.getElementById(
                "exchangeStatus"
            ).innerHTML =

            `
            ❌ Exchange is paused.
            `;

            return;

        }

        document.getElementById(
            "exchangeStatus"
        ).innerHTML =

        `
        <div class="loading"></div>
        Waiting for wallet confirmation...
        `;

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
        Transaction submitted...
        `;

        const receipt =
            await tx.wait();

        document.getElementById(
            "exchangeStatus"
        ).innerHTML =

        `
        ✅ EVOZX purchased successfully.

        <br><br>

        <a
        href="${CONFIG.EXPLORER_URL}/tx/${receipt.transactionHash}"
        target="_blank">

        View Transaction

        </a>
        `;

        document.getElementById(
            "buyAmount"
        ).value = "";

        calculateEVOZX();

        await loadExchangeStock();

    } catch (error) {

        console.error(error);

        let message =
            error.message;

        if (
            error.data &&
            error.data.message
        ) {

            message =
                error.data.message;

        }

        document.getElementById(
            "exchangeStatus"
        ).innerHTML =

        `
        ❌ ${message}
        `;

    }

}

window.addEventListener(
    "load",
    async () => {

        await loadExchangeInfo();

        await loadExchangeStock();

    }
);
