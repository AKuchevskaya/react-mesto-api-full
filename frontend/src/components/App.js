import { useState, useEffect } from "react";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import Header from "./Header";
import * as Auth from "../utils/Auth.js";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import Login from "./Login";
import Main from "./Main";
import Footer from "./Footer";
import InfoTooltip from "./InfoTooltip";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/Api";
import success from "../../src/images/ok.svg";
import error from "../../src/images/error.svg";

function App() {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isQwestionPopupOpen, setQwestionPopupOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [removedCard, setRemovedCard] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState('');
  const history = useHistory();
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [tooltip, setTooltip] = useState({
    image: success,
    message: "Вы успешно зарегистрировались!",
  });

  const [errorMessage, setErrorMessage] = useState({});
  const [buttonState, setButtonState] = useState(true);

  function tokenCheck() {
    if (localStorage.getItem("jwt")) {
      let token = localStorage.getItem("jwt");
      return Auth.getContent(token)
        .then((res) => {
          setLoggedIn(true);
        })
        .catch((err) => {
          console.log(`Ошибка проверки токена...: ${err}`);
        });
    }
  }

  useEffect(() => {
    tokenCheck();
  }, []);
  useEffect(() => {
    if (loggedIn) {
      history.push("/");
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([
        //в Promise.all передаем массив промисов которые нужно выполнить
        api.getInitialCards(),
        api.getProfile(),
      ])
        .then(([cards, userData]) => {
          setCards(cards);
          setCurrentUser(userData);
        })
        .catch((err) => {
          console.log(`Ошибка получения данных пользователя.....: ${err}`);
        });
    }
  }, [loggedIn]);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
        state.map((item) => (item._id === card._id ? newCard : item))
        );
      })
      .catch((err) => {
        console.log(`Ошибка обработки данных картинки.....: ${err}`);
      });
  }

  function handleCardDelete() {
    api
      .deleteCard(removedCard._id)
      .then(() => {
        setCards((state) =>
          state.filter((item) => item._id !== removedCard._id)
        );
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка удаления карточки.....: ${err}`);
      });
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }
  function handleButtonDeleteClick(card) {
    setQwestionPopupOpen(true);
    setRemovedCard(card);
  }

  function handleCardClick(card) {
    setSelectedCard({
      isOpened: true,
      name: card.name,
      link: card.link,
    });
  }
  function handleUpdateAvatar(avatar) {
    api
      .editAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка обновления аватара.....: ${err}`);
      });
  }
  
  function handleUpdateUser(userData) {
    api
      .editProfile(userData)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка обновления данных пользователя.....: ${err}`);
      });
  }

  function handleAddPlaceSubmit(card) {
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка добавления новой карточки.....: ${err}`);
      });
  }
  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setQwestionPopupOpen(false);
    setSelectedCard({ ...selectedCard, isOpened: false });
    setTooltipOpen(false);
  }
  function handleRegister({ email, password }) {
    return Auth.register(email, password)
      .then((res) => {
        const { email } = res.data;
        setUserData({ ...userData, email });
        if (res) {
          history.push("/signin");
          setTooltipOpen(true);
          setTooltip({
            image: success,
            message: "Вы успешно зарегистрировались!",
          });
        } else {
          setTooltipOpen(true);
          setTooltip({
            image: success,
            message: "Что-то пошло не так! Попробуйте ещё раз.",
          });
        }
      })
      .catch((err) => {
        console.log(`Ошибка регистрации...: ${err}`);
        setTooltipOpen(true);

        setTooltip({
          image: error,
          message: "Что-то пошло не так! Попробуйте ещё раз.",
        });
      });
  }

  function handleLogin({ email, password }) {
    return Auth.authorize(email, password)
      .then((data) => {

        if (data.token) {
          localStorage.setItem('jwt', data.token);
          tokenCheck();
          setLoggedIn(true);
          history.push('/');
        } else {
          setLoggedIn(false);
        }
      })
      .catch((err) => {
        console.log(`Ошибка авторизации...: ${err}`);
        setTooltipOpen(true);
        setTooltip({
          image: error,
          message: "Что-то пошло не так! Попробуйте ещё раз.",
        });
      });
  }

  function signOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setUserData({ email: "" });
    history.push("/signin");
  }

  function checkInputValidity(evt) {
    if (!evt.currentTarget.checkValidity()) {
      setErrorMessage({
        ...errorMessage,
        [evt.target.name]: evt.target.validationMessage,
      });
      setButtonState(true);
    } else {
      setErrorMessage({});
      setButtonState(false);
    }
  }

  useEffect(() => {
    setErrorMessage({});
    setButtonState(true);
  }, [isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__container">
        <Header loggedIn={loggedIn} userData={userData} signOut={signOut} />
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Main
              cards={cards}
              onCardClick={handleCardClick}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardLike={handleCardLike}
              onCardButtonDeleteClick={handleButtonDeleteClick}
            />
            <Footer />
          </ProtectedRoute>

          <Route path="/signup">
            <Register handleRegister={handleRegister} />
          </Route>
          <Route path="/signin">
            <Login handleLogin={handleLogin} tokenCheck={tokenCheck} />
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>
        <InfoTooltip
          name="answer"
          isOpen={isTooltipOpen}
          onClose={closeAllPopups}
          tooltip={tooltip.image}
          message={tooltip.message}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onValidate={checkInputValidity}
          buttonState={buttonState}
          errorMessage={errorMessage}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          onValidate={checkInputValidity}
          buttonState={buttonState}
          errorMessage={errorMessage}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          onValidate={checkInputValidity}
          buttonState={buttonState}
          errorMessage={errorMessage}
        />

        <DeleteCardPopup
          isOpen={isQwestionPopupOpen}
          onClose={closeAllPopups}
          handleCardDelete={handleCardDelete}
        />

        <ImagePopup selectedCard={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;