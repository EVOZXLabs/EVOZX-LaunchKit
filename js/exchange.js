const EXCHANGE_ABI = [

    "function buyEVOZX() payable",

    "function getAvailableStock() view returns(uint256)",

    "function rate() view returns(uint256)"

];

function calculateEVOZX() {

    const amount =
        parseFloat(
            document.getElementById(
                "buyAmount"
            ).value || 0
        );

    const receive =
        amount / 5;

    document.getElementById(
        "receiveAmount"
    ).innerHTML =

        `Receive:
        ${receive}
        EVOZX`;

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

        document.getElementById(
            "exchangeStock"
        ).innerHTML =

            `Available Stock:
            ${Number(
                ethers.utils.formatEther(
                    stock
                )
            ).toLocaleString()}
            EVOZX`;

    } catch(error) {

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
        Transaction submitted...
        `;

        await tx.wait();

        document.getElementById(
            "exchangeStatus"
        ).innerHTML =

        `
        ✅ EVOZX purchased successfully.
        `;

        await loadExchangeStock();

    } catch(error) {

        console.error(error);

        document.getElementById(
            "exchangeStatus"
        ).innerHTML =

        `
        ❌ ${error.message}
        `;

    }

}
