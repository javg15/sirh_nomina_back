const db = require("../models");
const { Op } = require("sequelize");
const mensajesValidacion = require("../config/validate.config");
const globales = require("../config/global.config");
const Reducciones = db.reducciones;
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
        query = "";

    if (req.body.solocabeceras == 1) {
        query = "SELECT * FROM nomina.s_reducciones_mgr('&modo=10&id_usuario=:id_usuario')"; //el modo no existe, solo es para obtener un registro

        datos = await db.sequelize.query(query, {
            replacements: {
                id_usuario: req.userId,
            },
            plain: false,
            raw: true,
            type: QueryTypes.SELECT
        });
    } else {
        query = "SELECT * FROM nomina.s_reducciones_mgr('" +
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

    Reducciones.findOne({
            where: {
                id: req.body.id
            }
        })
        .then(reducciones => {
            if (!reducciones) {
                return res.status(404).send({ message: "Reducciones Not found." });
            }

            res.status(200).send(reducciones);
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
        if (key.indexOf("porcentaje", 0) >= 0) {
            if (req.body.dataPack[key] != '')
                req.body.dataPack[key] = parseFloat(req.body.dataPack[key]);
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

    let reduccionExiste=false;
    //revisar si la combinación de campos, ya existe
    
    if(req.body.dataPack.id==0){
        await Reducciones.findOne({
            where: {
                [Op.and]: [
                    { id_personal: req.body.dataPack.id_personal },
                    //{ id_cattiposadeudos: req.body.dataPack.id_cattiposadeudos },
                    {
                        [Op.or]:[
                            {
                                id_catquincena_ini:
                                {
                                    [Op.between]: [req.body.dataPack.id_catquincena_ini, req.body.dataPack.id_catquincena_fin]
                                }
                            },
                            {
                                id_catquincena_fin:
                                {
                                    [Op.between]: [req.body.dataPack.id_catquincena_ini, req.body.dataPack.id_catquincena_fin]
                                }
                            },

                        ]
                    },
                    { [Op.not]: [{ id: req.body.dataPack.id }] },
                    { state: 'A' },
                ],
            }
        })
        .then(reducciones => {
            if (reducciones) {
                reduccionExiste = true;
            }
        });
    }

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        id_catquincena_ini: {
            type: "number",
            custom(value, errors) {
                if (value <= 0 || value==32767) errors.push({ type: "selection" })

                ///////////////
                dateActiva = quincenaActiva.anio.toString() + quincenaActiva.quincena.toString().padStart(2, "0")
                dateIni = quincenaInicial.anio.toString() + quincenaInicial.quincena.toString().padStart(2, "0")

                if (dateIni < dateActiva)
                    errors.push({ type: "quincenaIniMenorActiva", field: "id_catquincena_ini" })

                return value; // Sanitize: remove all special chars except numbers
            }
        },
        id_catquincena_fin: {
            type: "number",
            custom(value, errors) {
                if (value <= 0 ) errors.push({ type: "selection" })
                ///////////////
                dateFin = quincenaFinal.anio.toString() + quincenaFinal.quincena.toString().padStart(2, "0")
                dateIni = quincenaInicial.anio.toString() + quincenaInicial.quincena.toString().padStart(2, "0")

                if (dateFin < dateIni)
                    errors.push({ type: "quincenaFin", field: "id_catquincena_fin" })
            }
        },
        
        id_personal: { type: "number" ,
            custom(value, errors) {
                if(reduccionExiste) errors.push({ type: "uniqueRecord" })
                if(value <= 0) errors.push({ type: "selection" })
                
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        porcentaje: { type: "number" ,
            custom(value, errors) {
                if(value <= 0) errors.push({ type: "selection" })
                if(value > 100) errors.push({ type: "numberMax",expected:"100" })

                
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

    //se pone tambien aqui, porque por razondes desconocidas, en esta linea cuando viene en 0 
    // despues de la validación lo convierte a nulo
    req.body.dataPack.id_catquincena_fin = req.body.dataPack['id_catquincena_fin'] == 0 || req.body.dataPack['id_catquincena_fin'] == undefined ? 32767 : req.body.dataPack.id_catquincena_fin;
    
    //buscar si existe el registro
    Reducciones.findOne({
        where: {
            [Op.and]: [{ id: req.body.dataPack.id }, {
                id: {
                    [Op.gt]: 0
                }
            }],
        }
    })
    .then(reducciones => {
        if (!reducciones) {
            delete req.body.dataPack.id;
            delete req.body.dataPack.created_at;
            delete req.body.dataPack.updated_at;
            req.body.dataPack.id_usuarios_r = req.userId;
            req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

            Reducciones.create(
                req.body.dataPack
            ).then((self) => {
                // here self is your instance, but updated
                res.status(200).send({ message: "success", id: self.id });
            }).catch(err => {
                res.status(200).send({ error: true, message: [err.errors[0].message] });
            });
        } else {
            delete req.body.dataPack.created_at;
            delete req.body.dataPack.updated_at;
            req.body.dataPack.id_usuarios_r = req.userId;
            req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

            reducciones.update(req.body.dataPack).then((self) => {
                // here self is your instance, but updated
                res.status(200).send({ message: "success", id: self.id });
            });
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getCatalogo = async(req, res) => {

    Reducciones.findAll({
            attributes: ['id', [db.sequelize.literal("clave || ' - ' || nombre"),"text"], 'clave'],
            order: [
                [db.sequelize.literal("clave || ' - ' || nombre"), 'ASC'],
            ]
        }).then(reducciones => {
            if (!reducciones) {
                return res.status(404).send({ message: "Reducciones Not found." });
            }

            res.status(200).send(reducciones);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}