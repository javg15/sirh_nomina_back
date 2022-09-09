const db = require("../models");
const { Op } = require("sequelize");
const globales = require("../config/global.config");
const mensajesValidacion = require("../config/validate.config");
const Categorias = db.categorias;

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
        query = "SELECT * FROM s_categorias_mgr('&modo=10&id_usuario=:id_usuario')"; //el modo no existe, solo es para obtener un registro

        datos = await db.sequelize.query(query, {
            replacements: {
                id_usuario: req.userId,
            },
            plain: false,
            raw: true,
            type: QueryTypes.SELECT
        });
    } else {
        query = "SELECT * FROM s_categorias_mgr('" +
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

    Categorias.findOne({
            where: {
                id: req.body.id
            }
        })
        .then(categorias => {
            if (!categorias) {
                return res.status(404).send({ message: "Categorias Not found." });
            }

            res.status(200).send(categorias);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}



exports.getCatalogo = async(req, res) => {

    Categorias.findAll({
            attributes: ['id', 'clave', 'denominacion', [db.sequelize.literal("COALESCE(clave, '.') || ' - ' || COALESCE(denominacion, '.')"), "text"]],
            order: [
                ['clave', 'ASC'],
            ]
        }).then(categorias => {
            if (!categorias) {
                return res.status(404).send({ message: "Categorias Not found." });
            }

            res.status(200).send(categorias);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getCatalogoSegunPlantel = async(req, res) => {

    //Definir el valor a buscar segun el tipo de plantel
    let aplicaa = [3];
    if (req.body.tipoplantel == "A" || req.body.tipoplantel == "B" || req.body.tipoplantel == "C")
        aplicaa.push(2)
    else if (req.body.tipoplantel == "EMSAD")
        aplicaa.push(1)

    Categorias.findAll({
            attributes: ['id', 'clave', 'denominacion', 'id_cattipocategoria', [db.sequelize.literal("COALESCE(clave, '.') || ' - ' || COALESCE(denominacion, '.')"), "text"]],
            where: {
                aplicaa: aplicaa,
            },
            order: [
                ['clave', 'ASC'],
            ]
        }).then(categorias => {
            if (!categorias) {
                return res.status(404).send({ message: "Categorias Not found." });
            }

            res.status(200).send(categorias);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getRecordParaCombo = async(req, res) => {

    let query = "SELECT c.id, c.clave, c.denominacion, COALESCE(e.horasprogramadas::int,0) AS horasprogramadas, COALESCE(c.clave, '.') || ' - ' || COALESCE(c.denominacion, '.') AS text " +
        " FROM categorias as c " +
        " INNER JOIN ( " +
        "SELECT e->>'horasprogramadas' as horasprogramadas,e->>'cantidad' as asignadas,e->>'disponibles' as horasdisponibles " +
        "FROM json_array_elements(fn_horas_disponibles_encategoria( :id_plantel, :id_semestre, :id_categoria)) as e " +
        " ) AS e ON c.id=:id_categoria";
    
    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_categoria: req.body.id_categoria,
            id_plantel: 0,
            id_semestre: 0
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

exports.getCatalogoDisponibleEnPlantilla = async(req, res) => {

    let query = "SELECT cc.id AS id_cattipocategoria, c.id, c.clave, c.denominacion, fn_categorias_horasasignadas(c.id,0) AS horasprogramadas, COALESCE(c.clave, '.') || ' - ' || COALESCE(c.denominacion, '.') AS text " +
        ",fn_categorias_disponibles_plantillas_horas(:id_catplanteles, c.id, :id_plazas)->>'horas_disponiblesA' AS horas " +
        ",fn_categorias_disponibles_plantillas_horas(:id_catplanteles, c.id, :id_plazas)->>'horas_disponiblesB' AS horasb " +
        " FROM categorias as c " +
        " LEFT JOIN cattipocategoria as cc ON c.id_cattipocategoria=cc.id " +
        " WHERE  (cc.id_catplantillas=:id_catplantillas OR :id_catplantillas=0) " +
        "   AND ( " +
        "    case when cc.id=2 then " + //plnatilla de docentes
        "        (fn_categorias_disponibles_plantillas_horas(:id_catplanteles,c.id,:id_plazas)->>'horas_disponiblesT')::integer>0 " +
        "    else " +
        "        (fn_categorias_disponibles_plantillas(:id_catplanteles,c.id,:id_plazas)->>'plazas_disponibles')::integer>0 " +
        "   end " +
        "   ) " +
        " ORDER BY c.clave ";
    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_catplanteles: req.body.id_catplanteles,
            id_plazas: req.body.id_plazas, //cuando quiero desplegar tambien el de la plaza buscada
            id_catplantillas: req.body.id_catplantillas,
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

exports.getCatalogoVigenteEnPlantilla = async(req, res) => {

    let query = "SELECT DISTINCT c.id, c.clave, c.denominacion, fn_categorias_horasasignadas(c.id,0) AS horasprogramadas, COALESCE(c.clave, '.') || ' - ' || COALESCE(c.denominacion, '.') AS text " +
        "FROM categorias as c " +
        "     inner JOIN plantillasdocsnombramiento as pdn on pdn.id_categorias=c.id " +
        "     inner JOIN  plantillaspersonal AS a on a.id=pdn.id_plantillaspersonal  " +
        "WHERE  a.id=:id_catplantillas " +
        " AND (COALESCE(pdn.id_catquincena_fin,32767) = 32767 " +
        "     or COALESCE(pdn.id_catquincena_fin,0) = 0 " +
        "     or fn_nombramiento_estaactiva(pdn.id,'') = 1 " +
        ")  " +
        " AND pdn.state in ('A','B') ";
    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_catplantillas: req.body.id_catplantillas,
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

exports.getEstaEnTablaHomologadas = async(req, res) => {

    let query = "select fn_categoria_estaen_tablahomologada(:id_categorias)";
    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_categorias: req.body.id_categorias,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });

    res.status(200).send(datos[0].fn_categoria_estaen_tablahomologada.toString());
}

exports.getHorasprogramadas = async(req, res) => {

    let query = "select fn_categorias_horasasignadas(:id_categorias, 0)";
    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_categorias: req.body.id_categorias,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });

    res.status(200).send(datos[0].fn_categorias_horasasignadas.toString());
}

exports.getCatalogoDocentes = async(req, res) => {

    let query = "select c.id, c.clave, c.denominacion, COALESCE(c.clave, '.') || ' - ' || COALESCE(c.denominacion, '.') AS text " +
        " from categorias as c " +
        " where denominacion LIKE '%PROFESOR CB%' OR denominacion LIKE 'EMSAD%' " +
        " order by id";
    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_catplanteles: req.body.id_catplanteles,
            id_plazas: req.body.id_plazas, //cuando quiero desplegar tambien el de la plaza buscada
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
        if (key.indexOf("id_", 0) >= 0 || key.indexOf("aplicaa", 0) >= 0) {
            if (req.body.dataPack[key] != '')
                req.body.dataPack[key] = parseInt(req.body.dataPack[key]);
        }
    })

    /* revisar si existe la clave*/
    query ="";
    if(req.body.actionForm.toUpperCase() == "NUEVO" || req.body.actionForm.toUpperCase() == "EDITAR")
        query = "SELECT count(*) AS cuenta FROM categorias WHERE clave=:clave AND id<>:id AND state='A'";
    

    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            clave: req.body.dataPack["clave"].toString().trim(),
            id: req.body.dataPack["id"],
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });
    cuenta_registros = datos.length>0?datos[0].cuenta:0;
    

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        clave: { type: "string", max: 3,
            custom(value, errors) {
                if (cuenta_registros > 0) errors.push({ type: "unique" ,actual:value,field:"clave"})
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        denominacion: { type: "string", min: 5 },
        nivelsalarial: { type: "string", max: 5 },
        aplicaa: { type: "number" },
        id_cattipocategoria: {
            type: "number",
            custom(value, errors) {
                if (value <= 0) errors.push({ type: "selection" })
                return value; // Sanitize: remove all special chars except numbers
            }
        },
        id_tiponomina: {
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
    Categorias.findOne({
            where: {
                [Op.and]: [{ id: req.body.dataPack.id }, {
                    id: {
                        [Op.gt]: 0
                    }
                }],
            }
        })
        .then(categorias => {
            if (!categorias) {
                delete req.body.dataPack.id;
                delete req.body.dataPack.created_at;
                delete req.body.dataPack.updated_at;
                req.body.dataPack.id_usuarios_r = req.userId;
                req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

                Categorias.create(
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

                categorias.update(req.body.dataPack).then((self) => {
                    // here self is your instance, but updated
                    res.status(200).send({ message: "success", id: self.id });
                }).catch(err => {
                    res.status(200).send({ error: true, message: [err.errors[0].message] });
                });
            }


        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
        
}