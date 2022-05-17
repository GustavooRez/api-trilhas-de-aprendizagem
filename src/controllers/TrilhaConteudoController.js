const Conteudo = require("../models/Conteudo");
const TrilhaConteudo = require("../models/TrilhaConteudo");
const Trilha = require("../models/Trilha");

module.exports = {
  async indexTrilha(req, res) {
    const { id_trilha } = req.params;

    const conteudoTrilha = await TrilhaConteudo.findAll({where: {id_trilha}})

    return res.json(conteudoTrilha);
  },
  async indexConteudo(req, res) {
    const { id_conteudo } = req.params;

    const trilhaConteudo = await TrilhaConteudo.findAll({where: {id_conteudo}})

    return res.json(trilhaConteudo);
  },
  async store(req, res) {
    const { id_trilha, id_conteudo } = req.body;

    const trilha = await Trilha.findByPk(id_trilha);
    const conteudo = await Conteudo.findByPk(id_conteudo);

    if (!trilha) {
      return res.status(400).json({ error: "Trilha não encontrada" });
    }
    if (!conteudo) {
      return res.status(400).json({ error: "Conteúdo não encontrado" });
    }

    const trilhaConteudo = await TrilhaConteudo.create({
        id_trilha,
        id_conteudo
    });

    return res.json(trilhaConteudo);
  },
};
