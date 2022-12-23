let data = '112.12341';
let formatNumber = (data) => data.slice(0, Math.min(data.indexOf('.')+4, data.length));

console.log(formatNumber(data));