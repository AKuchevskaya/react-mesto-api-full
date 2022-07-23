const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  // const { authorization } = req.headers;
  const token = req.cookies.jwt;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  if (!token) {
    const error = new UnauthorizedError('Пожалуйста авторизуйтесь.');
    throw error;
  }
  // извлечём токен
  //const token = authorization.replace('Bearer ', '');
  // верифицируем токен
  let payload;
  console.log('token', token);
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    const error = new UnauthorizedError('Пожалуйста авторизуйтесь.');
    throw error;
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
