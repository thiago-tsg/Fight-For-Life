// Styles
import "../styles/Planos.scss";

// React
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Components
import Efeito from "./EfeitoComponent";

// Dados dos planos
const planosData = [
  {
    nome: "Diário",
    preco: "R$ 20",
    destaque: false,
    aulas: [
      "Jiu Jitsu",
      "Muay Thai",
      "Boxe",
      "NoGi",
      "Aulas Infantis",
      "Fundamentos",
    ],
  },
  {
    nome: "Mensal",
    preco: "R$ 150",
    destaque: true,
    aulas: [
      "Jiu Jitsu",
      "Muay Thai",
      "Boxe",
      "NoGi",
      "Aulas Infantis",
      "Fundamentos",
    ],
  },
  {
    nome: "Trimestral",
    preco: "R$ 420",
    destaque: false,
    aulas: [
      "Jiu Jitsu",
      "Muay Thai",
      "Boxe",
      "NoGi",
      "Aulas Infantis",
      "Fundamentos",
    ],
  },
  {
    nome: "Semestral",
    preco: "R$ 870",
    destaque: false,
    aulas: [
      "Jiu Jitsu",
      "Muay Thai",
      "Boxe",
      "NoGi",
      "Aulas Infantis",
      "Fundamentos",
    ],
  },
  {
    nome: "Anual",
    preco: "R$ 1.720",
    destaque: false,
    aulas: [
      "Jiu Jitsu",
      "Muay Thai",
      "Boxe",
      "NoGi",
      "Aulas Infantis",
      "Fundamentos",
    ],
  },
];

// Componente do cartão de plano
const PlanoCard = ({ plano }) => (
  <Efeito>
    <div className={`plano-card ${plano.destaque ? "destaque" : "container"}`}>
      {plano.destaque && (
        <div className="badge">
          MAIS ESCOLHIDO
        </div>
      )}
      <h2>{plano.nome}</h2>
      <div className="preco">{plano.preco}</div>
      <ul className="beneficios flex-colum gap-md">
        {plano.aulas.map((item, index) => (
          <li key={index} className="flex gap-md">
            <span>✓</span>
            {item}
          </li>
        ))}
      </ul>
      <button className="btn">
        Quero Treinar
      </button>
    </div>
  </Efeito>
);

const Planos = () => {
  return (
    <section className="planos container">
      <Efeito>
        <div className="header-planos center">
          <span>NOSSOS PLANOS</span>
          <h1>
            Escolha seu Plano
          </h1>
          <p>
            Treine com professores experientes e tenha acesso
            completo às modalidades da academia.
          </p>
        </div>
      </Efeito>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop
        centeredSlides
        spaceBetween={30}
        breakpoints={{
          0: {
            slidesPerView: 1.1,
          },
          768: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
        className="planos-swiper"
      >
        {planosData.map((plano, index) => (
          <SwiperSlide key={index}>
            <PlanoCard plano={plano} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Efeito>
        <div className="garantias grid4col gap-lg">
          <div className="garantia center">
            <p>Aula Experimental Gratuita</p>
          </div>
          <div className="garantia center">
            <p>Professores Qualificados</p>
          </div>
          <div className="garantia center">
            <p>Ambiente Familiar</p>
          </div>
          <div className="garantia center">
            <p>Fácil Localização</p>
          </div>
        </div>
      </Efeito>

      <Efeito delay={300}>
        <div className="observacao center">
          Aceitamos <strong>Gympass</strong> e{" "}
          <strong>TotalPass</strong>.
          <br />
          Taxa de manutenção de matrícula:
          R$ 30/mês.
        </div>
      </Efeito>
    </section>
  );
};

export default Planos;