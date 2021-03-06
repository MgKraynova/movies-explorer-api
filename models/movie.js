const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    pattern: '/\\/?[0-9а-яa-zё]{1,}\\.[а-яa-zё]{2}[a-zа-яё\\-._~:/?#[\\]@!$&\'()*+,;=]*#?/i',
  },
  trailerLink: {
    type: String,
    required: true,
    validate: [validator.isURL, 'invalid URL in trailerLink'],
  },
  thumbnail: {
    type: String,
    required: true,
    pattern: '/\\/?[0-9а-яa-zё]{1,}\\.[а-яa-zё]{2}[a-zа-яё\\-._~:/?#[\\]@!$&\'()*+,;=]*#?/i',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    required: true,
    type: Number,
  },
  nameRU: {
    type: String,
    required: true,
    pattern: '/[\\Wа-яА-ЯёЁ0-9\\s\\-?]+/g',
  },
  nameEN: {
    type: String,
    required: true,
    pattern: '/[\\w\\d\\s\\-?]+/gi',
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
