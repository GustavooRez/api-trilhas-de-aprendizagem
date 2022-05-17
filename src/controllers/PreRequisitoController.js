const PreRequisito = require("../models/PreRequisito");

module.exports = {
  async index(req, res) {
    const { id_pre_requisito } = req.params;

    const pre_requisito = await PreRequisito.findByPk(id_pre_requisito);

    return res.json(pre_requisito);
  },
  async store(req, res) {
    const {id_conteudo} = req.params
    const { titulo, descricao} = req.body;

    const conteudo = await Conteudo.findByPk(id_conteudo);
    if(!conteudo){
        return res.json({ error: "Conteúdo não foi encontrado" });
    }

    // const topico = await Topico.create({
    //   titulo,
    //   descricao,
    //   id_conteudo
    // });

    return res.json(topico);
  },
  async update(req, res) {
    const { titulo, descricao } = req.body;
    const { id_topico } = req.params;

    const topico = await Topico.findByPk(id_topico);

    if (!topico) {
      return res.json({ error: "Tópico  não foi encontrado" });
    }

    if (topico.titulo !== titulo && titulo !== null && titulo !== "") {
        topico.titulo = titulo;
    }

    if (
        topico.descricao !== descricao &&
      descricao !== null &&
      descricao !== ""
    ) {
        topico.descricao = descricao;
    }

    await topico.save();
    
    return res.json({ message: "Tópico atualizado com sucesso" });
  },
  async delete(req, res) {
    const { id_topico } = req.params;

    const topico = await Topico.findByPk(id_topico);

    if (!topico) {
      return res.json({ error: "Tópico não foi encontrado" });
    }

    await topico.destroy();

    return res.json({message: "Tópico deletado com sucesso"});
  }
};
