const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: {
    ar: { type: String, required: true },
    en: { type: String },
    ku: { type: String }
  },
  role: {
    type: String,
    enum: ['voter', 'candidate', 'admin'],
    default: 'voter'
  },
  profileImage: { type: String },
  language: {
    type: String,
    enum: ['ar', 'en', 'ku'],
    default: 'ar'
  },
  isVerified: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  bio: { type: String },
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String }
  },
  location: {
    governorate: { type: String },
    district: { type: String }
  }
}, { timestamps: true });

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
