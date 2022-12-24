const fetch = require('node-fetch');

const getTokenPrice = async (contract) => {
    let url = `https://api.miaswap.io/report/currency-detail?address=${contract}`;
    // console.log(url)
    let response = await fetch(url);
    let data = await response.json();
    let t = data.error_code;
    // console.log(`'${t}'`, typeof t)
    return (t) ? 'Không tìm thấy token' : returnMessage(data.data);
}




let formatNumber = (data,d) => data.slice(0, Math.min(data.indexOf('.') + d, data.length));

const returnMessage = (data) => {
    //you are the best, copilot
    // console.log(data)
    let message = `Token: ${data.symbol} - ${data.name}
Price: ${formatNumber(data.price,6)} USD
Change 24h: ${formatNumber(data.change_percent,3)} %
Volume 24h: ${formatNumber(data.volume,2)} USD
Volume 7d: ${formatNumber(data.volume_week,2)} USD
Liquidity: ${formatNumber(data.liquidity,2)} USD
Dữ liệu được lấy từ miaswap.io`;
    return message;
}

module.exports = getTokenPrice;

// getTokenPrice('0x992B7DEeed37FE38808afEc9E81d5B8Af7Bc2d27');
// console.log(returnMessage({}))