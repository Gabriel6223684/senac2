exports.seed = async function (knex) {
  // 1. Deletes ALL existing entries to avoid primary key conflicts
  await knex('supplier').del();

  // 2. Inserts seed entries
  await knex('supplier').insert([
    {
      nome: 'Tech Solutions Ltd',
      cnpj: '12345678000199',
      email: 'contact@techsolutions.com',
      telefone: '11999999999'
    },
    {
      nome: 'Global Logistics',
      cnpj: '98765432000188',
      email: 'sales@globallog.com',
      telefone: '11888888888'
    },
    {
      nome: 'Office Supplies Co',
      cnpj: '55443322000177',
      email: 'orders@officesupplies.br',
      telefone: '11777777777'
    }
  ]);
};