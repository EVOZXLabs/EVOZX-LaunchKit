async function deployToken() {

    try {

        if (!window.ethereum) {

            alert("Wallet tidak terdeteksi");
            return;

        }

        const name =
            document
            .getElementById("tokenName")
            .value
            .trim();

        const symbol =
            document
            .getElementById("tokenSymbol")
            .value
            .trim();

        const supply =
            document
            .getElementById("tokenSupply")
            .value
            .trim();

        if (
            !name ||
            !symbol ||
            !supply
        ) {

            alert(
                "Isi semua field terlebih dahulu"
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

        const creator =
            await signer.getAddress();

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

        let tokenAddress = null;

        for (const log of receipt.logs) {

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
                "Token address not found.";

            return;

        }

        const verificationData = {

            tokenAddress,
            txHash:
                receipt.transactionHash,
            creator,
            name,
            symbol,
            supply

        };

        document.getElementById(
            "tokenResult"
        ).innerHTML =

            `
            <b>Token Address</b><br>
            ${tokenAddress}

            <br><br>

            <b>TX Hash</b><br>
            ${receipt.transactionHash}

            <br><br>

            <button onclick="copyTokenAddress('${tokenAddress}')">
                Copy Address
            </button>

            <br><br>

            <a
                href="${CONFIG.EXPLORER_URL}/address/${tokenAddress}"
                target="_blank">

                View Explorer

            </a>

            <br><br>

            <button onclick='downloadVerificationPackage(${JSON.stringify(
                verificationData
            )})'>

                Download Verification Package

            </button>
            `;

    } catch (error) {

        console.error(error);

        document.getElementById(
            "deployStatus"
        ).innerText =
            error.message;

    }

}

function copyTokenAddress(address) {

    navigator.clipboard.writeText(
        address
    );

    alert(
        "Address copied"
    );

}

async function downloadVerificationPackage(data) {

    const zip =
        new JSZip();

    const verifyInfo =

`TOKEN ADDRESS
${data.tokenAddress}

TX HASH
${data.txHash}

CREATOR
${data.creator}

NAME
${data.name}

SYMBOL
${data.symbol}

SUPPLY
${data.supply}

COMPILER
0.8.24

OPTIMIZER
Enabled

RUNS
200

EVM VERSION
Paris
`;

    const compilerSettings = {

        compilerVersion:
            "0.8.24",

        optimizer: {

            enabled: true,
            runs: 200

        },

        evmVersion:
            "paris"

    };

    const constructorArgs =

`name_     = ${data.name}
symbol_   = ${data.symbol}
supply_   = ${data.supply}
creator_  = ${data.creator}`;

    zip.file(
        "verify-info.txt",
        verifyInfo
    );

    zip.file(
        "compiler-settings.json",
        JSON.stringify(
            compilerSettings,
            null,
            2
        )
    );

    zip.file(
        "constructor-arguments.txt",
        constructorArgs
    );

    const blob =
        await zip.generateAsync({
            type: "blob"
        });

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        `${data.symbol}-Verification.zip`;

    document.body.appendChild(
        link
    );

    link.click();

    document.body.removeChild(
        link
    );

}
