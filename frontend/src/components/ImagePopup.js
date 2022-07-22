import React, { useEffect } from "react";

function ImagePopup({ selectedCard, onClose }) {
  useEffect(() => {
    if (!selectedCard.isOpened) return;

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
  }, [selectedCard.isOpened]);

  return (
    <div
      className={`popup popup_card-review ${
        selectedCard.isOpened && "popup_opened"
      }`}
    >
      <div className="popup__box">
        <button
          onClick={onClose}
          type="button"
          className="popup__close popup__close-card"
        ></button>
        <figure className="popup__figure">
          <img
            className="popup__card"
            src={selectedCard.link}
            alt={selectedCard.name}
          />
          <figcaption className="popup__figcaption">
            {selectedCard.name}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
export default ImagePopup;
