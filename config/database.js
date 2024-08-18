// config/database.js

const mongoose = require('mongoose');

module.exports = function() {
  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dealHelper';
  mongoose.connect(dbUri, { maxPoolSize: 20 })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
};