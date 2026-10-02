const WHATSAPP_NUMERO = "5518997607771";

const GALERIA_ESTATICA = [
  { arquivo: "img/amanda-hero.jpg", legenda: "Cuidado com carinho em cada visita." },
  { arquivo: "img/amanda-sobre.jpg", legenda: "Amanda Pet Sitter em Birigui e Araçatuba." },
];

const PRODUTOS_ESTATICOS = [
  {
    id: "casinha-cachorro",
    nome: "Casinha para cachorro grande N5",
    descricao: "Tamanho para raça média. Feita de polipropileno impermeável, protege contra chuva em áreas externas e internas.",
    preco_centavos: 10990,
    arquivo: "img/produtos/casinha-cachorro.jpg",
    estoque: null,
  },
  {
    id: "casa-gato-arranhador",
    nome: "Casa de gato com rampa e arranhador",
    descricao: "Estrutura em MDF com carpete, com 30 cm de altura, 36 cm de largura e 47 cm de comprimento.",
    preco_centavos: 7990,
    arquivo: "img/produtos/casa-gato-arranhador.jpg",
    estoque: null,
  },
  {
    id: "caixa-transporte",
    nome: "Caixa de transporte para cães e gatos",
    descricao: "Com ventilação, suporta até 5 kg e mede 31 cm de largura por 44 cm de comprimento.",
    preco_centavos: 9990,
    arquivo: "img/produtos/caixa-transporte.jpg",
    estoque: null,
  },
  {
    id: "bolinha-interativa",
    nome: "Bolinha interativa inteligente recarregável",
    descricao: "Brinquedo em plástico para gatos e cachorros, ideal para estimular a diversão do pet.",
    preco_centavos: 7990,
    arquivo: "img/produtos/bolinha-interativa.jpg",
    estoque: null,
  },
];

const LIMITE_ITENS_POR_PRODUTO = 50;
const PRODUTOS_POR_ID = new Map(PRODUTOS_ESTATICOS.map((produto) => [produto.id, produto]));

function normalizarCarrinho(valor) {
  const carrinhoNormalizado = {};
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) return carrinhoNormalizado;

  for (const [id, item] of Object.entries(valor)) {
    const produto = PRODUTOS_POR_ID.get(id);
    const quantidade = Number(item?.quantidade);
    if (!produto || !Number.isFinite(quantidade)) continue;

    const quantidadeSegura = Math.min(LIMITE_ITENS_POR_PRODUTO, Math.floor(quantidade));
    if (quantidadeSegura < 1) continue;

    carrinhoNormalizado[id] = {
      id: produto.id,
      nome: produto.nome,
      preco_centavos: produto.preco_centavos,
      arquivo: produto.arquivo,
      quantidade: quantidadeSegura,
    };
  }

  return carrinhoNormalizado;
}

const menuBotao = document.getElementById("menu-botao");
const menuNavegacao = document.getElementById("menu-navegacao");
const menuOverlay = document.getElementById("menu-overlay");
const ehMobile = () => window.matchMedia("(max-width: 900px)").matches;

function abrirMenu() {
  menuNavegacao.classList.add("aberto");
  menuBotao.classList.add("aberto");
  menuBotao.setAttribute("aria-expanded", "true");
  if (menuOverlay) menuOverlay.hidden = false;
  menuNavegacao.inert = false;
}

function fecharMenu() {
  menuNavegacao.classList.remove("aberto");
  menuBotao.classList.remove("aberto");
  menuBotao.setAttribute("aria-expanded", "false");
  if (menuOverlay) menuOverlay.hidden = true;
  if (ehMobile()) menuNavegacao.inert = true;
}

menuBotao.addEventListener("click", () => {
  if (menuNavegacao.classList.contains("aberto")) fecharMenu();
  else abrirMenu();
});

if (menuOverlay) {
  menuOverlay.addEventListener("click", fecharMenu);
}

menuNavegacao.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", fecharMenu);
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && menuNavegacao.classList.contains("aberto")) fecharMenu();
});

window.addEventListener("resize", () => {
  if (!ehMobile()) menuNavegacao.inert = false;
});

if (ehMobile()) menuNavegacao.inert = true;

async function carregarGaleria() {
  const grade = document.getElementById("grade-galeria");
  grade.replaceChildren();
  const figuras = GALERIA_ESTATICA.map((img) => {
      const figura = document.createElement("figure");
      figura.className = "galeria-item";
      figura.tabIndex = 0;
      figura.setAttribute("role", "button");
      figura.setAttribute("aria-label", img.legenda || "Foto da galeria");

      const figuraImg = document.createElement("img");
       figuraImg.src = img.arquivo;
      figuraImg.alt = img.legenda || "Pet de cliente da Amanda em Birigui ou Araçatuba-SP";
      figuraImg.loading = "lazy";

      figura.appendChild(figuraImg);

      if (img.legenda) {
        const legenda = document.createElement("figcaption");
        legenda.className = "legenda";
        legenda.textContent = img.legenda;
        figura.appendChild(legenda);
      }

      return figura;
    });

  grade.append(...figuras);
  if (figuras.length > 1) iniciarLightbox(figuras);
}

function iniciarLightbox(figuras) {
  const abrir = (indice) => {
    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const img = document.createElement("img");
    const atualizar = () => {
      const figuraAtual = figuras[indice];
      const fonte = figuraAtual.querySelector("img");
      img.src = fonte.src;
      img.alt = fonte.alt;
    };
    atualizar();

    const fechar = document.createElement("button");
    fechar.className = "lightbox-fechar";
    fechar.textContent = "✕";
    fechar.setAttribute("aria-label", "Fechar galeria");

    const fecharLightbox = () => {
      document.removeEventListener("keydown", navegarTeclado);
      overlay.remove();
    };

    const anterior = () => {
      indice = (indice - 1 + figuras.length) % figuras.length;
      atualizar();
    };

    const proximo = () => {
      indice = (indice + 1) % figuras.length;
      atualizar();
    };

    const navegarTeclado = (evento) => {
      if (evento.key === "Escape") fecharLightbox();
      if (evento.key === "ArrowLeft") anterior();
      if (evento.key === "ArrowRight") proximo();
    };

    fechar.addEventListener("click", fecharLightbox);
    overlay.addEventListener("click", (evento) => {
      if (evento.target === overlay) fecharLightbox();
    });
    document.addEventListener("keydown", navegarTeclado);

    overlay.append(img, fechar);
    document.body.appendChild(overlay);
    fechar.focus();
  };

  figuras.forEach((figura, indice) => {
    figura.addEventListener("click", () => abrir(indice));
    figura.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        abrir(indice);
      }
    });
  });
}

function formatarData(iso) {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function montarMensagemWhatsApp(dados) {
  const linhas = [
    "Olá Amanda! Gostaria de fazer um orçamento:",
    "",
    `👤 Nome: ${dados.nome_cliente}`,
    `📞 Contato: ${dados.contato}`,
    `🐾 Pet: ${dados.tipo_pet}`,
    `💊 Medicação: ${dados.usa_medicacao === "sim" ? "Sim" + (dados.medicacao_detalhes ? ` (${dados.medicacao_detalhes})` : "") : "Não"}`,
    `🛠️ Serviço: ${dados.tipo_servico}`,
    `📅 De: ${formatarData(dados.data_inicio)}`,
  ];

  if (dados.porte) linhas.splice(5, 0, `📏 Porte: ${dados.porte}`);
  if (dados.data_fim) linhas.push(`📅 Até: ${formatarData(dados.data_fim)}`);
  if (dados.mensagem) linhas.push("", `💬 ${dados.mensagem}`);

  return linhas.join("\n");
}

function validarCampos() {
  let valido = true;
  const campos = {
    nome_cliente: true,
    contato: true,
    data_inicio: true,
  };

  for (const [id] of Object.entries(campos)) {
    const input = document.getElementById(id);
    const campo = input.closest(".campo");
    const valor = input.value.trim();
    const erro = (input.type === "date" && !valor) ||
      (input.type !== "date" && (!valor || valor.length < 2));
    campo.classList.toggle("erro", erro);
    input.setAttribute("aria-invalid", erro);
    if (erro) valido = false;
  }

  return valido;
}

function limparErros() {
  document.querySelectorAll(".campo.erro").forEach((campo) => {
    campo.classList.remove("erro");
    const input = campo.querySelector("input, select, textarea");
    if (input) input.removeAttribute("aria-invalid");
  });
}

function confirmarDatas(mostrarErro = true) {
  const dataInicio = document.getElementById("data_inicio");
  const dataFim = document.getElementById("data_fim");
  const hoje = dataLocalHoje();
  dataInicio.min = hoje;
  dataFim.min = dataInicio.value > hoje ? dataInicio.value : hoje;

  const inicioInvalido = !dataInicio.value || dataInicio.value < hoje;
  const fimInvalido = Boolean(dataFim.value && dataFim.value < dataFim.min);
  for (const [input, invalido] of [[dataInicio, inicioInvalido], [dataFim, fimInvalido]]) {
    input.closest(".campo").classList.toggle("erro", mostrarErro && invalido);
    input.setAttribute("aria-invalid", String(mostrarErro && invalido));
  }
  return !inicioInvalido && !fimInvalido;
}

function dataLocalHoje() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
}

function iniciarFormulario() {
  const form = document.getElementById("form-orcamento");
  const aviso = document.getElementById("aviso-form");
  const sucesso = document.getElementById("sucesso-orcamento");
  const linkWhatsApp = document.getElementById("link-whatsapp");
  const resumo = document.getElementById("resumo-orcamento");
  const dataInicio = document.getElementById("data_inicio");
  const dataFim = document.getElementById("data_fim");

  dataInicio.addEventListener("change", () => confirmarDatas());
  dataFim.addEventListener("change", () => confirmarDatas());
  confirmarDatas(false);

  const tipoPet = document.getElementById("tipo_pet");
  const porte = document.getElementById("porte");
  const campoPorte = document.getElementById("campo-porte");
  const alternarPorte = () => {
    const cachorro = tipoPet.value === "cachorro";
    campoPorte.hidden = !cachorro;
    porte.disabled = !cachorro;
    if (!cachorro) porte.value = "";
    else if (!porte.value) porte.value = "Pequeno";
  };
  tipoPet.addEventListener("change", alternarPorte);
  alternarPorte();

  const selectMed = document.getElementById("usa_medicacao");
  const campoDetalhes = document.getElementById("campo-medicacao-detalhes");
  const alternarDetalhes = () => {
    campoDetalhes.hidden = selectMed.value !== "sim";
    if (selectMed.value !== "sim") document.getElementById("medicacao_detalhes").value = "";
  };
  selectMed.addEventListener("change", alternarDetalhes);
  alternarDetalhes();

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    aviso.textContent = "";
    aviso.className = "aviso";
    limparErros();
    const camposValidos = validarCampos();
    const datasValidas = confirmarDatas();
    if (!camposValidos || !datasValidas) {
      aviso.textContent = "Confira os campos destacados.";
      aviso.className = "aviso erro";
      return;
    }

    const dados = {
      nome_cliente: document.getElementById("nome_cliente").value.trim(),
      contato: document.getElementById("contato").value.trim(),
      tipo_pet: document.getElementById("tipo_pet").value,
      tipo_servico: document.getElementById("tipo_servico").value,
      porte: porte.disabled ? "" : porte.value,
      usa_medicacao: document.getElementById("usa_medicacao").value,
      medicacao_detalhes: document.getElementById("medicacao_detalhes").value.trim(),
      data_inicio: dataInicio.value,
      data_fim: dataFim.value || null,
      mensagem: document.getElementById("mensagem").value.trim(),
      website: document.getElementById("website").value,
    };

    linkWhatsApp.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(montarMensagemWhatsApp(dados))}`;
    window.open(linkWhatsApp.href, "_blank", "noopener");

    resumo.replaceChildren();
    const linhasResumo = [
      `👤 ${dados.nome_cliente}`,
      `📞 ${dados.contato}`,
      `🐾 ${dados.tipo_pet} · ${dados.tipo_servico}`,
      `💊 Medicação: ${dados.usa_medicacao === "sim" ? "Sim" + (dados.medicacao_detalhes ? ` (${dados.medicacao_detalhes})` : "") : "Não"}`,
      `📅 ${formatarData(dados.data_inicio)}${dados.data_fim ? ` → ${formatarData(dados.data_fim)}` : ""}`,
    ];
    if (dados.porte) linhasResumo.splice(3, 0, `📏 Porte: ${dados.porte}`);
    for (const linha of linhasResumo) {
      const li = document.createElement("li");
      li.textContent = linha;
      resumo.appendChild(li);
    }

    form.hidden = true;
    sucesso.hidden = false;
  });

  document.getElementById("novo-orcamento").addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    sucesso.hidden = true;
    limparErros();
    alternarPorte();
    alternarDetalhes();
    confirmarDatas(false);
  });
}

function formatarPreco(cents) {
  return "R$ " + (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function montarMensagemPedido(dados) {
  const linhas = [
    "Olá Amanda! Gostaria de fazer um pedido:",
    "",
  ];
  for (const item of dados.itens) {
    linhas.push(`• ${item.quantidade}x ${item.nome}`);
    linhas.push(`  Unitário: ${formatarPreco(item.preco_centavos)} · Subtotal: ${formatarPreco(item.preco_centavos * item.quantidade)}`);
  }
  linhas.push("", `💰 Total: ${formatarPreco(dados.total_centavos)}`);
  linhas.push(`👤 Nome: ${dados.nome_cliente}`);
  linhas.push(`📞 Contato: ${dados.contato}`);
  if (dados.observacoes) linhas.push(`💬 ${dados.observacoes}`);
  return linhas.join("\n");
}

const carrinho = (function () {
  try {
     const salvo = localStorage.getItem("carrinho_amanda");
     if (salvo) {
       const obj = JSON.parse(salvo);
       return normalizarCarrinho(obj);
    }
  } catch {}
  return {};
})();

function salvarCarrinhoLocal() {
  try {
    localStorage.setItem("carrinho_amanda", JSON.stringify(carrinho));
  } catch {}
}

function adicionarAoCarrinho(produto, qtd) {
  if (carrinho[produto.id]) {
    carrinho[produto.id].quantidade = Math.min(
      LIMITE_ITENS_POR_PRODUTO,
      carrinho[produto.id].quantidade + qtd,
    );
  } else {
    carrinho[produto.id] = {
      id: produto.id,
      nome: produto.nome,
      preco_centavos: produto.preco_centavos,
      arquivo: produto.arquivo,
      quantidade: qtd,
    };
  }
  if (carrinho[produto.id].quantidade <= 0) delete carrinho[produto.id];
  renderCarrinho();
  salvarCarrinhoLocal();
}

function totalCarrinho() {
  return Object.values(carrinho).reduce((soma, i) => soma + i.preco_centavos * i.quantidade, 0);
}

function renderCarrinho() {
  const contador = document.getElementById("carrinho-contador");
  const itensEl = document.getElementById("carrinho-itens");
  const vazioEl = document.getElementById("carrinho-vazio");
  const totalEl = document.getElementById("carrinho-total");
  const form = document.getElementById("form-pedido");
  document.getElementById("sucesso-pedido").hidden = true;

  const itens = Object.values(carrinho);
  const quantidadeTotal = itens.reduce((s, i) => s + i.quantidade, 0);

  if (quantidadeTotal > 0) {
    contador.hidden = false;
    contador.textContent = String(quantidadeTotal);
  } else {
    contador.hidden = true;
  }

  itensEl.replaceChildren();
  vazioEl.hidden = itens.length > 0;
  form.hidden = itens.length === 0;
  totalEl.textContent = formatarPreco(totalCarrinho());

  for (const item of itens) {
    const linha = document.createElement("div");
    linha.className = "item-carrinho";

    const img = document.createElement("img");
    img.src = item.arquivo || "img/amanda-hero.jpg";
    img.alt = item.nome;

    const info = document.createElement("div");
    info.className = "item-info";
    const nome = document.createElement("div");
    nome.className = "item-nome";
    nome.textContent = item.nome;
    const preco = document.createElement("div");
    preco.className = "item-preco";
    preco.textContent = `${item.quantidade}x ${formatarPreco(item.preco_centavos)}`;
    info.append(nome, preco);

    const stepper = document.createElement("div");
    stepper.className = "stepper";
    const menos = document.createElement("button");
    menos.type = "button";
    menos.textContent = "−";
    menos.addEventListener("click", () => adicionarAoCarrinho(item, -1));
    const valor = document.createElement("span");
    valor.className = "stepper-valor";
    valor.textContent = String(item.quantidade);
    const mais = document.createElement("button");
    mais.type = "button";
    mais.textContent = "+";
    mais.addEventListener("click", () => adicionarAoCarrinho(item, 1));
    stepper.append(menos, valor, mais);

    const remover = document.createElement("button");
    remover.type = "button";
    remover.className = "item-remover";
    remover.setAttribute("aria-label", `Remover ${item.nome}`);
    remover.textContent = "🗑";
    remover.addEventListener("click", () => {
      delete carrinho[item.id];
      renderCarrinho();
      salvarCarrinhoLocal();
    });

    linha.append(img, info, stepper, remover);
    itensEl.appendChild(linha);
  }
}

function abrirCarrinho() {
  document.getElementById("carrinho").hidden = false;
  document.getElementById("carrinho-overlay").hidden = false;
}

function fecharCarrinho() {
  document.getElementById("carrinho").hidden = true;
  document.getElementById("carrinho-overlay").hidden = true;
}

function carregarLoja() {
  const grade = document.getElementById("grade-loja");
  grade.replaceChildren();
  for (const produto of PRODUTOS_ESTATICOS) {
        const card = document.createElement("article");
        card.className = "produto-card";

        const foto = document.createElement("div");
        foto.className = "produto-foto";
        if (produto.arquivo) {
          const img = document.createElement("img");
           img.src = produto.arquivo;
          img.alt = produto.nome;
          img.loading = "lazy";
          foto.appendChild(img);
        } else {
          const semFoto = document.createElement("div");
          semFoto.className = "produto-sem-foto";
          semFoto.textContent = "🐾";
          foto.appendChild(semFoto);
        }

        const corpo = document.createElement("div");
        corpo.className = "produto-corpo";

        const titulo = document.createElement("h3");
        titulo.textContent = produto.nome;

        const desc = document.createElement("p");
        desc.className = "produto-desc";
        desc.textContent = produto.descricao || "";

        const preco = document.createElement("div");
        preco.className = "produto-preco";
        preco.textContent = formatarPreco(produto.preco_centavos);

        const estoqueEl = document.createElement("span");
        if (produto.estoque === null) {
          estoqueEl.className = "produto-estoque";
          estoqueEl.textContent = "Disponível";
        } else if (produto.estoque === 0) {
          estoqueEl.className = "produto-estoque esgotado";
          estoqueEl.textContent = "Esgotado";
        } else {
          estoqueEl.className = "produto-estoque";
          estoqueEl.textContent = `${produto.estoque} em estoque`;
        }

        const acoes = document.createElement("div");
        acoes.className = "produto-acoes";

        const stepper = document.createElement("div");
        stepper.className = "stepper";
        const menos = document.createElement("button");
        menos.type = "button";
        menos.textContent = "−";
        const valor = document.createElement("span");
        valor.className = "stepper-valor";
        valor.textContent = "1";
        const mais = document.createElement("button");
        mais.type = "button";
        mais.textContent = "+";
        stepper.append(menos, valor, mais);

        const adicionar = document.createElement("button");
        adicionar.type = "button";
        adicionar.className = "btn btn-primario btn-adicionar";
        adicionar.textContent = "Adicionar";

        if (produto.estoque === 0) {
          adicionar.disabled = true;
          adicionar.textContent = "Esgotado";
        }

        let qtd = 1;
         menos.addEventListener("click", () => {
           if (qtd > 1) { qtd -= 1; valor.textContent = String(qtd); }
         });
         mais.addEventListener("click", () => {
           if (qtd < LIMITE_ITENS_POR_PRODUTO) {
             qtd += 1;
             valor.textContent = String(qtd);
           }
         });
        adicionar.addEventListener("click", () => {
          adicionarAoCarrinho(produto, qtd);
          abrirCarrinho();
        });

        acoes.append(stepper, adicionar);
        corpo.append(titulo, desc, preco, estoqueEl, acoes);
        card.append(foto, corpo);
        grade.appendChild(card);
  }
}

function iniciarCarrinho() {
  renderCarrinho();
  document.getElementById("abrir-carrinho").addEventListener("click", abrirCarrinho);
  document.getElementById("fechar-carrinho").addEventListener("click", fecharCarrinho);
  document.getElementById("carrinho-overlay").addEventListener("click", fecharCarrinho);

  const formPedido = document.getElementById("form-pedido");
  formPedido.addEventListener("input", () => {
    document.getElementById("sucesso-pedido").hidden = true;
  });

  formPedido.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const aviso = document.getElementById("aviso-pedido");
    aviso.textContent = "";
    aviso.className = "aviso";

    const nome = document.getElementById("pedido-nome").value.trim();
    const contato = document.getElementById("pedido-contato").value.trim();
    const obs = document.getElementById("pedido-obs").value.trim();

    if (nome.length < 2) {
      aviso.textContent = "Informe seu nome.";
      aviso.className = "aviso erro";
      return;
    }
    if (contato.length < 5) {
      aviso.textContent = "Informe um contato (WhatsApp ou e-mail).";
      aviso.className = "aviso erro";
      return;
    }

    if (Object.keys(carrinho).length === 0) {
      aviso.textContent = "Seu carrinho está vazio.";
      aviso.className = "aviso erro";
      return;
    }

    const dadosWhatsApp = {
      itens: Object.values(carrinho).map((i) => ({ nome: i.nome, quantidade: i.quantidade, preco_centavos: i.preco_centavos })),
      total_centavos: totalCarrinho(),
      nome_cliente: nome,
      contato,
      observacoes: obs,
    };
    const urlWhatsApp = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(montarMensagemPedido(dadosWhatsApp))}`;
    document.getElementById("link-pedido-whatsapp").href = urlWhatsApp;
    window.open(urlWhatsApp, "_blank", "noopener");
    document.getElementById("sucesso-pedido").hidden = false;
  });

  document.getElementById("fechar-sucesso-pedido").addEventListener("click", () => {
    document.getElementById("sucesso-pedido").hidden = true;
  });

  document.getElementById("limpar-pedido").addEventListener("click", () => {
    for (const chave of Object.keys(carrinho)) delete carrinho[chave];
    renderCarrinho();
    salvarCarrinhoLocal();
    formPedido.reset();
  });
}

carregarGaleria();
iniciarFormulario();
carregarLoja();
iniciarCarrinho();

function iniciarAnimacoes() {
  const elementos = document.querySelectorAll(".secao, .hero-conteudo > *, .card, .produto-card, .galeria-item, .faixa-diferenciais > *");
  if (!("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("visivel"));
    return;
  }

  elementos.forEach((elemento, indice) => {
    elemento.classList.add("revelar");
    elemento.style.setProperty("--atraso-revelar", `${Math.min(indice % 5, 4) * 70}ms`);
  });

  const observador = new IntersectionObserver((entradas, observer) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("visivel");
      observer.unobserve(entrada.target);
    });
  }, { rootMargin: "0px 0px -8%" });
  elementos.forEach((elemento) => observador.observe(elemento));
}

iniciarAnimacoes();
