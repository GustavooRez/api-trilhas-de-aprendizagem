const { Model, DataTypes } = require("sequelize");

class PreRequisito extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: DataTypes.STRING,
        id_conteudo: DataTypes.INTEGER,
        codigo: DataTypes.STRING
      },
      {
        sequelize,
        tableName: 'pre_requisito'
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.Conteudo, {
      foreignKey: "id_pre_requisito", through: "conteudo_pre_requisito", as: "conteudo"
    })
  }
}

module.exports = PreRequisito;
