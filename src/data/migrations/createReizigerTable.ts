const { tables } = require('..')

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.reiziger, (table) => {
      table.increments('id');
      table.string('voornaam', 255).notNullable();
      table.string('naam', 255).notNullable();
      table.string('geboortedatum', 10).notNullable();
      table.string('stad', 255).notNullable();
      table.string('straat', 255).notNullable();
      table.string('huisnummer', 5)
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.reiziger);
  },
};