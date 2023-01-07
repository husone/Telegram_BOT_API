const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
require('dotenv').config();
const fetch = require('node-fetch');
let getTokenDataOnchain = require('./OnusChain/getTokenDataOnchain.js');
const getTokenDataInApp = require('./OnusApp/getTokenDataInapp.js');

// replace the value below with the Telegram token you receive from @BotFather
const botToken = process.env.API_KEY;

let tokenList = new Object();

fs.readFile('tokenList.json', 'utf8', (err, data) => {
    tokenList = JSON.parse(data);
    if (err) console.log(err)
});

// write file after remove or add 
const writeNewTokenList = (newTokenList) => {
    fs.writeFile('tokenList.json', JSON.stringify(newTokenList), (err) => {
        if (err) throw err;
        // console.log('The file has been saved!');
    });
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(botToken, { polling: true });
// log the error when bot is not working
bot.on("polling_error", console.log);


// Check admin  
let isAdmin = (user) => (user == parseInt(process.env.ADMIN_ID));

    
//Hello world
bot.on('message', (msg) => {
    let data = msg.text.trim();
    if (isAdmin(msg.from.id)) {
        if (data.toLowerCase().startsWith(process.env.HELLO)) {
            let chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Xin chào tất cả mọi người ạ ❤️!', { reply_to_message_id: msg.message_id });
        }
    }
})

//Get all token list 
bot.onText(/\/get[A|a]ll/, (msg) => {
    if (isAdmin(msg.from.id)) {
        let message = '';
        for (const token in tokenList) {
            message += `\*\*${token}\*\* - \`${tokenList[token]}\`\n`
        }

        bot.sendMessage(msg.chat.id, message, { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' });
    }
    else bot.sendMessage(msg.chat.id, 'Bạn không có quyền thực hiện lệnh này', { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' });
})

//Remove a token
bot.onText(/\/remove (.+)/, (msg, match) => {
    if (isAdmin(msg.from.id)) {
        const chatId = msg.chat.id;
        const resp = match[1].toUpperCase();
        if (tokenList.hasOwnProperty(resp)) {
            delete tokenList[resp];
            writeNewTokenList(tokenList);
            bot.sendMessage(chatId, 'Đã xóa thành công', { reply_to_message_id: msg.message_id });
        }
        else bot.sendMessage(chatId, 'Không tìm thấy token', { reply_to_message_id: msg.message_id });
    }
    else bot.sendMessage(msg.chat.id, 'Bạn không có quyền thực hiện lệnh này', { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' });
})

//Add a new token
bot.onText(/\/add (.+)/, (msg, match) => {
    if (isAdmin(msg.from.id)) {
        const chatId = msg.chat.id;
        const resp = match[1].toUpperCase();
        let arr = resp.split(' ');
        if (!tokenList.hasOwnProperty(arr[0])) {
            tokenList[arr[0]] = arr[1];
            writeNewTokenList(tokenList);
            bot.sendMessage(chatId, 'Đã thêm thành công', { reply_to_message_id: msg.message_id });
        }
        else bot.sendMessage(chatId, 'Token đã tồn tại', { reply_to_message_id: msg.message_id });
    }
    else bot.sendMessage(chatId, 'Bạn không có quyền thực hiện lệnh này', { reply_to_message_id: msg.message_id });
});


//Get contract address from a token
bot.onText(/\/get (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1].toUpperCase();
    if (tokenList.hasOwnProperty(resp)) {
        bot.sendMessage(chatId, `${resp}  - \`${tokenList[resp]}\``, { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' });
    }
    else bot.sendMessage(chatId, 'Không tìm thấy token', { reply_to_message_id: msg.message_id });
});

//Get token price on Onuschain using Miaswap API
bot.onText(/\/p[c|C] (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1].toUpperCase();
    if (tokenList.hasOwnProperty(resp)) {
        let message = await getTokenDataOnchain(tokenList[resp]);
        bot.sendMessage(chatId, message, { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' });
    }
    else bot.sendMessage(chatId, 'Không tìm thấy token', { reply_to_message_id: msg.message_id });
});

//Get token price on Onuschain using vndc API

bot.onText(/\/p[a|A] (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const resp = (match[1]).toUpperCase();
        let message = await getTokenDataInApp(resp);
        bot.sendMessage(chatId, message, { reply_to_message_id: msg.message_id, parse_mode: 'Markdown' });
});

//get new Token on Onuschain