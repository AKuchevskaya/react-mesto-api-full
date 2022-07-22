import { useRef, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({
  isOpen,
  onClose,
  onUpdateAvatar,
  buttonState,
  onValidate,
  errorMessage,
}) {
  const avatarRef = useRef();

  useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="profile-avatar"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Обновить аватар"
      formName="profile-avatar"
      buttonText="Сохранить"
      onValidate={onValidate}
      buttonState={buttonState}
    >
      <input
        type="url"
        name="avatar"
        ref={avatarRef}
        placeholder="Ссылка на новый аватар"
        className={`popup__input popup__input_type_avatar ${
          errorMessage.avatar && "popup__input_type_error"
        }`}
        id="url-input"
        required
      />
      <span className="url-input-error popup__error">
        {errorMessage.avatar && errorMessage.avatar}
      </span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
