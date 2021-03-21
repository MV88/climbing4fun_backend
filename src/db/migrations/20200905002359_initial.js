// eslint-disable-next-line no-unused-vars
const Knex = require("knex");

const tableNames = require("../../../src/constants/tableNames");

const { addDefaultColumns, email, references, url } = require('../../utils/tableUtils');

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await Promise.all([
    knex.schema.createTable(tableNames.user, (table) => {
      table.increments().notNullable();
      email(table, "email").notNullable().unique();
      table.string("username").notNullable().unique();
      table.string("name");
      table.string("refreshToken");
      table.string("password", 127).notNullable();
      table.datetime("last_login");
      addDefaultColumns(table);
    }),
    knex.schema.createTable(tableNames.grade, (table) => {
      table.increments().notNullable();
      table.string("french").unique().notNullable();
      table.string("american");
      table.string("english");
      addDefaultColumns(table);
    }),
    knex.schema.createTable(tableNames.style, (table) => {
      table.increments().notNullable();
      table.string("name").notNullable();
      table.string("description").notNullable();
      addDefaultColumns(table);
    }),
    knex.schema.createTable(tableNames.media, (table) => {
      table.increments().notNullable();
      table.string("name").notNullable();
      table.string("description").notNullable();
      url(table, "url");
      table.string("mimeType").notNullable();
      addDefaultColumns(table);
    }),
  ]);

  await knex.schema.createTable(tableNames.route, (table) => {
    table.increments().notNullable();
    table.string("name").notNullable();
    table.string("sector").notNullable();
    url(table, "link");
    table.string("city").notNullable();
    references(table, tableNames.grade);
    addDefaultColumns(table);
  });
  await knex.schema.createTable(tableNames.gallery, (table) => {
    table.increments().notNullable();
    table.string("title").notNullable();
    table.string("subtitle").notNullable();
    references(table, tableNames.user);
    references(table, tableNames.media, true, "thumbnail");
    addDefaultColumns(table);
  });
  await knex.schema.createTable(tableNames.relGalleriesMedia, (table) => {
    table.increments().notNullable();
    references(table, tableNames.media);
    references(table, tableNames.gallery);
    addDefaultColumns(table);
  });
  await knex.schema.createTable(tableNames.rope, (table) => {
    table.increments().notNullable();
    table.string("brand").notNullable();
    table.string("color").notNullable();
    table.float("length").notNullable();
    table.float("thickness").notNullable();
    table.string("owner").notNullable();
    table.datetime("purchaseDate");
    table.string("shopLink");
    references(table, tableNames.user, false, "owner");
    references(table, tableNames.media, false, "thumbnail");
    addDefaultColumns(table);
  });
  await knex.schema.createTable(tableNames.attempt, (table) => {
    table.increments().notNullable();
    url(table, "linkWebsite");
    table.datetime("climbingDate").notNullable();
    table.integer("numOfTries").notNullable();
    references(table, tableNames.user, true, "climber");
    references(table, "style");
    references(table, "rope");
    references(table, "route");
    addDefaultColumns(table);
  });
};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.attempt,
      tableNames.rope,
      tableNames.relGalleriesMedia,
      tableNames.gallery,
      tableNames.media,
      tableNames.route,
      tableNames.user,
      tableNames.grade,
      tableNames.style,
      // eslint-disable-next-line comma-dangle
    ].map(tableName => knex.schema.dropTableIfExists(tableName))
  );
};
