const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, updateUserInfo } = require('../controllers/users');

routerUsers.get('/me', getUserInfo);

routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), updateUserInfo);

module.exports = routerUsers;
