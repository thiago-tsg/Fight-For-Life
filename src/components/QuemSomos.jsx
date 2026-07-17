// Styles
import "../styles/QuemSomos.scss";

// Components
import Efeito from "./EfeitoComponent";

const QuemSomos = () => {
  return (
    <section className="container">
      <div className="cg-quemsomos grid gap-xxl">
        <Efeito>
          <div className="text-quemsomos flex-colum gap-md">
            <span className="subtitle">Nossa História</span>
            <h1>Quem Somos</h1>
            <p>
              Bem-vindo à nossa academia de lutas, um espaço dedicado ao
              treinamento e aperfeiçoamento das artes marciais. Aqui, nos
              concentramos em duas disciplinas principais: Jiu Jitsu e Muay Thai.
            </p>
            <p>
              O Jiu Jitsu, conhecido como "a arte suave", enfatiza técnica,
              estratégia e controle. Mais do que uma luta, é uma ferramenta para
              desenvolver disciplina, confiança e resiliência.
            </p>
            <p>
              Já o Muay Thai, a famosa "arte das oito armas", combina golpes de
              punhos, cotovelos, joelhos e pernas, proporcionando condicionamento
              físico, resistência e defesa pessoal.
            </p>
            <p>
              Nosso objetivo é oferecer um ambiente acolhedor onde cada aluno possa
              evoluir física e mentalmente, independentemente da idade ou nível de
              experiência.
            </p>
            <p>
              Venha fazer uma aula experimental e descubra como as artes marciais
              podem transformar sua vida.
            </p>
          </div>
        </Efeito>
        <Efeito>
          <div className="video-quemsomos flex-center">
            <iframe
              src="https://www.youtube.com/embed/1bZFWRLFqdg?si=h3NQAqLkdADVwOgj"
              title="Vídeo da Academia"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Efeito>
      </div>
    </section>
  );
};

export default QuemSomos;