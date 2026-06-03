# Fight For Life

Aplicacao React + Vite com loja, checkout Mercado Pago e Firebase.

## Webhook Mercado Pago

O backend de pagamento fica em `src/components/Pagamento/server.js` e expoe:

- `POST /create-payment`
- `POST /webhook`
- `GET /payment/:paymentId`
- `GET /events/:paymentId`

O webhook valida `x-signature` e `x-request-id` do Mercado Pago, consulta o pagamento na API oficial e persiste pedidos em `orders` e eventos em `webhook_events` no Firestore via Firebase Admin SDK.

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e configure:

- `VITE_MP_PUBLIC_KEY`: chave publica do Mercado Pago usada no frontend.
- `VITE_API_BASE_URL`: URL publica HTTPS do backend em producao; deixe vazio no desenvolvimento local para usar o proxy do Vite.
- `MP_ACCESS_TOKEN`: access token privado do Mercado Pago.
- `MP_WEBHOOK_SECRET`: secret configurado no painel de webhooks do Mercado Pago.
- `FIREBASE_SERVICE_ACCOUNT`: JSON, base64 do JSON ou caminho para o arquivo de service account do Firebase.
- `PUBLIC_API_BASE_URL`: URL publica do backend para referencia de deploy.
- `CORS_ORIGIN`: origem permitida para o frontend em producao.
- `PORT`: porta do backend, padrao `3001`.

## Desenvolvimento

Em terminais separados:

```bash
npm run dev
npm run dev:payment
```

Configure no painel do Mercado Pago a URL publica:

```text
https://seu-dominio.com/webhook
```
