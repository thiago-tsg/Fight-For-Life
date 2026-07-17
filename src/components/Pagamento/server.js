import crypto from "crypto";
import fs from "fs";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import pkg from "mercadopago";

const { MercadoPagoConfig, Payment } = pkg;

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});
const payment = new Payment(client);

function getFirebaseServiceAccount() {
  const rawCredential = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!rawCredential) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT nao configurado");
  }

  if (rawCredential.trim().startsWith("{")) {
    return JSON.parse(rawCredential.replace(/\\n/g, "\n"));
  }

  if (fs.existsSync(rawCredential)) {
    return JSON.parse(fs.readFileSync(rawCredential, "utf8"));
  }

  return JSON.parse(
    Buffer.from(rawCredential, "base64").toString("utf8").replace(/\\n/g, "\n")
  );
}

function initFirestore() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(getFirebaseServiceAccount()),
    });
  }

  return admin.firestore();
}

const db = initFirestore();

const clientsByPaymentId = new Map();

function now() {
  return admin.firestore.FieldValue.serverTimestamp();
}

function toMoney(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Number(amount.toFixed(2)) : 0;
}

function sanitizeItems(items = []) {
  return items.map((item) => ({
    uid: item.uid || null,
    name: item.name || "",
    color: item.color || "",
    size: item.size || "",
    quantity: Number(item.quantity) || 0,
    price: toMoney(item.price),
    img: item.img || "",
  }));
}

function parseSignature(signature = "") {
  return signature.split(",").reduce((parts, part) => {
    const [key, value] = part.split("=");
    if (key && value) parts[key.trim()] = value.trim();
    return parts;
  }, {});
}

function timingSafeEqualHex(left, right) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  if (leftBuffer.length !== rightBuffer.length) return false;

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getPaymentId(req) {
  return (
    req.body?.data?.id ||
    req.body?.id ||
    req.query?.["data.id"] ||
    req.query?.id ||
    req.query?.payment_id
  );
}

function validateMercadoPagoSignature(req, paymentId) {
  const signature = req.header("x-signature");
  const requestId = req.header("x-request-id");
  const secret = process.env.MP_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("MP_WEBHOOK_SECRET nao configurado");
  }

  if (!signature || !requestId || !paymentId) {
    return false;
  }

  const { ts, v1 } = parseSignature(signature);
  if (!ts || !v1) return false;

  const manifest = `id:${paymentId};request-id:${requestId};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return timingSafeEqualHex(expected, v1);
}

async function findOrderByPaymentId(paymentId) {
  const snapshot = await db
    .collection("orders")
    .where("paymentId", "==", String(paymentId))
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ref: doc.ref, data: doc.data() };
}

async function fetchPaymentInfo(paymentId) {
  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Mercado Pago retornou ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

async function updateOrderFromPayment(paymentInfo) {
  const paymentId = String(paymentInfo.id);
  const orderId =
    paymentInfo.metadata?.order_id ||
    paymentInfo.metadata?.orderId ||
    paymentInfo.external_reference;

  const order =
    orderId && orderId !== paymentId
      ? { id: orderId, ref: db.collection("orders").doc(orderId) }
      : await findOrderByPaymentId(paymentId);

  if (!order) return null;

  const payload = {
    paymentId,
    status: paymentInfo.status || "unknown",
    statusDetail: paymentInfo.status_detail || "",
    paymentMethodId: paymentInfo.payment_method_id || "",
    paymentTypeId: paymentInfo.payment_type_id || "",
    mpAmount: toMoney(paymentInfo.transaction_amount),
    mpPayerEmail: paymentInfo.payer?.email || "",
    updatedAt: now(),
    rawPayment: {
      id: paymentInfo.id,
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
      date_approved: paymentInfo.date_approved || null,
      date_last_updated: paymentInfo.date_last_updated || null,
    },
  };

  await order.ref.set(payload, { merge: true });

  return { id: order.id, ...payload };
}

function emitPaymentUpdate(paymentId, payload) {
  const clients = clientsByPaymentId.get(String(paymentId)) || [];

  for (const client of clients) {
    client.write(`data: ${JSON.stringify(payload)}\n\n`);
  }
}

app.get("/events/:paymentId", (req, res) => {
  const { paymentId } = req.params;

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
  });
  res.flushHeaders();

  const clients = clientsByPaymentId.get(paymentId) || [];
  clients.push(res);
  clientsByPaymentId.set(paymentId, clients);

  res.write(`data: ${JSON.stringify({ type: "connected", paymentId })}\n\n`);

  req.on("close", () => {
    const current = clientsByPaymentId.get(paymentId) || [];
    const next = current.filter((client) => client !== res);

    if (next.length) {
      clientsByPaymentId.set(paymentId, next);
    } else {
      clientsByPaymentId.delete(paymentId);
    }
  });
});

app.post("/create-payment", async (req, res) => {
  try {
    const {
      transaction_amount,
      description,
      payment_method_id,
      payer,
      installments,
      token,
      cartItems,
      user,
    } = req.body;

    const orderId = crypto.randomUUID();
    const amount = toMoney(transaction_amount);
    const items = sanitizeItems(cartItems);

    if (!amount || !payment_method_id || !payer?.email) {
      return res.status(400).json({ error: "Dados de pagamento incompletos" });
    }

    await db.collection("orders").doc(orderId).set({
      orderId,
      userId: user?.uid || null,
      userEmail: user?.email || payer.email,
      userName: user?.displayName || "",
      items,
      total: amount,
      description: description || "Compra Fight For Life",
      status: "creating",
      paymentMethodId: payment_method_id,
      createdAt: now(),
      updatedAt: now(),
    });

    const body = {
      transaction_amount: amount,
      description: description || "Compra Fight For Life",
      payment_method_id,
      payer,
      external_reference: orderId,
      metadata: {
        order_id: orderId,
        user_id: user?.uid || "",
      },
    };

    if (installments) body.installments = installments;
    if (token) body.token = token;

    const result = await payment.create({ body });

    await db.collection("orders").doc(orderId).set(
      {
        paymentId: String(result.id),
        status: result.status || "pending",
        statusDetail: result.status_detail || "",
        pointOfInteraction: result.point_of_interaction || null,
        transactionDetails: result.transaction_details || null,
        updatedAt: now(),
      },
      { merge: true }
    );

    return res.json({
      orderId,
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      point_of_interaction: result.point_of_interaction,
      transaction_details: result.transaction_details,
    });
  } catch (error) {
    console.error("ERRO MP:", error);
    return res.status(500).json({ error: "Erro ao processar pagamento" });
  }
});

app.get("/payment/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const order = await findOrderByPaymentId(paymentId);

    if (order) {
      return res.json({
        orderId: order.id,
        paymentId,
        status: order.data.status,
        status_detail: order.data.statusDetail,
      });
    }

    const paymentInfo = await fetchPaymentInfo(paymentId);
    return res.json({
      paymentId,
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
    });
  } catch (error) {
    console.error("ERRO PAYMENT STATUS:", error);
    return res.status(500).json({ error: "Erro ao consultar pagamento" });
  }
});

app.post("/webhook", async (req, res) => {
  const paymentId = getPaymentId(req);

  try {
    if (!validateMercadoPagoSignature(req, paymentId)) {
      return res.sendStatus(401);
    }

    const requestId = req.header("x-request-id");
    const signature = parseSignature(req.header("x-signature"));
    const eventId = `${requestId || "no-request"}_${paymentId}_${signature.ts || "no-ts"}`;

    await db.collection("webhook_events").doc(eventId).set(
      {
        eventId,
        paymentId: String(paymentId),
        requestId: requestId || "",
        type: req.body?.type || req.body?.action || "",
        receivedAt: now(),
        payload: req.body || {},
      },
      { merge: true }
    );

    const paymentInfo = await fetchPaymentInfo(paymentId);
    const order = await updateOrderFromPayment(paymentInfo);

    emitPaymentUpdate(String(paymentId), {
      orderId: order?.id || null,
      id: String(paymentId),
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error("ERRO WEBHOOK:", error);
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Backend de pagamento rodando na porta ${port}`);
});
