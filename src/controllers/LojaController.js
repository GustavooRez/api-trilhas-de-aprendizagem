const Loja = require("../models/Loja");
const LojaUsuario = require("../models/LojaUsuario");
const { QueryTypes } = require("sequelize");
const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const Usuario = require("../models/Usuario");
const sequelize = new Sequelize(dbConfig);

module.exports = {
  async indexAll(req, res) {
    const { id_usuario } = req.params;
    
    const itens = await Loja.findAll()

    const itensUser = await LojaUsuario.findAll({where: {id_usuario}})

    var itensPersonagem= [], itensAnimal= [], itensTag= [], itensUserPursched= [], itensUserActive = []
    
    itens.forEach(item => {
      switch (item.categoria) {
        case "personagem":
          itensPersonagem.push(item)
          break;
        case "animal":
          itensAnimal.push(item)
          break;
        case "tag":
          itensTag.push(item)
          break;
        default:
          break;
      }
    });

    itensUser.forEach(item => {
      if(item.atual === 0){
        itensUserPursched[item.id_loja] = item
      }else if(item.atual === 1){
        itensUserActive[item.id_loja] = item
      }
    });

    return res.json({status: 200, itensPersonagem,itensAnimal,itensTag, itensUserActive, itensUserPursched});
  },
  async itemUser(req,res){
    const { id_item, id_usuario, type } = req.body;

    let item = await Loja.findByPk(id_item)
    if(!item){
      return res.json({status: 400, error: "Item da loja não encontrado"})
    }

    let usuario = await Usuario.findByPk(id_usuario)
    if(!usuario){
      return res.json({status: 400, error: "Usuário não encontrado"})
    }
    
    var lojaUsuarioId = await sequelize.query(
      `SELECT LojaUsuario.id FROM loja_usuario as LojaUsuario
        LEFT JOIN loja as Loja ON Loja.id = LojaUsuario.id_loja 
        WHERE LojaUsuario.id_usuario = :id_usuario AND LojaUsuario.atual = 1 AND Loja.categoria = :categoria`,
      {
        replacements: { id_usuario, categoria: item.categoria },
        type: QueryTypes.SELECT,
      }
    );
    lojaUsuarioId = lojaUsuarioId[0]["id"]

    const lojaUsuarioAntiga = await LojaUsuario.findByPk(lojaUsuarioId)

    if(type === "adquirir"){
      const lojaUsuario = await LojaUsuario.create({id_loja: id_item, id_usuario, atual: 1})

      if(lojaUsuario){
        usuario.creditos = usuario.creditos - item.valor
        usuario.save()

        lojaUsuarioAntiga.atual = 0
        lojaUsuarioAntiga.save()
      }
      
      return res.json({status: 200, message: "Item adquirido com sucesso"})

    }else if(type === "habilitar"){

      var lojaUsuarioAtual = await LojaUsuario.findOne({where:{
        id_loja: id_item,
        id_usuario
      }})

      lojaUsuarioAtual.atual = 1
      lojaUsuarioAtual.save()

      lojaUsuarioAntiga.atual = 0
      lojaUsuarioAntiga.save()
      
      return res.json({status: 200, message: "Conteúdo habilitado com sucesso"})
    }
  }
};
