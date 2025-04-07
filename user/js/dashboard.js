async function buscarCustos() {
    try {
        const response = await fetch('https://serverfinanweb.onrender.com/api');
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar custos:", error);
        return []; // Retorna um array vazio em caso de erro
    }
}

function atualizarTabelaCustos(custos) {
    const tbody = document.querySelector('#tabelaCustos tbody');
    tbody.innerHTML = '';

    for (const key in custos) { // Itera sobre as chaves do objeto
        const custo = custos[key];
        if (custo) {
            const row = tbody.insertRow();
            const descricaoCell = row.insertCell();
            const valorCell = row.insertCell();

            descricaoCell.textContent = custo.descricao || "";
            valorCell.textContent = custo.valor || "";
        }
    }
}


function calcularTotalReceita(custos) {
    let total = 0;
    for (const key in custos) {
        if (custos[key]) {
            total += parseFloat(custos[key].receita) || 0; // Suponha que 'receita' seja o campo
        }
    }
    return total;
}

function atualizarTotalReceita(total) {
    document.getElementById('totalReceita').textContent = `R$${total.toFixed(2)}`;
}
function atualizarPorcentagemMC(custos) {
  let totalReceita = 0;
  let totalCustos = 0;

  for (const key in custos) {
    if (custos[key]) {
      totalReceita += parseFloat(custos[key].receita) || 0; // Assumindo um campo 'receita'
      totalCustos += parseFloat(custos[key].custo) || 0;   // Assumindo um campo 'custo'
    }
  }

  // Calcula a %MC (Margem de Contribuição)
  let porcentagemMC = 0;
  if (totalReceita > 0) {
    porcentagemMC = ((totalReceita - totalCustos) / totalReceita) * 100;
  }

  // Atualiza o elemento HTML com a %MC calculada
  const porcentagemMCElement = document.getElementById('porcentagemMC');
  if (porcentagemMCElement) {
    porcentagemMCElement.textContent = porcentagemMC.toFixed(0) + '%'; // Formata para 0 casas decimais
  }
}

document.addEventListener('DOMContentLoaded', async () => {
    const custos = await buscarCustos();

    if (custos) {
        atualizarTabelaCustos(custos);

        // Calcula e exibe o total da receita
        const totalReceita = calcularTotalReceita(custos);
        atualizarTotalReceita(totalReceita);
        atualizarPorcentagemMC(custos);
    }
});