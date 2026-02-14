(function () {
  const resumoDias = document.getElementById('resumo-dias');
  const corpoPagamentos = document.getElementById('corpo-pagamentos');
  const btnFecharCaixa = document.getElementById('btn-fechar-caixa');
  const modalFecharCaixa = document.getElementById('modal-fechar-caixa');
  const modalFecharData = document.getElementById('modal-fechar-data');
  const modalFecharValor = document.getElementById('modal-fechar-valor');
  const btnCancelarFechar = document.getElementById('btn-cancelar-fechar-caixa');
  const btnConfirmarFechar = document.getElementById('btn-confirmar-fechar-caixa');

  function formatarData(d) {
    return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  function formatarDataHora(iso) {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatarValor(v) {
    return 'R$ ' + Number(v).toFixed(2).replace('.', ',');
  }

  function getDataHoje() {
    return new Date().toISOString().slice(0, 10);
  }

  function getTotalDia(data) {
    return getPagamentos()
      .filter(p => (p.data || (p.dataHora && p.dataHora.slice(0, 10))) === data)
      .reduce((s, p) => s + p.valor, 0);
  }

  function abrirModalFecharCaixa() {
    const hoje = getDataHoje();
    const fechado = getFechamentoPorDia(hoje);
    if (fechado) {
      alert('O caixa deste dia já foi fechado.');
      return;
    }
    const total = getTotalDia(hoje);
    if (total <= 0) {
      alert('Não há valores recebidos hoje para fechar o caixa.');
      return;
    }
    modalFecharData.textContent = new Date(hoje + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    modalFecharValor.textContent = formatarValor(total);
    modalFecharCaixa.classList.remove('hidden');
    modalFecharCaixa.classList.add('flex');
  }

  function fecharModalFecharCaixa() {
    modalFecharCaixa.classList.add('hidden');
    modalFecharCaixa.classList.remove('flex');
  }

  function confirmarFecharCaixa() {
    const hoje = getDataHoje();
    const total = getTotalDia(hoje);
    const ok = fecharCaixa(hoje, total);
    fecharModalFecharCaixa();
    if (ok) {
      render();
    }
  }

  if (btnFecharCaixa) btnFecharCaixa.addEventListener('click', abrirModalFecharCaixa);
  if (btnCancelarFechar) btnCancelarFechar.addEventListener('click', fecharModalFecharCaixa);
  if (btnConfirmarFechar) btnConfirmarFechar.addEventListener('click', confirmarFecharCaixa);
  var btnFecharX = document.querySelector('.fechar-modal-fechar-caixa');
  if (btnFecharX) btnFecharX.addEventListener('click', fecharModalFecharCaixa);

  function render() {
    const porDia = getValoresPorDia();
    const pagamentos = getPagamentos();
    const mesas = getMesas();

    resumoDias.innerHTML = porDia.map(([data, valor]) => `
      <div class="bg-white rounded-2xl shadow-lg border border-amber-200 p-5 text-center">
        <div class="text-2xl font-bold text-italian-green">${formatarValor(valor)}</div>
        <div class="text-sm text-italian-brown-light mt-1">${formatarData(data)}</div>
      </div>
    `).join('') || '<div class="bg-white rounded-2xl border border-amber-200 p-5 text-center text-italian-brown-light">Nenhum valor recebido ainda.</div>';

    const formas = { debito: 'Débito', credito: 'Crédito', pix: 'PIX' };
    const ordenados = [...pagamentos].sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
    corpoPagamentos.innerHTML = ordenados.map(p => {
      const origem = p.origem === 'viagem' ? 'Pedido viagem' : (() => { const mesa = mesas.find(m => m.id === p.mesaId); return 'Mesa ' + (mesa ? mesa.numero : (p.mesaId ? String(p.mesaId) : '—')); })();
      const forma = formas[p.formaPagamento] || p.formaPagamento || '—';
      return `
        <tr class="hover:bg-amber-50">
          <td class="p-3 border-b border-amber-100">${formatarDataHora(p.dataHora)}</td>
          <td class="p-3 border-b border-amber-100">${origem}</td>
          <td class="p-3 border-b border-amber-100 text-italian-brown">${forma}</td>
          <td class="p-3 border-b border-amber-100 font-semibold text-italian-green">${formatarValor(p.valor)}</td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="4" class="p-4 text-italian-brown-light text-center">Nenhum pagamento registrado.</td></tr>';
  }

  render();
})();
