const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: { type: String, required: true },
  media: [{ type: String }],
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'voice'],
    default: 'text'
  },
  language: {
    type: String,
    enum: ['ar', 'en', 'ku'],
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ language: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
