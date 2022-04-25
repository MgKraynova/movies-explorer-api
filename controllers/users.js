const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ValidationError = require('../errors/ValidationError');


module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findOne({ _id: userId })
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
}

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send( user );
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
};