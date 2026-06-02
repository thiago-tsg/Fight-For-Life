import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "mercadopago";

const { MercadoPagoConfig, Payment } = pkg;

dotenv.config({ path: "../../../.env.local" });

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const payment = new Payment(client);

// SSE por paymentId
const clientsByPaymentId = new Map();

app.get("/events/:paymentId", (req, res) => {
  const { paymentId } = req.params;

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*", // ✅ adiciona isso
  });
  res.flushHeaders();

  const list = clientsByPaymentId.get(paymentId) || [];
  list.push(res);
  clientsByPaymentId.set(paymentId, list);

  res.write(`data: ${JSON.stringify({ type: "connected", paymentId })}\n\n`);

  req.on("close", () => {
    const current = clientsByPaymentId.get(paymentId) || [];
    clientsByPaymentId.set(
      paymentId,
      current.filter((client) => client !== res)
    );
  });
});

function emitPaymentUpdate(paymentId, payload) {
  const list = clientsByPaymentId.get(String(paymentId)) || [];
  for (const client of list) {
    client.write(`data: ${JSON.stringify(payload)}\n\n`);
  }
}

app.post("/create-payment", async (req, res) => {
  try {
    const {
      transaction_amount,
      description,
      payment_method_id,
      payer,
      installments,
      token,
    } = req.body;

    const body = {
      transaction_amount,
      description,
      payment_method_id,
      payer,
    };

    if (installments) body.installments = installments;
    if (token) body.token = token;

    const result = await payment.create({ body });

    res.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      point_of_interaction: result.point_of_interaction,
      transaction_details: result.transaction_details,
    });
  } catch (error) {
    console.error("ERRO MP:", error);
    res.status(500).json({ error: "Erro ao processar pagamento" });
  }
});

app.post("/webhook", async (req, res) => {
  console.log("🔥 WEBHOOK RECEBIDO", req.body);
  try {
    const xSignature = req.header("x-signature");
    const xRequestId = req.header("x-request-id");

    // Aqui você valida a assinatura conforme a documentação do Mercado Pago
    // usando x-signature + x-request-id + secret do painel.
    // A documentação mostra que x-signature contém ts e v1.
    if (!xSignature || !xRequestId) {
      return res.sendStatus(200);
    }

    const paymentId =
      req.body?.data?.id ||
      req.body?.id ||
      req.query?.["data.id"] ||
      req.query?.id;

    if (!paymentId) {
      return res.sendStatus(200);
    }

    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    if (!mpResponse.ok) {
      console.error("Falha ao consultar pagamento:", await mpResponse.text());
      return res.sendStatus(200);
    }

    const paymentInfo = await mpResponse.json();
    console.log("STATUS MP:", paymentInfo.status);

    emitPaymentUpdate(String(paymentId), {
      id: String(paymentId),
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error("ERRO WEBHOOK:", error);
    return res.sendStatus(200);
  }
});

app.listen(3001, () => console.log("🔥 Backend rodando na porta 3001"));