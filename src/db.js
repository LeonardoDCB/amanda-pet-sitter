const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, 'site.db'));
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

const STATUS_ORCAMENTO = "CHECK (status IN ('novo', 'lido', 'contatado', 'arquivado'))";
const STATUS_PRODUTO = "CHECK (ativo IN ('sim', 'nao'))";
const STATUS_PEDIDO = "CHECK (status IN ('recebido', 'pago', 'enviado', 'concluido', 'cancelado'))";
const STATUS_DEPOIMENTO = "CHECK (ativo IN ('sim', 'nao'))";

function migrar() {
  const { user_version: versao } = db.prepare('PRAGMA user_version').get();

  if (versao < 2) {
    const existeOrcamentos = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'orcamentos'")
      .get();

    if (existeOrcamentos) {
      db.exec('ALTER TABLE orcamentos RENAME TO orcamentos_antigo;');
      db.exec(`
        CREATE TABLE orcamentos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome_cliente TEXT NOT NULL,
          contato TEXT NOT NULL,
          tipo_pet TEXT NOT NULL CHECK (tipo_pet IN ('cachorro', 'gato', 'outro')),
          tipo_servico TEXT NOT NULL CHECK (tipo_servico IN ('visita', 'hospedagem', 'passeio', 'creche', 'banho')),
          data_inicio TEXT NOT NULL,
          data_fim TEXT,
          mensagem TEXT,
          status TEXT NOT NULL DEFAULT 'novo' ${STATUS_ORCAMENTO},
          criado_em DATETIME NOT NULL DEFAULT (datetime('now'))
        );
      `);
      db.exec(`
        INSERT INTO orcamentos (id, nome_cliente, contato, tipo_pet, tipo_servico, data_inicio, data_fim, mensagem, status, criado_em)
        SELECT id, nome_cliente, contato, tipo_pet, tipo_servico, data_inicio, data_fim, mensagem,
               CASE WHEN status = 'respondido' THEN 'contatado' ELSE status END,
               criado_em
        FROM orcamentos_antigo;
      `);
      db.exec('DROP TABLE orcamentos_antigo;');
    } else {
      db.exec(`
        CREATE TABLE orcamentos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome_cliente TEXT NOT NULL,
          contato TEXT NOT NULL,
          tipo_pet TEXT NOT NULL CHECK (tipo_pet IN ('cachorro', 'gato', 'outro')),
          tipo_servico TEXT NOT NULL CHECK (tipo_servico IN ('visita', 'hospedagem', 'passeio', 'creche', 'banho')),
          data_inicio TEXT NOT NULL,
          data_fim TEXT,
          mensagem TEXT,
          status TEXT NOT NULL DEFAULT 'novo' ${STATUS_ORCAMENTO},
          criado_em DATETIME NOT NULL DEFAULT (datetime('now'))
        );
      `);
    }

    db.exec('PRAGMA user_version = 2;');
  }

  if (versao < 3) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL CHECK (length(nome) BETWEEN 2 AND 120),
        descricao TEXT,
        preco_centavos INTEGER NOT NULL CHECK (preco_centavos >= 0),
        arquivo TEXT,
        tipo_mime TEXT,
        estoque INTEGER CHECK (estoque IS NULL OR estoque >= 0),
        ativo TEXT NOT NULL DEFAULT 'sim' ${STATUS_PRODUTO},
        ordem INTEGER NOT NULL DEFAULT 0,
        criado_em DATETIME NOT NULL DEFAULT (datetime('now'))
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_cliente TEXT NOT NULL CHECK (length(nome_cliente) BETWEEN 2 AND 100),
        contato TEXT NOT NULL,
        itens TEXT NOT NULL,
        total_centavos INTEGER NOT NULL CHECK (total_centavos >= 0),
        observacoes TEXT,
        status TEXT NOT NULL DEFAULT 'recebido' ${STATUS_PEDIDO},
        criado_em DATETIME NOT NULL DEFAULT (datetime('now'))
      );
    `);

    db.exec('PRAGMA user_version = 3;');
  }

  if (versao < 4) {
    db.exec("ALTER TABLE orcamentos ADD COLUMN porte TEXT CHECK (porte IN ('Pequeno', 'Grande'))");
    db.exec("ALTER TABLE orcamentos ADD COLUMN usa_medicacao TEXT CHECK (usa_medicacao IN ('sim', 'nao'))");
    db.exec("ALTER TABLE orcamentos ADD COLUMN medicacao_detalhes TEXT");

    db.exec(`
      CREATE TABLE IF NOT EXISTS depoimentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        autor TEXT,
        texto TEXT,
        arquivo TEXT,
        tipo_mime TEXT,
        ativo TEXT NOT NULL DEFAULT 'sim' ${STATUS_DEPOIMENTO},
        ordem INTEGER NOT NULL DEFAULT 0,
        criado_em DATETIME NOT NULL DEFAULT (datetime('now'))
      );
    `);

    db.exec('PRAGMA user_version = 4;');
  }
}

migrar();

db.exec(`
  CREATE TABLE IF NOT EXISTS orcamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_cliente TEXT NOT NULL,
    contato TEXT NOT NULL,
    tipo_pet TEXT NOT NULL CHECK (tipo_pet IN ('cachorro', 'gato', 'outro')),
    tipo_servico TEXT NOT NULL CHECK (tipo_servico IN ('visita', 'hospedagem', 'passeio', 'creche', 'banho')),
    porte TEXT CHECK (porte IN ('Pequeno', 'Grande')),
    usa_medicacao TEXT CHECK (usa_medicacao IN ('sim', 'nao')),
    medicacao_detalhes TEXT,
    data_inicio TEXT NOT NULL,
    data_fim TEXT,
    mensagem TEXT,
    status TEXT NOT NULL DEFAULT 'novo' ${STATUS_ORCAMENTO},
    criado_em DATETIME NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS galeria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    arquivo TEXT NOT NULL UNIQUE,
    nome_original TEXT NOT NULL,
    tipo_mime TEXT NOT NULL,
    tamanho_bytes INTEGER NOT NULL,
    legenda TEXT,
    status TEXT NOT NULL DEFAULT 'publicado' CHECK (status IN ('publicado', 'oculto')),
    criado_em DATETIME NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL CHECK (length(nome) BETWEEN 2 AND 120),
    descricao TEXT,
    preco_centavos INTEGER NOT NULL CHECK (preco_centavos >= 0),
    arquivo TEXT,
    tipo_mime TEXT,
    estoque INTEGER CHECK (estoque IS NULL OR estoque >= 0),
    ativo TEXT NOT NULL DEFAULT 'sim' ${STATUS_PRODUTO},
    ordem INTEGER NOT NULL DEFAULT 0,
    criado_em DATETIME NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_cliente TEXT NOT NULL CHECK (length(nome_cliente) BETWEEN 2 AND 100),
    contato TEXT NOT NULL,
    itens TEXT NOT NULL,
    total_centavos INTEGER NOT NULL CHECK (total_centavos >= 0),
    observacoes TEXT,
    status TEXT NOT NULL DEFAULT 'recebido' ${STATUS_PEDIDO},
    criado_em DATETIME NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS depoimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    autor TEXT,
    texto TEXT,
    arquivo TEXT,
    tipo_mime TEXT,
    ativo TEXT NOT NULL DEFAULT 'sim' ${STATUS_DEPOIMENTO},
    ordem INTEGER NOT NULL DEFAULT 0,
    criado_em DATETIME NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
module.exports.fechar = () => db.close();