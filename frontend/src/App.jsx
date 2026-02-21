import useSocket from './hooks/useSocket';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import Lobby from './components/Lobby';

export default function App() {
    const {
        connected, myId, world, players, mobs, emit,
        inGame, roomId, roomName, roomList,
        createRoom, joinRoom, leaveRoom, refreshRooms,
    } = useSocket();

    // Show lobby when not in a game room
    if (!inGame) {
        return (
            <Lobby
                connected={connected}
                roomList={roomList}
                createRoom={createRoom}
                joinRoom={joinRoom}
                refreshRooms={refreshRooms}
            />
        );
    }

    // In-game view
    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            <GameCanvas
                world={world}
                players={players}
                mobs={mobs}
                myId={myId}
                emit={emit}
            />
            <HUD
                players={players}
                myId={myId}
                connected={connected}
                roomName={roomName}
                onLeave={leaveRoom}
            />
        </div>
    );
}
