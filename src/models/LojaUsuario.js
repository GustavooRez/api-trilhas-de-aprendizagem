const { Model, DataTypes } = require("sequelize");

class LojaUsuario extends Model {
  static init(sequelize) {
    super.init(
      {
        id_loja: DataTypes.INTEGER,
        id_usuario: DataTypes.INTEGER,
        atual: DataTypes.INTEGER
      },
      {
        sequelize,
        tableName: 'loja_usuario'
      }
    );
  }
}

module.exports = LojaUsuario;
