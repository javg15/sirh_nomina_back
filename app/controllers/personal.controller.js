const db = require("../models");
const { Op } = require("sequelize");
const mensajesValidacion = require("../config/validate.config");
const globales = require("../config/global.config");
const Personal = db.personal;
const Request = require("request");
var moment = require('moment');

const { QueryTypes } = require('sequelize');
let Validator = require('fastest-validator');
/* create an instance of the validator */
let dataValidator = new Validator({
    useNewCustomCheckerFunction: true, // using new version
    messages: mensajesValidacion
});


exports.getAdmin = async(req, res) => {
    let datos = "",
        query = "";

    if (req.body.solocabeceras == 1) {
        query = "SELECT * FROM s_personal_mgr('&modo=10&id_usuario=:id_usuario')"; //el modo no existe, solo es para obtener un registro

        datos = await db.sequelize.query(query, {
            replacements: {
                id_usuario: req.userId,
            },
            plain: false,
            raw: true,
            type: QueryTypes.SELECT
        });
    } else {
        query = "SELECT * FROM s_personal_mgr('" +
            "&modo=0&id_usuario=:id_usuario" +
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

exports.getRecord = async(req, res) => {

    Personal.findOne({
            where: {
                id: req.body.id
            }
        })
        .then(personal => {
            /*if (!personal) {
                return res.status(404).send({ message: "Personal Not found." });
            }*/

            res.status(200).send(personal);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getRecordSegunUsuario = async(req, res) => {

    Personal.findOne({
            where: {
                id_usuarios_sistema: req.body.id_usuario
            }
        })
        .then(personal => {
            if (!personal) {
                return res.status(404).send({ message: "Personal Not found." });
            }

            res.status(200).send(personal);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}


exports.getRecordSegunCURP = async(req, res) => {

    Personal.findOne({
            where: {
                curp: req.body.curp
            }
        })
        .then(personal => {
            if (!personal) {
                return res.status(200).send();
            }

            res.status(200).send(personal);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getRecordAntiguedad = async(req, res) => {
    let datos = "",
        query = "";

    query = "SELECT fn_getquincena(:fecha::date) as quincena, " +
        "DATE_PART('year', AGE(now(), :fecha)) AS anios, " +
        "DATE_PART('month', AGE(now(), :fecha)) AS meses, " +
        "DATE_PART('day', AGE(now(), :fecha)) AS dias";

    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            fecha: req.body.fechaingreso,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });


    //console.log(JSON.stringify(respuesta));
    res.status(200).send(datos[0]);
    //return res.status(200).json(data);
    // res.status(500).send({ message: err.message });

}

exports.getAntiguedadEnQuincenas = async(req, res) => {
    let datos = "",
        query = "";

    query = "SELECT sum(anios) AS anios " +
        ",SUM(meses) AS meses " +
        ",SUM(dias) AS dias " +
        ",MIN(quincena_ini) AS quincena_ini " +
        ",MIN(id_quincena_ini) AS id_quincena_ini " +
        "FROM fn_antiguedad(:id_personal) ";

    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_personal: req.body.id_personal,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });

    let anios = meses = dias = 0;
    if (datos.length > 0) {
        anios = datos[0].anios;
        meses = datos[0].meses;
        dias = datos[0].dias;

        if (dias / 30 == 0) {
            meses += dias / 30;
            dias = 0;
        } else if (dias > 30) {
            meses += dias / 30; //al dividir / 30 se estrae solo la parte entera
            //al dividir / 30 se estrae solo la parte entera
            //ejemp 45-(45/30*30)=45-(30)=15
            meses = meses - (meses / 30 * 30);
        }

        if (meses / 12 == 0) {
            anios += meses / 12;
            meses = 0;
        } else if (meses > 12) {
            anios += meses / 12; //al dividir / 12 se estrae solo la parte entera
            //al dividir / 12 se estrae solo la parte entera
            //ejemp 13-(13/12*12)=13-(12)=1
            meses = meses - (meses / 12 * 12);
        }
        datos[0].anios = anios;
        datos[0].meses = meses;
        datos[0].dias = dias;
    }
    //console.log(JSON.stringify(respuesta));
    res.status(200).send(datos[0]);
    //return res.status(200).json(data);
    // res.status(500).send({ message: err.message });

}

exports.setRecord = async(req, res) => {
    Object.keys(req.body.dataPack).forEach(function(key) {
        if (key.indexOf("id_", 0) >= 0) {
            if (req.body.dataPack[key] != '')
                req.body.dataPack[key] = parseInt(req.body.dataPack[key]);
        } else if (key == "nombre" || key == "apellidopaterno" || key == "apellidomaterno") {
            req.body.dataPack[key] = req.body.dataPack[key].toUpperCase();
        }

        if (typeof req.body.dataPack[key] == 'number' && isNaN(parseFloat(req.body.dataPack[key]))) {
            req.body.dataPack[key] = null;
        }
        if (key == "fechanaculthijo" && req.body.dataPack[key] == '') {
            req.body.dataPack[key] = null;
        }
    })

    //let curpValido = await checkCurp(req.body.dataPack.curp);

    /*verificar si el usuario no está ya asignado*/
    let datos = "",
        query = "",
        personalConUsuario = "",
        usuarioConPersonal = "";

    if (req.body.dataPack.id_usuarios_sistema != null && req.body.dataPack.id_usuarios_sistema > 0) {


        query = "SELECT p.curp,u.username " +
            "FROM personal AS p " +
            " LEFT JOIN usuarios AS u ON p.id_usuarios_sistema=u.id" +
            " WHERE p.id_usuarios_sistema=:id_usuarios_sistema" +
            " AND p.id<>:id" +
            " AND p.state IN ('A','B')";

        datos = await db.sequelize.query(query, {
            // A function (or false) for logging your queries
            // Will get called for every SQL query that gets sent
            // to the server.
            logging: console.log,

            replacements: {
                id_usuarios_sistema: req.body.dataPack["id_usuarios_sistema"],
                id: req.body.dataPack["id"],
            },
            // If plain is true, then sequelize will only return the first
            // record of the result set. In case of false it will return all records.
            plain: false,

            // Set this to true if you don't have a model definition for your query.
            raw: true,
            type: QueryTypes.SELECT
        });
        personalConUsuario = datos.length > 0 ? datos[0].curp : "";
        usuarioConPersonal = datos.length > 0 ? datos[0].username : "";
    }

    //let curpValido = false;
    //console.log(JSON.parse(curpValido).Response)
    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        nombre: { type: "string", empty: false },
        apellidopaterno: { type: "string", empty: false },
        apellidomaterno: { type: "string", empty: false },
        curp: {
            type: "string",
            min: 18,
            max: 18,
            pattern: /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
            /*custom(value, errors, schema) {

                if (JSON.parse(curpValido).Response.toUpperCase() == "ERROR") {
                    errors.push({ type: "curp" });
                }
                return value
            }*/
        },
        rfc: { type: "string", max: 10, pattern: /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))$/ },
        homoclave: { type: "string", optional: true, pattern: /^|([A-Z\d]{2})([A\d])$/ },
        email: { type: "email", empty: true },
        telefono: {
            type: "string",
            custom(value, errors, schema) {
                if (value == null)
                    errors.push({ type: "stringMin", expected: 10, actual: 0 });
                else {
                    if (value.length != 10) {
                        errors.push({ type: "stringMin", expected: 10, actual: value.length });
                    }
                }
                return value
            }
        },
        id_usuarios_sistema: {
            type: "number",
            optional: true,
            custom(value, errors, schema) {
                if (personalConUsuario != "") {
                    errors.push({ type: "usuarioLibre", expected: usuarioConPersonal, actual: personalConUsuario });
                }
                return value
            }
        },
        fechaingreso: {
            type: "string",
            custom(value, errors) {
                let dateIni = new Date(value)
                let dateFin = new Date()

                if (dateIni > dateFin)
                    errors.push({ type: "dateMax", field: "fechaingreso", expected: dateFin.toISOString().split('T')[0] })

                if (!moment(value).isValid() || !moment(value).isBefore(new Date()) || !moment(value).isAfter('1900-01-01'))
                    errors.push({ type: "date" })
                return value;
            },
        },
    };



    var vres = true;
    if (req.body.actionForm.toUpperCase() == "NUEVO" ||
        req.body.actionForm.toUpperCase() == "EDITAR") {
        vres = await dataValidator.validate(req.body.dataPack, dataVSchema);
    }

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
    Personal.findOne({
            where: {
                [Op.and]: [{ id: req.body.dataPack.id }, {
                    id: {
                        [Op.gt]: 0
                    }
                }],
            }
        })
        .then(personal => {
            if (!personal) {
                delete req.body.dataPack.id;
                delete req.body.dataPack.created_at;
                delete req.body.dataPack.updated_at;
                req.body.dataPack.id_usuarios_r = req.userId;
                req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

                Personal.create(
                    req.body.dataPack
                ).then((self) => {
                    // here self is your instance, but updated
                    res.status(200).send({ message: "success", id: self.id });
                }).catch(err => {
                    res.status(500).send({ message: err });
                });
            } else {
                delete req.body.dataPack.created_at;
                delete req.body.dataPack.updated_at;
                req.body.dataPack.id_usuarios_r = req.userId;
                req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

                personal.update(req.body.dataPack).then((self) => {
                    // here self is your instance, but updated
                    res.status(200).send({ message: "success", id: self.id });
                });
            }


        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });

}

exports.setRecord2 = async(req, res) => {
    Object.keys(req.body.dataPack).forEach(function(key) {
        if (key.indexOf("id_", 0) >= 0) {
            if (req.body.dataPack[key] != '')
                req.body.dataPack[key] = parseInt(req.body.dataPack[key]);
        }
        if (typeof req.body.dataPack[key] == 'number' && isNaN(parseFloat(req.body.dataPack[key]))) {
            req.body.dataPack[key] = null;
        }
    })

    //let curpValido = await checkCurp(req.body.dataPack.curp);

    //let curpValido = false;
    //console.log(JSON.parse(curpValido).Response)
    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        emailoficial: {
            type: "email",
            empty: true,
            custom(value, errors, schema) {
                if (req.body.campoEdit == "emailoficial") {
                    if (value == null)
                        errors.push({ type: "stringMin", expected: 10, actual: 0 });
                    else {
                        if (value.length > 0 && value.length < 10) {
                            errors.push({ type: "stringMin", expected: 10, actual: value.length });
                        }
                    }
                }
                return value
            }
        },
        telefonomovil: {
            type: "string",
            empty: true,
            custom(value, errors, schema) {
                if (req.body.campoEdit == "telefonomovil") {
                    if (value == null)
                        errors.push({ type: "stringMin", expected: 10, actual: 0 });
                    else {
                        if (value.length > 0 && value.length < 10) {
                            errors.push({ type: "stringMin", expected: 10, actual: value.length });
                        }
                    }
                }
                return value
            }
        },

    };



    var vres = await dataValidator.validate(req.body.dataPack, dataVSchema);


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
    Personal.findOne({
            where: {
                [Op.and]: [{ id: req.body.dataPack.id }, {
                    id: {
                        [Op.gt]: 0
                    }
                }],
            }
        })
        .then(personal => {
            if (!personal) {
                res.status(500).send({ message: "No existe la persona" });

            } else {
                let personalEdit = new Personal();
                personalEdit.id = req.body.dataPack.id;
                personalEdit.id_usuarios_r = req.userId;
                personalEdit.telefonomovil = req.body.dataPack.telefonomovil;
                personalEdit.emailoficial = req.body.dataPack.emailoficial;

                personal.update(req.body.dataPack).then((self) => {
                    // here self is your instance, but updated
                    res.status(200).send({ message: "success", id: self.id });
                });
            }


        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });

}

function checkCurp(curp) {

    return new Promise(function(resolve, reject) {
        Request.get("https://conectame.ddns.net/rest/api.php?m=curp&user=prueba&pass=sC}9pW1Q]c&val=" + curp, (error, response, body) => {
            //console.log("; error:", error)
            if (!error) {
                resolve(body);
            } else {
                reject(error);
            }
        });

    });
}

exports.getCatalogo = async(req, res) => {

    Personal.findAll({
            attributes: ['id', 'descripcion', 'ubicacion', 'clave'],
            order: [
                ['descripcion', 'ASC'],
            ]
        }).then(personal => {
            if (!personal) {
                return res.status(404).send({ message: "Personal Not found." });
            }

            res.status(200).send(personal);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getCatalogoSegunBusqueda = async(req, res) => {

    if (req.body.query.length > 2) {
        Personal.findAll({
                attributes: ["id", "numeemp", [db.sequelize.literal("apellidopaterno || ' ' || apellidomaterno || ' ' || nombre || ' -- ' || curp || ' -- ' || id || ' -- ' || numeemp"), "full_name"]],
                where: {
                    [Op.or]: [
                        db.sequelize.where(db.sequelize.fn("concat",  db.sequelize.col("apellidopaterno"), " ", db.sequelize.col("apellidomaterno"), " ", db.sequelize.col("nombre")), {
                            [Op.iLike]: '%' + req.body.query + '%'
                        }),
                        {
                            curp: {
                                [Op.iLike]: '%' + req.body.query + '%'
                            }
                        },
                        {
                            numeemp: {
                                [Op.iLike]: '%' + req.body.query + '%'
                            }
                        },
                    ]
                },
                order: [
                    ['nombre', 'ASC'],
                ]
            }).then(personal => {
                if (!personal) {
                    return res.status(404).send({ message: "Personal Not found." });
                }

                res.status(200).send(personal);
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
    } else {
        res.status(200).send(null);
    }
}