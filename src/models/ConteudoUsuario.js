const { Model, DataTypes } = require("sequelize");

class ConteudoUsuario extends Model {
  static init(sequelize) {
    super.init(
      {
        id_usuario: DataTypes.INTEGER,
        id_conteudo: DataTypes.INTEGER,
        completo: DataTypes.INTEGER,
        usuario: DataTypes.STRING
      },
      {
        sequelize,
        tableName: 'conteudo_usuario'
      }
    );
  }
}

module.exports = ConteudoUsuario;
