import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const ChatApp = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSendClick = async () => {
        if (!input.trim()) return;
        const message = {
            text: input,
            from: 'user'
        };
        setMessages([...messages, message]);
        setInput('');

        try {
            // const response = await axios.post('http://localhost:5001/api/question', { question: input });
            const response = await axios.post('https://infinitus-assignment.wl.r.appspot.com/api/question', { question: input });
            
            const reply = {
                text: response.data.answer,
                from: 'bot'
            };
            setMessages(messages => [...messages, reply]);
        } catch (error) {
            console.error('Error while fetching data:', error);
            setMessages(messages => [...messages, { text: 'Error getting response', from: 'bot' }]);
        }
    };

    return (
        <div className="container my-5">
            <div className="card shadow-lg">
                <div className="card-header text-white bg-dark">
                    Chat with AI
                </div>
                <div className="card-body bg-light">
                    <div className="message-list" style={{ height: '400px', overflowY: 'auto' }}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`alert ${msg.from === 'user' ? 'alert-primary' : 'alert-success'} my-1`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="input-group mt-3">
                        <input
                            type="text"
                            className="form-control"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendClick()}
                            placeholder="Type your question..."
                        />
                        <button className="btn btn-warning text-white" onClick={handleSendClick}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
