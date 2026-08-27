const bcrypt = require('bcryptjs');
const fs = require('fs');
const os = require('os');
const path = require('path');

const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'amanda-db-'));
const uploadsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'amanda-uploads-'));

process.env.DATA_DIR = dataDir;
process.env.UPLOADS_DIR = uploadsDir;
process.env.JWT_SECRET = 'segredo-de-teste';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('teste123', 4);

const app = require('../src/app');

let falhas = 0;
function verificar(nome, condicao) {
  console.log(`[${condicao ? 'PASS' : 'FAIL'}] ${nome}`);
  if (!condicao) falhas += 1;
}

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

const server = app.listen(0);
const porta = server.address().port;
const base = `http://127.0.0.1:${porta}`;

async function json(rota, opcoes = {}) {
  const resposta = await fetch(base + rota, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json', ...(opcoes.headers || {}) },
  });
  return { resposta, corpo: await resposta.json().catch(() => ({})) };
}

async function testar() {
  try {
    const home = await fetch(base + '/');
    verificar('GET / -> 200 html', home.status === 200 && (home.headers.get('content-type') || '').includes('text/html'));

    const adminJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'admin', 'admin.js'), 'utf8');
    verificar(
      'admin.js envia Authorization via headers (regressao cabecalhos)',
      adminJs.includes('fetch(rota, { ...opcoes, headers: cabecalhos })') &&
      !adminJs.includes('{ ...opcoes, cabecalhos }')
    );

    const guardaHidden = /\[hidden\]\s*\{[^}]*display:\s*none\s*!important/i;
    const adminCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'admin', 'admin.css'), 'utf8');
    verificar('admin.css possui guarda [hidden]', guardaHidden.test(adminCss));

    const baseCss = fs.readFileSync(path.join(__dirname, '..', 'public', 'css', 'base.css'), 'utf8');
    verificar('base.css possui guarda [hidden]', guardaHidden.test(baseCss));

    const galeria = await fetch(base + '/api/galeria');
    verificar('GET /api/galeria -> 200 array vazio', galeria.status === 200 && Array.isArray(await galeria.json()));

    const valido = await json('/api/orcamentos', {
      method: 'POST',
      body: JSON.stringify({ nome_cliente: 'Ana Teste', contato: '(18) 90000-1111', tipo_pet: 'gato', tipo_servico: 'hospedagem', porte: 'Pequeno', usa_medicacao: 'nao', data_inicio: '2026-12-01', data_fim: '2026-12-05', mensagem: 'semana de viagem' }),
    });
    verificar('POST orcamento valido -> 201(id 1)', valido.resposta.status === 201 && valido.corpo.id === 1);

    const invertido = await json('/api/orcamentos', {
      method: 'POST',
      body: JSON.stringify({ nome_cliente: 'Carlos', contato: 'c@c.com', tipo_pet: 'cachorro', tipo_servico: 'visita', porte: 'Grande', usa_medicacao: 'sim', medicacao_detalhes: 'antibiotico', data_inicio: '2026-12-10', data_fim: '2026-12-01' }),
    });
    verificar('POST com data_fim < data_inicio -> 400', invertido.resposta.status === 400);

    const invalido = await json('/api/orcamentos', {
      method: 'POST',
      body: JSON.stringify({ nome_cliente: 'x', contato: '', tipo_pet: 'pato', tipo_servico: 'zz' }),
    });
    verificar('POST orcamento invalido -> 400', invalido.resposta.status === 400);

    const honeypot = await json('/api/orcamentos', {
      method: 'POST',
      body: JSON.stringify({ nome_cliente: 'Bot', contato: 'bot@spam.com', tipo_pet: 'outro', tipo_servico: 'visita', porte: 'Pequeno', usa_medicacao: 'nao', data_inicio: '2026-12-01', website: 'http://spam.example' }),
    });
    verificar('POST com honeypot preenchido -> 201 (fingido)', honeypot.resposta.status === 201);

    const loginErrado = await json('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ usuario: 'admin', senha: 'errada' }),
    });
    verificar('Login com senha errada -> 401', loginErrado.resposta.status === 401);

    const login = await json('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ usuario: 'admin', senha: 'teste123' }),
    });
    verificar('Login correto -> token', login.resposta.status === 200 && typeof login.corpo.token === 'string');
    const auth = { Authorization: `Bearer ${login.corpo.token}` };

    const semAuth = await fetch(base + '/api/admin/orcamentos');
    verificar('GET admin sem token -> 401', semAuth.status === 401);

    const lista = await json('/api/admin/orcamentos', { headers: auth });
    verificar('Listar orcamentos (honeypot NAO salvo) -> total 1', lista.resposta.status === 200 && lista.corpo.total === 1);

    const patch = await json('/api/admin/orcamentos/1', { method: 'PATCH', headers: auth, body: JSON.stringify({ status: 'lido' }) });
    verificar('PATCH status lido -> ok', patch.resposta.status === 200 && patch.corpo.status === 'lido');

    const formData = new FormData();
    formData.append('imagens', new Blob([PNG_1X1], { type: 'image/png' }), 'teste.png');
    const upload = await fetch(base + '/api/admin/galeria', { method: 'POST', headers: auth, body: formData });
    const uploadCorpo = await upload.json();
    verificar('Upload imagem -> 201', upload.status === 201 && uploadCorpo.itens.length === 1);
    const arquivo = uploadCorpo.itens[0].arquivo;

    const galeriaApos = await fetch(base + '/api/galeria');
    const galeriaCorpo = await galeriaApos.json();
    verificar('GET /api/galeria -> imagem publicada visivel', galeriaCorpo.length === 1 && galeriaCorpo[0].arquivo === arquivo);

    const arquivoServido = await fetch(base + '/uploads/' + arquivo);
    verificar('GET /uploads/:arquivo -> 200 png', arquivoServido.status === 200 && (arquivoServido.headers.get('content-type') || '').includes('image/png'));

    const deleteImg = await fetch(base + `/api/admin/galeria/${uploadCorpo.itens[0].id}`, { method: 'DELETE', headers: auth });
    verificar('DELETE imagem -> ok', deleteImg.status === 200);

    const deleteOrc = await fetch(base + '/api/admin/orcamentos/1', { method: 'DELETE', headers: auth });
    verificar('DELETE orcamento -> ok', deleteOrc.status === 200);

    // --- Loja / Produtos / Pedidos ---
    const formProd = new FormData();
    formProd.append('nome', 'Coleira Rosa');
    formProd.append('preco_centavos', '2590');
    formProd.append('ativo', 'sim');
    formProd.append('descricao', 'Coleira fofa');
    const prodResp = await fetch(base + '/api/admin/produtos', { method: 'POST', headers: auth, body: formProd });
    const prodCorpo = await prodResp.json();
    verificar('POST /api/admin/produtos -> 201(id 1)', prodResp.status === 201 && prodCorpo.id === 1);
    const prodId = prodCorpo.id;

    const produtosLista = await json('/api/admin/produtos', { headers: auth });
    verificar('GET /api/admin/produtos -> lista', produtosLista.resposta.status === 200 && Array.isArray(produtosLista.corpo) && produtosLista.corpo.length === 1);

    const produtosPublicos = await fetch(base + '/api/produtos');
    verificar('GET /api/produtos -> 200 array', produtosPublicos.status === 200 && Array.isArray(await produtosPublicos.json()));

    const pedidoOk = await json('/api/pedidos', {
      method: 'POST',
      body: JSON.stringify({ nome_cliente: 'Cliente Teste', contato: '(18) 90000-2222', itens: [{ produto_id: prodId, quantidade: 2 }], observacoes: 'por favor' }),
    });
    verificar('POST /api/pedidos valido -> 201(id 1)', pedidoOk.resposta.status === 201 && pedidoOk.corpo.id === 1);
    const pedidoId = pedidoOk.corpo.id;

    const pedidoDet = await json('/api/admin/pedidos/' + pedidoId, { headers: auth });
    verificar('total do pedido = 2 x 2590 = 5180', pedidoDet.resposta.ok && pedidoDet.corpo.total_centavos === 5180);

    const formInativa = new FormData();
    formInativa.append('nome', 'Produto Inativo');
    formInativa.append('preco_centavos', '1000');
    formInativa.append('ativo', 'nao');
    const inativaResp = await fetch(base + '/api/admin/produtos', { method: 'POST', headers: auth, body: formInativa });
    const inativaId = (await inativaResp.json()).id;
    const pedidoInativa = await json('/api/pedidos', {
      method: 'POST',
      body: JSON.stringify({ nome_cliente: 'X', contato: 'x@x.com', itens: [{ produto_id: inativaId, quantidade: 1 }] }),
    });
    verificar('POST /api/pedidos com produto inativo -> 400', pedidoInativa.resposta.status === 400);

    const patchProd = await json('/api/admin/produtos/' + prodId, { method: 'PATCH', headers: auth, body: JSON.stringify({ ativo: 'nao' }) });
    verificar('PATCH /api/admin/produtos/:id -> ok', patchProd.resposta.status === 200);

    const listaPed = await json('/api/admin/pedidos', { headers: auth });
    verificar('GET /api/admin/pedidos -> lista', listaPed.resposta.status === 200 && listaPed.corpo.total >= 1);

    const patchPed = await json('/api/admin/pedidos/' + pedidoId, { method: 'PATCH', headers: auth, body: JSON.stringify({ status: 'concluido' }) });
    verificar('PATCH /api/admin/pedidos/:id status -> ok', patchPed.resposta.status === 200 && patchPed.corpo.status === 'concluido');

    const delPed = await fetch(base + '/api/admin/pedidos/' + pedidoId, { method: 'DELETE', headers: auth });
    verificar('DELETE /api/admin/pedidos/:id -> ok', delPed.status === 200);

    const delProd = await fetch(base + '/api/admin/produtos/' + prodId, { method: 'DELETE', headers: auth });
    verificar('DELETE /api/admin/produtos/:id -> ok', delProd.status === 200);

    // upload de imagem em produto + servir via /uploads
    const formImg = new FormData();
    formImg.append('nome', 'Com Foto');
    formImg.append('preco_centavos', '500');
    formImg.append('ativo', 'sim');
    formImg.append('imagem', new Blob([PNG_1X1], { type: 'image/png' }), 'foto.png');
    const imgResp = await fetch(base + '/api/admin/produtos', { method: 'POST', headers: auth, body: formImg });
    const imgCorpo = await imgResp.json();
    const prodComFoto = await json('/api/admin/produtos', { headers: auth });
    const arquivoFoto = prodComFoto.corpo.find((p) => p.arquivo)?.arquivo;
    verificar('POST /api/admin/produtos com imagem -> 201', imgResp.status === 201 && Boolean(arquivoFoto));
    if (arquivoFoto) {
      const servido = await fetch(base + '/uploads/' + arquivoFoto);
      verificar('GET /uploads/:arquivo de produto -> 200', servido.status === 200);
    }

    // remover imagem do produto
    const formRem = new FormData();
    formRem.append('nome', 'Para Remover');
    formRem.append('preco_centavos', '100');
    formRem.append('ativo', 'sim');
    formRem.append('imagem', new Blob([PNG_1X1], { type: 'image/png' }), 'r.png');
    const remResp = await fetch(base + '/api/admin/produtos', { method: 'POST', headers: auth, body: formRem });
    const remId = (await remResp.json()).id;
    const listaAntes = await json('/api/admin/produtos', { headers: auth });
    const prodAntes = listaAntes.corpo.find((p) => p.id === remId);
    const arqAntes = prodAntes && prodAntes.arquivo;
    verificar('produto criado com imagem', Boolean(arqAntes));
    const patchRem = await fetch(base + '/api/admin/produtos/' + remId, {
      method: 'PATCH',
      headers: auth,
      body: (() => { const f = new FormData(); f.append('remover_imagem', '1'); return f; })(),
    });
    verificar('PATCH remover_imagem -> 200', patchRem.status === 200);
    const listaDepois = await json('/api/admin/produtos', { headers: auth });
    const prodDepois = listaDepois.corpo.find((p) => p.id === remId);
    verificar('imagem removida (arquivo null)', prodDepois && prodDepois.arquivo === null);
    if (arqAntes) {
      const servido = await fetch(base + '/uploads/' + arqAntes);
      verificar('arquivo fisico removido -> 404', servido.status === 404);
    }
    await fetch(base + '/api/admin/produtos/' + remId, { method: 'DELETE', headers: auth });

    // depoimentos (texto e print)
    const depTexto = await fetch(base + '/api/admin/depoimentos', {
      method: 'POST', headers: auth,
      body: (() => { const f = new FormData(); f.append('autor', 'Maria'); f.append('texto', 'A Amanda foi incrível com meu cão!'); f.append('ativo', 'sim'); return f; })(),
    });
    verificar('POST /api/admin/depoimentos (texto) -> 201', depTexto.status === 201);
    const depId = (await depTexto.json()).id;

    const depPub = await json('/api/depoimentos', {});
    verificar('GET /api/depoimentos mostra ativo', Array.isArray(depPub.corpo) && depPub.corpo.some((d) => d.id === depId && d.texto));

    const depImg = await fetch(base + '/api/admin/depoimentos', {
      method: 'POST', headers: auth,
      body: (() => { const f = new FormData(); f.append('autor', 'João'); f.append('imagem', new Blob([PNG_1X1], { type: 'image/png' }), 'dep.png'); f.append('ativo', 'sim'); return f; })(),
    });
    verificar('POST /api/admin/depoimentos (print) -> 201', depImg.status === 201);
    const depImgId = (await depImg.json()).id;
    const depImgInfo = await json('/api/admin/depoimentos', { headers: auth });
    const depImgItem = depImgInfo.corpo.find((d) => d.id === depImgId);
    const arqDep = depImgItem && depImgItem.arquivo;
    verificar('depoimento com print tem arquivo', Boolean(arqDep));
    if (arqDep) {
      const servido = await fetch(base + '/uploads/' + arqDep);
      verificar('upload de depoimento servido -> 200', servido.status === 200);
    }

    const depPatch = await fetch(base + '/api/admin/depoimentos/' + depId, {
      method: 'PATCH', headers: auth,
      body: (() => { const f = new FormData(); f.append('ativo', 'nao'); return f; })(),
    });
    verificar('PATCH /api/admin/depoimentos/:id -> 200', depPatch.status === 200);
    const depPub2 = await json('/api/depoimentos', {});
    verificar('depoimento inativo some da lista publica', !depPub2.corpo.some((d) => d.id === depId));

    await fetch(base + '/api/admin/depoimentos/' + depId, { method: 'DELETE', headers: auth });
    await fetch(base + '/api/admin/depoimentos/' + depImgId, { method: 'DELETE', headers: auth });

    // avaliacao em depoimentos
    const depAval = await fetch(base + '/api/admin/depoimentos', {
      method: 'POST', headers: auth,
      body: (() => { const f = new FormData(); f.append('autor', 'Ana'); f.append('texto', 'Excelente atendimento!'); f.append('avaliacao', '5'); f.append('ativo', 'sim'); return f; })(),
    });
    verificar('POST /api/admin/depoimentos com avaliacao -> 201', depAval.status === 201);
    const depAvalId = (await depAval.json()).id;
    const depPubAval = await json('/api/depoimentos', {});
    verificar('GET /api/depoimentos inclui avaliacao', depPubAval.corpo.some((d) => d.id === depAvalId && d.avaliacao === 5));
    const depPatchAval = await fetch(base + '/api/admin/depoimentos/' + depAvalId, {
      method: 'PATCH', headers: auth,
      body: (() => { const f = new FormData(); f.append('remover_avaliacao', '1'); return f; })(),
    });
    verificar('PATCH remover_avaliacao -> 200', depPatchAval.status === 200);
    const depPubAval2 = await json('/api/depoimentos', {});
    verificar('avaliacao removida fica null', depPubAval2.corpo.find((d) => d.id === depAvalId)?.avaliacao === null);
    await fetch(base + '/api/admin/depoimentos/' + depAvalId, { method: 'DELETE', headers: auth });

    // paginas de conteudo / SEO
    const homeTxt = await (await fetch(base + '/')).text();
    verificar('home canonical .pet', homeTxt.includes('rel="canonical" href="https://amandapetsitter.pet/"'));
    verificar('home og:url .pet', homeTxt.includes('og:url" content="https://amandapetsitter.pet/"'));
    for (const pag of ['/servicos/visita', '/servicos/hospedagem', '/servicos/passeio', '/faq', '/dicas']) {
      const r = await fetch(base + pag);
      verificar(`GET ${pag} -> 200 html`, r.status === 200 && (r.headers.get('content-type') || '').includes('text/html'));
    }
    const robots = await fetch(base + '/robots.txt');
    const robotsTxt = await robots.text();
    verificar('robots.txt aponta Sitemap', robotsTxt.includes('Sitemap: https://amandapetsitter.pet/sitemap.xml'));
    const sm = await fetch(base + '/sitemap.xml');
    const smTxt = await sm.text();
    verificar('sitemap.xml com urls de servico/faq', sm.status === 200 && smTxt.includes('amandapetsitter.pet/servicos/visita') && smTxt.includes('amandapetsitter.pet/faq'));
  } finally {
    server.close();
    try {
      require('../src/db').fechar();
    } catch {}
    fs.rmSync(dataDir, { recursive: true, force: true });
    fs.rmSync(uploadsDir, { recursive: true, force: true });
  }

  if (falhas > 0) {
    console.log(`\n${falhas} teste(s) FALHARAM.`);
    process.exit(1);
  }
  console.log('\nTodos os testes passaram.');
  process.exit(0);
}

testar().catch((err) => {
  console.error(err);
  process.exit(1);
});