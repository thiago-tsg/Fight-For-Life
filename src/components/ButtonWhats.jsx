import React from 'react';
import whatsappIcon from '../assets/icon/whatsapp.svg';

//style
import '../styles/ButtonWhats.scss';

const FloatingWhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/5511989226951" // coloque o número correto
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <img src={whatsappIcon} alt="WhatsApp" />
    </a>
  );
};

export default FloatingWhatsAppButton;
