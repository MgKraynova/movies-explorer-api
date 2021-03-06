const routerMovies = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { addMovieToDataBase, getAllSavedMovies, deleteFilm } = require('../controllers/movies');

routerMovies.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/\/?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
    trailerLink: Joi.string().required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле trailerLink заполнено неккорректно');
      }),
    thumbnail: Joi.string().required()
      .regex(/\/?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
    movieId: Joi.required(),
    nameRU: Joi.string().required().regex(/[\Wа-яА-ЯёЁ0-9\s\-?]+/),
    nameEN: Joi.string().required().regex(/[\w\d\s\-?]+/i),
  }),
}), addMovieToDataBase);

routerMovies.get('/', getAllSavedMovies);

routerMovies.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum(),
  }),
}), deleteFilm);

module.exports = routerMovies;
