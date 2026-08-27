const express = require('express');
const db = require('../db');
const { requireAuth } = require('../auth');
const { validar, orcamentoSchema, statusOrcamentoSchema } = require('../middleware/validacao');

const STATUS_VALIDOS = ['novo', 'lido', 'contatado', 'arquivado'];

const publico = express.Router();

publico.post('/', validar(orcamentoSchema), (req, res) => {
  const { nome_cliente, contato, tipo_pet, tipo_servico, porte, usa_medicacao, medicacao_detalhes, data_inicio, data_fim, mensagem } = req.dados;

  if (req.dados.website) {
    return res.status(201).json({ id: null, mensagem: 'Orçamento enviado com sucesso!' });
  }

  if (data_fim && data_fim < data_inicio) {
    return res.status(400).json({ erro: 'A data de fim não pode ser anterior à data de início' });
  }

  const info = db
    .prepare(
      `INSERT INTO orcamentos (nome_cliente, contato, tipo_pet, tipo_servico, porte, usa_medicacao, medicacao_detalhes, data_inicio, data_fim, mensagem)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(nome_cliente, contato, tipo_pet, tipo_servico, porte || null, usa_medicacao || null, medicacao_detalhes || null, data_inicio, data_fim || null, mensagem || null);

  res.status(201).json({ id: info.lastInsertRowid, mensagem: 'Orçamento enviado com sucesso!' });
});

const admin = express.Router();
admin.use(requireAuth);

admin.get('/', (req, res) => {
  const status = req.query.status;
  const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1);
  const limite = Math.min(100, Math.max(1, parseInt(req.query.limite, 10) || 20));
  const offset = (pagina - 1) * limite;

  let total;
  let linhas;
  if (status && STATUS_VALIDOS.includes(status)) {
    total = db.prepare('SELECT COUNT(*) AS n FROM orcamentos WHERE status = ?').get(status).n;
    linhas = db
      .prepare(
        `SELECT * FROM orcamentos
         WHERE status = ?
         ORDER BY criado_em DESC, id DESC
         LIMIT ? OFFSET ?`
      )
      .all(status, limite, offset);
  } else {
    total = db.prepare('SELECT COUNT(*) AS n FROM orcamentos').get().n;
    linhas = db
      .prepare(
        `SELECT * FROM orcamentos
         ORDER BY criado_em DESC, id DESC
         LIMIT ? OFFSET ?`
      )
      .all(limite, offset);
  }

  res.json({ total, pagina, limite, itens: linhas });
});

admin.get('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM orcamentos WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ erro: 'Orçamento não encontrado' });
  res.json(item);
});

admin.patch('/:id', validar(statusOrcamentoSchema), (req, res) => {
  const info = db
    .prepare('UPDATE orcamentos SET status = ? WHERE id = ?')
    .run(req.dados.status, req.params.id);

  if (info.changes === 0) return res.status(404).json({ erro: 'Orçamento não encontrado' });

  res.json({ mensagem: 'Status atualizado', status: req.dados.status });
});

admin.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM orcamentos WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Orçamento não encontrado' });
  res.json({ mensagem: 'Orçamento removido' });
});

module.exports = { orcamentosPublico: publico, orcamentosAdmin: admin };