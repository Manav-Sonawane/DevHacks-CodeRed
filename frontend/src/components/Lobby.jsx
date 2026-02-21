import { useState } from 'react';

export default function Lobby({ connected, roomList, createRoom, joinRoom, refreshRooms }) {
    const [newRoomName, setNewRoomName] = useState('');

    const handleCreate = (e) => {
        e.preventDefault();
        if (newRoomName.trim()) {
            createRoom(newRoomName.trim());
            setNewRoomName('');
        }
    };

    return (
        <div className="lobby-container">
            {/* Animated background particles */}
            <div className="lobby-particles">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 6}s`,
                        animationDuration: `${4 + Math.random() * 6}s`,
                    }} />
                ))}
            </div>

            <div className="lobby-content">
                {/* Logo & Title */}
                <div className="lobby-header">
                    <div className="lobby-logo">⛏️</div>
                    <h1 className="lobby-title">Survival Sandbox</h1>
                    <p className="lobby-subtitle">
                        <span className={`status-dot ${connected ? 'online' : 'offline'}`} />
                        {connected ? 'Connected to server' : 'Connecting...'}
                    </p>
                </div>

                {/* Create Room Card */}
                <div className="lobby-card">
                    <h2 className="card-title">🏠 Create a Room</h2>
                    <form onSubmit={handleCreate} className="create-form">
                        <input
                            type="text"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            placeholder="Enter room name..."
                            className="room-input"
                            maxLength={30}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="btn-create"
                            disabled={!newRoomName.trim() || !connected}
                        >
                            Create & Play
                        </button>
                    </form>
                </div>

                {/* Room List Card */}
                <div className="lobby-card">
                    <div className="card-header">
                        <h2 className="card-title">🌐 Available Rooms</h2>
                        <button onClick={refreshRooms} className="btn-refresh" title="Refresh">
                            ↻
                        </button>
                    </div>

                    {roomList.length === 0 ? (
                        <div className="empty-rooms">
                            <p className="empty-icon">🏜️</p>
                            <p className="empty-text">No rooms yet — create one!</p>
                        </div>
                    ) : (
                        <div className="room-list">
                            {roomList.map((room) => (
                                <div key={room.id} className="room-item">
                                    <div className="room-info">
                                        <span className="room-name">{room.name}</span>
                                        <span className="room-players">
                                            👥 {room.playerCount} player{room.playerCount !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => joinRoom(room.id)}
                                        className="btn-join"
                                        disabled={!connected}
                                    >
                                        Join
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Controls Help */}
                <div className="lobby-controls">
                    <span><b>WASD</b> Move</span>
                    <span><b>E</b> Break</span>
                    <span><b>Space</b> Attack</span>
                </div>
            </div>
        </div>
    );
}
