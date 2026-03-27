exports.up = function (knex) {
    return knex.schema.createTable('enterprise', function (table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('cnpj', 14).notNullable();
        table.string('email');
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('enterprise');
};