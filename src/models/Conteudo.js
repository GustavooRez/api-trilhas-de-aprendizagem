const { Model, DataTypes } = require("sequelize");

class Conteudo extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: DataTypes.STRING,
        descricao: DataTypes.STRING,
        ch_teorica: DataTypes.STRING,
        ch_pratica: DataTypes.STRING,
        codigo: DataTypes.STRING
      },
      {
        sequelize,
        tableName: 'conteudo'
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Topico, {
      foreignKey: 'id_conteudo', as: 'topico'
    }),
    this.belongsToMany(models.PreRequisito, {
      foreignKey: "id_conteudo", through: "conteudo_pre_requisito", as: "pre_requisito"
    })
  }
}

module.exports = Conteudo;
