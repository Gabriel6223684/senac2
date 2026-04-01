/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // 1. Deletes ALL existing entries to prevent email "unique" constraint errors
  await knex('users').del();

  // 2. Inserts seed entries
  await knex('users').insert([
    {
      nome: 'Admin User',
      email: 'admin@system.com',
      senha: 'hashed_password_123', // Use a hash in production!
      ativo: true
    },
    {
      nome: 'John Doe',
      email: 'john@enterprise.com',
      senha: 'hashed_password_456',
      ativo: true
    },
    {
      nome: 'Jane Smith',
      email: 'jane@supplier.com',
      senha: 'hashed_password_789',
      ativo: false
    }
  ]);
};