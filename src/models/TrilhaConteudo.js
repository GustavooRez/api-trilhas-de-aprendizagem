const { Model, DataTypes } = require("sequelize");

class TrilhaConteudo extends Model {
  static init(sequelize) {
    super.init(
      {
        id_trilha: DataTypes.INTEGER,
        id_conteudo: DataTypes.INTEGER
      },
      {
        sequelize,
        tableName: 'trilha_conteudo'
      }
    );
  }
}

module.exports = TrilhaConteudo;
