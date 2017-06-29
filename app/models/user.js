// Example model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: 'String', required: true },
  surname: { type: 'String', required: true },
  status: { type: 'String', default: 'online', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

mongoose.model('User', UserSchema);

