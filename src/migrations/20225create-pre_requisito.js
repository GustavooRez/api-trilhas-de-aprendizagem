'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('pre_requisito', {
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
      titulo:{
        type: Sequelize.STRING,
        allowNull: false
      },
      codigo:{
        type: Sequelize.STRING,
        allowNull: false
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
    return queryInterface.dropTable('pre_requisito', {
    })
  }
};
