import connection from '../database/Connection.js';

export default class Supplier {
    static table = 'supplier';

    // Mapeamento DataTable
    static #columns = ['id', 'nome', 'cnpj', 'email', 'telefone', 'criado_em', 'atualizado_em', null];

    // Colunas pesquisáveis
    static #searchable = ['nome', 'cnpj', 'email'];

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

            const [{ count: total }] = await connection(Supplier.table)
                .count('id as count');

            const search = term?.trim();

            function applySearch(query) {
                if (search) {
                    query.where(function () {
                        for (const col of Supplier.#searchable) {
                            this.orWhereRaw(`CAST("${col}" AS TEXT) ILIKE ?`, [`%${search}%`]);
                        }
                    });
                }
                return query;
            }

            const filteredQ = connection(Supplier.table).count('id as count');
            applySearch(filteredQ);
            const [{ count: filtered }] = await filteredQ;

            const orderColumn = Supplier.#columns[column] || 'id';
            const orderDir = orderType === 'desc' ? 'desc' : 'asc';

            const dataQ = connection(Supplier.table).select('*');
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
            console.error('Erro no find suppliers:', err);
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
            const row = await connection(Supplier.table)
                .where({ id })
                .first();
            return row || null;
        } catch (err) {
            console.error('Erro ao buscar supplier por ID:', err);
            return null;
        }
    }

    static async insert(data) {
        if (!data.nome || data.nome.trim() === '') {
            return { status: false, msg: 'O campo nome é obrigatório', id: null, data: [] };
        }
        if (!data.cnpj || data.cnpj.trim() === '') {
            return { status: false, msg: 'O campo cnpj é obrigatório', id: null, data: [] };
        }

        try {
            const clean = Supplier.#sanitize(data);

            const [result] = await connection(Supplier.table)
                .insert(clean)
                .returning('*');

            return { status: true, msg: 'Salvo com sucesso!', id: result.id, data: [result] };

        } catch (err) {
            console.error('Erro ao inserir supplier:', err);
            return { status: false, msg: 'Erro: ' + err.message, id: null, data: [] };
        }
    }

    static async update(id, data) {
        if (!id) return { status: false, msg: 'ID é obrigatório', data: [] };

        if (!data.nome || data.nome.trim() === '') {
            return { status: false, msg: 'O campo nome é obrigatório', data: [] };
        }
        if (!data.cnpj || data.cnpj.trim() === '') {
            return { status: false, msg: 'O campo cnpj é obrigatório', data: [] };
        }

        try {
            const clean = Supplier.#sanitize(data);
            delete clean.id;

            const [result] = await connection(Supplier.table)
                .where({ id })
                .update(clean)
                .returning('*');

            if (!result) {
                return { status: false, msg: 'Supplier não encontrado', data: [] };
            }

            return { status: true, msg: 'Atualizado com sucesso!', id: result.id, data: [result] };
        } catch (err) {
            console.error('Erro ao atualizar supplier:', err);
            return { status: false, msg: 'Erro: ' + err.message, data: [] };
        }
    }

    static async delete(id) {
        if (!id) return { status: false, msg: 'ID é obrigatório' };

        try {
            await connection(Supplier.table).where({ id }).del();
            return { status: true, msg: 'Excluído com sucesso!' };
        } catch (err) {
            console.error('Erro ao remover supplier:', err);
            return { status: false, msg: 'Erro: ' + err.message };
        }
    }

    static #sanitize(data) {
        const ignore = ['id', 'action'];

        const clean = {};

        for (const [key, value] of Object.entries(data)) {
            if (ignore.includes(key)) continue;
            if (value === '' || value === null || value === undefined) continue;
            clean[key] = value;
        }

        return clean;
    }
};
