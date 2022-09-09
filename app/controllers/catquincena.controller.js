const db = require("../models");
const { Op } = require("sequelize");
const globales = require("../config/global.config");
const mensajesValidacion = require("../config/validate.config");
const Catquincena = db.catquincena;
const configsvc = require("../config/service.config.js");
const request = require('request');

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
        query = "SELECT * FROM s_catquincena_mgr('&modo=10&id_usuario=:id_usuario')"; //el modo no existe, solo es para obtener un registro

        datos = await db.sequelize.query(query, {
            replacements: {
                id_usuario: req.userId,
            },
            plain: false,
            raw: true,
            type: QueryTypes.SELECT
        });
    } else {
        query = "SELECT * FROM s_catquincena_mgr('" +
            "&modo=0&id_usuario=:id_usuario" +
            "&inicio=:start&largo=:length" +
            "&scampo=" + req.body.opcionesAdicionales.datosBusqueda.campo + "&soperador=" + req.body.opcionesAdicionales.datosBusqueda.operador + "&sdato=" + req.body.opcionesAdicionales.datosBusqueda.valor;

        if (req.body.columns[req.body.order[0].column].data == 'id') {
            query += "&ordencampo=Semestre|Quincena" +
                "&ordensentido=DESC|DESC')";
        } else {
            query += "&ordencampo=" + req.body.columns[req.body.order[0].column].data +
                "&ordensentido=" + req.body.order[0].dir + "')";
        }


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

    Catquincena.findOne({
            where: {
                id: req.body.id
            }
        })
        .then(catquincena => {
            if (!catquincena) {
                return res.status(404).send({ message: "Catquincena Not found." });
            }

            res.status(200).send(catquincena);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getQuincenaActiva = async(req, res) => {
    Catquincena.findOne({
            where: {
                [Op.and]: [{
                        [Op.or]: [{ id_catestatusquincena: 1 }, { id_catestatusquincena: 2 }]
                    }, {
                        id: {
                            [Op.gt]: 0
                        },
                    },
                    { state: "A" },
                ],
            }
        })
        .then(catquincena => {
            if (!catquincena) {
                return res.status(404).send({ message: "Catquincena Not found." });
            }

            res.status(200).send(catquincena);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getCatalogo = async(req, res) => {
    let query = "select c.id,concat(anio, lpad(c.quincena::text,2,0::text)) as text,c.anio,c.quincena " +
        "from catquincena as c " +
        "where c.adicional=0 AND (c.anio=9999 OR c.id_catestatusquincena>0)  " + //OR c.id_catestatusquincena<4
        "and c.state in ('A','B') " +
        "order by concat(anio, lpad(c.quincena::text,2,0::text)) DESC ";

    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            anio: req.body.anio,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });

    res.status(200).send(datos);


}

exports.getCatalogoSegunAnio = async(req, res) => {

    let query = "select c.id,concat(anio, lpad(c.quincena::text,2,0::text)) as text " +
        "from catquincena as c " +
        "where c.adicional=0 AND (c.anio=9999 OR c.anio=:anio OR c.anio BETWEEN :anio - 20 AND :anio + 2)  " +
        "and c.state in ('A','B') " +
        "order by concat(anio, lpad(c.quincena::text,2,0::text)) desc";

    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            anio: req.body.anio,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });

    res.status(200).send(datos);
}

exports.getCatalogoSegunSemestre = async(req, res) => {

    let query = "select c.id,concat(c.anio, lpad(c.quincena::text,2,0::text)) as text " +
        "from catquincena as c " +
        "    left join semestre as s on c.id between s.id_catquincena_ini and s.id_catquincena_fin " +
        "where c.adicional=0  " +
        "   and s.id=:id_semestre  " +
        "   and c.state in ('A','B') " +
        "order by concat(c.anio, lpad(c.quincena::text,2,0::text)) desc";

    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_semestre: req.body.id_semestre,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });

    res.status(200).send(datos);
}


exports.setRecord = async(req, res) => {
    Object.keys(req.body.dataPack).forEach(function(key) {
        if (key.indexOf("id_", 0) >= 0 || key.indexOf("anio", 0) >= 0 ||
            key.indexOf("quincena", 0) >= 0 || key.indexOf("bimestre", 0) >= 0
        ) {
            if (req.body.dataPack[key] != '')
                req.body.dataPack[key] = parseInt(req.body.dataPack[key]);
        }
    })

    query = "select * " +
        "from catquincena as a " +
        "where anio=:anio " +
        "    and quincena=:quincena ";
    "    and bimestre=:bimestre ";
    "    and state  IN('A','B')";
    datosUnique = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            anio: req.body.dataPack["anio"],
            quincena: req.body.dataPack["quincena"],
            bimestre: req.body.dataPack["bimestre"],
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        anio: {
            type: "number",
            custom(value, errors) {
                if (value <= 0) errors.push({ type: "selection" })
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        quincena: {
            type: "number",
            custom(value, errors) {
                if (value <= 0) errors.push({ type: "selection" })
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        id_catestatusquincena: {
            type: "number",
            custom(value, errors) {
                if (value <= 0) errors.push({ type: "selection" })
                return value; // Sanitize: remove all special chars except numbers
            }
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
    Catquincena.findOne({
            where: {
                [Op.and]: [{ id: req.body.dataPack.id }, {
                    id: {
                        [Op.gt]: 0
                    }
                }],
            }
        })
        .then(catquincena => {
            if (!catquincena) {
                delete req.body.dataPack.id;
                delete req.body.dataPack.created_at;
                delete req.body.dataPack.updated_at;
                req.body.dataPack.id_usuarios_r = req.userId;
                req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

                Catquincena.create(
                    req.body.dataPack
                ).then((self) => {
                    // here self is your instance, but updated
                    res.status(200).send({ message: "success", id: self.id });
                }).catch(err => {
                    res.status(500).send({ message: err.message });
                });
            } else {
                delete req.body.dataPack.created_at;
                delete req.body.dataPack.updated_at;
                req.body.dataPack.id_usuarios_r = req.userId;
                req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

                catquincena.update(req.body.dataPack).then((self) => {
                    // here self is your instance, but updated
                    res.status(200).send({ message: "success", id: self.id });
                });
            }


        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.setUpdateFromWebService = async(req, res) => {
    //obtener token
    request.post({
        url: 'http://' + configsvc.HOST + ':' + configsvc.PORT + configsvc.servicetoken,
        form: {
            usuario: configsvc.usuario,
            contrasena: configsvc.contrasena
        }
    }, function(err, httpResponse, body) {
        //llamar al servicio con el token e id usuario
        request({
            uri: 'http://' + configsvc.HOST + ':' + configsvc.PORT + configsvc.servicequincenas + '/' + req.body.id_semestre,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset = utf-8',
                'access-token': JSON.parse(body).body[0].token
            },
            method: 'GET',
        }, async function(err, httpResponse, body) {
            body = JSON.parse(body).body;
            pasa = true;

            //Revisar y ejecutar todos los registros
            await Promise.all(body.map(async function(d) {
                if (pasa) {
                    const obj = await Catquincena.findOne({
                        where: {
                            [Op.and]: [{ id: d.idquincena }, {
                                id: {
                                    [Op.gt]: 0
                                }
                            }],
                        }
                    });

                    if (obj) {
                        if (d.idestatusquincena == 1 || d.idestatusquincena == 2) //si el registro se va a actualizar a abierta
                            await Catquincena.update({ id_catestatusquincena: 3 }, // actualizar todas las que esten abiertas a calculadas
                            {
                                where: {
                                    [Op.and]: [{ id_catestatusquincena: 1 }, {
                                        state: 'A'
                                    }],
                                }
                            });
                        return obj.update({
                            state: 'A',
                            id_usuarios_r: req.userId,
                            state: 'A',
                            id_semestre: d.idsemestre,
                            quincena: d.quincena.substr(4, 2),
                            id_catestatusquincena: d.idestatusquincena,
                            periodovacacional: d.periodovacacional,
                            fechacierre: d.fechacierre != 'NULL' ? moment(d.fechacierre, 'DD/MM/YYYY') : null,
                            observaciones: d.observaciones,
                            observaciones2: d.observaciones2,
                            fechadepago: d.fechadepago != 'NULL' ? moment(d.fechadepago, 'DD/MM/YYYY') : null,
                            adicional: d.adicional

                        }).catch(err => {
                            res.status(500).send({ message: err.message });
                            pasa = false;
                        });
                    } else {
                        return Catquincena.create({
                            id: d.idquincena,
                            id_usuarios_r: req.userId,
                            state: 'A',
                            id_semestre: d.idsemestre,
                            quincena: d.quincena.substr(4, 2),
                            id_catestatusquincena: d.idestatusquincena,
                            periodovacacional: d.periodovacacional,
                            fechacierre: d.fechacierre != 'NULL' ? moment(d.fechacierre, 'DD/MM/YYYY') : null,
                            observaciones: d.observaciones,
                            observaciones2: d.observaciones2,
                            fechadepago: d.fechadepago != 'NULL' ? moment(d.fechadepago, 'DD/MM/YYYY') : null,
                            adicional: d.adicional
                        }).catch(err => {
                            res.status(500).send({ message: err.message });
                            pasa = false;
                        });
                    }
                }
            }));
            if (pasa)
                res.status(200).send({ message: "success", });
        })
    })
}