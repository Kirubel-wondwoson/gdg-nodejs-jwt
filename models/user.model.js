const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  fullName: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Student', 'Admin', 'SuperAdmin']
  }
}, {timestamps: true})

const User = mongoose.model('UserSchema', UserSchema)

module.exports = User;