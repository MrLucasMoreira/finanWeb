const API_URL = "https://serverfinanweb.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", path: "custos" })
    })
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector("#custosFinanceirosTable tbody");
        let total = 0;

        for (const id in data) {
            const item = data[id];
            if (!item) continue; // <-- Evita erro de desestruturação

            const { descricao, valor, categoria } = item;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${descricao}</td>
                <td class="text-end">R$ ${parseFloat(valor).toFixed(2)}</td>
                <td>${categoria}</td>
            `;
            tbody.appendChild(row);

            total += parseFloat(valor);
        }

        document.getElementById("totalCustos").textContent = `R$ ${total.toFixed(2)}`;
    })
    .catch(err => {
        console.error("Erro ao carregar os dados:", err);
        alert("Erro ao carregar os custos financeiros.");
    });
});
