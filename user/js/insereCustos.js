const API_URL = "https://serverfinanweb.onrender.com/api";
let categorias = [];

document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias();
});

// 🟡 READ - Carregar Categorias
function carregarCategorias() {
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", path: "categorias" })
    })
    .then(response => response.json())
    .then(data => {
        if (!data) throw new Error("Nenhuma categoria encontrada");
        categorias = Object.values(data);
    })
    .catch(error => {
        console.error("Erro ao carregar categorias:", error);
    });
}

// 🟢 CREATE ou 🔵 UPDATE - Salvar Custos
function salvarCustos() {
    const rows = document.querySelectorAll("#custosFinanceirosTable tbody tr");

    rows.forEach(row => {
        let id = row.getAttribute("data-id");
        const descricao = row.cells[0].querySelector("input").value;
        const valor = row.cells[1].querySelector("input").value;
        const categoria = row.cells[2].querySelector("input").value;

        if (!descricao || !valor || !categoria) return;

        const dados = { descricao, valor, categoria };

        if (id) {
            // 🔵 UPDATE
            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "update",
                    path: `custos/${id}`,
                    data: { ...dados, id }
                })
            })
            .then(() => console.log(`Custo ${id} atualizado.`))
            .catch(error => console.error("Erro ao atualizar custo:", error));
        } else {
            // 🟢 CREATE
            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "set",
                    path: "custos",
                    data: dados
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.name) {
                    const newId = data.name;
                    row.setAttribute("data-id", newId);

                    return fetch(API_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            action: "update",
                            path: `custos/${newId}`,
                            data: { ...dados, id: newId }
                        })
                    });
                } else {
                    console.warn("ID não retornado ao inserir novo custo.");
                }
            })
            .catch(error => console.error("Erro ao inserir novo custo:", error));
        }
    });

    Swal.fire("Custos salvos com sucesso!", "", "success");
}

// 🔴 DELETE - Remover Custo
function removerCusto(button) {
    const row = button.closest("tr");
    const id = row.getAttribute("data-id");

    if (id) {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", path: `custos/${id}`, data: { id } })
        })
        .then(() => {
            row.remove();
            calcularTotal();
        })
        .catch(error => console.error("Erro ao excluir custo:", error));
    } else {
        row.remove();
        calcularTotal();
    }
}

// ➕ Adicionar linha na tabela
function adicionarLinhaCusto(id = null, descricao = "", valor = "", categoria = "") {
    const table = document.querySelector("#custosFinanceirosTable tbody");
    const row = table.insertRow();

    row.setAttribute("data-id", id || "");

    const datalistId = `listaCategorias-${Date.now()}`;

    row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" value="${descricao}" placeholder="Descrição"></td>
        <td><input type="number" class="form-control form-control-sm text-end" value="${valor}" placeholder="Valor" onchange="calcularTotal()"></td>
        <td>
            <input type="text" class="form-control form-control-sm categoria-input" placeholder="Categoria" list="${datalistId}">
            <datalist id="${datalistId}"></datalist>
        </td>
        <td><button class="btn btn-sm btn-danger" onclick="removerCusto(this)">Remover</button></td>
    `;

    const datalist = row.querySelector(`#${datalistId}`);
    categorias.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        datalist.appendChild(option);
    });

    calcularTotal();
}

// 🧮 Calcular total dos custos
function calcularTotal() {
    let total = 0;
    document.querySelectorAll("#custosFinanceirosTable tbody tr").forEach(row => {
        const valor = parseFloat(row.cells[1].querySelector("input").value) || 0;
        total += valor;
    });

    document.getElementById("totalCustos").textContent = `R$ ${total.toFixed(2)}`;
}

// Exportar funções para uso global
window.adicionarLinhaCusto = adicionarLinhaCusto;
window.removerCusto = removerCusto;
window.salvarCustos = salvarCustos;
window.calcularTotal = calcularTotal;
