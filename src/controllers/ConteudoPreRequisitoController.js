const Conteudo = require("../models/Conteudo");
const ConteudoPreRequisito = require("../models/ConteudoPreRequisito");
const PreRequisito = require("../models/PreRequisito");

module.exports = {
  async indexPreRequisito(req, res) {
    const { id_pre_requisito } = req.params;

    const conteudoPreRequisito = await ConteudoPreRequisito.findAll({where: {id_pre_requisito}})

    return res.json(conteudoPreRequisito);
  },
  async indexConteudo(req, res) {
    const { id_conteudo } = req.params;

    const preRequisitoConteudo = await ConteudoPreRequisito.findAll({where: {id_conteudo}})

    return res.json(preRequisitoConteudo);
  },
  async store(req, res) {
    const { id_pre_requisito, id_conteudo } = req.body;

    const pre_requisito = await PreRequisito.findByPk(id_pre_requisito);
    const conteudo = await Conteudo.findByPk(id_conteudo);

    if (!pre_requisito) {
      return res.status(400).json({ error: "Pre Requisito não encontrado" });
    }
    if (!conteudo) {
      return res.status(400).json({ error: "Conteúdo não encontrado" });
    }

    const conteudoPreRequisito = await ConteudoPreRequisito.create({
        id_pre_requisito,
        id_conteudo
    });

    return res.json(conteudoPreRequisito);
  },
};
