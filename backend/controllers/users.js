const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const DEV_SECRET = 'dev-secret';
const {
  SUCCESSFUL_STATUS_CODE,
} = require('../constants/errors');

const BadReqError = require('../errors/BadReqError'); // 400
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET,
        // 'very-secret-key',
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );

      // вернём токен
      // res.send({ token });

      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: true,
      }).send({ token });
    })
    .catch(() => {
      // ошибка аутентификации
      next(new UnauthorizedError('Требуется авторизация.'));
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    // eslint-disable-next-line no-unused-vars
    password,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then((user) => {
      res.status(SUCCESSFUL_STATUS_CODE)
        .send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError') {
        next(new ConflictError('Такой email уже существует.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Передан несуществующий _id пользователя'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => next(err));
};

module.exports.findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Передан некорректный _id пользователя'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      next(new NotFoundError('Передан несуществующий _id пользователя'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      next(new NotFoundError('Передан несуществующий _id пользователя'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при обновлении аватара профиля'));
      } else {
        next(err);
      }
    });
};
