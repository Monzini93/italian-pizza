(function () {
  const container = document.getElementById('resumo-mensal');

  function formatarData(d) {
    return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  function formatarValor(v) {
    return 'R$ ' + Number(v).toFixed(2).replace('.', ',');
  }

  function nomeMes(mes) {
    const nomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return nomes[mes - 1] || '';
  }

  function render() {
    const fechamentos = getFechamentosCaixa();
    if (fechamentos.length === 0) {
      container.innerHTML = `
        <div class="bg-white rounded-2xl border border-amber-200 p-8 text-center text-italian-brown-light">
          <p>Nenhum fechamento de caixa registrado ainda.</p>
          <p class="mt-2 text-sm">Vá em <a href="admin-caixa.html" class="text-italian-red font-medium underline">Conferência de Caixa</a> e use o botão "Fechar caixa" para registrar o total do dia.</p>
        </div>
      `;
      return;
    }

    const ordenados = [...fechamentos].sort((a, b) => b.data.localeCompare(a.data));
    const porMes = {};
    for (const f of ordenados) {
      if (!f.data) continue;
      const [ano, mes] = f.data.split('-');
      const key = ano + '-' + mes;
      if (!porMes[key]) porMes[key] = { ano: parseInt(ano, 10), mes: parseInt(mes, 10), itens: [], total: 0 };
      porMes[key].itens.push(f);
      porMes[key].total += f.valor;
    }

    const blocos = Object.keys(porMes).sort().reverse().map(key => {
      const bloco = porMes[key];
      const tituloMes = nomeMes(bloco.mes) + ' de ' + bloco.ano;
      const linhas = bloco.itens.sort((a, b) => b.data.localeCompare(a.data)).map(f => `
        <tr class="hover:bg-amber-50">
          <td class="p-3 border-b border-amber-100">${formatarData(f.data)}</td>
          <td class="p-3 border-b border-amber-100 font-semibold text-italian-green text-right">${formatarValor(f.valor)}</td>
        </tr>
      `).join('');

      return `
        <section class="bg-white rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
          <div class="px-6 py-4 bg-amber-100 border-b border-amber-200 flex justify-between items-center">
            <h3 class="font-display text-xl font-bold text-italian-brown">${tituloMes}</h3>
            <span class="text-lg font-bold text-italian-green">Total: ${formatarValor(bloco.total)}</span>
          </div>
          <table class="w-full">
            <thead>
              <tr class="bg-amber-50 text-italian-brown font-semibold">
                <th class="text-left p-3 border-b border-amber-200">Data</th>
                <th class="text-right p-3 border-b border-amber-200">Valor total do dia</th>
              </tr>
            </thead>
            <tbody>${linhas}</tbody>
          </table>
        </section>
      `;
    });

    container.innerHTML = blocos.join('');
  }

  render();
})();
