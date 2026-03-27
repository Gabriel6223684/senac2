exports.up = function (knex) {
    return knex.schema.createTable('country', function (table) {
        table.increments('id').primary();
        table.string('codigo', 10).notNullable();  // Código ISO-3166-1 Alpha-2
        table.string('nome', 200).notNullable();   // Nome do país (pode ser longo)
        table.string('localizacao', 200);          // Regiao - Sub-regiao
        table.string('lingua', 200);               // Pode ter várias línguas
        table.string('moeda', 200);                // Pode ter várias moedas
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('country');
};