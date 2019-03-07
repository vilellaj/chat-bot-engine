const config = require('config');
const util = require('util');
const natural = require('natural');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const stopword = require('stopword');
const BrainJSClassifier = require('natural-brain');
const ChatMessage = require('./chat-message');

const loadModelAsync = util.promisify(BrainJSClassifier.load);
const logger = require('./logger');

const articles = require('./articles');

/**
 * Chat bot class
 */
class Bot {
    constructor() {
        this.tokenizer = new natural.WordTokenizer();
        this.sender = config.get('name');
        this.port = process.env.PORT || config.get('port');

        this.app = express();
        this.httpServer = http.Server(this.app);
        this.io = socketIO(this.httpServer);

        this._loadModel();
        this._serveStaticFiles();
        this._setup();
    }


    /**
     * Loads the pre-trained model for context recognition
     */
    async _loadModel() {
        this.classifier = await loadModelAsync('models/classifier.json', null, null);
    }

    /**
     * Setup express to server static files from /public
     */
    _serveStaticFiles() {
        this.app.use(express.static(__dirname + "/public"));

        this.app.get('/', (req, res) => {
            res.sendFile(__dirname + '/public/index.html');
        });
    }

    /**
     * Setup BOT
     */
    async _setup() {
        this.io.on('connection', (socket) => {
            logger.info('New user connected');

            this.io.emit('message', new ChatMessage('Olá! Como posso ajudar?', this.sender));

            socket.on('disconnect', () => {
                logger.info('User disconnected');
            });

            socket.on('message', async (msg) => {
                // Send back the message to the original sender (ACK)
                this.io.emit('message', new ChatMessage(msg, 'Usuário'));

                // Send a feedback in case user have to wait
                this.io.emit('feedback', `${this.sender} está digitando...`);

                logger.info(`Current context: ${socket.context}`);

                const response = await this.handleMessage(msg);

                // Set current context
                socket.context = response.context;

                // Send response message
                this.io.emit('message', new ChatMessage(response.message, this.sender));
            });
        });
    }

    async handleMessage(msg) {
        let response = '';

        const context = this.classifier.classify(msg);
        const tokens = await this.tokenizer.tokenize(msg);
        let keys = stopword.removeStopwords(tokens, stopword.pt);

        keys = keys.map(x => x.toLowerCase());

        const allArticles = articles.find({ context: context });

        const candidates = [];

        for (let i = 0; i < allArticles.length; i++) {
            let art = allArticles[i];

            let z = art.tags.filter((val) => {
                return keys.indexOf(val) != -1;
            });

            if (z.length > 0) {
                art.count = z.length;
                candidates.push(art);
            }
        }

        if (candidates.length > 0) {
            candidates.sort((a, b) => {
                return a.count < b.count;
            });

            response = candidates[0].text;
        } else {
            response = 'Não consegui encontrar nada';
        }

        return {
            message: response,
            context
        }
    }

    start() {
        this.httpServer.listen(this.port, () => {
            logger.info(`Bot running on port:${this.port}`);
        })
    }
}

module.exports = Bot;