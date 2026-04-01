import connection from '../database/Connection.js';

export default class User {
    static table = 'users';

    // Mapeamento DataTable
    static #columns = ['id', 'nome', 'email', 'senha', 'ativo', 'criado_em', 'atualizado_em', null];

    // Colunas pesquisáveis
    static #searchable = ['nome', 'email'];

    static async find(data = {}) {
        try {
            const {
                term = '',
                limit = 10,
                offset = 0,
                orderType = 'asc',
                column = 0,
                draw = 1,
            } = data;

            const [{ count: total }] = await connection(User.table)
                .count('id as count');

            const search = term?.trim();

            function applySearch(query) {
                if (search) {
                    query.where(function () {
                        for (const col of User.#searchable) {
                            this.orWhereRaw(`CAST("${col}" AS TEXT) ILIKE ?`, [`%${search}%`]);
                        }
                    });
                }
                return query;
            }

            const filteredQ = connection(User.table).count('id as count');
            applySearch(filteredQ);
            const [{ count: filtered }] = await filteredQ;

            const orderColumn = User.#columns[column] || 'id';
            const orderDir = orderType === 'desc' ? 'desc' : 'asc';

            const dataQ = connection(User.table).select('*');
            applySearch(dataQ);
            dataQ.orderBy(orderColumn, orderDir);
            dataQ.limit(parseInt(limit));
            dataQ.offset(parseInt(offset));

            const rows = await dataQ;

            return {
                draw: parseInt(draw),
                recordsTotal: parseInt(total),
                recordsFiltered: parseInt(filtered),
                data: rows,
            };
        } catch (err) {
            console.error('Erro no find users:', err);
            return {
                draw: 1,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: [],
            };
        }
    }

    static async findById(id) {
        if (!id) return null;

        try {
            const row = await connection(User.table)
                .where({ id })
                .first();
            return row || null;
        } catch (err) {
            console.error('Erro ao buscar user por ID:', err);
            return null;
        }
    }

    static async insert(data) {
        if (!data.nome || data.nome.trim() === '') {
            return { status: false, msg: 'O campo nome é obrigatório', id: null, data: [] };
        }
        if (!data.email || data.email.trim() === '') {
            return { status: false, msg: 'O campo email é obrigatório', id: null, data: [] };
        }
        if (!data.senha || data.senha.trim() === '') {
            return { status: false, msg: 'O campo senha é obrigatório', id: null, data: [] };
        }

        try {
            const clean = User.#sanitize(data);

            const [result] = await connection(User.table)
                .insert(clean)
                .returning('*');

            return { status: true, msg: 'Salvo com sucesso!', id: result.id, data: [result] };

        } catch (err) {
            console.error('Erro ao inserir user:', err);
            return { status: false, msg: 'Erro: ' + err.message, id: null, data: [] };
        }
    }

    static async update(id, data) {
        if (!id) return { status: false, msg: 'ID é obrigatório', data: [] };

        if (!data.nome || data.nome.trim() === '') {
            return { status: false, msg: 'O campo nome é obrigatório', data: [] };
        }
        if (!data.email || data.email.trim() === '') {
            return { status: false, msg: 'O campo email é obrigatório', data: [] };
        }
        if (!data.senha || data.senha.trim() === '') {
            return { status: false, msg: 'O campo senha é obrigatório', data: [] };
        }

        try {
            const clean = User.#sanitize(data);
            delete clean.id;

            const [result] = await connection(User.table)
                .where({ id })
                .update(clean)
                .returning('*');

            if (!result) {
                return { status: false, msg: 'User não encontrado', data: [] };
            }

            return { status: true, msg: 'Atualizado com sucesso!', id: result.id, data: [result] };
        } catch (err) {
            console.error('Erro ao atualizar user:', err);
            return { status: false, msg: 'Erro: ' + err.message, data: [] };
        }
    }

    static async delete(id) {
        if (!id) return { status: false, msg: 'ID é obrigatório' };

        try {
            await connection(User.table).where({ id }).del();
            return { status: true, msg: 'Excluído com sucesso!' };
        } catch (err) {
            console.error('Erro ao remover user:', err);
            return { status: false, msg: 'Erro: ' + err.message };
        }
    }

    static #sanitize(data) {
        const ignore = ['id', 'action'];

        const clean = {};

        for (const [key, value] of Object.entries(data)) {
            if (ignore.includes(key)) continue;
            if (value === '' || value === null || value === undefined) continue;
            if (value === 'true') { clean[key] = true; continue; }
            if (value === 'false') { clean[key] = false; continue; }
            clean[key] = value;
        }

        return clean;
    }
};
