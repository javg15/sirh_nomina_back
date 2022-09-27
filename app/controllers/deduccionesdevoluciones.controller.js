const db = require("../models");
const { Op } = require("sequelize");
const mensajesValidacion = require("../config/validate.config");
const globales = require("../config/global.config");
const Deduccionesdevoluciones = db.deduccionesdevoluciones;
const Cattiposdevoluciones=db.cattiposdevoluciones;

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
        query = "SELECT * FROM nomina.s_deduccionesdevoluciones_mgr('&modo=10&id_usuario=:id_usuario')"; //el modo no existe, solo es para obtener un registro

        datos = await db.sequelize.query(query, {
            replacements: {
                id_usuario: req.userId,
            },
            plain: false,
            raw: true,
            type: QueryTypes.SELECT
        });
    } else {
        query = "SELECT * FROM nomina.s_deduccionesdevoluciones_mgr('" +
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

    Deduccionesdevoluciones.findOne({
            where: {
                id: req.body.id
            }
        })
        .then(deduccionesdevoluciones => {
            if (!deduccionesdevoluciones) {
                return res.status(404).send({ message: "Deduccionesdevoluciones Not found." });
            }

            res.status(200).send(deduccionesdevoluciones);
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
        if (key.indexOf("dias", 0) >= 0) {
            if (req.body.dataPack[key] != '')
                req.body.dataPack[key] = parseInt(req.body.dataPack[key]);
        }
    })

    let cattiposdevoluciones=await Cattiposdevoluciones.findOne({
        where: {
            [Op.and]: [
                { id: req.body.dataPack.id_cattiposdevoluciones },
            ],
        }
    })
    

    let deduccionesDevolucionesExiste=false;
    //revisar si la combinación de campos, ya existe
    if(req.body.dataPack.id==0){
        await Deduccionesdevoluciones.findOne({
            where: {
                [Op.and]: [
                    { id_personal: req.body.dataPack.id_personal },
                    //{ id_cattiposdevoluciones: req.body.dataPack.id_cattiposdevoluciones },
                    { id_catquincena_aplicacion: req.body.dataPack.id_catquincena_aplicacion },
                    {
                        [Op.or]:[
                            {
                                id_catquincena:
                                {
                                    [Op.between]: [req.body.dataPack.id_catquincena, req.body.record_id_catquincena_fin]
                                }
                            },
                        ]
                    },

                    { [Op.not]: [{ id: req.body.dataPack.id }] },
                    { state: 'A' },
                ],
            }
        })
        .then(deduccionesdevoluciones => {
            if (deduccionesdevoluciones) {
                deduccionesDevolucionesExiste = true;
            }
        });
    }

    //revisar que tenga el desglose de quincenas si aplica
    let quincenasConValor=true;
    for(i=0;i<req.body.fieldsQuincenas.length;i++){
        if(parseInt(req.body.fieldsQuincenas[i].value)<1
                || parseInt(req.body.fieldsQuincenas[i].value)>15){
            quincenasConValor=false;
            break;
        }
    }
     

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        id_cattiposdevoluciones: {
            type: "number",
            custom(value, errors) {
                if (value <= 0) errors.push({ type: "selection" })
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        id_catquincena_aplicacion: {
            type: "number",
            custom(value, errors) {
                if (value <= 0) errors.push({ type: "selection" })
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        id_catquincena: {
            type: "number",
            custom(value, errors) {
                if (value <= 0) errors.push({ type: "selection" })
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        
        id_personal: { type: "number" ,
            custom(value, errors) {
                if(deduccionesDevolucionesExiste) errors.push({ type: "uniqueRecord" })
                if(value <= 0) errors.push({ type: "selection" })
                
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        dias: { type: "number" ,
            custom(value, errors) {
                if(!quincenasConValor) errors.push({ type: "requiredDias" })
                
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

    if(req.body.actionForm.toUpperCase() == "NUEVO"){
        //recorrer las quincenas segun array
        for(i=0;i<req.body.fieldsQuincenas.length;i++){
            //buscar si existe el registro
            delete req.body.dataPack.id;
            delete req.body.dataPack.created_at;
            delete req.body.dataPack.updated_at;
            req.body.dataPack.id_catquincena=req.body.fieldsQuincenas[i].id;
            req.body.dataPack.dias=req.body.fieldsQuincenas[i].value;
            req.body.dataPack.id_usuarios_r = req.userId;
            req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

            Deduccionesdevoluciones.create(
                req.body.dataPack
            )
        }
        res.status(200).send({ message: "success" });
    }
    else {
        Deduccionesdevoluciones.findOne({
            where: {
                [Op.and]: [{ id: req.body.dataPack.id }, {
                    id: {
                        [Op.gt]: 0
                    }
                }],
            }
        })
        .then(deduccionesdevoluciones => {
            if (deduccionesdevoluciones) {
                delete req.body.dataPack.created_at;
                delete req.body.dataPack.updated_at;
                req.body.dataPack.id_usuarios_r = req.userId;
                req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

                deduccionesdevoluciones.update(req.body.dataPack).then((self) => {
                    // here self is your instance, but updated
                    res.status(200).send({ message: "success", id: self.id });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    }
}

exports.getCatalogo = async(req, res) => {

    Deduccionesdevoluciones.findAll({
            attributes: ['id', [db.sequelize.literal("clave || ' - ' || nombre"),"text"], 'clave'],
            order: [
                [db.sequelize.literal("clave || ' - ' || nombre"), 'ASC'],
            ]
        }).then(deduccionesdevoluciones => {
            if (!deduccionesdevoluciones) {
                return res.status(404).send({ message: "Deduccionesdevoluciones Not found." });
            }

            res.status(200).send(deduccionesdevoluciones);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}