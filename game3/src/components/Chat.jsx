import React, { useState, useRef, useEffect } from 'react';

export function Chat({ messages, sendChat }) {
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
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            width: '320px',
            height: '240px',
            backgroundColor: 'rgba(10, 15, 10, 0.75)',
            border: '1px solid rgba(180, 200, 100, 0.3)',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '"Courier New", Courier, monospace',
            zIndex: 1000,
            pointerEvents: 'auto',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
        }}>
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
            }}>
                {messages.length === 0 ? (
                    <div style={{ color: 'rgba(180, 200, 100, 0.4)', fontStyle: 'italic', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
                        No comms active...
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} style={{ fontSize: '13px', lineHeight: '1.4', wordBreak: 'break-word' }}>
                            <span style={{ color: '#d4dda0', fontWeight: 'bold' }}>[{msg.player}]</span>
                            <span style={{ color: '#e8e8e8', marginLeft: '6px' }}>{msg.message}</span>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                borderTop: '1px solid rgba(180, 200, 100, 0.3)',
                padding: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
            }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Broadcast message..."
                    onKeyDown={(e) => e.stopPropagation()}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: '#d4dda0',
                        outline: 'none',
                        fontSize: '13px',
                        fontFamily: '"Courier New", Courier, monospace',
                        padding: '4px 6px'
                    }}
                    maxLength={100}
                />
            </form>
        </div>
    );
}
