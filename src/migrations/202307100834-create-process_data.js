"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("process_data", {
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
      process_name: {
        type: Sequelize.TEXT,
      },
      cpu_usage_percent: {
        type: Sequelize.DOUBLE,
      },
      memory_usage: {
        type: Sequelize.DOUBLE,
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
    await queryInterface.dropTable("process_data");
  },
};
