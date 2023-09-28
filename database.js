const { Sequelize } = require("sequelize"); //agarra la libreria de sequelize

db_name = process.env.DB_NAME
db_username = process.env.DB_USERNAME
db_password = process.env.DB_PASSWORD

const sequelize = new Sequelize(db_name, db_username, db_password, {    //guarda la db en una constante
    host: "localhost",
    dialect: "mysql"
});

const db_test = async () => {   //confirma si se puede establecer conexion con la db
    try {
        await sequelize.authenticate();
        console.log('conexion exitosa a la db.');
    } catch (error) {
        console.error('fallo al conectar a las bd:', error);
    }
}

module.exports = { sequelize, db_test } //exporta para poder usarlos en otros modulos
