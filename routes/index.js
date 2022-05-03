const routerApp = require('express').Router();
const auth = require('../middlewares/auth');
const routerAuthorization = require('./authorization');
const routerUsers = require('./users');
const routerMovies = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

routerApp.use('/api', routerAuthorization);

routerApp.use(auth);

routerApp.use('/api/users', routerUsers);

routerApp.use('/api/movies', routerMovies);

routerApp.use((req, res, next) => {
  next(new NotFoundError('Ошибка. Роут не существует'));
});

module.exports = routerApp;
