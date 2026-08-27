const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const db = require('../db');
const { requireAuth } = require('../auth');
const {
  validar,
  produtoSchema,
  produtoPatchSchema,
  pedidoSchema,
  statusPedidoSchema
} = require('../middleware/validacao');
const { UPLOADS_DIR } = require('./galeria');

const LIMITE_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: LIMITE_BYTES, files: 1 }
});

const EXTENSOES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

function detectarTipo(buffer) {
  if (!buffer || buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return 'image/png';
  }
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return 'image/webp';
  }
  return null;
}

function removerArquivo(nome) {
  if (!nome) return;
  const caminho = path.join(UPLOADS_DIR, nome);
  if (fs.existsSync(caminho)) {
    try { fs.unlinkSync(caminho); } catch { /* ignore */ }
  }
}

const publico = express.Router();

publico.get('/', (req, res) => {
  const itens = db
    .prepare(
      `SELECT id, nome, descricao, preco_centavos, arquivo, estoque, ordem
       FROM produtos
       WHERE ativo = 'sim'
       ORDER BY ordem ASC, nome ASC`
    )
    .all();
  res.json(itens);
});

const pedidosPublico = express.Router();

pedidosPublico.post('/', validar(pedidoSchema), (req, res) => {
  const { nome_cliente, contato, itens, observacoes } = req.dados;

  if (req.dados.website) {
    return res.status(201).json({ id: null, mensagem: 'Pedido enviado com sucesso!' });
  }

  const snapshot = [];
  let total = 0;

  for (const item of itens) {
    const produto = db
      .prepare("SELECT id, nome, preco_centavos, estoque, ativo FROM produtos WHERE id = ?")
      .get(item.produto_id);

    if (!produto || produto.ativo !== 'sim') {
      return res.status(400).json({ erro: `O produto "${item.produto_id}" não está disponível.` });
    }

    if (produto.estoque !== null && item.quantidade > produto.estoque) {
      return res.status(400).json({ erro: `Estoque insuficiente para "${produto.nome}".` });
    }

    const subtotal = produto.preco_centavos * item.quantidade;
    total += subtotal;

    snapshot.push({
      produto_id: produto.id,
      nome: produto.nome,
      preco_centavos: produto.preco_centavos,
      quantidade: item.quantidade
    });
  }

  const info = db
    .prepare(
      `INSERT INTO pedidos (nome_cliente, contato, itens, total_centavos, observacoes)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(nome_cliente, contato, JSON.stringify(snapshot), total, observacoes || null);

  res.status(201).json({ id: info.lastInsertRowid, mensagem: 'Pedido enviado com sucesso!' });
});

const produtosAdmin = express.Router();
produtosAdmin.use(requireAuth);

produtosAdmin.get('/', (req, res) => {
  const itens = db
    .prepare(
      `SELECT id, nome, descricao, preco_centavos, arquivo, tipo_mime, estoque, ativo, ordem, criado_em
       FROM produtos
       ORDER BY ordem ASC, nome ASC`
    )
    .all();
  res.json(itens);
});

produtosAdmin.post('/', upload.single('imagem'), validar(produtoSchema), (req, res) => {
  const { nome, descricao, preco_centavos, estoque, ativo, ordem } = req.dados;

  let arquivo = null;
  let tipoMime = null;

  if (req.file) {
    const tipo = detectarTipo(req.file.buffer);
    if (!tipo) {
      return res.status(400).json({ erro: 'A imagem enviada não é um arquivo válido (jpeg, png ou webp).' });
    }
    arquivo = `${crypto.randomUUID()}.${EXTENSOES[tipo]}`;
    tipoMime = tipo;
    fs.writeFileSync(path.join(UPLOADS_DIR, arquivo), req.file.buffer);
  }

  const info = db
    .prepare(
      `INSERT INTO produtos (nome, descricao, preco_centavos, arquivo, tipo_mime, estoque, ativo, ordem)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(nome, descricao || null, preco_centavos, arquivo, tipoMime, estoque ?? null, ativo, ordem);

  res.status(201).json({ id: info.lastInsertRowid, mensagem: 'Produto cadastrado com sucesso!' });
});

produtosAdmin.patch('/:id', upload.single('imagem'), validar(produtoPatchSchema), (req, res) => {
  const item = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ erro: 'Produto não encontrado' });

  const campos = { ...item, ...req.dados };

  const removerImagem = req.body.remover_imagem === '1' || req.body.remover_imagem === true || req.body.remover_imagem === 1;

  let arquivo = item.arquivo;
  let tipoMime = item.tipo_mime;

  if (req.file) {
    const tipo = detectarTipo(req.file.buffer);
    if (!tipo) {
      return res.status(400).json({ erro: 'A imagem enviada não é um arquivo válido (jpeg, png ou webp).' });
    }
    const nomeNovo = `${crypto.randomUUID()}.${EXTENSOES[tipo]}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, nomeNovo), req.file.buffer);
    if (item.arquivo) removerArquivo(item.arquivo);
    arquivo = nomeNovo;
    tipoMime = tipo;
  } else if (removerImagem && item.arquivo) {
    removerArquivo(item.arquivo);
    arquivo = null;
    tipoMime = null;
  }

  db.prepare(
    `UPDATE produtos
     SET nome = ?, descricao = ?, preco_centavos = ?, arquivo = ?, tipo_mime = ?, estoque = ?, ativo = ?, ordem = ?
     WHERE id = ?`
  ).run(
    campos.nome,
    campos.descricao || null,
    campos.preco_centavos,
    arquivo,
    tipoMime,
    campos.estoque ?? null,
    campos.ativo,
    campos.ordem,
    item.id
  );

  res.json({ mensagem: 'Produto atualizado com sucesso!' });
});

produtosAdmin.delete('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ erro: 'Produto não encontrado' });

  db.prepare('DELETE FROM produtos WHERE id = ?').run(item.id);
  if (item.arquivo) removerArquivo(item.arquivo);

  res.json({ mensagem: 'Produto removido com sucesso!' });
});

const STATUS_PEDIDO_VALIDOS = ['recebido', 'pago', 'enviado', 'concluido', 'cancelado'];

const pedidosAdmin = express.Router();
pedidosAdmin.use(requireAuth);

pedidosAdmin.get('/', (req, res) => {
  const status = req.query.status;
  const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1);
  const limite = Math.min(100, Math.max(1, parseInt(req.query.limite, 10) || 20));
  const offset = (pagina - 1) * limite;

  let total;
  let linhas;
  if (status && STATUS_PEDIDO_VALIDOS.includes(status)) {
    total = db.prepare('SELECT COUNT(*) AS n FROM pedidos WHERE status = ?').get(status).n;
    linhas = db
      .prepare(
        `SELECT * FROM pedidos
         WHERE status = ?
         ORDER BY criado_em DESC, id DESC
         LIMIT ? OFFSET ?`
      )
      .all(status, limite, offset);
  } else {
    total = db.prepare('SELECT COUNT(*) AS n FROM pedidos').get().n;
    linhas = db
      .prepare(
        `SELECT * FROM pedidos
         ORDER BY criado_em DESC, id DESC
         LIMIT ? OFFSET ?`
      )
      .all(limite, offset);
  }

  res.json({ total, pagina, limite, itens: linhas });
});

pedidosAdmin.get('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ erro: 'Pedido não encontrado' });
  res.json(item);
});

pedidosAdmin.patch('/:id', validar(statusPedidoSchema), (req, res) => {
  const info = db
    .prepare('UPDATE pedidos SET status = ? WHERE id = ?')
    .run(req.dados.status, req.params.id);

  if (info.changes === 0) return res.status(404).json({ erro: 'Pedido não encontrado' });
  res.json({ mensagem: 'Status do pedido atualizado', status: req.dados.status });
});

pedidosAdmin.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM pedidos WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Pedido não encontrado' });
  res.json({ mensagem: 'Pedido removido com sucesso!' });
});

module.exports = { produtosPublico: publico, pedidosPublico, produtosAdmin, pedidosAdmin };
