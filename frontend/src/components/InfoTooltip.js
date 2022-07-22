import React from "react";

function InfoTooltip({ name, isOpen, onClose, tooltip, message }) {
  return (
    <div className={`popup popup_${name} ${isOpen && "popup_opened"}`}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__close"
          onClick={onClose}
        ></button>
        <img className="popup__info" src={tooltip} alt="иконка ответа" />
        <h3 className="popup__title">{message}</h3>
      </div>
    </div>
  );
}
export default InfoTooltip;