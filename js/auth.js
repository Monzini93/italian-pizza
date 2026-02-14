/**
 * Autenticação do painel: redireciona para login se não logado;
 * configura o botão Sair quando presente.
 */
(function () {
  if (sessionStorage.getItem('pizzaria_admin_logado') !== 'true') {
    window.location.replace('login.html');
    return;
  }

  var btnSair = document.getElementById('btn-sair');
  if (btnSair) {
    btnSair.addEventListener('click', function (e) {
      e.preventDefault();
      sessionStorage.removeItem('pizzaria_admin_logado');
      window.location.href = 'login.html';
    });
  }
})();
