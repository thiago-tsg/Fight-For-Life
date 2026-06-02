// Styles
import "../styles/Header.scss";

// Imagens
import header from "../assets/header.jpg";

const Header = () => {
  return (
    <header className="header container grid2col gap-xxl">
      <section className="cg-info-header flex-colum gap-md">

        {/* Subtitulo */}
        <span className="subtitle">
          JIU JITSU • MUAY THAI • BOXE • NOGI
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
          técnico dos alunos através do <span>Jiu Jitsu</span>,
          <span> Muay Thai</span>, <span>Boxe</span> e
          <span> NoGi</span>.
        </p>

        {/* Botões */}
        <div className="hero-buttons flex gap-md">
          <button className="btn">
            Aula Experimental
          </button>

          <button className="btn-outline btn">
            Ver Planos
          </button>
        </div>

        {/* Estatísticas */}
        <div className="hero-stats flex gap-xl">
          <div>
            <h3>+500</h3>
            <span>Alunos</span>
          </div>

          <div>
            <h3>10+</h3>
            <span>Anos</span>
          </div>

          <div>
            <h3>4</h3>
            <span>Modalidades</span>
          </div>
        </div>

      </section>

      <section className="cg-img-header flex-center">
        <div className="img-wrapper">
          <img
            src={header}
            alt="Treinamento na Academia Fight4Life"
          />
        </div>
      </section>
    </header>
  );
};

export default Header;