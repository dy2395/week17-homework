const { Schema, model } = require('mongoose');

const ThoughtSchema = new Schema({
  thoughtText: {
    type: String,
    trim: true,
    required: 'Text is Required',
    minlength: 1,
    maxlength: 280
  },

  username: {
    type: String,
    trim: true,
    required: 'User is Required',
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
