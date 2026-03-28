form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const product = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value
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
    }
});