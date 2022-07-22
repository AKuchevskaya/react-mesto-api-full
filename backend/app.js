const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger'); 
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
const {
  SERVER_ERROR_CODE,
} = require('./constants/errors');
const NotFoundError = require('./errors/NotFoundError'); // 404

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/http(s?):\/\/(www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+([0-9a-zA-Z-._~:?#[\]@!$&'()*+,;=]+)/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }).unknown(true),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }).unknown(true),
}), login);

app.use(cookieParser());
app.use(auth);

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use(logger);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

app.use(errors({ message: 'Проверьте корректность введенных данных' }));

app.use((err, req, res, next) => {
  if (err.statusCode === 500) {
    res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT, () => {
  console.log('App started', PORT);
});
