const crypto = require("crypto");
const bcrypt = require("bcrypt");
// eslint-disable-next-line no-unused-vars
const Knex = require("knex");
const tableNames = require("../../constants/tableNames");
const styles = require("../../constants/styles");
const grades = require("../../constants/grades");
const routes = require("../../constants/routes");
const ropes = require("../../constants/ropes");
const media = require("../../constants/media");
const relGalleriesMedia = require("../../constants/relGalleriesMedia");
const galleries = require("../../constants/galleries");

/**
 * @param {Knex} knex
 */
exports.seed = async (knex) => {
  await Promise.all(Object.keys(tableNames).map(name => knex(name).del()));

  const password = crypto.randomBytes(15).toString("hex");

  const user = {
    name: "Matteo",
    username: "ChronosOutOfTime",
    email: "teo.rubber@gmail.com",
    password: await bcrypt.hash(password, 12),
  };

  const [createdUser] = await knex(tableNames.user)
    .insert([user])
    .returning("*");

  if (process.env.NODE_ENV !== "test") {
    console.log(
      "user created: ",
      {
        password,
      },
      createdUser,
    );
  }

  await knex(tableNames.grade).insert(grades, "*");
  await knex(tableNames.style).insert(styles, "*");
  await knex(tableNames.route).insert(routes, "*");
  await knex(tableNames.media).insert(media, "*");
  await knex(tableNames.rope).insert(ropes, "*");
  await knex(tableNames.gallery).insert(galleries, "*");
  await knex(tableNames.relGalleriesMedia).insert(relGalleriesMedia, "*");
};
