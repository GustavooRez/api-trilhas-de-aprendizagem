const { Model, DataTypes } = require("sequelize");

class Trilha extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: DataTypes.STRING,
        descricao: DataTypes.STRING,
        codigo: DataTypes.STRING,
        creditos_ganhos: DataTypes.INTEGER
      },
      {
        sequelize,
        tableName: 'trilha'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Usuario, {
      foreignKey: 'id_criador', as: 'trilha'
    })
  }
}

module.exports = Trilha;
