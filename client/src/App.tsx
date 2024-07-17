import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const ws = new WebSocket('ws://localhost:8090');

const App: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string, sender: string }[]>([]);
  const [message, setMessage] = useState<string>('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ws.onmessage = (event: MessageEvent) => {
      setMessages((prevMessages) => [...prevMessages, { text: event.data, sender: 'other' }]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };

    ws.onopen = () => {
      console.log('WebSocket connected');
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message) {
      ws.send(message);
      setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'me' }]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="flex flex-col w-full max-w-lg bg-gray-300 p-4 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4">
          <h1 className="text-white text-2xl">Chat Application</h1>
        </div>
        <div className="flex flex-col h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`p-2 rounded-lg ${msg.sender === 'me' ? 'bg-blue-800 self-end' : 'bg-gray-800 self-start'}`}
              style={{ alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <div className="flex p-4 border-t">
          <input
            type="text"
            className="w-full p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
