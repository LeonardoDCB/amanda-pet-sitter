const fs = require("fs");
const vm = require("vm");

const fonte = fs.readFileSync("public/js/idioma.js", "utf8");
const frases = [
  "Você me passa os horários e as necessidades, e eu sigo o que seu pet já está acostumado — sem estresse de mudança de ambiente.",
  "Viajar é bom, mas deixar o pet preocupa. Aqui vão dicas para a hospedagem do seu cão na casa da Amanda ser tranquila — para ele e para você.",
  "Cães que passeiam regularmente mantêm o peso saudável, dormem melhor e têm menos problemas articulares. Em Araçatuba-SP o clima pede atenção aos horários — manhã cedo e fim de tarde são ideais.",
  "Olá Amanda! Vi seu site e gostaria de mais informações.",
  "Ex.: antibiótico 2x ao dia",
  "Feito com 🐾 para pets bem cuidados",
];

function criarContexto(idioma) {
  const listeners = {};
  const document = {
    documentElement: { lang: "pt-BR" },
    body: {},
    addEventListener(tipo, callback) { listeners[tipo] = callback; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementById() { return null; },
    createTreeWalker() { return { nextNode() { return false; } }; },
  };
  const window = {};
  const contexto = {
    window,
    document,
    navigator: { language: idioma === "en" ? "en-US" : idioma === "es" ? "es-ES" : "pt-BR" },
    localStorage: { getItem() { return null; }, setItem() {} },
    NodeFilter: { SHOW_TEXT: 4 },
    CustomEvent: function CustomEvent() {},
    console,
  };
  vm.runInNewContext(fonte, contexto);
  return window.traduzirSite;
}

const esperados = {
  pt: ["Você me passa", "Viajar é bom", "Cães que passeiam", "Olá Amanda!", "Ex.: antibiótico", "Feito com"],
  en: ["You share", "Traveling is great", "Dogs who walk", "Hello Amanda!", "E.g.: antibiotic", "Made with"],
  es: ["Me indicas", "Viajar es bueno", "Los perros que pasean", "¡Hola Amanda!", "Ej.: antibiótico", "Hecho con"],
};

for (const [idioma, termos] of Object.entries(esperados)) {
  const traduzir = criarContexto(idioma);
  for (const frase of frases) {
    const resultado = traduzir(frase);
    if (!resultado) {
      throw new Error(`Tradução inválida para ${idioma}: ${frase} -> ${resultado}`);
    }
  }
  for (const [indice, termo] of termos.entries()) {
    if (!traduzir(frases[indice]).includes(termo)) {
      throw new Error(`Termo esperado ausente para ${idioma}: ${termo}`);
    }
  }
  console.log(`${idioma}: ${frases.length} frases validadas`);
}
