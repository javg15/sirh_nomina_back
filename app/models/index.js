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
db.personal = require("../models/personal.model.js")(sequelize, Sequelize);
db.catpercepciones = require("../models/catpercepciones.model.js")(sequelize, Sequelize);
db.catdeducciones = require("../models/catdeducciones.model.js")(sequelize, Sequelize);
db.categoriasasignacion = require("./categoriasasignacion.model.js")(sequelize, Sequelize);
db.catquincena = require("./catquincena.model.js")(sequelize, Sequelize);
db.cattiposadeudos = require("./cattiposadeudos.model.js")(sequelize, Sequelize);
db.cattiposdevoluciones = require("./cattiposdevoluciones.model.js")(sequelize, Sequelize);
db.catfondospresupuestales = require("./catfondospresupuestales.model.js")(sequelize, Sequelize);
db.catrecibosestatus = require("./catrecibosestatus.model.js")(sequelize, Sequelize);
db.catrecibostipos = require("./catrecibostipos.model.js")(sequelize, Sequelize);
db.categorias = require("./categorias.model.js")(sequelize, Sequelize);
db.catzonaeconomica = require("./catzonaeconomica.model.js")(sequelize, Sequelize);
db.percepcionescaptura = require("../models/percepcionescaptura.model.js")(sequelize, Sequelize);
db.deduccionescaptura = require("../models/deduccionescaptura.model.js")(sequelize, Sequelize);
db.percepcionesadeudos = require("../models/percepcionesadeudos.model.js")(sequelize, Sequelize);
db.deduccionesdevoluciones = require("../models/deduccionesdevoluciones.model.js")(sequelize, Sequelize);
db.reducciones = require("../models/reducciones.model.js")(sequelize, Sequelize);
db.recibos = require("../models/recibos.model.js")(sequelize, Sequelize);

module.exports = db;