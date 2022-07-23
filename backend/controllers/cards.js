const Card = require('../models/card');
const {
  SUCCESSFUL_STATUS_CODE,
} = require('../constants/errors');

const BadReqError = require('../errors/BadReqError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404

module.exports.getCards = (req, res, next) => {
  Card.find({})
    // .populate('owner')
    .then((cards) => res.status(SUCCESSFUL_STATUS_CODE).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(SUCCESSFUL_STATUS_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw (new ForbiddenError('У вас нет необходимых прав для удаления.'));
      }
      Card.findByIdAndRemove({ _id: req.params.cardId })
        .then((removedCard) => res.status(SUCCESSFUL_STATUS_CODE).send(removedCard))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для удаления карточки'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.status(SUCCESSFUL_STATUS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для постановки/снятия лайка'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.status(SUCCESSFUL_STATUS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные для постановки/снятия лайка'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
