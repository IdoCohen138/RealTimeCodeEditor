import React from "react";

const Popup = ({ onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        <h2>Congratulations!</h2>
        <img src="/emoji.jpg" className="smiley" />
        <p>You solved the challenge</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
