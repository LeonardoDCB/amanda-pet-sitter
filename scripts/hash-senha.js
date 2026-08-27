const bcrypt = require('bcryptjs');

const senha = process.argv[2] || '';

if (!senha) {
  console.error('Uso: npm run hash-senha "sua-senha"');
  process.exit(1);
}

const hash = bcrypt.hashSync(senha, 10);
console.log('Coloque este valor em ADMIN_PASSWORD_HASH no .env:');
console.log(hash);