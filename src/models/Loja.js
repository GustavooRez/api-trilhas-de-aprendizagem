const { Model, DataTypes } = require("sequelize");

class Loja extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: DataTypes.STRING,
        descricao: DataTypes.STRING,
        categoria: DataTypes.STRING,
        valor: DataTypes.INTEGER,
        imagem: DataTypes.STRING
      },
      {
        sequelize,
        tableName: 'loja'
      }
    );
  }
}

module.exports = Loja;
