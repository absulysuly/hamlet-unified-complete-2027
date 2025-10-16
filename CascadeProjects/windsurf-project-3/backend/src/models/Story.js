const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mediaUrl: { type: String, required: true },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  duration: { type: Number, default: 24 * 60 * 60 * 1000 },
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

module.exports = mongoose.model('Story', storySchema);
