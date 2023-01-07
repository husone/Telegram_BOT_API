const fetch = require('node-fetch');
//Using Miaswap API
const getTokenDataOnchain = async (contract) => {
    let url = `https://api.miaswap.io/report/currency-detail?address=${contract}`;
    let response = await fetch(url);
    let data = await response.json();
    let t = data.error_code;
    return (t) ? 'Không tìm thấy token' : returnMessage(data.data);
}

//Format the token price
let formatNumber = (data, d) => data.slice(0, Math.min(data.indexOf('.') + d, data.length));

// edit data 
const returnMessage = (data) => {
    let message = `Token: *${data.symbol} - ${data.name}*
Price: *${formatNumber(data.price, 6)} VNDC*
Change 24h: *${formatNumber(data.change_percent, 3)} %*
Volume 24h: *${formatNumber(data.volume, 2)} USD*
Volume 7d: *${formatNumber(data.volume_week, 2)} USD*
Liquidity: *${formatNumber(data.liquidity, 2)} USD*
Dữ liệu được lấy từ miaswap.io`;
    return message;
}
//Export function
module.exports = getTokenDataOnchain;