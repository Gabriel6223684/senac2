exports.up = function (knex) {
    return knex.schema.createTable('product', function (table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.decimal('preco', 10, 2).notNullable();
        table.integer('quantidade').defaultTo(0);
        table.integer('supplier_id').unsigned().references('id').inTable('supplier').onDelete('CASCADE');
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('product');
};