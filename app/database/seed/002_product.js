export async function seed(knex) {
  // Deleta todos os produtos existentes
  await knex('product').del();

  // Insere produtos
  await knex('product').insert([
    { nome: 'Produto A', preco_venda: 10.99 },
    { nome: 'Produto B', preco_venda: 25.50 },
    { nome: 'Produto C', preco_venda: 7.30 },
    { nome: 'Produto D', preco_venda: 15.00 },
    { nome: 'Produto E', preco_venda: 8.75 }
  ]);
}