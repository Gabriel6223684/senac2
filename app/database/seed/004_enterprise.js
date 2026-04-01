/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // 1. Deletes ALL existing entries
  await knex('enterprise').del();

  // 2. Inserts seed entries
  await knex('enterprise').insert([
    {
      nome: 'Main Enterprise HQ',
      cnpj: '11222333000100',
      email: 'admin@enterprise.com'
    },
    {
      nome: 'Branch Alpha',
      cnpj: '44555666000111',
      email: 'alpha@enterprise.com'
    },
    {
      nome: 'Branch Beta',
      cnpj: '77888999000122',
      email: 'beta@enterprise.com'
    }
  ]);
};