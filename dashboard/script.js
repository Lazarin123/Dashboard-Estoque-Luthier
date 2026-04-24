let items = JSON.parse(localStorage.getItem('luthier_pro_v4')) || [];
let editMode = false;
let charts = {};

// Navegação
function nav(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    event.target.classList.add('active');
    refreshAll();
}

function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }

// Modal Control
function openModal(id = null) {
    editMode = !!id;
    document.getElementById('modal-title').innerText = editMode ? "Editar Item" : "Novo Registro";
    
    if (editMode) {
        const item = items.find(i => i.id === id);
        document.getElementById('m-id').value = item.id;
        document.getElementById('m-nome').value = item.nome;
        document.getElementById('m-qty').value = item.qty;
        document.getElementById('m-min').value = item.min;
        document.getElementById('m-pago').value = item.pago;
        document.getElementById('m-venda').value = item.venda;
    } else {
        document.querySelectorAll('.modal-box input').forEach(i => i.value = "");
    }
    document.getElementById('overlay').style.display = 'flex';
}

function closeModal() { document.getElementById('overlay').style.display = 'none'; }

// Operações de Estoque Rápido
function changeQty(id, delta) {
    const idx = items.findIndex(i => i.id === id);
    if (items[idx].qty + delta >= 0) {
        items[idx].qty += delta;
        saveAndRefresh();
    }
}

// Salvar
function saveItem() {
    const id = document.getElementById('m-id').value;
    const itemData = {
        id: id ? parseInt(id) : Date.now(),
        nome: document.getElementById('m-nome').value,
        qty: parseFloat(document.getElementById('m-qty').value) || 0,
        min: parseFloat(document.getElementById('m-min').value) || 0,
        pago: parseFloat(document.getElementById('m-pago').value) || 0,
        venda: parseFloat(document.getElementById('m-venda').value) || 0
    };

    if (!itemData.nome) return alert("Insira o nome.");

    if (editMode) {
        const idx = items.findIndex(i => i.id === itemData.id);
        items[idx] = itemData;
    } else {
        items.push(itemData);
    }

    saveAndRefresh();
    closeModal();
}

function deleteItem(id) {
    if (confirm("Excluir item?")) {
        items = items.filter(i => i.id !== id);
        saveAndRefresh();
    }
}

function saveAndRefresh() {
    localStorage.setItem('luthier_pro_v4', JSON.stringify(items));
    refreshAll();
}

function refreshAll() {
    renderStats();
    renderEstoque();
    renderFinanceiro();
}

// Renderização de Tabelas
function renderEstoque() {
    const filter = document.getElementById('s-search').value.toLowerCase();
    const tbody = document.getElementById('est-tbody');
    const filtered = items.filter(i => i.nome.toLowerCase().includes(filter));

    tbody.innerHTML = filtered.map(i => `
        <tr>
            <td><b>${i.nome}</b></td>
            <td>
                <div class="qty-control">
                    <button onclick="changeQty(${i.id}, -1)">-</button>
                    <span>${i.qty}</span>
                    <button onclick="changeQty(${i.id}, 1)">+</button>
                </div>
            </td>
            <td>R$ ${i.venda.toFixed(2)}</td>
            <td><span class="badge ${i.qty <= i.min ? 'bad' : 'good'}">${i.qty <= i.min ? 'REPOR' : 'OK'}</span></td>
            <td>
                <button class="btn-edit" onclick="openModal(${i.id})">Editar</button>
                <button class="btn-del" onclick="deleteItem(${i.id})">🗑️</button>
            </td>
        </tr>
    `).join('') || "<tr><td colspan='5'>Estoque vazio.</td></tr>";
}

// Gráficos e Finanças
function renderStats() {
    const invest = items.reduce((a, b) => a + (b.pago * b.qty), 0);
    const rec = items.reduce((a, b) => a + (b.venda * b.qty), 0);
    document.getElementById('dash-stats').innerHTML = `
        <div class="stat-card"><label>Investimento</label><h2>R$ ${invest.toLocaleString()}</h2></div>
        <div class="stat-card"><label>Receita Prevista</label><h2>R$ ${rec.toLocaleString()}</h2></div>
        <div class="stat-card" style="border-color:var(--green)"><label>Lucro</label><h2 style="color:var(--green)">R$ ${(rec - invest).toLocaleString()}</h2></div>
    `;
    updateCharts(invest, rec);
}

function updateCharts(invest, rec) {
    const ctxBar = document.getElementById('barChart').getContext('2d');
    const ctxPie = document.getElementById('pieChart').getContext('2d');

    if (charts.bar) charts.bar.destroy();
    if (charts.pie) charts.pie.destroy();

    charts.bar = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: items.slice(0, 5).map(i => i.nome),
            datasets: [{ label: 'Venda Total (R$)', data: items.slice(0, 5).map(i => i.venda * i.qty), backgroundColor: '#c8a97e' }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    charts.pie = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Custo', 'Lucro'],
            datasets: [{ data: [invest, rec - invest], backgroundColor: ['#c05a4a', '#4a9c6f'], borderWidth: 0 }]
        },
        options: { cutout: '80%' }
    });
}

function renderFinanceiro() {
    const ctxFin = document.getElementById('finChart')?.getContext('2d');
    if (!ctxFin) return;

    if (charts.fin) charts.fin.destroy();
    charts.fin = new Chart(ctxFin, {
        type: 'line',
        data: {
            labels: items.map(i => i.nome),
            datasets: [
                { label: 'Custo Compra', data: items.map(i => i.pago), borderColor: '#c05a4a', fill: false },
                { label: 'Preço Venda', data: items.map(i => i.venda), borderColor: '#4a9c6f', fill: false }
            ]
        }
    });

    const summary = items.map(i => `
        <div class="fin-item">
            <span>${i.nome}</span>
            <b>R$ ${(i.venda - i.pago).toFixed(2)} lucro/un</b>
        </div>
    `).join('');
    document.getElementById('fin-summary').innerHTML = `<h3>Rentabilidade por Item</h3>` + summary;
}

window.onload = refreshAll;
