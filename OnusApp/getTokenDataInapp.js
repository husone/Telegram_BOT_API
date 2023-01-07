const { parse } = require('dotenv');
const fetch = require('node-fetch');
//Using vndc API
const getTokenDataInApp = async (symbol) => {
    let url = `https://api.invest.vndc.io/api/v1/currency`;
    let response = await fetch(url);
    let data = await response.json();
    let index = -1;
    for (let i in data.data) {
        if ((data.data[i].symbol).localeCompare(symbol) == 0) {
            index = i;
            break;
        }
    }


    return (parseInt(data.status) != 200) ? 'Không kết nối được đến Onus' : ((index == -1) ? 'Không tìm thấy token' : returnMessage(data.data[index]));//returnMessage(data.data));
}

// //Format the token price
let formatNumber = (data, d) => {
    data = data.toString();
    return data.slice(0, Math.min(data.indexOf('.') + d, data.length));
}

// edit data 
const returnMessage = (data) => {
    let statistics = data.statistics;
    let message = `Token: *${data.symbol} - ${data.name}*
Price: *${statistics.price} VNDC*
Volume 24h: *${formatNumber(data.volume, 3) + " " + data.volumeCurrency}*
Change 1h: *${formatNumber(statistics.priceChangePercentage1h, 4)} %*
Change 24h: *${formatNumber(statistics.priceChangePercentage24h, 4)} %*
Change 7d: *${formatNumber(statistics.priceChangePercentage7d, 4)} %*
View 24h: *${data.view24h}*
Dữ liệu được lấy từ goonus.io`;
    return message;
}
//Export function
module.exports = getTokenDataInApp;
