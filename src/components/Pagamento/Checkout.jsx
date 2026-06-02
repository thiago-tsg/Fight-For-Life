import "../../styles/Checkout.scss";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);

const Checkout = () => {
  const { state } = useLocation();
  const cartItems = state?.cartItems || [];

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [method, setMethod] = useState("card");
  const [pixData, setPixData] = useState(null);
  const [boletoUrl, setBoletoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState(null);

  useEffect(() => {
    if (!currentPaymentId) return;

    const es = new EventSource(
      `https://maleah-nonlaminated-kacie.ngrok-free.dev/events/${currentPaymentId}`
    );

    fetch(`https://maleah-nonlaminated-kacie.ngrok-free.dev/payment/${currentPaymentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "approved") {
          setStatusMessage("Pagamento aprovado!");
          setPaymentDone(true);
        }
      });

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.status === "approved") {
        setStatusMessage("Pagamento aprovado!");
        setPaymentDone(true);
        setPaymentFailed(false);
        es.close();
        return;
      }

      if (data.status === "rejected" || data.status === "cancelled") {
        setStatusMessage("Pagamento recusado!");
        setPaymentFailed(true);
        setPaymentDone(false);
        es.close();
        return;
      }

      if (data.status === "pending" || data.status === "in_process") {
        setStatusMessage("Pagamento aguardando confirmação do banco.");
      }
    };

    return () => es.close();
  }, [currentPaymentId]);

  const createPayment = async (data, type) => {
    setLoading(true);
    setStatusMessage(null);
    setPaymentFailed(false);

    try {
      const res = await fetch("http://localhost:3001/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          transaction_amount: total,
          description: "Compra Fight For Life",
        }),
      });

      const result = await res.json();
      console.log("RESULT:", result);

      if (result.id) {
        setCurrentPaymentId(String(result.id));
      }

      if (type === "card") {
        if (result.status === "approved") {
          setStatusMessage("Pagamento aprovado!");
          setPaymentDone(true);
        } else if (result.status === "rejected") {
          setStatusMessage("Pagamento recusado!");
          setPaymentFailed(true);
        } else {
          setStatusMessage("Pagamento pendente. Aguardando confirmação.");
        }
      }

      if (type === "pix") {
        if (result.point_of_interaction) {
          setPixData(result.point_of_interaction.transaction_data);
          setStatusMessage("PIX gerado. Aguardando pagamento.");
          setPaymentDone(false);
        } else {
          setStatusMessage("Falha ao gerar PIX.");
          setPaymentFailed(true);
        }
      }

      if (type === "boleto") {
        if (result.transaction_details?.external_resource_url) {
          setBoletoUrl(result.transaction_details.external_resource_url);
          setStatusMessage("Boleto gerado. Aguardando pagamento.");
          setPaymentDone(false);
        } else {
          setStatusMessage("Falha ao gerar boleto.");
          setPaymentFailed(true);
        }
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Erro ao processar pagamento!");
      setPaymentFailed(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (paymentDone) return;

    if (method === "pix" && !pixData) {
      createPayment(
        {
          payment_method_id: "pix",
          payer: {
            email: "cliente@email.com",
          },
        },
        "pix"
      );
    }

    if (method === "boleto" && !boletoUrl) {
      createPayment(
        {
          payment_method_id: "bolbradesco",
          payer: {
            email: "cliente@email.com",
            identification: {
              type: "CPF",
              number: "12345678909",
            },
          },
        },
        "boleto"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  const handleCopyPix = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      alert("Código Pix copiado!");
    }
  };

  const handleTryAgain = () => {
    setPaymentFailed(false);
    setStatusMessage(null);
    setPixData(null);
    setBoletoUrl(null);
    setPaymentDone(false);
    setCurrentPaymentId(null);
  };

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      <h3>Total: R$ {total}</h3>

      <div className="tabs">
        <button
          className={method === "card" ? "active" : ""}
          onClick={() => setMethod("card")}
          disabled={loading || paymentDone}
        >
          Cartão
        </button>
        <button
          className={method === "pix" ? "active" : ""}
          onClick={() => setMethod("pix")}
          disabled={loading || paymentDone}
        >
          Pix
        </button>
        <button
          className={method === "boleto" ? "active" : ""}
          onClick={() => setMethod("boleto")}
          disabled={loading || paymentDone}
        >
          Boleto
        </button>
      </div>

      {method === "card" && !paymentDone && (
        <CardPayment
          initialization={{ amount: total }}
          onSubmit={async (data) => {
            await createPayment(
              { ...data, payment_method_id: data.paymentMethodId },
              "card"
            );
          }}
        />
      )}

      {method === "pix" && (
        <>
          {loading && !pixData && !paymentDone ? (
            <div className="loading">
              <div className="spinner" />
              <p>Gerando QR Code Pix...</p>
            </div>
          ) : (
            pixData && !paymentFailed && (
              <div className="pix-box">
                <h3>Escaneie o QR Code</h3>
                <div className="pix-code-container">
                  <img
                    src={`data:image/png;base64,${pixData.qr_code_base64}`}
                    alt="QR Code Pix"
                  />
                  <button className="copy-btn" onClick={handleCopyPix}>
                    Copiar
                  </button>
                </div>
                <p>Ou copie manualmente:</p>
                <textarea value={pixData.qr_code} readOnly />
              </div>
            )
          )}
        </>
      )}

      {method === "boleto" && (
        <>
          {loading && !boletoUrl && !paymentDone ? (
            <div className="loading">
              <div className="spinner" />
              <p>Gerando Boleto...</p>
            </div>
          ) : (
            boletoUrl && !paymentFailed && (
              <div className="boleto-box">
                <a href={boletoUrl} target="_blank" rel="noreferrer">
                  Abrir Boleto
                </a>
              </div>
            )
          )}
        </>
      )}

      {statusMessage && (
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontWeight: "bold",
            color:
              statusMessage.includes("sucesso") ||
                statusMessage.includes("aprovado")
                ? "green"
                : "red",
          }}
        >
          {statusMessage}
        </p>
      )}

      {paymentFailed && (
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button className="main-btn" onClick={handleTryAgain}>
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;