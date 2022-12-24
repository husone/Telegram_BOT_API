const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
let getTokenPrice = require('./getTokenPrice.js');
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.API_KEY;

// Create a bot that uses 'polling' to fetch new updates

const bot = new TelegramBot(token, { polling: true });
let map = new Map();
map.set('ONUS', '0x4c761E48d1E735af551cc38ABCBDCe1d7FaaC6E4');
map.set('WONUS', '0x4c761E48d1E735af551cc38ABCBDCe1d7FaaC6E4');
map.set('MIA', '0x5Df107F23d3Ec5efA926B999Ce285A88955Ae56B');
map.set('USDT', '0xff276c6bca1F66Fd54a8915e830735D6ab0C7B09');
map.set('VNDC', '0xC1D3A18C32c42D5c033C2d4bfc151dB8fd2c9D81');
map.set('BNB', '0xbDCe8C50C1e6F6501c2af8232D2D76ec75cdA51D');
map.set('USDO', '0x3D513abc13f53A1E18Ae59A7B5B0930E55733C87');
map.set('BUSD', '0xdfB5E8a4AC08E46258A12AbE737bba5D8c452508');
map.set('ATH', '0x4B99Fa351143007a246616C4d0b538E62899CA11');
map.set('WCI', '0x7c63574650F35e0a5253E665Ba9C7c7ccf181b86');
map.set('HERA', '0x992B7DEeed37FE38808afEc9E81d5B8Af7Bc2d27');
map.set('BTC','0x935765Ad27a1af00f73097c998A9fb721D2d7790');
map.set('ETH','0xB4373ebB073A4DcbA47e567d075a9583Fa3C763e');

bot.on("polling_error", console.log);

bot.onText(/\/getAll/, (msg) => {
    let user = msg.from.id;
    if (user == parseInt(process.env.ADMIN_ID)) {
        // noice work, copilot
        const chatId = msg.chat.id;
        let message = '';
        map.forEach((value, key) => {
            message += `${key} - ${value}
`
        })
        bot.sendMessage(chatId, message);
    }
})

bot.onText(/\/remove (.+)/, (msg, match) => {
    let user = msg.from.id;
    if (user == parseInt(process.env.ADMIN_ID)) {
        const chatId = msg.chat.id;
        const resp = match[1].toUpperCase();
        if (map.get(resp) != undefined) {
            map.delete(resp);
            bot.sendMessage(chatId, 'Đã xóa thành công', { reply_to_message_id: msg.message_id });
        }
        else bot.sendMessage(chatId, 'Không tìm thấy token', { reply_to_message_id: msg.message_id });
    }

})

bot.onText(/\/add (.+)/, (msg, match) => {
    let user = msg.from.id;
    const chatId = msg.chat.id;
    const resp = match[1].toUpperCase();
    if (user == parseInt(process.env.ADMIN_ID)) {
        // noice work, copilot
        let arr = resp.split(' ');
        map.set(arr[0], arr[1]);
        bot.sendMessage(chatId, 'Đã thêm thành công', { reply_to_message_id: msg.message_id });
    }
    else bot.sendMessage(chatId, 'Bạn không có quyền thực hiện lệnh này', { reply_to_message_id: msg.message_id });
});

bot.onText(/\/get (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1].toUpperCase();
    if (map.get(resp) != undefined) {
        bot.sendMessage(chatId, resp + ' - ' + map.get(resp));
    }
    else bot.sendMessage(chatId, 'Không tìm thấy token', { reply_to_message_id: msg.message_id });
});


bot.onText(/\/p (.+)/, async (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    console.log(msg.text, `'${match[1]}'`)
    const chatId = msg.chat.id;
    const resp = await getTokenPrice(map.get(match[1].toUpperCase()));
    console.log(resp)
    bot.sendMessage(chatId, resp, { reply_to_message_id: msg.message_id });
});

bot.on('message', (msg) => {
    let data = msg.text.trim();
    let user = msg.from.id;
    if (user == parseInt(process.env.ADMIN_ID)) {
        if (data.toLowerCase().startsWith('sa')) {
            let chatId = msg.chat.id;
            bot(chatId, 'Xin chào tất cả mọi người ạ ❤️', { reply_to_message_id: msg.message_id });
        }
    }
})