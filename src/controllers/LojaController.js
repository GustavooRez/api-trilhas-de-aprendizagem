const Loja = require("../models/Loja");
const { QueryTypes } = require("sequelize");
const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const sequelize = new Sequelize(dbConfig);

module.exports = {
  async indexAll(req, res) {
    const { id_usuario } = req.params;

    var results = await sequelize.query(
      `SELECT Loja.*, LojaUsuario.atual FROM loja as Loja 
                INNER JOIN loja_usuario as LojaUsuario ON Loja.id = LojaUsuario.id_loja 
                WHERE LojaUsuario.id_usuario = :id_usuario`,
      {
        replacements: { id_usuario },
        type: QueryTypes.SELECT,
      }
    );

    return res.json(results);
  }
};
