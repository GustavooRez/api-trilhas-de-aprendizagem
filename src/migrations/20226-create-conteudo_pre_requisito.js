'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('conteudo_pre_requisito', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_conteudo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'conteudo', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_pre_requisito: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'pre_requisito', key: 'id'},
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
    return queryInterface.dropTable('conteudo_pre_requisito', {
    })
  }
};
