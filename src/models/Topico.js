const { Model, DataTypes } = require("sequelize");

class Topico extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: DataTypes.STRING,
        descricao: DataTypes.STRING
      },
      {
        sequelize,
        tableName: 'topico'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Conteudo, {
      foreignKey: 'id_conteudo', as: 'conteudo'
    })
  }
}

module.exports = Topico;
