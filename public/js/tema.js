(function () {
  var root = document.documentElement;

  var btn = document.createElement("button");
  btn.id = "alternar-tema";
  btn.type = "button";
  btn.className = "btn-tema";
  btn.setAttribute("aria-label", "Alternar tema claro ou escuro");

  function atualiza() {
    var dark = root.getAttribute("data-theme") === "dark";
    btn.textContent = dark ? "☀️" : "🌙";
    btn.setAttribute("aria-pressed", String(dark));
    btn.title = dark ? "Mudar para tema claro" : "Mudar para tema escuro";
  }

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
    document.querySelector(".menu-ctas") ||
    document.querySelector(".cabecalho-inner") ||
    document.body;
  alvo.appendChild(btn);
  atualiza();
})();
