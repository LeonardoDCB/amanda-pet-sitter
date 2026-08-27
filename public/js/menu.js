const menuBotao = document.getElementById('menu-botao');
const menuNavegacao = document.getElementById('menu-navegacao');
const menuOverlay = document.getElementById('menu-overlay');
const ehMobile = () => window.matchMedia('(max-width: 900px)').matches;

function abrirMenu() {
  menuNavegacao.classList.add('aberto');
  menuBotao.classList.add('aberto');
  menuBotao.setAttribute('aria-expanded', 'true');
  if (menuOverlay) menuOverlay.hidden = false;
  menuNavegacao.inert = false;
}

function fecharMenu() {
  menuNavegacao.classList.remove('aberto');
  menuBotao.classList.remove('aberto');
  menuBotao.setAttribute('aria-expanded', 'false');
  if (menuOverlay) menuOverlay.hidden = true;
  if (ehMobile()) menuNavegacao.inert = true;
}

if (menuBotao && menuNavegacao) {
  menuBotao.addEventListener('click', () => {
    if (menuNavegacao.classList.contains('aberto')) fecharMenu();
    else abrirMenu();
  });

  if (menuOverlay) {
    menuOverlay.addEventListener('click', fecharMenu);
  }

  menuNavegacao.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && menuNavegacao.classList.contains('aberto')) fecharMenu();
  });

  window.addEventListener('resize', () => {
    if (!ehMobile()) menuNavegacao.inert = false;
  });

  if (ehMobile()) menuNavegacao.inert = true;
}
