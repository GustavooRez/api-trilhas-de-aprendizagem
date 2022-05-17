'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('conteudo_usuario', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'usuario', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_conteudo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'conteudo', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      usuario:{
        type: Sequelize.STRING,
        allowNull: false
      },
      completo: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at:{
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at:{
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('conteudo_usuario', {
    })
  }
};
