const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permits: [{ type: String }]
}, {
  collection: 'users',
  timestamps: true,
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 30000
  },
  read: 'nearest'
});

const Model = mongoose.model('User', userSchema);
module.exports = Model;