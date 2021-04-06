const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");

class Media extends Model {
  static get tableName() {
    return tableNames.media;
  }

  static get jsonschema() {
    return {
      $schema: "http://json-schema.org/draft-07/schema",
      type: "object",
      title: "The Media schema",
      description: "The Media.",
      required: ["url", "mimeType"],
      properties: {
        id: {
          $id: "#/properties/id",
          type: "integer",
          title: "The ID",
        },
        name: {
          $id: "#/properties/name",
          type: "string",
          title: "The name of the media",
        },
        description: {
          $id: "#/properties/description",
          type: "string",
          title: "The description of the media",
        },
        url: {
          $id: "#/properties/url",
          type: "string",
          title: "The url of the media",
          examples: ["/uploads/something.jpg"],
        },
        mimeType: {
          $id: "#/properties/mimeType",
          type: "string",
          title: "The mime type of the media file",
        },
        created_at: {
          $id: "#/properties/created_at",
          type: "string",
          title: "The date of creation of the Media",
          examples: ["2021-01-07T22:48:30.656Z"],
        },
        updated_at: {
          $id: "#/properties/updated_at",
          type: "string",
          title: "The date of the update of the Media",
          examples: ["2021-01-07T22:48:30.656Z"],
        },
      },
      additionalProperties: false,
    };
  }

  static get relationMappings() {
    const Rope = require("../ropes/ropes.model");

    return {
      thumbnailForRope: {
        relation: Model.BelongsToOneRelation,
        modelClass: Rope,
        join: {
          from: `${tableNames.media}.id`,
          to: `${tableNames.rope}.thumbnailId`,
        },
      },
    };
  }
}
module.exports = Media;
