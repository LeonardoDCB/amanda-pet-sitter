(function () {
  try {
    var tema = localStorage.getItem("tema");
    if (!tema && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) tema = "dark";
    if (tema === "dark") document.documentElement.setAttribute("data-theme", "dark");
  } catch (_) {}
})();
