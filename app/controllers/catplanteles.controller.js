const db = require("../models");
const { Op } = require("sequelize");
const mensajesValidacion = require("../config/validate.config");
const globales = require("../config/global.config");
const Catplanteles = db.catplanteles;

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
        query = "SELECT * FROM s_catplanteles_mgr('&modo=10&id_usuario=:id_usuario')"; //el modo no existe, solo es para obtener un registro

        datos = await db.sequelize.query(query, {
            replacements: {
                id_usuario: req.userId,
            },
            plain: false,
            raw: true,
            type: QueryTypes.SELECT
        });
    } else {
        query = "SELECT * FROM s_catplanteles_mgr('" +
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

    Catplanteles.findOne({
            where: {
                id: req.body.id
            }
        })
        .then(catplanteles => {
            if (!catplanteles) {
                return res.status(404).send({ message: "Catplanteles Not found." });
            }

            res.status(200).send(catplanteles);
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
    })

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        clave: { type: "string", max: 3 },
        ubicacion: { type: "string", min: 5 },
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
    Catplanteles.findOne({
            where: {
                [Op.and]: [{ id: req.body.dataPack.id }, {
                    id: {
                        [Op.gt]: 0
                    }
                }],
            }
        })
        .then(catplanteles => {
            if (!catplanteles) {
                delete req.body.dataPack.id;
                delete req.body.dataPack.created_at;
                delete req.body.dataPack.updated_at;
                req.body.dataPack.id_usuarios_r = req.userId;
                req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

                Catplanteles.create(
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

                catplanteles.update(req.body.dataPack).then((self) => {
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
    })

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        email: {
            type: "email",
            custom(value, errors, schema) {
                if (req.body.campoEdit == "email") {
                    if (value == null)
                        errors.push({ type: "stringMin", expected: 10, actual: 0 });
                    else {
                        if (value.length < 10) {
                            errors.push({ type: "stringMin", expected: 10, actual: value.length });
                        }
                    }
                }
                return value
            }
        },
        telefono: {
            type: "string",
            custom(value, errors, schema) {
                if (req.body.campoEdit == "telefono") {
                    if (value == null)
                        errors.push({ type: "stringMin", expected: 10, actual: 0 });
                    else {
                        if (value.length != 10) {
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
    Catplanteles.findOne({
            where: {
                [Op.and]: [{ id: req.body.dataPack.id }, {
                    id: {
                        [Op.gt]: 0
                    }
                }],
            }
        })
        .then(catplanteles => {
            if (!catplanteles) {
                res.status(500).send({ message: "No existe el plantel" });
            } else {
                let plantelEdit = new Catplanteles();
                plantelEdit.id = req.body.dataPack.id;
                plantelEdit.id_usuarios_r = req.userId;
                plantelEdit.telefono = req.body.dataPack.telefono;
                plantelEdit.email = req.body.dataPack.email;

                catplanteles.update(req.body.dataPack).then((self) => {
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
    //obtener las zonas permitidas
    let query = "select aa->>'zonasgeograficas' AS zonas from fn_permisos_usuario(:id_usuario,'')as aa";
    //    + " --AND (COALESCE(pdn.id_catquincena_fin,32767) = 32767  or COALESCE(pdn.id_catquincena_fin,0) = 0 )  "    
    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_usuario: req.body.id_usuario,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });
    query = 'select id, descripcion, ubicacion, clave, tipoplantel, clave || \' - \' || ubicacion AS "text" ' +
        'FROM catplanteles ' +
        'WHERE id_catzonageografica IN(' + datos[0].zonas + ') AND state IN (\'A\') ' +
        'ORDER BY clave ';
    //    + " --AND (COALESCE(pdn.id_catquincena_fin,32767) = 32767  or COALESCE(pdn.id_catquincena_fin,0) = 0 )  "    
    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {

        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });

    res.status(200).send(datos);

    /*Catplanteles.findAll({
            attributes: ['id', 'descripcion', 'ubicacion', 'clave', 'tipoplantel', [db.sequelize.literal("clave || ' - ' || ubicacion"), "text"]],
            order: [
                ['clave', 'ASC'],
            ]
        }).then(catplanteles => {
            if (!catplanteles) {
                return res.status(404).send({ message: "Catplanteles Not found." });
            }

            res.status(200).send(catplanteles);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });*/
}

exports.getCatalogoSinAdmin = async(req, res) => {
    //retornar las zonas geograficas permitidas
    let query = "SELECT * FROM fn_plantel_catalogo_sinadmin(:id_usuario)";
    //    + " --AND (COALESCE(pdn.id_catquincena_fin,32767) = 32767  or COALESCE(pdn.id_catquincena_fin,0) = 0 )  "    
    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_usuario: req.body.id_usuario,
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


exports.getCatalogoSegunPersonal = async(req, res) => {


    let query = "select distinct c.id,fn_idesc_plantel(c.id) as text,p.id as id_plaza " +
        "from catplanteles as c " +
        "    left join plazas as p on c.id = p.id_catplanteles " +
        "    left join categorias as ca on p.id_categorias = ca.id " +
        "   left join plantillasdocsnombramiento as pn on p.id = pn.id_plazas  " +
        "   left join plantillaspersonal as pp on pp.id = pn.id_plantillaspersonal  " +
        "   left join catestatusplaza as ce on ce.id = p.id_catestatusplaza  " +
        "where pp.id_personal = :id_personal " +
        "   and ce.esnombramiento = 1 " +
        "   and ce.state in ('A','B') " +
        "   and pn.state in ('A','B') " +
        "   and pp.state in ('A','B')";

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

    res.status(200).send(datos);
}

exports.getCatalogoOpen = async(req, res) => {
    //retornar las zonas geograficas permitidas
    let query = "SELECT pl.id,CONCAT(pl.clave, '-',pl.ubicacion) as text,pl.latitud,pl.longitud" +
        ",zg.clave as clave_zona, pl.clave as clave_plantel, pl.ubicacion, pl.tipoplantel, m.descripcion as municipio" +
        ",q.anio AS aniocreacion, pl.clavectse, pl.telefono, pl.email,pl.id_catzonageografica " +
        ",fn_nombramientos_enplantel(pl.id) as directivos " +
        "     FROM catplanteles AS pl " +
        "       LEFT JOIN catzonageografica AS zg ON pl.id_catzonageografica = zg.id" +
        "       LEFT JOIN catmunicipios AS m ON pl.id_catmunicipios=m.id " +
        "       LEFT JOIN catquincena AS q ON pl.aniocreacion=q.id " +
        "     WHERE coalesce(pl.latitud,'')<>'' " +
        "       AND (pl.id_catzonageografica=:id_catzonageografica OR coalesce(:id_catzonageografica,0)=0) " +
        "       AND (pl.id=:id_catplanteles OR coalesce(:id_catplanteles,0)=0) " +
        "     ORDER BY CONCAT(pl.clave, '-',pl.ubicacion) ";
    //    + " --AND (COALESCE(pdn.id_catquincena_fin,32767) = 32767  or COALESCE(pdn.id_catquincena_fin,0) = 0 )  "    
    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_catzonageografica: req.body.id_catzonageografica,
            id_catplanteles: req.body.id_catplanteles
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