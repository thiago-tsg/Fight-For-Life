import "../../styles/Checkout.scss";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import { useAuth } from "../../firebase/AuthContext";
import { useCart } from "../Loja/CartContext";

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const statusMessages = {
  approved: "Pagamento aprovado!",
  rejected: "Pagamento recusado!",
  cancelled: "Pagamento cancelado!",
  pending: "Pagamento pendente. Aguardando confirmação.",
  in_process: "Pagamento aguardando confirmação do banco.",
};

const Checkout = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const cartItems = useMemo(() => state?.cartItems || [], [state?.cartItems]);

  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  const [method, setMethod] = useState("card");
  const [pixData, setPixData] = useState(null);
  const [boletoUrl, setBoletoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState(null);
  const [paidCartCleared, setPaidCartCleared] = useState(false);

  const applyPaymentStatus = useCallback((data, eventSource) => {
    if (!data?.status) return;

    setStatusMessage(statusMessages[data.status] || "Status de pagamento atualizado.");

    if (data.status === "approved") {
      setPaymentDone(true);
      setPaymentFailed(false);
      eventSource?.close();
      return;
    }

    if (data.status === "rejected" || data.status === "cancelled") {
      setPaymentDone(false);
      setPaymentFailed(true);
      eventSource?.close();
      return;
    }

    if (data.status === "pending" || data.status === "in_process") {
      setPaymentDone(false);
      setPaymentFailed(false);
    }
  }, []);

  useEffect(() => {
    if (!currentPaymentId) return undefined;

    let closed = false;
    const es = new EventSource(`${apiBaseUrl}/events/${currentPaymentId}`);

    fetch(`${apiBaseUrl}/payment/${currentPaymentId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!closed) applyPaymentStatus(data, es);
      })
      .catch((err) => console.error("Erro ao consultar pagamento:", err));

    es.onmessage = (event) => {
      applyPaymentStatus(JSON.parse(event.data), es);
    };

    es.onerror = (event) => {
      console.error("Erro no canal de eventos do pagamento:", event);
    };

    return () => {
      closed = true;
      es.close();
    };
  }, [applyPaymentStatus, currentPaymentId]);

  useEffect(() => {
    if (paymentDone && !paidCartCleared) {
      clearCart();
      setPaidCartCleared(true);
    }
  }, [clearCart, paidCartCleared, paymentDone]);

  const createPayment = useCallback(async (data, type) => {
    setLoading(true);
    setStatusMessage(null);
    setPaymentFailed(false);

    try {
      const res = await fetch(`${apiBaseUrl}/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          transaction_amount: Number(total.toFixed(2)),
          description: "Compra Fight For Life",
          cartItems,
          user: user
            ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
              }
            : null,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Erro ao processar pagamento");
      }

      if (result.id) {
        setCurrentPaymentId(String(result.id));
      }

      if (type === "card") {
        applyPaymentStatus({
          status: result.status,
          status_detail: result.status_detail,
        });
      }

      if (type === "pix") {
        if (result.point_of_interaction) {
          setPixData(result.point_of_interaction.transaction_data);
          setStatusMessage("Pix gerado. Aguardando pagamento.");
          setPaymentDone(false);
        } else {
          setStatusMessage("Falha ao gerar Pix.");
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
  }, [applyPaymentStatus, cartItems, total, user]);

  useEffect(() => {
    if (paymentDone) return;

    if (method === "pix" && !pixData) {
      createPayment(
        {
          payment_method_id: "pix",
          payer: {
            email: user?.email || "cliente@email.com",
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
            email: user?.email || "cliente@email.com",
            identification: {
              type: "CPF",
              number: "12345678909",
            },
          },
        },
        "boleto"
      );
    }
  }, [boletoUrl, createPayment, method, paymentDone, pixData, user?.email]);

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
    setPaidCartCleared(false);
  };

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      <h3>Total: R$ {total.toFixed(2)}</h3>

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
            pixData &&
            !paymentFailed && (
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
              <p>Gerando boleto...</p>
            </div>
          ) : (
            boletoUrl &&
            !paymentFailed && (
              <div className="boleto-box">
                <a href={boletoUrl} target="_blank" rel="noreferrer">
                  Abrir boleto
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
            color: paymentDone ? "green" : paymentFailed ? "red" : "#555",
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
