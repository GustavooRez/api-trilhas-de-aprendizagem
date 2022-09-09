const Trilha = require("../models/Trilha");
const TrilhaUsuario = require("../models/TrilhaUsuario");
const ConteudoUsuario = require("../models/ConteudoUsuario");
const Conteudo = require("../models/Conteudo");
const Usuario = require("../models/Usuario");
const PreRequisito = require("../models/PreRequisito");
const CodigoProfessor = require("../models/CodigoProfessor");
const { QueryTypes } = require("sequelize");
const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const sequelize = new Sequelize(dbConfig);
const { Op } = require("@sequelize/core");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const secretToken = "sdaFsadasdaGasdCMySecretKey";
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const nodemailer = require("nodemailer");
const LojaUsuario = require("../models/LojaUsuario");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sistematrilhasdeaprendizagem@gmail.com",
    pass: "sistematrilhasdeaprendizagem27",
  },
});

module.exports = {
  async store(req, res) {
    let {
      nome,
      aniversario,
      telefone,
      email,
      senha,
      tipo_usuario,
      codigo,
    } = req.body; 

    let usuario; 

    if (
      nome !== "" &&
      aniversario !== "" &&
      telefone !== "" &&
      email !== "" &&
      senha !== "" &&
      tipo_usuario.length !== 0
    ) {
      if (email.includes("@")) {
        if (senha.length >= 10) {
          const verifyemail = await Usuario.findOne({
            where: { email },
          });

          if (!verifyemail) {
            senha = bcrypt.hashSync(senha, salt);

            aniversario = moment(aniversario, "DD/MM/YYYY");

            if(aniversario > moment().subtract(10, 'years')){
              return res.json({
                status: 400,
                error: "A idade mínima é de 10 anos"
              });
            }
            aniversario = aniversario.format("YYYY-MM-DD");

            if (tipo_usuario == "student") {
              usuario = await Usuario.create({
                nome,
                aniversario,
                telefone,
                email,
                senha,
                creditos: 0,
                creditos_total: 0,
                indice: 10,
                tipo_usuario: "Aluno",
              });
              await LojaUsuario.create({id_loja: 1, id_usuario: usuario.id, atual:1})
              await LojaUsuario.create({id_loja: 18, id_usuario: usuario.id, atual:1})
              await LojaUsuario.create({id_loja: 30, id_usuario: usuario.id, atual:1})
              
            } else if (tipo_usuario == "professor") {
              const verifyCodigo = await CodigoProfessor.findOne({
                where: { codigo, usado: 0 },
              });
              if (verifyCodigo) {
                usuario = await Usuario.create({
                  nome,
                  aniversario,
                  telefone,
                  email,
                  senha,
                  creditos: null,
                  creditos_total: null,
                  indice: null,
                  tipo_usuario: "Professor",
                });

                verifyCodigo.usado = 1;
                await verifyCodigo.save();
              } else {
                return res.json({
                  status: 400,
                  error: "Código não encontrado ou já utilizado",
                });
              }
            } else if (tipo_usuario == "admin") {
              usuario = await Usuario.create({
                nome,
                aniversario,
                telefone,
                email,
                senha,
                creditos: null,
                creditos_total: null,
                indice: null,
                tipo_usuario: "Admin",
              });
            }

            const accesstoken = jwt.sign({ id: usuario.id }, secretToken, {
              expiresIn: "365d",
            });

            return res.json({ status: 200, usuario, accesstoken });
          } else {
            return res.json({
              status: 400,
              error: "Email já cadastrado no sistema",
            });
          }
        } else {
          return res.json({
            status: 400,
            error: "Senha precisa ter no mínimo 10 caracteres",
          });
        }
      } else {
        return res.json({ status: 400, error: "Email precisa ser válido" });
      }
    } else {
      return res.json({
        status: 400,
        error: "Preencha os campos obrigatórios",
      });
    }
  },
  async storeProfessor(req, res) {
    let { tipo_usuario, email } = req.body;

    if (tipo_usuario == "professor") {
      const codigo_usuario = Math.floor(Math.random() * 99999) - 11111;

      var codigo = await CodigoProfessor.create({
        usado: 0,
        codigo: codigo_usuario,
      });

      const mailOptions = {
        from: "Trilhas de Aprendizagem <sistematrilhasdeaprendizagem@gmail.com>",
        to: email,
        subject: "Código de acesso ao Sistema de Trilhas de Aprendizagem",
        html: `<h2>Olá, professor!</h2>
        <br><p>Este é seu código de acesso para acessar o Sistema de Trilhas de Aprendizagem:</p> <h2>${codigo_usuario}</h2>
        <p>Ele pode ser utilizado apenas uma vez, então cuidado!<br><br> <p>Muito obrigado por utilizar o nosso sistema!</p>`,
      };

      transporter.sendMail(mailOptions);
      return res.json({ status: 200, codigo: codigo_usuario });
    } else {
      return res.json({
        status: 400,
        error: "Tipo de usuário inválido",
      });
    }
  },
  async interestAdministrator(req, res) {
    let { nome, email, justificativa } = req.body;

    if (nome !== "" && email !== "" && justificativa !== "") {
      if (email.includes("@")){
        const mailOptions = {
          from: "Trilhas de Aprendizagem <sistematrilhasdeaprendizagem@gmail.com>",
          to: "sistematrilhasdeaprendizagem@gmail.com",
          subject: "Interesse de usuário no sistema",
          html: `<h3>Olá!</h3>
              <br><p>O usuário ${nome} que possui o email ${email} demonstrou interesse em ser administrador de trilha através da justificativa:<br>${justificativa}</p>`,
        };
  
        transporter.sendMail(mailOptions);
        return res.json({ status: 200 });
      }else{
        return res.json({ status: 400, error: "O email não é válido" });
      }
    }else{
      return res.json({ status: 400, error: "Preencha os campos obrigatórios" });
    }
  },
  async index(req, res) {
    const { id_usuario } = req.params;

    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: [
        "id",
        "nome",
        "aniversario",
        "telefone",
        "email",
        "tipo_usuario",
      ],
    });

    usuario.aniversario = moment(usuario.aniversario, "YYYY-MM-DD");

    const trilhaUsuario = await TrilhaUsuario.findAll({
      where: { id_usuario },
    });

    if (trilhaUsuario !== null) {
      var trilhasUser = [];
      trilhaUsuario.forEach((trilha) => {
        if (trilha.id_trilha) {
          trilhasUser.push(trilha.id_trilha);
        }
      });
    }
    let newTrilha = await Trilha.findAll({ where: { id: trilhasUser } });
    return res.json({ usuario, newTrilha });
  },
  async indexAll(req, res) {
    const usuarios = await Usuario.findAll();

    return res.json(usuarios);
  },
  async indexAllType(req, res) {
    let { tipo_usuario } = req.body;
    const usuarios = await Usuario.findAll({ where: { tipo_usuario } });

    return res.json(usuarios);
  },
  async searchIndexCreditsUser(req, res) {
    const { id_usuario } = req.params;

    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: [
        "creditos",
        "indice",
      ],
    });
    return res.json(usuario);
  },
  async ranking(req, res) {
    const usuarios = await Usuario.findAll({
      where:{
        creditos: { [Op.not]: null },
        tipo_usuario: "Aluno"
      },
      attributes: [
        "id",
        "nome",
        "creditos_total"
      ],
      order: [
        ['creditos_total','DESC']
      ],
      limit: 10
    });
    return res.json(usuarios);
  },
  async login(req, res) {
    let { email, senha } = req.body;

    if (!email || !senha) {
      return res.json({ error: "Email e senha são requeridos" });
    }

    const usuario = await Usuario.findOne({
      where: { email },
    });

    if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
      return res.json({ error: "Usuário não foi encontrado" });
    } else {
      const accesstoken = jwt.sign({ id: usuario.id }, secretToken, {
        expiresIn: "365d",
      });
      return res.status(200).json({ usuario, accesstoken });
    }
  },
  async logout(req, res) {
    return res.json({ auth: false, token: null });
  },
  async contentsCompleted(req, res) {
    const { id_usuario } = req.params;

    const contentsId = await ConteudoUsuario.findAll({
      attributes: ["id_conteudo"],
      where: { id_usuario, completo: 1 },
    });

    var contents = [];
    contentsId.forEach((content) => {
      contents.push(content.id_conteudo);
    });

    var results = await Conteudo.findAll({
      where: { id: { [Op.in]: contents } },
      include: [{ model: PreRequisito, as: "pre_requisito" }],
    });
    userContents = [];
    results.forEach((result) => {
      userContents.push(result.codigo);
    });
    return res.json({ results, userContents });
  },
  async indexProfile(req, res) {
    const { id_usuario } = req.params;

    const usuario = await Usuario.findByPk(id_usuario)

    if(!usuario){
      return res.json({ status: 400, error: "Usuário não foi encontrado" });
    }

    var results = await sequelize.query(
      `SELECT Loja.titulo, Loja.categoria, Loja.imagem FROM usuario as Usuario 
        LEFT JOIN loja_usuario as LojaUsuario ON Usuario.id = LojaUsuario.id_usuario
        LEFT JOIN loja as Loja ON Loja.id = LojaUsuario.id_loja 
        WHERE LojaUsuario.id_usuario = :id_usuario AND LojaUsuario.atual = 1`,
      {
        replacements: { id_usuario },
        type: QueryTypes.SELECT,
      }
    );
    
    return res.json({ status: 200, usuario, itens: results});
  },
  async update(req, res) {
    let { nome, aniversario, telefone, email, tipo_usuario } =
      req.body;

    const { id_usuario } = req.params;
    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
      return res.json({ error: "Usuário não foi encontrado" });
    } else {
      if (
        nome !== "" &&
        aniversario !== "" &&
        telefone !== "" &&
        email !== ""
      ) {
        usuario.nome = nome;
        aniversario = moment(aniversario, "DD/MM/YYYY");
        aniversario = aniversario.format("YYYY-MM-DD");
        usuario.aniversario = aniversario;
        usuario.telefone = telefone;
        usuario.email = email;

        await usuario.save();
      } else {
        return res.json({
          status: 400,
          error: "Preencha os campos obrigatórios",
        });
      }
    }

    return res.json({ status: 200, message: "Usuário atualizado com sucesso" });
  },
  async delete(req, res) {
    const { id_usuario } = req.params;

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
      return res.json({ error: "Usuário não foi encontrado" });
    }

    await usuario.destroy();

    return res.json({ message: "Usuário deletado com sucesso" });
  },
};
