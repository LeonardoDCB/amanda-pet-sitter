const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('../src/db');

const SRC = path.join(__dirname, '..', 'fotos_site', 'fotos galeria');
const UPLOADS = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOADS, { recursive: true });

const arquivos = fs.readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();

let adicionados = 0;
let ignorados = 0;

for (const nomeArquivo of arquivos) {
  const origem = path.join(SRC, nomeArquivo);
  const stat = fs.statSync(origem);
  if (!stat.isFile()) continue;

  const existente = db
    .prepare('SELECT id FROM galeria WHERE nome_original = ?')
    .get(nomeArquivo);
  if (existente) {
    ignorados++;
    continue;
  }

  const ext = path.extname(nomeArquivo).toLowerCase();
  const tipoMime =
    ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  const nome = `${crypto.randomUUID()}${ext}`;
  fs.copyFileSync(origem, path.join(UPLOADS, nome));

  db.prepare(
    `INSERT INTO galeria (arquivo, nome_original, tipo_mime, tamanho_bytes, status)
     VALUES (?, ?, ?, ?, 'publicado')`
  ).run(nome, nomeArquivo, tipoMime, stat.size);

  adicionados++;
}

console.log(`Galeria: ${adicionados} imagem(ns) adicionada(s), ${ignorados} já existente(s).`);
