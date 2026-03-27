exports.up = function (knex) {
    return knex.schema.createTable('city', function (table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('estado', 2).notNullable();
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('city');
};