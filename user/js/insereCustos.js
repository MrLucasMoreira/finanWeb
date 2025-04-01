// custos.js

function adicionarCusto() {
    const table = document.getElementById('custosFinanceirosTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const descCell = newRow.insertCell();
    const valorCell = newRow.insertCell();
    const categCell = newRow.insertCell();
    const acoesCell = newRow.insertCell();

    descCell.innerHTML = `<input type="text" class="form-control form-control-sm" placeholder="Descrição">`;
    valorCell.innerHTML = `<input type="number" class="form-control form-control-sm text-end" placeholder="Valor" onchange="calcularTotal()">`;
    categCell.innerHTML = '<input type="text" class="form-control form-control-sm text-end" placeholder="Categoria">';
    acoesCell.innerHTML = `<button class="btn btn-sm btn-danger" onclick="removerCusto(this)">Remover</button>`;

    calcularTotal();
}

function removerCusto(button) {
    const row = button.parentNode.parentNode;
    row.remove();
    calcularTotal();
}

function calcularTotal() {
    const rows = document.querySelectorAll('#custosFinanceirosTable tbody tr');
    let total = 0;
    rows.forEach(row => {
        const valorInput = row.querySelector('input[type="number"]');
        if (valorInput && valorInput.value) {// insereCustos.js

            const API_URL = "https://serverfinanweb.onrender.com/custos"; // Ajuste conforme necessário
            
            async function carregarCustos() {
                try {
                    const response = await fetch(API_URL);
                    const data = await response.json();
                    const table = document.querySelector("#custosFinanceirosTable tbody");
                    table.innerHTML = "";
            
                    Object.entries(data).forEach(([id, custo]) => {
                        adicionarLinhaCusto(id, custo.descricao, custo.valor, custo.categoria);
                    });
            
                    calcularTotal();
                } catch (error) {
                    console.error("Erro ao carregar custos:", error);
                }
            }
            
            function adicionarLinhaCusto(id, descricao = "", valor = "", categoria = "") {
                const table = document.querySelector("#custosFinanceirosTable tbody");
                const row = table.insertRow();
            
                row.setAttribute("data-id", id);
            
                row.innerHTML = `
                    <td><input type="text" class="form-control form-control-sm" value="${descricao}" placeholder="Descrição"></td>
                    <td><input type="number" class="form-control form-control-sm text-end" value="${valor}" placeholder="Valor" onchange="calcularTotal()"></td>
                    <td><input type="text" class="form-control form-control-sm text-end" value="${categoria}" placeholder="Categoria"></td>
                    <td><button class="btn btn-sm btn-danger" onclick="removerCusto(this)">Remover</button></td>
                `;
            
                calcularTotal();
            }
            
            async function salvarCustos() {
                const rows = document.querySelectorAll("#custosFinanceirosTable tbody tr");
                for (const row of rows) {
                    const id = row.getAttribute("data-id");
                    const descricao = row.cells[0].querySelector("input").value;
                    const valor = row.cells[1].querySelector("input").value;
                    const categoria = row.cells[2].querySelector("input").value;
            
                    if (!descricao || !valor || !categoria) continue;
            
                    const custo = { descricao, valor, categoria };
            
                    try {
                        if (id) {
                            await fetch(`${API_URL}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(custo) });
                        } else {
                            const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(custo) });
                            const data = await response.json();
                            row.setAttribute("data-id", data.id);
                        }
                    } catch (error) {
                        console.error("Erro ao salvar custo:", error);
                    }
                }
                alert("Custos salvos com sucesso!");
            }
            
            async function removerCusto(button) {
                const row = button.closest("tr");
                const id = row.getAttribute("data-id");
            
                if (id) {
                    try {
                        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                    } catch (error) {
                        console.error("Erro ao excluir custo:", error);
                        return;
                    }
                }
            
                row.remove();
                calcularTotal();
            }
            
            function calcularTotal() {
                let total = 0;
                document.querySelectorAll("#custosFinanceirosTable tbody tr").forEach(row => {
                    const valor = parseFloat(row.cells[1].querySelector("input").value) || 0;
                    total += valor;
                });
            
                document.getElementById("totalCustos").textContent = `R$ ${total.toFixed(2)}`;
            }
            
            document.addEventListener("DOMContentLoaded", carregarCustos);
            window.adicionarCusto = () => adicionarLinhaCusto(null);
            window.removerCusto = removerCusto;
            window.salvarCustos = salvarCustos;
            window.calcularTotal = calcularTotal;
            
            total += parseFloat(valorInput.value);
        }
    });

    document.getElementById('totalCustos').textContent = `R$ ${total.toFixed(2)}`;
}

function salvarCustos() {
    const custos = [];
    const rows = document.querySelectorAll('#custosFinanceirosTable tbody tr');
    rows.forEach(row => {
        const descricao = row.cells[0].querySelector('input').value;
        const valor = row.cells[1].querySelector('input').value;
        custos.push({ descricao, valor });
    });


    localStorage.setItem('custosFinanceiros', JSON.stringify(custos)); // placeholder
    alert("Custos salvos com sucesso! (Exemplo usando localStorage)");

}


// Ensure functions are globally accessible (important!)
window.adicionarCusto = adicionarCusto;
window.removerCusto = removerCusto;
window.calcularTotal = calcularTotal;
window.salvarCustos = salvarCustos;