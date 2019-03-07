(() => {
    const socket = io();

    const setFeedback = (msg) => {
        const feedback = document.querySelector('#chat-feedback');
        feedback.innerText = msg;
    };

    // Add message to chatHistory
    const addMessage = (data) => {

        if(data.sender == 'Fiot') {
            setFeedback('');
        }

        const chatHistory = document.querySelector('#chat-history');

        // Message wrapper
        const newMessage = document.createElement('div');
        newMessage.classList = 'chat-message clearfix';

        // Sender icon
        const icon = document.createElement('img');

        icon.src = data.sender == 'Fiot' ?
            'https://randomuser.me/api/portraits/lego/1.jpg' :
            'https://randomuser.me/api/portraits/lego/8.jpg';

        icon.width = 32;
        icon.height = 32;

        const messageContent = document.createElement('div');
        messageContent.classList = 'chat-message-content clearfix';

        const span = document.createElement('span');
        span.classList = 'chat-time';
        span.innerText = data.time;

        const h5 = document.createElement('h5');
        h5.innerText = data.sender;

        const p = document.createElement('p');
        p.innerText = data.message;

        messageContent.appendChild(span);
        messageContent.appendChild(h5);
        messageContent.appendChild(p);

        newMessage.appendChild(icon);
        newMessage.appendChild(messageContent);

        chatHistory.appendChild(newMessage);
        chatHistory.appendChild(document.createElement('hr'));

        chatHistory.scrollTo(0, chatHistory.scrollHeight);
    }

    const form = document.querySelector('#form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = document.querySelector('#message');
        socket.emit('message', input.value);
        input.value = '';
        return false;
    });

    socket.on('message', addMessage);
    socket.on('feedback', setFeedback)
})();