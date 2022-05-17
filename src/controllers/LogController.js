const Log = require("../models/Log");
const Usuario = require("../models/Usuario");

module.exports = {
  async index(req, res) {
    const { id_usuario } = req.params;

    const usuario = await Usuario.findByPk(id_usuario, {
      include: { association: "log" },
    });

    return res.json(usuario.professor);
  },
  async store(req, res) {
    const { id_usuario } = req.params;
    const { acao } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const log = await Log.create({
      acao,
      id_usuario
    });

    return res.json(log);
  },
};
