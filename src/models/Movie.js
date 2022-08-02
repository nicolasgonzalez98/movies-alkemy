const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    
    sequelize.define('movie', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            isAlpha: true
        },
        image: {
            type: DataTypes.STRING,
        },
        date_of_creation:{
            type: DataTypes.DATEONLY
        },
        rating:{
            type:DataTypes.INTEGER,
            min:1,
            max: 5
        }

    })
}