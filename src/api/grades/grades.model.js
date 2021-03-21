const { Model } = require('objection');
const tableNames = require('../../constants/tableNames');

class Grade extends Model {
  static get tableName () {
    return tableNames.grade;
  }

  static get jsonschema () {
    return {
      $schema: "http://json-schema.org/draft-07/schema",
      type: "object",
      title: "The grade schema",
      description: "The grade of a climbing route",
      required: [
        "french",
      ],
      properties: {
        id: {
          $id: "#/properties/id",
          type: "integer",
          title: "The ID",
        },
        french: {
          $id: "#/properties/french",
          type: "string",
          title: "The french grade",
        },
        english: {
          $id: "#/properties/english",
          type: "string",
          title: "The english grade",
        },
        american: {
          $id: "#/properties/american",
          type: "string",
          title: "The american grade",
        },
        created_at: {
          $id: "#/properties/created_at",
          type: "string",
          title: "The date of creation of the grade",
          examples: [
            "2021-01-07T22:48:30.656Z",
          ],
        },
        updated_at: {
          $id: "#/properties/updated_at",
          type: "string",
          title: "The date of the update of the grade",
          examples: [
            "2021-01-07T22:48:30.656Z",
          ],
        },
      },
      additionalProperties: false,
    };
  }

  static get relationMappings () {
    const ClimbingRoute = require('../climbingRoutes/climbingRoute.model');

    return {
      hasGrade: {
        relation: Model.HasManyRelation,
        modelClass: ClimbingRoute,
        join: {
          from: `${tableNames.grade}.id`,
          to: `${tableNames.route}.gradeId`,
        },
      },
    };
  }
}
module.exports = Grade;
