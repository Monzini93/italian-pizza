/**
 * Utilitários compartilhados: sanitização e validação.
 * Uso: incluir antes dos demais scripts nas páginas que precisarem.
 */
(function () {
  'use strict';

  function escapeHtml(str) {
    if (str == null || typeof str !== 'string') return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function trim(str) {
    return str == null ? '' : String(str).trim();
  }

  function sanitizeText(str, maxLength) {
    var s = trim(str);
    if (maxLength != null && s.length > maxLength) s = s.slice(0, maxLength);
    return s;
  }

  window.Utils = {
    escapeHtml: escapeHtml,
    trim: trim,
    sanitizeText: sanitizeText
  };
})();
