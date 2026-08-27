const CHAVE_TOKEN = "token_admin_amanda";
const WHATSAPP_AMANDA = "https://wa.me/5518997607771";

const rotulosStatus = {
  novo: "Novo",
  lido: "Lido",
  contatado: "Contatado",
  arquivado: "Arquivado",
};

const rotulosServico = {
  visita: "Visita em domicílio",
  hospedagem: "Hospedagem",
  passeio: "Passeio",
  creche: "Creche",
  banho: "Banho & tosa",
};

const rotulosPet = {
  cachorro: "Cachorro",
  gato: "Gato",
  outro: "Outro",
};

const telaLogin = document.getElementById("tela-login");
const telaPainel = document.getElementById("tela-painel");

function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

function setToken(token) {
  localStorage.setItem(CHAVE_TOKEN, token);
}

function limparToken() {
  localStorage.removeItem(CHAVE_TOKEN);
}

async function api(rota, opcoes = {}) {
  const cabecalhos = { ...(opcoes.headers || {}) };
  const token = obterToken();
  if (token) cabecalhos.Authorization = `Bearer ${token}`;

  const resposta = await fetch(rota, { ...opcoes, headers: cabecalhos });

  if (resposta.status === 401) {
    mostrarLogin();
    throw new Error("Sessão expirada");
  }

  return resposta;
}

function formatarData(iso) {
  if (!iso) return "";
  const [ano, mes, dia] = String(iso).slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarDataHora(iso) {
  if (!iso) return "";
  const data = new Date(iso.replace(" ", "T") + "Z");
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function mostrarLogin() {
  limparToken();
  telaLogin.hidden = false;
  telaPainel.hidden = true;
}

async function verificarSessao() {
  if (!obterToken()) {
    mostrarLogin();
    return false;
  }
  try {
    const resposta = await api("/api/admin/me");
    if (!resposta.ok) throw new Error("sessao");
    return true;
  } catch {
    mostrarLogin();
    return false;
  }
}

async function entrar() {
  if (!(await verificarSessao())) return false;
  telaLogin.hidden = true;
  telaPainel.hidden = false;
  atualizarDataHoje();
  const usuario = await mostrarUsuario();
  await Promise.all([carregarOrcamentos(), carregarGaleria(), carregarProdutos(), carregarPedidos()]);
  return true;
}

async function mostrarUsuario() {
  try {
    const resposta = await api("/api/admin/me");
    if (!resposta.ok) return;
    const dados = await resposta.json();
    const el = document.getElementById("usuario-logado");
    if (el && dados.usuario) el.textContent = dados.usuario;
  } catch {}
}

function atualizarDataHoje() {
  const hoje = new Date();
  document.querySelector(".data-hoje").textContent = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

document.getElementById("form-login").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const aviso = document.getElementById("aviso-login");
  aviso.textContent = "";
  aviso.className = "aviso";

  const botaoEntrar = evento.target.querySelector('button[type="submit"]');
  botaoEntrar.disabled = true;

  try {
    const resposta = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: document.getElementById("usuario").value.trim(),
        senha: document.getElementById("senha").value,
      }),
    });

    const corpo = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
      aviso.textContent = corpo.erro || "Falha no login";
      aviso.className = "aviso erro";
      return;
    }

    setToken(corpo.token);
    document.getElementById("usuario").value = "";
    document.getElementById("senha").value = "";

    if (!(await entrar())) {
      aviso.textContent = "Não foi possível validar a sessão. Tente entrar novamente.";
      aviso.className = "aviso erro";
    }
  } catch {
    aviso.textContent = "Falha de conexão com o servidor. Verifique se ele está rodando.";
    aviso.className = "aviso erro";
  } finally {
    botaoEntrar.disabled = false;
  }
});

document.getElementById("botao-sair").addEventListener("click", () => {
  api("/api/admin/logout", { method: "POST" }).catch(() => {});
  mostrarLogin();
  document.getElementById("aviso-login").textContent = "";
});

const SECOES_PAINEL = {
  orcamentos: "conteudo-orcamentos",
  galeria: "conteudo-galeria",
  produtos: "conteudo-produtos",
  pedidos: "conteudo-pedidos",
  depoimentos: "conteudo-depoimentos",
};

document.querySelectorAll(".aba").forEach((aba) => {
  aba.addEventListener("click", () => {
    const alvo = aba.dataset.aba;
    document.querySelectorAll(".aba").forEach((a) => a.classList.toggle("ativa", a === aba));
    Object.entries(SECOES_PAINEL).forEach(([chave, id]) => {
      document.getElementById(id).hidden = chave !== alvo;
    });
    if (alvo === "produtos") carregarProdutos();
    if (alvo === "pedidos") carregarPedidos();
    if (alvo === "depoimentos") carregarDepoimentos();
  });
});

function formatarCentavos(cents) {
  return "R$ " + (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parsePrecoBR(texto) {
  const limpo = String(texto).replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const valor = parseFloat(limpo);
  if (isNaN(valor) || valor < 0) return null;
  return Math.round(valor * 100);
}

let produtoEditandoId = null;

function carregarProdutos() {
  const lista = document.getElementById("lista-produtos");
  lista.innerHTML = '<p class="sem-itens">Carregando…</p>';

  api("/api/admin/produtos")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((itens) => {
      lista.innerHTML = "";
      if (itens.length === 0) {
        lista.innerHTML = '<p class="sem-itens">Nenhum produto cadastrado ainda. Use o formulário acima. 🐾</p>';
        return;
      }
      for (const item of itens) lista.appendChild(criarItemProduto(item));
    })
    .catch(() => {
      lista.innerHTML = '<p class="sem-itens erro">Não foi possível carregar os produtos.</p>';
    });
}

function criarItemProduto(item) {
  const div = document.createElement("div");
  div.className = "item-galeria";

  let media;
  if (item.arquivo) {
    media = document.createElement("img");
    media.src = `/uploads/${item.arquivo}`;
    media.alt = item.nome;
    media.loading = "lazy";
  } else {
    media = document.createElement("div");
    media.className = "produto-sem-foto";
    media.textContent = "🐾";
    media.setAttribute("aria-label", "Sem foto");
  }

  const corpo = document.createElement("div");
  corpo.className = "corpo";

  const titulo = document.createElement("strong");
  titulo.textContent = item.nome;

  const preco = document.createElement("span");
  preco.className = "produto-preco";
  preco.textContent = formatarCentavos(item.preco_centavos);

  const info = document.createElement("div");
  info.append(titulo, preco);

  const estoque = document.createElement("span");
  estoque.className = "produto-estoque" + (item.estoque === 0 ? " esgotado" : "");
  estoque.textContent = item.estoque === null ? "Sem controle" : `${item.estoque} em estoque`;
  info.appendChild(estoque);

  const acoes = document.createElement("div");
  acoes.className = "acoes";

  const alternar = document.createElement("button");
  alternar.type = "button";
  alternar.className = "botao-acao";
  alternar.textContent = item.ativo === "sim" ? "Ocultar" : "Publicar";
  alternar.addEventListener("click", async () => {
    const novo = item.ativo === "sim" ? "nao" : "sim";
    const resposta = await api(`/api/admin/produtos/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: novo }),
    });
    if (resposta.ok) carregarProdutos();
  });

  const editar = document.createElement("button");
  editar.type = "button";
  editar.className = "botao-acao";
  editar.textContent = "Editar";
  editar.addEventListener("click", () => {
    produtoEditandoId = item.id;
    document.getElementById("produto-nome").value = item.nome;
    document.getElementById("produto-preco").value = (item.preco_centavos / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    document.getElementById("produto-estoque").value = item.estoque === null ? "" : item.estoque;
    document.getElementById("produto-ativo").checked = item.ativo === "sim";
    document.getElementById("produto-descricao").value = item.descricao || "";
    document.getElementById("produto-imagem").value = "";
    const removerWrap = document.getElementById("produto-remover-wrap");
    const remover = document.getElementById("produto-remover-imagem");
    remover.checked = false;
    removerWrap.hidden = !item.arquivo;
    document.getElementById("produto-cancelar").hidden = false;
    if (item.arquivo) mostrarPreviewUrl(`/uploads/${item.arquivo}`);
    else limparPreview();
    document.querySelector("#form-produto button[type='submit']").textContent = "Salvar alterações";
    document.getElementById("produto-nome").focus();
    document.getElementById("form-produto").scrollIntoView({ behavior: "smooth" });
  });

  const excluir = document.createElement("button");
  excluir.type = "button";
  excluir.className = "botao-acao perigo";
  excluir.textContent = "🗑 Excluir";
  excluir.addEventListener("click", async () => {
    if (!confirm(`Excluir o produto "${item.nome}"?`)) return;
    const resposta = await api(`/api/admin/produtos/${item.id}`, { method: "DELETE" });
    if (resposta.ok) carregarProdutos();
  });

  acoes.append(alternar, editar, excluir);
  corpo.append(info, acoes);
  div.append(media, corpo);
  return div;
}

let previewUrl = null;

function limparPreview() {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }
  const preview = document.getElementById("produto-preview");
  const img = document.getElementById("produto-preview-img");
  if (img) img.removeAttribute("src");
  if (preview) preview.hidden = true;
}

function mostrarPreviewArquivo(arquivo) {
  limparPreview();
  const preview = document.getElementById("produto-preview");
  const img = document.getElementById("produto-preview-img");
  previewUrl = URL.createObjectURL(arquivo);
  img.src = previewUrl;
  preview.hidden = false;
}

function mostrarPreviewUrl(src) {
  limparPreview();
  const preview = document.getElementById("produto-preview");
  const img = document.getElementById("produto-preview-img");
  img.src = src;
  preview.hidden = false;
}

function resetarFormularioProduto() {
  document.getElementById("form-produto").reset();
  produtoEditandoId = null;
  limparPreview();
  document.getElementById("produto-remover-imagem").checked = false;
  document.getElementById("produto-remover-wrap").hidden = true;
  document.getElementById("produto-cancelar").hidden = true;
  document.querySelector("#form-produto button[type='submit']").textContent = "Cadastrar produto";
}

document.getElementById("produto-imagem").addEventListener("change", (e) => {
  const arquivo = e.target.files[0];
  if (arquivo) {
    mostrarPreviewArquivo(arquivo);
    document.getElementById("produto-remover-imagem").checked = false;
  } else {
    limparPreview();
  }
});

document.getElementById("produto-remover-imagem").addEventListener("change", (e) => {
  if (e.target.checked) {
    document.getElementById("produto-imagem").value = "";
    limparPreview();
  }
});

document.getElementById("produto-cancelar").addEventListener("click", () => {
  resetarFormularioProduto();
  const aviso = document.getElementById("aviso-produto");
  aviso.textContent = "";
  aviso.className = "aviso";
});

document.getElementById("form-produto").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const aviso = document.getElementById("aviso-produto");
  aviso.textContent = "";
  aviso.className = "aviso";

  const botao = evento.target.querySelector('button[type="submit"]');

  const nome = document.getElementById("produto-nome").value.trim();
  const preco = parsePrecoBR(document.getElementById("produto-preco").value);
  const estoqueRaw = document.getElementById("produto-estoque").value.trim();
  const ativo = document.getElementById("produto-ativo").checked ? "sim" : "nao";
  const descricao = document.getElementById("produto-descricao").value.trim();
  const imagem = document.getElementById("produto-imagem").files[0];
  const removerImagem = document.getElementById("produto-remover-imagem").checked;

  if (nome.length < 2) {
    aviso.textContent = "Informe o nome do produto.";
    aviso.className = "aviso erro";
    return;
  }
  if (preco === null) {
    aviso.textContent = "Informe um preço válido (ex.: 25,90).";
    aviso.className = "aviso erro";
    return;
  }

  const dados = new FormData();
  dados.append("nome", nome);
  dados.append("preco_centavos", String(preco));
  dados.append("ativo", ativo);
  dados.append("descricao", descricao);
  if (estoqueRaw !== "") dados.append("estoque", estoqueRaw);
  if (imagem) dados.append("imagem", imagem);
  if (removerImagem) dados.append("remover_imagem", "1");

  botao.disabled = true;
  botao.textContent = produtoEditandoId ? "Salvando…" : "Cadastrando…";

  const rota = produtoEditandoId
    ? `/api/admin/produtos/${produtoEditandoId}`
    : "/api/admin/produtos";
  const metodo = produtoEditandoId ? "PATCH" : "POST";

  try {
    const resposta = await api(rota, { method: metodo, body: dados });
    const corpo = await resposta.json().catch(() => ({}));

    if (resposta.ok) {
      aviso.textContent = corpo.mensagem || "Produto salvo!";
      aviso.className = "aviso ok";
      resetarFormularioProduto();
      carregarProdutos();
    } else {
      aviso.textContent = corpo.erro || "Falha ao salvar o produto.";
      aviso.className = "aviso erro";
      botao.textContent = produtoEditandoId ? "Salvar alterações" : "Cadastrar produto";
    }
  } catch {
    aviso.textContent = "Falha de conexão. Tente novamente.";
    aviso.className = "aviso erro";
    botao.textContent = produtoEditandoId ? "Salvar alterações" : "Cadastrar produto";
  } finally {
    botao.disabled = false;
  }
});

const rotulosStatusPedido = {
  recebido: "Recebido",
  pago: "Pago",
  enviado: "Enviado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

let paginaPedidos = 1;
const LIMITE_PEDIDOS = 20;

async function carregarPedidos(reiniciar = true) {
  if (reiniciar) paginaPedidos = 1;
  const status = document.getElementById("filtro-pedido-status").value;
  const corpo = document.getElementById("corpo-pedidos");
  const semItens = document.getElementById("sem-pedidos");
  const botaoMais = document.getElementById("carregar-mais-pedidos");

  if (reiniciar) corpo.innerHTML = "";
  semItens.hidden = true;
  botaoMais.hidden = true;

  const rota = `/api/admin/pedidos?pagina=${paginaPedidos}&limite=${LIMITE_PEDIDOS}${status ? `&status=${status}` : ""}`;
  const resposta = await api(rota);
  if (!resposta.ok) return;
  const dados = await resposta.json();

  if (dados.itens.length > 0 || paginaPedidos === 1) {
    for (const item of dados.itens) corpo.appendChild(criarLinhaPedido(item));
  }

  botaoMais.hidden = dados.total <= paginaPedidos * LIMITE_PEDIDOS;
  if (paginaPedidos === 1) {
    const novos = status ? 0 : await contarNovosPedidos();
    const contador = document.getElementById("contador-pedidos");
    contador.hidden = novos === 0;
    contador.textContent = novos;
    document.getElementById("info-total-pedidos").textContent = `${dados.total} pedido(s)`;
  }
}

function resumirItens(itens) {
  try {
    const lista = typeof itens === "string" ? JSON.parse(itens) : itens;
    return lista.map((i) => `${i.quantidade}x ${i.nome}`).join(", ");
  } catch {
    return "—";
  }
}

function criarLinhaPedido(item) {
  const linha = document.createElement("tr");

  const cliente = document.createElement("td");
  cliente.className = "celula-cliente";
  const nome = document.createElement("strong");
  nome.textContent = item.nome_cliente;
  const contato = document.createElement("span");
  contato.textContent = `📞 ${item.contato}`;
  cliente.append(nome, contato);

  const itensTd = document.createElement("td");
  itensTd.textContent = resumirItens(item.itens);

  const totalTd = document.createElement("td");
  totalTd.textContent = formatarCentavos(item.total_centavos);

  const recebido = document.createElement("td");
  recebido.textContent = formatarDataHora(item.criado_em);

  const statusTd = document.createElement("td");
  const selo = document.createElement("span");
  selo.className = `selo ${item.status}`;
  selo.textContent = rotulosStatusPedido[item.status] || item.status;
  statusTd.appendChild(selo);

  const acoes = document.createElement("td");
  acoes.className = "coluna-acoes";
  const divAcoes = document.createElement("div");
  divAcoes.className = "acoes-celula";

  const aoMarcar = async (status) => {
    const resposta = await api(`/api/admin/pedidos/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (resposta.ok) carregarPedidos();
  };

  if (item.status !== "concluido" && item.status !== "cancelado") {
    const concluir = document.createElement("button");
    concluir.type = "button";
    concluir.className = "botao-acao";
    concluir.textContent = "✓ Concluir";
    concluir.addEventListener("click", () => aoMarcar("concluido"));
    divAcoes.appendChild(concluir);
  } else {
    const reabrir = document.createElement("button");
    reabrir.type = "button";
    reabrir.className = "botao-acao";
    reabrir.textContent = "↺ Reabrir";
    reabrir.addEventListener("click", () => aoMarcar("recebido"));
    divAcoes.appendChild(reabrir);
  }

  const whatsapp = document.createElement("a");
  whatsapp.className = "botao-acao whatsapp";
  whatsapp.target = "_blank";
  whatsapp.rel = "noopener";
  whatsapp.href = `https://wa.me/5518997607771?text=${encodeURIComponent(`Olá ${item.nome_cliente}, recebi seu pedido! Vamos confirmar os detalhes.`)}`;
  whatsapp.textContent = "💬 Responder";
  divAcoes.appendChild(whatsapp);

  const excluir = document.createElement("button");
  excluir.type = "button";
  excluir.className = "botao-acao perigo";
  excluir.textContent = "🗑 Excluir";
  excluir.addEventListener("click", async () => {
    if (!confirm(`Excluir o pedido de ${item.nome_cliente}?`)) return;
    const resposta = await api(`/api/admin/pedidos/${item.id}`, { method: "DELETE" });
    if (resposta.ok) carregarPedidos();
  });
  divAcoes.appendChild(excluir);

  acoes.appendChild(divAcoes);
  linha.append(cliente, itensTd, totalTd, recebido, statusTd, acoes);
  return linha;
}

async function contarNovosPedidos() {
  try {
    const resposta = await api("/api/admin/pedidos?status=recebido&limite=1");
    if (!resposta.ok) return 0;
    const dados = await resposta.json();
    return dados.total;
  } catch {
    return 0;
  }
}

document.getElementById("filtro-pedido-status").addEventListener("change", () => carregarPedidos());
document.getElementById("carregar-mais-pedidos").addEventListener("click", () => {
  paginaPedidos += 1;
  carregarPedidos(false);
});

function criarSelo(status) {
  const selo = document.createElement("span");
  selo.className = `selo ${status}`;
  selo.textContent = rotulosStatus[status] || status;
  return selo;
}

function montarAcoesOrcamento(item) {
  const div = document.createElement("div");
  div.className = "acoes-celula";

  const aoMarcar = async (status) => {
    const resposta = await api(`/api/admin/orcamentos/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (resposta.ok) carregarOrcamentos();
  };

  if (item.status !== "lido") {
    const lido = document.createElement("button");
    lido.type = "button";
    lido.className = "botao-acao";
    lido.textContent = "✓ Marcar como lido";
    lido.addEventListener("click", () => aoMarcar("lido"));
    div.appendChild(lido);
  }

  if (item.status !== "contatado") {
    const contatado = document.createElement("button");
    contatado.type = "button";
    contatado.className = "botao-acao whatsapp";
    contatado.textContent = "✉ Marcar como contatado";
    contatado.addEventListener("click", () => aoMarcar("contatado"));
    div.appendChild(contatado);
  }

  if (item.status === "arquivado") {
    const reabrir = document.createElement("button");
    reabrir.type = "button";
    reabrir.className = "botao-acao";
    reabrir.textContent = "↺ Reabrir";
    reabrir.addEventListener("click", () => aoMarcar("novo"));
    div.appendChild(reabrir);
  } else {
    const arquivar = document.createElement("button");
    arquivar.type = "button";
    arquivar.className = "botao-acao";
    arquivar.textContent = "🗂 Arquivar";
    arquivar.addEventListener("click", () => aoMarcar("arquivado"));
    div.appendChild(arquivar);
  }

  const whatsapp = document.createElement("a");
  whatsapp.className = "botao-acao whatsapp";
  whatsapp.target = "_blank";
  whatsapp.rel = "noopener";
  whatsapp.href = `https://wa.me/5518997607771?text=${encodeURIComponent(`Olá ${item.nome_cliente}, tudo bem? Vi seu pedido de orçamento pelo site!`)}`;
  whatsapp.textContent = "💬 Responder";
  div.appendChild(whatsapp);

  const excluir = document.createElement("button");
  excluir.type = "button";
  excluir.className = "botao-acao perigo";
  excluir.textContent = "🗑 Excluir";
  excluir.addEventListener("click", async () => {
    if (!confirm(`Excluir o orçamento de ${item.nome_cliente}?`)) return;
    const resposta = await api(`/api/admin/orcamentos/${item.id}`, { method: "DELETE" });
    if (resposta.ok) carregarOrcamentos();
  });
  div.appendChild(excluir);

  return div;
}

function criarLinhaOrcamento(item) {
  const linha = document.createElement("tr");

  const cliente = document.createElement("td");
  cliente.className = "celula-cliente";
  const nome = document.createElement("strong");
  nome.textContent = item.nome_cliente;
  const contato = document.createElement("span");
  contato.textContent = `📞 ${item.contato}`;
  cliente.append(nome, contato);

  const servico = document.createElement("td");
  const servicoTexto = document.createElement("span");
  servicoTexto.textContent = `${rotulosServico[item.tipo_servico] || item.tipo_servico} · ${rotulosPet[item.tipo_pet] || item.tipo_pet}`;
  servico.appendChild(servicoTexto);

  if (item.porte) {
    const porte = document.createElement("div");
    porte.className = "celula-sub";
    porte.textContent = `Porte: ${item.porte}`;
    servico.appendChild(porte);
  }
  if (item.usa_medicacao) {
    const med = document.createElement("div");
    med.className = "celula-sub";
    const detalhe = item.medicacao_detalhes ? ` (${item.medicacao_detalhes})` : "";
    med.textContent = `Medicação: ${item.usa_medicacao === "sim" ? "Sim" + detalhe : "Não"}`;
    servico.appendChild(med);
  }

  const datas = document.createElement("td");
  datas.className = "celula-datas";
  const dataTexto = document.createElement("span");
  dataTexto.textContent = `${formatarData(item.data_inicio)}${item.data_fim ? ` → ${formatarData(item.data_fim)}` : ""}`;
  datas.appendChild(dataTexto);

  const recebido = document.createElement("td");
  const recebidoTexto = document.createElement("span");
  recebidoTexto.textContent = formatarDataHora(item.criado_em);
  recebido.appendChild(recebidoTexto);

  const status = document.createElement("td");
  status.appendChild(criarSelo(item.status));

  const acoes = document.createElement("td");
  acoes.className = "coluna-acoes";
  acoes.appendChild(montarAcoesOrcamento(item));

  linha.append(cliente, servico, datas, recebido, status, acoes);

  if (item.mensagem) {
    const msg = document.createElement("td");
    msg.className = "celula-msg";
    const detalhes = document.createElement("details");
    const resumo = document.createElement("summary");
    resumo.textContent = "Ver mensagem";
    const texto = document.createElement("p");
    texto.textContent = item.mensagem;
    detalhes.append(resumo, texto);
    msg.appendChild(detalhes);
    linha.insertBefore(msg, linha.children[5]);
  }

  return linha;
}

async function carregarOrcamentos(reiniciar = true) {
  if (reiniciar) paginaAtual = 1;

  const status = document.getElementById("filtro-status").value;
  const corpo = document.getElementById("corpo-orcamentos");
  const semItens = document.getElementById("sem-orcamentos");
  const botaoMais = document.getElementById("carregar-mais");

  if (reiniciar) corpo.innerHTML = "";
  semItens.hidden = true;
  botaoMais.hidden = true;

  const rota = `/api/admin/orcamentos?pagina=${paginaAtual}&limite=${LIMITE}${status ? `&status=${status}` : ""}`;
  const resposta = await api(rota);
  if (!resposta.ok) return;

  const dados = await resposta.json();

  if (dados.itens.length > 0 || paginaAtual === 1) {
    for (const item of dados.itens) corpo.appendChild(criarLinhaOrcamento(item));
  }

  const totalMostrado = paginaAtual * LIMITE;
  botaoMais.hidden = dados.total <= totalMostrado;

  if (paginaAtual === 1) {
    const novos = status ? 0 : await contarNovos();
    const contador = document.getElementById("contador-novos");
    contador.hidden = novos === 0;
    contador.textContent = novos;
    document.getElementById("info-total").textContent = `${dados.total} orçamento(s)`;
  }
}

const LIMITE = 20;
let paginaAtual = 1;

document.getElementById("carregar-mais").addEventListener("click", () => {
  paginaAtual += 1;
  carregarOrcamentos(false);
});

async function contarNovos() {
  try {
    const resposta = await api("/api/admin/orcamentos?status=novo&limite=1");
    if (!resposta.ok) return 0;
    const dados = await resposta.json();
    return dados.total;
  } catch {
    return 0;
  }
}

document.getElementById("filtro-status").addEventListener("change", carregarOrcamentos);

function criarItemGaleria(item) {
  const div = document.createElement("div");
  div.className = "item-galeria";

  const img = document.createElement("img");
  img.src = `/uploads/${item.arquivo}`;
  img.alt = item.legenda || "Imagem da galeria";
  img.loading = "lazy";

  const corpo = document.createElement("div");
  corpo.className = "corpo";

  const legenda = document.createElement("input");
  legenda.type = "text";
  legenda.placeholder = "Legenda (opcional)";
  legenda.maxLength = 200;
  legenda.value = item.legenda || "";

  const acoes = document.createElement("div");
  acoes.className = "acoes";

  const salvarLegenda = document.createElement("button");
  salvarLegenda.type = "button";
  salvarLegenda.className = "botao-acao";
  salvarLegenda.textContent = "Salvar legenda";
  salvarLegenda.addEventListener("click", async () => {
    const resposta = await api(`/api/admin/galeria/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ legenda: legenda.value }),
    });
    if (resposta.ok) carregarGaleria();
  });

  const alternarStatus = document.createElement("button");
  alternarStatus.type = "button";
  alternarStatus.className = "botao-acao";
  alternarStatus.textContent = item.status === "publicado" ? "Ocultar" : "Publicar";
  alternarStatus.addEventListener("click", async () => {
    const novoStatus = item.status === "publicado" ? "oculto" : "publicado";
    const resposta = await api(`/api/admin/galeria/${item.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    if (resposta.ok) carregarGaleria();
  });

  const excluir = document.createElement("button");
  excluir.type = "button";
  excluir.className = "botao-acao perigo";
  excluir.textContent = "🗑 Excluir";
  excluir.addEventListener("click", async () => {
    if (!confirm("Excluir esta imagem da galeria?")) return;
    const resposta = await api(`/api/admin/galeria/${item.id}`, { method: "DELETE" });
    if (resposta.ok) carregarGaleria();
  });

  acoes.append(salvarLegenda, alternarStatus, excluir);
  corpo.append(legenda, acoes);
  div.append(img, corpo);

  return div;
}

async function carregarGaleria() {
  const lista = document.getElementById("lista-galeria");
  lista.innerHTML = '<p class="sem-itens">Carregando…</p>';

  const resposta = await api("/api/admin/galeria");
  if (!resposta.ok) return;

  const itens = await resposta.json();
  lista.innerHTML = "";

  if (itens.length === 0) {
    lista.innerHTML = '<p class="sem-itens">A galeria ainda está vazia. Envie a primeira foto!</p>';
    return;
  }

  for (const item of itens) lista.appendChild(criarItemGaleria(item));
}

document.getElementById("form-upload").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const aviso = document.getElementById("aviso-upload");
  aviso.textContent = "";
  aviso.className = "aviso";

  const arquivos = document.getElementById("imagens").files;
  if (arquivos.length === 0) {
    aviso.textContent = "Escolha pelo menos uma imagem.";
    aviso.className = "aviso erro";
    return;
  }

  const dados = new FormData();
  for (const arquivo of arquivos) dados.append("imagens", arquivo);

  const botao = evento.target.querySelector('button[type="submit"]');
  botao.disabled = true;
  botao.textContent = "Enviando…";

  const resposta = await api("/api/admin/galeria", { method: "POST", body: dados });

  const corpo = await resposta.json().catch(() => ({}));
  if (resposta.ok) {
    aviso.textContent = corpo.mensagem || "Imagens enviadas!";
    aviso.className = "aviso ok";
    document.getElementById("imagens").value = "";
    carregarGaleria();
  } else {
    aviso.textContent = corpo.erro || "Falha no upload";
    aviso.className = "aviso erro";
  }

  botao.disabled = false;
  botao.textContent = "Enviar para a galeria";
});

/* ---------- Depoimentos ---------- */
const formDepoimento = document.getElementById("form-depoimento");
const avisoDepoimento = document.getElementById("aviso-depoimento");
let depoimentoEditandoId = null;
let previewDepoimentoUrl = null;

function limparPreviewDepoimento() {
  const preview = document.getElementById("depoimento-preview");
  const img = document.getElementById("depoimento-preview-img");
  if (previewDepoimentoUrl) URL.revokeObjectURL(previewDepoimentoUrl);
  previewDepoimentoUrl = null;
  preview.hidden = true;
  img.removeAttribute("src");
}

function mostrarPreviewArquivoDepoimento(arquivo) {
  const preview = document.getElementById("depoimento-preview");
  const img = document.getElementById("depoimento-preview-img");
  if (previewDepoimentoUrl) URL.revokeObjectURL(previewDepoimentoUrl);
  previewDepoimentoUrl = URL.createObjectURL(arquivo);
  img.src = previewDepoimentoUrl;
  preview.hidden = false;
}

function mostrarPreviewUrlDepoimento(src) {
  const preview = document.getElementById("depoimento-preview");
  const img = document.getElementById("depoimento-preview-img");
  img.src = src;
  preview.hidden = false;
}

function resetarFormularioDepoimento() {
  formDepoimento.reset();
  depoimentoEditandoId = null;
  limparPreviewDepoimento();
  document.getElementById("depoimento-remover-wrap").hidden = true;
  document.getElementById("depoimento-cancelar").hidden = true;
  document.querySelector("#form-depoimento button[type='submit']").textContent = "Cadastrar depoimento";
}

document.getElementById("depoimento-imagem").addEventListener("change", (e) => {
  const arquivo = e.target.files[0];
  if (arquivo) {
    mostrarPreviewArquivoDepoimento(arquivo);
    document.getElementById("depoimento-remover-imagem").checked = false;
  }
});

document.getElementById("depoimento-remover-imagem").addEventListener("change", (e) => {
  if (e.target.checked) {
    document.getElementById("depoimento-imagem").value = "";
    limparPreviewDepoimento();
  }
});

document.getElementById("depoimento-cancelar").addEventListener("click", () => {
  resetarFormularioDepoimento();
  avisoDepoimento.textContent = "";
  avisoDepoimento.className = "aviso";
});

formDepoimento.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  avisoDepoimento.textContent = "";
  avisoDepoimento.className = "aviso";

  const texto = document.getElementById("depoimento-texto").value.trim();
  const arquivo = document.getElementById("depoimento-imagem").files[0];
  if (!texto && !arquivo) {
    avisoDepoimento.textContent = "Informe um texto ou envie um print.";
    avisoDepoimento.className = "aviso erro";
    return;
  }

  const form = new FormData();
  form.append("autor", document.getElementById("depoimento-autor").value.trim());
  form.append("texto", texto);
  form.append("ativo", document.getElementById("depoimento-ativo").checked ? "sim" : "nao");
  const avaliacao = document.getElementById("depoimento-avaliacao").value;
  if (arquivo) form.append("imagem", arquivo);

  const botao = formDepoimento.querySelector('button[type="submit"]');
  botao.disabled = true;

  try {
    if (depoimentoEditandoId) {
      const remover = document.getElementById("depoimento-remover-imagem");
      if (remover.checked) form.append("remover_imagem", "1");
      if (avaliacao) form.append("avaliacao", avaliacao);
      else form.append("remover_avaliacao", "1");
      const resposta = await api(`/api/admin/depoimentos/${depoimentoEditandoId}`, { method: "PATCH", body: form });
      if (resposta.ok) {
        resetarFormularioDepoimento();
        carregarDepoimentos();
      } else {
        avisoDepoimento.textContent = "Não foi possível atualizar.";
        avisoDepoimento.className = "aviso erro";
      }
    } else {
      if (avaliacao) form.append("avaliacao", avaliacao);
      const resposta = await api("/api/admin/depoimentos", { method: "POST", body: form });
      if (resposta.ok) {
        resetarFormularioDepoimento();
        carregarDepoimentos();
      } else {
        avisoDepoimento.textContent = "Não foi possível cadastrar.";
        avisoDepoimento.className = "aviso erro";
      }
    }
  } catch {
    avisoDepoimento.textContent = "Falha de conexão. Tente novamente.";
    avisoDepoimento.className = "aviso erro";
  } finally {
    botao.disabled = false;
  }
});

async function carregarDepoimentos() {
  const lista = document.getElementById("lista-depoimentos");
  if (!lista) return;
  try {
    const resposta = await api("/api/admin/depoimentos");
    if (!resposta.ok) return;
    const dados = await resposta.json();
    lista.innerHTML = "";
    if (!dados.length) {
      lista.innerHTML = '<p class="sem-itens">Nenhum depoimento por aqui. 🎉</p>';
      return;
    }
    for (const item of dados) lista.appendChild(criarItemDepoimento(item));
  } catch {}
}

function criarItemDepoimento(item) {
  const div = document.createElement("div");
  div.className = "item-galeria";

  if (item.arquivo) {
    const figura = document.createElement("div");
    figura.className = "item-figura";
    const img = document.createElement("img");
    img.src = "/uploads/" + item.arquivo;
    img.alt = item.autor ? "Depoimento de " + item.autor : "Print de depoimento";
    figura.appendChild(img);
    div.appendChild(figura);
  } else {
    const figura = document.createElement("div");
    figura.className = "item-figura produto-sem-foto";
    figura.textContent = "💬";
    div.appendChild(figura);
  }

  const info = document.createElement("div");
  info.className = "item-info";

  const titulo = document.createElement("strong");
  titulo.textContent = item.autor || "Depoimento";
  info.appendChild(titulo);

  if (item.texto) {
    const trecho = document.createElement("p");
    trecho.className = "item-trecho";
    trecho.textContent = item.texto;
    info.appendChild(trecho);
  }

  if (item.avaliacao) {
    const estrelas = document.createElement("span");
    estrelas.className = "item-estrelas";
    estrelas.textContent = "★".repeat(item.avaliacao) + "☆".repeat(5 - item.avaliacao);
    info.appendChild(estrelas);
  }

  const estado = document.createElement("span");
  estado.className = "chip " + (item.ativo === "sim" ? "chip-salvia" : "chip-status");
  estado.textContent = item.ativo === "sim" ? "Ativo" : "Inativo";
  info.appendChild(estado);

  div.appendChild(info);

  const acoes = document.createElement("div");
  acoes.className = "item-acoes";

  const ativar = document.createElement("button");
  ativar.type = "button";
  ativar.className = "botao-acao";
  ativar.textContent = item.ativo === "sim" ? "Desativar" : "Ativar";
  ativar.addEventListener("click", async () => {
    const resposta = await api(`/api/admin/depoimentos/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: item.ativo === "sim" ? "nao" : "sim" }),
    });
    if (resposta.ok) carregarDepoimentos();
  });
  acoes.appendChild(ativar);

  const editar = document.createElement("button");
  editar.type = "button";
  editar.className = "botao-acao";
  editar.textContent = "Editar";
  editar.addEventListener("click", () => {
    depoimentoEditandoId = item.id;
    document.getElementById("depoimento-autor").value = item.autor || "";
    document.getElementById("depoimento-texto").value = item.texto || "";
    document.getElementById("depoimento-avaliacao").value = item.avaliacao ? String(item.avaliacao) : "";
    document.getElementById("depoimento-ativo").checked = item.ativo === "sim";
    document.getElementById("depoimento-imagem").value = "";
    const removerWrap = document.getElementById("depoimento-remover-wrap");
    const remover = document.getElementById("depoimento-remover-imagem");
    remover.checked = false;
    removerWrap.hidden = !item.arquivo;
    document.getElementById("depoimento-cancelar").hidden = false;
    if (item.arquivo) mostrarPreviewUrlDepoimento(`/uploads/${item.arquivo}`);
    else limparPreviewDepoimento();
    document.querySelector("#form-depoimento button[type='submit']").textContent = "Salvar alterações";
    formDepoimento.scrollIntoView({ behavior: "smooth" });
  });
  acoes.appendChild(editar);

  const excluir = document.createElement("button");
  excluir.type = "button";
  excluir.className = "botao-acao perigo";
  excluir.textContent = "🗑 Excluir";
  excluir.addEventListener("click", async () => {
    if (!confirm(`Excluir o depoimento de "${item.autor || "este cliente"}"?`)) return;
    const resposta = await api(`/api/admin/depoimentos/${item.id}`, { method: "DELETE" });
    if (resposta.ok) carregarDepoimentos();
  });
  acoes.appendChild(excluir);

  div.appendChild(acoes);
  return div;
}

mostrarLogin();