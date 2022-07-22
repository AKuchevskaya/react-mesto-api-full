import { useState, useContext, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({
  isOpen,
  onClose,
  onUpdateUser,
  buttonState,
  onValidate,
  errorMessage,
}) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [isNameValid, setNameValidity] = useState(false);
  const [nameError, setNameError] = useState("");

  const [description, setDescription] = useState("");
  const [isDescriptionValid, setDescriptionValidity] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");

  const [isFormValid, setValidityForm] = useState(false);

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleChangeName(e) {
    const input = e.target;

    setName(input.value);
  }
  function handleChangeDescription(e) {
    const input = e.target;

    setDescription(input.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name: name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="profile-redaction"
      isOpen={isOpen}
      onClose={onClose}
      title="Редактировать профиль"
      formName="form-redaction"
      buttonText="Сохранить"
      onSubmit={handleSubmit}
      onValidate={onValidate}
      buttonState={buttonState}
    >
      <input
        onChange={handleChangeName}
        type="text"
        name="name"
        value={name || ""}
        placeholder="ФИО"
        className={`popup__input popup__input_type_name ${
          errorMessage.name && "popup__input_type_error"
        }`}
        id="name-input"
        required
        minLength="2"
        maxLength="40"
      />
      <span className="name-input-error popup__error">
        {errorMessage.name && errorMessage.name}
      </span>

      <input
        onChange={handleChangeDescription}
        type="text"
        name="vocation"
        value={description || ""}
        placeholder="О себе"
        className={`popup__input popup__input_type_vocation ${
          errorMessage.vocation && "popup__input_type_error"
        }`}
        id="vocation-input"
        required
        minLength="2"
        maxLength="200"
      />
      <span className="vocation-input-error popup__error">
        {errorMessage.vocation && errorMessage.vocation}
      </span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
