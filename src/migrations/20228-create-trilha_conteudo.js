'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('trilha_conteudo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_trilha: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'trilha', key: 'id'},
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
    return queryInterface.dropTable('trilha_conteudo', {
    })
  }
};
