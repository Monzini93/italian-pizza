(function () {
  const stepDados = document.getElementById('step-dados');
  const stepCardapio = document.getElementById('step-cardapio');
  const stepPagamento = document.getElementById('step-pagamento');
  const menuTabs = document.getElementById('menu-tabs');
  const menuGrid = document.getElementById('menu-grid');
  const pagTotal = document.getElementById('pag-total');
  const blocoCartao = document.getElementById('bloco-cartao');
  const blocoPix = document.getElementById('bloco-pix');
  const blocoEntrega = document.getElementById('bloco-entrega');
  const modalSucesso = document.getElementById('modal-sucesso');

  let cliente = null;
  let carrinho = [];
  let categoriaAtiva = null;

  function showStep(step) {
    stepDados.classList.add('hidden');
    stepCardapio.classList.add('hidden');
    stepPagamento.classList.add('hidden');
    blocoCartao.classList.add('hidden');
    blocoPix.classList.add('hidden');
    blocoEntrega.classList.add('hidden');
    if (step === 'dados') stepDados.classList.remove('hidden');
    if (step === 'cardapio') stepCardapio.classList.remove('hidden');
    if (step === 'pagamento') {
      stepPagamento.classList.remove('hidden');
      const total = carrinho.reduce((s, i) => s + i.preco * (i.quantidade || 1), 0);
      pagTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
      var forma = document.querySelector('input[name="forma"]:checked');
      if (forma) trocarForma(forma.value);
    }
  }

  function trocarForma(valor) {
    blocoCartao.classList.add('hidden');
    blocoPix.classList.add('hidden');
    blocoEntrega.classList.add('hidden');
    if (valor === 'credito' || valor === 'debito') blocoCartao.classList.remove('hidden');
    if (valor === 'pix') blocoPix.classList.remove('hidden');
    if (valor === 'entrega') blocoEntrega.classList.remove('hidden');
  }

  document.querySelectorAll('.payment-opt').forEach(function (label) {
    label.querySelector('input').addEventListener('change', function () {
      trocarForma(this.value);
    });
  });

  document.getElementById('btn-ir-cardapio').addEventListener('click', function () {
    var nome = document.getElementById('cliente-nome').value.trim();
    var rua = document.getElementById('cliente-rua').value.trim();
    var numero = document.getElementById('cliente-numero').value.trim();
    var cep = document.getElementById('cliente-cep').value.trim();
    var telefone = document.getElementById('cliente-telefone').value.trim();
    if (!nome || !rua || !numero || !cep || !telefone) {
      alert('Preencha todos os dados.');
      return;
    }
    cliente = { nome, rua, numero, cep, telefone };
    showStep('cardapio');
    renderTabs();
    renderMenu();
  });

  document.getElementById('btn-voltar-dados').addEventListener('click', function () {
    showStep('dados');
  });

  document.getElementById('btn-ir-pagamento').addEventListener('click', function () {
    if (carrinho.length === 0) {
      alert('Adicione pelo menos um item ao pedido.');
      return;
    }
    showStep('pagamento');
  });

  document.getElementById('btn-voltar-cardapio').addEventListener('click', function () {
    showStep('cardapio');
  });

  function getCategorias() {
    var cardapio = getCardapio();
    var cats = {};
    cardapio.forEach(function (item) {
      var cat = item.categoria || 'Outros';
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(item);
    });
    return Object.keys(cats).sort();
  }

  function renderTabs() {
    var categorias = getCategorias();
    if (categorias.length === 0) {
      menuTabs.innerHTML = '';
      return;
    }
    if (categoriaAtiva === null) categoriaAtiva = categorias[0];
    menuTabs.innerHTML = categorias.map(function (cat) {
      var ativa = cat === categoriaAtiva;
      return '<button type="button" class="tab-categoria px-4 py-2.5 rounded-xl font-semibold transition ' +
        (ativa ? 'bg-italian-red text-white shadow-md' : 'bg-white text-italian-brown border-2 border-amber-200 hover:border-italian-red hover:bg-amber-50') +
        '" data-categoria="' + cat + '">' + cat + '</button>';
    }).join('');
    menuTabs.querySelectorAll('.tab-categoria').forEach(function (btn) {
      btn.addEventListener('click', function () {
        categoriaAtiva = this.dataset.categoria;
        renderTabs();
        renderMenu();
      });
    });
  }

  function renderMenu() {
    var cardapio = getCardapio();
    var categorias = getCategorias();
    if (categorias.length > 0 && categoriaAtiva === null) categoriaAtiva = categorias[0];
    var itens = categoriaAtiva
      ? cardapio.filter(function (item) { return (item.categoria || 'Outros') === categoriaAtiva; })
      : cardapio;
    var html = itens.map(function (item) {
      var qtd = carrinho.find(function (c) { return c.id === item.id; }) ? (carrinho.find(function (c) { return c.id === item.id; }).quantidade || 0) : 0;
      var sel = qtd > 0 ? 'border-italian-red ring-2 ring-italian-red/30' : 'border-amber-200';
      return '<div class="rounded-2xl bg-white shadow-lg border-2 overflow-hidden ' + sel + '">' +
        '<div class="p-4"><div class="font-semibold text-italian-brown">' + item.nome + '</div>' +
        '<div class="text-sm text-italian-brown-light mb-2">' + (item.descricao || '') + '</div>' +
        '<div class="text-lg font-bold text-italian-red">R$ ' + item.preco.toFixed(2).replace('.', ',') + '</div></div>' +
        '<div class="px-4 pb-4"><label class="text-sm text-italian-brown">Qtd</label> ' +
        '<input type="number" min="0" value="' + qtd + '" data-id="' + item.id + '" data-preco="' + item.preco + '" data-nome="' + item.nome + '" class="w-20 ml-2 px-2 py-1.5 rounded-lg border-2 border-amber-300" /></div></div>';
    }).join('');
    menuGrid.innerHTML = html;

    menuGrid.querySelectorAll('input[type="number"]').forEach(function (input) {
      input.addEventListener('change', function () {
        var id = this.dataset.id;
        var preco = parseFloat(this.dataset.preco);
        var nome = this.dataset.nome;
        var qtd = parseInt(this.value, 10) || 0;
        carrinho = carrinho.filter(function (c) { return c.id !== id; });
        if (qtd > 0) carrinho.push({ id: id, nome: nome, preco: preco, quantidade: qtd });
        renderMenu();
      });
    });
  }

  function enviarPedido(formaPagamento, pago, dadosCartao) {
    if (!cliente) {
      alert('Erro: dados do cliente não encontrados. Refaça o pedido desde o início.');
      return;
    }
    var total = carrinho.reduce(function (s, i) { return s + i.preco * (i.quantidade || 1); }, 0);
    var observacoesEl = document.getElementById('pedido-observacoes');
    var observacoes = (observacoesEl && observacoesEl.value) ? observacoesEl.value.trim() : '';
    try {
      addPedidoViagem({
        cliente: cliente,
        itens: carrinho.map(function (i) { return { id: i.id, nome: i.nome, preco: i.preco, quantidade: i.quantidade || 1 }; }),
        total: total,
        formaPagamento: formaPagamento,
        pago: !!pago,
        dadosCartao: dadosCartao || null,
        observacoes: observacoes || null
      });
    } catch (err) {
      alert('Não foi possível registrar o pedido. Acesse a página de pedidos pelo mesmo endereço do painel (ex: http://localhost:' + (window.location.port || '80') + '/pedido-casa.html).');
      return;
    }
    modalSucesso.classList.remove('hidden');
    modalSucesso.classList.add('flex');
    setTimeout(function () {
      modalSucesso.classList.add('hidden');
      modalSucesso.classList.remove('flex');
      window.location.reload();
    }, 3000);
  }

  document.getElementById('btn-confirmar-cartao').addEventListener('click', function () {
    var forma = document.querySelector('input[name="forma"]:checked');
    var num = document.getElementById('cartao-numero').value.trim();
    var nome = document.getElementById('cartao-nome').value.trim();
    var val = document.getElementById('cartao-validade').value.trim();
    var cvv = document.getElementById('cartao-cvv').value.trim();
    if (!num || !nome || !val || !cvv) {
      alert('Preencha todos os dados do cartão.');
      return;
    }
    enviarPedido(forma ? forma.value : 'credito', true, { numero: num, nome: nome, validade: val, cvv: cvv });
  });

  document.getElementById('btn-copiar-pix').addEventListener('click', function () {
    var codigo = document.getElementById('codigo-pix').textContent;
    navigator.clipboard && navigator.clipboard.writeText(codigo).then(function () { alert('Código PIX copiado!'); });
  });

  document.getElementById('btn-confirmar-pix').addEventListener('click', function () {
    enviarPedido('pix', true);
  });

  document.getElementById('btn-confirmar-entrega').addEventListener('click', function () {
    var forma = document.querySelector('input[name="entrega-forma"]:checked');
    enviarPedido(forma ? forma.value : 'entrega_debito', false);
  });
})();
