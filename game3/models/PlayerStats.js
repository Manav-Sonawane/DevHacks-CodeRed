const mongoose = require('mongoose');

const PlayerStatsSchema = new mongoose.Schema({
    nickname: { type: String, required: true, unique: true },
    nightsSurvived: { type: Number, default: 0 },
    foodEaten: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('DarkroomPlayerStats', PlayerStatsSchema);
