const { Model, DataTypes } = require("sequelize");

class CodigoProfessor extends Model {
  static init(sequelize) {
    super.init(
      {
        codigo: DataTypes.STRING,
        usado: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'codigo_professor'
      }
    );
  }
}

module.exports = CodigoProfessor;
