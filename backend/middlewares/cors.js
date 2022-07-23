const allowedCors = [
    'https://mesto.kuchevskaya.nomoredomains.xyz',
    'http://mesto.kuchevskaya.nomoredomains.xyz',
    'http://api.mesto.kuchevskaya.nomoredomains.xyz',
    'https://api.mesto.kuchevskaya.nomoredomains.xyz',
    'localhost:3000',
    'http://localhost:3000',
    'https://localhost:3000',
    'localhost:3001',
    'http://localhost:3001',
    'https://localhost:3001',
  ];
  
  // eslint-disable-next-line consistent-return
  module.exports = (req, res, next) => {
    const { origin } = req.headers;
    const { method } = req;
    const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
    const requestHeaders = req.headers['access-control-request-headers'];
  
    if (allowedCors.includes(origin)) {
      // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', true);
    }
    // Если это предварительный запрос, добавляем нужные заголовки
    if (method === 'OPTIONS') {
      // разрешаем кросс-доменные запросы любых типов (по умолчанию)
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      // разрешаем кросс-доменные запросы с этими заголовками
      res.header('Access-Control-Allow-Headers', requestHeaders);
      // завершаем обработку запроса и возвращаем результат клиенту
      return res.end();
    }
    next();
  };