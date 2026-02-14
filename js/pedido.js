(function () {
  const selectMesa = document.getElementById('select-mesa');
  const menuGrid = document.getElementById('menu-grid');
  const totalCarrinhoEl = document.getElementById('total-carrinho');
  const resumoItensEl = document.getElementById('resumo-itens');
  const btnEnviar = document.getElementById('btn-enviar-pedido');
  const modalConfirma = document.getElementById('modal-confirma');
  const btnNovoPedido = document.getElementById('btn-novo-pedido');

  let carrinho = [];

  function atualizarSelectMesas() {
    const mesas = getMesas();
    selectMesa.innerHTML = '<option value="">-- Escolha a mesa --</option>' +
      mesas.map(m => `<option value="${m.id}">Mesa ${m.numero}</option>`).join('');
  }

  function renderMenu() {
    const cardapio = getCardapio();
    menuGrid.innerHTML = cardapio.map(item => {
      const qtd = carrinho.find(c => c.id === item.id && !c.observacao)?.quantidade || 0;
      const selecionado = qtd > 0;
      return `
        <div class="item-menu rounded-2xl bg-white shadow-lg border-2 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${selecionado ? 'border-italian-red ring-2 ring-italian-red/30' : 'border-amber-200'}">
          <div class="p-4">
            <div class="font-semibold text-lg text-italian-brown mb-1">${item.nome}</div>
            <div class="text-sm text-italian-brown-light mb-2 leading-snug">${item.descricao}</div>
            <div class="text-xl font-bold text-italian-red">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
          </div>
          <div class="px-4 pb-4 flex items-center gap-3">
            <label class="text-sm text-italian-brown font-medium">Qtd</label>
            <input type="number" min="0" value="${qtd}" data-id="${item.id}" data-preco="${item.preco}" data-nome="${item.nome}"
              class="w-20 px-3 py-2 rounded-xl border-2 border-amber-300 bg-amber-50 text-center font-semibold text-italian-brown focus:ring-2 focus:ring-italian-red focus:border-italian-red outline-none" />
          </div>
        </div>
      `;
    }).join('');

    menuGrid.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('change', function () {
        const id = this.dataset.id;
        const preco = parseFloat(this.dataset.preco);
        const nome = this.dataset.nome;
        const qtd = parseInt(this.value, 10) || 0;
        carrinho = carrinho.filter(c => c.id !== id);
        if (qtd > 0) {
          carrinho.push({ id, nome, preco, quantidade: qtd });
        }
        atualizarCarrinho();
        renderMenu();
      });
    });
  }

  function atualizarCarrinho() {
    const total = carrinho.reduce((s, i) => s + i.preco * (i.quantidade || 1), 0);
    const itens = carrinho.reduce((s, i) => s + (i.quantidade || 1), 0);
    totalCarrinhoEl.textContent = total.toFixed(2).replace('.', ',');
    resumoItensEl.textContent = itens + ' item(ns)';
  }

  function enviarPedido() {
    const mesaId = selectMesa.value;
    if (!mesaId) {
      alert('Selecione uma mesa.');
      return;
    }
    if (carrinho.length === 0) {
      alert('Adicione pelo menos um item ao pedido.');
      return;
    }
    addPedido(mesaId, carrinho);
    carrinho = [];
    atualizarCarrinho();
    renderMenu();
    modalConfirma.classList.remove('hidden');
    modalConfirma.classList.add('flex');
  }

  btnEnviar.addEventListener('click', enviarPedido);

  function fecharModal() {
    modalConfirma.classList.add('hidden');
    modalConfirma.classList.remove('flex');
  }

  modalConfirma.querySelector('.fechar-modal').addEventListener('click', fecharModal);

  btnNovoPedido.addEventListener('click', fecharModal);

  atualizarSelectMesas();
  renderMenu();
})();
