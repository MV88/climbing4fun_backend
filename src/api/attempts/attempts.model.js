const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");

class Attempt extends Model {
  static get tableName() {
    return tableNames.attempt;
  }

  static get jsonschema() {
    return {
      $schema: "http://json-schema.org/draft-07/schema",
      type: "object",
      title: "The Attempt schema",
      description: "The Attempt.",
      required: ["climberId", "styleId", "ropeId", "climbingDate", "tries"],
      properties: {
        id: {
          $id: "#/properties/id",
          type: "integer",
          title: "The ID",
        },
        climberId: {
          $id: "#/properties/climberId",
          type: "integer",
          title: "The id of the user that is the owner",
        },
        styleId: {
          $id: "#/properties/styleId",
          type: "integer",
          title: "The id of the style",
        },
        ropeId: {
          $id: "#/properties/ropeId",
          type: "integer",
          title: "The id of of the rope",
        },
        climbingDate: {
          $id: "#/properties/climbingDate",
          type: "string",
          title: "The date of th climb",
        },
        tries: {
          $id: "#/properties/tries",
          type: "integer",
          title: "The number of tries on a climbing route",
        },
        created_at: {
          $id: "#/properties/created_at",
          type: "string",
          title: "The date of creation of the Attempt",
          examples: ["2021-01-07T22:48:30.656Z"],
        },
        updated_at: {
          $id: "#/properties/updated_at",
          type: "string",
          title: "The date of the update of the Attempt",
          examples: ["2021-01-07T22:48:30.656Z"],
        },
      },
      additionalProperties: false,
    };
  }

  static get relationMappings() {
    const Style = require("../styles/styles.model");
    const Route = require("../climbingRoutes/climbingRoute.model");
    const User = require("../users/users.model");
    const Rope = require("../ropes/ropes.model");

    return {
      hasStyle: {
        relation: Model.BelongsToOneRelation,
        modelClass: Style,
        join: {
          from: `${tableNames.attempt}.styleId`,
          to: `${tableNames.style}.id`,
        },
      },
      hasRoute: {
        relation: Model.BelongsToOneRelation,
        modelClass: Route,
        join: {
          from: `${tableNames.attempt}.routeId`,
          to: `${tableNames.route}.id`,
        },
      },
      hasClimber: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${tableNames.attempt}.climberId`,
          to: `${tableNames.user}.id`,
        },
      },
      hasRope: {
        relation: Model.BelongsToOneRelation,
        modelClass: Rope,
        join: {
          from: `${tableNames.attempt}.ropeId`,
          to: `${tableNames.rope}.id`,
        },
      },
    };
  }
}
module.exports = Attempt;
