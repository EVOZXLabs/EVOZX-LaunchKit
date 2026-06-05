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
            ).innerText =
                "Deploy success but token address not found";

            return;

        }

        document.getElementById(
            "deployStatus"
        ).innerText =
            "Token deployed successfully";

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

                <button onclick="copyTokenAddress('${tokenAddress}')">

                    Copy Address

                </button>

                <br><br>

                <a
                    href="${CONFIG.EXPLORER_URL}/address/${tokenAddress}"
                    target="_blank">

                    Explorer

                </a>

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

            </details>

        </div>

        <br>

        <button onclick="addTokenToWallet('${tokenAddress}','${symbol}')">

            Add Token To Wallet

        </button>

        <br><br>

        <button onclick='downloadVerificationPackage(${JSON.stringify(
            verificationData
        )})'>

            Download Verification Package

        </button>
        `;

        await loadFactoryStats();

        await loadMyTokens();

    } catch (error) {

        console.error(error);

        document.getElementById(
            "deployStatus"
        ).innerText =
            error.message;

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

        console.error(
            error
        );

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
                await factory.getToken(
                    i
                );

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

                    ${token.token.substring(
                        0,
                        6
                    )}
                    ...
                    ${token.token.substring(
                        token.token.length - 4
                    )}

                </div>

                <div class="token-actions">

                    <a
                        href="${CONFIG.EXPLORER_URL}/address/${token.token}"
                        target="_blank">

                        Explorer

                    </a>

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

        console.error(
            error
        );

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
                await factory.getToken(
                    i
                );

            if (

                token.creator
                    .toLowerCase() !==

                currentAccount
                    .toLowerCase()

            ) {

                continue;

            }

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

                    ${token.token.substring(
                        0,
                        6
                    )}
                    ...
                    ${token.token.substring(
                        token.token.length - 4
                    )}

                </div>

                <div class="token-actions">

                    <a
                        href="${CONFIG.EXPLORER_URL}/address/${token.token}"
                        target="_blank">

                        Explorer

                    </a>

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

                    Created:
                    ${createdDate}

                    <br><br>

                    Creator:
                    ${token.creator}

                </details>

            </div>
            `;

        }

        container.innerHTML =
            html ||
            "No tokens found";

    } catch (error) {

        console.error(
            error
        );

    }

}

async function downloadVerificationPackage(
    data
) {

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

NETWORK
${CONFIG.CHAIN_NAME}

FACTORY
${CONFIG.FACTORY_ADDRESS}

RPC
${CONFIG.RPC_URL}

EXPLORER
${CONFIG.EXPLORER_URL}
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

    const constructorArguments =

`name_ = ${data.name}

symbol_ = ${data.symbol}

supply_ = ${data.supply}

creator_ = ${data.creator}
`;

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
        constructorArguments
    );

    const blob =
        await zip.generateAsync({

            type:
                "blob"

        });

    const link =
        document.createElement(
            "a"
        );

    link.href =
        URL.createObjectURL(
            blob
        );

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

window.addEventListener(
    "load",
    async () => {

        await loadFactoryStats();

        await loadMyTokens();

    }
);
