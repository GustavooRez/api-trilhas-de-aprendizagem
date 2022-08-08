'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('loja_usuario', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_loja: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'loja', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'usuario', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      atual:{
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('loja_usuario', {
    })
  }
};
