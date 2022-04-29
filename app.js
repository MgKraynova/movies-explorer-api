require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const routerApp = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV, DATA_BASE } = process.env;

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

app.use(helmet());

app.use(cors({
  origin: 'https://movies-app.nomoredomains.work',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(requestLogger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routerApp);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

process.on('uncaughtException', (err) => {
  console.log(`${err.name} c текстом ${err.message} не была обработана.`);
});
