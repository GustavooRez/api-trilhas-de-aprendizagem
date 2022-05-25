'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('trilha', {
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
      codigo:{
        type: Sequelize.STRING,
        allowNull: false
      },
      id_criador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'usuario', key: 'id'},
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
    return queryInterface.dropTable('trilha', {
    })
  }
};
