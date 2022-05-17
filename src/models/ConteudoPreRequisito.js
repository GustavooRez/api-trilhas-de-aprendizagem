const { Model, DataTypes } = require("sequelize");

class ConteudoPreRequisito extends Model {
  static init(sequelize) {
    super.init(
      {
        id_conteudo: DataTypes.INTEGER,
        id_pre_requisito: DataTypes.INTEGER
      },
      {
        sequelize,
        tableName: 'conteudo_pre_requisito'
      }
    );
  }
}

module.exports = ConteudoPreRequisito;
