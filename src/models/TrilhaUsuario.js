const { Model, DataTypes } = require("sequelize");

class TrilhaUsuario extends Model {
  static init(sequelize) {
    super.init(
      {
        id_trilha: DataTypes.INTEGER,
        id_usuario: DataTypes.INTEGER
      },
      {
        sequelize,
        tableName: 'trilha_usuario'
      }
    );
  }
}

module.exports = TrilhaUsuario;
