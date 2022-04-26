const routerMovies = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { addMovieToDataBase, getAllSavedMovies } = require('../controllers/movies');

routerMovies.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required()
      .regex(/\/?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
    trailerLink: Joi.string().required()
      .regex(/https?:\/\/(www)?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
    thumbnail: Joi.string().required()
      .regex(/\/?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
    movieId: Joi.required(),
    nameRU: Joi.string().required().regex(/[\Wа-яА-ЯёЁ0-9\s\-?]+/),
    nameEN: Joi.string().required().regex(/[\w\d\s\-?]+/i),
  }),
}), addMovieToDataBase);

routerMovies.get('/', getAllSavedMovies);

module.exports = routerMovies;
