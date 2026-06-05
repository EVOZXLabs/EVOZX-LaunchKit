async function deployToken() {

    try {

        if (!window.ethereum) {

            alert(
                "No wallet detected."
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
                "Please complete all fields."
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
        Transaction submitted...
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
            ❌ Deployment completed, but token address was not found.
            `;

            return;

        }

        document.getElementById(
            "deployStatus"
        ).innerHTML =
        `
        ✅ Token deployed successfully.
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

            Copy Token Address

        </button>

        <br><br>

        <button
        onclick="window.open(
        '${CONFIG.EXPLORER_URL}/address/${tokenAddress}',
        '_blank'
        )">

            Open Explorer

        </button>

    </div>

    <details>

        <summary>

            Token Details

        </summary>

        <br>

        Full Address:

        <br>

        ${tokenAddress}

        <br><br>

        Transaction Hash:

        <br>

        ${receipt.transactionHash}

        <br><br>

        <button
        onclick="copyText('${receipt.transactionHash}')">

            Copy Transaction Hash

        </button>

        <br><br>

        <a
        href="${CONFIG.EXPLORER_URL}/tx/${receipt.transactionHash}"
        target="_blank">

            View Transaction

        </a>

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
onclick='downloadVerificationPackage(${JSON.stringify(
    verificationData
)})'>

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

        console.error(
            error
        );

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
        "Token address copied."
    );

}

function copyText(
    text
) {

    navigator.clipboard.writeText(
        text
    );

    alert(
        "Copied."
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

        const totalCount =
            Number(total);

        document.getElementById(
            "totalTokensStat"
        ).innerText =
            totalCount;

        let factoryTokenCount = 0;

        if (
            currentAccount
        ) {

            for (
                let i = 0;
                i < totalCount;
                i++
            ) {

                const token =
                    await factory.getToken(
                        i
                    );

                if (

                    token.creator
                        .toLowerCase() ===

                    currentAccount
                        .toLowerCase()

                ) {

                    factoryTokenCount++;

                }

            }

        }

        const myTokenElement =
            document.getElementById(
                "myTokensStat"
            );

        if (
            myTokenElement
        ) {

            myTokenElement.innerText =
                factoryTokenCount;

        }

        stats.innerHTML =

`
<div class="stats-grid">

    <div class="stat-box">

        <div class="stat-value">

            ${totalCount}

        </div>

        <div class="stat-label">

            Total Factory Tokens

        </div>

    </div>

    <div class="stat-box">

        <div class="stat-value">

            ${factoryTokenCount}

        </div>

        <div class="stat-label">

            Your Factory Tokens

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
                totalCount - maxShow
            );

        for (
            let i = totalCount - 1;
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

            Open Explorer

        </a>

    </div>

    <details>

        <summary>

            Token Details

        </summary>

        <br>

        Supply:
${Number(token.supply).toLocaleString()}

        <br><br>

        Creator:

        ${token.creator.substring(
            0,
            6
        )}
        ...
        ${token.creator.substring(
            token.creator.length - 4
        )}

        <br><br>

        Created:

        ${createdDate}

    </details>

</div>
`;

        }

        recent.innerHTML =
            html ||
            "No deployments found.";

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

    if (!container) {

        return;

    }

    if (!currentAccount) {

        container.innerHTML =
            "Connect your wallet to view your factory-created tokens.";

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

            Open Explorer

        </a>

    </div>

    <details>

        <summary>

            Token Details

        </summary>

        <br>

        Supply:
${Number(token.supply).toLocaleString()}

        <br><br>

        Creator:

        ${token.creator.substring(
            0,
            6
        )}
        ...
        ${token.creator.substring(
            token.creator.length - 4
        )}

        <br><br>

        Created:

        ${createdDate}

    </details>

</div>
`;

        }

        container.innerHTML =
            html ||
            "No factory-created tokens found for this wallet.";

    } catch (error) {

        console.error(
            error
        );

    }

}

async function downloadVerificationPackage(data) {

    const content = `

EVOZX VERIFICATION PACKAGE

================================

TOKEN ADDRESS
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

================================

COMPILER SETTINGS

Compiler Version:
0.8.24

Optimizer:
Enabled

Runs:
200

EVM Version:
paris

================================

CONSTRUCTOR VALUES

name_:
${data.name}

symbol_:
${data.symbol}

supply_:
${data.supply}

creator_:
${data.creator}

================================

SOURCE CONTRACT

Factory:
${CONFIG.FACTORY_ADDRESS}

Token Type:
ERC20 + Burnable

Generated By:
EVOZX Launch Kit

`;

    const blob = new Blob(
        [content],
        {
            type: "text/plain"
        }
    );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        `${data.symbol}-Verification.txt`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}

window.addEventListener(
    "load",
    async () => {

        await loadFactoryStats();

        await loadMyTokens();

    }
);
