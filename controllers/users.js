require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ValidationError = require('../errors/ValidationError');
const ConflictingRequest = require('../errors/ConflictingRequest');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { secretKeyForDev } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Ошибка. Пользователь не найден, попробуйте еще раз'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Ошибка. Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.find({ email })
    .then((result) => {
      if (result.length === 0 || (result.length === 1 && result[0].email === email)) {
        User.findByIdAndUpdate(
          req.user._id,
          { name, email },
          { new: true, runValidators: true },
        )
          .then((user) => {
            if (user) {
              res.send(user);
            } else {
              next(new NotFoundError('Ошибка. Пользователь не найден, попробуйте еще раз'));
            }
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new CastError('Ошибка. Введен некорректный id пользователя'));
            } else if (err.name === 'ValidationError') {
              next(new ValidationError('Ошибка. При обновлении данных пользователя были переданы некорректные данные'));
            } else {
              next(err);
            }
          });
      } else {
        next(new ConflictingRequest('Ошибка. Пользователь c таким email уже зарегистрирован'));
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  User.find({ email })
    .then((response) => {
      if (response.length === 0) {
        bcrypt.hash(password, 10)
          .then((hash) => {
            User.create({
              name, email, password: hash,
            })
              .then((user) => User.findOne({ _id: user._id }))
              .then((user) => {
                res.send(user);
              })
              .catch((err) => {
                if (err.name === 'ValidationError') {
                  next(new ValidationError('Ошибка. При создании пользователя были переданы некорректные данные'));
                } else {
                  next(err);
                }
              });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        next(new ConflictingRequest('Ошибка. Пользователь c таким email уже зарегистрирован'));
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : secretKeyForDev,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Почта или пароль введены неправильно'));
    });
};
