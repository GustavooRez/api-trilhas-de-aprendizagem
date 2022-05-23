const Conteudo = require("../models/Conteudo");
const ConteudoPreRequisito = require("../models/ConteudoPreRequisito");
const PreRequisito = require("../models/PreRequisito");
const Topico = require("../models/Topico");
const Usuario = require("../models/Usuario");
const Trilha = require("../models/Trilha");
const ConteudoUsuario = require("../models/ConteudoUsuario");
const TrilhaConteudo = require("../models/TrilhaConteudo");
const ConteudoController = require("../controllers/ConteudoController");
const { Op } = require("@sequelize/core");

module.exports = {
  async index(req, res) {
    const { id_conteudo } = req.params;

    const conteudo = await Conteudo.findByPk(id_conteudo, {
      include: { association: "topico" },
    });

    const trilhasConteudo = await TrilhaConteudo.findAll({
      where: { id_conteudo },
    });

    if (trilhasConteudo !== null) {
      var trilhasCont = [];
      trilhasConteudo.forEach((trilhaConteudo) => {
        if (trilhaConteudo.id_trilha) {
          trilhasCont.push(trilhaConteudo.id_trilha);
        }
      });
    }
    let trilhas = await Trilha.findAll({ where: { id: trilhasCont } });

    const conteudosPreRequisito = await ConteudoPreRequisito.findAll({
      where: { id_conteudo },
    });

    if (conteudosPreRequisito !== null) {
      var conteudosPre = [];
      conteudosPreRequisito.forEach((conteudoPreRequisito) => {
        if (conteudoPreRequisito.id_pre_requisito) {
          conteudosPre.push(conteudoPreRequisito.id_pre_requisito);
        }
      });
    }
    let preRequisito = await PreRequisito.findAll({
      where: { id: conteudosPre },
    });

    const conteudosDocente = await ConteudoUsuario.findAll({
      where: { id_conteudo, usuario: "Professor" },
    });

    if (conteudosDocente !== null) {
      var conteudosDoc = [];
      conteudosDocente.forEach((conteudoDocente) => {
        if (conteudoDocente.id_usuario) {
          conteudosDoc.push(conteudoDocente.id_usuario);
        }
      });
    }

    let docentes = await Usuario.findAll({
      where: { id: conteudosDoc },
    });

    return res.json({ conteudo, trilhas, docentes, preRequisito });
  },
  async professorContentUser(req, res) {
    const { id_usuario } = req.params;

    const conteudoUsuario = await ConteudoUsuario.findAll({
      where: { id_usuario, usuario: "Professor" },
    });

    var conteudos = [];
    conteudoUsuario.forEach((conteudo) => {
      conteudos.push(conteudo.id_conteudo);
    });

    var result = await Conteudo.findAll({
      where: { id: { [Op.in]: conteudos } },
    });

    return res.json({ conteudos: result });
  },
  async userContents(req, res) {
    const { id_conteudo } = req.params;

    const conteudoUsuario = await ConteudoUsuario.findAll({
      where: { id_conteudo },
    });

    var usuarios = [];
    conteudoUsuario.forEach((usuario) => {
      usuarios.push(usuario.id_usuario);
    });

    var result = await Usuario.findAll({
      where: { id: { [Op.in]: usuarios } },
    });

    return res.json({ usuarios: result });
  },
  async StudentUserContents(req, res) {
    const { id_conteudo } = req.params;

    const conteudoUsuario = await ConteudoUsuario.findAll({
      where: { id_conteudo, usuario: "Aluno" },
    });

    var usuarios = [];
    conteudoUsuario.forEach((usuario) => {
      usuarios.push(usuario.id_usuario);
    });

    var result = await Usuario.findAll({
      where: { id: { [Op.in]: usuarios } },
    });

    return res.json({ usuarios: result });
  },
  async indexAll(req, res) {
    const conteudos = await Conteudo.findAll();

    return res.json(conteudos);
  },
  async store(req, res) {
    const {
      titulo,
      descricao,
      ch_teorica,
      ch_pratica,
      codigo,
      docentes,
      topicos,
      pre_requisitos,
      trilhas,
    } = req.body;

    if (
      titulo !== "" &&
      descricao !== "" &&
      ch_teorica !== "" &&
      ch_pratica !== "" &&
      docentes.length > 0 &&
      codigo !== "" &&
      trilhas.length > 0
    ) {
      const conteudo = await Conteudo.create({
        titulo,
        descricao,
        ch_teorica,
        ch_pratica,
        codigo,
      });

      await PreRequisito.create({
        titulo,
        codigo,
        id_conteudo: conteudo.id,
      });

      if (topicos !== undefined) {
        topicos.forEach((topico) => {
          if (topico) {
            Topico.create({
              id_conteudo: conteudo.id,
              titulo: topico.titulo,
              descricao: topico.descricao,
            });
          }
        });
      }

      if (docentes !== undefined) {
        docentes.forEach((docente) => {
          if (docente) {
            ConteudoUsuario.create({
              id_conteudo: conteudo.id,
              id_usuario: docente,
              usuario: "Professor",
              completo: 1
            });
          }
        });
      }

      if (pre_requisitos !== undefined) {
        let prerequisitosSearch = [];
        pre_requisitos.forEach((pre_requisito) => {
          if (pre_requisito) {
            prerequisitosSearch.push(pre_requisito);
          }
        });

        var preRequisitosSelected = await PreRequisito.findAll({
          where: { id_conteudo: { [Op.in]: prerequisitosSearch } },
        });

        let preRequisitosInsert = [];
        preRequisitosSelected.forEach((pre_requisito) => {
          if (pre_requisito) {
            preRequisitosInsert.push(pre_requisito.id);
          }
        });

        preRequisitosInsert.forEach((prerequisitoinsert) => {
          ConteudoPreRequisito.create({
            id_conteudo: conteudo.id,
            id_pre_requisito: prerequisitoinsert,
          });
        });
      }

      if (trilhas !== undefined) {
        trilhas.forEach((trilha) => {
          TrilhaConteudo.create({
            id_trilha: trilha,
            id_conteudo: conteudo.id,
          });
        });
      }

      return res.json({ status: 200, conteudo });
    } else {
      return res.json({
        status: 400,
        error: "Preencha os campos obrigatórios",
      });
    }
  },
  async update(req, res) {
    const {
      titulo,
      descricao,
      ch_teorica,
      ch_pratica,
      codigo,
      docentes,
      trilhas,
      pre_requisitos,
    } = req.body;

    const { id_conteudo } = req.params;
    const conteudo = await Conteudo.findByPk(id_conteudo);

    if (!conteudo) {
      return res.json({ status: 400, error: "Conteúdo não foi encontrado" });
    } else {
      if (
        titulo !== "" &&
        descricao !== "" &&
        ch_teorica !== "" &&
        ch_pratica !== "" &&
        codigo !== "" &&
        docentes.length !== 0 &&
        trilhas.length !== 0
      ) {
        (conteudo.titulo = titulo),
          (conteudo.descricao = descricao),
          (conteudo.ch_teorica = ch_teorica),
          (conteudo.ch_pratica = ch_pratica),
          (conteudo.codigo = codigo),
          await conteudo.save();

        if (trilhas !== undefined) {
          const trilhaConteudo = await TrilhaConteudo.findAll({
            where: { id_conteudo },
          });

          if (trilhaConteudo !== null) {
            trilhaConteudo.forEach((trilha) => {
              trilha.destroy();
            });
          }

          let trilhasSearch = [];
          trilhas.forEach((trilha) => {
            if (trilha) {
              trilhasSearch.push(trilha);
            }
          });
          trilhasSearch.map((trilhaSearch) => {
            TrilhaConteudo.create({
              id_conteudo: id_conteudo,
              id_trilha: trilhaSearch,
            });
          });
        }

        if (docentes !== undefined) {
          const docentesConteudo = await ConteudoUsuario.findAll({
            where: { id_conteudo, usuario: "Professor" },
          });

          if (docentesConteudo !== null) {
            docentesConteudo.forEach((docente) => {
              docente.destroy();
            });
          }

          let docentesSearch = [];
          docentes.forEach((docente) => {
            if (docente) {
              docentesSearch.push(docente);
            }
          });
          docentesSearch.map((docenteSearch) => {
            ConteudoUsuario.create({
              id_conteudo: id_conteudo,
              id_usuario: docenteSearch,
              usuario: "Professor",
              completo: 1
            });
          });
        }

        if (pre_requisitos !== undefined) {
          const preRequisitoConteudo = await ConteudoPreRequisito.findAll({
            where: { id_conteudo },
          });

          if (preRequisitoConteudo !== null) {
            preRequisitoConteudo.forEach((preRequisito) => {
              preRequisito.destroy();
            });
          }

          let pre_requisitosSearch = [];
          pre_requisitos.forEach((pre_requisito) => {
            if (pre_requisito) {
              pre_requisitosSearch.push(pre_requisito);
            }
          });

          pre_requisitosSearch.map((pre_requisitoSearch) => {
            ConteudoPreRequisito.create({
              id_conteudo: id_conteudo,
              id_pre_requisito: pre_requisitoSearch,
            });
          });
        }
        return res.json({
          status: 200,
          message: "Conteúdo atualizado com sucesso",
        });
      } else {
        return res.json({
          status: 400,
          error: "Preencha os campos obrigatórios",
        });
      }
    }
  },
  async delete(req, res) {
    const { id_conteudo } = req.params;

    const conteudo = await Conteudo.findByPk(id_conteudo);

    if (!conteudo) {
      return res.json({ error: "Conteúdo não foi encontrado" });
    }

    await conteudo.destroy();

    return res.json({status:200, message: "Conteúdo deletado com sucesso" });
  },
  async searchPreRequisites(req, res) {
    const { id_conteudo } = req.params;
    var arrayPreRequesites = [];
    
    async function searchPreRequesitesRecursiva(content) {
      arrayPreRequesites.push(parseInt(content));
      const conteudo = await Conteudo.findOne({
        where: { id: content },
        include: [{ model: PreRequisito, as: "pre_requisito" }],
      });

      if (conteudo.pre_requisito.length == 0) {
        return conteudo;
      } else {
        return Promise.all(conteudo.pre_requisito.map(preReq => searchPreRequesitesRecursiva(preReq.id_conteudo)))
      }
    }

    await searchPreRequesitesRecursiva(id_conteudo);

    return res.json({ status: 200, conteudo: arrayPreRequesites });
  },
};
