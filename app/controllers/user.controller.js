const db = require("../models");
const mensajesValidacion = require("../config/validate.config");
const globales = require("../config/global.config");
const User = db.user;

const Personal = db.personal;
const Permusuariosmodulos = db.permusuariosmodulos;
const Op = db.Sequelize.Op;

const { QueryTypes } = require('sequelize');
let Validator = require('fastest-validator');

var bcrypt = require("bcryptjs");
/* create an instance of the validator */
let dataValidator = new Validator({
    useNewCustomCheckerFunction: true, // using new version
    messages: mensajesValidacion
});

let jsonPermisos = [];

exports.getAdmin = async(req, res) => {
    let datos = "",
        query = "";

    if (req.body.solocabeceras == 1) {
        query = "SELECT * FROM adm.s_usuarios_mgr('&sistema=adm&modo=10&id_usuario=:id_usuario')"; //el modo no existe, solo es para obtener un registro

        datos = await db.sequelize.query(query, {
            replacements: {
                id_usuario: req.userId,
            },
            plain: false,
            raw: true,
            type: QueryTypes.SELECT
        });
    } else {
        query = "SELECT * FROM adm.s_usuarios_mgr('" +
            "&sistema=adm&modo=0&id_usuario=:id_usuario" +
            "&inicio=:start&largo=:length" +
            "&scampo=" + req.body.opcionesAdicionales.datosBusqueda.campo + "&soperador=" + req.body.opcionesAdicionales.datosBusqueda.operador + "&sdato=" + req.body.opcionesAdicionales.datosBusqueda.valor +
            "&ordencampo=" + req.body.columns[req.body.order[0].column].data +
            "&ordensentido=" + req.body.order[0].dir + "')";

        datos = await db.sequelize.query(query, {
            // A function (or false) for logging your queries
            // Will get called for every SQL query that gets sent
            // to the server.
            logging: console.log,

            replacements: {
                id_usuario: req.userId,
                start: (typeof req.body.start !== typeof undefined ? req.body.start : 0),
                length: (typeof req.body.start !== typeof undefined ? req.body.length : 1),

            },
            // If plain is true, then sequelize will only return the first
            // record of the result set. In case of false it will return all records.
            plain: false,

            // Set this to true if you don't have a model definition for your query.
            raw: true,
            type: QueryTypes.SELECT
        });
    }

    var columnNames = (datos.length > 0 ? Object.keys(datos[0]).map(function(key) {
        return key;
    }) : []);
    var quitarKeys = false;

    for (var i = 0; i < columnNames.length; i++) {
        if (columnNames[i] == "total_count") quitarKeys = true;
        if (quitarKeys)
            columnNames.splice(i);
    }

    respuesta = {
            draw: req.body.opcionesAdicionales.raw,
            recordsTotal: (datos.length > 0 ? parseInt(datos[0].total_count) : 0),
            recordsFiltered: (datos.length > 0 ? parseInt(datos[0].total_count) : 0),
            data: datos,
            columnNames: columnNames
        }
        //console.log(JSON.stringify(respuesta));
    res.status(200).send(respuesta);
    //return res.status(200).json(data);
    // res.status(500).send({ message: err.message });
}

exports.getCatalogo = async(req, res) => {

    User.findAll({
            attributes: ['id', ['username', 'text']],
            order: [
                ['username', 'ASC'],
            ]
        }).then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            res.status(200).send(user);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getRecord = async(req, res) => {

    User.findOne({
            //attributes: { exclude: ['pass'] },
            where: {
                id: req.body.id
            }
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            user.pass = '';
            res.status(200).send(user);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getRecordUsuariosZonas = async(req, res) => {
    let query = "select c.id,c.descripcion as text " +
        "from catzonageografica as c " +
        "inner join adm.usuarios_zonas as uz on c.id=uz.id_catzonageografica " +
        "where uz.id_usuarios=:id_usuarios  " +
            "AND uz.sistema=:sistema";

    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_usuarios: req.body.id_usuarios,
            sistema: req.body.sistema,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });

    res.status(200).send(datos);

    /*Usuarios_zonas.findOne({
            //attributes: ['id', ['username', 'text']],
            //attributes: { exclude: ['pass'] },
            where: {
                id_usuarios: req.body.id
            }
        })
        .then(usuarios_zonas => {
            if (!usuarios_zonas) {
                return res.status(404).send({ message: "Usuarios_zonas Not found." });
            }
            res.status(200).send(usuarios_zonas);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });*/
}

exports.getMenu = async(req, res) => {
    let query = "select adm.fn_menu_usuario(:id_usuarios,0,'nomina') as menu";

    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_usuarios: req.body.id,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });
    res.status(200).send(datos[0]["menu"]);
}



//La creacion del usuario está en el controlador auth.controller
/*exports.setRecord = async(req, res) => {
    
}*/

exports.setPerfil = async(req, res) => {
    req.body.dataPack["passConfirm"] = req.body.passConfirm;

    Object.keys(req.body.dataPack).forEach(function(key) {
        if (key.indexOf("id_", 0) >= 0) {
            if (req.body.dataPack[key] != '')
                req.body.dataPack[key] = parseInt(req.body.dataPack[key]);
        }
        if (typeof req.body.dataPack[key] == 'number' && isNaN(parseFloat(req.body.dataPack[key]))) {
            req.body.dataPack[key] = null;
        }
    });

    let existeUsuario = false;
    await User.findOne({
            where: {
                [Op.and]: [{
                    [Op.not]: [{ id: req.body.dataPack.id }]
                }, { state: ["A", "B"] }, {
                    username: req.body.dataPack.username
                }],
            }
        })
        .then(user => {
            if (user) {
                existeUsuario = true;
            }
        });

    //let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        username: {
            type: "string",
            /*min: 8,
            max: 50,*/
            //, pattern: passwordPattern
            //optional: true,
            custom(value, errors) {

                if (typeof value !== typeof undefined) {

                    if (value.toString().trim().length == 0) errors.push({ type: "required" })
                    if (existeUsuario == true) errors.push({ type: "unique", actual: value.toString() })
                }
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        pass: {
            type: "string",
            /*min: 8,
            max: 50,*/
            //, pattern: passwordPattern
            //optional: true,
            custom(value, errors) {
                if (typeof value !== typeof undefined || req.body.dataPack.id == 0) {
                    if (value.toString().length > 0 && value.toString().length < 6) errors.push({ type: "stringMin", expected: 6, actual: value.toString().length })
                    if (value.toString().length > 0 && value.toString().length > 50) errors.push({ type: "stringMax", expected: 50, actual: value.toString().length })
                    if (req.body.passActual.length > 0 && value.toString().length == 0) errors.push({ type: "required" })
                    if (value.toString().length == 0 && req.body.dataPack.id == 0) errors.push({ type: "required" })
                }
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        /*id_permgrupos: {
            type: "number",
            custom(value, errors) {
                if (req.body["onlypass"] == 0 && (value <= 0 && req.body.dataPack.id != 4)) errors.push({ type: "selection" })
                return value; // Sanitize: remove all special chars except numbers
            }
        },*/
        passConfirm: {
            type: "string",
            custom(value, errors) {
                if (typeof value !== typeof undefined) {
                    if ((value.toString().length > 0 || req.body.dataPack["pass"]) &&
                        value != req.body.dataPack["pass"]) errors.push({ type: "confirmPass" })
                }
                return value; // Sanitize: remove all special chars except numbers
            }
        },
    };

    var vres = true;

    vres = await dataValidator.validate(req.body.dataPack, dataVSchema);

    /* validation failed */
    if (!(vres === true)) {
        let errors = {},
            item;

        for (const index in vres) {
            item = vres[index];

            errors[item.field] = item.message;
        }

        res.status(200).send({
            error: true,
            message: errors
        });
        return;
        /*throw {
            name: "ValidationError",
            message: errors
        };*/
    }

    //buscar si existe el registro
    User.findOne({
            where: {
                [Op.and]: [{ id: req.body.dataPack.id }, {
                    id: {
                        [Op.gt]: 0
                    }
                }],
            }
        })
        .then(async user => {

            // solo se actualiza password
            if (user && req.body.onlypass == 1) {
                var passwordIsValid = bcrypt.compareSync(
                    req.body.passActual,
                    user.pass
                );

                if (!passwordIsValid) {
                    res.status(200).send({
                        error: true,
                        message: {
                            "passActual": "La 'contraseña' actual es inválida"
                        }
                    });
                }
            }

            
            let pasa = true;

            if (user) {
                // se actualiza password
                if (req.body.dataPack.pass.length > 0) {
                    await user.update({
                        pass: bcrypt.hashSync(req.body.dataPack.pass, 8),
                    }).then(self => {

                    }).catch(err => {
                        res.status(500).send({ message: err.message });
                        pasa = false;
                    });
                }
                if (req.body.onlypass != 1) { //se actualiza todo
                    //actualizar el resto
                    delete req.body.dataPack.pass;
                    await user.update(req.body.dataPack).then(self => {

                    }).catch(err => {
                        res.status(500).send({ message: err.message });
                        pasa = false;

                    });
                }
            } else {
                // Save User to Database
                delete req.body.dataPack.id;
                delete req.body.dataPack.created_at;
                delete req.body.dataPack.updated_at;
                req.body.dataPack.id_usuarios_r = req.userId;
                req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

                await User.create(req.body.dataPack)
                    .then(async user => {
                        await user.update({
                            pass: bcrypt.hashSync(req.body.dataPack.pass, 8),
                        }).then(self => {
                            req.body.dataPack.id = self.id

                        }).catch(err => {
                            res.status(500).send({ message: err.message });
                            pasa = false;
                        });
                        pasa = true;
                    })
                    .catch(err => {
                        res.status(500).send({ message: err.message });
                        pasa = false
                    });
            }

            this.setPerfilExtra(req)

            res.status(200).send({ message: "success", id: req.body.dataPack.id });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.setPerfilExtra = async(req) => {
    if (req.body.onlypass != 1) { //pasa y se actualiza todo

        //actualiza el id_usuario_sistema en la tabla personal
        await Personal.findOne({
                where: {
                    [Op.and]: [{ id: req.body["id_personal"] }, {
                        id: {
                            [Op.gt]: 0
                        }
                    }],
                }
            })
            .then(personal => {
                if (personal) {
                    personal.update({ id_usuarios_sistema: req.body.dataPack.id }).then(self => {}).catch(err => {
                        pasa = false;
                    });
                }
            });
    }
}
