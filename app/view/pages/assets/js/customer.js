const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action');
const Id = document.getElementById('id');
const form = document.getElementById('form');

// Aplica a máscara visual
Inputmask('999.999.999-99').mask('#cpf');

// CARREGA DADOS DE EDIÇÃO
(async () => {
    const editData = await api.temp.get('customer:edit');
    if (editData) {
        Action.value = editData.action || 'e';
        Id.value = editData.id || '';
        for (const [key, value] of Object.entries(editData)) {
            const field = form.querySelector(`[name="${key}"]`);
            if (!field) continue;
            if (field.type === 'checkbox') {
                field.checked = value === true || value === 'true';
            } else {
                field.value = value || '';
            }
        }
    } else {
        Action.value = 'c';
        Id.value = '';
    }
})();

// ENVIO DO FORM
InsertButton.addEventListener('click', async () => {
    let timer = 3000;
    $('#insert').prop('disabled', true);

    const data = formToJson(form);

    // Limpa CPF antes de enviar
    if (data.cpf) {
        data.cpf = data.cpf.replace(/\D/g, ''); // remove pontos e traço
    }

    const id = Action.value !== 'c' ? Id.value : null;

    try {
        const response = Action.value === 'c'
            ? await api.customer.insert(data)
            : await api.customer.update(id, data);

        if (!response.status) {
            toast('error', 'Erro', response.msg, timer);
            return;
        }

        toast('success', 'Sucesso', response.msg, timer);
        form.reset();

        setTimeout(() => {
            api.window.close();
        }, timer);
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message, timer);
    } finally {
        $('#insert').prop('disabled', false);
    }
});