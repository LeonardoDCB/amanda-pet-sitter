const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const db = require('../db');
const { requireAuth } = require('../auth');
const { validar, legendaSchema, statusGaleriaSchema } = require('../middleware/validacao');

const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const LIMITE_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: LIMITE_BYTES, files: 10 }
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

const publico = express.Router();

publico.get('/', (req, res) => {
  const itens = db
    .prepare(
      `SELECT id, arquivo, legenda FROM galeria
       WHERE status = 'publicado'
       ORDER BY criado_em DESC, id DESC`
    )
    .all();
  res.json(itens);
});

const admin = express.Router();
admin.use(requireAuth);

admin.get('/', (req, res) => {
  const itens = db
    .prepare('SELECT * FROM galeria ORDER BY criado_em DESC, id DESC')
    .all();
  res.json(itens);
});

admin.post('/', upload.array('imagens', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ erro: 'Envie pelo menos uma imagem' });
  }

  const arquivosValidados = [];
  for (const arquivo of req.files) {
    const tipo = detectarTipo(arquivo.buffer);
    if (!tipo) {
      return res.status(400).json({
        erro: `Arquivo "${arquivo.originalname}" não é uma imagem válida (jpeg, png ou webp)`
      });
    }

    arquivosValidados.push({ arquivo, tipo, nome: `${crypto.randomUUID()}.${EXTENSOES[tipo]}` });
  }

  const registrados = [];
  try {
    db.exec('BEGIN');
    for (const item of arquivosValidados) {
      fs.writeFileSync(path.join(UPLOADS_DIR, item.nome), item.arquivo.buffer);
      const info = db.prepare(
        `INSERT INTO galeria (arquivo, nome_original, tipo_mime, tamanho_bytes)
         VALUES (?, ?, ?, ?)`
      ).run(item.nome, item.arquivo.originalname, item.tipo, item.arquivo.size);
      registrados.push({ id: info.lastInsertRowid, arquivo: item.nome });
    }
    db.exec('COMMIT');
  } catch (erro) {
    try { db.exec('ROLLBACK'); } catch (_) {}
    for (const item of arquivosValidados) {
      try { fs.unlinkSync(path.join(UPLOADS_DIR, item.nome)); } catch (_) {}
    }
    throw erro;
  }

  res.status(201).json({ mensagem: `${registrados.length} imagem(ns) publicada(s)`, itens: registrados });
});

admin.patch('/:id', validar(legendaSchema), (req, res) => {
  const item = db.prepare('SELECT * FROM galeria WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ erro: 'Imagem não encontrada' });

  const legenda = req.dados.legenda === undefined ? item.legenda : req.dados.legenda;
  db.prepare('UPDATE galeria SET legenda = ? WHERE id = ?').run(legenda || null, item.id);
  res.json({ mensagem: 'Legenda atualizada' });
});

admin.patch('/:id/status', validar(statusGaleriaSchema), (req, res) => {
  const info = db
    .prepare('UPDATE galeria SET status = ? WHERE id = ?')
    .run(req.dados.status, req.params.id);

  if (info.changes === 0) return res.status(404).json({ erro: 'Imagem não encontrada' });
  res.json({ mensagem: 'Status atualizado', status: req.dados.status });
});

admin.delete('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM galeria WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ erro: 'Imagem não encontrada' });

  db.prepare('DELETE FROM galeria WHERE id = ?').run(item.id);

  const caminho = path.join(UPLOADS_DIR, item.arquivo);
  if (fs.existsSync(caminho)) fs.unlinkSync(caminho);

  res.json({ mensagem: 'Imagem removida' });
});

module.exports = { galeriaPublico: publico, galeriaAdmin: admin, UPLOADS_DIR };
