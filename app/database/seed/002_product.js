export async function seed(knex) {
  // Deleta todos os produtos existentes
  await knex('product').del();

  // Insere produtos
  await knex('product').insert([
    { id: 1, nome: 'Produto A', preco_venda: 10.99 },
    { id: 2, nome: 'Produto B', preco_venda: 25.50 },
    { id: 3, nome: 'Produto C', preco_venda: 7.30 },
    { id: 4, nome: 'Produto D', preco_venda: 15.00 },
    { id: 5, nome: 'Produto E', preco_venda: 8.75 }
  ]);
}