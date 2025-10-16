const mongoose = require('mongoose');

const teaHouseRoomSchema = new mongoose.Schema({
  name: {
    ar: { type: String, required: true },
    en: { type: String, required: true },
    ku: { type: String, required: true }
  },
  description: {
    ar: { type: String },
    en: { type: String },
    ku: { type: String }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  maxParticipants: { type: Number, default: 50 },
  isActive: { type: Boolean, default: true },
  language: {
    type: String,
    enum: ['ar', 'en', 'ku'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TeaHouseRoom', teaHouseRoomSchema);
