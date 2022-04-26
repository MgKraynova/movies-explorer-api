const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const ConflictingRequest = require('../errors/ConflictingRequest');

module.exports.addMovieToDataBase = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.find({ movieId })
    .then((response) => {
      if (response.length === 0) {
        Movie.create({
          country,
          director,
          duration,
          year,
          description,
          image,
          trailerLink,
          thumbnail,
          owner: req.user._id,
          movieId,
          nameRU,
          nameEN,
        })
          .then(() => {
            Movie.findOne({ movieId })
              .then((movie) => {
                res.send(movie);
              })
              .catch((err) => {
                if (err.name === 'ValidationError') {
                  next(new ValidationError('Ошибка. При создании пользователя были переданы некорректные данные'));
                } else {
                  next(err);
                }
              });
          })
          .catch(next);
      } else {
        next(new ConflictingRequest('Ошибка. Фильм уже сохранен пользователем'));
      }
    });
};

module.exports.getAllSavedMovies = (req, res, next) => {
  Movie.find({}).sort({ createdAt: -1 })
    .then((result) => res.send(result))
    .catch(next);
};

