exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('email').notNullable().unique();
        table.string('senha').notNullable();
        table.boolean('ativo').defaultTo(true);
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};