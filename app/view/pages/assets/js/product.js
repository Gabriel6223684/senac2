const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action');
const Id = document.getElementById('id');
const form = document.getElementById('product-form');



(async () => {
    const editData = await api.temp.get('product:edit');
    if (editData) {
        Action.value = editData.action || 'e';
        Id.value = editData.id || '';
        for (const [key, value] of Object.entries(editData)) {
            const field = form.querySelector(`[name="${key}"]`);
            if (!field) continue;
            if (field.type === 'checkbox') {
                field.checked = value === true || value === 'true';
            } else if (key === 'preco_venda' && value != null) {
                field.value = value.toString(); // Raw number str, mask will format
            } else {
                field.value = value || '';
            }
        }
    } else {
        Action.value = 'c';
        Id.value = '';
    }

    // Apply mask after populate
    Inputmask("currency", {
        radixPoint: ',',
        inputtype: "text",
        prefix: 'R$ ',
        autoGroup: true,
        groupSeparator: '.',
        rightAlign: false
    }).mask("#preco_compra, #preco_venda");
})();

InsertButton.addEventListener('click', async () => {
    let timer = 3000;
    $('#insert').prop('disabled', true);

    // Pega valores do formulário como customer.js
    const nome = document.getElementById('nome').value.trim();
    const codigo_barra = document.getElementById('codigo_barra')?.value || '';
    const preco_compra_str = document.getElementById('preco_compra')?.value || '';
    const preco_venda_str = document.getElementById('preco_venda').value;
    const unidade = document.getElementById('unidade')?.value || '';
    const descricao = document.getElementById('descricao')?.value || '';
    const ativo = document.getElementById('ativo')?.checked || false;

    // Parse prices
    const cleanCompra = preco_compra_str.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    const cleanVenda = preco_venda_str.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    const preco_compra = parseFloat(cleanCompra) || 0;
    const preco_venda = parseFloat(cleanVenda) || 0;

    const data = {
        nome,
        codigo_barra,
        preco_compra,
        preco_venda,
        unidade,
        descricao,
        ativo
    };

    const id = Action.value !== 'c' ? Id.value : null;

    try {
        const response = Action.value === 'c'
            ? await api.product.insert(data)
            : await api.product.update(id, data);

        if (!response.status) {
            toast('error', 'Erro', response.msg, timer);
            return;
        }

        toast('success', 'Sucesso', response.msg, timer);
        form.reset();
        api.temp.set('product:edit', null);
        setTimeout(() => api.window.close(), timer);
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message, timer);
    } finally {
        $('#insert').prop('disabled', false);
    }
});


