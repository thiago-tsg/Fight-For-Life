// Styles
import "../styles/Header.scss";

// Imagens
import header from "../assets/header.webp";

// React
import { useNavigate } from "react-router-dom";

// Components
import Efeito from "./EfeitoComponent";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header container grid2col gap-xxl">
      <Efeito>
        <section className="cg-info-header flex-colum gap-md">
          {/* Subtitulo */}
          <span className="subtitle">
            JIU JITSU • MUAY THAI • BOXE • NOGI • MMA
          </span>
          {/* Título */}
          <h1>
            Evolua no tatame.
            <br />
            Transforme sua vida.
          </h1>
          {/* Descrição */}
          <p>
            A <span>Fight4Life</span> é uma academia especializada em
            artes marciais, focada no desenvolvimento físico, mental e
            técnico dos alunos através das <span>Artes marciais</span>.
          </p>
          {/* Botões */}
          <div className="hero-buttons flex gap-md">
            <button
              className="btn"
              onClick={() =>
                window.open(
                  "https://wa.me/5511976543210?text=Olá! Gostaria de agendar uma aula experimental.",
                  "_blank"
                )
              }
            >
              Aula Experimental
            </button>
            <button
              className="btn-outline btn"
              onClick={() => navigate("/planos")}
            >
              Ver Planos
            </button>
          </div>
          {/* Estatísticas */}
          <div className="hero-stats flex gap-xl">
            <div>
              <h3>+100</h3>
              <span>Alunos</span>
            </div>
            <div>
              <h3>4+</h3>
              <span>Anos</span>
            </div>
            <div>
              <h3>5</h3>
              <span>Modalidades</span>
            </div>
          </div>
        </section>
      </Efeito>

      <Efeito>
        <section className="cg-img-header flex-center">
          <div className="img-wrapper">
            <img
              src={header}
              alt="Treinamento na Academia Fight4Life"
            />
          </div>
        </section>
      </Efeito>
    </header>
  );
};

export default Header;