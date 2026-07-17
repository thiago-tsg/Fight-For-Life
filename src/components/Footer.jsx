// Styles
import "../styles/Footer.scss";

// Imagens
import logo from "../assets/logo-dourado.png";

// Components
import Efeito from "./EfeitoComponent";

const Footer = () => {
  return (
    <footer className="footer">
      <Efeito>
        <div className="cg-footer-top grid gap-xxl">
          <div className="footer-brand flex-colum gap-p">
            <img
              src={logo}
              alt="Fight4Life"
            />
            <p>
              Mais do que uma academia.
              Um lugar para desenvolver disciplina,
              confiança, condicionamento físico e
              superação através das artes marciais.
            </p>
            <div className="footer-social flex gap-md">
              <a href="#">
                <img
                  src="/icon/instagram.svg"
                  alt="Instagram"
                />
              </a>
              <a href="#">
                <img
                  src="/icon/facebook.svg"
                  alt="Facebook"
                />
              </a>
              <a href="#">
                <img
                  src="/icon/tiktok.svg"
                  alt="TikTok"
                />
              </a>
              <a href="#">
                <img
                  src="/icon/youtube.svg"
                  alt="YouTube"
                />
              </a>
            </div>
          </div>
          <div className="footer-links flex-colum gap-md">
            <h3>Navegação</h3>
            <a href="#home">Início</a>
            <a href="#quemsomos">Quem Somos</a>
            <a href="#planos">Planos</a>
            <a href="#contato">Contato</a>
          </div>
          <div className="footer-links flex-colum gap-md">
            <h3>Modalidades</h3>
            <p>Jiu Jitsu</p>
            <p>Muay Thai</p>
            <p>Boxe</p>
            <p>NoGi</p>
            <p>Infantil</p>
          </div>
          <div className="footer-contact flex-colum gap-md">
            <h3>Contato</h3>
            <tel>(11) 98922-6951</tel>
            <andress>
              R. Dona Cecília Santana, 513
              <br />
              Vila Granada - São Paulo/SP
            </andress>
            <a
              href="https://wa.me/5511989226951"
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              Aula Experimental
            </a>
          </div>
        </div>
      </Efeito>

      <Efeito>
        <div className="footer-bottom flex-center gap-p">
          <p>
            © 2026 Academia Fight4Life.
            Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido por
            <span> Thiago SG</span>
          </p>
        </div>
      </Efeito>
    </footer>
  );
};

export default Footer;