document.addEventListener(

    "DOMContentLoaded",

    async () => {

        /* CONNECT WALLET */

        const connectBtn =
            document.getElementById(
                "connectBtn"
            );

        if (connectBtn) {

            connectBtn.addEventListener(

                "click",

                connectWallet

            );

        }

        /* DEPLOY TOKEN */

        const deployBtn =
            document.getElementById(
                "deployBtn"
            );

        if (deployBtn) {

            deployBtn.addEventListener(

                "click",

                deployToken

            );

        }

        /* LOAD FACTORY DATA */

        if (

            typeof loadFactoryStats ===
            "function"

        ) {

            await loadFactoryStats();

        }

        if (

            typeof loadMyTokens ===
            "function"

        ) {

            await loadMyTokens();

        }

        /* LOAD EXCHANGE DATA */

        if (

            typeof loadExchangeStock ===
            "function"

        ) {

            await loadExchangeStock();

        }

    }

);

/* GLOBAL REFRESH */

async function refreshAll() {

    try {

        if (

            typeof loadFactoryStats ===
            "function"

        ) {

            await loadFactoryStats();

        }

        if (

            typeof loadMyTokens ===
            "function"

        ) {

            await loadMyTokens();

        }

        if (

            typeof loadExchangeStock ===
            "function"

        ) {

            await loadExchangeStock();

        }

    } catch (error) {

        console.error(error);

    }

}

/* AUTO REFRESH */

setInterval(

    async () => {

        await refreshAll();

    },

    30000

);
