// Função para carregar produtos na tabela
async function carregarProdutos() {
    try {
        // Busca produtos do banco
        const produtos = await window.api.product.find({ excluido: false });

        const tbody = document.querySelector('#table-products tbody');
        tbody.innerHTML = ''; // limpa linhas antigas

        produtos.forEach(p => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>R$ ${Number(p.preco_venda || 0).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="editarProduto(${p.id})">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletarProduto(${p.id})">
                        Excluir
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Inicializa DataTables depois de preencher as linhas
        $('#table-products').DataTable({
            destroy: true, // destrói qualquer instância anterior
            paging: true,
            searching: true,
            ordering: true,
            info: true
        });

    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
    }
}

// Função para editar produto
async function editarProduto(id) {
    const produto = await api.product.findById(id);
    if (!produto) {
        toast('error', 'Erro', 'Produto não encontrado.');
        return;
    }
    await api.temp.set('product:edit', { action: 'e', ...produto });
    api.window.openModal('pages/product', { width: 900, height: 600, title: 'Editar Produto' });
}

// Função para deletar produto
async function deletarProduto(id) {
    const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
        const result = await api.product.delete(id);
        if (result.status) {
            toast('success', 'Excluído', result.msg);
            carregarProdutos(); // recarrega tabela
        } else {
            toast('error', 'Erro', result.msg);
        }
    }
}

// Atualiza tabela quando o backend sinaliza reload
window.api.product.onReload(carregarProdutos);

// Chama ao carregar a página
document.addEventListener('DOMContentLoaded', carregarProdutos);

// Expor funções para HTML
window.editarProduto = editarProduto;
window.deletarProduto = deletarProduto;