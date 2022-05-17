const { Model, DataTypes } = require("sequelize");

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
        aniversario: DataTypes.DATE,
        telefone: DataTypes.STRING,
        email: DataTypes.STRING,
        senha: DataTypes.STRING,
        tipo_usuario: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'usuario'
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Log, {
      foreignKey: 'id_usuario', as: 'logs'
    })
  }
}

module.exports = Usuario;
