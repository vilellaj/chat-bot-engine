process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
const Bot = require('./bot');

(async () => {
    const bot = new Bot();
    bot.start();
})();