const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('character', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      isAlpha: true
    },
    image: {
      type: DataTypes.STRING
    },
    age: {
      type: DataTypes.INTEGER,
      min: 0,
      max: 99
    },
    weight: {
      type: DataTypes.INTEGER,
      min: 0
    },
    history: {
      type: DataTypes.STRING(1200)
    }
  });
};