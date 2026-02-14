/**
 * Login – validação e redirecionamento do painel administrativo.
 */
(function () {
  if (sessionStorage.getItem('pizzaria_admin_logado') === 'true') {
    window.location.replace('admin.html');
    return;
  }

  var form = document.getElementById('form-login');
  var msgErro = document.getElementById('msg-erro');
  var email = document.getElementById('email');
  var senha = document.getElementById('senha');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (msgErro) msgErro.classList.add('hidden');
    var eVal = (email && email.value || '').trim().toLowerCase();
    var sVal = senha && senha.value || '';
    if (eVal === 'admin@admin.com' && sVal === 'Admin') {
      sessionStorage.setItem('pizzaria_admin_logado', 'true');
      window.location.replace('admin.html');
    } else {
      if (msgErro) {
        msgErro.textContent = 'E-mail ou senha incorretos.';
        msgErro.classList.remove('hidden');
      }
    }
  });
})();
