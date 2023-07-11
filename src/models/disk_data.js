'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class disk_data extends Model {
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
        name: DataTypes.STRING,
        mount: DataTypes.STRING,
        size: DataTypes.INTEGER,
        used: DataTypes.INTEGER
    };
    disk_data.init(schema, {
        sequelize,
        modelName: 'disk_data',
    });
    return disk_data;
};
