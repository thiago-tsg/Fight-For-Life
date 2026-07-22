// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Styles
import "../styles/Main.scss";

// Components
import Efeito from "./EfeitoComponent";
import Mapa from "./Mapa";

// Imagens
import Foto1main from "../assets/foto-main-1.webp";

const Main = () => {
  const navigate = useNavigate();

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });

  // Estado para armazenar feedback de sucesso ou erro
  const [feedback, setFeedback] = useState({
    message: "",
    type: "",
  });

  // Função para atualizar o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/enviar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.text();

      setFeedback({
        message: data,
        type: "success",
      });

      setFormData({
        nome: "",
        email: "",
        mensagem: "",
      });

      setTimeout(() => {
        setFeedback({
          message: "",
          type: "",
        });
      }, 5000);
    } catch (error) {
      console.error(error);

      setFeedback({
        message: "Erro ao enviar mensagem.",
        type: "error",
      });

      setTimeout(() => {
        setFeedback({
          message: "",
          type: "",
        });
      }, 5000);
    }
  };

  return (
    <main className="main container">

      {/* FEEDBACK */}
      {feedback.message && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      {/* HERO */}
      <section className="cg-hero-main grid2col gap-xl">
        <Efeito>
          <div className="c-hero-main flex-colum gap-md">
            <span>JIU JITSU • MUAY THAI • BOXE • NOGI • MMA</span>
            <h1>
              Transforme seu corpo,
              <br />
              fortaleça sua mente.
            </h1>
            <p>
              Treine com professores qualificados em um ambiente
              preparado para desenvolver disciplina, condicionamento
              físico, autoconfiança e defesa pessoal.
            </p>
            <div className="c-hero-buttons flex gap-md">
              <button
                className="btn"
                onClick={() =>
                  window.open(
                    "https://wa.me/5511999999999?text=Olá! Gostaria de agendar uma aula experimental.",
                    "_blank"
                  )
                }
              >
                Aula Experimental
              </button>
              <button
                className="btn"
                onClick={() => navigate("/planos")}
              >
                Conheça os Planos
              </button>
            </div>
          </div>
        </Efeito>

        <Efeito>
          <div className="hero-image">
            <img
              src={Foto1main}
              alt="Treinamento de Jiu Jitsu"
            />
          </div>
        </Efeito>
      </section>

      {/* BENEFÍCIOS */}
      <Efeito>
        <section className="cg-beneficios-main grid4col gap-md">
          <div className="beneficio-card">
            <h3>Respeito</h3>
            <p>
              Aprenda a respeitar colegas, professores e adversários.
            </p>
          </div>
          <div className="beneficio-card">
            <h3>Disciplina</h3>
            <p>
              Desenvolva foco, dedicação e constância.
            </p>
          </div>
          <div className="beneficio-card">
            <h3>Confiança</h3>
            <p>
              Ganhe segurança dentro e fora dos tatames.
            </p>
          </div>
          <div className="beneficio-card">
            <h3>Coragem</h3>
            <p>
              Supere desafios e evolua diariamente.
            </p>
          </div>
        </section>
      </Efeito>

      {/* CTA */}
      <Efeito>
        <section className="cg-cta-main">
          <h2>
            Sua primeira aula pode ser o início de uma transformação.
          </h2>
          <p>
            Venha conhecer nossa estrutura e treinar com nossa equipe.
          </p>
        </section>
      </Efeito>

      {/* FORMULÁRIO */}
      <section className="cg-contato-main grid2col gap-xl">
        <Efeito>
          <div className="text-form flex-colum">
            <span>Duvidas ?</span>
            <h2>Nos mande um email</h2>
            <p>
              além do nosso WhatsApp 24h, você pode entrar em contato conosco através do formulário ao lado. Estamos prontos para responder suas perguntas e ajudar no que for necessário.
            </p>
          </div>
        </Efeito>

        <Efeito>
          <div className="cg-form">
            <form
              onSubmit={handleSubmit}
              className="form-contato flex-colum gap-md"
            >
              <input
                type="text"
                name="nome"
                placeholder="Seu nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Seu e-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="mensagem"
                rows="5"
                placeholder="Digite sua mensagem..."
                value={formData.mensagem}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="btn"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </Efeito>
      </section>

      {/* MAPA */}
      <Efeito>
        <Mapa />
      </Efeito>
    </main>
  );
};

export default Main;