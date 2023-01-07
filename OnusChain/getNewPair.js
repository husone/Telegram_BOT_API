const fetch = require('node-fetch');
const ethers = require('ethers');


async function getTokenName(address) {
    let url = `https://explorer.onuschain.io/api?module=token&action=getToken&contractaddress=${address}`;
    let res = await fetch(url);
    let data = await res.json();
    // console.log(data.result.symbol, data.result.name)
    return `${data.result.symbol}`;
}

// async function getTokenAmount(address, contractAddressHash) {
//     let url = `https://explorer.onuschain.io/api?module=account&action=tokenbalance&contractaddress=${contractAddressHash}&address=${address}`;
//     console.log(url)
//     let res = await fetch(url);
//     let amount = (await res.json()).result;
//     url = `https://explorer.onuschain.io/api?module=token&action=getToken&contractaddress=${address}`;
//     res = await fetch(url);
//     console.log(url)

//     let decimals = (await res.json()).result.decimals;
//     // console.log((amount.slic))
//     return (BigInt(amount) / BigInt(10 ** decimals));
// }


async function editData(data) {
    let topics = data.topics;
    let token1 = `0x${topics[1].slice(26)}`;
    let token2 = `0x${topics[2].slice(26)}`;
    let lp = `0x${data.data.slice(26, 66)}`;
    // console.log(token1, token2);
    let token1Name = await getTokenName(token1);
    let token2Name = await getTokenName(token2);
    // let token1Amount = await getTokenAmount(lp, token1);
    // let token2Amount = await getTokenAmount(lp, token2);
    // console.log(token1Amount, token2Amount)
//     let Price = `${(token2Amount/token1Amount).toFixed(4)} ${token2Name}/${token1Name} 
// ${(token1Amount/token2Amount).toFixed(4)} ${token1Name}/${token2Name}`
    let Price = ''
    let message = `Cặp mới: ${token1Name}/${token2Name}
[Địa chỉ LP](https://explorer.onuschain.io/address/${lp}/token-transfers)
${Price}
Swap ở [đây](https://miaswap.io/swap/?inputCurrency=${token1}&outputCurrency=${token2}`;
    return message;
}

// (async function main() {
//     let url = `https://explorer.onuschain.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0xA5DA4dC244c7aD33a0D8a10Ed5d8cFf078E86Ef3&topic0=0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9`;
//     let res = await fetch(url);
//     let data = await res.json();
//     let message = await editData(data.result[20]);
//     console.log(message);
// })();

module.exports = { editData };