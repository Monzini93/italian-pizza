/**
 * Camada de dados - LocalStorage
 * Mesas, pedidos, pagamentos
 */

const STORAGE_KEYS = {
  MESAS: 'pizzaria_mesas',
  PEDIDOS: 'pizzaria_pedidos',
  PAGAMENTOS: 'pizzaria_pagamentos',
  CARDAPIO: 'pizzaria_cardapio',
  FECHAMENTOS_CAIXA: 'pizzaria_fechamentos_caixa',
  PEDIDOS_VIAGEM: 'pizzaria_pedidos_viagem'
};

// Cardápio padrão
const CARDAPIO_PADRAO = [
  { id: 'p1', nome: 'Margherita', descricao: 'Molho, mussarela, tomate e manjericão', preco: 42.90, categoria: 'Pizzas' },
  { id: 'p2', nome: 'Calabresa', descricao: 'Molho, mussarela e calabresa fatiada', preco: 38.90, categoria: 'Pizzas' },
  { id: 'p3', nome: 'Portuguesa', descricao: 'Molho, mussarela, presunto, ovo e cebola', preco: 45.90, categoria: 'Pizzas' },
  { id: 'p4', nome: 'Quatro Queijos', descricao: 'Mussarela, gorgonzola, parmesão e catupiry', preco: 52.90, categoria: 'Pizzas' },
  { id: 'p5', nome: 'Frango com Catupiry', descricao: 'Molho, frango desfiado e catupiry', preco: 44.90, categoria: 'Pizzas' },
  { id: 'p6', nome: 'Pepperoni', descricao: 'Molho, mussarela e pepperoni', preco: 48.90, categoria: 'Pizzas' },
  { id: 'b1', nome: 'Refrigerante 2L', descricao: 'Coca-Cola, Guaraná ou Fanta', preco: 12.00, categoria: 'Bebidas' },
  { id: 'b2', nome: 'Suco Natural', descricao: 'Laranja, limão ou maracujá 500ml', preco: 10.00, categoria: 'Bebidas' },
  { id: 'b3', nome: 'Água 500ml', descricao: 'Água mineral', preco: 4.00, categoria: 'Bebidas' },
  { id: 'b4', nome: 'Cerveja 600ml', descricao: 'Long neck', preco: 10.00, categoria: 'Bebidas' }
];

function getCardapio() {
  const salvo = localStorage.getItem(STORAGE_KEYS.CARDAPIO);
  if (salvo) return JSON.parse(salvo);
  localStorage.setItem(STORAGE_KEYS.CARDAPIO, JSON.stringify(CARDAPIO_PADRAO));
  return CARDAPIO_PADRAO;
}

function setCardapio(cardapio) {
  localStorage.setItem(STORAGE_KEYS.CARDAPIO, JSON.stringify(cardapio));
}

function addItemCardapio(item) {
  const cardapio = getCardapio();
  const id = 'item' + (Date.now().toString(36) + Math.random().toString(36).slice(2)).slice(0, 8);
  cardapio.push({
    id,
    nome: item.nome,
    descricao: item.descricao || '',
    preco: Number(item.preco),
    categoria: item.categoria || 'Outros'
  });
  setCardapio(cardapio);
  return id;
}

function updateItemCardapio(id, item) {
  const cardapio = getCardapio().map(i =>
    i.id === id
      ? { ...i, nome: item.nome, descricao: item.descricao || '', preco: Number(item.preco), categoria: item.categoria || 'Outros' }
      : i
  );
  setCardapio(cardapio);
}

function removeItemCardapio(id) {
  setCardapio(getCardapio().filter(i => i.id !== id));
}

function getMesas() {
  const salvo = localStorage.getItem(STORAGE_KEYS.MESAS);
  if (salvo) return JSON.parse(salvo);
  const iniciais = [
    { id: 'm1', numero: 1 },
    { id: 'm2', numero: 2 },
    { id: 'm3', numero: 3 }
  ];
  localStorage.setItem(STORAGE_KEYS.MESAS, JSON.stringify(iniciais));
  return iniciais;
}

function setMesas(mesas) {
  localStorage.setItem(STORAGE_KEYS.MESAS, JSON.stringify(mesas));
}

function addMesa(numero) {
  const mesas = getMesas();
  const id = 'm' + (Date.now().toString(36) + Math.random().toString(36).slice(2)).slice(0, 8);
  mesas.push({ id, numero: Number(numero) });
  setMesas(mesas);
  return id;
}

function updateMesa(id, numero) {
  const mesas = getMesas().map(m => m.id === id ? { ...m, numero: Number(numero) } : m);
  setMesas(mesas);
}

function removeMesa(id) {
  setMesas(getMesas().filter(m => m.id !== id));
}

function getPedidos() {
  const salvo = localStorage.getItem(STORAGE_KEYS.PEDIDOS);
  return salvo ? JSON.parse(salvo) : [];
}

function setPedidos(pedidos) {
  localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
}

function addPedido(mesaId, itens) {
  const pedidos = getPedidos();
  const id = 'ped' + Date.now();
  const pedido = {
    id,
    mesaId,
    itens: itens.map(i => ({ ...i })),
    status: 'aberto',
    criadoEm: new Date().toISOString()
  };
  pedidos.push(pedido);
  setPedidos(pedidos);
  return id;
}

function getPedidosPorMesa(mesaId) {
  return getPedidos().filter(p => p.mesaId === mesaId && p.status === 'aberto');
}

function getTodosItensMesa(mesaId) {
  const pedidos = getPedidosPorMesa(mesaId);
  const mapa = new Map();
  for (const p of pedidos) {
    for (const item of p.itens) {
      const key = item.id + '_' + (item.observacao || '');
      const atual = mapa.get(key) || { ...item, quantidade: 0 };
      atual.quantidade += item.quantidade || 1;
      mapa.set(key, atual);
    }
  }
  return Array.from(mapa.values());
}

function totalMesa(mesaId) {
  return getTodosItensMesa(mesaId).reduce((s, i) => s + (i.preco * (i.quantidade || 1)), 0);
}

function fecharPedidosMesa(mesaId) {
  const pedidos = getPedidos();
  const atualizados = pedidos.map(p => 
    p.mesaId === mesaId && p.status === 'aberto' ? { ...p, status: 'fechado' } : p
  );
  setPedidos(atualizados);
}

function getPagamentos() {
  const salvo = localStorage.getItem(STORAGE_KEYS.PAGAMENTOS);
  return salvo ? JSON.parse(salvo) : [];
}

function setPagamentos(pagamentos) {
  localStorage.setItem(STORAGE_KEYS.PAGAMENTOS, JSON.stringify(pagamentos));
}

function registrarPagamento(mesaId, valor, ordemIds, formaPagamento) {
  const pagamentos = getPagamentos();
  const id = 'pag' + Date.now();
  const forma = formaPagamento || 'pix';
  pagamentos.push({
    id,
    mesaId,
    valor: Number(valor),
    ordemIds: ordemIds || [],
    formaPagamento: forma,
    origem: 'mesa',
    dataHora: new Date().toISOString(),
    data: new Date().toISOString().slice(0, 10)
  });
  setPagamentos(pagamentos);
  fecharPedidosMesa(mesaId);
  return id;
}

function registrarPagamentoViagem(valor, formaPagamento) {
  const pagamentos = getPagamentos();
  pagamentos.push({
    id: 'pag' + Date.now(),
    mesaId: null,
    valor: Number(valor),
    ordemIds: [],
    formaPagamento: formaPagamento || 'pix',
    origem: 'viagem',
    dataHora: new Date().toISOString(),
    data: new Date().toISOString().slice(0, 10)
  });
  setPagamentos(pagamentos);
}

function getValoresPorDia() {
  const pagamentos = getPagamentos();
  const porDia = {};
  for (const p of pagamentos) {
    const d = p.data || p.dataHora.slice(0, 10);
    porDia[d] = (porDia[d] || 0) + p.valor;
  }
  return Object.entries(porDia).sort((a, b) => b[0].localeCompare(a[0]));
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function getFechamentosCaixa() {
  const salvo = localStorage.getItem(STORAGE_KEYS.FECHAMENTOS_CAIXA);
  return salvo ? JSON.parse(salvo) : [];
}

function setFechamentosCaixa(fechamentos) {
  localStorage.setItem(STORAGE_KEYS.FECHAMENTOS_CAIXA, JSON.stringify(fechamentos));
}

function fecharCaixa(data, valor) {
  const fechamentos = getFechamentosCaixa();
  const jaFechado = fechamentos.some(f => f.data === data);
  if (jaFechado) return false;
  fechamentos.push({
    id: 'fech' + Date.now(),
    data: data,
    valor: Number(valor),
    fechadoEm: new Date().toISOString()
  });
  setFechamentosCaixa(fechamentos);
  return true;
}

function getFechamentoPorDia(data) {
  return getFechamentosCaixa().find(f => f.data === data);
}

function getTotalPorMes(ano, mes) {
  const fechamentos = getFechamentosCaixa();
  const mesStr = String(mes).padStart(2, '0');
  const prefixo = ano + '-' + mesStr;
  return fechamentos
    .filter(f => f.data && f.data.startsWith(prefixo))
    .reduce((s, f) => s + f.valor, 0);
}

function getPedidosViagem() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEYS.PEDIDOS_VIAGEM);
    if (!salvo) return [];
    const arr = JSON.parse(salvo);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function setPedidosViagem(pedidos) {
  localStorage.setItem(STORAGE_KEYS.PEDIDOS_VIAGEM, JSON.stringify(pedidos));
}

function addPedidoViagem(pedido) {
  const lista = getPedidosViagem();
  const id = 'viagem' + Date.now();
  lista.push({ id, ...pedido, criadoEm: new Date().toISOString() });
  setPedidosViagem(lista);
  return id;
}

function removePedidoViagem(id) {
  setPedidosViagem(getPedidosViagem().filter(p => p.id !== id));
}

function darBaixaPedidoViagem(id) {
  const pedido = getPedidosViagem().find(p => p.id === id);
  if (!pedido) return false;
  registrarPagamentoViagem(pedido.total, pedido.formaPagamento);
  removePedidoViagem(id);
  return true;
}
