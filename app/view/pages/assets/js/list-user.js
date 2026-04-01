import { Datatables } from "../components/Datatables.js";

api.user.onReload(() => {
    $('#table-users').DataTable().ajax.reload(null, false);
});

// Inicializa a tabela
Datatables.SetTable('#table-users', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'email' },
    { 
        data: 'senha', 
        render: () => '********' 
    },
    { 
        data: 'ativo', 
        render: (data) => data ? 
            '<span class="badge bg-success"><i class="fa-solid fa-check me-1"></i>Sim</span>' : 
            '<span class="badge bg-danger"><i class="fa-solid fa-xmark me-1"></i>Não</span>'
    },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editUser(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteUser(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.user.find(filter));

async function deleteUser(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.user.delete(id);
        if (response.status) {
            toast('success', 'Excluído', response.msg);
            $('#table-users').DataTable().ajax.reload();
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editUser(id) {
    try {
        const user = await api.user.findById(id);
        if (!user) {
            toast('error', 'Erro', 'Usuário não encontrado.');
            return;
        }
        await api.temp.set('user:edit', {
            action: 'e',
            ...user,
        });
        api.window.openModal('pages/user', {
            width: 800,
            height: 550,
            title: 'Editar Usuário',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}

window.deleteUser = deleteUser;
window.editUser = editUser;
