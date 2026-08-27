const bcrypt = require('bcryptjs');
const fs = require('fs');
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'amanda-loja-db-'));
process.env.UPLOADS_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'amanda-loja-up-'));
process.env.JWT_SECRET = 'segredo-de-teste';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('teste123', 4);

const app = require('../src/app');

const server = app.listen(0);
const base = `http://127.0.0.1:${server.address().port}`;

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'amanda-loja-prints-'));

async function log(msg) {
  console.log('== ' + msg);
}

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 900 });

  const erros = [];
  page.on('pageerror', (e) => erros.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') erros.push('console: ' + m.text()); });

  try {
    // 1) Admin - login obrigatorio
    await page.goto(`${base}/admin`, { waitUntil: 'networkidle0' });
    const loginVisivel = await page.evaluate(() => {
      const t = document.getElementById('tela-login');
      return t && !t.hidden && getComputedStyle(t).display !== 'none';
    });
    log('login obrigatorio visivel: ' + loginVisivel);
    await page.type('#usuario', 'admin');
    await page.type('#senha', 'teste123');
    await page.click('#form-login button[type="submit"]');
    await page.waitForSelector('#tela-painel:not([hidden])', { timeout: 5000 });
    log('painel apos login: visivel');

    // 2) Aba Produtos - cadastrar
    await page.evaluate(() => {
      [...document.querySelectorAll('.aba')].find((a) => a.dataset.aba === 'produtos').click();
    });
    await page.waitForSelector('#conteudo-produtos:not([hidden])', { timeout: 5000 });
    await page.type('#produto-nome', 'Coleira Rosa Teste');
    await page.type('#produto-preco', '25,90');
    await page.type('#produto-descricao', 'Uma coleira fofa para teste');
    await page.click('#form-produto button[type="submit"]');
    await page.waitForFunction(() => document.querySelectorAll('#lista-produtos .item-galeria').length > 0, { timeout: 5000 });
    log('produto cadastrado e listado no admin');

    // 3) Site publico - loja
    await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.getElementById('loja').scrollIntoView());
    await page.waitForSelector('#grade-loja .produto-card', { timeout: 5000 });
    const nomeCard = await page.$eval('#grade-loja .produto-card h3', (el) => el.textContent);
    log('card na loja: ' + nomeCard);

    // adicionar ao carrinho
    await page.click('#grade-loja .produto-card .btn-adicionar');
    await page.waitForSelector('#carrinho:not([hidden])', { timeout: 5000 });
    const contador = await page.$eval('#carrinho-contador', (el) => el.textContent);
    log('contador carrinho: ' + contador);
    const totalTxt = await page.$eval('#carrinho-total', (el) => el.textContent);
    log('total carrinho: ' + totalTxt);

    // finalizar pedido
    await page.type('#pedido-nome', 'Cliente Magno');
    await page.type('#pedido-contato', '(18) 90000-0000');
    await page.click('#form-pedido button[type="submit"]');
    await page.waitForSelector('#sucesso-pedido:not([hidden])', { timeout: 5000 });
    log('pedido finalizado (sucesso visivel)');

    // 4) Admin - Pedidos (re-login obrigatorio a cada visita)
    await page.goto(`${base}/admin`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#tela-login:not([hidden])', { timeout: 5000 });
    await page.type('#usuario', 'admin');
    await page.type('#senha', 'teste123');
    await page.click('#form-login button[type="submit"]');
    await page.waitForSelector('#tela-painel:not([hidden])', { timeout: 5000 });
    await page.evaluate(() => {
      [...document.querySelectorAll('.aba')].find((a) => a.dataset.aba === 'pedidos').click();
    });
    await page.waitForSelector('#conteudo-pedidos:not([hidden])', { timeout: 5000 });
    await page.waitForSelector('#corpo-pedidos tr', { timeout: 5000 });
    const clientePedido = await page.$eval('#corpo-pedidos tr td strong', (el) => el.textContent);
    log('pedido no admin cliente: ' + clientePedido);

    await page.screenshot({ path: path.join(dir, 'pedidos-admin.png') });
    log('prints em ' + dir);
  } catch (e) {
    console.error('ERRO no diagnostico:', e.message);
    erros.push('erro: ' + e.message);
  } finally {
    if (erros.length) {
      console.log('\nERROS DETECTADOS:');
      erros.forEach((e) => console.log(' - ' + e));
    } else {
      console.log('\nNenhum erro de pagina/console.');
    }
    await browser.close();
    server.close();
    try { require('../src/db').fechar(); } catch {}
    fs.rmSync(process.env.DATA_DIR, { recursive: true, force: true });
    fs.rmSync(process.env.UPLOADS_DIR, { recursive: true, force: true });
  }
})();
