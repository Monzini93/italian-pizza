(function () {
  const mesasGrid = document.getElementById('mesas-grid');
  const btnNovaMesa = document.getElementById('btn-nova-mesa');
  const contaMesaSection = document.getElementById('conta-mesa-section');
  const contaMesaNumero = document.getElementById('conta-mesa-numero');
  const contaItens = document.getElementById('conta-itens');
  const contaTotal = document.getElementById('conta-total');
  const btnImprimir = document.getElementById('btn-imprimir');
  const btnContaPaga = document.getElementById('btn-conta-paga');

  const modalMesa = document.getElementById('modal-mesa');
  const modalMesaTitulo = document.getElementById('modal-mesa-titulo');
  const inputNumeroMesa = document.getElementById('input-numero-mesa');
  const btnCancelarMesa = document.getElementById('btn-cancelar-mesa');
  const btnSalvarMesa = document.getElementById('btn-salvar-mesa');

  const modalPago = document.getElementById('modal-pago');
  const modalValorTotal = document.getElementById('modal-valor-total');
  const inputValorRecebido = document.getElementById('input-valor-recebido');
  const btnCancelarPago = document.getElementById('btn-cancelar-pago');
  const btnConfirmarPago = document.getElementById('btn-confirmar-pago');

  const areaImpressao = document.getElementById('area-impressao');

  let mesaSelecionadaId = null;
  let editandoMesaId = null;

  function renderMesas() {
    const mesas = getMesas();
    const pedidos = getPedidos();
    const comPedido = new Set(pedidos.filter(p => p.status === 'aberto').map(p => p.mesaId));

    mesasGrid.innerHTML = mesas.map(m => {
      const temPedido = comPedido.has(m.id);
      const cardStyle = temPedido ? 'border-color: #DE332E; background-color: #FFDBB8;' : 'border-color: #E3A85B; background-color: white;';
      return `
        <div class="mesa-card rounded-2xl border-2 p-4 text-center cursor-pointer transition hover:shadow-lg" style="${cardStyle}" data-id="${m.id}">
          <div class="font-display text-2xl font-bold" style="color: #DE332E;">${m.numero}</div>
          <div class="text-sm" style="color: #7C422A;">Mesa</div>
          ${temPedido ? '<span class="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium" style="background-color: #DE332E; color: white;">Com pedido</span>' : ''}
          <div class="mt-3 flex gap-2 justify-center">
            ${!temPedido ? `<button type="button" class="px-2 py-1 rounded-lg text-sm border-2 hover:bg-amber-100" style="border-color: #7C422A; color: #7C422A;" data-edit="${m.id}">Editar</button>` : ''}
            <button type="button" class="px-2 py-1 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700" data-del="${m.id}">Apagar</button>
          </div>
        </div>
      `;
    }).join('');

    mesasGrid.querySelectorAll('.mesa-card').forEach(card => {
      const id = card.dataset.id;
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-edit]') || e.target.closest('[data-del]')) return;
        abrirConta(id);
      });
    });
    mesasGrid.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mesaId = btn.dataset.edit;
        const pedidosAbertos = getPedidos().filter(p => p.mesaId === mesaId && p.status === 'aberto');
        if (pedidosAbertos.length > 0) {
          alert('Essa mesa tem pedidos em aberto e não pode ser editada.');
          return;
        }
        abrirModalMesa(mesaId);
      });
    });
    mesasGrid.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mesaId = btn.dataset.del;
        const pedidosAbertos = getPedidos().filter(p => p.mesaId === mesaId && p.status === 'aberto');
        if (pedidosAbertos.length > 0) {
          alert('Essa mesa tem pedidos em aberto, não pode ser excluída até a conclusão do pagamento.');
          return;
        }
        if (confirm('Apagar esta mesa?')) {
          removeMesa(mesaId);
          renderMesas();
          if (mesaSelecionadaId === mesaId) {
            mesaSelecionadaId = null;
            contaMesaSection.classList.add('hidden');
          }
        }
      });
    });
  }

  function abrirConta(mesaId) {
    mesaSelecionadaId = mesaId;
    const mesas = getMesas();
    const mesa = mesas.find(m => m.id === mesaId);
    if (!mesa) return;

    const itens = getTodosItensMesa(mesaId);
    const total = totalMesa(mesaId);

    contaMesaNumero.textContent = mesa.numero;
    contaItens.innerHTML = itens.map(i => {
      const subtotal = i.preco * (i.quantidade || 1);
      return `
        <li class="flex justify-between items-center py-3 gap-4">
          <span class="font-semibold w-10" style="color: #DE332E;">${i.quantidade || 1}x</span>
          <span class="flex-1" style="color: #7C422A;">${i.nome}</span>
          <span class="font-semibold" style="color: #7C422A;">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
        </li>
      `;
    }).join('') || '<li class="py-3" style="color: #7C422A;">Nenhum item nesta mesa.</li>';
    contaTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    contaMesaSection.classList.remove('hidden');
  }

  function abrirModalMesa(id) {
    editandoMesaId = id || null;
    modalMesaTitulo.textContent = id ? 'Editar mesa' : 'Nova mesa';
    if (id) {
      const m = getMesas().find(x => x.id === id);
      inputNumeroMesa.value = m ? m.numero : '';
    } else {
      inputNumeroMesa.value = '';
    }
    modalMesa.classList.remove('hidden');
    modalMesa.classList.add('flex');
    inputNumeroMesa.focus();
  }

  function fecharModalMesa() {
    modalMesa.classList.add('hidden');
    modalMesa.classList.remove('flex');
    editandoMesaId = null;
  }

  function salvarMesa() {
    const num = inputNumeroMesa.value.trim();
    if (!num || isNaN(Number(num)) || Number(num) < 1) {
      alert('Informe um número válido para a mesa.');
      return;
    }
    const numero = Number(num);
    const mesas = getMesas();
    const jaExiste = mesas.some(m => m.numero === numero && m.id !== editandoMesaId);
    if (jaExiste) {
      alert('Já existe uma mesa com esse número. Escolha outro número.');
      return;
    }
    if (editandoMesaId) {
      updateMesa(editandoMesaId, numero);
    } else {
      addMesa(numero);
    }
    fecharModalMesa();
    renderMesas();
  }

  function imprimirConta() {
    if (!mesaSelecionadaId) return;
    const mesas = getMesas();
    const mesa = mesas.find(m => m.id === mesaSelecionadaId);
    const itens = getTodosItensMesa(mesaSelecionadaId);
    const total = totalMesa(mesaSelecionadaId);

    areaImpressao.innerHTML = `
      <div style="padding: 2rem; font-family: Outfit, sans-serif;">
        <h1 style="text-align: center; color: #7C422A;">Italian Pizza - Conta</h1>
        <p style="text-align: center;"><strong>Mesa ${mesa ? mesa.numero : '-'}</strong></p>
        <p style="text-align: center; font-size: 0.9rem;">${new Date().toLocaleString('pt-BR')}</p>
        <table style="width: 100%; margin-top: 1.5rem; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #fed7aa;">
              <th style="text-align: left;">Qtd</th>
              <th style="text-align: left;">Item</th>
              <th style="text-align: right;">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${itens.map(i => `
              <tr style="border-bottom: 1px solid #fed7aa;">
                <td>${i.quantidade || 1}</td>
                <td>${i.nome}</td>
                <td style="text-align: right;">R$ ${(i.preco * (i.quantidade || 1)).toFixed(2).replace('.', ',')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top: 1rem; font-size: 1.25rem; font-weight: bold; text-align: right;">Total: R$ ${total.toFixed(2).replace('.', ',')}</p>
      </div>
    `;
    areaImpressao.style.display = 'block';
    const janela = window.open('', '_blank');
    janela.document.write(areaImpressao.innerHTML);
    janela.document.close();
    janela.print();
    janela.close();
    areaImpressao.style.display = 'none';
  }

  function abrirModalPago() {
    if (!mesaSelecionadaId) return;
    const total = totalMesa(mesaSelecionadaId);
    modalValorTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    inputValorRecebido.value = total.toFixed(2);
    modalPago.classList.remove('hidden');
    modalPago.classList.add('flex');
    inputValorRecebido.focus();
  }

  function fecharModalPago() {
    modalPago.classList.add('hidden');
    modalPago.classList.remove('flex');
  }

  function confirmarPagamento() {
    const valor = parseFloat(inputValorRecebido.value.replace(',', '.')) || 0;
    if (valor <= 0) {
      alert('Informe o valor recebido.');
      return;
    }
    const formaEl = document.querySelector('input[name="forma-pagamento"]:checked');
    const formaPagamento = formaEl ? formaEl.value : 'pix';
    const pedidos = getPedidos().filter(p => p.mesaId === mesaSelecionadaId && p.status === 'aberto');
    registrarPagamento(mesaSelecionadaId, valor, pedidos.map(p => p.id), formaPagamento);
    fecharModalPago();
    contaMesaSection.classList.add('hidden');
    mesaSelecionadaId = null;
    renderMesas();
  }

  btnNovaMesa.addEventListener('click', () => abrirModalMesa(null));
  btnCancelarMesa.addEventListener('click', fecharModalMesa);
  btnSalvarMesa.addEventListener('click', salvarMesa);
  modalMesa.querySelector('.fechar-modal').addEventListener('click', fecharModalMesa);

  btnImprimir.addEventListener('click', imprimirConta);
  btnContaPaga.addEventListener('click', abrirModalPago);

  btnCancelarPago.addEventListener('click', fecharModalPago);
  btnConfirmarPago.addEventListener('click', confirmarPagamento);
  modalPago.querySelector('.fechar-modal').addEventListener('click', fecharModalPago);

  // Atualiza quando pedidos mudam em outra aba (página do cliente)
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEYS.PEDIDOS || e.key === STORAGE_KEYS.MESAS) {
      renderMesas();
      if (mesaSelecionadaId) abrirConta(mesaSelecionadaId);
    }
  });

  // Atualiza ao voltar para esta aba
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      renderMesas();
      if (mesaSelecionadaId) abrirConta(mesaSelecionadaId);
    }
  });

  // Atualiza a cada 3 segundos para manter interligado com a página de pedidos
  setInterval(function () {
    renderMesas();
    if (mesaSelecionadaId) abrirConta(mesaSelecionadaId);
  }, 3000);

  // Mostra o endereço correto para a página de pedidos
  var el = document.getElementById('url-pedido-exemplo');
  if (el) el.textContent = window.location.origin;

  renderMesas();
})();
