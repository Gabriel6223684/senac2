const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action');
const Id = document.getElementById('id');
const form = document.getElementById('enterprise-form');

// Aplica máscara CNPJ
Inputmask('99.999.999/9999-99').mask('#cnpj');

(async () => {
    const editData = await api.temp.get('enterprise:edit');
    if (editData) {
        Action.value = editData.action || 'e';
        Id.value = editData.id || '';
        for (const [key, value] of Object.entries(editData)) {
            const field = form.querySelector(`[name="${key}"]`);
            if (!field) continue;
            field.value = value || '';
        }
    } else {
        Action.value = 'c';
        Id.value = '';
    }
})();

InsertButton.addEventListener('click', async () => {
    let timer = 3000;
    $('#insert').prop('disabled', true);

    const data = formToJson(form);

    // Limpa CNPJ
    data.cnpj = data.cnpj.replace(/\D/g, '');

    // Validações client-side
    if (!data.nome?.trim()) {
        toast('error', 'Erro', 'Nome é obrigatório');
        return;
    }
    if (!data.cnpj || data.cnpj.length !== 14) {
        toast('error', 'Erro', 'CNPJ inválido');
        return;
    }

    const id = Action.value !== 'c' ? Id.value : null;

    try {
        const response = Action.value === 'c'
            ? await api.enterprise.insert(data)
            : await api.enterprise.update(id, data);

        if (!response.status) {
            toast('error', 'Erro', response.msg, timer);
            return;
        }

        toast('success', 'Sucesso', response.msg, timer);
        form.reset();
        api.temp.set('enterprise:edit', null);
        setTimeout(() => api.window.close(), timer);
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message, timer);
    } finally {
        $('#insert').prop('disabled', false);
    }
});
