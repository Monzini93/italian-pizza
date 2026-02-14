(function () {
  if (sessionStorage.getItem('pizzaria_admin_logado') !== 'true') {
    window.location.replace('login.html');
  }
})();
