'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('loja', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      titulo:{
        type: Sequelize.STRING,
        allowNull: false
      },
      descricao:{
        type: Sequelize.STRING,
        allowNull: false
      },
      categoria:{
        type: Sequelize.STRING,
        allowNull: false
      },
      valor:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      imagem:{
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
    return queryInterface.dropTable('loja', {
    })
  }
};
