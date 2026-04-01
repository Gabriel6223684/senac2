const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action');
const Id = document.getElementById('id');
const form = document.getElementById('user-form');

(async () => {
    const editData = await api.temp.get('user:edit');
    if (editData) {
        Action.value = editData.action || 'e';
        Id.value = editData.id || '';
        for (const [key, value] of Object.entries(editData)) {
            const field = form.querySelector(`[name="${key}"]`);
            if (!field) continue;
            if (field.type === 'checkbox') {
                field.checked = !!value;
            } else {
                field.value = value || '';
            }
        }
    } else {
        Action.value = 'c';
        Id.value = '';
        document.getElementById('ativo').checked = true;
    }
})();

InsertButton.addEventListener('click', async () => {
    let timer = 3000;
    $('#insert').prop('disabled', true);

    const data = formToJson(form);

    // Validações client-side
    if (!data.nome?.trim()) {
        toast('error', 'Erro', 'Nome é obrigatório');
        return;
    }
    if (!data.email?.trim()) {
        toast('error', 'Erro', 'Email é obrigatório');
        return;
    }
    if (Action.value === 'c' && (!data.senha || data.senha.length < 6)) {
        toast('error', 'Erro', 'Senha deve ter pelo menos 6 caracteres (criação)');
        return;
    }

    const id = Action.value !== 'c' ? Id.value : null;

    try {
        const response = Action.value === 'c'
            ? await api.user.insert(data)
            : await api.user.update(id, data);

        if (!response.status) {
            toast('error', 'Erro', response.msg, timer);
            return;
        }

        toast('success', 'Sucesso', response.msg, timer);
        form.reset();
        api.temp.set('user:edit', null);
        setTimeout(() => api.window.close(), timer);
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message, timer);
    } finally {
        $('#insert').prop('disabled', false);
    }
});
