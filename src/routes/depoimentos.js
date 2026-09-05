const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const db = require('../db');
const { requireAuth } = require('../auth');
const { validar, depoimentoSchema } = require('../middleware/validacao');
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
      `SELECT id, autor, texto, arquivo, avaliacao
       FROM depoimentos
       WHERE ativo = 'sim'
       ORDER BY ordem ASC, id DESC`
    )
    .all();
  res.json(itens);
});

const admin = express.Router();
admin.use(requireAuth);

admin.get('/', (req, res) => {
  const itens = db
    .prepare(
      `SELECT id, autor, texto, arquivo, ativo, ordem, criado_em
       FROM depoimentos
       ORDER BY ordem ASC, id DESC`
    )
    .all();
  res.json(itens);
});

admin.post('/', upload.single('imagem'), validar(depoimentoSchema), (req, res) => {
  const { autor, texto, ativo, ordem } = req.dados;
  const avaliacao = req.dados.avaliacao ?? null;

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

  if (!arquivo && !texto) {
    return res.status(400).json({ erro: 'Informe um texto ou envie um print do depoimento.' });
  }

  let info;
  try {
    info = db.prepare(
      `INSERT INTO depoimentos (autor, texto, arquivo, tipo_mime, ativo, ordem, avaliacao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(autor || null, texto || null, arquivo, tipoMime, ativo, ordem, avaliacao);
  } catch (erro) {
    if (arquivo) removerArquivo(arquivo);
    throw erro;
  }

  res.status(201).json({ id: info.lastInsertRowid, mensagem: 'Depoimento cadastrado com sucesso!' });
});

admin.patch('/:id', upload.single('imagem'), validar(depoimentoSchema), (req, res) => {
  const item = db.prepare('SELECT * FROM depoimentos WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ erro: 'Depoimento não encontrado' });

  const campos = { ...item, ...req.dados };

  const removerImagem = req.body.remover_imagem === '1' || req.body.remover_imagem === true || req.body.remover_imagem === 1;
  const removerAvaliacao = req.body.remover_avaliacao === '1' || req.body.remover_avaliacao === true || req.body.remover_avaliacao === 1;

  let arquivo = item.arquivo;
  let tipoMime = item.tipo_mime;
  let avaliacao = campos.avaliacao ?? null;
  if (removerAvaliacao) avaliacao = null;

  let arquivoNovo = null;
  if (req.file) {
    const tipo = detectarTipo(req.file.buffer);
    if (!tipo) {
      return res.status(400).json({ erro: 'A imagem enviada não é um arquivo válido (jpeg, png ou webp).' });
    }
    const nomeNovo = `${crypto.randomUUID()}.${EXTENSOES[tipo]}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, nomeNovo), req.file.buffer);
    arquivoNovo = nomeNovo;
    arquivo = nomeNovo;
    tipoMime = tipo;
  } else if (removerImagem && item.arquivo) {
    arquivo = null;
    tipoMime = null;
  }

  if (!arquivo && !campos.texto) {
    return res.status(400).json({ erro: 'O depoimento precisa de um texto ou de um print.' });
  }

  try {
    db.prepare(
      `UPDATE depoimentos
       SET autor = ?, texto = ?, arquivo = ?, tipo_mime = ?, ativo = ?, ordem = ?, avaliacao = ?
       WHERE id = ?`
    ).run(campos.autor || null, campos.texto || null, arquivo, tipoMime, campos.ativo, campos.ordem, avaliacao, item.id);
  } catch (erro) {
    if (arquivoNovo) removerArquivo(arquivoNovo);
    throw erro;
  }
  if (item.arquivo && item.arquivo !== arquivo) removerArquivo(item.arquivo);

  res.json({ mensagem: 'Depoimento atualizado com sucesso!' });
});

admin.delete('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM depoimentos WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ erro: 'Depoimento não encontrado' });

  db.prepare('DELETE FROM depoimentos WHERE id = ?').run(item.id);
  if (item.arquivo) removerArquivo(item.arquivo);

  res.json({ mensagem: 'Depoimento removido com sucesso!' });
});

module.exports = { depoimentosPublico: publico, depoimentosAdmin: admin };
