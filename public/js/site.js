const WHATSAPP_NUMERO = "5518997607771";
const traduzir = (texto) => window.traduzirSite ? window.traduzirSite(texto) : texto;

const GALERIA_ESTATICA = [
  { arquivo: "img/amanda-hero.jpg", legenda: "Cuidado com carinho em cada visita." },
  { arquivo: "img/amanda-sobre.jpg", legenda: "Amanda Pet Sitter em Birigui e Araçatuba." },
  { arquivo: "img/galeria/galeria-02.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-03.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-04.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-05.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-06.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-07.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-08.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-09.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-10.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-11.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-12.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-13.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-14.jpeg", legenda: "Momentos de carinho e cuidado." },
  { arquivo: "img/galeria/galeria-15.jpeg", legenda: "Momentos de carinho e cuidado." },
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

const cabecalho = document.querySelector(".cabecalho");
if (cabecalho) {
  const atualizarCabecalho = () => cabecalho.classList.toggle("scrolled", window.scrollY > 12);
  atualizarCabecalho();
  window.addEventListener("scroll", atualizarCabecalho, { passive: true });
}

document.querySelectorAll(".btn").forEach((botao) => {
  botao.addEventListener("pointermove", (evento) => {
    const caixa = botao.getBoundingClientRect();
    botao.style.setProperty("--brilho-x", `${evento.clientX - caixa.left}px`);
    botao.style.setProperty("--brilho-y", `${evento.clientY - caixa.top}px`);
  });

  botao.addEventListener("click", (evento) => {
    const caixa = botao.getBoundingClientRect();
    botao.style.setProperty("--clique-x", `${evento.clientX - caixa.left}px`);
    botao.style.setProperty("--clique-y", `${evento.clientY - caixa.top}px`);
    botao.classList.remove("ripple");
    void botao.offsetWidth;
    botao.classList.add("ripple");
    window.setTimeout(() => botao.classList.remove("ripple"), 600);
  });
});

async function carregarGaleria() {
  const grade = document.getElementById("grade-galeria");
  grade.replaceChildren();
  const figuras = GALERIA_ESTATICA.map((img) => {
      const figura = document.createElement("figure");
      figura.className = "galeria-item";
      figura.tabIndex = 0;
      figura.setAttribute("role", "button");
       figura.setAttribute("aria-label", traduzir(img.legenda || "Foto da galeria"));

      const figuraImg = document.createElement("img");
       figuraImg.src = img.arquivo;
       figuraImg.alt = traduzir(img.legenda || "Pet de cliente da Amanda em Birigui ou Araçatuba-SP");
      figuraImg.loading = "lazy";

      figura.appendChild(figuraImg);

      if (img.legenda) {
        const legenda = document.createElement("figcaption");
        legenda.className = "legenda";
         legenda.textContent = traduzir(img.legenda);
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
    fechar.setAttribute("aria-label", traduzir("Fechar galeria"));

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
  const idioma = window.idiomaSite ? window.idiomaSite() : "pt";
  const textos = idioma === "en"
    ? { intro: "Hello Amanda! I would like to request a quote:", name: "Name", contact: "Contact", pet: "Pet", size: "Size", medication: "Medication", service: "Service", from: "From", until: "Until" }
    : idioma === "es"
      ? { intro: "¡Hola Amanda! Me gustaría pedir un presupuesto:", name: "Nombre", contact: "Contacto", pet: "Mascota", size: "Tamaño", medication: "Medicamentos", service: "Servicio", from: "Desde", until: "Hasta" }
      : { intro: "Olá Amanda! Gostaria de fazer um orçamento:", name: "Nome", contact: "Contato", pet: "Pet", size: "Porte", medication: "Medicação", service: "Serviço", from: "De", until: "Até" };
  const pet = { cachorro: idioma === "en" ? "Dog" : idioma === "es" ? "Perro" : "Cachorro", gato: idioma === "en" ? "Cat" : idioma === "es" ? "Gato" : "Gato", outro: idioma === "en" ? "Other" : idioma === "es" ? "Otro" : "Outro" }[dados.tipo_pet] || dados.tipo_pet;
  const servico = { visita: idioma === "en" ? "In-home visit" : idioma === "es" ? "Visita a domicilio" : "Visita em domicílio", hospedagem: idioma === "en" ? "Boarding" : idioma === "es" ? "Hospedaje" : "Hospedagem", passeio: idioma === "en" ? "Dog walk" : idioma === "es" ? "Paseo" : "Passeio" }[dados.tipo_servico] || dados.tipo_servico;
  const porte = { Pequeno: idioma === "en" ? "Small" : idioma === "es" ? "Pequeño" : "Pequeno", Grande: idioma === "en" ? "Large" : idioma === "es" ? "Grande" : "Grande" }[dados.porte] || dados.porte;
  const linhas = [
    textos.intro,
    "",
    `👤 ${textos.name}: ${dados.nome_cliente}`,
    `📞 ${textos.contact}: ${dados.contato}`,
    `🐾 ${textos.pet}: ${pet}`,
    `📏 ${textos.size}: ${porte || "-"}`,
    `💊 ${textos.medication}: ${dados.usa_medicacao === "sim" ? (idioma === "en" ? "Yes" : idioma === "es" ? "Sí" : "Sim") + (dados.medicacao_detalhes ? ` (${dados.medicacao_detalhes})` : "") : (idioma === "en" ? "No" : idioma === "es" ? "No" : "Não")}`,
    `🛠️ ${textos.service}: ${servico}`,
    `📅 ${textos.from}: ${formatarData(dados.data_inicio)}`,
  ];

  if (dados.data_fim) linhas.push(`📅 ${textos.until}: ${formatarData(dados.data_fim)}`);
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

function confirmarDatas() {
  const inicio = document.getElementById("data_inicio").value;
  const fim = document.getElementById("data_fim").value;
  const campoFim = document.getElementById("data_fim").closest(".campo");
  const invalido = Boolean(fim && inicio && fim < inicio);
  campoFim.classList.toggle("erro", invalido);
  return !invalido;
}

function iniciarFormulario() {
  const form = document.getElementById("form-orcamento");
  const aviso = document.getElementById("aviso-form");
  const sucesso = document.getElementById("sucesso-orcamento");
  const linkWhatsApp = document.getElementById("link-whatsapp");
  const resumo = document.getElementById("resumo-orcamento");
  const dataInicio = document.getElementById("data_inicio");
  const dataFim = document.getElementById("data_fim");
  let ultimoResumo = null;

  const renderizarResumo = (dados) => {
    resumo.replaceChildren();
    const idioma = window.idiomaSite ? window.idiomaSite() : "pt";
    const resumoTexto = idioma === "en"
      ? { size: "Size", medication: "Medication", yes: "Yes", no: "No" }
      : idioma === "es"
        ? { size: "Tamaño", medication: "Medicamentos", yes: "Sí", no: "No" }
        : { size: "Porte", medication: "Medicação", yes: "Sim", no: "Não" };
    const pet = traduzir({ cachorro: "Cachorro", gato: "Gato", outro: "Outro" }[dados.tipo_pet] || dados.tipo_pet);
    const servico = traduzir({ visita: "Visita em domicílio", hospedagem: "Hospedagem", passeio: "Passeio com o pet" }[dados.tipo_servico] || dados.tipo_servico);
    const linhas = [
      `👤 ${dados.nome_cliente}`,
      `📞 ${dados.contato}`,
      `🐾 ${pet} · ${servico}`,
      `📏 ${resumoTexto.size}: ${traduzir(dados.porte)}`,
      `💊 ${resumoTexto.medication}: ${dados.usa_medicacao === "sim" ? resumoTexto.yes + (dados.medicacao_detalhes ? ` (${dados.medicacao_detalhes})` : "") : resumoTexto.no}`,
      `📅 ${formatarData(dados.data_inicio)}${dados.data_fim ? ` → ${formatarData(dados.data_fim)}` : ""}`,
    ];
    linhas.forEach((linha) => {
      const li = document.createElement("li");
      li.textContent = linha;
      resumo.appendChild(li);
    });
  };

  dataInicio.addEventListener("change", () => {
    dataFim.min = dataInicio.value;
    if (dataFim.value && dataFim.value < dataInicio.value) dataFim.value = "";
  });

  dataFim.addEventListener("input", () => {
    const campo = dataFim.closest(".campo");
    const invalido = Boolean(dataFim.value && dataInicio.value && dataFim.value < dataInicio.value);
    campo.classList.toggle("erro", invalido);
  });

  const selectMed = document.getElementById("usa_medicacao");
  const campoDetalhes = document.getElementById("campo-medicacao-detalhes");
  const alternarDetalhes = () => {
    campoDetalhes.hidden = selectMed.value !== "sim";
    if (selectMed.value !== "sim") document.getElementById("medicacao_detalhes").value = "";
  };
  selectMed.addEventListener("change", alternarDetalhes);
  alternarDetalhes();

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    aviso.textContent = "";
    aviso.className = "aviso";
    limparErros();
    if (!validarCampos() || !confirmarDatas()) {
      aviso.textContent = traduzir("Confira os campos destacados.");
      aviso.className = "aviso erro";
      return;
    }

    const dados = {
      nome_cliente: document.getElementById("nome_cliente").value.trim(),
      contato: document.getElementById("contato").value.trim(),
      tipo_pet: document.getElementById("tipo_pet").value,
      tipo_servico: document.getElementById("tipo_servico").value,
      porte: document.getElementById("porte").value,
      usa_medicacao: document.getElementById("usa_medicacao").value,
      medicacao_detalhes: document.getElementById("medicacao_detalhes").value.trim(),
      data_inicio: dataInicio.value,
      data_fim: dataFim.value || null,
      mensagem: document.getElementById("mensagem").value.trim(),
      website: document.getElementById("website").value,
    };

    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = traduzir("Enviando…");

    linkWhatsApp.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(montarMensagemWhatsApp(dados))}`;
    window.open(linkWhatsApp.href, "_blank", "noopener");

      ultimoResumo = dados;
      renderizarResumo(dados);

      form.hidden = true;
      sucesso.hidden = false;
    botao.disabled = false;
    botao.textContent = traduzir("Abrir orçamento no WhatsApp");
  });

  document.getElementById("novo-orcamento").addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    sucesso.hidden = true;
  });

  document.addEventListener("idiomaalterado", () => {
    if (ultimoResumo && !sucesso.hidden) renderizarResumo(ultimoResumo);
  });
}

function formatarPreco(cents) {
  const idioma = window.idiomaSite ? window.idiomaSite() : "pt";
  const locale = idioma === "en" ? "en-US" : idioma === "es" ? "es-ES" : "pt-BR";
  const currency = idioma === "en" ? "USD" : idioma === "es" ? "EUR" : "BRL";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}

function montarMensagemPedido(dados) {
  const idioma = window.idiomaSite ? window.idiomaSite() : "pt";
  const texto = idioma === "en"
    ? { intro: "Hello Amanda! I would like to place an order:", unit: "Unit price", subtotal: "Subtotal", total: "Total", name: "Name", contact: "Contact" }
    : idioma === "es"
      ? { intro: "¡Hola Amanda! Me gustaría hacer un pedido:", unit: "Precio unitario", subtotal: "Subtotal", total: "Total", name: "Nombre", contact: "Contacto" }
      : { intro: "Olá Amanda! Gostaria de fazer um pedido:", unit: "Unitário", subtotal: "Subtotal", total: "Total", name: "Nome", contact: "Contato" };
  const linhas = [
    texto.intro,
    "",
  ];
  for (const item of dados.itens) {
    linhas.push(`• ${item.quantidade}x ${traduzir(item.nome)}`);
    linhas.push(`  ${texto.unit}: ${formatarPreco(item.preco_centavos)} · ${texto.subtotal}: ${formatarPreco(item.preco_centavos * item.quantidade)}`);
  }
  linhas.push("", `💰 ${texto.total}: ${formatarPreco(dados.total_centavos)}`);
  linhas.push(`👤 ${texto.name}: ${dados.nome_cliente}`);
  linhas.push(`📞 ${texto.contact}: ${dados.contato}`);
  if (dados.observacoes) linhas.push(`💬 ${dados.observacoes}`);
  return linhas.join("\n");
}

const carrinho = (function () {
  try {
    const salvo = localStorage.getItem("carrinho_amanda");
    if (salvo) {
      const obj = JSON.parse(salvo);
      if (obj && typeof obj === "object") return obj;
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
    carrinho[produto.id].quantidade += qtd;
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

  const itens = Object.values(carrinho);
  const quantidadeTotal = itens.reduce((s, i) => s + i.quantidade, 0);

  if (quantidadeTotal > 0) {
    contador.hidden = false;
    contador.textContent = String(quantidadeTotal);
  } else {
    contador.hidden = true;
  }

  itensEl.innerHTML = "";
  vazioEl.hidden = itens.length > 0;
  form.hidden = itens.length === 0;
  totalEl.textContent = formatarPreco(totalCarrinho());

  for (const item of itens) {
    const linha = document.createElement("div");
    linha.className = "item-carrinho";

    const img = document.createElement("img");
    img.src = item.arquivo || "img/amanda-hero.jpg";
    img.alt = traduzir(item.nome);

    const info = document.createElement("div");
    info.className = "item-info";
    const nome = document.createElement("div");
    nome.className = "item-nome";
    nome.textContent = traduzir(item.nome);
    const preco = document.createElement("div");
    preco.className = "item-preco";
    preco.textContent = `${item.quantidade}x ${formatarPreco(item.preco_centavos)}`;
    info.append(nome, preco);

    const stepper = document.createElement("div");
    stepper.className = "stepper";
    const menos = document.createElement("button");
    menos.type = "button";
    menos.textContent = "−";
    menos.setAttribute("aria-label", traduzir("Diminuir quantidade"));
    menos.addEventListener("click", () => adicionarAoCarrinho(item, -1));
    const valor = document.createElement("span");
    valor.className = "stepper-valor";
    valor.textContent = String(item.quantidade);
    const mais = document.createElement("button");
    mais.type = "button";
    mais.textContent = "+";
    mais.setAttribute("aria-label", traduzir("Aumentar quantidade"));
    mais.addEventListener("click", () => adicionarAoCarrinho(item, 1));
    stepper.append(menos, valor, mais);

    const remover = document.createElement("button");
    remover.type = "button";
    remover.className = "item-remover";
    const idioma = window.idiomaSite ? window.idiomaSite() : "pt";
    remover.setAttribute("aria-label", idioma === "en" ? `Remove ${traduzir(item.nome)}` : idioma === "es" ? `Eliminar ${traduzir(item.nome)}` : `Remover ${item.nome}`);
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
          img.alt = traduzir(produto.nome);
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
    titulo.textContent = traduzir(produto.nome);

        const desc = document.createElement("p");
        desc.className = "produto-desc";
        desc.textContent = traduzir(produto.descricao || "");

        const preco = document.createElement("div");
        preco.className = "produto-preco";
        preco.textContent = formatarPreco(produto.preco_centavos);

        const estoqueEl = document.createElement("span");
        if (produto.estoque === null) {
          estoqueEl.className = "produto-estoque";
          estoqueEl.textContent = traduzir("Disponível");
        } else if (produto.estoque === 0) {
          estoqueEl.className = "produto-estoque esgotado";
          estoqueEl.textContent = traduzir("Esgotado");
        } else {
          estoqueEl.className = "produto-estoque";
          estoqueEl.textContent = `${produto.estoque} ${traduzir("em estoque")}`;
        }

        const acoes = document.createElement("div");
        acoes.className = "produto-acoes";

        const stepper = document.createElement("div");
        stepper.className = "stepper";
        const menos = document.createElement("button");
        menos.type = "button";
        menos.textContent = "−";
        menos.setAttribute("aria-label", traduzir("Diminuir quantidade"));
        const valor = document.createElement("span");
        valor.className = "stepper-valor";
        valor.textContent = "1";
        const mais = document.createElement("button");
        mais.type = "button";
        mais.textContent = "+";
        mais.setAttribute("aria-label", traduzir("Aumentar quantidade"));
        stepper.append(menos, valor, mais);

        const adicionar = document.createElement("button");
        adicionar.type = "button";
        adicionar.className = "btn btn-primario btn-adicionar";
          adicionar.textContent = traduzir("Adicionar");

        if (produto.estoque === 0) {
          adicionar.disabled = true;
          adicionar.textContent = traduzir("Esgotado");
        }

        let qtd = 1;
        menos.addEventListener("click", () => {
          if (qtd > 1) { qtd -= 1; valor.textContent = String(qtd); }
        });
        mais.addEventListener("click", () => {
          qtd += 1; valor.textContent = String(qtd);
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
  document.getElementById("abrir-carrinho").addEventListener("click", abrirCarrinho);
  document.getElementById("fechar-carrinho").addEventListener("click", fecharCarrinho);
  document.getElementById("carrinho-overlay").addEventListener("click", fecharCarrinho);

  document.getElementById("form-pedido").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const aviso = document.getElementById("aviso-pedido");
    aviso.textContent = "";
    aviso.className = "aviso";

    const nome = document.getElementById("pedido-nome").value.trim();
    const contato = document.getElementById("pedido-contato").value.trim();
    const obs = document.getElementById("pedido-obs").value.trim();

    if (nome.length < 2) {
      aviso.textContent = traduzir("Informe seu nome.");
      aviso.className = "aviso erro";
      return;
    }
    if (contato.length < 5) {
      aviso.textContent = traduzir("Informe um contato (WhatsApp ou e-mail).");
      aviso.className = "aviso erro";
      return;
    }

    const itens = Object.values(carrinho).map((i) => ({ produto_id: i.id, quantidade: i.quantidade }));
    if (itens.length === 0) {
      aviso.textContent = traduzir("Seu carrinho está vazio.");
      aviso.className = "aviso erro";
      return;
    }

    const botao = evento.target.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = traduzir("Abrindo WhatsApp…");
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

      for (const chave of Object.keys(carrinho)) delete carrinho[chave];
      renderCarrinho();
      salvarCarrinhoLocal();

      document.getElementById("form-pedido").hidden = true;
      document.getElementById("sucesso-pedido").hidden = false;
    botao.disabled = false;
    botao.textContent = traduzir("Finalizar pedido");
  });

  document.getElementById("fechar-sucesso-pedido").addEventListener("click", () => {
    document.getElementById("sucesso-pedido").hidden = true;
    document.getElementById("form-pedido").hidden = false;
    document.getElementById("form-pedido").reset();
    fecharCarrinho();
  });
}

document.addEventListener("idiomaalterado", () => {
  if (document.getElementById("grade-galeria")) carregarGaleria();
  if (document.getElementById("grade-loja")) carregarLoja();
  if (document.getElementById("carrinho-itens")) renderCarrinho();
});

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
