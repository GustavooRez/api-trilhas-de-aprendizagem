const Conteudo = require("../models/Conteudo");
const ConteudoUsuario = require("../models/ConteudoUsuario");
const ConteudoPreRequisito = require("../models/ConteudoPreRequisito");
const Usuario = require("../models/Usuario");
const PreRequisito = require("../models/PreRequisito");

module.exports = {
  async index(req, res) {
    const { id_usuario, id_conteudo } = req.body;

    const conteudoUsuario = await ConteudoUsuario.findOne({
      where: { id_usuario: id_usuario, id_conteudo: id_conteudo },
    });

    if (conteudoUsuario) {
      return res.json({ code: 200, completo: conteudoUsuario.completo });
    } else {
      return res.json({ code: 201 });
    }
  },
  async indexCompleted(req, res) {
    const { id_usuario, id_conteudo } = req.body;

    const conteudoUsuario = await ConteudoUsuario.findAll({
      where: { id_usuario: id_usuario, id_conteudo: id_conteudo, completo: 1 },
    });

    if (conteudoUsuario.length !== 0) {
      return res.json({ code: 200 });
    } else {
      return res.json({ code: 201 });
    }
  },
  async indexUsuario(req, res) {
    const { id_usuario } = req.params;

    const conteudoUsuario = await ConteudoUsuario.findAll({
      where: { id_usuario: id_usuario },
    });

    return res.json(conteudoUsuario);
  },
  async indexConteudo(req, res) {
    const { id_conteudo } = req.params;

    const usuarioConteudo = await ConteudoUsuario.findAll({
      where: { id_conteudo: id_conteudo },
    });

    return res.json(usuarioConteudo);
  },
  async store(req, res) {
    const { id_usuario, id_conteudo } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    const conteudo = await Conteudo.findByPk(id_conteudo);

    if (!usuario) {
      return res.json({ status: 400, error: "Usuário não encontrado" });
    }
    if (!conteudo) {
      return res.json({ status: 400, error: "Conteúdo não encontrado" });
    }

    const conteudoUsuario = await ConteudoUsuario.create({
      id_usuario,
      id_conteudo,
    });

    return res.json({ status: 200, conteudoUsuario });
  },
  async storeUserContent(req, res) {
    const { id_usuario, id_conteudo } = req.body;

    var usuario = await Usuario.findByPk(id_usuario);
    const conteudo = await Conteudo.findByPk(id_conteudo);

    if (!usuario) {
      return res.json({ status: 400, error: "Usuário não encontrado" });
    }
    if (!conteudo) {
      return res.json({ status: 400, error: "Conteúdo não encontrado" });
    } else {
      const conteudosPreRequisito = await ConteudoPreRequisito.findAll({
        where: { id_conteudo },
      });

      if (conteudosPreRequisito.length === 0) {
        const conteudoUsuario = await ConteudoUsuario.create({
          id_usuario,
          id_conteudo,
          completo: 0,
          usuario: "Aluno",
        });

        usuario.creditos = usuario.creditos - conteudo.creditos_custo;
        usuario.creditos_total =
          usuario.creditos_total - conteudo.creditos_custo;
        usuario.save();

        return res.json({
          status: 200,
          message: "Inscrição realizada com sucesso",
          conteudoUsuario,
        });
      } else {
        var conteudosPre = [];
        conteudosPreRequisito.forEach((conteudoPreRequisito) => {
          if (conteudoPreRequisito.id_pre_requisito) {
            conteudosPre.push(conteudoPreRequisito.id_pre_requisito);
          }
        });
        let preRequisitos = await PreRequisito.findAll({
          attributes: ["id_conteudo"],
          where: { id: conteudosPre },
        });

        var prerequisitos = [];
        preRequisitos.map((prerequisito) => {
          if (prerequisito.id_conteudo) {
            prerequisitos.push(prerequisito.id_conteudo);
          }
        });

        const contentsId = await ConteudoUsuario.findAll({
          attributes: ["id_conteudo"],
          where: { id_usuario, completo: 1 },
        });

        var contentsUser = [];
        contentsId.forEach((content) => {
          contentsUser.push(content.id_conteudo);
        });

        var verificacao = true;
        prerequisitos.forEach((prereq) => {
          if (!contentsUser.includes(prereq)) {
            verificacao = false;
          }
        });

        if (verificacao === true) {
          const conteudoUsuario = await ConteudoUsuario.create({
            id_usuario,
            id_conteudo,
            completo: 0,
            usuario: "Aluno",
          });

          usuario.creditos = usuario.creditos - conteudo.creditos_custo;
          usuario.creditos_total =
            usuario.creditos_total - conteudo.creditos_custo;
          usuario.save();

          return res.json({
            status: 200,
            message: "Inscrição realizada com sucesso",
            conteudoUsuario,
          });
        } else {
          return res.json({
            status: 400,
            error: "Você não possui os pré requisitos necessários",
          });
        }
      }
    }
  },
  async forceStorUserContent(req, res) {
    const { id_usuario, conteudos } = req.body;

    const promises = [];
    if (conteudos.length > 0) {
      conteudos.forEach((id_conteudo) => {
        promises.push(
          ConteudoUsuario.create({
            id_usuario,
            id_conteudo,
            completo: 1,
            usuario: "Aluno",
          })
        );
      });
    }
    await Promise.all(promises);
    return res.json({
      code: 200,
      message: "Conteudos inseridos com sucesso",
    });
  },
  async update(req, res) {
    const { id_usuario, id_conteudo, completo } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.json({
        code: 400,
        message: "Usuário não encontrado",
      });
    }

    const conteudo = await Conteudo.findByPk(id_conteudo);
    if (!conteudo) {
      return res.json({
        code: 400,
        message: "Conteúdo não encontrado",
      });
    }

    const conteudoUsuario = await ConteudoUsuario.findOne({
      where: { id_usuario: id_usuario, id_conteudo: id_conteudo },
    });

    if (!conteudoUsuario) {
      await ConteudoUsuario.create({
        id_usuario,
        id_conteudo,
        completo,
        usuario: "Aluno",
      });

      return res.json({
        code: 200,
        message: "Conteúdo do usuário alterado com sucesso",
      });
    } else {
      if (completo === -1) {
        switch (conteudo.dificuldade) {
          case "facil":
            usuario.indice = usuario.indice - 1.5;
            break;
          case "medio":
            usuario.indice = usuario.indice - 1;
            break;
          case "dificil":
            usuario.indice = usuario.indice - 0.5;
            break;

          default:
            break;
        }
        usuario.save();
        await usuario.save();

        return res.json({
          code: 200,
          message: "Conteúdo do usuário alterado com sucesso",
        });
      } else {
        conteudoUsuario.completo = completo;
        await conteudoUsuario.save();
        switch (conteudo.dificuldade) {
          case "facil":
            usuario.indice = usuario.indice + 0.2;
            usuario.creditos = usuario.creditos + conteudo.creditos_custo * 1.2;
            usuario.creditos_total =
              usuario.creditos_total + conteudo.creditos_custo * 1.2;
            break;
          case "medio":
            usuario.indice = usuario.indice + 0.6;
            usuario.creditos = usuario.creditos + conteudo.creditos_custo * 1.5;
            usuario.creditos_total =
              usuario.creditos_total + conteudo.creditos_custo * 1.5;
            break;
          case "dificil":
            usuario.indice = usuario.indice + 1;
            usuario.creditos = usuario.creditos + conteudo.creditos_custo * 1.8;
            usuario.creditos_total =
              usuario.creditos_total + conteudo.creditos_custo * 1.8;
            break;
          default:
            break;
        }
        if (usuario.indice > 10) {
          usuario.indice = 10;
        }
        await usuario.save();

        return res.json({
          code: 200,
          message: "Conteúdo do usuário alterado com sucesso",
        });
      }
    }
  },
};
