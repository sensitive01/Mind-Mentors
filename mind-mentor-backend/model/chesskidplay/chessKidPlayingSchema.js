const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  wins: Number,
  draws: Number,
  losses: Number,
  ratingChange: Number,
});

const puzzleStatsSchema = new mongoose.Schema({
  correct: Number,
  attempted: Number,
  ratingChange: Number,
});

const periodStatsSchema = new mongoose.Schema({
  slowChessStats: statsSchema,
  blitzStats: statsSchema,
  puzzleStats: puzzleStatsSchema,
  lessonCount: Number,
  workoutCount: Number,
  articleCount: Number,
  videoCount: Number,
  trophyCount: Number,
});

const chessKidPlaying = new mongoose.Schema({
  username: String,
  userId: Number,
  firstName: String,
  lastName: String,
  level: String,
  slowChessRating: Number,
  blitzRating: Number,
  puzzleRating: Number,
  rssUrl: String,
  last7days: periodStatsSchema,
  alltime: periodStatsSchema,
}, {
  timestamps: true // ✅ This will add createdAt and updatedAt automatically
});

module.exports = mongoose.model("chessKidPlaying", chessKidPlaying);
