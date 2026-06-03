function generateAll(){

const project=
document.getElementById(
"project"
).value;

const token=
document.getElementById(
"token"
).value;

const symbol=
document.getElementById(
"symbol"
).value;

const supply=
document.getElementById(
"supply"
).value;

const description=
document.getElementById(
"description"
).value;

const type=
document.getElementById(
"contractType"
).value;


document.getElementById(
"dSupply"
).innerText=supply;

document.getElementById(
"dSymbol"
).innerText=symbol;

document.getElementById(
"dType"
).innerText=type;



let extras="";

if(type==="mintable"){

extras=
`
function mint(
uint amount
) public{

totalSupply+=amount;

}
`;

}

if(type==="burnable"){

extras=
`
function burn(
uint amount
) public{

totalSupply-=amount;

}
`;

}


const contract=

`
pragma solidity ^0.8.20;

contract ${symbol}{

string public name=
"${token}";

string public symbol=
"${symbol}";

uint public totalSupply=
${supply};

${extras}

}
`;



const website=

`
<h1>${project}</h1>

<p>

${description}

</p>

<h2>

Token:

${token}

</h2>

<button>

BUY ${symbol}

</button>
`;


const logo=

`
Create futuristic logo for

${project}

crypto project

symbol ${symbol}

dark theme

professional branding

vector style
`;


const metadata=

`
{

"name":"${token}",

"symbol":"${symbol}",

"supply":"${supply}",

"network":"EVOZ"

}
`;


document.getElementById(
"contract"
).value=contract;

document.getElementById(
"website"
).value=website;

document.getElementById(
"logo"
).value=logo;

document.getElementById(
"metadata"
).value=metadata;

}
