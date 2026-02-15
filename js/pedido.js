(function () {
  const selectMesa = document.getElementById('select-mesa');
  const menuTabs = document.getElementById('menu-tabs');
  const menuGrid = document.getElementById('menu-grid');
  const totalCarrinhoEl = document.getElementById('total-carrinho');
  const resumoItensEl = document.getElementById('resumo-itens');
  const btnEnviar = document.getElementById('btn-enviar-pedido');
  const modalConfirma = document.getElementById('modal-confirma');
  const btnNovoPedido = document.getElementById('btn-novo-pedido');

  let carrinho = [];
  let categoriaAtiva = null;

  function atualizarSelectMesas() {
    const mesas = getMesas();
    selectMesa.innerHTML = '<option value="">-- Escolha a mesa --</option>' +
      mesas.map(m => `<option value="${m.id}">Mesa ${m.numero}</option>`).join('');
  }

  function getCategorias() {
    const cardapio = getCardapio();
    if (!Array.isArray(cardapio)) return [];
    const cats = {};
    cardapio.forEach(item => {
      const cat = String(item.categoria || 'Outros').trim() || 'Outros';
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(item);
    });
    return Object.keys(cats).sort();
  }

  function renderTabs() {
    const categorias = getCategorias();
    if (categorias.length === 0) {
      menuTabs.innerHTML = '';
      return;
    }
    if (categoriaAtiva === null) categoriaAtiva = categorias[0];
    menuTabs.innerHTML = categorias.map(cat => {
      const ativa = cat === categoriaAtiva;
      if (ativa) {
        return `<button type="button" class="tab-categoria px-4 py-2.5 rounded-xl font-semibold transition shadow-md" style="background-color: #DE332E; color: white;" data-categoria="${cat}">${cat}</button>`;
      }
      return `<button type="button" class="tab-categoria px-4 py-2.5 rounded-xl font-semibold transition border-2 hover:bg-amber-50" style="background-color: #fff; color: #612F1F; border-color: #E3A85B;" data-categoria="${cat}">${cat}</button>`;
    }).join('');
    menuTabs.querySelectorAll('.tab-categoria').forEach(btn => {
      btn.addEventListener('click', function () {
        categoriaAtiva = this.dataset.categoria;
        renderTabs();
        renderMenu();
      });
    });
  }

  function renderMenu() {
    const cardapio = getCardapio();
    if (!Array.isArray(cardapio)) {
      menuGrid.innerHTML = '<p class="col-span-2" style="color: #7C422A;">Carregando cardápio...</p>';
      return;
    }
    const categorias = getCategorias();
    if (categorias.length > 0 && categoriaAtiva === null) categoriaAtiva = categorias[0];
    const catAtiva = categoriaAtiva ? String(categoriaAtiva).trim() : null;
    const itens = catAtiva
      ? cardapio.filter(item => (String(item.categoria || 'Outros').trim()) === catAtiva)
      : cardapio;
    menuGrid.innerHTML = itens.map(item => {
      const qtd = carrinho.find(c => c.id === item.id && !c.observacao)?.quantidade || 0;
      const selecionado = qtd > 0;
      const cardBorder = selecionado ? '2px solid #DE332E' : '2px solid #E3A85B';
      const cardShadow = selecionado ? '0 0 0 3px rgba(222,51,46,0.3)' : 'none';
      return `
        <div class="item-menu rounded-2xl bg-white shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5" style="border: ${cardBorder}; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05), ${cardShadow};">
          <div class="p-4">
            <div class="font-semibold text-lg mb-1" style="color: #612F1F;">${item.nome}</div>
            <div class="text-sm mb-2 leading-snug" style="color: #7C422A;">${item.descricao}</div>
            <div class="text-xl font-bold" style="color: #DE332E;">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
          </div>
          <div class="px-4 pb-4 flex items-center gap-3">
            <label class="text-sm font-medium" style="color: #612F1F;">Qtd</label>
            <input type="number" min="0" value="${qtd}" data-id="${item.id}" data-preco="${item.preco}" data-nome="${item.nome}"
              class="w-20 px-3 py-2 rounded-xl border-2 text-center font-semibold outline-none" style="border-color: #E3A85B; background-color: #FFDBB8; color: #612F1F;" />
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
  renderTabs();
  renderMenu();
})();
