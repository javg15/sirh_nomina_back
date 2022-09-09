const { authJwt } = require("../middleware");
const controller = require("../controllers/categorias.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/categorias/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
    app.post(
        "/api/categorias/getHorasprogramadas", [authJwt.verifyToken],
        controller.getHorasprogramadas
    );
    app.post(
        "/api/categorias/getEstaEnTablaHomologadas", [authJwt.verifyToken],
        controller.getEstaEnTablaHomologadas
    );
    app.post(
        "/api/categorias/getRecordParaCombo", [authJwt.verifyToken],
        controller.getRecordParaCombo
    );
    app.post(
        "/api/categorias/getCatalogoSegunPlantel", [authJwt.verifyToken],
        controller.getCatalogoSegunPlantel
    );
    app.post(
        "/api/categorias/getCatalogoDisponibleEnPlantilla", [authJwt.verifyToken],
        controller.getCatalogoDisponibleEnPlantilla
    );
    app.post(
        "/api/categorias/getCatalogoVigenteEnPlantilla", [authJwt.verifyToken],
        controller.getCatalogoVigenteEnPlantilla
    );

    app.post(
        "/api/categorias/getCatalogoDocentes", [authJwt.verifyToken],
        controller.getCatalogoDocentes
    );

    app.post(
        "/api/categorias/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/categorias/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
    app.post(
        "/api/categorias/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
};