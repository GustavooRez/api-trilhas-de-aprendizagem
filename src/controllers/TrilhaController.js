const Trilha = require("../models/Trilha");
const Conteudo = require("../models/Conteudo");
const TrilhaConteudo = require("../models/TrilhaConteudo");
const { Op } = require("@sequelize/core");
const PreRequisito = require("../models/PreRequisito");
const TrilhaUsuario = require("../models/TrilhaUsuario");

module.exports = {
  async index(req, res) {
    const { id_trilha } = req.params;

    const trilha = await Trilha.findByPk(id_trilha);

    return res.json(trilha);
  },
  async indexAll(req, res) {
    const trilhas = await Trilha.findAll();

    return res.json(trilhas);
  },
  async indexByUser(req, res) {
    const { id_usuario } = req.params;

    const trilha = await Trilha.findAll({where: {id_criador : id_usuario}});

    return res.json(trilha);
  },
  async contents(req, res) {
    const { id_trilha } = req.params;

    const trilha = await Trilha.findByPk(id_trilha);

    const contentsId = await TrilhaConteudo.findAll({
      attributes: ["id_conteudo"],
      where: { id_trilha },
    });

    var contents = [];
    contentsId.forEach((content) => {
      contents.push(content.id_conteudo);
    });

    var result = await Conteudo.findAll({
      where: { id: { [Op.in]: contents } },
      include: [{ model: PreRequisito, as: "pre_requisito" }],
    });

    var contentsIdFinal = []
    result.forEach((content_result)=>{
      contentsIdFinal.push(content_result.id)
    })
    return res.json({trilha, content: result, contentsId: contentsIdFinal});
  },
  async contentsTrials(req, res) {
    const trials = req.body.trilhas;

    const contentsId = await TrilhaConteudo.findAll({
      attributes: ["id_conteudo"],
      where: { id_trilha: trials },
    });

    var contents = [];
    contentsId.forEach((content) => {
      contents.push(content.id_conteudo);
    });

    var result = await Conteudo.findAll({
      where: { id: { [Op.in]: contents } },
    });
    return res.json(result);
  },
  async userTrails(req, res) {
    const { id_usuario } = req.params;

    const trilhaUsuario = await TrilhaUsuario.findAll({where: {id_usuario}});

    var trilhas = [];
    trilhaUsuario.forEach((trilha) => {
      trilhas.push(trilha.id_trilha);
    });

    var result = await Trilha.findAll({
      where: { id: { [Op.in]: trilhas } },
    });

    return res.json({trilha: result});
  },
  async store(req, res) {
    const { titulo, descricao, codigo, id_usuario, creditos_ganhos } = req.body;

    if (titulo !== "" && descricao !== "" && codigo !== "" && creditos_ganhos !== "") {
      const trilha = await Trilha.create({
        titulo,
        descricao,
        codigo,
        creditos_ganhos,
        id_criador : id_usuario
      });

      return res.json({ status: 200, trilha });
    } else {
      return res.json({
        status: 400,
        error: "Preencha os campos obrigatórios",
      });
    }
  },
  async update(req, res) {
    const { titulo, descricao, codigo, id_usuario, creditos_ganhos } = req.body;

    const { id_trilha } = req.params;
    const trilha = await Trilha.findByPk(id_trilha);

    if (!trilha) {
      return res.json({status: 300, error: "Trilha não foi encontrado" });
    }else{
      if(titulo !== "" && descricao !== "" && codigo !== "" && creditos_ganhos !== ""){
        trilha.titulo = titulo;
        trilha.descricao = descricao;
        trilha.creditos_ganhos = creditos_ganhos;
        trilha.codigo = codigo;
        trilha.id_criador = id_usuario
        
        await trilha.save();
        return res.json({ status: 200, message: "Trilha atualizada com sucesso" });
      }else{
        return res.json({ status: 499, message: "Preencha os campos obrigatórios" });
      }
    }
    

  },
  async delete(req, res) {
    const { id_trilha } = req.params;

    const trilha = await Trilha.findByPk(id_trilha);

    if (!trilha) {
      return res.json({status:400, error: "Trilha não foi encontrada" });
    }

    await trilha.destroy();

    return res.json({ status:200, message: "Trilha deletada com sucesso" });
  },
};
