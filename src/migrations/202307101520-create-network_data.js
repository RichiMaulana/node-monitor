"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("network_data", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      hostname: {
        type: Sequelize.STRING,
      },
      timestamp: {
        type: Sequelize.DATE,
      },
      type: {
        type: Sequelize.STRING(50),
      },
      tx: {
        type: Sequelize.BIGINT,
      },
      rx: {
        type: Sequelize.BIGINT,
      },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE,
    //   },
    //   updatedAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE,
    //   },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("network_data");
  },
};
