// eslint-disable-next-line no-unused-vars
const Knex = require("knex");

const addDefaultColumns = (table) => {
  table.timestamps(false, true); // created_at updated_at
  table.datetime("deleted_at");
};

/**
 * @param {Knex} knex
 */
const createNameTable = (knex, tableName) => {
  return knex.schema.createTable(tableName, (table) => {
    table.increments().notNullable();
    table.string("name").notNullable().unique();
  });
};
/**
 * add url/link attribute to a table
 * @param {object} table knex table object
 * @param {string} columnName
 */
const url = (table, columnName) => {
  table.string(columnName, 2000);
};
/**
 * add email attribute to a table
 * @param {object} table
 * @param {string} columnName
 */
const email = (table, columnName) => table.string(columnName, 254);

/**
 * create foreign key references to the specified tableName
 * @param {object} table knex table object
 * @param {string} tableName
 * @param {boolean} [notNullable=true] if true adds not nullable contraint
 * @param {string} columnName alternative name for attribute
 */
const references = (table, tableName, notNullable = true, columnName) => {
  const definition = table
    .integer(`${columnName || tableName}Id`)
    .unsigned()
    .references("id")
    .inTable(tableName)
    .onDelete("cascade");

  notNullable && definition.notNullable();
};

module.exports = {
  addDefaultColumns,
  createNameTable,
  email,
  references,
  url,
};
