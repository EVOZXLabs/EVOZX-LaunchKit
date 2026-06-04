async function deployToken() {

    try {

        if (!window.ethereum) {

            alert("EVM Wallet not detected");
            return;

        }

        const name =
            document.getElementById(
                "tokenName"
            ).value.trim();

        const symbol =
            document.getElementById(
                "tokenSymbol"
            ).value.trim();

        const supply =
            document.getElementById(
                "tokenSupply"
            ).value.trim();

        if (
            !name ||
            !symbol ||
            !supply
        ) {

            alert(
                "Please fill all fields"
            );

            return;

        }

        document.getElementById(
            "deployStatus"
        ).innerText =
            "Waiting for wallet confirmation...";

        const provider =
            new ethers.providers.Web3Provider(
                window.ethereum
            );

        const signer =
            provider.getSigner();

        const factory =
            new ethers.Contract(
                CONFIG.FACTORY_ADDRESS,
                FACTORY_ABI,
                signer
            );

        const tx =
            await factory.createToken(
                name,
                symbol,
                supply
            );

        document.getElementById(
            "deployStatus"
        ).innerText =
            "Transaction sent...";

        const receipt =
            await tx.wait();

        document.getElementById(
            "deployStatus"
        ).innerText =
            "Token deployed successfully";

        let tokenAddress =
            null;

        for (
            const log
            of receipt.logs
        ) {

            try {

                const parsed =
                    factory.interface.parseLog(
                        log
                    );

                if (
                    parsed.name ===
                    "TokenCreated"
                ) {

                    tokenAddress =
                        parsed.args.token;

                    break;

                }

            } catch (_) {}

        }

        if (!tokenAddress) {

            document.getElementById(
                "tokenResult"
            ).innerHTML =
                "Deployment succeeded but token address not found.";

            return;

        }

        document.getElementById(
            "tokenResult"
        ).innerHTML =

            `
            <b>Token Address</b><br>
            ${tokenAddress}
            <br><br>

            <a
            href="${CONFIG.EXPLORER_URL}/address/${tokenAddress}"
            target="_blank">

            View on Explorer

            </a>
            `;

    } catch (error) {

        console.error(error);

        document.getElementById(
            "deployStatus"
        ).innerText =
            error.message;

    }

                }
