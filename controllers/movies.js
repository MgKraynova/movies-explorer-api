const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const ConflictingRequest = require('../errors/ConflictingRequest');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ForbiddenError = require('../errors/ForbiddenError');

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
                if (movie) {
                  res.send(movie);
                } else {
                  next(new NotFoundError('Ошибка. Фильм не найден в базе данных сохраненных фильмов'));
                }
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
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getAllSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }).sort({ createdAt: -1 })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteFilm = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (movie) {
        const movieOwner = movie.owner.toString().replace('new ObjectId("', '');
        if (req.user._id === movieOwner) {
          Movie.findByIdAndRemove(req.params._id)
            .then((result) => {
              res.send(result);
            })
            .catch((err) => {
              if (err.name === 'CastError') {
                next(new CastError('Ошибка. Введен некорректный id карточки'));
              } else {
                next(err);
              }
            });
        } else {
          next(new ForbiddenError('Отстутствуют права на удаление фильма'));
        }
      } else {
        next(new NotFoundError('Ошибка. Фильм не найден в базе данных сохраненных фильмов'));
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Ошибка. Фильм не найден в базе данных сохраненных фильмов'));
      } else {
        next(err);
      }
    });
};
