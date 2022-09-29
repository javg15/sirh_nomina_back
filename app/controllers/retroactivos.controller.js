const db = require("../models");
const { Op } = require("sequelize");
const mensajesValidacion = require("../config/validate.config");
const globales = require("../config/global.config");
var moment = require('moment');
const Retroactivos = db.retroactivos;
const Catquincena = db.catquincena;

const { QueryTypes } = require('sequelize');
let Validator = require('fastest-validator');
/* create an instance of the validator */
let dataValidator = new Validator({
    useNewCustomCheckerFunction: true, // using new version
    messages: mensajesValidacion
});


exports.getAdmin = async(req, res) => {
    let datos = "",
        query = "",
        params = req.body;

    if (req.body.solocabeceras == 1) {
        params = req.body;

        query = "SELECT * FROM nomina.s_retroactivos_mgr('&modo=10&id_usuario=:id_usuario')"; //el modo no existe, solo es para obtener un registro

        datos = await db.sequelize.query(query, {
            replacements: {
                id_usuario: req.userId,
            },
            plain: false,
            raw: true,
            type: QueryTypes.SELECT
        });
    } else {
        query = "SELECT * FROM nomina.s_retroactivos_mgr('" +
        "&modo=:modo&id_usuario=:id_usuario" +
        "&inicio=:start&largo=:length" +
        "&ordencampo=ID" +
        "&ordensentido=ASC" +
        "&fkey=" + params.opcionesAdicionales.fkey +
        "&fkeyvalue=" + params.opcionesAdicionales.fkeyvalue.join(",") + "')";

        datos = await db.sequelize.query(query, {
            // A function (or false) for logging your queries
            // Will get called for every SQL query that gets sent
            // to the server.
            logging: console.log,

            replacements: {
                id_usuario: req.userId,
                modo: params.opcionesAdicionales.modo,

                start: (typeof params.start !== typeof undefined ? params.start : 0),
                length: (typeof params.start !== typeof undefined ? params.length : 1),

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

    Retroactivos.findOne({
            where: {
                id: req.body.id
            }
        })
        .then(retroactivos => {
            if (!retroactivos) {
                return res.status(404).send({ message: "Retroactivos Not found." });
            }

            res.status(200).send(retroactivos);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.setRecord = async(req, res) => {
    Object.keys(req.body.dataPack).forEach(function(key) {
        if (key.indexOf("id_", 0) >= 0) {
            if (req.body.dataPack[key] != '')
                req.body.dataPack[key] = parseInt(req.body.dataPack[key]);
        }
        if (typeof req.body.dataPack[key] == 'number' && isNaN(parseInt(req.body.dataPack[key]))) {
            req.body.dataPack[key] = 0;
        }
        
    })

     
    //obtener datos de las quincenas
    req.body.dataPack.id_catquincena_ini = req.body.dataPack['id_catquincena_ini'] == 0 ? 32767 : req.body.dataPack['id_catquincena_ini']
    const quincenaInicial = await Catquincena.findOne({
        where: {
            id: req.body.dataPack['id_catquincena_ini']
        },
    });


    req.body.dataPack.id_catquincena_fin = req.body.dataPack['id_catquincena_fin'] == 0 || req.body.dataPack['id_catquincena_fin'] == undefined ? 32767 : req.body.dataPack.id_catquincena_fin;
    const quincenaFinal = await Catquincena.findOne({
        where: {
            id: req.body.dataPack['id_catquincena_fin']
        },
    });

    //obtener la quincena activa
    const quincenaActiva = await Catquincena.findOne({
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

    

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        id_catpercdeduc: { type: "number" ,
            custom(value, errors) {
                
                if(value <= 0) errors.push({ type: "selection" })
                
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        
        id_catquincena_ini: {
            type: "number",
            custom(value, errors) {
                if(req.body.dataPack['definirperiododiferente']==1){
                    if (value <= 0 || value==32767) errors.push({ type: "selection" })

                    ///////////////
                    dateActiva = quincenaActiva.anio.toString() + quincenaActiva.quincena.toString().padStart(2, "0")
                    dateIni = quincenaInicial.anio.toString() + quincenaInicial.quincena.toString().padStart(2, "0")

                    if (dateIni < dateActiva)
                        errors.push({ type: "quincenaIniMenorActiva", field: "id_catquincena_ini" })
                }
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        id_catquincena_fin: {
            type: "number",
            custom(value, errors) {
                if(req.body.dataPack['definirperiododiferente']==1){
                    if (value <= 0 ) errors.push({ type: "selection" })
                    ///////////////
                    dateFin = quincenaFinal.anio.toString() + quincenaFinal.quincena.toString().padStart(2, "0")
                    dateIni = quincenaInicial.anio.toString() + quincenaInicial.quincena.toString().padStart(2, "0")

                    if (dateFin < dateIni)
                        errors.push({ type: "quincenaFin", field: "id_catquincena_fin" })
                }
                return value; 
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
    Retroactivos.findOne({
        where: {
            [Op.and]: [{ id: req.body.dataPack.id }, {
                id: {
                    [Op.gt]: 0
                }
            }],
        }
    })
    .then(retroactivos => {
        if (!retroactivos) {
            delete req.body.dataPack.id;
            delete req.body.dataPack.created_at;
            delete req.body.dataPack.updated_at;
            req.body.dataPack.id_usuarios_r = req.userId;
            req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

            Retroactivos.create(
                req.body.dataPack
            ).then((self) => {
                // here self is your instance, but updated
                res.status(200).send({ message: "success", id: self.id });
            }).catch(err => {
                console.log("err=>",err)
                res.status(200).send({ error: true, message: err });
            });
        } else {
            delete req.body.dataPack.created_at;
            delete req.body.dataPack.updated_at;
            req.body.dataPack.id_usuarios_r = req.userId;
            req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

            retroactivos.update(req.body.dataPack).then((self) => {
                // here self is your instance, but updated
                res.status(200).send({ message: "success", id: self.id });
            });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
    
}

