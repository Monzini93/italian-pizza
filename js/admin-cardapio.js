(function () {
  const listaCardapio = document.getElementById('lista-cardapio');
  const btnNovoItem = document.getElementById('btn-novo-item');
  const modalItem = document.getElementById('modal-item');
  const modalTitulo = document.getElementById('modal-item-titulo');
  const formItem = document.getElementById('form-item');
  const inputNome = document.getElementById('item-nome');
  const inputDescricao = document.getElementById('item-descricao');
  const inputCategoria = document.getElementById('item-categoria');
  const inputPreco = document.getElementById('item-preco');
  const btnCancelar = document.getElementById('btn-cancelar-item');
  const btnSalvar = document.getElementById('btn-salvar-item');

  let editandoId = null;

  function formatarPreco(v) {
    return 'R$ ' + Number(v).toFixed(2).replace('.', ',');
  }

  function groupByCategoria(itens) {
    const porCategoria = {};
    itens.forEach(item => {
      const cat = item.categoria || 'Outros';
      if (!porCategoria[cat]) porCategoria[cat] = [];
      porCategoria[cat].push(item);
    });
    return Object.keys(porCategoria).sort().map(cat => ({ categoria: cat, itens: porCategoria[cat] }));
  }

  function render() {
    const itens = getCardapio();
    if (itens.length === 0) {
      listaCardapio.innerHTML = '<div class="bg-white rounded-2xl shadow-xl border border-amber-200 p-8 text-center text-italian-brown-light">Nenhum item no cardápio. Clique em "Novo item" para cadastrar.</div>';
      return;
    }
    const grupos = groupByCategoria(itens);
    listaCardapio.innerHTML = grupos.map(({ categoria, itens: itensCat }) => `
      <div class="bg-white rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
        <h3 class="bg-amber-100 text-italian-brown font-display font-bold text-lg px-4 py-3 border-b border-amber-200">${categoria}</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-amber-50 text-italian-brown font-semibold">
                <th class="text-left p-3 border-b border-amber-200">Nome</th>
                <th class="text-left p-3 border-b border-amber-200">Descrição</th>
                <th class="text-right p-3 border-b border-amber-200">Preço</th>
                <th class="text-right p-3 border-b border-amber-200 w-28">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${itensCat.map(item => `
                <tr class="hover:bg-amber-50 border-b border-amber-100">
                  <td class="p-3 font-medium text-italian-brown">${item.nome}</td>
                  <td class="p-3 text-italian-brown-light text-sm max-w-xs truncate">${item.descricao || '—'}</td>
                  <td class="p-3 text-right font-semibold text-italian-green">${formatarPreco(item.preco)}</td>
                  <td class="p-3 text-right">
                    <button type="button" class="editar-item px-2 py-1 rounded-lg text-sm border border-italian-brown text-italian-brown hover:bg-amber-100 mr-1" data-id="${item.id}">Editar</button>
                    <button type="button" class="apagar-item px-2 py-1 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700" data-id="${item.id}">Apagar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('');
  }

  listaCardapio.addEventListener('click', function (e) {
    const btnEditar = e.target.closest('.editar-item');
    const btnApagar = e.target.closest('.apagar-item');
    if (btnEditar) abrirModalEditar(btnEditar.dataset.id);
    if (btnApagar) {
      if (confirm('Remover este item do cardápio?')) {
        removeItemCardapio(btnApagar.dataset.id);
        render();
      }
    }
  });

  function abrirModalNovo() {
    editandoId = null;
    modalTitulo.textContent = 'Novo item';
    inputNome.value = '';
    inputDescricao.value = '';
    inputCategoria.value = 'Pizzas';
    inputPreco.value = '';
    modalItem.classList.remove('hidden');
    modalItem.classList.add('flex');
    inputNome.focus();
  }

  function abrirModalEditar(id) {
    const item = getCardapio().find(i => i.id === id);
    if (!item) return;
    editandoId = id;
    modalTitulo.textContent = 'Editar item';
    inputNome.value = item.nome;
    inputDescricao.value = item.descricao || '';
    inputCategoria.value = item.categoria || 'Outros';
    inputPreco.value = String(item.preco);
    modalItem.classList.remove('hidden');
    modalItem.classList.add('flex');
    inputNome.focus();
  }

  function fecharModal() {
    modalItem.classList.add('hidden');
    modalItem.classList.remove('flex');
    editandoId = null;
  }

  function salvar() {
    const nome = inputNome.value.trim();
    const preco = parseFloat(inputPreco.value.replace(',', '.')) || 0;
    if (!nome) {
      alert('Informe o nome do item.');
      return;
    }
    if (preco < 0) {
      alert('Informe um preço válido.');
      return;
    }
    const dados = {
      nome,
      descricao: inputDescricao.value.trim(),
      categoria: inputCategoria.value || 'Outros',
      preco
    };
    if (editandoId) {
      updateItemCardapio(editandoId, dados);
    } else {
      addItemCardapio(dados);
    }
    fecharModal();
    render();
  }

  btnNovoItem.addEventListener('click', abrirModalNovo);
  btnCancelar.addEventListener('click', fecharModal);
  btnSalvar.addEventListener('click', salvar);
  modalItem.querySelector('.fechar-modal-item').addEventListener('click', fecharModal);

  formItem.addEventListener('submit', function (e) {
    e.preventDefault();
    salvar();
  });

  render();
})();
