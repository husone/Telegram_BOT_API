const fetch = require('node-fetch');
require('dotenv').config();

const factoryAddress = process.env.FACTORY_PROCESS;
const topic0AddLP = process.env.TOPIC0_ADD_LP;
const getAddNewLP = async () => {
    let url = `https://explorer.onuschain.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${factoryAddress}&topic0=${topic0AddLP}`;
    let res = await fetch(url);
    let data = await res.json();
    return data;
}
let t = '';
(async () => {
    let data = await getAddLPLog();
    let t = data.result.length - 1;
})()

setInterval(async () => {
    let data = await getAddLPLog();
    if (data.result.length - 1 != t) {
        t = data.result.length - 1;
        // console.log('new pair')
        // console.log(data.result)
        let message = await editData(data.result[t])
        // console.log(message)
        bot.sendMessage(process.env.ADMIN_ID, message, { parse_mode: 'Markdown' });
    }
}, 1000);