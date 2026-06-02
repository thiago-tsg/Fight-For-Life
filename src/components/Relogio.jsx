import { useEffect, useState } from 'react';
import '../styles/Relogio.scss';

/* ================= AGENDA ================= */
const agenda = {
  seg: [
    { nome: 'Jiu Jitsu', hora: '08:00' },
    { nome: 'Muay Thai', hora: '10:00' },
    { nome: 'Jiu Jitsu', hora: '17:00' },
    { nome: 'Jiu Jitsu', hora: '18:00' },
    { nome: 'Jiu Jitsu Kids', hora: '19:00' },
    { nome: 'Jiu Jitsu', hora: '20:00' },
    { nome: 'Jiu Jitsu', hora: '22:00' },
  ],
  ter: [
    { nome: 'Jiu Jitsu', hora: '08:00' },
    { nome: 'Boxe', hora: '18:00' },
    { nome: 'No-Gi', hora: '20:00' },
  ],
  qua: [
    { nome: 'Jiu Jitsu', hora: '08:00' },
    { nome: 'Muay Thai', hora: '10:00' },
    { nome: 'Jiu Jitsu', hora: '17:00' },
    { nome: 'Jiu Jitsu', hora: '18:00' },
    { nome: 'Jiu Jitsu Kids', hora: '19:00' },
    { nome: 'Jiu Jitsu', hora: '20:00' },
    { nome: 'Jiu Jitsu', hora: '22:00' },
  ],
  qui: [
    { nome: 'Jiu Jitsu', hora: '08:00' },
    { nome: 'Boxe', hora: '18:00' },
    { nome: 'No-Gi', hora: '20:00' },
  ],
  sex: [
    { nome: 'Jiu Jitsu', hora: '08:00' },
    { nome: 'Muay Thai', hora: '10:00' },
    { nome: 'Jiu Jitsu', hora: '18:00' },
    { nome: 'Jiu Jitsu Kids', hora: '19:00' },
    { nome: 'Jiu Jitsu', hora: '20:00' },
  ],
};

/* ================= HELPERS ================= */
const mapDiaSemana = (day) => {
  switch (day) {
    case 1: return 'seg';
    case 2: return 'ter';
    case 3: return 'qua';
    case 4: return 'qui';
    case 5: return 'sex';
    default: return null;
  }
};

const getProximaAula = () => {
  let data = new Date();

  for (let i = 0; i < 7; i++) {
    const chaveDia = mapDiaSemana(data.getDay());
    const aulas = chaveDia ? agenda[chaveDia] : [];

    for (let aula of aulas) {
      const [h, m] = aula.hora.split(':');
      const dataAula = new Date(data);
      dataAula.setHours(h, m, 0, 0);

      if (dataAula > new Date()) {
        return { ...aula, dataAula };
      }
    }

    data.setDate(data.getDate() + 1);
    data.setHours(0, 0, 0, 0);
  }

  return null;
};

const isHoje = (dataAula) =>
  dataAula.toDateString() === new Date().toDateString();

/* ================= COMPONENT ================= */
const Relogio = () => {
  const [proximaAula, setProximaAula] = useState(getProximaAula());
  const [tempo, setTempo] = useState('');
  const [status, setStatus] = useState('normal'); // normal | alerta | andamento
  const [aberto, setAberto] = useState(false);
  const [pulse, setPulse] = useState(false); // NOVO

  useEffect(() => {
    const interval = setInterval(() => {
      if (!proximaAula) return;

      const agora = new Date();
      const diff = proximaAula.dataAula - agora;

      // Aula em andamento (1h)
      if (diff <= 0 && diff > -3600000) {
        setStatus('andamento');
        setTempo('Aula em andamento');
        setPulse(false);
        return;
      }

      // Aula acabou
      if (diff <= -3600000) {
        setProximaAula(getProximaAula());
        setStatus('normal');
        setPulse(false);
        return;
      }

      // Alerta 10 min
      setStatus(diff <= 600000 ? 'alerta' : 'normal');

      // Pulse < 5 min
      setPulse(diff <= 300000);

      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

      setTempo(`${h}:${m}:${s}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [proximaAula]);

  if (!proximaAula) return null;

  return (
    <>
      {/* BOTÃO FIXO */}
      <div className={`relogio-fixo ${pulse ? 'pulse-btn' : ''}`} onClick={() => setAberto(true)}>
        ⏰ Próxima aula
      </div>

      {/* OVERLAY MOBILE */}
      {aberto && <div className="overlay" onClick={() => setAberto(false)} />}

      {/* MODAL / BOTTOM SHEET */}
      <div className={`relogio-modal ${aberto ? 'aberto' : ''} ${status}`}>
        <span className="badge">
          {isHoje(proximaAula.dataAula) ? 'HOJE' : 'AMANHÃ'}
        </span>

        <p className="aula">{proximaAula.nome}</p>

        <p className={`hora ${pulse ? 'pulse' : ''}`}>
          {proximaAula.dataAula.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>

        <p className={`tempo ${pulse ? 'pulse' : ''}`}>{tempo}</p>

        <button onClick={() => setAberto(false)}>Fechar</button>
      </div>
    </>
  );
};

export default Relogio;
