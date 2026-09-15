(function () {
  var root = document.documentElement;

  var btn = document.createElement("button");
  btn.id = "alternar-tema";
  btn.type = "button";
  btn.className = "btn-tema";
  btn.setAttribute("aria-label", "Alternar tema claro ou escuro");

  var iconeLua = document.createElement("span");
  iconeLua.className = "tema-icone-esq";
  iconeLua.textContent = "🌙";
  iconeLua.setAttribute("aria-hidden", "true");

  var iconeSol = document.createElement("span");
  iconeSol.className = "tema-icone-dir";
  iconeSol.textContent = "☀️";
  iconeSol.setAttribute("aria-hidden", "true");

  btn.appendChild(iconeLua);
  btn.appendChild(iconeSol);

  function atualiza() {
    var dark = root.getAttribute("data-theme") === "dark";
    var idioma = window.idiomaSite ? window.idiomaSite() : "pt";
    var labels = idioma === "en"
      ? ["Switch to light theme", "Switch to dark theme"]
      : idioma === "es"
        ? ["Cambiar al tema claro", "Cambiar al tema oscuro"]
        : ["Mudar para tema claro", "Mudar para tema escuro"];
    btn.setAttribute("aria-pressed", String(dark));
    btn.title = dark ? labels[0] : labels[1];
    btn.setAttribute("aria-label", btn.title);
  }

  document.addEventListener("idiomaalterado", atualiza);

  btn.addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") === "dark";
    if (dark) {
      root.removeAttribute("data-theme");
      try { localStorage.setItem("tema", "light"); } catch (_) {}
    } else {
      root.setAttribute("data-theme", "dark");
      try { localStorage.setItem("tema", "dark"); } catch (_) {}
    }
    atualiza();
  });

  var alvo =
    document.querySelector(".cabecalho-inner") ||
    document.body;
  var nav = alvo.querySelector("nav.menu");
  if (nav && nav.parentNode === alvo) {
    alvo.insertBefore(btn, nav);
  } else {
    alvo.appendChild(btn);
  }
  atualiza();
})();
