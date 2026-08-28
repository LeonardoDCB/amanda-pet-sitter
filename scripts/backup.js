const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '..', 'data');

const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DB_PATH = path.join(DATA_DIR, 'site.db');
const MAX_BACKUPS = 7;

if (!fs.existsSync(DB_PATH)) {
  console.error('Banco não encontrado em', DB_PATH);
  process.exit(1);
}

fs.mkdirSync(BACKUP_DIR, { recursive: true });

const agora = new Date();
const ts = agora.toISOString().replace(/[:.]/g, '-').slice(0, 19);
const nome = `site-${ts}.db`;
const destino = path.join(BACKUP_DIR, nome);

fs.copyFileSync(DB_PATH, destino);
console.log('Backup criado:', destino);

const backups = fs.readdirSync(BACKUP_DIR)
  .filter(f => f.startsWith('site-') && f.endsWith('.db'))
  .sort()
  .reverse();

if (backups.length > MAX_BACKUPS) {
  for (const velho of backups.slice(MAX_BACKUPS)) {
    fs.unlinkSync(path.join(BACKUP_DIR, velho));
    console.log('Backup antigo removido:', velho);
  }
}

console.log(`Backups mantidos: ${Math.min(backups.length, MAX_BACKUPS)}`);
