import connection from '../database/Connection.js';

export default {
    async find() {
        try {
            const result = await connection('product')
                .select('*')
                .where({ excluido: false }) // opcional
                .orderBy('id', 'asc');
            return result;
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
            return [];
        }
    },

    async findById(id) {
        try {
            const result = await connection('product')
                .select('*')
                .where({ id });
            return result[0] || null;
        } catch (err) {
            console.error('Erro ao buscar produto por ID:', err);
            return null;
        }
    },

    async insert(data) {
        try {
            const { nome, preco_venda } = data;
            const result = await connection('product')
                .insert({ nome, preco_venda })
                .returning('*');
            return { status: true, msg: 'Produto inserido', data: result[0] };
        } catch (err) {
            console.error('Erro ao inserir produto:', err);
            return { status: false, msg: 'Erro ao inserir produto' };
        }
    },

    async update(id, data) {
        try {
            const result = await connection('product')
                .where({ id })
                .update(data)
                .returning('*');
            if (result.length === 0) return { status: false, msg: 'Produto não encontrado' };
            return { status: true, msg: 'Produto atualizado', data: result[0] };
        } catch (err) {
            console.error('Erro ao atualizar produto:', err);
            return { status: false, msg: 'Erro ao atualizar produto' };
        }
    },

    async delete(id) {
        try {
            const result = await connection('product')
                .where({ id })
                .del();
            if (result === 0) return { status: false, msg: 'Produto não encontrado' };
            return { status: true, msg: 'Produto removido' };
        } catch (err) {
            console.error('Erro ao remover produto:', err);
            return { status: false, msg: 'Erro ao remover produto' };
        }
    }
};