export default function HUD({ players, myId, connected, roomName, onLeave }) {
    const me = players[myId];
    const playerCount = Object.keys(players).length;

    return (
        <div className="fixed top-0 left-0 right-0 z-10 pointer-events-none">
            {/* Top bar */}
            <div className="flex items-center justify-between p-4">
                {/* Left: Game title + room info */}
                <div className="pointer-events-auto">
                    <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
                        <h1 className="text-lg font-bold tracking-wide text-white flex items-center gap-2">
                            ⛏️ {roomName || 'Survival Sandbox'}
                            <span className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                        </h1>
                        <p className="text-xs text-gray-400 font-mono">
                            {playerCount} player{playerCount !== 1 ? 's' : ''} in room
                        </p>
                    </div>
                </div>

                {/* Right: Controls + Leave button */}
                <div className="pointer-events-auto flex items-center gap-3">
                    <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 text-right">
                        <p className="text-xs text-gray-300 font-mono leading-relaxed">
                            <span className="text-white font-bold">WASD</span> Move &nbsp;·&nbsp;
                            <span className="text-white font-bold">E</span> Break &nbsp;·&nbsp;
                            <span className="text-white font-bold">Space</span> Attack
                        </p>
                    </div>
                    {onLeave && (
                        <button
                            onClick={onLeave}
                            className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 hover:text-white rounded-xl px-4 py-3 text-xs font-bold tracking-wider transition-all duration-200"
                        >
                            ✕ LEAVE
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom: Health + Hunger bars */}
            {me && (
                <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
                    <div className="max-w-md mx-auto bg-black/60 backdrop-blur-md rounded-xl px-5 py-4 border border-white/10 space-y-3">
                        {/* Health */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-red-400 tracking-wider">❤️ HEALTH</span>
                                <span className="text-xs font-mono text-gray-300">{me.health}/100</span>
                            </div>
                            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${me.health}%`,
                                        background: me.health > 50
                                            ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                                            : me.health > 25
                                                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                                : 'linear-gradient(90deg, #ef4444, #f87171)',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Hunger */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-amber-400 tracking-wider">🍖 HUNGER</span>
                                <span className="text-xs font-mono text-gray-300">{me.hunger}/100</span>
                            </div>
                            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${me.hunger}%`,
                                        background: me.hunger > 50
                                            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                            : me.hunger > 25
                                                ? 'linear-gradient(90deg, #ef4444, #f87171)'
                                                : 'linear-gradient(90deg, #991b1b, #dc2626)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
