(function () {
  const listaPedidos = document.getElementById('lista-pedidos');
  const msgVazio = document.getElementById('msg-vazio');
  var urlEl = document.getElementById('url-pedido-casa');
  if (urlEl) urlEl.textContent = window.location.origin;

  var formas = {
    credito: 'Crédito (online)',
    debito: 'Débito (online)',
    pix: 'PIX',
    entrega_credito: 'Crédito na entrega',
    entrega_debito: 'Débito na entrega'
  };

  function formatarValor(v) {
    return 'R$ ' + Number(v).toFixed(2).replace('.', ',');
  }

  function formatarDataHora(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function render() {
    var pedidos = getPedidosViagem();
    if (pedidos.length === 0) {
      listaPedidos.innerHTML = '';
      msgVazio.classList.remove('hidden');
      return;
    }
    msgVazio.classList.add('hidden');
    listaPedidos.innerHTML = pedidos.map(function (p) {
      var itensHtml = (p.itens || []).map(function (i) {
        return (i.quantidade || 1) + 'x ' + i.nome + ' — R$ ' + (i.preco * (i.quantidade || 1)).toFixed(2).replace('.', ',');
      }).join('<br/>');
      var forma = formas[p.formaPagamento] || p.formaPagamento || '—';
      var statusBadge = p.pago
        ? '<span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-italian-green text-white">Pago</span>'
        : '<span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-white">Pagamento na entrega</span>';
      var obsHtml = (p.observacoes && p.observacoes.trim()) ? '<p class="mt-2 text-sm"><strong>Obs.:</strong> ' + String(p.observacoes).replace(/</g, '&lt;') + '</p>' : '';
      var btnBaixa = p.pago
        ? '<button type="button" class="dar-baixa mt-3 px-4 py-2 rounded-xl bg-italian-green text-white font-semibold hover:bg-italian-green-dark" data-id="' + p.id + '">Dar baixa</button>'
        : '<button type="button" class="dar-baixa mt-3 px-4 py-2 rounded-xl bg-italian-green text-white font-semibold hover:bg-italian-green-dark" data-id="' + p.id + '">Pago</button>';
      var end = p.cliente ? p.cliente.rua + ', ' + p.cliente.numero + ' — ' + p.cliente.cep : '—';
      return '<div class="bg-white rounded-2xl shadow-xl border border-amber-200 p-5">' +
        '<div class="flex flex-wrap justify-between items-start gap-2">' +
        '<div><strong class="text-italian-brown">' + (p.cliente ? p.cliente.nome : '—') + '</strong>' +
        ' <span class="text-italian-brown-light text-sm">' + formatarDataHora(p.criadoEm) + '</span></div>' +
        statusBadge + '</div>' +
        '<p class="text-sm text-italian-brown-light mt-1">' + end + ' — Tel: ' + (p.cliente ? p.cliente.telefone : '—') + '</p>' +
        '<p class="text-sm mt-2"><strong>Forma de pagamento:</strong> ' + forma + '</p>' +
        '<div class="mt-2 text-sm border-t border-amber-100 pt-2">' + itensHtml + '</div>' +
        obsHtml +
        '<p class="mt-2 font-semibold text-italian-green">Total: ' + formatarValor(p.total) + '</p>' +
        btnBaixa + '</div>';
    }).join('');

    listaPedidos.querySelectorAll('.dar-baixa').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.id;
        if (confirm('Dar baixa neste pedido? O valor será lançado na Conferência de Caixa como Pedido viagem.')) {
          darBaixaPedidoViagem(id);
          render();
        }
      });
    });
  }

  render();
  setInterval(render, 4000);
})();
