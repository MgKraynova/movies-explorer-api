const routerApp = require('express').Router();
const auth = require('../middlewares/auth');
const routerAuthorization = require('./authorization');
const routerUsers = require('./users');
const routerMovies = require('./movies');

routerApp.use('/api', routerAuthorization);

routerApp.use(auth);

routerApp.use('/api/users', routerUsers);

routerApp.use('/api/movies', routerMovies);

module.exports = routerApp;
