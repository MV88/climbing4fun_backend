const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");

class ClimbingRoute extends Model {
  static get tableName() {
    return tableNames.route;
  }

  static get jsonschema() {
    return {
      $schema: "http://json-schema.org/draft-07/schema",
      type: "object",
      title: "The ClimbingRoute schema",
      description: "The ClimbingRoute.",
      required: ["name", "city"],
      properties: {
        id: {
          $id: "#/properties/id",
          type: "integer",
          title: "The ID",
        },
        name: {
          $id: "#/properties/name",
          type: "string",
          title: "The name of the climbing route",
        },
        sector: {
          $id: "#/properties/sector",
          type: "string",
          title: "The sector of the climbing route",
        },
        link: {
          $id: "#/properties/url",
          type: "string",
          title: "The url of the climbing route",
        },
        city: {
          $id: "#/properties/city",
          type: "string",
          title: "The city of the climbing route",
        },
        created_at: {
          $id: "#/properties/created_at",
          type: "string",
          title: "The date of creation of the climbing route",
          examples: ["2021-01-07T22:48:30.656Z"],
        },
        updated_at: {
          $id: "#/properties/updated_at",
          type: "string",
          title: "The date of the update of the climbing route",
          examples: ["2021-01-07T22:48:30.656Z"],
        },
      },
      additionalProperties: false,
    };
  }

  static get relationMappings() {
    const Grade = require("../grades/grades.model");

    return {
      hasGrade: {
        relation: Model.BelongsToOneRelation,
        modelClass: Grade,
        join: {
          from: `${tableNames.route}.gradeId`,
          to: `${tableNames.grade}.id`,
        },
      },
    };
  }
}
module.exports = ClimbingRoute;
