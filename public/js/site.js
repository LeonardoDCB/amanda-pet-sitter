const WHATSAPP_NUMERO = "5518997607771";

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

  try {
    const resposta = await fetch("/api/galeria");
    if (!resposta.ok) throw new Error("erro");
    const imagens = await resposta.json();

    grade.innerHTML = "";

    if (imagens.length === 0) {
      grade.innerHTML = '<div class="galeria-vazia"><span class="pata">🐾</span><p>Em breve, fotos dos meus clientes aqui!</p></div>';
      return;
    }

    const figuras = imagens.map((img) => {
      const figura = document.createElement("figure");
      figura.className = "galeria-item";
      figura.tabIndex = 0;
      figura.setAttribute("role", "button");
      figura.setAttribute("aria-label", img.legenda || "Foto da galeria");

      const figuraImg = document.createElement("img");
      figuraImg.src = `/uploads/${img.arquivo}`;
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
    if (imagens.length > 1) iniciarLightbox(figuras);
  } catch {
    grade.innerHTML = '<div class="galeria-vazia"><span class="pata">😢</span><p>Não foi possível carregar a galeria agora.</p><br><button type="button" class="btn btn-primario btn-pequeno" id="galeria-retry">Tentar novamente</button></div>';
    document.getElementById("galeria-retry")?.addEventListener("click", carregarGaleria);
  }
}

function iniciarLightbox(figuras) {
  const abrir = (indice) => {
    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Imagem ampliada da galeria");
    overlay.tabIndex = -1;

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
      if (evento.key === "Tab") {
        evento.preventDefault();
        fechar.focus();
      }
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
    `📏 Porte: ${dados.porte || "-"}`,
    `💊 Medicação: ${dados.usa_medicacao === "sim" ? "Sim" + (dados.medicacao_detalhes ? ` (${dados.medicacao_detalhes})` : "") : "Não"}`,
    `🛠️ Serviço: ${dados.tipo_servico}`,
    `📅 De: ${formatarData(dados.data_inicio)}`,
  ];

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
      aviso.textContent = "Confira os campos destacados.";
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
    botao.textContent = "Enviando…";

    try {
      const resposta = await fetch("/api/orcamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const corpo = await resposta.json();

      if (!resposta.ok) {
        const detalhes = corpo.detalhes
          ? Object.values(corpo.detalhes.fieldErrors).flat().join(" ")
          : corpo.erro;
        aviso.textContent = detalhes || "Não foi possível enviar. Tente novamente.";
        aviso.className = "aviso erro";
        botao.disabled = false;
        botao.textContent = "Enviar orçamento";
        return;
      }

      linkWhatsApp.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(montarMensagemWhatsApp(dados))}`;

      resumo.replaceChildren();
      const linhasResumo = [
        `👤 ${dados.nome_cliente}`,
        `📞 ${dados.contato}`,
        `🐾 ${dados.tipo_pet} · ${dados.tipo_servico}`,
        `📏 Porte: ${dados.porte}`,
        `💊 Medicação: ${dados.usa_medicacao === "sim" ? "Sim" + (dados.medicacao_detalhes ? ` (${dados.medicacao_detalhes})` : "") : "Não"}`,
        `📅 ${formatarData(dados.data_inicio)}${dados.data_fim ? ` → ${formatarData(dados.data_fim)}` : ""}`,
      ];
      for (const linha of linhasResumo) {
        const li = document.createElement("li");
        li.textContent = linha;
        resumo.appendChild(li);
      }

      form.hidden = true;
      sucesso.hidden = false;
    } catch {
      aviso.textContent = "Falha de conexão. Tente novamente em instantes.";
      aviso.className = "aviso erro";
      botao.disabled = false;
      botao.textContent = "Enviar orçamento";
    }
  });

  document.getElementById("novo-orcamento").addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    sucesso.hidden = true;
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
    linhas.push(`• ${item.quantidade}x ${item.nome} — ${formatarPreco(item.preco_centavos * item.quantidade)}`);
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
    img.src = item.arquivo ? `/uploads/${item.arquivo}` : "img/placeholder-amanda.svg";
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
    menos.setAttribute("aria-label", `Diminuir quantidade de ${item.nome}`);
    menos.addEventListener("click", () => adicionarAoCarrinho(item, -1));
    const valor = document.createElement("span");
    valor.className = "stepper-valor";
    valor.textContent = String(item.quantidade);
    const mais = document.createElement("button");
    mais.type = "button";
    mais.textContent = "+";
    mais.setAttribute("aria-label", `Aumentar quantidade de ${item.nome}`);
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

let elementoAntesCarrinho = null;

function abrirCarrinho() {
  const painel = document.getElementById("carrinho");
  elementoAntesCarrinho = document.activeElement;
  painel.hidden = false;
  document.getElementById("carrinho-overlay").hidden = false;
  document.getElementById("abrir-carrinho").setAttribute("aria-expanded", "true");
  document.getElementById("fechar-carrinho").focus();
}

function fecharCarrinho() {
  document.getElementById("carrinho").hidden = true;
  document.getElementById("carrinho-overlay").hidden = true;
  document.getElementById("abrir-carrinho").setAttribute("aria-expanded", "false");
  if (elementoAntesCarrinho && elementoAntesCarrinho.isConnected) elementoAntesCarrinho.focus();
}

function controlarTecladoCarrinho(evento) {
  const painel = document.getElementById("carrinho");
  if (painel.hidden) return;
  if (evento.key === "Escape") {
    fecharCarrinho();
    return;
  }
  if (evento.key !== "Tab") return;
  const focaveis = [...painel.querySelectorAll("button, input, textarea, select, a[href]")]
    .filter((elemento) => !elemento.disabled && !elemento.hidden);
  if (!focaveis.length) return;
  const primeiro = focaveis[0];
  const ultimo = focaveis[focaveis.length - 1];
  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primeiro.focus();
  }
}

document.addEventListener("keydown", controlarTecladoCarrinho);

function carregarLoja() {
  const grade = document.getElementById("grade-loja");

  fetch("/api/produtos")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((produtos) => {
      grade.innerHTML = "";

      if (produtos.length === 0) {
        grade.innerHTML = '<div class="galeria-vazia"><span class="pata">🛍️</span><p>Ainda não há produtos à venda. Volte em breve!</p></div>';
        return;
      }

      for (const produto of produtos) {
        const card = document.createElement("article");
        card.className = "produto-card";

        const foto = document.createElement("div");
        foto.className = "produto-foto";
        if (produto.arquivo) {
          const img = document.createElement("img");
          img.src = `/uploads/${produto.arquivo}`;
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
        menos.setAttribute("aria-label", `Diminuir quantidade de ${produto.nome}`);
        const valor = document.createElement("span");
        valor.className = "stepper-valor";
        valor.textContent = "1";
        const mais = document.createElement("button");
        mais.type = "button";
        mais.textContent = "+";
        mais.setAttribute("aria-label", `Aumentar quantidade de ${produto.nome}`);
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
    })
    .catch(() => {
      grade.innerHTML = '<div class="galeria-vazia"><span class="pata">😢</span><p>Não foi possível carregar a loja agora.</p><br><button type="button" class="btn btn-primario btn-pequeno" id="loja-retry">Tentar novamente</button></div>';
      document.getElementById("loja-retry")?.addEventListener("click", carregarLoja);
    });
}

function iniciarCarrinho() {
  document.getElementById("abrir-carrinho").addEventListener("click", abrirCarrinho);
  document.getElementById("fechar-carrinho").addEventListener("click", fecharCarrinho);
  document.getElementById("carrinho-overlay").addEventListener("click", fecharCarrinho);

  document.getElementById("form-pedido").addEventListener("submit", async (evento) => {
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

    const itens = Object.values(carrinho).map((i) => ({ produto_id: i.id, quantidade: i.quantidade }));
    if (itens.length === 0) {
      aviso.textContent = "Seu carrinho está vazio.";
      aviso.className = "aviso erro";
      return;
    }

    const botao = evento.target.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = "Enviando…";

    try {
      const resposta = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_cliente: nome, contato, itens, observacoes: obs, website: "" }),
      });
      const corpo = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        aviso.textContent = corpo.erro || "Não foi possível enviar o pedido.";
        aviso.className = "aviso erro";
        botao.disabled = false;
        botao.textContent = "Finalizar pedido";
        return;
      }

      const dadosWhatsApp = {
        itens: Object.values(carrinho).map((i) => ({ nome: i.nome, quantidade: i.quantidade, preco_centavos: i.preco_centavos })),
        total_centavos: totalCarrinho(),
        nome_cliente: nome,
        contato,
        observacoes: obs,
      };
      document.getElementById("link-pedido-whatsapp").href =
        `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(montarMensagemPedido(dadosWhatsApp))}`;

      for (const chave of Object.keys(carrinho)) delete carrinho[chave];
      renderCarrinho();
      salvarCarrinhoLocal();

      document.getElementById("form-pedido").hidden = true;
      document.getElementById("sucesso-pedido").hidden = false;
    } catch {
      aviso.textContent = "Falha de conexão. Tente novamente.";
      aviso.className = "aviso erro";
      botao.disabled = false;
      botao.textContent = "Finalizar pedido";
    }
  });

  document.getElementById("fechar-sucesso-pedido").addEventListener("click", () => {
    document.getElementById("sucesso-pedido").hidden = true;
    document.getElementById("form-pedido").hidden = false;
    document.getElementById("form-pedido").reset();
    fecharCarrinho();
  });
}

function montarEstrelas(n) {
  const wrap = document.createElement("span");
  wrap.className = "estrelas";
  wrap.setAttribute("aria-label", `Avaliação ${n} de 5`);
  for (let i = 1; i <= 5; i++) {
    const estrela = document.createElement("span");
    estrela.className = "estrela" + (i <= n ? " ativa" : "");
    estrela.textContent = i <= n ? "★" : "☆";
    wrap.appendChild(estrela);
  }
  return wrap;
}

function injetarJsonLdEmpresa(depoimentos) {
  const avaliados = depoimentos.filter((d) => d.avaliacao >= 1 && d.avaliacao <= 5);
  const dados = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://amandapetsitter.pet/#empresa",
    name: "Pet Sitter Amanda",
    image: "https://amandapetsitter.pet/img/og-capa.png",
    url: "https://amandapetsitter.pet/",
    telephone: "+5518997607771",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Birigui",
      addressRegion: "SP",
      addressCountry: "BR"
    },
    geo: { "@type": "GeoCoordinates", latitude: -21.2678, longitude: -50.3417 },
    areaServed: ["Birigui-SP", "Araçatuba-SP"],
    sameAs: ["https://www.instagram.com/amandaa.petsitter"],
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "20:00"
    }]
  };

  if (avaliados.length) {
    const soma = avaliados.reduce((s, d) => s + d.avaliacao, 0);
    dados.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (soma / avaliados.length).toFixed(1),
      reviewCount: avaliados.length
    };
    dados.review = avaliados.map((d) => ({
      "@type": "Review",
      author: { "@type": "Person", name: d.autor || "Cliente" },
      reviewBody: d.texto || "",
      reviewRating: { "@type": "Rating", ratingValue: d.avaliacao }
    }));
  }

  let script = document.getElementById("jsonld-empresa");
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "jsonld-empresa";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(dados);
}

async function carregarDepoimentos() {
  const grade = document.getElementById("grade-depoimentos");
  if (!grade) return;
  try {
    const resposta = await fetch("/api/depoimentos");
    if (!resposta.ok) throw new Error("falha");
    const depoimentos = await resposta.json();
    if (!depoimentos.length) return;
    grade.innerHTML = "";
    for (const d of depoimentos) {
      const card = document.createElement("article");
      card.className = "depoimento-card";
      if (d.arquivo) {
        const figura = document.createElement("div");
        figura.className = "depoimento-figura";
        const img = document.createElement("img");
        img.src = "/uploads/" + d.arquivo;
        img.alt = d.autor ? "Depoimento de " + d.autor : "Print de depoimento";
        img.loading = "lazy";
        figura.appendChild(img);
        card.appendChild(figura);
      }
      if (d.texto) {
        const texto = document.createElement("p");
        texto.className = "depoimento-texto";
        texto.textContent = d.texto;
        card.appendChild(texto);
      }
      if (d.avaliacao) card.appendChild(montarEstrelas(d.avaliacao));
      if (d.autor) {
        const autor = document.createElement("p");
        autor.className = "depoimento-autor";
        autor.textContent = "— " + d.autor;
        card.appendChild(autor);
      }
      grade.appendChild(card);
    }
    injetarJsonLdEmpresa(depoimentos);
  } catch {
    /* mantém o conteúdo estático de fallback já presente no HTML */
  }
}

carregarGaleria();
iniciarFormulario();
carregarLoja();
iniciarCarrinho();
carregarDepoimentos();
