export async function seed(knex) {
  // Limpa tabela
  await knex('federative_unit').del();

  // Insere dados
  await knex('federative_unit').insert([
    { id: 1, nome: 'São Paulo', sigla: 'SP' },
    { id: 2, nome: 'Rio de Janeiro', sigla: 'RJ' },
    // ...
  ]);
}