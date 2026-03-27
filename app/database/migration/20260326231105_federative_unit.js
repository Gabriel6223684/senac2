exports.up = function (knex) {
    return knex.schema.createTable('federative_unit', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('abbreviation', 2).notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('federative_unit');
};