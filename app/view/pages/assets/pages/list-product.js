// Inicializa DataTable
$('#table-products').DataTable({
    serverSide: true,
    processing: true,
    ajax: {
        url: '/api/products', // URL correta da rota
        type: 'GET',
        data: function (d) {
            // Envia os parâmetros do DataTables para o backend
            return d;
        },
        dataSrc: function (json) {
            console.log('Dados recebidos do servidor:', json);
            return json.data || [];
        }
    },
    columns: [
        { data: 'id', title: 'ID' },
        { data: 'nome', title: 'Nome' },
        { data: 'preco', title: 'Preço' },
        {
            data: null,
            title: 'Ações',
            render: (data, type, row) => `
                <button onclick="editProduct(${row.id})">Editar</button>
                <button onclick="deleteProduct(${row.id})">Excluir</button>
            `
        }
    ]
});

// Função para deletar produto
async function deleteProduct(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.product.delete(id);
        if (response.status) {
            toast('success', 'Excluído', response.msg);
            $('#table-products').DataTable().ajax.reload();
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

// Função para editar produto
async function editProduct(id) {
    try {
        const product = await api.product.findById(id);
        if (!product) {
            toast('error', 'Erro', 'Produto não encontrado.');
            return;
        }
        await api.temp.set('product:edit', {
            action: 'e',
            ...product,
        });
        api.window.openModal('pages/product', {
            width: 600,
            height: 500,
            title: 'Editar Produto',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}