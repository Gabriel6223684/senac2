exports.up = function (knex) {
    return knex.schema.createTable('supplier', function (table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('cnpj', 14).notNullable();
        table.string('email');
        table.string('telefone');
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('supplier');
};