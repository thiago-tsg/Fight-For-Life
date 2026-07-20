// Styles
import "../styles/Contato.scss";

// Components
import Efeito from "./EfeitoComponent";

//Imagens
import Insta from "../assets/icon/instagram.svg";
import TikTok from "../assets/icon/tiktok.svg";
import Facebook from "../assets/icon/facebook.svg";
import X from "../assets/icon/x.svg";

const Contato = () => {
  return (
    <section className="contato container">
      <Efeito>
        <section className="contato-header center">
          <span>FALE CONOSCO</span>
          <h2>Entre em Contato</h2>
          <p>
            Tire suas dúvidas, agende sua aula experimental ou solicite mais
            informações sobre nossas modalidades.
          </p>
        </section>
      </Efeito>

      <section className="contato-content grid gap-xl">
        <Efeito>
          <div className="cg-form">
            <h3>Envie sua mensagem</h3>
            <form className="contato-form flex-colum gap-md">
              <input type="text" placeholder="Seu nome" required />
              <input type="email" placeholder="Seu email" required />
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                required
              />
              <textarea
                placeholder="Digite sua mensagem..."
                rows="6"
                required
              ></textarea>
              <button className="btn" type="submit">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </Efeito>

        <Efeito>
          <div className="contato-info flex-colum">
            <h3>Informações</h3>
            <div className="info-detalhes flex-colum gap-lg">
              <div>
                <strong>Telefone</strong>
                <tel className="tel">(11) 98922-6951</tel>
              </div>
              <div>
                <strong>Email</strong>
                <email className="email">contato@seudominio.com</email>
              </div>
              <div>
                <strong>Endereço</strong>
                <andress className="andress">
                  R. Dona Cecília Santana, 513
                  <br />
                  Vila Granada - São Paulo/SP
                  <br />
                  CEP: 03622-010
                </andress>
              </div>
            </div>
            <div className="redes-sociais">
              <h4>Siga-nos</h4>
              <div className="flex gap-md">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src={Facebook}
                    alt="Facebook" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src={Insta}
                    alt="Instagram" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src={TikTok}
                    alt="TikTok" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src={X}
                    alt="X" />
                </a>
              </div>
            </div>
          </div>
        </Efeito>
      </section>

      <Efeito>
        <section className="mapa-contato">
          <h3 className="center">Onde Estamos</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!4v1763531925570!6m8!1m7!1sBHr9iXxsybv5OLAGJPndtg!2m2!1d-23.51703523873262!2d-46.51618812175126!3f217.9705832142205!4f-4.852004459506389!5f0.4000000000000002"
            width="100%"
            height="500"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            title="Mapa Academia"
          />
        </section>
      </Efeito>
    </section>
  );
};

export default Contato;