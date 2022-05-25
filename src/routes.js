const express = require('express');
const ConteudoController = require('./controllers/ConteudoController');
const ConteudoUsuarioController = require('./controllers/ConteudoUsuarioController');
const ConteudoPreRequisitoController = require('./controllers/ConteudoPreRequisitoController');
const LogController = require('./controllers/LogController');
const PreRequisitoController = require('./controllers/PreRequisitoController');
const TopicoController = require('./controllers/TopicoController');
const TrilhaConteudoController = require('./controllers/TrilhaConteudoController');
const TrilhaController = require('./controllers/TrilhaController');
const UsuarioController = require('./controllers/UsuarioController')
const TrilhaUsuarioController = require('./controllers/TrilhaUsuarioController')
const verify = require('./controllers/AuthorizationController');
const routes = express.Router();

// Creates
routes.post('/users', UsuarioController.store)
routes.post('/users/create-professor', UsuarioController.storeProfessor)
routes.post('/users/:id_usuario/log', verify, LogController.store)
routes.post('/trails', verify, TrilhaController.store)
routes.post('/contents', verify, ConteudoController.store)
routes.post('/trail-user', verify, TrilhaUsuarioController.store)
routes.post('/content-user', verify, ConteudoUsuarioController.store)
routes.post('/users/subscribe-content', verify, ConteudoUsuarioController.storeUserContent)
routes.post('/users/subscribe-trail', verify, TrilhaUsuarioController.store)
routes.post('/trail-content', verify, TrilhaConteudoController.store)
routes.post('/contents/:id_conteudo/topico', verify, TopicoController.store)
routes.post('/contents-prerequisite', verify, ConteudoPreRequisitoController.store) 
routes.post('/users/interest-administrator', UsuarioController.interestAdministrator)
routes.post('/login', UsuarioController.login)
routes.post('/logout', verify, UsuarioController.logout)

//Gets
routes.get('/users', verify, UsuarioController.indexAll)
routes.post('/users/type', verify, UsuarioController.indexAllType)
routes.get('/users/:id_usuario', verify, UsuarioController.index)
routes.get('/trails', TrilhaController.indexAll)
routes.get('/trails/users/:id_usuario', TrilhaController.indexByUser)
routes.get('/trails/:id_trilha', verify, TrilhaController.index)
routes.get('/users/trails/:id_usuario', verify, TrilhaController.userTrails)
routes.get('/trails/:id_trilha/content', verify, TrilhaController.contents)
routes.get('/users/:id_usuario/content-completed', verify, UsuarioController.contentsCompleted)
routes.post('/trails/content', verify, TrilhaController.contentsTrials)
routes.get('/contents', verify, ConteudoController.indexAll)
routes.get('/contents/:id_conteudo', verify, ConteudoController.index)
routes.get('/contents/:id_conteudo/search-pre-requisites', verify, ConteudoController.searchPreRequisites)
routes.get('/contents/:id_conteudo/users', verify, ConteudoController.userContents)
routes.get('/contents/:id_conteudo/student-users', verify, ConteudoController.StudentUserContents)
routes.get('/users/:id_usuario/professor-content', verify, ConteudoController.professorContentUser)
routes.get('/users/:id_usuario/log', verify, LogController.store)
routes.post('/contents-users-completed', verify, ConteudoUsuarioController.indexCompleted)
routes.post('/contents-users', verify, ConteudoUsuarioController.index)
routes.post('/trails-users', verify, TrilhaUsuarioController.index)

// Update
routes.put('/users/:id_usuario', verify, UsuarioController.update);
routes.put('/trails/:id_trilha', verify, TrilhaController.update);
routes.put('/contents/:id_conteudo', verify, ConteudoController.update);
routes.put('/contents-users', verify, ConteudoUsuarioController.update)

// Deletes
routes.delete('/users/:id_usuario', verify, UsuarioController.delete);
routes.delete('/trails/:id_trilha', verify, TrilhaController.delete);
routes.delete('/contents/:id_conteudo', verify, ConteudoController.delete);


module.exports = routes;