import { useState, useRef, useEffect } from 'react';

export default function Chat({ messages, sendChat }) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            sendChat(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="absolute bottom-4 left-4 w-80 h-64 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex flex-col overflow-hidden pointer-events-auto shadow-2xl z-50">
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/20">
                {messages.map((msg, idx) => (
                    <div key={idx} className="text-sm">
                        <span className="font-bold text-yellow-400">[{msg.player}]</span>
                        <span className="text-gray-200 ml-2 break-words">{msg.message}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-2 bg-black/40 border-t border-white/10">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Press Enter to chat..."
                    className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-500 px-2 py-1"
                    maxLength={100}
                />
            </form>
        </div>
    );
}
