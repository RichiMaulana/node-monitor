'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class network_data extends Model {
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
        type: DataTypes.STRING(50),
        tx: DataTypes.INTEGER,
        rx: DataTypes.INTEGER
    };
    network_data.init(schema, {
        sequelize,
        modelName: 'network_data',
    });
    return network_data;
};
