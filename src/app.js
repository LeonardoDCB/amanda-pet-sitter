const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./db');
const { orcamentosPublico, orcamentosAdmin } = require('./routes/orcamentos');
const { galeriaPublico, galeriaAdmin, UPLOADS_DIR } = require('./routes/galeria');
const { produtosPublico, pedidosPublico, produtosAdmin, pedidosAdmin } = require('./routes/produtos');
const { depoimentosPublico, depoimentosAdmin } = require('./routes/depoimentos');
const adminRouter = require('./routes/admin');

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('ERRO: defina JWT_SECRET nas variáveis de ambiente antes de rodar em produção.');
  process.exit(1);
}

if (!process.env.ADMIN_PASSWORD_HASH) {
  console.warn('AVISO: ADMIN_PASSWORD_HASH não definido — o login do painel está desativado.');
}

const app = express();
app.set('trust proxy', 1);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas requisições. Tente novamente mais tarde.' }
});

app.use(express.json({ limit: '100kb' }));
app.use('/api', apiLimiter);

app.get('/uploads/:arquivo', (req, res) => {
  const nome = req.params.arquivo;
  if (!/^[a-f0-9-]+\.[a-z0-9]{2,5}$/i.test(nome)) {
    return res.status(404).json({ erro: 'Arquivo não encontrado' });
  }

  const registro =
    db.prepare('SELECT arquivo, tipo_mime FROM galeria WHERE arquivo = ?').get(nome) ||
    db.prepare('SELECT arquivo, tipo_mime FROM produtos WHERE arquivo = ?').get(nome) ||
    db.prepare('SELECT arquivo, tipo_mime FROM depoimentos WHERE arquivo = ?').get(nome);
  if (!registro) return res.status(404).json({ erro: 'Arquivo não encontrado' });

  const caminho = path.join(UPLOADS_DIR, registro.arquivo);
  if (!caminho.startsWith(UPLOADS_DIR) || !fs.existsSync(caminho)) {
    return res.status(404).json({ erro: 'Arquivo não encontrado' });
  }

  res.setHeader('Content-Type', registro.tipo_mime);
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(caminho);
});

app.use('/api/orcamentos', orcamentosPublico);
app.use('/api/galeria', galeriaPublico);
app.use('/api/produtos', produtosPublico);
app.use('/api/pedidos', pedidosPublico);
app.use('/api/admin/orcamentos', orcamentosAdmin);
app.use('/api/admin/galeria', galeriaAdmin);
app.use('/api/admin/produtos', produtosAdmin);
app.use('/api/admin/pedidos', pedidosAdmin);
app.use('/api/depoimentos', depoimentosPublico);
app.use('/api/admin/depoimentos', depoimentosAdmin);
app.use('/api/admin', adminRouter);

const PAGINAS_ESTATICAS = {
  '/servicos/visita': 'servicos/visita.html',
  '/servicos/hospedagem': 'servicos/hospedagem.html',
  '/servicos/passeio': 'servicos/passeio.html',
  '/birigui': 'birigui.html',
  '/aracatuba': 'aracatuba.html',
  '/artigos/hospedagem-cachorro-birigui': 'artigos/hospedagem-cachorro-birigui.html',
  '/artigos/passeio-cachorro-aracatuba': 'artigos/passeio-cachorro-aracatuba.html',
  '/faq': 'faq.html',
  '/dicas': 'dicas.html'
};

for (const [rota, arquivo] of Object.entries(PAGINAS_ESTATICAS)) {
  app.get(rota, (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, arquivo));
  });
  app.get(`${rota}.html`, (req, res) => {
    res.redirect(301, rota);
  });
}

app.use(
  express.static(PUBLIC_DIR, {
    setHeaders: (res, filePath) => {
      if (/\.(css|js)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      } else if (/\.(png|jpe?g|svg|webp|gif|ico|woff2?)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=2592000');
      }
    }
  })
);

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ erro: 'Rota não encontrada' });
  }
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Imagem maior que 5 MB' : 'Erro no upload da imagem';
    return res.status(400).json({ erro: msg });
  }
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;