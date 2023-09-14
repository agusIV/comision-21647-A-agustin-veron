const { DataTypes } = require('sequelize');

const { sequelize } = require("./database.js")

const publicaciones = sequelize.define('publicaciones', {   //se guarda en una constante la estructura de la tabla de la db
    titulo: {
        type: DataTypes.STRING,
    },
    descripcion: {
        type: DataTypes.STRING
    },
    imagen: {
        type: DataTypes.STRING
    },
    fecha: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,   //timestamp cada vez que se crea o modifica un registro lo almacena
    tableName: "publicaciones"
});

module.exports = publicaciones
