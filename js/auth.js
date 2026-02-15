/**
 * Autenticação do painel: redireciona para login se não logado;
 * configura o botão Sair quando presente (após o DOM estar pronto).
 */
(function () {
  if (sessionStorage.getItem('pizzaria_admin_logado') !== 'true') {
    window.location.replace('login.html');
    return;
  }

  function configurarSair() {
    var btnSair = document.getElementById('btn-sair');
    if (btnSair) {
      btnSair.addEventListener('click', function (e) {
        e.preventDefault();
        sessionStorage.removeItem('pizzaria_admin_logado');
        window.location.replace('login.html');
      });
      btnSair.setAttribute('href', '#');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', configurarSair);
  } else {
    configurarSair();
  }
})();
