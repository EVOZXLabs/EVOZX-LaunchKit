async function deployToken() {

    try {

        if (!window.ethereum) {

            alert(
                "Wallet tidak terdeteksi"
            );

            return;

        }

        const name =
            document
                .getElementById(
                    "tokenName"
                )
                .value
                .trim();

        const symbol =
            document
                .getElementById(
                    "tokenSymbol"
                )
                .value
                .trim();

        const supply =
            document
                .getElementById(
                    "tokenSupply"
                )
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
        ).innerHTML =
        `
        <div class="loading"></div>
        Transaction sent...
        `;

        const receipt =
            await tx.wait();

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
                "deployStatus"
            ).innerHTML =
            `
            ❌ Deploy success but token address not found
            `;

            return;

        }

        document.getElementById(
            "deployStatus"
        ).innerHTML =
        `
        ✅ Token deployed successfully
        `;

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
        <div class="token-card">

            <div class="token-symbol">
                ${symbol}
            </div>

            <div class="token-name">
                ${name}
            </div>

            <div class="token-address">

                ${tokenAddress.substring(
                    0,
                    6
                )}
                ...
                ${tokenAddress.substring(
                    tokenAddress.length - 4
                )}

            </div>

            <div class="token-actions">

                <button
                onclick="copyTokenAddress('${tokenAddress}')">

                    Copy Address

                </button>

                <br><br>

                <button
                onclick="window.open(
                '${CONFIG.EXPLORER_URL}/address/${tokenAddress}',
                '_blank'
                )">

                    Open Explorer

                </button>

                <br><br>

                <button
                onclick="window.open(
                '${CONFIG.EXPLORER_URL}/tx/${receipt.transactionHash}',
                '_blank'
                )">

                    View Transaction

                </button>

            </div>

            <details>

                <summary>
                    Details
                </summary>

                <br>

                Full Address:

                <br>

                ${tokenAddress}

                <br><br>

                TX Hash:

                <br>

                ${receipt.transactionHash}

                <br><br>

                <button
                onclick="copyText('${receipt.transactionHash}')">

                    Copy TX Hash

                </button>

            </details>

        </div>

        <br>

        <button
        onclick="addTokenToWallet(
        '${tokenAddress}',
        '${symbol}'
        )">

            Add Token To Wallet

        </button>

        <br><br>

        <button
        onclick='downloadVerificationPackage(
        ${JSON.stringify(
            verificationData
        )}
        )'>

            Download Verification Package

        </button>
        `;

    await loadFactoryStats();

        await loadMyTokens();

        setTimeout(
            loadMyTokens,
            5000
        );

    } catch (error) {

        console.error(error);

        document.getElementById(
            "deployStatus"
        ).innerHTML =
        `
        ❌ ${error.message}
        `;

    }

}

function copyTokenAddress(
    address
) {

    navigator.clipboard.writeText(
        address
    );

    alert(
        "Address copied"
    );

}

function copyText(text) {

    navigator.clipboard.writeText(
        text
    );

    alert(
        "Copied"
    );

}

async function addTokenToWallet(
    tokenAddress,
    tokenSymbol
) {

    try {

        await window.ethereum.request({

            method:
                "wallet_watchAsset",

            params: {

                type:
                    "ERC20",

                options: {

                    address:
                        tokenAddress,

                    symbol:
                        tokenSymbol.substring(
                            0,
                            11
                        ),

                    decimals:
                        18

                }

            }

        });

    } catch (error) {

        console.error(error);

    }

}

async function loadFactoryStats() {

    const stats =
        document.getElementById(
            "factoryStats"
        );

    const recent =
        document.getElementById(
            "recentDeployments"
        );

    if (
        !stats ||
        !recent
    ) {

        return;

    }

    try {

        const provider =
            new ethers.providers.JsonRpcProvider(
                CONFIG.RPC_URL
            );

        const factory =
            new ethers.Contract(
                CONFIG.FACTORY_ADDRESS,
                FACTORY_ABI,
                provider
            );

        const total =
            await factory.totalTokens();

        document.getElementById(
            "totalTokensStat"
        ).innerText =
            total.toString();

        let myTokenCount = 0;

        if (currentAccount) {

            for (
                let i = 0;
                i < Number(total);
                i++
            ) {

                const token =
                    await factory.getToken(i);

                if (

                    token.creator
                        .toLowerCase() ===

                    currentAccount
                        .toLowerCase()

                ) {

                    myTokenCount++;

                }

            }

        }

        const myTokenElement =
            document.getElementById(
                "myTokensStat"
            );

        if (myTokenElement) {

            myTokenElement.innerText =
                myTokenCount;

        }

    stats.innerHTML =

        `
        <div class="stats-grid">

            <div class="stat-box">

                <div class="stat-value">
                    ${total}
                </div>

                <div class="stat-label">
                    Total Tokens
                </div>

            </div>

            <div class="stat-box">

                <div class="stat-value">
                    ${myTokenCount}
                </div>

                <div class="stat-label">
                    Your Tokens
                </div>

            </div>

            <div class="stat-box">

                <div class="stat-value">
                    EVOZ
                </div>

                <div class="stat-label">
                    Mainnet
                </div>

            </div>

        </div>
        `;

        let html = "";

        const maxShow = 5;

        const start =
            Math.max(
                0,
                Number(total) - maxShow
            );

        for (
            let i = Number(total) - 1;
            i >= start;
            i--
        ) {

            const token =
                await factory.getToken(i);

            const createdDate =
                new Date(
                    Number(
                        token.createdAt
                    ) * 1000
                ).toLocaleString();

            html +=

            `
            <div class="token-card">

                <div class="token-symbol">
                    ${token.symbol}
                </div>

                <div class="token-name">
                    ${token.name}
                </div>

                <div class="token-address">
                    ${token.token}
                </div>

                <details>

                    <summary>
                        Details
                    </summary>

                    <br>

                    Supply:
                    ${ethers.utils.formatUnits(
                        token.supply,
                        18
                    )}

                    <br><br>

                    Creator:
                    ${token.creator}

                    <br><br>

                    Created:
                    ${createdDate}

                </details>

            </div>
            `;

        }

        recent.innerHTML =
            html ||
            "No tokens found";

    } catch (error) {

        console.error(error);

    }

}

async function loadMyTokens() {

    const container =
        document.getElementById(
            "myTokens"
        );

    if (!container)
        return;

    if (!currentAccount) {

        container.innerHTML =
            "Connect wallet first";

        return;

    }

    try {

        const provider =
            new ethers.providers.JsonRpcProvider(
                CONFIG.RPC_URL
            );

        const factory =
            new ethers.Contract(
                CONFIG.FACTORY_ADDRESS,
                FACTORY_ABI,
                provider
            );

        const total =
            await factory.totalTokens();

        let html = "";

        for (
            let i = Number(total) - 1;
            i >= 0;
            i--
        ) {

            const token =
                await factory.getToken(i);

            if (

                token.creator
                    .toLowerCase() !==

                currentAccount
                    .toLowerCase()

            ) {

                continue;

            }

            html +=

            `
            <div class="token-card">

                <div class="token-symbol">
                    ${token.symbol}
                </div>

                <div class="token-name">
                    ${token.name}
                </div>

                <div class="token-address">
                    ${token.token}
                </div>

            </div>
            `;

        }

        container.innerHTML =
            html ||
            "No tokens found";

    } catch (error) {

        console.error(error);

    }

}

window.addEventListener(
    "load",
    async () => {

        await loadFactoryStats();

        await loadMyTokens();

    }
);
