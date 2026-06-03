function generateDocs(){

let project =
document.getElementById("project").value;

let token =
document.getElementById("token").value;

let symbol =
document.getElementById("symbol").value;

let supply =
document.getElementById("supply").value;

let description =
document.getElementById("description").value;

let readme =

`# ${project}

## Overview

${description}

## Token

Name: ${token}

Symbol: ${symbol}

Supply: ${supply}

## Network

EVOZ Mainnet

## Roadmap

Phase 1
- Launch

Phase 2
- Community

Phase 3
- Ecosystem
`;

document.getElementById("output")
.value = readme;

}
