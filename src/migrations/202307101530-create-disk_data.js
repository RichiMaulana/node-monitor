"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("disk_data", {
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
      name: {
        type: Sequelize.STRING,
      },
      mount: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.BIGINT,
      },
      used: {
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
    await queryInterface.dropTable("disk_data");
  },
};
