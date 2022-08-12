const Trilha = require("../models/Trilha");
const TrilhaUsuario = require("../models/TrilhaUsuario");
const Usuario = require("../models/Usuario");

module.exports = {
  async index(req, res) {
    const { id_usuario, id_trilha } = req.body;

    const trilhaUsuario = await TrilhaUsuario.findAll({
      where: { id_usuario: id_usuario, id_trilha: id_trilha},
    });

    if (trilhaUsuario.length !== 0) {
      return res.json({ code: 200 });
    } else {
      return res.json({ code: 201 });
    }
  },
  async indexUsuario(req, res) {
    const { id_usuario } = req.params;

    const trilhaUsuario = await TrilhaUsuario.findAll({where: {id_usuario}})

    return res.json(trilhaUsuario);
  },
  async indexTrilha(req, res) {
    const { id_trilha } = req.params;

    const usuarioTrilha = await TrilhaUsuario.findAll({where: {id_trilha}})

    return res.json(usuarioTrilha);
  },
  async store(req, res) {
    const { id_usuario, id_trilha } = req.body;

    let usuario = await Usuario.findByPk(id_usuario);
    const trilha = await Trilha.findByPk(id_trilha);

    if (!usuario) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }
    if (!trilha) {
      return res.status(400).json({ error: "Trilha não encontrado" });
    }

    const trilhaUsuario = await TrilhaUsuario.create({
      id_usuario,
      id_trilha
    });

    usuario.creditos = usuario.creditos + trilha.creditos_ganhos
    usuario.creditos_total = usuario.creditos_total + trilha.creditos_ganhos
    usuario.save()

    return res.json({status:200,
      message: "Inscrição realizada com sucesso",trilhaUsuario});
  },
};
