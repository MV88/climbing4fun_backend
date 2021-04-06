const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");

class Gallery extends Model {
  static get tableName() {
    return tableNames.gallery;
  }

  static get jsonschema() {
    return {
      $schema: "http://json-schema.org/draft-07/schema",
      type: "object",
      title: "The Gallery schema",
      description: "The Gallery.",
      required: ["title"],
      properties: {
        id: {
          $id: "#/properties/id",
          type: "integer",
          title: "The ID",
        },
        userId: {
          $id: "#/properties/userId",
          type: "integer",
          title: "The id of the user that is the owner",
        },
        thumbnailId: {
          $id: "#/properties/thumbnailId",
          type: "integer",
          title: "The id of the media used for the thumbnail",
        },
        title: {
          $id: "#/properties/title",
          type: "string",
          title: "The title of the Gallery",
        },
        subtitle: {
          $id: "#/properties/subtitle",
          type: "string",
          title: "The subtitle of the Gallery",
        },
        created_at: {
          $id: "#/properties/created_at",
          type: "string",
          title: "The date of creation of the Gallery",
          examples: ["2021-01-07T22:48:30.656Z"],
        },
        updated_at: {
          $id: "#/properties/updated_at",
          type: "string",
          title: "The date of the update of the Gallery",
          examples: ["2021-01-07T22:48:30.656Z"],
        },
      },
      additionalProperties: false,
    };
  }

  static get relationMappings() {
    const User = require("../users/users.model");
    const Media = require("../media/media.model");

    return {
      galleryMedia: {
        relation: Model.ManyToManyRelation,
        modelClass: Media,
        join: {
          from: `${tableNames.gallery}.id`,
          through: {
            from: `${tableNames.relGalleriesMedia}.galleryId`,
            to: `${tableNames.relGalleriesMedia}.mediaId`,
          },
          to: `${tableNames.media}.id`,
        },
      },
      hasThumbnail: {
        relation: Model.BelongsToOneRelation,
        modelClass: Media,
        join: {
          from: `${tableNames.gallery}.thumbnailId`,
          to: `${tableNames.media}.id`,
        },
      },
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${tableNames.gallery}.userId`,
          to: `${tableNames.user}.id`,
        },
      },
    };
  }
}
module.exports = Gallery;
