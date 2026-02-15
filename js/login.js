/**
 * Login – validação e redirecionamento do painel administrativo.
 */
(function () {
  if (sessionStorage.getItem('pizzaria_admin_logado') === 'true') {
    window.location.replace('admin.html');
    return;
  }

  var msgErro = document.getElementById('msg-erro');
  var email = document.getElementById('email');
  var senha = document.getElementById('senha');

  // Força campos vazios ao carregar (evita pré-preenchimento pelo navegador)
  if (email) email.value = '';
  if (senha) senha.value = '';

  window.validarLogin = function (e) {
    if (e) e.preventDefault();
    if (msgErro) msgErro.classList.add('hidden');
    var eVal = (email && email.value || '').trim().toLowerCase();
    var sVal = senha && senha.value || '';
    if (eVal === 'admin@admin.com' && sVal === 'Admin') {
      sessionStorage.setItem('pizzaria_admin_logado', 'true');
      window.location.replace('admin.html');
      return false;
    }
    if (msgErro) {
      msgErro.textContent = 'E-mail ou senha incorretos.';
      msgErro.classList.remove('hidden');
    }
    return false;
  };
})();
