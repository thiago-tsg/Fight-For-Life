import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // se você estiver usando .env.local

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fight4lifeacademia@gmail.com",
    pass: process.env.EMAIL_PASS, // ✅ CORRETO
  },
});

app.post("/enviar", async (req, res) => {
  const { nome, email, mensagem } = req.body;

  try {
    await transporter.sendMail({
      from: email,
      to: "fight4lifeacademia@gmail.com",
      subject: "Novo contato",
      text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`,
    });

    res.status(200).send("Email enviado com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao enviar email");
  }
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});