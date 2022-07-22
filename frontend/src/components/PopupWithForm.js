import React, { useEffect } from "react";

function PopupWithForm({
  name,
  isOpen,
  onClose,
  title,
  onSubmit,
  formName,
  children,
  buttonText,
  onValidate,
  buttonState,
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEsc(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    function hundleClick(evt) {
      if (evt.target.classList.contains("popup_opened")) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("click", hundleClick);
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("click", hundleClick);
    };
  }, [isOpen]);

  return (
    <div className={`popup popup_${name} ${isOpen && "popup_opened"}`}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__close"
          onClick={onClose}
        ></button>
        <h3 className="popup__title">{title}</h3>
        <form
          name={formName}
          onSubmit={onSubmit}
          className={`popup__form  popup__${formName}`}
          onChange={onValidate}
          noValidate
        >
          {children}
          <button
            type="submit"
            className={`popup__save ${buttonState && "popup__save_inactive"}`}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
export default PopupWithForm;
