const bcrypt = require('bcryptjs');
const fs = require('fs');
const os = require('os');
const path = require('path');

const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'amanda-db-nav-'));
const uploadsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'amanda-uploads-nav-'));

process.env.DATA_DIR = dataDir;
process.env.UPLOADS_DIR = uploadsDir;
process.env.JWT_SECRET = 'segredo-diagnostico';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('teste123', 4);

const app = require('../src/app');
const server = app.listen(0);
const porta = server.address().port;
const base = `http://127.0.0.1:${porta}`;
const pastaPrints = fs.mkdtempSync(path.join(os.tmpdir(), 'amanda-prints-'));

function linha(texto) {
  console.log(texto);
}

(async () => {
  try {
  const { default: puppeteer } = await import('puppeteer');
  const navegador = await puppeteer.launch();
  const pagina = await navegador.newPage();

  pagina.on('console', (m) => linha(`  [console.${m.type()}] ${m.text()}`));
  pagina.on('pageerror', (e) => linha(`  [ERRO JS NA PAGINA] ${e.message}`));
  pagina.on('requestfailed', (r) => linha(`  [FALHA DE REQUEST] ${r.method()} ${r.url()} -> ${r.failure() && r.failure().errorText}`));
  pagina.on('response', async (r) => {
    const url = r.url();
    if (url.includes('/api/admin/')) {
      linha(`  [resposta] ${r.status()} ${r.request().method()} ${url.replace(base, '')}`);
    }
    if (url.endsWith('/admin.js')) {
      const texto = await r.text();
      linha(`  [admin.js servido] tamanho=${texto.length} | headers-corrigido=${texto.includes('headers: cabecalhos')} | versao-mensagem=${texto.includes('validar a sessao') || texto.includes('validar a sessão')}`);
    }
  });

  linha('== 1. Abrindo /admin ==');
  await pagina.goto(`${base}/admin/`, { waitUntil: 'networkidle0' });

  const antes = await pagina.evaluate(() => ({
    loginExiste: !!document.getElementById('tela-login'),
    loginHidden: document.getElementById('tela-login').hidden,
    loginDisplay: getComputedStyle(document.getElementById('tela-login')).display,
    painelHidden: document.getElementById('tela-painel').hidden,
    painelDisplay: getComputedStyle(document.getElementById('tela-painel')).display,
    formulario: !!document.getElementById('form-login'),
  }));
  linha(`  estado inicial: ${JSON.stringify(antes)}`);
  await pagina.screenshot({ path: path.join(pastaPrints, '1-login.png') });

  linha('== 2. Preenchendo credenciais e clicando Entrar ==');
  await pagina.type('#usuario', 'admin');
  await pagina.type('#senha', 'teste123');
  await pagina.click('#form-login button[type="submit"]');
  await new Promise((r) => setTimeout(r, 3000));

  const depois = await pagina.evaluate(() => ({
    aviso: document.getElementById('aviso-login').textContent,
    usuarioValor: document.getElementById('usuario').value,
    senhaValor: document.getElementById('senha').value,
    loginHidden: document.getElementById('tela-login').hidden,
    loginDisplay: getComputedStyle(document.getElementById('tela-login')).display,
    painelHidden: document.getElementById('tela-painel').hidden,
    painelDisplay: getComputedStyle(document.getElementById('tela-painel')).display,
    dataHoje: document.querySelector('.data-hoje') ? document.querySelector('.data-hoje').textContent : '(sem .data-hoje)',
    linhasTabela: document.querySelectorAll('#corpo-orcamentos tr').length,
    token: localStorage.getItem('token_admin_amanda') ? 'presente (' + localStorage.getItem('token_admin_amanda').slice(0, 20) + '...)' : 'AUSENTE',
  }));
  linha(`  estado final: ${JSON.stringify(depois, null, 2)}`);
  await pagina.screenshot({ path: path.join(pastaPrints, '2-depois-login.png') });
  await pagina.screenshot({ path: path.join(pastaPrints, '2-depois-login-full.png'), fullPage: true });

  linha('== 3. Prints salvos em ==');
  linha(`  ${pastaPrints}`);

  await navegador.close();
} catch (erro) {
  linha(`[ERRO DO DIAGNOSTICO] ${erro.message}`);
  process.exitCode = 1;
} finally {
  server.close();
  try {
    require('../src/db').fechar();
  } catch {}
  fs.rmSync(dataDir, { recursive: true, force: true });
  fs.rmSync(uploadsDir, { recursive: true, force: true });
}
})();