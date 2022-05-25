const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const connection = new Sequelize(dbConfig);

const Usuario = require('../models/Usuario');
const Trilha = require('../models/Trilha');
const Conteudo = require('../models/Conteudo');
const Topico = require('../models/Topico');
const PreRequisito = require('../models/PreRequisito');
const Log = require('../models/Log');
const TrilhaUsuario = require('../models/TrilhaUsuario');
const ConteudoUsuario = require('../models/ConteudoUsuario');
const TrilhaConteudo = require('../models/TrilhaConteudo');
const ConteudoPreRequisito = require('../models/ConteudoPreRequisito');
const CodigoProfessor = require('../models/CodigoProfessor');

Usuario.init(connection);
Trilha.init(connection);
Conteudo.init(connection);
Topico.init(connection);
PreRequisito.init(connection);
Log.init(connection);
TrilhaUsuario.init(connection);
ConteudoUsuario.init(connection);
TrilhaConteudo.init(connection);
ConteudoPreRequisito.init(connection);
CodigoProfessor.init(connection);

Usuario.associate(connection.models)
Trilha.associate(connection.models)
Topico.associate(connection.models)
Conteudo.associate(connection.models)
PreRequisito.associate(connection.models)
Log.associate(connection.models)

module;exports = connection;