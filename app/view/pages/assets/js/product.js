const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action');
const Id = document.getElementById('id');
const form = document.getElementById('product-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    // Pega valores do formulário
    const name = document.getElementById('product-name').value;
    const preco = document.getElementById('product-price').value;
    const unidade = document.getElementById('product-unit')?.value || '';
    const descricao = document.getElementById('product-description')?.value || '';

    // Remove máscara do preço: R$ 1.234,56 -> 1234.56
    const preco_venda = parseFloat(preco.replace(/\./g, '').replace(',', '.')) || 0;

    const product = {
        name,
        preco_venda,
        unidade,
        descricao,
        ativo: true,
        editar: true,
        excluido: false
    };

    try {
        const editData = await api.temp.get('product:edit');

        const response = editData
            ? await api.product.update(editData.id, product)
            : await api.product.insert(product);

        if (!response.status) {
            toast('error', 'Erro', response.msg);
            return;
        }

        toast('success', 'Produto salvo com sucesso', response.msg);
        form.reset();
        api.temp.set('product:edit', null); // limpa edição
        setTimeout(() => api.window.close(), 1500);

    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    } finally {
        $('#insert').prop('disabled', false);
    }
});