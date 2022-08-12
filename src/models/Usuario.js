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
        creditos: DataTypes.FLOAT,
        creditos_total: DataTypes.FLOAT,
        indice: DataTypes.FLOAT
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
    this.hasOne(models.Trilha, {
      foreignKey: 'id_criador', as: 'trilha'
    })
    this.hasOne(models.Conteudo, {
      foreignKey: 'id_criador', as: 'conteudo'
    })
  }
}

module.exports = Usuario;
