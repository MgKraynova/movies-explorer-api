const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');

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