const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");

class RelGalleriesMedia extends Model {
  static get tableName() {
    return tableNames.relGalleriesMedia;
  }

  static get jsonschema() {
    return {
      $schema: "http://json-schema.org/draft-07/schema",
      type: "object",
      title: "The RelGalleriesMedia schema",
      description: "The RelGalleriesMedia relation",
      required: ["galleryId", "mediaId"],
      properties: {
        id: {
          $id: "#/properties/id",
          type: "integer",
          title: "The ID",
        },
        mediaId: {
          $id: "#/properties/mediaId",
          type: "integer",
          title: "The id of the media",
        },
        galleryId: {
          $id: "#/properties/galleryId",
          type: "integer",
          title: "The id of the gallery",
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
    const Media = require("../media/media.model");
    const Gallery = require("./galleries.model");
    return {
      hasMedia: {
        relation: Model.BelongsToOneRelation,
        modelClass: Media,
        join: {
          from: `${tableNames.relGalleriesMedia}.mediaId`,
          to: `${tableNames.media}.id`,
        },
      },
      hasGallery: {
        relation: Model.BelongsToOneRelation,
        modelClass: Gallery,
        join: {
          from: `${tableNames.relGalleriesMedia}.galleryId`,
          to: `${tableNames.gallery}.id`,
        },
      },
    };
  }
}
module.exports = RelGalleriesMedia;
