const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    sequelize.define('genre', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            isAlpha: true
        },
        image: {
            type: DataTypes.STRING
        }
    })
}