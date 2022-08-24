const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: config.operatorsAliases,
        timezone: '-06:00'
            /*pool: {
                max: config.pool.max,
                min: config.pool.min,
                acquire: config.pool.acquire,
                idle: config.pool.idle
            }*/
    }
);

//para el historial de nomina
const sequelizeNomina = new Sequelize(
    config.DBNomina,
    config.USER,
    config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: config.operatorsAliases,
        timezone: '-06:00'
            /*pool: {
                max: config.pool.max,
                min: config.pool.min,
                acquire: config.pool.acquire,
                idle: config.pool.idle
            }*/
    }
);


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
//historial de plazas segun sistema de nomina
db.sequelizeNomina = sequelizeNomina;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.catplanteles = require("../models/catplanteles.model.js")(sequelize, Sequelize);
db.catvariablesbase = require("../models/catvariablesbase.model.js")(sequelize, Sequelize);
db.personal = require("../models/personal.model.js")(sequelize, Sequelize);

module.exports = db;