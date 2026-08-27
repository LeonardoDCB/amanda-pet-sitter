const express = require('express');
const rateLimit = require('express-rate-limit');
const { credenciaisValidas, gerarToken, requireAuth } = require('../auth');
const { validar, loginSchema } = require('../middleware/validacao');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Aguarde 15 minutos.' }
});

const router = express.Router();

router.post('/login', loginLimiter, validar(loginSchema), (req, res) => {
  const { usuario, senha } = req.dados;

  if (!credenciaisValidas(usuario, senha)) {
    return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
  }

  res.json({ token: gerarToken() });
});

router.post('/logout', requireAuth, (req, res) => {
  res.json({ mensagem: 'Sessão encerrada' });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ autenticado: true, usuario: req.admin.usuario });
});

module.exports = router;