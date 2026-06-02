import { useState } from "react";
import "../styles/AvaliacaoGrauKids.scss";
import { db } from "../firebase/FirebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AvaliacaoGrauKids() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");

  const [step, setStep] = useState(0);
  const [resultadoFinal, setResultadoFinal] = useState(null);

  const questionario = {
    azul: [
      "Demonstra respeito com adultos (professores, responsáveis)?",
      "Trata bem colegas e irmãos mesmo frustrado?",
      "Aceita regras em casa sem grandes dificuldades?",
      "Reage bem quando recebe um 'não'?"
    ],
    vermelho: [
      "Segue instruções na primeira vez?",
      "Mantém foco em atividades por tempo adequado?",
      "Demonstra autocontrole quando fica animado ou irritado?",
      "Comporta-se bem em ambientes que exigem organização?"
    ],
    amarelo: [
      "Cuida da própria higiene sem resistência?",
      "Mantém materiais organizados?",
      "Vai ao treino com kimono limpo e arrumado?",
      "Chega pontualmente aos compromissos?"
    ],
    verde: [
      "Insiste antes de pedir ajuda quando tem dificuldade?",
      "Mostra vontade de aprender algo novo?",
      "Lida bem com erros sem desistir?",
      "Se empenha em terminar o que começou?"
    ]
  };

  const cores = Object.keys(questionario);
  const [respostas, setRespostas] = useState({});
  const progresso = step / (cores.length + 1);

  // ⭐ FORMATAÇÃO DO CPF
  const formatarCPF = (valor) => {
    let v = valor.toUpperCase();

    // Remove tudo que não seja letra ou número
    v = v.replace(/[^A-Z0-9]/gi, "");

    // Limite: 11 números + 1 letra final opcional
    if (v.length > 12) v = v.slice(0, 12);

    // Se tiver letra no final, separar
    const temLetra = /[A-Z]$/.test(v);
    const letra = temLetra ? v.slice(-1) : "";
    const numeros = temLetra ? v.slice(0, -1) : v;

    // Formatar os números
    let n = numeros.replace(/\D/g, "").slice(0, 11);

    n = n.replace(/(\d{3})(\d)/, "$1.$2");
    n = n.replace(/(\d{3})(\d)/, "$1.$2");
    n = n.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return n + letra;
  };

  const handleCPF = (e) => {
    const valor = e.target.value;
    const cpfFormatado = formatarCPF(valor);
    setCpf(cpfFormatado);
  };

  const handleChange = (cor, index, valor) => {
    setRespostas(prev => ({
      ...prev,
      [`${cor}-${index}`]: valor
    }));
  };

  const calcularAprovado = () => {
    const resultado = {};
    cores.forEach(cor => {
      const perguntas = questionario[cor];
      let positivas = 0;
      perguntas.forEach((_, i) => {
        const resp = respostas[`${cor}-${i}`];
        if (resp === "sempre" || resp === "asvezes") positivas++;
      });
      resultado[cor] = positivas >= 3 ? "Aprovado" : "Reprovado";
    });
    return resultado;
  };

  const handleSubmit = async () => {
    const resultado = calcularAprovado();
    setResultadoFinal(resultado);
    try {
      await addDoc(collection(db, "avaliacoes"), {
        nome,
        cpf,
        respostas,
        resultado,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
    }
  };

  const enviarWhatsApp = () => {
    const numero = "+5511999999999";
    let mensagem = `Avaliação do aluno:\nNome: ${nome}\nCPF: ${cpf}\n\nResultados:\n`;
    Object.keys(resultadoFinal).forEach(cor => {
      mensagem += `${cor.toUpperCase()}: ${resultadoFinal[cor]}\n`;
    });
    const url = `https://wa.me/${numero.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const corAtual = cores[step - 1];

  const podeAvancar = () => {
    const perguntas = questionario[corAtual];
    return perguntas.every((_, i) => respostas[`${corAtual}-${i}`]);
  };

  return (
    <section className="cg-avaliacao-kids container">
      <div className="cg-wizard">
        <h1 className="cg-title center">Avaliação do Aluno</h1>

        {/* Barra de progresso */}
        <div className="cg-progress-bar">
          <div className="cg-progress" style={{ width: `${progresso * 100}%` }}></div>
        </div>

        {/* Indicador de cores */}
        <div className="cg-steps-indicator space-between">
          {cores.map((cor, i) => (
            <div key={cor} className={`cg-step ${step - 1 === i ? "active" : ""} cor-${cor}`}></div>
          ))}
        </div>

        {/* Formulário passo a passo */}
        {step === 0 && (
          <div className="cg-card fade cg-identificacao">
            <h2 className="cg-subtitle">Identificação</h2>

            <label className="cg-label flex-colum">
              Nome do aluno:
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="cg-input"
                required
              />
            </label>

            <label className="cg-label flex-colum">
              CPF da criança:
              <input
                type="text"
                value={cpf}
                onChange={handleCPF}
                className="cg-input"
                placeholder="000.000.000-00"
                required
              />
            </label>

            <button className="cg-btn cg-btn-next" onClick={() => setStep(1)}>
              Iniciar Avaliação →
            </button>
          </div>
        )}

        {step > 0 && step <= cores.length && (
          <div className={`cg-card fade cor-${corAtual}`}>
            <h2 className="cg-subtitle">{corAtual.toUpperCase()}</h2>

            {questionario[corAtual].map((pergunta, index) => (
              <div key={index} className="cg-question">
                <p className="cg-question-text">{pergunta}</p>
                <select
                  className="cg-select"
                  value={respostas[`${corAtual}-${index}`] || ""}
                  onChange={e => handleChange(corAtual, index, e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="sempre">Sempre</option>
                  <option value="asvezes">Às vezes</option>
                  <option value="raro">Raramente</option>
                  <option value="nunca">Nunca</option>
                </select>
              </div>
            ))}

            <div className="cg-nav space-between">
              {step > 1 && (
                <button className="cg-btn cg-btn-back" onClick={() => setStep(step - 1)}>
                  ← Voltar
                </button>
              )}
              {step < cores.length ? (
                <button
                  className="cg-btn cg-btn-next"
                  onClick={() => {
                    if (!podeAvancar()) {
                      alert("Por favor, responda todas as perguntas antes de continuar.");
                      return;
                    }
                    setStep(step + 1);
                  }}
                >
                  Próximo →
                </button>
              ) : (
                <button
                  className="cg-btn cg-btn-send"
                  onClick={() => {
                    if (!podeAvancar()) {
                      alert("Por favor, responda todas as perguntas antes de enviar.");
                      return;
                    }
                    handleSubmit();
                    setStep(step + 1);
                  }}
                >
                  Enviar Avaliação
                </button>
              )}
            </div>
          </div>
        )}

        {step === cores.length + 1 && resultadoFinal && (
          <div className="cg-card fade cg-result">
            <h2 className="cg-subtitle">Resultado da Avaliação</h2>

            {Object.keys(resultadoFinal).map(cor => (
              <p key={cor} className="cg-result-item">
                <strong>{cor.toUpperCase()}:</strong> {resultadoFinal[cor]}
              </p>
            ))}

            <button className="cg-btn cg-btn-send" onClick={enviarWhatsApp}>
              Enviar para WhatsApp
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
