const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");

class Style extends Model {
  static get tableName() {
    return tableNames.style;
  }

  static get jsonschema() {
    return {
      $schema: "http://json-schema.org/draft-07/schema",
      type: "object",
      title: "The Style schema",
      description: "The Style.",
      required: ["name"],
      properties: {
        id: {
          $id: "#/properties/id",
          type: "integer",
          title: "The ID",
        },
        name: {
          $id: "#/properties/name",
          type: "integer",
          title: "The name of the Style",
        },
        description: {
          $id: "#/properties/description",
          type: "integer",
          title: "The description of the style",
        },
        created_at: {
          $id: "#/properties/created_at",
          type: "string",
          title: "The date of creation of the Style",
          examples: ["2021-01-07T22:48:30.656Z"],
        },
        updated_at: {
          $id: "#/properties/updated_at",
          type: "string",
          title: "The date of the update of the Style",
          examples: ["2021-01-07T22:48:30.656Z"],
        },
      },
      additionalProperties: false,
    };
  }
}
module.exports = Style;
