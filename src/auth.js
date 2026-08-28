const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || (function () {
  if (process.env.NODE_ENV === 'production') {
    console.error('ERRO: JWT_SECRET obrigatório em produção.');
    process.exit(1);
  }
  console.warn('AVISO: JWT_SECRET não definido. Gerando valor aleatório (tokens não persistem entre reinícios).');
  return crypto.randomBytes(32).toString('hex');
})();
const TOKEN_EXPIRACAO = '8h';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const HASH_FAKE = '$2a$10$ir4CDw2C9rLQ30cQhg3q5u0nWQvW7Sh/FzQYjJ4T0UXYzQvK0V2Qm';

function credenciaisValidas(usuario, senha) {
  if (!ADMIN_PASSWORD_HASH) return false;
  const hashParaComparar = usuario === ADMIN_USER ? ADMIN_PASSWORD_HASH : HASH_FAKE;
  return bcrypt.compareSync(String(senha || ''), hashParaComparar) && usuario === ADMIN_USER;
}

function gerarToken() {
  return jwt.sign({ papel: 'admin' }, JWT_SECRET, { expiresIn: TOKEN_EXPIRACAO });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: 'Sessão expirada ou inválida' });
  }
}

module.exports = { credenciaisValidas, gerarToken, requireAuth };