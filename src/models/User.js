const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(54),
            allowNull: false
        }
    })
}

