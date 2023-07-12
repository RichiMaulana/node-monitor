'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class process_data extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        // static associate(models) {
        //     this.belongsTo(models.TransCompanies, {
        //         foreignKey: 'transCompanyId',
        //         onUpdate: 'cascade',
        //     });
        //     // define association here
        // }
    }
    let schema = {
        hostname: DataTypes.STRING,
        timestamp: DataTypes.DATE,
        process_name: DataTypes.TEXT,
        cpu_usage_percent: DataTypes.DOUBLE,
        memory_usage: DataTypes.DOUBLE
    };
    process_data.init(schema, {
        sequelize,
        modelName: 'process_data',
    });
    return process_data;
};
