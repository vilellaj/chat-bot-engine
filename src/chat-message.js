class ChatMessage {
    constructor(message, sender) {
        this.time = this.getCurrentTime();
        this.message = message;
        this.sender = sender;
    }

    /**
     * Returns the current server time in HH:mm format
     */
    getCurrentTime() {
        return (new Date()).toLocaleTimeString('pt-br', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }
}

module.exports = ChatMessage;